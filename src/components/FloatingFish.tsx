import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface FishProps {
  position: [number, number, number];
  color: string;
  speed: number;
}

const Fish = ({ position, color, speed }: FishProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      timeRef.current += delta * speed;
      
      // Swim in a circular pattern
      const radius = 2;
      groupRef.current.position.x = position[0] + Math.cos(timeRef.current) * radius;
      groupRef.current.position.z = position[2] + Math.sin(timeRef.current) * radius;
      groupRef.current.position.y = position[1] + Math.sin(timeRef.current * 2) * 0.3;
      
      // Rotate to face direction of movement
      groupRef.current.rotation.y = Math.atan2(
        Math.cos(timeRef.current),
        Math.sin(timeRef.current)
      );
      
      // Tail wiggle
      const tail = groupRef.current.children[1];
      if (tail) {
        tail.rotation.y = Math.sin(timeRef.current * 10) * 0.3;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Tail */}
      <mesh position={[-0.3, 0, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.2, 0.3, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Fins */}
      <mesh position={[0, -0.15, 0.15]} rotation={[0.5, 0, 0]}>
        <coneGeometry args={[0.1, 0.2, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, -0.15, -0.15]} rotation={[0.5, 0, 0]}>
        <coneGeometry args={[0.1, 0.2, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Eye */}
      <mesh position={[0.25, 0.1, 0.1]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
};

const FloatingFish = () => {
  const fishes = [
    { position: [2, 1, 0] as [number, number, number], color: '#FF6B6B', speed: 1 },
    { position: [-2, 0.5, 1] as [number, number, number], color: '#4ECDC4', speed: 1.3 },
    { position: [0, 1.5, -2] as [number, number, number], color: '#FFD93D', speed: 0.8 },
    { position: [1, 0, 2] as [number, number, number], color: '#6BCB77', speed: 1.1 },
  ];

  return (
    <div className="fixed inset-0 -z-5 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4ECDC4" />
        
        {fishes.map((fish, index) => (
          <Fish key={index} {...fish} />
        ))}
      </Canvas>
    </div>
  );
};

export default FloatingFish;
