import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { GameProvider } from './stores/GameStore'
import Header from './components/Header'
import GameWorld from './components/GameWorld'
import './App.css'

function App() {
  return (
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
          </Routes>
        </main>
      </div>
    </GameProvider>
  )
}

export default App