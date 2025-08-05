import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { User, Sparkles, Crown, Trophy, Target, Star, Coins, Award } from 'lucide-react'
import { useGame } from '@/stores/GameStore'

const Profile: React.FC = () => {
  const { publicKey } = useWallet()
  const gameStore = useGame()

  if (!publicKey) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <User className="w-16 h-16 text-honeycomb-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect your Solana wallet to view your profile</p>
        </div>
      </div>
    )
  }

  const player = gameStore.player

  if (!player) {
    return (
      <div className="text-center py-12">
        <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Profile Loading</h3>
        <p className="text-gray-400">Your profile will be available once you start crafting artifacts!</p>
      </div>
    )
  }

  const experienceProgress = (player.experience / player.experienceToNext) * 100

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-honeycomb-300/30 p-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <User className="w-8 h-8 text-honeycomb-400 mr-3" />
          Your Profile
        </h1>
        <p className="text-gray-400 mb-8">View your alchemist stats and achievements</p>
        
        {/* Player Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/30 border border-honeycomb-300/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Level</h3>
            </div>
            <p className="text-3xl font-bold text-honeycomb-400">{player.level}</p>
            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>XP: {player.experience}</span>
                <span>{player.experienceToNext}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-honeycomb-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${experienceProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-black/30 border border-honeycomb-300/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Reputation</h3>
            </div>
            <p className="text-3xl font-bold text-honeycomb-400">{player.reputation}</p>
            <p className="text-sm text-gray-400">Alchemist Points</p>
          </div>

          <div className="bg-black/30 border border-honeycomb-300/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Artifacts</h3>
            </div>
            <p className="text-3xl font-bold text-honeycomb-400">{player.artifacts.length}</p>
            <p className="text-sm text-gray-400">Crafted</p>
          </div>

          <div className="bg-black/30 border border-honeycomb-300/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Missions</h3>
            </div>
            <p className="text-3xl font-bold text-honeycomb-400">
              {player.missions.filter(m => m.completed).length}/{player.missions.length}
            </p>
            <p className="text-sm text-gray-400">Completed</p>
          </div>
        </div>

        {/* Traits Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Star className="w-6 h-6 text-yellow-400 mr-2" />
            Traits & Specializations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {player.traits.map((trait) => (
              <div key={trait.id} className="bg-black/30 border border-honeycomb-300/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{trait.name}</h3>
                  <span className="text-sm text-honeycomb-400">Lv.{trait.level}</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{trait.description}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-honeycomb-400 h-2 rounded-full"
                      style={{ width: `${(trait.level / trait.maxLevel) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">{trait.level}/{trait.maxLevel}</span>
                </div>
                <div className="mt-2 text-sm text-honeycomb-400">
                  +{trait.bonus}% Bonus
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Artifacts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Award className="w-6 h-6 text-purple-400 mr-2" />
            Recent Artifacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {player.artifacts.slice(0, 6).map((artifact) => (
              <div key={artifact.id} className="bg-black/30 border border-honeycomb-300/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{artifact.name}</h3>
                  <span className={`text-sm font-medium ${
                    artifact.rarity === 'legendary' ? 'text-yellow-400' :
                    artifact.rarity === 'epic' ? 'text-purple-400' :
                    artifact.rarity === 'rare' ? 'text-blue-400' :
                    artifact.rarity === 'uncommon' ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {artifact.rarity.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{artifact.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium">Power: {artifact.power}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {artifact.elements.map((element) => (
                    <span
                      key={element}
                      className="px-2 py-1 bg-honeycomb-400/20 text-honeycomb-400 text-xs rounded"
                    >
                      {element}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Missions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Target className="w-6 h-6 text-blue-400 mr-2" />
            Active Missions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {player.missions.filter(m => !m.completed).slice(0, 4).map((mission) => (
              <div key={mission.id} className="bg-black/30 border border-honeycomb-300/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{mission.title}</h3>
                  <span className="text-sm text-honeycomb-400">
                    {mission.progress}/{mission.maxProgress}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{mission.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-honeycomb-400 h-2 rounded-full"
                      style={{ width: `${(mission.progress / mission.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Coins className="w-4 h-4" />
                  <span>Reward: {mission.rewards.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 