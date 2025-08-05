import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { GameProvider, useGame } from './stores/GameStore'
import Header from './components/Header'
import GameWorld from './components/GameWorld'
import WalletConnect from './components/WalletConnect'
import './App.css'

function AppContent() {
  const { initializePlayer } = useGame()
  const [showWalletConnect, setShowWalletConnect] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<any>(null)

  const handleWalletConnect = (wallet: any) => {
    setConnectedWallet(wallet)
    initializePlayer(wallet.publicKey)
    setShowWalletConnect(false)
  }

  const handleWalletDisconnect = async () => {
    try {
      if (connectedWallet?.walletObject?.disconnect) {
        await connectedWallet.walletObject.disconnect()
      }
      setConnectedWallet(null)
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1f2937 0%, #7c3aed 50%, #1f2937 100%)',
        color: 'white'
      }}
    >
      <Header 
        connectedWallet={connectedWallet}
        onConnectWallet={() => setShowWalletConnect(true)}
        onDisconnectWallet={handleWalletDisconnect}
      />
      <main style={{ height: 'calc(100vh - 80px)' }}>
        <Routes>
          <Route path="/" element={<GameWorld />} />
          <Route path="/game" element={<GameWorld />} />
        </Routes>
      </main>
      
      {/* Wallet Connect Modal - Rendered at root level */}
      <WalletConnect
        isOpen={showWalletConnect}
        onClose={() => setShowWalletConnect(false)}
        onConnect={handleWalletConnect}
      />
    </div>
  )
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

export default App