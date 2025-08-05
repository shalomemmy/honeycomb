// Core Game Types
export type ElementType = 'fire' | 'water' | 'earth' | 'air' | 'light' | 'dark' | 'void'
export type RarityType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
export type TraitType = 
  | 'fire_master' | 'water_sage' | 'earth_guardian' | 'air_walker'
  | 'light_bringer' | 'dark_walker' | 'void_traveler'
  | 'combat_expert' | 'crafting_master' | 'exploration_sage'
  | 'honeycomb_attuned' | 'blockchain_native' | 'protocol_expert'
export type MissionType = 'daily' | 'weekly' | 'achievement' | 'story' | 'guild' | 'competitive'
export type SkillType = 'combat' | 'crafting' | 'exploration' | 'social' | 'blockchain'
export type BiomeType = 'forest' | 'desert' | 'mountain' | 'ocean' | 'void' | 'honeycomb_realm'

// 3D World Types
export interface Vector3 {
  x: number
  y: number
  z: number
}

export interface WorldPosition {
  x: number
  y: number
  z: number
  biome: BiomeType
  chunkId: string
}

export interface Chunk {
  id: string
  position: Vector3
  biome: BiomeType
  entities: Entity[]
  structures: Structure[]
  resources: Resource[]
}

// Entity System
export interface Entity {
  id: string
  type: 'player' | 'npc' | 'enemy' | 'creature' | 'structure'
  position: WorldPosition
  health: number
  maxHealth: number
  level: number
  experience: number
  skills: Skill[]
  traits: Trait[]
  inventory: Item[]
  equipment: Equipment
  stats: EntityStats
  honeycombData?: HoneycombEntity
}

export interface EntityStats {
  strength: number
  agility: number
  intelligence: number
  wisdom: number
  charisma: number
  blockchain: number
}

export interface Equipment {
  weapon?: Item
  armor?: Item
  accessory?: Item
  honeycomb?: Item
}

// Item System
export interface Item {
  id: string
  name: string
  description: string
  type: 'weapon' | 'armor' | 'consumable' | 'material' | 'artifact' | 'honeycomb'
  rarity: RarityType
  level: number
  power: number
  elements: ElementType[]
  effects: ItemEffect[]
  honeycombMissionId?: string
  honeycombTraitId?: string
  metadata: ItemMetadata
}

export interface ItemEffect {
  type: 'stat_boost' | 'elemental_resistance' | 'skill_bonus' | 'honeycomb_attunement'
  target: string
  value: number
  duration?: number
}

export interface ItemMetadata {
  craftedBy?: string
  craftedAt?: Date
  honeycombVerified: boolean
  blockchainTx?: string
  rarityScore: number
  elementalAffinity: ElementType[]
}

// Skill System
export interface Skill {
  id: string
  name: string
  description: string
  type: SkillType
  level: number
  maxLevel: number
  experience: number
  experienceToNext: number
  effects: SkillEffect[]
  requirements: SkillRequirement[]
  honeycombTraitId?: string
}

export interface SkillEffect {
  type: 'damage_boost' | 'success_rate' | 'resource_gain' | 'honeycomb_attunement'
  value: number
  condition?: string
}

export interface SkillRequirement {
  type: 'level' | 'skill' | 'trait' | 'item' | 'honeycomb_mission'
  target: string
  value: number
}

// Trait System
export interface Trait {
  id: string
  type: TraitType
  name: string
  description: string
  level: number
  maxLevel: number
  experience: number
  experienceToNext: number
  effects: TraitEffect[]
  requirements: TraitRequirement[]
  honeycombTraitId?: string
  evolutionPath?: TraitEvolution[]
}

export interface TraitEffect {
  type: 'stat_boost' | 'skill_bonus' | 'elemental_affinity' | 'honeycomb_attunement'
  target: string
  value: number
  condition?: string
}

export interface TraitRequirement {
  type: 'level' | 'skill' | 'trait' | 'mission' | 'honeycomb_verification'
  target: string
  value: number
}

export interface TraitEvolution {
  id: string
  name: string
  description: string
  requirements: TraitRequirement[]
  effects: TraitEffect[]
}

// Mission System
export interface Mission {
  id: string
  type: MissionType
  title: string
  description: string
  requirements: MissionRequirement[]
  rewards: MissionReward[]
  progress: number
  maxProgress: number
  completed: boolean
  timeLimit?: number
  honeycombMissionId?: string
  guildId?: string
  difficulty: 'easy' | 'medium' | 'hard' | 'epic' | 'legendary'
}

export interface MissionRequirement {
  type: 'kill_enemy' | 'craft_item' | 'explore_area' | 'complete_mission' | 'honeycomb_verification'
  target: string
  value: number
  current: number
}

