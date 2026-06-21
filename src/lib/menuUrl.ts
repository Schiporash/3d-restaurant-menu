export function buildMenuUrl(table: string | string[] | undefined): string {
  const value = Array.isArray(table) ? table[0] : table;
  const tableId = value && value.trim() !== "" ? value : "1";
  return `/menu?table=${encodeURIComponent(tableId)}`;
}
