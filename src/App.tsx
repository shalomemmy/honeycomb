import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { WalletProvider } from './components/WalletProvider'
import Header from './components/Header'
import './App.css'

function App() {
  return (
    <WalletProvider>
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
            <Route path="/" element={
              <div>
                <h1 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>
                  🍯 Honeycomb Quest
                </h1>
                <p style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '20px' }}>
                  WalletProvider component added! This is the home page.
                </p>
                <div style={{
                  maxWidth: '600px',
                  margin: '0 auto',
                  padding: '20px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <h2 style={{ marginBottom: '10px' }}>✅ WalletProvider Test</h2>
                  <p>If you can see this content and the header above, the WalletProvider component is working.</p>
                  <p style={{ marginTop: '10px', color: '#f59e20' }}>
                    Next: We'll add the GameProvider component.
                  </p>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </WalletProvider>
  )
}

export default App