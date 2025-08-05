import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const WalletTest: React.FC = () => {
  const { publicKey, connected, connecting, wallet } = useWallet()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 border border-white/20 max-w-md w-full">
        <div className="text-center">
          <div className="text-6xl mb-4">🍯</div>
          <h1 className="text-2xl font-bold mb-6">Wallet Connection Test</h1>
          
          {/* Debug Info */}
          <div className="mb-6 text-left text-sm bg-black/20 p-4 rounded">
            <div className="mb-2"><strong>Connection Status:</strong></div>
            <div>Connected: {connected ? 'Yes' : 'No'}</div>
            <div>Connecting: {connecting ? 'Yes' : 'No'}</div>
            <div>Wallet: {wallet?.adapter.name || 'None'}</div>
            <div>Public Key: {publicKey?.toString() || 'None'}</div>
          </div>

          {/* Wallet Button */}
          <div className="mb-6">
            <WalletMultiButton className="bg-honeycomb-400 text-black hover:bg-honeycomb-300 transition-colors" />
          </div>

          {/* Instructions */}
          <div className="text-sm text-gray-300">
            <p className="mb-2">If the button doesn't work:</p>
            <ul className="text-left space-y-1">
              <li>• Make sure you have Phantom or Solflare installed</li>
              <li>• Check browser console for errors</li>
              <li>• Try refreshing the page</li>
              <li>• Ensure you're on localhost:3000</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletTest 