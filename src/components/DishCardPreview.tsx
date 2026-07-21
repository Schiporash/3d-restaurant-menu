"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import DishMesh from "./three/DishMesh";
import { buildOrbGradient } from "@/lib/orbGradient";
import type { Dish } from "@/types/menu";

export default function DishCardPreview({ dish }: { dish: Dish }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const show3D = inView || hovered;

  return (
    <div
      ref={ref}
      data-testid="dish-card-preview"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="h-28 w-full overflow-hidden rounded-xl ring-1 ring-black/20"
      style={{ backgroundImage: buildOrbGradient(dish.modelColor) }}
      aria-hidden="true"
    >
      {show3D && (
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 4, 5]} intensity={1} color="#ffe6c4" />
          <DishMesh shape={dish.modelShape} color={dish.modelColor} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
        </Canvas>
      )}
    </div>
  );
}
