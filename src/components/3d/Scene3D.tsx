import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const GeometricShapes = () => {
  return (
    <group>
      {/* Main cube cluster */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <MeshDistortMaterial
            color="#6C5CE7"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            emissive="#6C5CE7"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      {/* Orbiting torus */}
      <Float speed={3} rotationIntensity={1} floatIntensity={0.8}>
        <mesh position={[3, 1, 0]} castShadow>
          <torusGeometry args={[0.8, 0.3, 16, 32]} />
          <MeshDistortMaterial
            color="#00D1FF"
            attach="material"
            distort={0.2}
            speed={3}
            roughness={0.2}
            metalness={0.8}
            emissive="#00D1FF"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>

      {/* Floating octahedron */}
      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1}>
        <mesh position={[-2.5, -1, 1]} castShadow>
          <octahedronGeometry args={[1]} />
          <meshStandardMaterial
            color="#8B5CF6"
            roughness={0.1}
            metalness={0.9}
            emissive="#8B5CF6"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>

      {/* Small accent sphere */}
      <Float speed={4} rotationIntensity={0.3} floatIntensity={1.2}>
        <mesh position={[2, -2, -1]} castShadow>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial
            color="#60A5FA"
            roughness={0.15}
            metalness={0.85}
            emissive="#60A5FA"
            emissiveIntensity={0.5}
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
          <GeometricShapes />

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
