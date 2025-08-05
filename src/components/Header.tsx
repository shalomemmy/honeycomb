import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { 
  FlaskConical, 
  Store, 
  User, 
  Trophy,
  Bell,
  Sparkles
} from 'lucide-react'

const Header: React.FC = () => {
  const { publicKey } = useWallet()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Laboratory', icon: FlaskConical },
    { path: '/marketplace', label: 'Marketplace', icon: Store },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ]

  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-honeycomb-300/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-honeycomb-400 group-hover:text-honeycomb-300 transition-colors" />
              <div className="absolute inset-0 bg-honeycomb-400/20 rounded-full blur-sm group-hover:bg-honeycomb-300/30 transition-colors" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white group-hover:text-honeycomb-300 transition-colors">
                Honeycomb Quest
              </h1>
              <p className="text-xs text-gray-400">Digital Alchemist</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-honeycomb-500/20 text-honeycomb-300 border border-honeycomb-300/30'
                    : 'text-gray-300 hover:text-honeycomb-300 hover:bg-black/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Wallet connection */}
            <WalletMultiButton className="bg-honeycomb-500 hover:bg-honeycomb-600 text-white font-medium px-4 py-2 rounded-lg transition-colors" />
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="md:hidden mt-4 flex items-center justify-center space-x-4">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                location.pathname === path
                  ? 'bg-honeycomb-500/20 text-honeycomb-300'
                  : 'text-gray-300 hover:text-honeycomb-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header 