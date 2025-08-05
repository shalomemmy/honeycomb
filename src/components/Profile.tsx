import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { User, Sparkles } from 'lucide-react'

const Profile: React.FC = () => {
  const { publicKey } = useWallet()

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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-honeycomb-300/30 p-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <User className="w-8 h-8 text-honeycomb-400 mr-3" />
          Your Profile
        </h1>
        <p className="text-gray-400 mb-8">View your alchemist stats and achievements</p>
        
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Profile Coming Soon</h3>
          <p className="text-gray-400">Your profile will be available once you start crafting artifacts!</p>
        </div>
      </div>
    </div>
  )
}

export default Profile 