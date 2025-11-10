import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
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
  uniform float uTexAspect1;
  uniform float uTexAspect2;
  uniform float uViewAspect;

  // Simple procedural noise
  float noise(vec2 p){
    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main(){
    vec2 uv = vUv;

    // Helper to compute contain UV for a texture so it behaves like object-fit: contain (full image visible)
    vec2 containUV(vec2 uv0, float texAspect, float viewAspect) {
      float r = texAspect / viewAspect;
      // If texture is relatively wider than view, shrink X; otherwise shrink Y
      vec2 scale = (r > 1.0) ? vec2(1.0 / r, 1.0) : vec2(1.0, r);
      return (uv0 - 0.5) * scale + 0.5;
    }

    vec2 uv1 = containUV(uv, uTexAspect1, uViewAspect);
    vec2 uv2 = containUV(uv, uTexAspect2, uViewAspect);

    // displacement-like effect using uv perturbation
    float n = noise(uv * 10.0);
    float disp = smoothstep(0.0, 1.0, uMix);
    vec2 offset = vec2((n - 0.5) * 0.08 * (1.0 - disp), (n - 0.5) * 0.08 * disp);

    vec4 colA = texture2D(uTex1, uv1 + offset);
    vec4 colB = texture2D(uTex2, uv2 - offset);

    gl_FragColor = mix(colA, colB, disp);
  }
`;


function SlideMesh({ tex1, tex2, mixUniform, aspect1, aspect2 }: { tex1: THREE.Texture; tex2: THREE.Texture; mixUniform: React.MutableRefObject<number>; aspect1: number; aspect2: number; }){
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { size } = useThree();

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTex1.value = tex1;
      materialRef.current.uniforms.uTex2.value = tex2;
      materialRef.current.uniforms.uTexAspect1.value = aspect1;
      materialRef.current.uniforms.uTexAspect2.value = aspect2;
      // set initial view aspect
      materialRef.current.uniforms.uViewAspect.value = size.width / Math.max(1, size.height);
    }
  }, [tex1, tex2, aspect1, aspect2, size.width, size.height]);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uMix.value = mixUniform.current;
      // keep view aspect in sync with canvas size
      materialRef.current.uniforms.uViewAspect.value = size.width / Math.max(1, size.height);
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
          uTexAspect1: { value: aspect1 },
          uTexAspect2: { value: aspect2 },
          uViewAspect: { value: size.width / Math.max(1, size.height) },
        }}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}


function R3FScene({ images, index, nextIndex, mixRef }: { images: string[]; index: number; nextIndex: number; mixRef: React.MutableRefObject<number>; }) {
  // load textures inside the canvas context
  const textures = useLoader(THREE.TextureLoader, images);

  useMemo(() => {
    textures.forEach((t) => {
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      t.needsUpdate = true;
    });
  }, [textures]);

  const tex1 = textures[index];
  const tex2 = textures[nextIndex];

  const aspect1 = tex1 && tex1.image && (tex1.image as any).width && (tex1.image as any).height ? (tex1.image as any).width / (tex1.image as any).height : 1;
  const aspect2 = tex2 && tex2.image && (tex2.image as any).width && (tex2.image as any).height ? (tex2.image as any).width / (tex2.image as any).height : 1;

  return (
    <>
      <SlideMesh tex1={tex1} tex2={tex2} mixUniform={mixRef} aspect1={aspect1} aspect2={aspect2} />
    </>
  );
}

export const WebGLSlider: React.FC<WebGLSliderProps> = ({ images, className = '', autoplay = true, interval = 4000 }) => {
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1 % Math.max(1, images.length));
  const mixRef = useRef(0); // shader mix value
  const targetRef = useRef(0);
  // textures are loaded inside the Canvas via R3FScene

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

  const aspectStr1 = undefined;

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0" style={aspectStr1 ? { aspectRatio: aspectStr1 } : {}}>
          <Canvas orthographic camera={{ position: [0, 0, 5], zoom: 1 }}>
          <ambientLight />
          <R3FScene images={images} index={index} nextIndex={nextIndex} mixRef={mixRef} />
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
