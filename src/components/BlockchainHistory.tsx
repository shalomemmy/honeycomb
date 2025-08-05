import React, { useState, useEffect } from 'react'
import { useGame } from '@/stores/GameStore'
import { 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Hash,
  Activity,
  TrendingUp
} from 'lucide-react'

interface Transaction {
  id: string
  type: string
  transaction: any
  updates: any
  timestamp: string
}

const BlockchainHistory: React.FC = () => {
  const { player } = useGame()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (player?.walletAddress) {
      loadTransactionHistory()
    }
  }, [player])

  const loadTransactionHistory = () => {
    if (!player?.walletAddress) return
    
    const txHistory = JSON.parse(
      localStorage.getItem(`tx_history_${player.walletAddress}`) || '[]'
    )
    setTransactions(txHistory.reverse()) // Show newest first
  }

  const getTransactionUrl = (txHash: string) => {
    return `https://explorer.solana.com/tx/${txHash}?cluster=devnet`
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'player_update':
        return <TrendingUp className="w-4 h-4 text-blue-400" />
      case 'mission_complete':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      default:
        return <Activity className="w-4 h-4 text-purple-400" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (!player) return null

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-honeycomb-400 hover:bg-honeycomb-300 text-black p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50"
        title="View Blockchain History"
      >
        <Hash className="w-6 h-6" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Hash className="w-6 h-6 text-honeycomb-400" />
                  On-Chain Activity
                </h2>
                <p className="text-gray-400 text-sm">
                  Your blockchain transactions and Honeycomb Protocol interactions
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <AlertCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Player Stats */}
            <div className="p-6 bg-gray-800/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-honeycomb-400">
                    {player.blockchainInteractions || 0}
                  </div>
                  <div className="text-sm text-gray-400">Total Transactions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {player.honeycombReputation || 0}
                  </div>
                  <div className="text-sm text-gray-400">Honeycomb Reputation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    Level {player.level}
                  </div>
                  <div className="text-sm text-gray-400">Current Level</div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="p-6 overflow-y-auto max-h-96">
              <h3 className="text-lg font-semibold text-white mb-4">
                Recent Transactions ({transactions.length})
              </h3>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No blockchain transactions yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start playing to see your on-chain activity!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/70 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getTransactionIcon(tx.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-medium capitalize">
                                {tx.type.replace('_', ' ')}
                              </span>
                              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                                Confirmed
                              </span>
                            </div>
                            
                            {/* Transaction Details */}
                            {tx.updates && (
                              <div className="text-sm text-gray-300 mb-2">
                                {tx.updates.experience && (
                                  <span className="inline-block bg-blue-600/20 text-blue-300 px-2 py-1 rounded mr-2 mb-1">
                                    +{tx.updates.experience} XP
                                  </span>
                                )}
                                {tx.updates.level && (
                                  <span className="inline-block bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded mr-2 mb-1">
                                    Level {tx.updates.level}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(tx.timestamp)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Transaction Hash */}
                        {tx.transaction?.txHash && (
                          <a
                            href={getTransactionUrl(tx.transaction.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-honeycomb-400 hover:text-honeycomb-300 text-sm"
                          >
                            <span className="font-mono">
                              {tx.transaction.txHash.slice(0, 8)}...
                            </span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700 bg-gray-800/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  Connected to Solana Devnet
                </span>
                <a
                  href={`https://explorer.solana.com/address/${player.walletAddress}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-honeycomb-400 hover:text-honeycomb-300"
                >
                  View Wallet on Explorer
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BlockchainHistory