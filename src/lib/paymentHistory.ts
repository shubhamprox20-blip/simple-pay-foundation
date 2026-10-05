// Stores completed payments in localStorage so they appear in the History tab.
import type { HistoryTransaction } from "@/components/HistoryScreen";

const STORAGE_KEY = "simple-pay-history";

export function getStoredPayments(): HistoryTransaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryTransaction[]) : [];
  } catch {
    return [];
  }
}

export function addStoredPayment(input: {
  name: string;
  upi: string;
  amount: string;
  message?: string;
}): void {
  if (typeof window === "undefined") return;
  const amount = Number(input.amount);
  if (!input.name || !Number.isFinite(amount)) return;

  const tx: HistoryTransaction = {
    id: `p-${Date.now()}`,
    kind: "paid",
    label: "Paid to",
    name: input.name,
    upi: input.upi,
    amount,
    date: "Just now",
    ...(input.message ? { message: input.message } : {}),
  };

  const existing = getStoredPayments();
  // Avoid double-adding when the success page remounts with the same payment.
  const isDuplicate = existing.some(
    (t) => t.name === tx.name && t.upi === tx.upi && t.amount === tx.amount && t.date === "Just now",
  );
  if (isDuplicate) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([tx, ...existing]));
  } catch {
    // Storage full or unavailable — ignore.
  }
}
