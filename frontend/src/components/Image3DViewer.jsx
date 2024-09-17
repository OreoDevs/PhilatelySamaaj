import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const ImageMesh = ({ imageUrl }) => {
  const meshRef = useRef();

  // Return null if imageUrl is undefined
  if (!imageUrl) {
    console.error("Image URL is undefined.");
    return null; // Do not render the mesh if no image is provided
  }

  const texture = useLoader(THREE.TextureLoader, imageUrl, (loader) => {
    loader.crossOrigin = ''; // Handle CORS issues if needed
  });

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005; // Slowly rotate
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      <boxGeometry args={[5, 5, 0.1]} /> {/* width, height, depth */}
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};


const Image3DViewer = ({ imageUrl }) => {
  return (
    <Canvas style={{ width: '100%', height: '400px' }}>
      <Suspense fallback={<FallbackLoader />}>
        <OrbitControls enableZoom={true} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <ImageMesh imageUrl={imageUrl} />
      </Suspense>
    </Canvas>
  );
};

// Simple fallback component to show while loading
const FallbackLoader = () => (
  <mesh>
    <boxGeometry args={[4, 4, 0.1]} />
    <meshBasicMaterial color="gray" />
  </mesh>
);

export default Image3DViewer;
