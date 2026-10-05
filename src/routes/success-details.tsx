import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import fingerprintShield from "@/assets/fingerprint-shield.png";

const detailsSearchSchema = z.object({
  name: z.string().max(100).catch(""),
  upi: z.string().max(100).catch(""),
  // Numeric amounts arrive JSON-parsed as numbers; normalize back to string.
  amount: z.preprocess(
    (v) =>
      typeof v === "number"
        ? String(v)
        : typeof v === "string"
          ? v.replace(/"/g, "")
          : v,
    z.string().max(12).catch(""),
  ),
  message: z.string().max(100).catch(""),
  // Set when the user opened this page from the History tab.
  from: z.string().max(20).catch(""),
});

export const Route = createFileRoute("/success-details")({
  validateSearch: (search) => detailsSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Transaction Successful — Details" },
      {
        name: "description",
        content: "Full transaction details: transfer ID, UTR, debited account and more.",
      },
      { property: "og:title", content: "Transaction Successful — Details" },
      {
        property: "og:description",
        content: "Full transaction details: transfer ID, UTR, debited account and more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TransactionDetailsPage,
});

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return (parts[0] ?? "").slice(0, 2).toUpperCase();
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

function formatDetailTime(d: Date) {
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-GB", { month: "short" });
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm} on ${day} ${month} ${year}`;
}

function CopyIcon() {
  return (
    <svg
      className="h-6 w-6 text-[#A78BFA]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V5a2 2 0 012-2h9a2 2 0 012 2v9a2 2 0 01-2 2h-2M5 8h9a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9a2 2 0 012-2z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-6 w-6 text-green-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function TransactionDetailsPage() {
  const navigate = useNavigate();
  const { name, upi, amount, from } = Route.useSearch();
  const cameFromHistory = from === "history";
  const [copied, setCopied] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(true);

  const [transactionId] = useState(
    () =>
      "T" +
      Array.from({ length: 22 }, () => Math.floor(Math.random() * 10)).join(""),
  );
  const [utr] = useState(
    () => Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join(""),
  );

  const timestamp = useMemo(() => formatDetailTime(new Date()), []);

  const copy = (key: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(key);
    window.setTimeout(
      () => setCopied((c) => (c === key ? null : c)),
      1500,
    );
  };

  const formattedAmount = (() => {
    const n = Number(amount);
    if (!Number.isFinite(n) || amount === "") return amount;
    return n % 1 === 0
      ? n.toLocaleString("en-IN")
      : n.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  })();

  const actions: { label: string; icon: ReactNode; onClick?: () => void }[] = [
    {
      label: "Send Again",
      icon: (
        <svg
          className="h-6 w-6 text-[#A78BFA]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 17L17 7m0 0H9m8 0v8"
          />
        </svg>
      ),
    },
    {
      label: "View History",
      icon: (
        <svg
          className="h-6 w-6 text-[#A78BFA]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
        </svg>
      ),
      onClick: () =>
        navigate({
          to: "/",
          search: cameFromHistory ? { tab: "history" } : {},
          replace: true,
        }),
    },
    {
      label: "Split Expense",
      icon: (
        <svg
          className="h-6 w-6 text-[#A78BFA]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path strokeLinecap="round" d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
      ),
    },
    {
      label: "Share Receipt",
      icon: (
        <svg
          className="h-6 w-6 text-[#A78BFA]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path strokeLinecap="round" d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen justify-center bg-[#0f0f0f]">
      <div className="flex w-full max-w-[430px] flex-col bg-[#0f0f0f]">
        {/* Green header */}
        <div className="flex items-center gap-4 bg-[#2E7D46] px-4 py-5">
          <button
            type="button"
            aria-label="Back"
            onClick={() =>
              cameFromHistory
                ? // Opened from History: back returns to the history tab on
                  // the home page, not to the /success page.
                  navigate({ to: "/", search: { tab: "history" }, replace: true })
                : navigate({
                    to: "/success",
                    search: { name, upi, amount, message: "" },
                  })
            }
            className="rounded-full p-1 text-white transition-colors hover:bg-white/10"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 12H5m0 0l7-7m-7 7l7 7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">
              Transaction Successful
            </h1>
            <p className="mt-0.5 text-sm font-medium text-white/90">
              {timestamp}
            </p>
          </div>
        </div>

        {/* Paid to card */}
        <div className="mx-3 mt-4 rounded-2xl bg-[#1c1c1c] p-5">
          <p className="text-lg font-bold text-white">Paid to</p>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#29A9E0]">
              <span className="text-sm font-semibold text-white">
                {getInitials(name) || "PP"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="break-words text-xl font-semibold leading-snug text-white">
                {name || "Receiver"}
              </p>
              <p className="mt-0.5 truncate text-base text-zinc-400">
                {upi || "—"}
              </p>
            </div>
            <p className="shrink-0 text-xl font-bold text-white">
              ₹{formattedAmount}
            </p>
          </div>

          <div className="mt-5 border-t border-zinc-700/70" />

          {/* Transfer Details */}
          <button
            type="button"
            aria-expanded={detailsOpen}
            onClick={() => setDetailsOpen((o) => !o)}
            className="mt-4 flex w-full items-center gap-4 text-left"
          >
            <span className="text-[#A78BFA]">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6M9 8h6M5 21h14a1 1 0 001-1V4a1 1 0 00-1-1H5a1 1 0 00-1 1v16a1 1 0 001 1z"
                />
              </svg>
            </span>
            <span className="text-lg font-medium text-white">
              Transfer Details
            </span>
            <svg
              className={`ml-auto h-5 w-5 text-white transition-transform duration-200 ${
                detailsOpen ? "" : "rotate-180"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* Collapsible drawer: transaction ID + debited from */}
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              detailsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="min-h-0">
                {/* PhonePe Transaction ID */}
                <p className="mt-5 text-base text-zinc-400">PhonePe Transaction ID</p>
          <div className="mt-1 flex items-start justify-between gap-4">
            <p className="break-all text-lg font-medium text-white">
              {transactionId}
            </p>
            <button
              type="button"
              aria-label="Copy transaction ID"
              onClick={() => copy("txn", transactionId)}
              className="shrink-0 p-1"
            >
              {copied === "txn" ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>

          {/* Debited from */}
          <p className="mt-6 text-base text-zinc-400">Debited from</p>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#0a3d8f" />
                <path
                  d="M12 5v14M8 8.5c0-1.4 1.8-2.5 4-2.5s4 1.1 4 2.5-1.8 2.5-4 2.5-4 1.1-4 2.5 1.8 2.5 4 2.5 4-1.1 4-2.5"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xl font-semibold text-white">XXXXXXXX8950</p>
                <p className="shrink-0 text-xl font-bold text-white">
                  ₹{formattedAmount}
                </p>
              </div>
              <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="truncate text-base text-zinc-300">UTR: {utr}</p>
                  <button
                    type="button"
                    aria-label="Copy UTR"
                    onClick={() => copy("utr", utr)}
                    className="shrink-0 p-1"
                  >
                    {copied === "utr" ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              </div>
            </div>
          </div>
            </div>
          </div>

          <div className="mt-6 border-t border-zinc-700/70" />

          {/* Action buttons */}
          <div className="mt-5 flex items-start justify-between">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className="flex w-1/4 flex-col items-center gap-2"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3A2C6B]">
                  {action.icon}
                </span>
                <span className="text-center text-sm text-white">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Contact support card */}
        <button
          type="button"
          className="mx-3 mt-4 flex items-center gap-4 rounded-2xl bg-[#1c1c1c] px-5 py-5 text-left"
        >
          <span className="text-[#A78BFA]">
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          </span>
          <span className="text-lg font-medium text-white">
            Contact PhonePe Support
          </span>
          <svg
            className="ml-auto h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Fingerprint promo card */}
        <div className="mx-3 mb-4 mt-4 flex items-center gap-4 rounded-2xl bg-[#1c1c1c] p-5">
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold leading-snug text-white">
              Pay securely with fingerprint
            </p>
            <p className="mt-2 text-base leading-snug text-zinc-300">
              Enjoy seamless and safer payments up to ₹10,000.
            </p>
            <button
              type="button"
              className="mt-4 rounded-lg bg-[#7C5CFC] px-5 py-2.5 text-base font-bold text-white transition-colors hover:bg-[#6b4be0]"
            >
              Activate Now
            </button>
          </div>
          <img
            src={fingerprintShield}
            alt="Fingerprint security shield"
            className="w-28 shrink-0"
          />
        </div>

        {/* Powered by */}
        <div className="mt-auto pb-10 pt-2 text-center">
          <p className="text-base text-zinc-300">Powered by</p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M3 21L21 3v10L11 21H3z" fill="#f4801f" />
                <path d="M21 3L11 13v8l10-8V3z" fill="#1d7a3e" />
              </svg>
              <span className="text-xl font-extrabold italic tracking-tight text-white">
                UPI
              </span>
            </div>
            <span className="text-zinc-500">|</span>
            <div className="flex items-center gap-1.5">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l10 10-10 10L2 12 12 2z" fill="#b81c4e" />
              </svg>
              <span className="text-sm font-bold tracking-wide text-[#b81c4e]">
                AXIS BANK
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
