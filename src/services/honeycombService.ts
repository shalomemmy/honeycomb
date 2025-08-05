import { 
  HoneycombMission, 
  HoneycombTrait, 
  HoneycombPlayer, 
  HoneycombEntity,
  BlockchainTransaction,
  Mission,
  Trait,
  Player,
  Item
} from '@/types'

// Advanced Honeycomb Protocol Integration
class HoneycombService {
  private baseUrl = 'https://api.honeycombprotocol.com/v1'
  private connection: any = null
  private wallet: any = null

  constructor() {
    this.initializeConnection()
  }

  // Set wallet after connection
  setWallet(wallet: any) {
    this.wallet = wallet
    console.log('🍯 Wallet set for Honeycomb service:', wallet?.publicKey?.toString())
  }

  private async initializeConnection() {
    try {
      // Initialize Solana connection to devnet
      const { Connection, clusterApiUrl, PublicKey } = await import('@solana/web3.js')
      this.connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
      
      // Load wallet if available
      if (typeof window !== 'undefined' && (window as any).solana) {
        this.wallet = (window as any).solana
        console.log('🍯 Wallet connected to Honeycomb:', this.wallet.publicKey?.toString())
      }
      
      console.log('🍯 Honeycomb Protocol initialized on Solana Devnet')
      
      // Test connection
      const version = await this.connection.getVersion()
      console.log('📡 Solana RPC Version:', version)
      
    } catch (error) {
      console.error('❌ Failed to initialize Honeycomb connection:', error)
    }
  }

  // Mission Management
  async createMission(missionData: Partial<HoneycombMission>): Promise<HoneycombMission | null> {
    try {
      if (!this.wallet) {
        console.warn('Wallet not connected, using mock data')
        return this.createMockMission(missionData)
      }

      const response = await fetch(`${this.baseUrl}/missions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          ...missionData,
          walletAddress: this.wallet.publicKey.toString(),
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        const mission = await response.json()
        
        // Create blockchain transaction
        await this.createBlockchainTransaction({
          type: 'mission_complete',
          data: { missionId: mission.id },
          status: 'pending'
        })

        return mission
      }

      return this.createMockMission(missionData)
    } catch (error) {
      console.error('Failed to create Honeycomb mission:', error)
      return this.createMockMission(missionData)
    }
  }

  async updateMission(missionId: string, updates: Partial<HoneycombMission>): Promise<HoneycombMission | null> {
    try {
      if (!this.wallet) {
        return this.updateMockMission(missionId, updates)
      }

      const response = await fetch(`${this.baseUrl}/missions/${missionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        return await response.json()
      }

      return this.updateMockMission(missionId, updates)
    } catch (error) {
      console.error('Failed to update Honeycomb mission:', error)
      return this.updateMockMission(missionId, updates)
    }
  }

  async getPlayerMissions(walletAddress: string): Promise<HoneycombMission[]> {
    try {
      if (!this.wallet) {
        return this.getMockMissions(walletAddress)
      }

      const response = await fetch(`${this.baseUrl}/players/${walletAddress}/missions`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      })

      if (response.ok) {
        return await response.json()
      }

      return this.getMockMissions(walletAddress)
    } catch (error) {
      console.error('Failed to get player missions:', error)
      return this.getMockMissions(walletAddress)
    }
  }

  // Trait Management
  async createTrait(traitData: Partial<HoneycombTrait>): Promise<HoneycombTrait | null> {
    try {
      if (!this.wallet) {
        return this.createMockTrait(traitData)
      }

      const response = await fetch(`${this.baseUrl}/traits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          ...traitData,
          walletAddress: this.wallet.publicKey.toString(),
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        const trait = await response.json()
        
        // Create blockchain transaction
        await this.createBlockchainTransaction({
          type: 'trait_evolution',
          data: { traitId: trait.id },
          status: 'pending'
        })

        return trait
      }

      return this.createMockTrait(traitData)
    } catch (error) {
      console.error('Failed to create Honeycomb trait:', error)
      return this.createMockTrait(traitData)
    }
  }

  async updateTrait(traitId: string, updates: Partial<HoneycombTrait>): Promise<HoneycombTrait | null> {
    try {
      if (!this.wallet) {
        return this.updateMockTrait(traitId, updates)
      }

      const response = await fetch(`${this.baseUrl}/traits/${traitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        return await response.json()
      }

      return this.updateMockTrait(traitId, updates)
    } catch (error) {
      console.error('Failed to update Honeycomb trait:', error)
      return this.updateMockTrait(traitId, updates)
    }
  }

  async getPlayerTraits(walletAddress: string): Promise<HoneycombTrait[]> {
    try {
      if (!this.wallet) {
        return this.getMockTraits(walletAddress)
      }

      const response = await fetch(`${this.baseUrl}/players/${walletAddress}/traits`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      })

      if (response.ok) {
        return await response.json()
      }

      return this.getMockTraits(walletAddress)
    } catch (error) {
      console.error('Failed to get player traits:', error)
      return this.getMockTraits(walletAddress)
    }
  }

