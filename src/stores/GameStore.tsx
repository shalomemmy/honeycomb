import React, { createContext, useContext, ReactNode, useEffect } from 'react'
import { create } from 'zustand'
import { 
  GameState, 
  Player, 
  Mission, 
  Item, 
  Skill,
  Trait,
  Entity,
  WorldState,
  UIState,
  CombatState,
  CraftingState,
  HoneycombState,
  Notification,
  WorldPosition,
  BiomeType
} from '@/types'
import { honeycombService } from '@/services/honeycombService'
import { generateId } from '@/utils/helpers'

interface GameStore extends GameState {
  // Player Actions
  initializePlayer: (walletAddress: string) => void
  updatePlayer: (updates: Partial<Player>) => void
  setPlayer: (player: Player) => void
  movePlayer: (position: WorldPosition) => void
  addExperience: (amount: number) => void
  levelUp: () => void
  
  // Inventory Actions
  addItem: (item: Item) => void
  removeItem: (itemId: string) => void
  equipItem: (itemId: string, slot: string) => void
  unequipItem: (slot: string) => void
  
  // Mission Actions
  startMission: (missionId: string) => void
  updateMissionProgress: (missionId: string, progress: number) => void
  completeMission: (missionId: string) => void
  
  // Combat Actions
  startCombat: (enemy: Entity) => void
  performAction: (action: any) => void
  endCombat: () => void
  
  // UI Actions
  setCurrentScreen: (screen: UIState['currentScreen']) => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (notificationId: string) => void
  clearNotifications: () => void
  
  // Honeycomb Actions
  syncWithHoneycomb: () => Promise<void>
  verifyOnChainAction: (action: string, data: any) => Promise<boolean>
  createHoneycombMission: (missionData: any) => Promise<any>
}