export interface MissionReward {
  type: 'experience' | 'item' | 'trait' | 'skill' | 'honeycomb_attunement'
  target: string
  value: number
}

// Player System
export interface Player extends Entity {
  walletAddress: string
  name: string
  avatar: string
  guild?: Guild
  reputation: number
  honeycombReputation: number
  missions: Mission[]
  achievements: Achievement[]
  honeycombPlayerId?: string
  lastActive: Date
  totalPlayTime: number
  blockchainInteractions: number
}

export interface Guild {
  id: string
  name: string
  description: string
  level: number
  experience: number
  members: Player[]
  missions: Mission[]
  treasury: Item[]
  honeycombGuildId?: string
}

// Achievement System
export interface Achievement {
  id: string
  name: string
  description: string
  type: 'combat' | 'crafting' | 'exploration' | 'social' | 'blockchain'
  completed: boolean
  completedAt?: Date
  honeycombAchievementId?: string
}

// World System
export interface Structure {
  id: string
  type: 'crafting_station' | 'trading_post' | 'guild_hall' | 'honeycomb_shrine'
  position: WorldPosition
  level: number
  owner?: string
  honeycombStructureId?: string
}

export interface Resource {
  id: string
  type: 'ore' | 'herb' | 'crystal' | 'honeycomb_fragment'
  position: WorldPosition
  quantity: number
  respawnTime: number
  honeycombResourceId?: string
}

// Honeycomb Protocol Integration
export interface HoneycombEntity {
  id: string
  walletAddress: string
  missions: HoneycombMission[]
  traits: HoneycombTrait[]
  reputation: number
  verificationLevel: number
  lastSync: Date
}

export interface HoneycombMission {
  id: string
  title: string
  description: string
  missionType: string
  requirements: any[]
  rewards: any[]
  completed: boolean
  completedAt?: Date
  blockchainTx?: string
}

export interface HoneycombTrait {
  id: string
  traitType: string
  name: string
  description: string
  level: number
  maxLevel: number
  effects: any[]
  blockchainTx?: string
}

export interface HoneycombPlayer {
  id: string
  walletAddress: string
  missions: HoneycombMission[]
  traits: HoneycombTrait[]
  reputation: number
  verificationLevel: number
  lastSync: Date
}

// Game State
export interface GameState {
  player: Player | null
  world: WorldState
  ui: UIState
  combat: CombatState
  crafting: CraftingState
  honeycomb: HoneycombState
}

export interface WorldState {
  currentChunk: Chunk | null
  loadedChunks: Chunk[]
  entities: Entity[]
  structures: Structure[]
  resources: Resource[]
  time: number
  weather: string
}

export interface UIState {
  currentScreen: 'main_menu' | 'game' | 'inventory' | 'skills' | 'missions' | 'guild' | 'honeycomb'
  notifications: Notification[]
  modals: Modal[]
  tooltips: Tooltip[]
}

export interface CombatState {
  inCombat: boolean
  currentEnemy: Entity | null
  turn: number
  actions: CombatAction[]
}

export interface CraftingState {
  isCrafting: boolean
  selectedRecipe: CraftingRecipe | null
  progress: number
  ingredients: Item[]
}

export interface HoneycombState {
  connected: boolean
  missions: HoneycombMission[]
  traits: HoneycombTrait[]
  reputation: number
  lastSync: Date
}

// UI Components
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  honeycombVerified?: boolean
}

export interface Modal {
  id: string
  type: string
  data: any
  visible: boolean
}

export interface Tooltip {
  id: string
  content: string
  position: Vector3
  visible: boolean
}

// Combat System
export interface CombatAction {
  id: string
  type: 'attack' | 'skill' | 'item' | 'honeycomb_ability'
  target: Entity
  damage: number
  effects: CombatEffect[]
  honeycombVerified?: boolean
}

export interface CombatEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'honeycomb_attunement'
  value: number
  duration: number
}

// Crafting System
export interface CraftingRecipe {
  id: string
  name: string
  description: string
  ingredients: CraftingIngredient[]
  result: Item
  skillRequired: SkillType
  skillLevel: number
  honeycombMissionId?: string
  successRate: number
}

export interface CraftingIngredient {
  item: Item
  quantity: number
  optional: boolean
}

// Game Configuration
export interface GameConfig {
  worldSize: number
  chunkSize: number
  maxEntities: number
  honeycombSyncInterval: number
  blockchainConfirmations: number
}

// Blockchain Integration
export interface BlockchainTransaction {
  id: string
  type: 'mission_complete' | 'trait_evolution' | 'item_craft' | 'honeycomb_verification'
  data: any
  status: 'pending' | 'confirmed' | 'failed'
  txHash?: string
  blockNumber?: number
  timestamp: Date
} 