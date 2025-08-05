import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { WalletProvider } from './components/WalletProvider'
import { GameProvider } from './stores/GameStore'
import Header from './components/Header'
import CraftingLab from './components/CraftingLab'
import Marketplace from './components/Marketplace'
import Profile from './components/Profile'
import Leaderboard from './components/Leaderboard'
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
          <main style={{ padding: '20px' }}>
            <Routes>
              <Route path="/" element={<CraftingLab />} />
              <Route path="/laboratory" element={<CraftingLab />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </main>
        </div>
      </GameProvider>
    </WalletProvider>
  )
}

export default App