const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  player: null,
  world: {
    currentChunk: null,
    loadedChunks: [],
    entities: [],
    structures: [],
    resources: [],
    time: 0,
    weather: 'clear'
  },
  ui: {
    currentScreen: 'main_menu',
    notifications: [],
    modals: [],
    tooltips: []
  },
  combat: {
    inCombat: false,
    currentEnemy: null,
    turn: 0,
    actions: []
  },
  crafting: {
    isCrafting: false,
    selectedRecipe: null,
    progress: 0,
    ingredients: []
  },
  honeycomb: {
    connected: false,
    missions: [],
    traits: [],
    reputation: 0,
    lastSync: new Date()
  },

  // Player Actions
  initializePlayer: (walletAddress: string) => {
    const existingPlayer = get().player
    
    if (!existingPlayer) {
      const newPlayer: Player = {
        id: generateId(),
        walletAddress,
        name: `Adventurer ${walletAddress.slice(0, 6)}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${walletAddress}`,
        position: {
          x: 0,
          y: 1,
          z: 0,
          biome: 'forest',
          chunkId: '0,0'
        },
        health: 100,
        maxHealth: 100,
        level: 1,
        experience: 0,
        experienceToNext: 100,
        stats: {
          strength: 10,
          agility: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
          blockchain: 10
        },
        skills: [
          {
            id: generateId(),
            name: 'Combat Mastery',
            description: 'Increases damage in combat',
            type: 'combat',
            level: 1,
            maxLevel: 20,
            experience: 0,
            experienceToNext: 100,
            effects: [{ type: 'damage_boost', value: 5, condition: 'in_combat', target: 'damage' }],
            requirements: []
          }
        ],
        traits: [
          {
            id: generateId(),
            type: 'honeycomb_attuned',
            name: 'Honeycomb Attuned',
            description: 'Enhanced connection to the Honeycomb Protocol',
            level: 1,
            maxLevel: 10,
            experience: 0,
            experienceToNext: 50,
            effects: [{ type: 'honeycomb_attunement', value: 10, condition: 'always', target: 'reputation' }],
            requirements: []
          }
        ],
        inventory: [],
        equipment: {},
        missions: [
          {
            id: generateId(),
            type: 'story',
            title: 'First Steps',
            description: 'Begin your journey in the Honeycomb Realm',
            requirements: [{ type: 'explore_area', target: 'forest', value: 1, current: 0 }],
            rewards: [{ type: 'experience', target: 'player', value: 50 }],
            progress: 0,
            maxProgress: 1,
            completed: false,
            difficulty: 'easy'
          }
        ],
        reputation: 0,
        honeycombReputation: 0,
        achievements: [],
        lastActive: new Date(),
        totalPlayTime: 0,
        blockchainInteractions: 0
      }
      
      set({ player: newPlayer })
      
      // Sync with Honeycomb
      get().syncWithHoneycomb()
    }
  },

  setPlayer: (player) => {
    set({ player })
  },

  updatePlayer: (updates) => {
    const { player } = get()
    if (player) {
      const updatedPlayer = { ...player, ...updates }
      console.log('Updating player:', updatedPlayer)
      set({ player: updatedPlayer })
      
      // Save to localStorage and trigger Honeycomb sync
      localStorage.setItem(`player_${player.walletAddress}`, JSON.stringify(updatedPlayer))
      
      // Sync with Honeycomb Protocol (real blockchain integration)
      get().syncWithHoneycomb()
    }
  },

  movePlayer: (position) => {
    const { player } = get()
    if (player) {
      get().updatePlayer({ position })
      
      // Check for mission progress
      player.missions.forEach(mission => {
        if (mission.requirements.some(req => req.type === 'explore_area' && req.target === position.biome)) {
          const requirement = mission.requirements.find(req => req.type === 'explore_area' && req.target === position.biome)
          if (requirement) {
            requirement.current = Math.min(requirement.current + 1, requirement.value)
            if (requirement.current >= requirement.value && !mission.completed) {
              get().completeMission(mission.id)
            }
          }
        }
      })
    }
  },

  addExperience: (amount) => {
    const { player } = get()
    if (player) {
      console.log(`🎯 Adding ${amount} XP to player. Current: ${player.experience}`)
      const newExperience = player.experience + amount
      get().updatePlayer({ experience: newExperience })
      
      // Check for level up
      if (newExperience >= player.experienceToNext) {
        console.log(`🎉 Level up! ${player.level} -> ${player.level + 1}`)
        get().levelUp()
      }
    }
  },

  levelUp: () => {
    const { player } = get()
    if (player) {
      const newLevel = player.level + 1
      const newExperienceToNext = newLevel * 100
      const remainingExperience = player.experience - player.experienceToNext
      
      get().updatePlayer({
        level: newLevel,
        experience: remainingExperience,
        experienceToNext: newExperienceToNext,
        maxHealth: player.maxHealth + 10,
        health: player.maxHealth + 10
      })
      
      // Add notification
      get().addNotification({
        type: 'success',
        title: 'Level Up!',
        message: `You reached level ${newLevel}!`
      })
    }
  },

  // Inventory Actions
  addItem: (item) => {
    const { player } = get()
    if (player) {
      const updatedPlayer = { 
        ...player, 
        inventory: [...player.inventory, item] 
      }
      set({ player: updatedPlayer })
      
      // Save to localStorage
      localStorage.setItem(`player_${player.walletAddress}`, JSON.stringify(updatedPlayer))
      
      // Add notification
      get().addNotification({
        type: 'success',
        title: 'Item Acquired',
        message: `You found ${item.name}!`
      })
    }
  },

  removeItem: (itemId) => {
    const { player } = get()
    if (player) {
      const updatedPlayer = { 
        ...player, 
        inventory: player.inventory.filter(item => item.id !== itemId) 
      }
      set({ player: updatedPlayer })
      
      // Save to localStorage
      localStorage.setItem(`player_${player.walletAddress}`, JSON.stringify(updatedPlayer))
    }
  },

  equipItem: (itemId, slot) => {
    const { player } = get()
    if (player) {
      const item = player.inventory.find(i => i.id === itemId)
      if (item) {
        const updatedPlayer = {
          ...player,
          equipment: { ...player.equipment, [slot]: item },
          inventory: player.inventory.filter(i => i.id !== itemId)
        }
        set({ player: updatedPlayer })
        
        // Save to localStorage
        localStorage.setItem(`player_${player.walletAddress}`, JSON.stringify(updatedPlayer))
      }
    }
  },

  unequipItem: (slot) => {
    const { player } = get()
    if (player && player.equipment[slot as keyof typeof player.equipment]) {
      const item = player.equipment[slot as keyof typeof player.equipment]
      if (item) {
        const updatedPlayer = {
          ...player,
          equipment: { ...player.equipment, [slot]: undefined },
          inventory: [...player.inventory, item]
        }
        set({ player: updatedPlayer })
        
        // Save to localStorage
        localStorage.setItem(`player_${player.walletAddress}`, JSON.stringify(updatedPlayer))
      }
    }
  },

  // Mission Actions
  startMission: (missionId) => {
    const { player } = get()
    if (player) {
      const mission = player.missions.find(m => m.id === missionId)
      if (mission && !mission.completed) {
        // Mission logic
      }
    }
  },

  updateMissionProgress: (missionId, progress) => {
    const { player } = get()
    if (player) {
      const mission = player.missions.find(m => m.id === missionId)
      if (mission) {
        const updatedMission = { ...mission, progress }
        const updatedPlayer = {
          ...player,
          missions: player.missions.map(m => m.id === missionId ? updatedMission : m)
        }
        set({ player: updatedPlayer })
      }
    }
  },

  completeMission: (missionId) => {
    const { player } = get()
    if (player) {
      const mission = player.missions.find(m => m.id === missionId)
      if (mission && !mission.completed) {
        const updatedMission = { ...mission, completed: true, progress: mission.maxProgress }
        const updatedPlayer = {
          ...player,
          missions: player.missions.map(m => m.id === missionId ? updatedMission : m)
        }
        set({ player: updatedPlayer })
        
        // Award rewards
        mission.rewards.forEach(reward => {
          if (reward.type === 'experience') {
            get().addExperience(reward.value)
          }
        })
        
        // Create Honeycomb mission
        get().createHoneycombMission({
          title: mission.title,
          description: mission.description,
          missionType: mission.type
        })
        
        // Add notification
        get().addNotification({
          type: 'success',
          title: 'Mission Complete!',
          message: `You completed ${mission.title}!`
        })
      }
    }
  },

  // Combat Actions
  startCombat: (enemy) => {
    set({
      combat: {
        inCombat: true,
        currentEnemy: enemy,
        turn: 1,
        actions: []
      }
    })
  },

  performAction: (action) => {
    const { combat } = get()
    if (combat.inCombat) {
      set({
        combat: {
          ...combat,
          actions: [...combat.actions, action],
          turn: combat.turn + 1
        }
      })
    }
  },

  endCombat: () => {
    set({
      combat: {
        inCombat: false,
        currentEnemy: null,
        turn: 0,
        actions: []
      }
    })
  },

  // UI Actions
  setCurrentScreen: (screen) => {
    const { ui } = get()
    set({
      ui: {
        ...ui,
        currentScreen: screen
      }
    })
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      id: generateId(),
      timestamp: new Date(),
      read: false,
      ...notification
    }
    
    const { ui } = get()
    set({
      ui: {
        ...ui,
        notifications: [newNotification, ...ui.notifications]
      }
    })
  },

  markNotificationRead: (notificationId) => {
    const { ui } = get()
    set({
      ui: {
        ...ui,
        notifications: ui.notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      }
    })
  },

  clearNotifications: () => {
    const { ui } = get()
    set({
      ui: {
        ...ui,
        notifications: []
      }
    })
  },

  // Honeycomb Actions
  syncWithHoneycomb: async () => {
    try {
      const { player } = get()
      if (!player?.walletAddress) return

      console.log('🍯 Syncing with Honeycomb Protocol...')
      
      // Create user profile if first time
      await honeycombService.createUserProfile(player.walletAddress)
      
      // Update player on Honeycomb Protocol (creates blockchain transaction)
      const updatedPlayer = await honeycombService.updatePlayer(player.walletAddress, {
        level: player.level,
        experience: player.experience,
        health: player.health,
        reputation: player.reputation,
        lastActive: new Date().toISOString()
      })

      if (updatedPlayer) {
        console.log('✅ Player updated on Honeycomb Protocol')
      }

      // Sync existing data including missions
      const honeycombEntity = await honeycombService.syncPlayerData(player)
      
      if (honeycombEntity) {
        set({
          honeycomb: {
            connected: true,
            missions: honeycombEntity.missions,
            traits: honeycombEntity.traits,
            reputation: honeycombEntity.reputation,
            lastSync: new Date()
          }
        })
      }
    } catch (error) {
      console.error('Failed to sync with Honeycomb:', error)
    }
  },

  // Create Honeycomb missions
  createHoneycombMission: async (missionData: any) => {
    try {
      console.log('🍯 Creating Honeycomb mission:', missionData)
      const mission = await honeycombService.createMission(missionData)
      
      if (mission) {
        console.log('✅ Honeycomb mission created:', mission.name)
        
        // Update game state with new mission
        const { gameState } = get()
        set({
          gameState: {
            ...gameState,
            missions: [...(gameState.missions || []), mission]
          }
        })
      }
      
      return mission
    } catch (error) {
      console.error('Failed to create Honeycomb mission:', error)
      return null
    }
  },

  // Start a Honeycomb mission
  startHoneycombMission: async (missionId: string) => {
    try {
      const { player } = get()
      if (!player?.walletAddress) return false
      
      console.log('🍯 Starting Honeycomb mission:', missionId)
      const success = await honeycombService.startMission(player.walletAddress, missionId)
      
      if (success) {
        console.log('✅ Honeycomb mission started successfully')
        
        // Add experience for starting the mission
        get().addExperience(25)
        
        // Show notification
        get().addNotification({
          id: `mission_start_${Date.now()}`,
          type: 'success',
          title: 'Mission Started!',
          message: 'Your character has begun the quest on Honeycomb Protocol',
          timestamp: new Date()
        })
      }
      
      return success
    } catch (error) {
      console.error('Failed to start Honeycomb mission:', error)
      return false
    }
  },

  verifyOnChainAction: async (action, data) => {
    try {
      return await honeycombService.verifyOnChainAction(action, data)
    } catch (error) {
      console.error('Failed to verify on-chain action:', error)
      return false
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
  }, []) // Empty dependency array - only run once on mount
  
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