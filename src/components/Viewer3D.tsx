"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import DishMesh from "./three/DishMesh";
import type { Dish } from "@/types/menu";

export default function Viewer3D({ dish }: { dish: Dish }) {
  return (
    <div
      className="h-72 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[var(--color-surface)] to-[#221a14] ring-1 ring-[var(--color-accent)]/10"
      data-testid="viewer3d"
      data-shape={dish.modelShape}
    >
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} color="#ffe6c4" />
        <directionalLight position={[-4, -2, -3]} intensity={0.3} color="#7d8b6a" />
        <DishMesh shape={dish.modelShape} color={dish.modelColor} />
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={1.2} />
      </Canvas>
    </div>
  );
}
