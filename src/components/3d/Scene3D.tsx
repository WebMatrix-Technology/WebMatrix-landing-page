import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const CodeSymbols = () => {
  return (
    <group>
      {/* Laptop/Monitor */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <group position={[-3, 0, 0]} rotation={[0, Math.PI / 6, 0]}>
          {/* Screen */}
          <mesh castShadow>
            <boxGeometry args={[2.5, 1.8, 0.1]} />
            <meshStandardMaterial
              color="#1a1a2e"
              roughness={0.3}
              metalness={0.7}
              emissive="#6C5CE7"
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Screen glow */}
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[2.3, 1.6, 0.05]} />
            <meshStandardMaterial
              color="#00D1FF"
              emissive="#00D1FF"
              emissiveIntensity={0.8}
              transparent
              opacity={0.9}
            />
          </mesh>
          {/* Base */}
          <mesh position={[0, -1.1, 0.3]} castShadow>
            <boxGeometry args={[2.5, 0.15, 1]} />
            <meshStandardMaterial
              color="#2a2a3e"
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </group>
      </Float>

      {/* Floating Code Window */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
        <group position={[3, 1, -1]} rotation={[0, -Math.PI / 4, 0]}>
          {/* Window frame */}
          <mesh castShadow>
            <boxGeometry args={[2, 2.5, 0.1]} />
            <meshStandardMaterial
              color="#1e1e30"
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
          {/* Code lines */}
          <mesh position={[-0.6, 0.8, 0.06]} castShadow>
            <boxGeometry args={[0.8, 0.08, 0.05]} />
            <meshStandardMaterial
              color="#6C5CE7"
              emissive="#6C5CE7"
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh position={[-0.5, 0.5, 0.06]} castShadow>
            <boxGeometry args={[1.2, 0.08, 0.05]} />
            <meshStandardMaterial
              color="#00D1FF"
              emissive="#00D1FF"
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh position={[-0.4, 0.2, 0.06]} castShadow>
            <boxGeometry args={[1, 0.08, 0.05]} />
            <meshStandardMaterial
              color="#8B5CF6"
              emissive="#8B5CF6"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[-0.7, -0.1, 0.06]} castShadow>
            <boxGeometry args={[0.6, 0.08, 0.05]} />
            <meshStandardMaterial
              color="#60A5FA"
              emissive="#60A5FA"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[-0.5, -0.4, 0.06]} castShadow>
            <boxGeometry args={[1.1, 0.08, 0.05]} />
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#F59E0B"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      </Float>

      {/* Git Branch Symbol */}
      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.7}>
        <group position={[0, -2, 1]}>
          {/* Main branch line */}
          <mesh castShadow rotation={[0, 0, Math.PI / 6]}>
            <cylinderGeometry args={[0.08, 0.08, 2, 16]} />
            <meshStandardMaterial
              color="#22C55E"
              roughness={0.2}
              metalness={0.8}
              emissive="#22C55E"
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* Branch nodes */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color="#22C55E"
              roughness={0.1}
              metalness={0.9}
              emissive="#22C55E"
              emissiveIntensity={0.7}
            />
          </mesh>
          <mesh position={[0, -0.7, 0]} castShadow>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color="#22C55E"
              roughness={0.1}
              metalness={0.9}
              emissive="#22C55E"
              emissiveIntensity={0.7}
            />
          </mesh>
          {/* Side branch */}
          <mesh position={[0.5, 0, 0]} castShadow rotation={[0, 0, -Math.PI / 3]}>
            <cylinderGeometry args={[0.06, 0.06, 1, 16]} />
            <meshStandardMaterial
              color="#60A5FA"
              roughness={0.2}
              metalness={0.8}
              emissive="#60A5FA"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      </Float>

      {/* API/Function Brackets */}
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <group position={[2.5, -1.5, 0.5]}>
          {/* Opening curly brace */}
          <mesh castShadow>
            <torusGeometry args={[0.4, 0.12, 16, 32, Math.PI]} />
            <meshStandardMaterial
              color="#8B5CF6"
              roughness={0.1}
              metalness={0.9}
              emissive="#8B5CF6"
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh position={[0, -0.2, 0]} castShadow>
            <boxGeometry args={[0.12, 0.6, 0.12]} />
            <meshStandardMaterial
              color="#8B5CF6"
              roughness={0.1}
              metalness={0.9}
              emissive="#8B5CF6"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      </Float>

      {/* Terminal Cursor */}
      <Float speed={3} rotationIntensity={0.1} floatIntensity={1}>
        <mesh position={[-1, 2, 1]} castShadow>
          <boxGeometry args={[0.15, 1, 0.1]} />
          <MeshDistortMaterial
            color="#22C55E"
            attach="material"
            distort={0.15}
            speed={3}
            roughness={0.2}
            metalness={0.8}
            emissive="#22C55E"
            emissiveIntensity={0.8}
          />
        </mesh>
      </Float>

      {/* Database/Stack Symbol */}
      <Float speed={2.8} rotationIntensity={0.4} floatIntensity={0.9}>
        <group position={[-2, -1.5, -1]}>
          {/* Three stacked cylinders representing database layers */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.15, 32]} />
            <meshStandardMaterial
              color="#F59E0B"
              roughness={0.2}
              metalness={0.8}
              emissive="#F59E0B"
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.15, 32]} />
            <meshStandardMaterial
              color="#F59E0B"
              roughness={0.2}
              metalness={0.8}
              emissive="#F59E0B"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[0, -0.4, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.15, 32]} />
            <meshStandardMaterial
              color="#F59E0B"
              roughness={0.2}
              metalness={0.8}
              emissive="#F59E0B"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      </Float>

      {/* React/Component Symbol - Abstract triangular structure */}
      <Float speed={3.2} rotationIntensity={0.5} floatIntensity={0.7}>
        <group position={[4, 0.5, 2]}>
          <mesh castShadow rotation={[0, 0, 0]}>
            <coneGeometry args={[0.5, 1, 3]} />
            <meshStandardMaterial
              color="#00D1FF"
              roughness={0.15}
              metalness={0.85}
              emissive="#00D1FF"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
};

export const Scene3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#6C5CE7" />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#00D1FF" />

          {/* 3D Objects */}
          <CodeSymbols />

          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
