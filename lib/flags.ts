const FLAG_OFFSET = 127397;

export function countryFlag(code: string | null | undefined) {
  if (!code) return "";
  const upper = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return "";
  return String.fromCodePoint(
    FLAG_OFFSET + upper.charCodeAt(0),
    FLAG_OFFSET + upper.charCodeAt(1),
  );
}
