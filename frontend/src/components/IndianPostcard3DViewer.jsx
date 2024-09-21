import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const PostcardMesh = ({ imageUrl = '/postcard.png' }) => {
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  return (
    <mesh>
      <planeGeometry args={[7.5, 5.5]} /> {/* Standard postcard ratio */}
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const IndianPostcard2DViewer = ({ imageUrl }) => {
  return (
    <Canvas style={{ width: '100%', height: '500px' }}>
      <Suspense fallback={<FallbackLoader />}>
        <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={50} />
        <OrbitControls 
          enableRotate={false}
          enableZoom={true}
          enablePan={true}
          minZoom={10}
          maxZoom={500}
        />
        <PostcardMesh imageUrl={imageUrl} />
      </Suspense>
    </Canvas>
  );
};

// Simple fallback component to show while loading
const FallbackLoader = () => (
  <mesh>
    <planeGeometry args={[3.5, 5.5]} />
    <meshBasicMaterial color="#e0e0e0" />
  </mesh>
);

export default IndianPostcard2DViewer;