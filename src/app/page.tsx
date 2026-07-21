import Landing from "@/components/landing/Landing";
import { buildMenuUrl, resolveTableId } from "@/lib/menuUrl";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string | string[] }>;
}) {
  const params = await searchParams;
  return (
    <Landing menuHref={buildMenuUrl(params.table)} tableId={resolveTableId(params.table)} />
  );
}
