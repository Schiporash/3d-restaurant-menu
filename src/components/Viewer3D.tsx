"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Dish } from "@/types/menu";

function DishMesh({ shape, color }: { shape: Dish["modelShape"]; color: string }) {
  const material = <meshStandardMaterial color={color} />;

  switch (shape) {
    case "box":
      return (
        <mesh>
          <boxGeometry args={[1.4, 1.4, 1.4]} />
          {material}
        </mesh>
      );
    case "torus":
      return (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.4, 16, 32]} />
          {material}
        </mesh>
      );
    case "cone":
      return (
        <mesh>
          <coneGeometry args={[1, 1.6, 32]} />
          {material}
        </mesh>
      );
    case "cylinder":
      return (
        <mesh>
          <cylinderGeometry args={[1, 1, 1.2, 32]} />
          {material}
        </mesh>
      );
    default:
      return (
        <mesh>
          <sphereGeometry args={[1.2, 32, 32]} />
          {material}
        </mesh>
      );
  }
}

export default function Viewer3D({ dish }: { dish: Dish }) {
  return (
    <div
      className="h-72 w-full overflow-hidden rounded-xl bg-[var(--color-surface)]"
      data-testid="viewer3d"
      data-shape={dish.modelShape}
    >
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <DishMesh shape={dish.modelShape} color={dish.modelColor} />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
