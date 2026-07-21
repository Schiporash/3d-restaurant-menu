import type { Dish } from "@/types/menu";

export default function DishMesh({
  shape,
  color,
}: {
  shape: Dish["modelShape"];
  color: string;
}) {
  const material = <meshStandardMaterial color={color} roughness={0.45} metalness={0.1} />;

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
