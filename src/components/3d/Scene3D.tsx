import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const CodeSymbols = () => {
  return (
    <group>
      {/* HTML Opening Bracket < */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh position={[-2, 0.5, 0]} castShadow rotation={[0, Math.PI / 6, 0]}>
          <boxGeometry args={[0.3, 2, 0.3]} />
          <meshStandardMaterial
            color="#6C5CE7"
            roughness={0.2}
            metalness={0.8}
            emissive="#6C5CE7"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[-1.3, 1, 0]} castShadow rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[1.2, 0.3, 0.3]} />
          <meshStandardMaterial
            color="#6C5CE7"
            roughness={0.2}
            metalness={0.8}
            emissive="#6C5CE7"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[-1.3, 0, 0]} castShadow rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1.2, 0.3, 0.3]} />
          <meshStandardMaterial
            color="#6C5CE7"
            roughness={0.2}
            metalness={0.8}
            emissive="#6C5CE7"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>

      {/* HTML Closing Bracket > */}
      <Float speed={2.2} rotationIntensity={0.3} floatIntensity={0.7}>
        <mesh position={[2, 0.5, 0]} castShadow rotation={[0, -Math.PI / 6, 0]}>
          <boxGeometry args={[0.3, 2, 0.3]} />
          <meshStandardMaterial
            color="#00D1FF"
            roughness={0.2}
            metalness={0.8}
            emissive="#00D1FF"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[1.3, 1, 0]} castShadow rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1.2, 0.3, 0.3]} />
          <meshStandardMaterial
            color="#00D1FF"
            roughness={0.2}
            metalness={0.8}
            emissive="#00D1FF"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[1.3, 0, 0]} castShadow rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[1.2, 0.3, 0.3]} />
          <meshStandardMaterial
            color="#00D1FF"
            roughness={0.2}
            metalness={0.8}
            emissive="#00D1FF"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>

      {/* Curly Brace { */}
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh position={[-3.5, -1.5, 1]} castShadow>
          <torusGeometry args={[0.4, 0.15, 16, 32, Math.PI]} />
          <meshStandardMaterial
            color="#8B5CF6"
            roughness={0.1}
            metalness={0.9}
            emissive="#8B5CF6"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[-3.5, -1.5, 1]} castShadow>
          <boxGeometry args={[0.15, 0.8, 0.15]} />
          <meshStandardMaterial
            color="#8B5CF6"
            roughness={0.1}
            metalness={0.9}
            emissive="#8B5CF6"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      {/* Forward Slash / */}
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.9}>
        <mesh position={[0, -1.8, -0.5]} castShadow rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[0.3, 2.5, 0.3]} />
          <meshStandardMaterial
            color="#60A5FA"
            roughness={0.15}
            metalness={0.85}
            emissive="#60A5FA"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      {/* Terminal cursor block */}
      <Float speed={2.8} rotationIntensity={0.2} floatIntensity={1}>
        <mesh position={[3.5, -1, -1]} castShadow>
          <boxGeometry args={[0.6, 1.2, 0.3]} />
          <MeshDistortMaterial
            color="#22C55E"
            attach="material"
            distort={0.2}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            emissive="#22C55E"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>

      {/* Semicolon ; */}
      <Float speed={3.5} rotationIntensity={0.6} floatIntensity={1.1}>
        <mesh position={[1.5, 2, 1]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#F59E0B"
            roughness={0.2}
            metalness={0.8}
            emissive="#F59E0B"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[1.5, 1.5, 1]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial
            color="#F59E0B"
            roughness={0.2}
            metalness={0.8}
            emissive="#F59E0B"
            emissiveIntensity={0.6}
          />
        </mesh>
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