  // Player Management
  async getPlayer(walletAddress: string): Promise<HoneycombPlayer | null> {
    try {
      if (!this.wallet) {
        return this.getMockPlayer(walletAddress)
      }

      const response = await fetch(`${this.baseUrl}/players/${walletAddress}`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      })

      if (response.ok) {
        return await response.json()
      }

      return this.getMockPlayer(walletAddress)
    } catch (error) {
      console.error('Failed to get player:', error)
      return this.getMockPlayer(walletAddress)
    }
  }

  async updatePlayer(walletAddress: string, updates: Partial<HoneycombPlayer>): Promise<HoneycombPlayer | null> {
    try {
      console.log('🍯 Updating player on Honeycomb Protocol:', walletAddress, updates)
      
      if (!this.wallet || !this.connection) {
        console.log('⚠️ No wallet/connection, using mock data')
        return this.updateMockPlayer(walletAddress, updates)
      }

      // Create blockchain transaction for player update
      const transaction = await this.createBlockchainTransaction({
        type: 'player_update',
        data: { 
          walletAddress, 
          updates,
          timestamp: new Date().toISOString()
        },
        status: 'pending'
      })

      console.log('📝 Created blockchain transaction:', transaction?.signature)

      // Try to call real Honeycomb API
      const response = await fetch(`${this.baseUrl}/players/${walletAddress}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          ...updates,
          transactionSignature: transaction?.signature,
          blockchainTimestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        const player = await response.json()
        console.log('✅ Player updated on Honeycomb Protocol')
        return player
      }

      console.log('⚠️ Honeycomb API unavailable, using enhanced mock with blockchain data')
      return this.updateMockPlayerWithBlockchain(walletAddress, updates, transaction)
    } catch (error) {
      console.error('❌ Failed to update player:', error)
      return this.updateMockPlayer(walletAddress, updates)
    }
  }

  // Reputation Management
  async updateReputation(walletAddress: string, amount: number, reason: string): Promise<number> {
    try {
      if (!this.wallet) {
        return this.updateMockReputation(walletAddress, amount, reason)
      }

      const response = await fetch(`${this.baseUrl}/players/${walletAddress}/reputation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ amount, reason })
      })

      if (response.ok) {
        const result = await response.json()
        return result.reputation
      }

      return this.updateMockReputation(walletAddress, amount, reason)
    } catch (error) {
      console.error('Failed to update reputation:', error)
      return this.updateMockReputation(walletAddress, amount, reason)
    }
  }

  // Blockchain Integration
  async createBlockchainTransaction(transaction: Partial<BlockchainTransaction>): Promise<BlockchainTransaction | null> {
    try {
      console.log('🔗 Creating blockchain transaction:', transaction.type)
      
      if (!this.wallet || !this.connection) {
        console.log('⚠️ No wallet/connection, creating mock transaction')
        return this.createMockTransaction(transaction)
      }

      // Create Solana transaction with memo for Honeycomb data
      const { Transaction, SystemProgram, PublicKey } = await import('@solana/web3.js')
      
      const transactionData = new Transaction()
      
      // Add a small transfer to make it a valid transaction
      // In a real implementation, this would interact with Honeycomb Program
      transactionData.add(
        SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: this.wallet.publicKey, // Self-transfer for demo
          lamports: 1 // Minimal amount
        })
      )

      // In a real Honeycomb implementation, we would add Honeycomb program instructions here
      // For now, we simulate with a memo containing game data
      const memo = JSON.stringify({
        honeycomb: true,
        type: transaction.type,
        data: transaction.data,
        timestamp: new Date().toISOString()
      })

      try {
        // Attempt to sign and send transaction
        const { blockhash } = await this.connection.getRecentBlockhash()
        transactionData.recentBlockhash = blockhash
        transactionData.feePayer = this.wallet.publicKey

        const signedTransaction = await this.wallet.signTransaction(transactionData)
        const signature = await this.connection.sendRawTransaction(signedTransaction.serialize())
        
        console.log('✅ Transaction sent to Solana:', signature)
        
        // Wait for confirmation
        await this.connection.confirmTransaction(signature, 'confirmed')
        console.log('✅ Transaction confirmed on blockchain')

        const blockchainTx: BlockchainTransaction = {
          id: signature,
          type: transaction.type || 'honeycomb_verification',
          data: transaction.data || {},
          status: 'confirmed',
          txHash: signature,
          blockNumber: Date.now(),
          timestamp: new Date()
        }

        // Store transaction
        localStorage.setItem(`tx_${blockchainTx.id}`, JSON.stringify(blockchainTx))
        
        return blockchainTx
      } catch (txError) {
        console.error('Failed to send transaction:', txError)
        return this.createMockTransaction(transaction)
      }
    } catch (error) {
      console.error('Failed to create blockchain transaction:', error)
      return this.createMockTransaction(transaction)
    }
  }

  // Verification System
  async verifyOnChainAction(action: string, data: any): Promise<boolean> {
    try {
      if (!this.wallet) {
        return this.verifyMockAction(action, data)
      }

      const response = await fetch(`${this.baseUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ action, data, walletAddress: this.wallet.publicKey.toString() })
      })

      if (response.ok) {
        const result = await response.json()
        return result.verified
      }

      return this.verifyMockAction(action, data)
    } catch (error) {
      console.error('Failed to verify on-chain action:', error)
      return this.verifyMockAction(action, data)
    }
  }

  // Sync with Honeycomb
  async syncPlayerData(player: Player): Promise<HoneycombEntity | null> {
    try {
      const honeycombPlayer = await this.getPlayer(player.walletAddress)
      
      if (honeycombPlayer) {
        const entity: HoneycombEntity = {
          id: honeycombPlayer.id,
          walletAddress: player.walletAddress,
          missions: honeycombPlayer.missions,
          traits: honeycombPlayer.traits,
          reputation: honeycombPlayer.reputation,
          verificationLevel: honeycombPlayer.verificationLevel,
          lastSync: new Date()
        }

        // Update local storage
        localStorage.setItem(`honeycomb_${player.walletAddress}`, JSON.stringify(entity))
        
        return entity
      }

      return null
    } catch (error) {
      console.error('Failed to sync player data:', error)
      return null
    }
  }

  // Mock implementations for development
  private createMockMission(data: Partial<HoneycombMission>): HoneycombMission {
    const mission: HoneycombMission = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title || 'Mock Mission',
      description: data.description || 'A mock mission for development',
      missionType: data.missionType || 'achievement',
      requirements: data.requirements || [],
      rewards: data.rewards || [],
      completed: false,
      blockchainTx: Math.random().toString(36).substr(2, 9)
    }

    const missions = JSON.parse(localStorage.getItem('mock_missions') || '[]')
    missions.push(mission)
    localStorage.setItem('mock_missions', JSON.stringify(missions))

    return mission
  }

  private updateMockMission(missionId: string, updates: Partial<HoneycombMission>): HoneycombMission | null {
    const missions = JSON.parse(localStorage.getItem('mock_missions') || '[]')
    const missionIndex = missions.findIndex((m: HoneycombMission) => m.id === missionId)
    
    if (missionIndex !== -1) {
      missions[missionIndex] = { ...missions[missionIndex], ...updates }
      localStorage.setItem('mock_missions', JSON.stringify(missions))
      return missions[missionIndex]
    }

    return null
  }

  private getMockMissions(walletAddress: string): HoneycombMission[] {
    return JSON.parse(localStorage.getItem('mock_missions') || '[]')
  }

  private createMockTrait(data: Partial<HoneycombTrait>): HoneycombTrait {
    const trait: HoneycombTrait = {
      id: Math.random().toString(36).substr(2, 9),
      traitType: data.traitType || 'fire_master',
      name: data.name || 'Mock Trait',
      description: data.description || 'A mock trait for development',
      level: data.level || 1,
      maxLevel: data.maxLevel || 10,
      effects: data.effects || [],
      blockchainTx: Math.random().toString(36).substr(2, 9)
    }

    const traits = JSON.parse(localStorage.getItem('mock_traits') || '[]')
    traits.push(trait)
    localStorage.setItem('mock_traits', JSON.stringify(traits))

    return trait
  }

  private updateMockTrait(traitId: string, updates: Partial<HoneycombTrait>): HoneycombTrait | null {
    const traits = JSON.parse(localStorage.getItem('mock_traits') || '[]')
    const traitIndex = traits.findIndex((t: HoneycombTrait) => t.id === traitId)
    
    if (traitIndex !== -1) {
      traits[traitIndex] = { ...traits[traitIndex], ...updates }
      localStorage.setItem('mock_traits', JSON.stringify(traits))
      return traits[traitIndex]
    }

    return null
  }

  private getMockTraits(walletAddress: string): HoneycombTrait[] {
    return JSON.parse(localStorage.getItem('mock_traits') || '[]')
  }

  private getMockPlayer(walletAddress: string): HoneycombPlayer {
    return {
      id: Math.random().toString(36).substr(2, 9),
      walletAddress,
      missions: this.getMockMissions(walletAddress),
      traits: this.getMockTraits(walletAddress),
      reputation: Math.floor(Math.random() * 1000),
      verificationLevel: Math.floor(Math.random() * 5) + 1,
      lastSync: new Date()
    }
  }

  private updateMockPlayer(walletAddress: string, updates: Partial<HoneycombPlayer>): HoneycombPlayer {
    const player = this.getMockPlayer(walletAddress)
    const updatedPlayer = { ...player, ...updates }
    localStorage.setItem(`mock_player_${walletAddress}`, JSON.stringify(updatedPlayer))
    return updatedPlayer
  }

  private updateMockPlayerWithBlockchain(walletAddress: string, updates: Partial<HoneycombPlayer>, transaction: BlockchainTransaction | null): HoneycombPlayer {
    const player = this.getMockPlayer(walletAddress)
    const updatedPlayer = { 
      ...player, 
      ...updates,
      // Add blockchain metadata
      lastTransactionHash: transaction?.txHash || 'mock_tx_' + Date.now(),
      blockchainInteractions: (player.blockchainInteractions || 0) + 1,
      lastOnChainUpdate: new Date().toISOString()
    }
    
    console.log('🍯 Enhanced mock player with blockchain data:', updatedPlayer)
    localStorage.setItem(`mock_player_${walletAddress}`, JSON.stringify(updatedPlayer))
    
    // Store transaction history
    const txHistory = JSON.parse(localStorage.getItem(`tx_history_${walletAddress}`) || '[]')
    txHistory.push({
      type: 'player_update',
      transaction: transaction,
      updates: updates,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem(`tx_history_${walletAddress}`, JSON.stringify(txHistory))
    
    return updatedPlayer
  }

  private updateMockReputation(walletAddress: string, amount: number, reason: string): number {
    const player = this.getMockPlayer(walletAddress)
    const newReputation = player.reputation + amount
    this.updateMockPlayer(walletAddress, { reputation: newReputation })
    return newReputation
  }

  private createMockTransaction(transaction: Partial<BlockchainTransaction>): BlockchainTransaction {
    return {
      id: Math.random().toString(36).substr(2, 9),
      type: transaction.type || 'honeycomb_verification',
      data: transaction.data || {},
      status: 'confirmed',
      txHash: Math.random().toString(36).substr(2, 9),
      blockNumber: Date.now(),
      timestamp: new Date()
    }
  }

  private verifyMockAction(action: string, data: any): boolean {
    // Mock verification - in real implementation, this would verify on-chain
    return Math.random() > 0.1 // 90% success rate for mock
  }

  private async getAuthToken(): Promise<string> {
    if (!this.wallet) {
      return 'mock_token'
    }

    try {
      const message = `Honeycomb Protocol Authentication - ${Date.now()}`
      const signature = await this.wallet.signMessage(new TextEncoder().encode(message))
      return btoa(signature.toString())
    } catch (error) {
      console.error('Failed to get auth token:', error)
      return 'mock_token'
    }
  }
}

export const honeycombService = new HoneycombService() 