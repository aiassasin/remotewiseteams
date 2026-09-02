export const WORKSPACE_ACCENTS = [
  { id: "trust", label: "Trust blue", value: "#2563EB" },
  { id: "navy", label: "Navy", value: "#0B1A33" },
  { id: "emerald", label: "Emerald", value: "#059669" },
  { id: "indigo", label: "Indigo", value: "#4F46E5" },
  { id: "amber", label: "Amber", value: "#EA580C" },
  { id: "slate", label: "Ink", value: "#1E293B" },
] as const;

export function isWorkspaceAccent(value: string) {
  return WORKSPACE_ACCENTS.some((accent) => accent.value === value);
}
