import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useGame } from '@/stores/GameStore'
import { 
  Gamepad2, 
  User, 
  Trophy, 
  Crown,
  Sparkles,
  Settings,
  Wallet,
  LogOut
} from 'lucide-react'

interface HeaderProps {
  connectedWallet: any
  onConnectWallet: () => void
  onDisconnectWallet: () => void
}

const Header: React.FC<HeaderProps> = ({ connectedWallet, onConnectWallet, onDisconnectWallet }) => {
  const { player } = useGame()
  const location = useLocation()

  const navItems = [
    { path: '/', label: '2D RPG', icon: Gamepad2 },
    { path: '/game', label: 'Game World', icon: Gamepad2 }
  ]

  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-honeycomb-300/30">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-2xl">🍯</div>
            <div>
              <h1 className="text-xl font-bold text-white">Honeycomb RPG</h1>
              <p className="text-xs text-honeycomb-400">Advanced 2D Adventure</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === path
                    ? 'bg-honeycomb-400 text-black'
                    : 'text-white hover:bg-honeycomb-400/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Player Stats & Wallet */}
          <div className="flex items-center gap-4">
            {/* Player Stats */}
            {player && connectedWallet && (
              <div className="hidden lg:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium">Lv.{player.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium">{player.inventory.length}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-xl">{connectedWallet.icon}</span>
                  <span>{connectedWallet.publicKey.slice(0, 6)}...{connectedWallet.publicKey.slice(-4)}</span>
                </div>
              </div>
            )}

            {/* Wallet Button */}
            {connectedWallet ? (
              <button
                onClick={onDisconnectWallet}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            ) : (
              <button
                onClick={onConnectWallet}
                className="flex items-center gap-2 bg-honeycomb-400 hover:bg-honeycomb-300 text-black px-4 py-2 rounded-lg transition-colors font-medium"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex items-center justify-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === path
                  ? 'bg-honeycomb-400 text-black'
                  : 'text-white hover:bg-honeycomb-400/20'
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </Link>
          ))}
        </nav>
      </div>

    </header>
  )
}

export default Header 