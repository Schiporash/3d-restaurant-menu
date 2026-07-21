export function resolveTableId(table: string | string[] | undefined): string {
  const value = Array.isArray(table) ? table[0] : table;
  return value && value.trim() !== "" ? value : "1";
}

export function buildMenuUrl(table: string | string[] | undefined): string {
  return `/menu?table=${encodeURIComponent(resolveTableId(table))}`;
}
