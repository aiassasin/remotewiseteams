export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "rw-theme";

export function themeStorageKey(userId?: string | null) {
  return userId ? `${THEME_STORAGE_KEY}:${userId}` : THEME_STORAGE_KEY;
}

export function resolveDarkClass(preference: ThemePreference, systemDark: boolean) {
  if (preference === "dark") return true;
  if (preference === "light") return false;
  return systemDark;
}
