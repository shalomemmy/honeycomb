import React, { useState, useEffect } from 'react';
import { Wallet, ChevronDown, ExternalLink, AlertCircle, CheckCircle, X } from 'lucide-react';

interface WalletConnectProps {
  onConnect: (wallet: any) => void;
  onClose: () => void;
  isOpen: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, onClose, isOpen }) => {
  const [availableWallets, setAvailableWallets] = useState<any[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  // Define known crypto wallets with their properties (Solana + Multi-chain)
  const knownWallets = [
    {
      name: 'Phantom',
      icon: '👻',
      identifier: 'phantom',
      downloadUrl: 'https://phantom.app/',
      description: 'The most popular Solana wallet'
    },
    {
      name: 'Solflare',
      icon: '🔥',
      identifier: 'solflare',
      downloadUrl: 'https://solflare.com/',
      description: 'Feature-rich Solana wallet'
    },
    {
      name: 'Backpack',
      icon: '🎒',
      identifier: 'backpack',
      downloadUrl: 'https://backpack.app/',
      description: 'Web3 wallet by Coral'
    },
    {
      name: 'Glow',
      icon: '✨',
      identifier: 'glow',
      downloadUrl: 'https://glow.app/',
      description: 'Simple and secure'
    },
    {
      name: 'Slope',
      icon: '📱',
      identifier: 'slope',
      downloadUrl: 'https://slope.finance/',
      description: 'Mobile-first wallet'
    },
    {
      name: 'Sollet',
      icon: '🔗',
      identifier: 'sollet',
      downloadUrl: 'https://www.sollet.io/',
      description: 'Browser extension wallet'
    },
    {
      name: 'MetaMask',
      icon: '🦊',
      identifier: 'metamask',
      downloadUrl: 'https://metamask.io/',
      description: 'Popular Ethereum & multi-chain wallet'
    },
    {
      name: 'Trust Wallet',
      icon: '🛡️',
      identifier: 'trustwallet',
      downloadUrl: 'https://trustwallet.com/',
      description: 'Mobile & desktop crypto wallet'
    },
    {
      name: 'Coinbase Wallet',
      icon: '🔵',
      identifier: 'coinbase',
      downloadUrl: 'https://wallet.coinbase.com/',
      description: 'Coinbase self-custody wallet'
    },
    {
      name: 'Coin98',
      icon: '💰',
      identifier: 'coin98',
      downloadUrl: 'https://coin98.com/',
      description: 'Multi-chain DeFi wallet'
    },
    {
      name: 'Exodus',
      icon: '🚀',
      identifier: 'exodus',
      downloadUrl: 'https://www.exodus.com/',
      description: 'Beautiful multi-currency wallet'
    },
    {
      name: 'Torus',
      icon: '🌐',
      identifier: 'torus',
      downloadUrl: 'https://tor.us/',
      description: 'Social login wallet'
    },
    {
      name: 'MathWallet',
      icon: '🧮',
      identifier: 'mathwallet',
      downloadUrl: 'https://mathwallet.org/',
      description: 'Multi-platform crypto wallet'
    },
    {
      name: 'Clover',
      icon: '🍀',
      identifier: 'clover',
      downloadUrl: 'https://clv.org/',
      description: 'Cross-chain wallet'
    },
    {
      name: 'Brave Wallet',
      icon: '🦁',
      identifier: 'brave',
      downloadUrl: 'https://brave.com/wallet/',
      description: 'Built into Brave browser'
    }
  ];

  // Check for available wallets on component mount
  useEffect(() => {
    if (isOpen) {
      detectWallets();
    }
  }, [isOpen]);

  const detectWallets = () => {
    const detected: any[] = [];
    
    // Check for wallets in window.solana or window object
    knownWallets.forEach(wallet => {
      let isAvailable = false;
      let walletObject = null;

      // Check different possible locations for wallet objects
      if ((window as any).solana) {
        // Some wallets attach to window.solana directly
        if (wallet.identifier === 'phantom' && (window as any).solana.isPhantom) {
          isAvailable = true;
          walletObject = (window as any).solana;
        }
      }

      // Check for wallet-specific objects
      switch (wallet.identifier) {
        case 'phantom':
          if ((window as any).phantom?.solana) {
            isAvailable = true;
            walletObject = (window as any).phantom.solana;
          }
          break;
        case 'solflare':
          if ((window as any).solflare?.isSolflare) {
            isAvailable = true;
            walletObject = (window as any).solflare;
          } else if ((window as any).solana?.isSolflare) {
            isAvailable = true;
            walletObject = (window as any).solana;
          }
          break;
        case 'backpack':
          if ((window as any).backpack?.isBackpack) {
            isAvailable = true;
            walletObject = (window as any).backpack;
          }
          break;
        case 'glow':
          if ((window as any).glow) {
            isAvailable = true;
            walletObject = (window as any).glow;
          }
          break;
        case 'slope':
          if ((window as any).Slope) {
            isAvailable = true;
            walletObject = (window as any).Slope;
          }
          break;
        case 'sollet':
          if ((window as any).sollet) {
            isAvailable = true;
            walletObject = (window as any).sollet;
          }
          break;
        case 'metamask':
          if ((window as any).ethereum?.isMetaMask) {
            isAvailable = true;
            walletObject = (window as any).ethereum;
          }
          break;
        case 'trustwallet':
          if ((window as any).trustwallet?.solana) {
            isAvailable = true;
            walletObject = (window as any).trustwallet.solana;
          } else if ((window as any).ethereum?.isTrust) {
            isAvailable = true;
            walletObject = (window as any).ethereum;
          }
          break;
        case 'coinbase':
          if ((window as any).coinbaseSolana) {
            isAvailable = true;
            walletObject = (window as any).coinbaseSolana;
          } else if ((window as any).ethereum?.isCoinbaseWallet) {
            isAvailable = true;
            walletObject = (window as any).ethereum;
          }
          break;
        case 'coin98':
          if ((window as any).coin98?.sol) {
            isAvailable = true;
            walletObject = (window as any).coin98.sol;
          }
          break;
        case 'exodus':
          if ((window as any).exodus?.solana) {
            isAvailable = true;
            walletObject = (window as any).exodus.solana;
          }
          break;
        case 'torus':
          if ((window as any).torus) {
            isAvailable = true;
            walletObject = (window as any).torus;
          }
          break;
        case 'mathwallet':
          if ((window as any).solana?.isMathWallet) {
            isAvailable = true;
            walletObject = (window as any).solana;
          }
          break;
        case 'clover':
          if ((window as any).clover?.solana) {
            isAvailable = true;
            walletObject = (window as any).clover.solana;
          }
          break;
        case 'brave':
          if ((window as any).solana?.isBraveWallet) {
            isAvailable = true;
            walletObject = (window as any).solana;
          }
          break;
      }

      if (isAvailable && walletObject) {
        detected.push({
          ...wallet,
          walletObject,
          isInstalled: true
        });
      } else {
        // Add uninstalled wallet to the list
        detected.push({
          ...wallet,
          walletObject: null,
          isInstalled: false
        });
      }
    });

    setAvailableWallets(detected);
  };

  const connectWallet = async (wallet: any) => {
    if (!wallet.isInstalled) {
      window.open(wallet.downloadUrl, '_blank');
      return;
    }

    setConnecting(true);
    setError('');

    try {
      let response: any;
      let publicKey = '';

      // Handle different wallet connection methods
      if (wallet.identifier === 'metamask' || wallet.identifier === 'trustwallet' || wallet.identifier === 'coinbase') {
        // Ethereum-based wallets
        if (wallet.walletObject.request) {
          // Request account access
          const accounts = await wallet.walletObject.request({ 
            method: 'eth_requestAccounts' 
          });
          if (accounts && accounts.length > 0) {
            publicKey = accounts[0]; // Ethereum address
          }
        }
      } else {
        // Solana wallets
        if (wallet.walletObject.connect) {
          response = await wallet.walletObject.connect();
          
          // Handle different Solana wallet response formats
          if (response && response.publicKey) {
            // Standard format (Phantom, etc.)
            publicKey = typeof response.publicKey === 'string' 
              ? response.publicKey 
              : response.publicKey.toString();
          } else if (wallet.walletObject.publicKey) {
            // Some wallets store publicKey directly on wallet object after connection
            publicKey = typeof wallet.walletObject.publicKey === 'string'
              ? wallet.walletObject.publicKey
              : wallet.walletObject.publicKey.toString();
          }
        } else {
          throw new Error(`${wallet.name} does not support the connect method`);
        }
      }

      if (!publicKey) {
        throw new Error('Unable to retrieve public key/address from wallet');
      }

      onConnect({
        name: wallet.name,
        publicKey: publicKey,
        icon: wallet.icon,
        walletObject: wallet.walletObject
      });
      onClose();
    } catch (err: any) {
      console.error(`Wallet connection error for ${wallet.name}:`, err);
      setError(`Failed to connect to ${wallet.name}: ${err.message}`);
    } finally {
      setConnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto m-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
            <p className="text-gray-400 text-sm">Choose your preferred Solana wallet</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="m-4 bg-red-900/50 border border-red-500/30 rounded-xl p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Wallet List */}
        <div className="p-4">
          {/* Installed Wallets */}
          {availableWallets.filter(w => w.isInstalled).length > 0 && (
            <div className="mb-6">
              <h3 className="text-base font-semibold text-green-400 mb-3">
                ✅ Installed ({availableWallets.filter(w => w.isInstalled).length})
              </h3>
              <div className="space-y-2">
                {availableWallets.filter(w => w.isInstalled).map((wallet) => (
                  <button
                    key={wallet.identifier}
                    onClick={() => connectWallet(wallet)}
                    disabled={connecting}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 hover:border-purple-500/50 rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    <div className="text-2xl">{wallet.icon}</div>
                    <div className="text-left flex-1">
                      <div className="text-white font-medium">{wallet.name}</div>
                      <div className="text-gray-400 text-xs">{wallet.description}</div>
                    </div>
                    {connecting && <div className="animate-spin text-white">⏳</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Not Installed Wallets */}
          {availableWallets.filter(w => !w.isInstalled).length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-orange-400 mb-3">
                📦 Not Installed ({availableWallets.filter(w => !w.isInstalled).length})
              </h3>
              <div className="space-y-2">
                {availableWallets.filter(w => !w.isInstalled).map((wallet) => (
                  <button
                    key={wallet.identifier}
                    onClick={() => connectWallet(wallet)}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-800/30 hover:bg-gray-700/30 border border-gray-600/30 hover:border-orange-500/50 rounded-lg transition-all duration-200"
                  >
                    <div className="text-2xl opacity-60">{wallet.icon}</div>
                    <div className="text-left flex-1">
                      <div className="text-white font-medium">{wallet.name}</div>
                      <div className="text-gray-400 text-xs">{wallet.description}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-orange-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="text-center text-xs text-gray-400">
            <p className="mb-1">🔒 Secure connection • ⚡ Instant detection</p>
            <p>If you don't see your wallet, make sure it's installed and refresh the page.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;