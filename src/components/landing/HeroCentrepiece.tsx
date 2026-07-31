"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import type { Group } from "three";

/**
 * A soft warm orb that slowly breathes and turns — the hero's living
 * centrepiece, replacing the old torus. Offset below the wordmark (as the
 * torus was) so the form and the title never share the same plane.
 */
function MorphingOrb({ animate }: { animate: boolean }) {
  const ref = useRef<Group>(null);

  useFrame((_, delta) => {
    if (animate && ref.current) {
      ref.current.rotation.y += delta * 0.15;
      ref.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={ref} position={[0, -1.5, 0]}>
      <mesh>
        {/* Dense enough that the distortion reads as a smooth swell, not facets. */}
        <sphereGeometry args={[1.35, 64, 64]} />
        <MeshDistortMaterial
          color="#e0a458"
          emissive="#b5763f"
          emissiveIntensity={0.18}
          roughness={0.28}
          metalness={0.35}
          // Gentle, candlelit breathing — stilled for reduced-motion users.
          distort={animate ? 0.38 : 0.2}
          speed={animate ? 1.6 : 0}
        />
      </mesh>
    </group>
  );
}

export default function HeroCentrepiece() {
  const reduce = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-45"
      data-testid="hero-centrepiece"
      aria-hidden="true"
    >
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.45} />
        <directionalLight position={[4, 5, 5]} intensity={1.1} color="#ffe6c4" />
        <directionalLight position={[-4, -2, -3]} intensity={0.4} color="#7d8b6a" />
        {/* Warm fill from just in front of the orb gives it an inner-glow feel. */}
        <pointLight position={[0, -1.2, 3]} intensity={6} distance={10} color="#e0a458" />
        <MorphingOrb animate={!reduce} />
      </Canvas>
    </div>
  );
}
