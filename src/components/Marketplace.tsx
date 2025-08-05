import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Store, Sparkles, Filter, Search, Coins, Crown } from 'lucide-react'
import { useGame } from '@/stores/GameStore'
import { Artifact, RarityType } from '@/types'

const Marketplace: React.FC = () => {
  const { publicKey } = useWallet()
  const gameStore = useGame()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRarity, setFilterRarity] = useState<RarityType | 'all'>('all')
  const [sortBy, setSortBy] = useState<'power' | 'rarity' | 'date'>('date')

  if (!publicKey) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Store className="w-16 h-16 text-honeycomb-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect your Solana wallet to access the marketplace</p>
        </div>
      </div>
    )
  }

  // Get all artifacts from player inventory and marketplace
  const allArtifacts = [
    ...(gameStore.player?.artifacts || []),
    ...(gameStore.marketplace || [])
  ]

  // Filter and sort artifacts
  const filteredArtifacts = allArtifacts
    .filter(artifact => 
      artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterRarity === 'all' || artifact.rarity === filterRarity)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'power':
          return b.power - a.power
        case 'rarity':
          return rarityOrder[b.rarity] - rarityOrder[a.rarity]
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const rarityOrder: Record<RarityType, number> = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5
  }

  const rarityColors: Record<RarityType, string> = {
    common: 'text-gray-400',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-yellow-400'
  }

  const handleListArtifact = (artifact: Artifact) => {
    // Remove from player inventory and add to marketplace
    gameStore.removeArtifact(artifact.id)
    // In a real implementation, this would create a marketplace listing
    console.log('Listing artifact:', artifact.name)
  }

  const handleBuyArtifact = (artifact: Artifact) => {
    // Add to player inventory and remove from marketplace
    gameStore.addArtifact(artifact)
    // In a real implementation, this would handle payment and marketplace removal
    console.log('Buying artifact:', artifact.name)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-honeycomb-300/30 p-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <Store className="w-8 h-8 text-honeycomb-400 mr-3" />
          Artifact Marketplace
        </h1>
        <p className="text-gray-400 mb-8">Trade artifacts with other alchemists</p>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search artifacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-honeycomb-300/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-honeycomb-400"
              />
            </div>
          </div>
          
          <select
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value as RarityType | 'all')}
            className="px-4 py-2 bg-black/30 border border-honeycomb-300/30 rounded-lg text-white focus:outline-none focus:border-honeycomb-400"
          >
            <option value="all">All Rarities</option>
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'power' | 'rarity' | 'date')}
            className="px-4 py-2 bg-black/30 border border-honeycomb-300/30 rounded-lg text-white focus:outline-none focus:border-honeycomb-400"
          >
            <option value="date">Date</option>
            <option value="power">Power</option>
            <option value="rarity">Rarity</option>
          </select>
        </div>

        {/* Artifacts Grid */}
        {filteredArtifacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtifacts.map((artifact) => (
              <div
                key={artifact.id}
                className="bg-black/30 border border-honeycomb-300/30 rounded-lg p-4 hover:border-honeycomb-400 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{artifact.name}</h3>
                  <span className={`text-sm font-medium ${rarityColors[artifact.rarity]}`}>
                    {artifact.rarity.toUpperCase()}
                  </span>
                </div>
                
                <div className="mb-3">
                  <p className="text-gray-400 text-sm mb-2">{artifact.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">Power: {artifact.power}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {artifact.elements.map((element: string) => (
                      <span
                        key={element}
                        className="px-2 py-1 bg-honeycomb-400/20 text-honeycomb-400 text-xs rounded"
                      >
                        {element}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">
                      {artifact.rarity === 'legendary' ? '1000' : 
                       artifact.rarity === 'epic' ? '500' :
                       artifact.rarity === 'rare' ? '200' :
                       artifact.rarity === 'uncommon' ? '50' : '10'} SOL
                    </span>
                  </div>
                  
                  {gameStore.player?.artifacts.some((a: Artifact) => a.id === artifact.id) ? (
                    <button
                      onClick={() => handleListArtifact(artifact)}
                      className="px-3 py-1 bg-honeycomb-400 text-black text-sm font-medium rounded hover:bg-honeycomb-300 transition-colors"
                    >
                      List for Sale
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuyArtifact(artifact)}
                      className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-500 transition-colors"
                    >
                      Buy
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Artifacts Found</h3>
            <p className="text-gray-400">
              {searchTerm || filterRarity !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start crafting artifacts in the Laboratory to see them here!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Marketplace 