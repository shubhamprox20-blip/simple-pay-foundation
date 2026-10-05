const STORAGE_KEY = "sp:kotak-balance";
export const DEFAULT_BALANCE = 1100.5;

export function getBalance(): number {
  if (typeof window === "undefined") return DEFAULT_BALANCE;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return DEFAULT_BALANCE;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_BALANCE;
}

export function setBalance(value: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, String(value));
}

export function formatBalance(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
