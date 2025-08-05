import React, { createContext, useContext, ReactNode, useEffect } from 'react'
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
  initializePlayer: (walletAddress: string) => void
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

  // Initialize player when wallet connects
  initializePlayer: (walletAddress: string) => {
    const existingPlayer = get().player
    
    if (!existingPlayer) {
      // Create new player
      const newPlayer: Player = {
        id: generateId(),
        walletAddress,
        name: `Alchemist ${walletAddress.slice(0, 6)}`,
        level: 1,
        experience: 0,
        experienceToNext: 100,
        traits: [
          {
            id: generateId(),
            type: 'fire_master',
            name: 'Fire Master',
            description: 'Increased success rate with fire element crafting',
            level: 1,
            maxLevel: 10,
            bonus: 5,
            requirements: []
          },
          {
            id: generateId(),
            type: 'water_sage',
            name: 'Water Sage',
            description: 'Increased success rate with water element crafting',
            level: 1,
            maxLevel: 10,
            bonus: 5,
            requirements: []
          },
          {
            id: generateId(),
            type: 'earth_guardian',
            name: 'Earth Guardian',
            description: 'Increased success rate with earth element crafting',
            level: 1,
            maxLevel: 10,
            bonus: 5,
            requirements: []
          },
          {
            id: generateId(),
            type: 'air_walker',
            name: 'Air Walker',
            description: 'Increased success rate with air element crafting',
            level: 1,
            maxLevel: 10,
            bonus: 5,
            requirements: []
          }
        ],
        artifacts: [],
        missions: [
          {
            id: generateId(),
            type: 'daily_crafting',
            title: 'First Steps',
            description: 'Craft your first artifact',
            requirements: ['craft_artifact'],
            rewards: { xp: 50, artifacts: [], traits: [] },
            progress: 0,
            maxProgress: 1,
            completed: false
          }
        ],
        reputation: 0
      }
      
      set({ player: newPlayer })
      
      // Sync with Honeycomb
      get().syncWithHoneycomb()
    }
  },

  // Actions
  setPlayer: (player) => set({ player }),

  updatePlayer: (updates) => {
    const { player } = get()
    if (player) {
      const updatedPlayer = { ...player, ...updates }
      set({ player: updatedPlayer })
      
      // Save to localStorage
      localStorage.setItem(`player_${player.walletAddress}`, JSON.stringify(updatedPlayer))
    }
  },

  addArtifact: (artifact) => {
    const { player } = get()
    if (player) {
      const updatedPlayer = { 
        ...player, 
        artifacts: [...player.artifacts, artifact] 
      }
      set({ player: updatedPlayer })
      
      // Save to localStorage
      localStorage.setItem(`player_${player.walletAddress}`, JSON.stringify(updatedPlayer))
      
      // Add to marketplace for demo purposes
      const currentMarketplace = get().marketplace
      set({ marketplace: [...currentMarketplace, artifact] })
    }
  },

  removeArtifact: (artifactId) => {
    const { player } = get()
    if (player) {
      const updatedPlayer = { 
        ...player, 
        artifacts: player.artifacts.filter(a => a.id !== artifactId) 
      }
      set({ player: updatedPlayer })
      
      // Save to localStorage
      localStorage.setItem(`player_${player.walletAddress}`, JSON.stringify(updatedPlayer))
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
      
      // Update player experience
      const experienceGain = artifact.rarity === 'legendary' ? 100 :
                             artifact.rarity === 'epic' ? 50 :
                             artifact.rarity === 'rare' ? 25 :
                             artifact.rarity === 'uncommon' ? 10 : 5
      
      const newExperience = player.experience + experienceGain
      const newLevel = Math.floor(newExperience / 100) + 1
      const experienceToNext = newLevel * 100
      
      get().updatePlayer({
        experience: newExperience,
        level: newLevel,
        experienceToNext: experienceToNext
      })
      
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
      const updatedPlayer = {
        ...player,
        missions: player.missions.map(m => 
          m.id === missionId ? { ...m, ...updates } : m
        )
      }
      set({ player: updatedPlayer })
      
      // Save to localStorage
      localStorage.setItem(`player_${player.walletAddress}`, JSON.stringify(updatedPlayer))
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
      const updatedPlayer = {
        ...player,
        traits: player.traits.map(t => 
          t.id === traitId ? { ...t, ...updates } : t
        )
      }
      set({ player: updatedPlayer })
      
      // Save to localStorage
      localStorage.setItem(`player_${player.walletAddress}`, JSON.stringify(updatedPlayer))
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
  
  // Load player data from localStorage on mount
  useEffect(() => {
    const loadPlayerData = () => {
      const keys = Object.keys(localStorage)
      const playerKeys = keys.filter(key => key.startsWith('player_'))
      
      if (playerKeys.length > 0) {
        const playerData = JSON.parse(localStorage.getItem(playerKeys[0]) || '{}')
        if (playerData.walletAddress) {
          store.setPlayer(playerData)
        }
      }
    }
    
    loadPlayerData()
  }, [store])
  
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