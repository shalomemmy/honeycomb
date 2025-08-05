import React, { useState } from 'react'
import { useGame } from '@/stores/GameStore'
import { 
  Gamepad2, 
  Sword, 
  Shield, 
  Heart, 
  Star,
  Trophy,
  Crown,
  Sparkles,
  Zap,
  Target
} from 'lucide-react'

const GameWorld: React.FC = () => {
  const { player, addExperience, addItem } = useGame()
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = (action: string) => {
    if (!player) {
      console.error('No player found - cannot perform action')
      return
    }

    setIsLoading(true)
    
    // Simulate action delay
    setTimeout(() => {
      switch (action) {
        case 'explore':
          addExperience(10)
          break
        case 'combat':
          addExperience(25)
          break
        case 'craft':
          addExperience(15)
          break
        case 'mission':
          addExperience(50)
          break
      }
      setIsLoading(false)
    }, 1000)
  }

  if (!player) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">🍯</div>
          <h2 className="text-2xl font-bold mb-4">Honeycomb RPG</h2>
          <p className="text-gray-300 mb-8">Connect your wallet to start your 3D adventure!</p>
          <div className="bg-honeycomb-400/20 p-4 rounded-lg">
            <p className="text-sm text-honeycomb-300">
              This advanced 3D RPG features:
            </p>
            <ul className="text-sm text-gray-300 mt-2 space-y-1">
              <li>• Real-time 3D world with physics</li>
              <li>• Honeycomb Protocol integration</li>
              <li>• On-chain missions and traits</li>
              <li>• Advanced combat system</li>
              <li>• Skill and progression trees</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="h-full relative overflow-hidden">
      {/* 3D World Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Game UI */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Stats Bar */}
        <div className="bg-black/20 backdrop-blur-sm p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Health */}
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <div className="text-white font-medium">
                  {player.health}/{player.maxHealth}
                </div>
              </div>

              {/* Level */}
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <div className="text-white font-medium">
                  Level {player.level}
                </div>
              </div>

              {/* Experience */}
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-400" />
                <div className="text-white font-medium">
                  {player.experience}/{player.experienceToNext} XP
                </div>
              </div>

              {/* Inventory */}
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <div className="text-white font-medium">
                  {player.inventory.length} items
                </div>
              </div>
            </div>

            {/* Honeycomb Status */}
            <div className="flex items-center gap-2">
              <div className="text-2xl">🍯</div>
              <div className="text-white font-medium">
                Rep: {player.honeycombReputation}
              </div>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
            {/* Action Cards */}
            <div 
              className={`bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 cursor-pointer transition-all hover:bg-black/50 hover:scale-105 ${isLoading ? 'opacity-50' : ''}`}
              onClick={() => handleAction('explore')}
            >
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h3 className="text-lg font-bold mb-2">Explore World</h3>
                <p className="text-sm text-gray-300">Discover new areas and resources</p>
                <div className="mt-4 text-xs text-green-400">+10 XP</div>
              </div>
            </div>

            <div 
              className={`bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 cursor-pointer transition-all hover:bg-black/50 hover:scale-105 ${isLoading ? 'opacity-50' : ''}`}
              onClick={() => handleAction('combat')}
            >
              <div className="text-center">
                <Sword className="w-12 h-12 mx-auto mb-4 text-red-400" />
                <h3 className="text-lg font-bold mb-2">Combat Training</h3>
                <p className="text-sm text-gray-300">Fight enemies and gain experience</p>
                <div className="mt-4 text-xs text-red-400">+25 XP</div>
              </div>
            </div>

            <div 
              className={`bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 cursor-pointer transition-all hover:bg-black/50 hover:scale-105 ${isLoading ? 'opacity-50' : ''}`}
              onClick={() => handleAction('craft')}
            >
              <div className="text-center">
                <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-lg font-bold mb-2">Craft Items</h3>
                <p className="text-sm text-gray-300">Create powerful equipment</p>
                <div className="mt-4 text-xs text-yellow-400">+15 XP</div>
              </div>
            </div>

            <div 
              className={`bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 cursor-pointer transition-all hover:bg-black/50 hover:scale-105 ${isLoading ? 'opacity-50' : ''}`}
              onClick={() => handleAction('mission')}
            >
              <div className="text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-lg font-bold mb-2">Complete Mission</h3>
                <p className="text-sm text-gray-300">Finish Honeycomb missions</p>
                <div className="mt-4 text-xs text-purple-400">+50 XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="bg-black/20 backdrop-blur-sm p-4 border-t border-white/10">
          <div className="text-center text-sm text-gray-300">
            <p>🎮 Advanced 3D RPG with Honeycomb Protocol Integration</p>
            <p className="mt-1">Every action creates on-chain missions and evolves your character</p>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🍯</div>
            <p className="text-white">Processing action...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameWorld 