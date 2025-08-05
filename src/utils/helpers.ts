// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Calculate success rate based on elements and player traits
export const calculateSuccessRate = (
  elements: string[],
  playerTraits: any[],
  baseRate: number = 0.5
): number => {
  let successRate = baseRate
  
  // Element combination bonuses
  const elementCombos = {
    'fire,water': 0.1,
    'earth,air': 0.1,
    'fire,earth': 0.15,
    'water,air': 0.15,
    'fire,air': 0.05,
    'water,earth': 0.05
  }
  
  const elementKey = elements.sort().join(',')
  if (elementCombos[elementKey as keyof typeof elementCombos]) {
    successRate += elementCombos[elementKey as keyof typeof elementCombos]
  }
  
  // Trait bonuses
  playerTraits.forEach(trait => {
    if (trait.type.includes('crafting_efficiency')) {
      successRate += trait.bonus * 0.01
    }
  })
  
  return Math.min(successRate, 0.95) // Cap at 95%
}

// Calculate artifact power based on elements and rarity
export const calculateArtifactPower = (
  elements: string[],
  rarity: string,
  playerTraits: any[] = []
): number => {
  let power = elements.length * 10 // Base power
  
  // Rarity multipliers
  const rarityMultipliers = {
    common: 1,
    uncommon: 1.5,
    rare: 2.5,
    epic: 4,
    legendary: 6
  }
  
  power *= rarityMultipliers[rarity as keyof typeof rarityMultipliers]
  
  // Trait bonuses
  playerTraits.forEach(trait => {
    if (trait.type.includes('artifact_affinity')) {
      power += trait.bonus
    }
  })
  
  return Math.floor(power)
}

// Determine artifact rarity based on elements and success
export const determineRarity = (
  elements: string[],
  successRate: number,
  playerTraits: any[] = []
): string => {
  let rarityScore = 0
  
  // Element count bonus
  rarityScore += elements.length * 0.2
  
  // Success rate bonus
  rarityScore += successRate * 0.3
  
  // Trait bonuses
  playerTraits.forEach(trait => {
    if (trait.type.includes('artifact_affinity')) {
      rarityScore += 0.1
    }
  })
  
  // Determine rarity
  if (rarityScore >= 2.5) return 'legendary'
  if (rarityScore >= 2.0) return 'epic'
  if (rarityScore >= 1.5) return 'rare'
  if (rarityScore >= 1.0) return 'uncommon'
  return 'common'
}

// Generate artifact name based on elements
export const generateArtifactName = (elements: string[]): string => {
  const prefixes = {
    fire: ['Burning', 'Flaming', 'Infernal'],
    water: ['Flowing', 'Aquatic', 'Oceanic'],
    earth: ['Solid', 'Earthen', 'Mountainous'],
    air: ['Swift', 'Aerial', 'Windborne']
  }
  
  const suffixes = {
    fire: ['Blade', 'Orb', 'Crystal'],
    water: ['Pearl', 'Gem', 'Shard'],
    earth: ['Stone', 'Relic', 'Fragment'],
    air: ['Feather', 'Essence', 'Spirit']
  }
  
  const primaryElement = elements[0]
  const prefix = prefixes[primaryElement as keyof typeof prefixes]?.[Math.floor(Math.random() * 3)] || 'Mystic'
  const suffix = suffixes[primaryElement as keyof typeof suffixes]?.[Math.floor(Math.random() * 3)] || 'Artifact'
  
  return `${prefix} ${suffix}`
}

// Calculate experience needed for next level
export const calculateExperienceToNext = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

// Check if player can level up
export const canLevelUp = (experience: number, level: number): boolean => {
  return experience >= calculateExperienceToNext(level)
}

// Calculate new level based on experience
export const calculateLevel = (experience: number): number => {
  let level = 1
  let expNeeded = calculateExperienceToNext(level)
  
  while (experience >= expNeeded) {
    experience -= expNeeded
    level++
    expNeeded = calculateExperienceToNext(level)
  }
  
  return level
}

// Format large numbers
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Format time duration
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
} 