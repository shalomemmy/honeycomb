# 🍯 Honeycomb Quest: The Digital Alchemist

A web-based RPG where players become digital alchemists, crafting artifacts and evolving their abilities through on-chain missions powered by Honeycomb Protocol.

## 🎮 Game Concept

**Honeycomb Quest** transforms players into digital alchemists who craft magical artifacts in a mystical laboratory. Each crafting attempt is verified on-chain through Honeycomb Protocol, creating a permanent record of player progression, traits, and achievements.

### Core Gameplay
- **Crafting System**: Mix elements to create artifacts with varying rarity and power
- **Mission-Based Progression**: Each crafting session is a Honeycomb mission with success/failure tracking
- **Trait Evolution**: Player specialization traits evolve based on crafting patterns and success rates
- **Multiplayer Trading**: Trade artifacts with other players, building reputation on-chain
- **Seasonal Competitions**: Compete in crafting tournaments with leaderboards

### Honeycomb Protocol Integration

#### 🎯 Missions & Quests
- **Daily Crafting Missions**: Complete daily crafting challenges for XP and rewards
- **Specialization Quests**: Unlock new crafting recipes through trait-based missions
- **Guild Missions**: Collaborative crafting challenges with pooled progress
- **Seasonal Events**: Limited-time missions with unique rewards

#### 🏷️ Trait Assignment & Evolution
- **Elemental Mastery**: Fire, Water, Earth, Air specialization traits
- **Crafting Efficiency**: Speed and success rate traits
- **Artifact Affinity**: Rarity and power bonuses for specific artifact types
- **Reputation Traits**: Trading and guild membership status

#### 📈 On-Chain Progression
- **Experience Points**: Earned through successful crafting and mission completion
- **Skill Trees**: Unlock new abilities and crafting recipes
- **Achievement System**: Permanent on-chain badges and milestones
- **Reputation System**: Trading history and guild contributions

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Three.js
- **Blockchain**: Solana + Honeycomb Protocol
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: Zustand
- **Build Tool**: Vite

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Solana CLI tools
- Phantom or Solflare wallet

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd honeycomb-quest

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env.local` file:

```env
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_HONEYCOMB_PROGRAM_ID=your_honeycomb_program_id
VITE_APP_ENV=devnet
```

## 🎯 Game Features

### 1. Crafting Laboratory
- Interactive 2D laboratory interface
- Element mixing system with visual feedback
- Real-time crafting progress with Honeycomb mission tracking
- Artifact preview and statistics

### 2. Player Progression
- Level-based progression system
- Skill tree with branching paths
- Trait evolution based on crafting patterns
- Achievement system with on-chain verification

### 3. Multiplayer Features
- Player marketplace for artifact trading
- Guild system with collaborative missions
- Real-time leaderboards
- Reputation tracking

### 4. Seasonal Content
- Monthly crafting competitions
- Limited-time artifacts and recipes
- Special event missions
- Community challenges

## 🏆 Judging Criteria Alignment

### ✅ Use of Honeycomb in Meaningful Way
- Every crafting action creates a Honeycomb mission
- Player traits evolve based on on-chain actions
- Progression system fully integrated with Honeycomb
- Reputation and achievements permanently stored

### ✅ Creative Game Design
- Unique alchemy-based crafting system
- Elemental trait system with visual feedback
- Seasonal competitions and guild mechanics
- Mobile-responsive design

### ✅ Code Quality
- Modular React components
- TypeScript for type safety
- Comprehensive documentation
- Clean architecture with separation of concerns

### ✅ Replayability & Community
- Infinite crafting combinations
- Guild-based collaborative gameplay
- Trading system encourages social interaction
- Seasonal events maintain engagement

### ✅ Solana Integration
- Solana Pay for in-game purchases
- Metaplex for NFT artifacts
- Verxio for loyalty streaks
- Anchor for custom program logic

## 🎮 How to Play

1. **Connect Wallet**: Connect your Solana wallet to start
2. **Choose Elements**: Select from Fire, Water, Earth, Air elements
3. **Craft Artifacts**: Mix elements to create artifacts with different properties
4. **Complete Missions**: Each crafting session is a Honeycomb mission
5. **Evolve Traits**: Your specialization traits evolve based on crafting patterns
6. **Trade & Compete**: Trade artifacts and compete in seasonal events

## 📱 Mobile Support

The game is fully responsive and optimized for mobile devices:
- Touch-friendly controls
- Adaptive UI for different screen sizes
- Mobile-optimized performance
- Offline capability for basic features

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── stores/             # Zustand state management
├── services/           # API and blockchain services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Game assets and sprites
```

### Key Components
- `CraftingLab`: Main game interface
- `ElementMixer`: Element selection and mixing
- `MissionTracker`: Honeycomb mission integration
- `TraitDisplay`: Player trait visualization
- `Marketplace`: Trading interface

## 🎯 Future Enhancements

- 3D laboratory environment
- VR/AR support
- Advanced AI opponents
- Cross-chain compatibility
- Mobile app version

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

This project was created for the Honeycomb Protocol Game Jam. For questions or contributions, please open an issue or pull request.

---

**Built with ❤️ for the Honeycomb Protocol community** 