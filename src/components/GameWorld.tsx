import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Sky, 
  Stars, 
  Text, 
  Float, 
  Environment,
  PerspectiveCamera,
  Html
} from '@react-three/drei'
import { Physics, useBox, usePlane } from '@react-three/cannon'
import { useSpring, animated } from '@react-spring/three'
import { useGame } from '@/stores/GameStore'
import { Player, Entity, WorldPosition, BiomeType } from '@/types'

// Player Character Component
const PlayerCharacter: React.FC<{ player: Player }> = ({ player }) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [player.position?.x || 0, player.position?.y || 1, player.position?.z || 0],
    args: [0.5, 1, 0.5]
  }))

  const [spring, apiSpring] = useSpring(() => ({
    position: [player.position?.x || 0, player.position?.y || 1, player.position?.z || 0],
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 300, friction: 30 }
  }))

  useFrame(() => {
    // Update player position based on input
  })

  return (
    <animated.mesh ref={ref} {...spring}>
      <boxGeometry args={[0.5, 1, 0.5]} />
      <meshStandardMaterial color="#4f46e5" />
      <Html position={[0, 1.5, 0]}>
        <div className="bg-black/80 text-white px-2 py-1 rounded text-xs">
          {player.name}
        </div>
      </Html>
    </animated.mesh>
  )
}

// Terrain Component
const Terrain: React.FC<{ biome: BiomeType }> = ({ biome }) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    args: [100, 100]
  }))

  const getBiomeColor = (biome: BiomeType) => {
    switch (biome) {
      case 'forest': return '#166534'
      case 'desert': return '#d97706'
      case 'mountain': return '#6b7280'
      case 'ocean': return '#1e40af'
      case 'void': return '#1f2937'
      case 'honeycomb_realm': return '#f59e0b'
      default: return '#166534'
    }
  }

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={getBiomeColor(biome)} />
    </mesh>
  )
}

// Honeycomb Shrine Component
const HoneycombShrine: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.2} />
      </mesh>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.5}
          color="#f59e0b"
          anchorX="center"
          anchorY="middle"
        >
          Honeycomb Shrine
        </Text>
      </Float>
    </group>
  )
}

// UI Overlay Component
const GameUI: React.FC = () => {
  const { player } = useGame()

  if (!player) return null

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Health Bar */}
      <div className="absolute top-4 left-4 bg-black/50 rounded-lg p-3 pointer-events-auto">
        <div className="text-white text-sm mb-1">Health</div>
        <div className="w-32 h-2 bg-gray-700 rounded-full">
          <div 
            className="h-full bg-red-500 rounded-full transition-all duration-300"
            style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
          />
        </div>
        <div className="text-white text-xs mt-1">
          {player.health} / {player.maxHealth}
        </div>
      </div>

      {/* Experience Bar */}
      <div className="absolute top-4 left-48 bg-black/50 rounded-lg p-3 pointer-events-auto">
        <div className="text-white text-sm mb-1">Level {player.level}</div>
        <div className="w-32 h-2 bg-gray-700 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(player.experience / player.experienceToNext) * 100}%` }}
          />
        </div>
        <div className="text-white text-xs mt-1">
          {player.experience} / {player.experienceToNext} XP
        </div>
      </div>

      {/* Honeycomb Status */}
      <div className="absolute top-4 right-4 bg-black/50 rounded-lg p-3 pointer-events-auto">
        <div className="text-yellow-400 text-sm mb-1">🍯 Honeycomb</div>
        <div className="text-white text-xs">
          Reputation: {player.honeycombReputation}
        </div>
        <div className="text-white text-xs">
          Missions: {player.missions.filter(m => !m.completed).length}
        </div>
      </div>
    </div>
  )
}

// Main Game World Component
const GameWorld: React.FC = () => {
  const { player } = useGame()

  if (!player) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-xl">Connect your wallet to start playing</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 75 }}>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} />

        {/* Environment */}
        <Sky sunPosition={[100, 20, 100]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="sunset" />

        {/* Physics World */}
        <Physics gravity={[0, -9.81, 0]}>
          {/* Terrain */}
          <Terrain biome={player.position?.biome || 'forest'} />

          {/* Player */}
          <PlayerCharacter player={player} />

          {/* Honeycomb Shrine */}
          <HoneycombShrine position={[0, 0, 15]} />
        </Physics>

        {/* Camera Controls */}
        <OrbitControls 
          target={[0, 0, 0]}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>

      {/* UI Overlay */}
      <GameUI />
    </div>
  )
}

export default GameWorld 