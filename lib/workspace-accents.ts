export const WORKSPACE_ACCENTS = [
  { id: "indigo", label: "Indigo", value: "#4F46E5" },
  { id: "emerald", label: "Emerald", value: "#10B981" },
  { id: "amber", label: "Amber", value: "#F59E0B" },
  { id: "slate", label: "Ink", value: "#0F172A" },
  { id: "sky", label: "Sky", value: "#0EA5E9" },
  { id: "rose", label: "Rose", value: "#F43F5E" },
] as const;

export function isWorkspaceAccent(value: string) {
  return WORKSPACE_ACCENTS.some((accent) => accent.value === value);
}
