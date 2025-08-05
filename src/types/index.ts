// Element types for crafting
export type ElementType = 'fire' | 'water' | 'earth' | 'air'

// Artifact rarity levels
export type RarityType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

// Player traits
export type TraitType = 
  | 'fire_master' 
  | 'water_sage' 
  | 'earth_guardian' 
  | 'air_walker'
  | 'crafting_efficiency'
  | 'artifact_affinity'
  | 'trading_expert'

// Mission types
export type MissionType = 
  | 'daily_crafting'
  | 'specialization_quest'
  | 'guild_mission'
  | 'seasonal_event'

// Element interface
export interface Element {
  id: string
  type: ElementType
  name: string
  description: string
  power: number
  color: string
  icon: string
}

// Artifact interface
export interface Artifact {
  id: string
  name: string
  description: string
  rarity: RarityType
  power: number
  elements: ElementType[]
  traits: string[]
  image: string
  createdAt: Date
  owner: string
  honeycombMissionId?: string
}

// Player trait interface
export interface PlayerTrait {
  id: string
  type: TraitType
  name: string
  description: string
  level: number
  maxLevel: number
  bonus: number
  requirements: string[]
  honeycombTraitId?: string
}

// Mission interface
export interface Mission {
  id: string
  type: MissionType
  title: string
  description: string
  requirements: string[]
  rewards: {
    xp: number
    artifacts?: string[]
    traits?: string[]
  }
  progress: number
  maxProgress: number
  completed: boolean
  honeycombMissionId?: string
  expiresAt?: Date
}

// Player interface
export interface Player {
  id: string
  walletAddress: string
  name: string
  level: number
  experience: number
  experienceToNext: number
  traits: PlayerTrait[]
  artifacts: Artifact[]
  missions: Mission[]
  reputation: number
  guildId?: string
  honeycombPlayerId?: string
}

// Crafting recipe interface
export interface CraftingRecipe {
  id: string
  name: string
  description: string
  elements: ElementType[]
  difficulty: number
  successRate: number
  artifact: Partial<Artifact>
  requiredTraits?: TraitType[]
  honeycombMissionId?: string
}

// Guild interface
export interface Guild {
  id: string
  name: string
  description: string
  members: string[]
  leader: string
  reputation: number
  missions: Mission[]
  honeycombGuildId?: string
}

// Game state interface
export interface GameState {
  player: Player | null
  currentMission: Mission | null
  craftingInProgress: boolean
  selectedElements: ElementType[]
  availableRecipes: CraftingRecipe[]
  leaderboard: Player[]
  marketplace: Artifact[]
  notifications: Notification[]
}

// Notification interface
export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

// Honeycomb integration types
export interface HoneycombMission {
  id: string
  title: string
  description: string
  missionType: string
  requirements: any[]
  rewards: any[]
  status: 'active' | 'completed' | 'failed'
  progress: number
  maxProgress: number
  createdAt: Date
  completedAt?: Date
}

export interface HoneycombTrait {
  id: string
  name: string
  description: string
  traitType: string
  level: number
  maxLevel: number
  metadata: any
}

export interface HoneycombPlayer {
  id: string
  walletAddress: string
  traits: HoneycombTrait[]
  missions: HoneycombMission[]
  reputation: number
  metadata: any
} 