import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Trophy, Sparkles, Crown, Medal, Target, Star, Users } from 'lucide-react'
import { useGame } from '@/stores/GameStore'

const Leaderboard: React.FC = () => {
  const { publicKey } = useWallet()
  const gameStore = useGame()
  const [category, setCategory] = useState<'level' | 'artifacts' | 'reputation' | 'missions'>('level')

  if (!publicKey) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-honeycomb-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect your Solana wallet to view the leaderboard</p>
        </div>
      </div>
    )
  }

  // Mock leaderboard data - in a real app, this would come from Honeycomb Protocol
  const leaderboardData = [
    {
      id: '1',
      name: 'Alchemist Supreme',
      walletAddress: '3aBhQfNM6veXkV9t7V7p3XFMZyZeApEGfMEsh5ZMUkw7',
      level: 25,
      artifacts: 47,
      reputation: 1250,
      missions: 23,
      avatar: '👑'
    },
    {
      id: '2',
      name: 'Elemental Master',
      walletAddress: '4bCiRG7NJ0lYKRg6r0ty4z_Xti1Ta9BTatTWunb01iXcnx2S8WerIdDg6DBg0KtToFYFHJ7ANBvo57Fixy',
      level: 22,
      artifacts: 38,
      reputation: 1100,
      missions: 20,
      avatar: '⚡'
    },
    {
      id: '3',
      name: 'Crafting Legend',
      walletAddress: '5dDjSH8OK1mZLSh7s1uz5a_Yuj2Ub0Cg0vDg7Dc12jYdnx3T9XfJeEh7ECg1LtUpGIK8ANBvo57Fixy',
      level: 20,
      artifacts: 35,
      reputation: 980,
      missions: 18,
      avatar: '🔮'
    },
    {
      id: '4',
      name: 'Honeycomb Hunter',
      walletAddress: '6eEkTI9PL2nAMTh8t2v6b_Bvk3Vc1Dh1wEh8Ed13kZaeoy4U0YgKfFi8FDg2MuVqHjL9BOBvo57Fixy',
      level: 18,
      artifacts: 32,
      reputation: 850,
      missions: 16,
      avatar: '🍯'
    },
    {
      id: '5',
      name: 'Artifact Collector',
      walletAddress: '7fFlUJ0QM3oBNUi9u3w7c_Cwl4Wd2Ei2xFi9Fe24lAbfpz5V1ZhLgGj9GEg3NvWrIkM0CPCvo57Fixy',
      level: 16,
      artifacts: 28,
      reputation: 720,
      missions: 14,
      avatar: '💎'
    }
  ]

  const getSortedData = () => {
    return [...leaderboardData].sort((a, b) => {
      switch (category) {
        case 'level':
          return b.level - a.level
        case 'artifacts':
          return b.artifacts - a.artifacts
        case 'reputation':
          return b.reputation - a.reputation
        case 'missions':
          return b.missions - a.missions
        default:
          return b.level - a.level
      }
    })
  }

  const getCategoryIcon = () => {
    switch (category) {
      case 'level':
        return <Crown className="w-5 h-5" />
      case 'artifacts':
        return <Sparkles className="w-5 h-5" />
      case 'reputation':
        return <Star className="w-5 h-5" />
      case 'missions':
        return <Target className="w-5 h-5" />
      default:
        return <Crown className="w-5 h-5" />
    }
  }

  const getCategoryValue = (player: any) => {
    switch (category) {
      case 'level':
        return player.level
      case 'artifacts':
        return player.artifacts
      case 'reputation':
        return player.reputation
      case 'missions':
        return player.missions
      default:
        return player.level
    }
  }

  const getCategoryLabel = () => {
    switch (category) {
      case 'level':
        return 'Level'
      case 'artifacts':
        return 'Artifacts'
      case 'reputation':
        return 'Reputation'
      case 'missions':
        return 'Missions'
      default:
        return 'Level'
    }
  }

  const sortedData = getSortedData()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-honeycomb-300/30 p-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <Trophy className="w-8 h-8 text-honeycomb-400 mr-3" />
          Leaderboard
        </h1>
        <p className="text-gray-400 mb-8">Top alchemists in the realm</p>
        
        {/* Category Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'level', label: 'Level', icon: Crown },
            { key: 'artifacts', label: 'Artifacts', icon: Sparkles },
            { key: 'reputation', label: 'Reputation', icon: Star },
            { key: 'missions', label: 'Missions', icon: Target }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setCategory(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                category === key
                  ? 'bg-honeycomb-400 text-black border-honeycomb-400'
                  : 'bg-black/30 text-white border-honeycomb-300/30 hover:border-honeycomb-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-black/30 border border-honeycomb-300/30 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-honeycomb-300/30 text-sm font-medium text-gray-400">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Player</div>
            <div className="col-span-2 text-center">{getCategoryLabel()}</div>
            <div className="col-span-2 text-center">Level</div>
            <div className="col-span-2 text-center">Artifacts</div>
            <div className="col-span-1 text-center">Rep</div>
          </div>
          
          {sortedData.map((player, index) => (
            <div
              key={player.id}
              className={`grid grid-cols-12 gap-4 p-4 border-b border-honeycomb-300/20 hover:bg-black/20 transition-colors ${
                index === 0 ? 'bg-yellow-400/10' :
                index === 1 ? 'bg-gray-400/10' :
                index === 2 ? 'bg-orange-400/10' : ''
              }`}
            >
              {/* Rank */}
              <div className="col-span-1 flex items-center">
                {index === 0 ? (
                  <Medal className="w-6 h-6 text-yellow-400" />
                ) : index === 1 ? (
                  <Medal className="w-6 h-6 text-gray-400" />
                ) : index === 2 ? (
                  <Medal className="w-6 h-6 text-orange-400" />
                ) : (
                  <span className="text-gray-400 font-medium">#{index + 1}</span>
                )}
              </div>
              
              {/* Player Info */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="text-2xl">{player.avatar}</div>
                <div>
                  <div className="font-semibold text-white">{player.name}</div>
                  <div className="text-xs text-gray-400">
                    {player.walletAddress.slice(0, 6)}...{player.walletAddress.slice(-4)}
                  </div>
                </div>
              </div>
              
              {/* Category Value */}
              <div className="col-span-2 flex items-center justify-center">
                <div className="flex items-center gap-1">
                  {getCategoryIcon()}
                  <span className="font-semibold text-white">{getCategoryValue(player)}</span>
                </div>
              </div>
              
              {/* Level */}
              <div className="col-span-2 flex items-center justify-center">
                <span className="text-white font-medium">{player.level}</span>
              </div>
              
              {/* Artifacts */}
              <div className="col-span-2 flex items-center justify-center">
                <span className="text-white font-medium">{player.artifacts}</span>
              </div>
              
              {/* Reputation */}
              <div className="col-span-1 flex items-center justify-center">
                <span className="text-white font-medium">{player.reputation}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Your Position */}
        {gameStore.player && (
          <div className="mt-6 p-4 bg-honeycomb-400/10 border border-honeycomb-400/30 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Your Position
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Level:</span>
                <span className="text-white font-medium ml-2">{gameStore.player.level}</span>
              </div>
              <div>
                <span className="text-gray-400">Artifacts:</span>
                <span className="text-white font-medium ml-2">{gameStore.player.artifacts.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Reputation:</span>
                <span className="text-white font-medium ml-2">{gameStore.player.reputation}</span>
              </div>
              <div>
                <span className="text-gray-400">Missions:</span>
                <span className="text-white font-medium ml-2">
                  {gameStore.player.missions.filter((m: any) => m.completed).length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard 