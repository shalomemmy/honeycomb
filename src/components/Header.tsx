import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useGame } from '@/stores/GameStore'
import { 
  FlaskConical, 
  Store, 
  User, 
  Trophy, 
  Crown,
  Sparkles
} from 'lucide-react'

const Header: React.FC = () => {
  const { publicKey } = useWallet()
  const { player, initializePlayer } = useGame()
  const location = useLocation()

  // Initialize player when wallet connects
  React.useEffect(() => {
    if (publicKey && !player) {
      initializePlayer(publicKey.toString())
    }
  }, [publicKey, player, initializePlayer])

  const navItems = [
    { path: '/', label: 'Laboratory', icon: FlaskConical },
    { path: '/marketplace', label: 'Marketplace', icon: Store },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy }
  ]

  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-honeycomb-300/30">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-2xl">🍯</div>
            <div>
              <h1 className="text-xl font-bold text-white">Honeycomb Quest</h1>
              <p className="text-xs text-honeycomb-400">Digital Alchemist</p>
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
            {player && (
              <div className="hidden lg:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium">Lv.{player.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium">{player.artifacts.length}</span>
                </div>
                <div className="text-gray-400">
                  {player.walletAddress.slice(0, 6)}...{player.walletAddress.slice(-4)}
                </div>
              </div>
            )}

            {/* Wallet Button */}
            <WalletMultiButton className="bg-honeycomb-400 text-black hover:bg-honeycomb-300 transition-colors" />
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