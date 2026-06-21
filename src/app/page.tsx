import { redirect } from "next/navigation";
import { buildMenuUrl } from "@/lib/menuUrl";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string | string[] }>;
}) {
  const params = await searchParams;
  redirect(buildMenuUrl(params.table));
}
