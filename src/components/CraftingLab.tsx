import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { ElementType } from '@/types'
import { 
  Flame, 
  Droplets, 
  Mountain, 
  Wind,
  Zap,
  Sparkles,
  Timer,
  Target
} from 'lucide-react'

const CraftingLab: React.FC = () => {
  const { publicKey } = useWallet()
  const [selectedElements, setSelectedElements] = useState<ElementType[]>([])
  const [craftingInProgress, setCraftingInProgress] = useState(false)
  const [craftingProgress, setCraftingProgress] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const elements = [
    { type: 'fire' as ElementType, name: 'Fire', icon: Flame, color: 'element-fire' },
    { type: 'water' as ElementType, name: 'Water', icon: Droplets, color: 'element-water' },
    { type: 'earth' as ElementType, name: 'Earth', icon: Mountain, color: 'element-earth' },
    { type: 'air' as ElementType, name: 'Air', icon: Wind, color: 'element-air' },
  ]

  const handleElementClick = (elementType: ElementType) => {
    if (selectedElements.includes(elementType)) {
      setSelectedElements(selectedElements.filter(e => e !== elementType))
    } else {
      setSelectedElements([...selectedElements, elementType])
    }
  }

  const handleCraft = async () => {
    if (selectedElements.length === 0) return

    setCraftingInProgress(true)
    setCraftingProgress(0)
    setShowResult(false)

    // Simulate crafting process
    const craftingDuration = 3000 // 3 seconds
    const interval = 50 // Update every 50ms
    const steps = craftingDuration / interval

    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, interval))
      setCraftingProgress((i / steps) * 100)
    }

    setCraftingInProgress(false)
    setShowResult(true)
    setSelectedElements([])
  }

  if (!publicKey) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-honeycomb-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect your Solana wallet to start crafting artifacts</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Element Selection */}
        <div className="lg:col-span-2">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-honeycomb-300/30 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Flame className="w-6 h-6 text-honeycomb-400 mr-2" />
              Element Selection
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {elements.map(({ type, name, icon: Icon, color }) => (
                <button
                  key={type}
                  onClick={() => handleElementClick(type)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedElements.includes(type)
                      ? `${color} border-white shadow-lg scale-105`
                      : 'bg-black/20 border-gray-600 hover:border-honeycomb-300'
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium text-white">{name}</p>
                </button>
              ))}
            </div>

            {/* Selected Elements Display */}
            {selectedElements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Selected Elements:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedElements.map((element) => {
                    const elementData = elements.find(e => e.type === element)
                    return (
                      <div
                        key={element}
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${
                          elementData?.color || ''
                        }`}
                      >
                        <span>{elementData?.name}</span>
                        <button
                          onClick={() => handleElementClick(element)}
                          className="ml-1 hover:text-white"
                        >
                          ×
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Craft Button */}
            <button
              onClick={handleCraft}
              disabled={selectedElements.length === 0 || craftingInProgress}
              className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-200 ${
                selectedElements.length === 0 || craftingInProgress
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-honeycomb-500 hover:bg-honeycomb-600 text-white hover:scale-105'
              }`}
            >
              {craftingInProgress ? (
                <div className="flex items-center justify-center space-x-2">
                  <Timer className="w-5 h-5 animate-spin" />
                  <span>Crafting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Craft Artifact</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Crafting Progress & Results */}
        <div className="space-y-6">
          {/* Progress Bar */}
          {craftingInProgress && (
            <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-honeycomb-300/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Crafting Progress</h3>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <div
                  className="bg-honeycomb-500 h-3 rounded-full transition-all duration-200"
                  style={{ width: `${craftingProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-400">{Math.round(craftingProgress)}%</p>
            </div>
          )}

          {/* Crafting Result */}
          {showResult && (
            <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-honeycomb-300/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Sparkles className="w-5 h-5 text-honeycomb-400 mr-2" />
                Crafting Successful!
              </h3>
              
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-honeycomb-400 to-honeycomb-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                
                <h4 className="text-xl font-bold text-white mb-2">Mystic Artifact</h4>
                <p className="text-sm text-green-400 font-medium mb-2">RARE</p>
                <p className="text-gray-400 text-sm mb-4">A mystical artifact crafted from your selected elements</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-black/20 rounded p-2">
                    <p className="text-gray-400">Power</p>
                    <p className="text-white font-bold">85</p>
                  </div>
                  <div className="bg-black/20 rounded p-2">
                    <p className="text-gray-400">Elements</p>
                    <p className="text-white font-bold">{selectedElements.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Player Stats */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-honeycomb-300/30 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 text-honeycomb-400 mr-2" />
              Alchemist Stats
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Level</span>
                <span className="text-white font-bold">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Experience</span>
                <span className="text-white font-bold">0 / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Artifacts</span>
                <span className="text-white font-bold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Reputation</span>
                <span className="text-white font-bold">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CraftingLab 