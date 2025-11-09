import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface WebGLSliderProps {
  images: string[];
  className?: string;
  autoplay?: boolean;
  interval?: number;
}

const VertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FragmentShader = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uTex1;
  uniform sampler2D uTex2;
  uniform float uMix;

  // Simple procedural noise
  float noise(vec2 p){
    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main(){
    vec2 uv = vUv;
    vec4 a = texture2D(uTex1, uv);
    vec4 b = texture2D(uTex2, uv);

    // displacement-like effect using uv perturbation
    float n = noise(uv * 10.0);
    float disp = smoothstep(0.0, 1.0, uMix);
    vec2 offset = vec2((n - 0.5) * 0.08 * (1.0 - disp), (n - 0.5) * 0.08 * disp);

    vec4 colA = texture2D(uTex1, uv + offset);
    vec4 colB = texture2D(uTex2, uv - offset);

    gl_FragColor = mix(colA, colB, disp);
  }
`;

function SlideMesh({ tex1, tex2, mixUniform }: { tex1: THREE.Texture; tex2: THREE.Texture; mixUniform: React.MutableRefObject<number>; }){
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTex1.value = tex1;
      materialRef.current.uniforms.uTex2.value = tex2;
    }
  }, [tex1, tex2]);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uMix.value = mixUniform.current;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VertexShader}
        fragmentShader={FragmentShader}
        uniforms={{
          uTex1: { value: tex1 },
          uTex2: { value: tex2 },
          uMix: { value: mixUniform.current },
        }}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export const WebGLSlider: React.FC<WebGLSliderProps> = ({ images, className = '', autoplay = true, interval = 4000 }) => {
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1 % Math.max(1, images.length));
  const mixRef = useRef(0); // shader mix value
  const targetRef = useRef(0);
  const textures = useLoader(THREE.TextureLoader, images);

  // ensure textures use correct settings
  useMemo(() => {
    textures.forEach((t) => {
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      t.needsUpdate = true;
    });
  }, [textures]);

  useEffect(() => {
    let id: number | undefined;
    if (autoplay && images.length > 1) {
      id = window.setInterval(() => {
        handleNext();
      }, interval);
    }
    return () => { if (id) window.clearInterval(id); };
  }, [autoplay, images.length, index]);

  const animateTo = (to: number) => {
    targetRef.current = to;
  };

  // drive mixRef towards targetRef
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      mixRef.current += (targetRef.current - mixRef.current) * 0.12;
      // when close to 1 and target is 1, finalize swap
      if (Math.abs(targetRef.current - mixRef.current) < 0.001 && targetRef.current === 1) {
        // swap
        setIndex((i) => (i + 1) % images.length);
        setNextIndex((i) => (i + 1) % images.length);
        mixRef.current = 0;
        targetRef.current = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [images.length]);

  const handleNext = () => {
    // set upcoming next index
    setNextIndex((index + 1) % images.length);
    // animate to 1
    animateTo(1);
  };

  const handlePrev = () => {
    // set textures differently: show previous as next
    const prevIdx = (index - 1 + images.length) % images.length;
    // temporarily set nextIndex to prev
    setNextIndex(prevIdx);
    // animate mix inverse by swapping logic: we'll set textures accordingly by updating indices after animation
    // to simplify, just go forward through array until prev appears - acceptable for small sets
    // For immediate prev effect, set index to prev and skip animation
    setIndex(prevIdx);
  };

  // current textures
  const tex1 = textures[index];
  const tex2 = textures[nextIndex];

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0">
        <Canvas orthographic camera={{ position: [0, 0, 5], zoom: 1 }}>
          <ambientLight />
          <SlideMesh tex1={tex1} tex2={tex2} mixUniform={mixRef} />
        </Canvas>
      </div>

      {/* Controls overlay */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20">
        <button onClick={handlePrev} className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2">‹</button>
      </div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
        <button onClick={() => { handleNext(); }} className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2">›</button>
      </div>
    </div>
  );
};

export default WebGLSlider;
