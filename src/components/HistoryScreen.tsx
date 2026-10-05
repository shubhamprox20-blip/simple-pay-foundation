import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getStoredPayments } from "@/lib/paymentHistory";

export type HistoryTransaction = {
  id: string;
  kind: "paid" | "received" | "bill";
  label: string;
  name: string;
  upi: string;
  amount: number;
  date: string;
  message?: string;
};

export type HistoryMonth = {
  month: string;
  total: string;
  transactions: HistoryTransaction[];
};

export const historyMonths: HistoryMonth[] = [
  {
    month: "October 2026",
    total: "₹145",
    transactions: [
      { id: "t1", kind: "paid", label: "Paid to", name: "EAZYDINER PRIVATE LIMITED", upi: "eazydiner@hdfcbank", amount: 835, date: "1 day ago" },
      { id: "t2", kind: "paid", label: "Paid to", name: "UNITY FOODS", upi: "unityfoods@ybl", amount: 160, date: "1 day ago" },
      { id: "t3", kind: "paid", label: "Paid to", name: "Kashyap and company", upi: "kashyapco@okaxis", amount: 200, date: "1 day ago" },
      { id: "t4", kind: "received", label: "Received from", name: "PARV BADJATYA", upi: "parvbadjatya@okicici", amount: 1120, date: "01 Oct" },
      { id: "t5", kind: "paid", label: "Paid to", name: "MAHESH NAYAR", upi: "maheshnayar@ybl", amount: 50, date: "01 Oct" },
      { id: "t6", kind: "paid", label: "Paid to", name: "Jay Ambe everfresh", upi: "jayambe@paytm", amount: 20, date: "01 Oct" },
    ],
  },
  {
    month: "September 2026",
    total: "₹26,482.34",
    transactions: [
      { id: "t7", kind: "bill", label: "Electricity bill paid", name: "SMT  ASHA PRAVEEN PANCHOLI", upi: "electricity@paytm", amount: 5279, date: "29 Sep" },
      { id: "t8", kind: "paid", label: "Paid to", name: "RELIANCE RETAIL LTD", upi: "relianceretail@icici", amount: 1450, date: "27 Sep" },
      { id: "t9", kind: "paid", label: "Paid to", name: "SWIGGY", upi: "swiggy@icici", amount: 389, date: "25 Sep" },
    ],
  },
];

const formatAmount = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function BankBadge() {
  return (
    <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[2px] bg-white">
      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="#1e3a8a" strokeWidth="2">
        <circle cx="5.5" cy="8" r="3" />
        <circle cx="10.5" cy="8" r="3" stroke="#dc2626" />
      </svg>
    </span>
  );
}

function TxIcon({ kind }: { kind: HistoryTransaction["kind"] }) {
  if (kind === "bill") {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="white" strokeWidth="1.6">
          <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2a2a2a]">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
        {kind === "paid" ? <path d="M7 17 17 7M9 7h8v8" /> : <path d="M17 7 7 17M15 17H7V9" />}
      </svg>
    </div>
  );
}

export function HistoryScreen() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [newPayments, setNewPayments] = useState<HistoryTransaction[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Load payments completed in this app and show them at the top of the
  // current month, newest first.
  useEffect(() => {
    setNewPayments(getStoredPayments());
  }, []);

  const months: HistoryMonth[] = historyMonths.map((m, i) =>
    i === 0 && newPayments.length > 0
      ? { ...m, transactions: [...newPayments, ...m.transactions] }
      : m,
  );

  const openTx = (tx: HistoryTransaction) =>
    navigate({
      from: "/",
      to: "/success-details",
      search: {
        name: tx.name,
        upi: tx.upi,
        amount: String(tx.amount),
        message: tx.message ?? "",
        // Tells the details page to send the user back to the history tab.
        from: "history",
      },
    });

  return (
    <div className="min-h-dvh bg-[#0a0a0a] text-white">
      {/* Top area: help icon row + big title (collapses on scroll) */}
      <div className="px-[22px] pt-3">
        <div className="flex justify-end">
          <HelpIcon />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-[22px] font-bold">History</h1>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-[#3a3a3a] px-4 py-2 text-[13px] font-semibold"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="white" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v9M8.5 12.5 12 16l3.5-3.5" />
            </svg>
            My Statements
          </button>
        </div>
      </div>

      {/* Sticky header shown after scroll: compact title + help, then search */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a] px-[15px] pb-3 pt-3">
        <div
          className={`flex items-center justify-between overflow-hidden px-[2px] transition-all duration-200 ${
            scrolled ? "mb-4 max-h-12 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <span className="pt-4 text-[15px] font-bold">History</span>
          <span className="pt-4"><HelpIcon /></span>
        </div>
        <div className="flex h-[52px] items-center rounded-full bg-[#262626] px-4">
          <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="white" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            placeholder="Search"
            className="ml-4 flex-1 bg-transparent text-[15px] text-white placeholder:text-[#9a9a9a] outline-none"
          />
          <span className="mx-3 h-6 w-px bg-[#4a4a4a]" />
          <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="white" strokeWidth="1.8">
            <path d="M3 8h11M18 8h3M3 16h3M10 16h11" />
            <circle cx="16" cy="8" r="2" />
            <circle cx="8" cy="16" r="2" />
          </svg>
        </div>
      </div>

      {months.map((m) => (
        <section key={m.month}>
          <div className="flex items-center justify-between bg-[#1f1f1f] px-[23px] py-[15px] text-[13px] text-[#d4d4d4]">
            <span>{m.month}</span>
            <span className="flex items-center gap-3 text-[15px] text-white">
              {m.total}
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="#9a9a9a" strokeWidth="2">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </span>
          </div>
          {m.transactions.map((tx, i) => (
            <button
              key={tx.id}
              type="button"
              onClick={() => openTx(tx)}
              className="flex w-full gap-4 pl-[22px] pt-[22px] text-left"
            >
              <TxIcon kind={tx.kind} />
              <div className={`flex-1 pb-[22px] pr-[22px] ${i < m.transactions.length - 1 ? "border-b border-[#2a2a2a]" : ""}`}>
                <div className="text-[11px] text-[#cfcfcf]">{tx.label}</div>
                <div className="mt-0.5 flex items-center justify-between gap-3">
                  <span className="truncate text-[14.5px] tracking-wide">{tx.name}</span>
                  <span className={`shrink-0 text-[15px] font-semibold ${tx.kind === "received" ? "text-[#3fb950]" : ""}`}>
                    {tx.kind === "received" ? `+ ${formatAmount(tx.amount)}` : formatAmount(tx.amount)}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11.5px] text-[#a3a3a3]">
                  <span>{tx.date}</span>
                  <span className="flex items-center gap-1.5">
                    {tx.kind === "received" ? "Credited to" : "Debited from"}
                    <BankBadge />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </section>
      ))}
    </div>
  );
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="white" strokeWidth="1.6">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01" strokeLinecap="round" />
    </svg>
  );
}
