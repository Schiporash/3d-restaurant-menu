"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import DishMesh from "../three/DishMesh";
import type { Group } from "three";

function SlowSpin({ spin }: { spin: boolean }) {
  const ref = useRef<Group>(null);

  useFrame((_, delta) => {
    if (spin && ref.current) {
      ref.current.rotation.y += delta * 0.22;
    }
  });

  return (
    <group ref={ref} rotation={[0.5, 0, 0]}>
      <DishMesh shape="torus" color="#e0a458" />
    </group>
  );
}

export default function HeroCentrepiece() {
  const reduce = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-40"
      data-testid="hero-centrepiece"
      aria-hidden="true"
    >
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.45} />
        <directionalLight position={[4, 5, 5]} intensity={1} color="#ffe6c4" />
        <directionalLight position={[-4, -2, -3]} intensity={0.35} color="#7d8b6a" />
        <SlowSpin spin={!reduce} />
      </Canvas>
    </div>
  );
}
