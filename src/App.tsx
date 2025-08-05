import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { WalletProvider } from './components/WalletProvider'
import { GameProvider } from './stores/GameStore'
import Header from './components/Header'
import GameWorld from './components/GameWorld'
import WalletTest from './components/WalletTest'
import './App.css'

function App() {
  return (
    <WalletProvider>
      <GameProvider>
        <div 
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1f2937 0%, #7c3aed 50%, #1f2937 100%)',
            color: 'white'
          }}
        >
          <Header />
          <main style={{ height: 'calc(100vh - 80px)' }}>
            <Routes>
              <Route path="/" element={<GameWorld />} />
              <Route path="/game" element={<GameWorld />} />
              <Route path="/test" element={<WalletTest />} />
            </Routes>
          </main>
        </div>
      </GameProvider>
    </WalletProvider>
  )
}

export default App