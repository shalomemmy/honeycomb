import React, { createContext, useContext, ReactNode } from 'react'
import { create } from 'zustand'
import { 
  GameState, 
  Player, 
  Mission, 
  Artifact, 
  ElementType, 
  CraftingRecipe,
  Notification,
  PlayerTrait,
  HoneycombMission,
  HoneycombTrait
} from '@/types'
import { honeycombService } from '@/services/honeycombService'
import { generateId } from '@/utils/helpers'

interface GameStore extends GameState {
  // Actions
  setPlayer: (player: Player) => void
  updatePlayer: (updates: Partial<Player>) => void
  addArtifact: (artifact: Artifact) => void
  removeArtifact: (artifactId: string) => void
  selectElement: (element: ElementType) => void
  deselectElement: (element: ElementType) => void
  clearSelectedElements: () => void
  startCrafting: () => void
  completeCrafting: (success: boolean, artifact?: Artifact) => void
  updateMission: (missionId: string, updates: Partial<Mission>) => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (notificationId: string) => void
  clearNotifications: () => void
  updateTrait: (traitId: string, updates: Partial<PlayerTrait>) => void
  syncWithHoneycomb: () => Promise<void>
}

const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  player: null,
  currentMission: null,
  craftingInProgress: false,
  selectedElements: [],
  availableRecipes: [],
  leaderboard: [],
  marketplace: [],
  notifications: [],

  // Actions
  setPlayer: (player) => set({ player }),

  updatePlayer: (updates) => {
    const { player } = get()
    if (player) {
      set({ player: { ...player, ...updates } })
    }
  },

  addArtifact: (artifact) => {
    const { player } = get()
    if (player) {
      set({ 
        player: { 
          ...player, 
          artifacts: [...player.artifacts, artifact] 
        } 
      })
    }
  },

  removeArtifact: (artifactId) => {
    const { player } = get()
    if (player) {
      set({ 
        player: { 
          ...player, 
          artifacts: player.artifacts.filter(a => a.id !== artifactId) 
        } 
      })
    }
  },

  selectElement: (element) => {
    const { selectedElements } = get()
    if (!selectedElements.includes(element)) {
      set({ selectedElements: [...selectedElements, element] })
    }
  },

  deselectElement: (element) => {
    const { selectedElements } = get()
    set({ 
      selectedElements: selectedElements.filter(e => e !== element) 
    })
  },

  clearSelectedElements: () => set({ selectedElements: [] }),

  startCrafting: () => set({ craftingInProgress: true }),

  completeCrafting: async (success, artifact) => {
    const { player, currentMission } = get()
    
    if (success && artifact && player) {
      // Add artifact to player inventory
      get().addArtifact(artifact)
      
      // Update mission progress
      if (currentMission) {
        const updatedMission = {
          ...currentMission,
          progress: currentMission.progress + 1
        }
        
        if (updatedMission.progress >= updatedMission.maxProgress) {
          updatedMission.completed = true
          // Award XP and rewards
          get().updatePlayer({
            experience: player.experience + currentMission.rewards.xp
          })
        }
        
        get().updateMission(currentMission.id, updatedMission)
      }

      // Create Honeycomb mission
      try {
        const honeycombMission = await honeycombService.createMission({
          title: `Craft ${artifact.name}`,
          description: `Successfully crafted ${artifact.name} using ${artifact.elements.join(', ')} elements`,
          missionType: 'crafting',
          requirements: [],
          rewards: [{ type: 'artifact', value: artifact.id }]
        })
        
        // Update artifact with Honeycomb mission ID
        if (honeycombMission) {
          get().updatePlayer({
            artifacts: player.artifacts.map(a => 
              a.id === artifact.id 
                ? { ...a, honeycombMissionId: honeycombMission.id }
                : a
            )
          })
        }
      } catch (error) {
        console.error('Failed to create Honeycomb mission:', error)
      }
    }

    set({ craftingInProgress: false })
    
    // Add notification
    get().addNotification({
      type: success ? 'success' : 'error',
      title: success ? 'Crafting Successful!' : 'Crafting Failed',
      message: success 
        ? `You successfully crafted ${artifact?.name || 'an artifact'}!`
        : 'The elements didn\'t combine properly. Try again!'
    })
  },

  updateMission: (missionId, updates) => {
    const { player } = get()
    if (player) {
      set({
        player: {
          ...player,
          missions: player.missions.map(m => 
            m.id === missionId ? { ...m, ...updates } : m
          )
        }
      })
    }
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      id: generateId(),
      timestamp: new Date(),
      read: false,
      ...notification
    }
    
    set({ notifications: [newNotification, ...get().notifications] })
  },

  markNotificationRead: (notificationId) => {
    set({
      notifications: get().notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    })
  },

  clearNotifications: () => set({ notifications: [] }),

  updateTrait: (traitId, updates) => {
    const { player } = get()
    if (player) {
      set({
        player: {
          ...player,
          traits: player.traits.map(t => 
            t.id === traitId ? { ...t, ...updates } : t
          )
        }
      })
    }
  },

  syncWithHoneycomb: async () => {
    try {
      const { player } = get()
      if (!player?.walletAddress) return

      // Sync player data with Honeycomb
      const honeycombPlayer = await honeycombService.getPlayer(player.walletAddress)
      
      if (honeycombPlayer) {
        // Update player with Honeycomb data
        const updatedPlayer = {
          ...player,
          honeycombPlayerId: honeycombPlayer.id,
          traits: player.traits.map(trait => {
            const honeycombTrait = honeycombPlayer.traits.find(ht => ht.traitType === trait.type)
            return honeycombTrait ? { ...trait, honeycombTraitId: honeycombTrait.id } : trait
          }),
          missions: player.missions.map(mission => {
            const honeycombMission = honeycombPlayer.missions.find(hm => hm.title === mission.title)
            return honeycombMission ? { ...mission, honeycombMissionId: honeycombMission.id } : mission
          })
        }
        
        set({ player: updatedPlayer })
      }
    } catch (error) {
      console.error('Failed to sync with Honeycomb:', error)
    }
  }
}))

// Context for React components
const GameContext = createContext<ReturnType<typeof useGameStore> | null>(null)

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const store = useGameStore()
  return (
    <GameContext.Provider value={store}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = (): ReturnType<typeof useGameStore> => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
} 