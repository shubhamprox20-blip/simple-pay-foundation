import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import glowtripAd from "../assets/glowtrip-ad.png";
import {
  DEFAULT_BALANCE,
  formatBalance,
  getBalance,
  setBalance,
} from "../lib/balance";

export const Route = createFileRoute("/balance-success")({
  head: () => ({
    meta: [
      { title: "Balance Check Successful — Kotak Mahindra Bank" },
      {
        name: "description",
        content:
          "Your balance check was successful. See your available balance and latest offers.",
      },
      {
        property: "og:title",
        content: "Balance Check Successful — Kotak Mahindra Bank",
      },
      {
        property: "og:description",
        content:
          "Your balance check was successful. See your available balance and latest offers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BalanceSuccessPage,
});

function KotakMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <path
          d="M6 21c4-7 16-7 20 0-4-2-16-2-20 0Z"
          fill="#0072bc"
        />
        <path
          d="M6 11c4 7 16 7 20 0-4 2-16 2-20 0Z"
          fill="#ed1c24"
        />
      </svg>
    </span>
  );
}

function ShareMarketMark() {
  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black">
      <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden="true">
        <circle cx="24" cy="20" r="11" fill="none" stroke="#9a5bff" strokeWidth="1.4" />
        <ellipse cx="24" cy="20" rx="5" ry="11" fill="none" stroke="#9a5bff" strokeWidth="1.2" />
        <path d="M13 20h22" stroke="#9a5bff" strokeWidth="1.2" />
        <path d="M15.5 14.5h17M15.5 25.5h17" stroke="#9a5bff" strokeWidth="1" />
        <rect x="15" y="33" width="3" height="7" rx="1" fill="#22c55e" />
        <rect x="21" y="30" width="3" height="10" rx="1" fill="#ef4444" />
        <rect x="27" y="34" width="3" height="6" rx="1" fill="#22c55e" />
      </svg>
    </span>
  );
}

function BalanceSuccessPage() {
  const navigate = useNavigate();
  // Start from the default on both server and client to keep SSR markup
  // matching; localStorage is only read after hydration.
  const [balance, setBalanceState] = useState(DEFAULT_BALANCE);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setBalanceState(getBalance());
  }, []);


  const startEditing = () => {
    setDraft(balance.toFixed(2));
    setEditing(true);
  };

  const saveBalance = () => {
    const parsed = Number(draft.replace(/,/g, "").trim());
    if (Number.isFinite(parsed) && parsed >= 0) {
      setBalance(parsed);
      setBalanceState(parsed);
    }
    setEditing(false);
  };


  return (
    <main className="min-h-dvh bg-black">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-black px-4 pb-3 pt-6 text-white">
        {/* Success mark */}
        <div className="flex flex-col items-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#22c55e]">
            <Check className="h-10 w-10 text-white" strokeWidth={3} />
          </span>
          <p className="mt-4 text-[17px] font-semibold text-white">
            Balance check successful
          </p>

          {/* Bank */}
          <div className="mt-3 flex items-center gap-2.5">
            <KotakMark />
            <span className="text-[15px] text-white">
              Kotak Mahindra Bank-4539
            </span>
          </div>

          {/* Balance */}
          <p className="mt-5 text-[13px] text-white/55">Available Balance</p>
          {editing ? (
            <div className="mt-2 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-white/20 bg-[#1c1c1c] px-3 py-1.5">
                <span className="text-[24px] font-bold text-white">₹</span>
                <input
                  autoFocus
                  inputMode="decimal"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveBalance();
                    if (e.key === "Escape") setEditing(false);
                  }}
                  className="w-36 bg-transparent text-[24px] font-bold tracking-tight text-white outline-none placeholder:text-white/30"
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="cursor-pointer rounded-lg px-4 py-1.5 text-[15px] font-semibold text-white/60 transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveBalance}
                  className="cursor-pointer rounded-lg bg-[#5f259f] px-5 py-1.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#6d2bb3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={startEditing}
              aria-label="Edit balance"
              className="group mt-1 flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="text-[30px] font-bold tracking-tight text-white">
                ₹{formatBalance(balance)}
              </span>
              <Pencil
                className="h-4 w-4 text-white/40 transition-colors group-hover:text-white/80"
                strokeWidth={2}
              />
            </button>
          )}
        </div>

        {/* Ad card */}
        <section className="relative mt-5 overflow-hidden rounded-2xl bg-[#22d9e0]">
          <img
            src={glowtripAd}
            alt="The Glow Trip sale: flat ₹200 off on orders above ₹499"
            width={1200}
            height={912}
            loading="lazy"
            className="block h-52 w-full select-none object-cover object-bottom"
            draggable={false}
          />
          <span className="absolute left-1.5 top-1.5 rounded bg-black/25 px-1.5 py-0.5 text-[9px] font-semibold text-black/70">
            Ad
          </span>

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 px-4 pt-4">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-black/60">
              <span className="text-center text-[11px] font-bold leading-tight text-black">
                THE GLOW
                <br />
                TRIP
                <br />
                Sale
              </span>
            </span>
            <span className="min-w-0 flex-1 text-right">
              <span className="block text-[22px] font-extrabold leading-none text-black">
                Flat{" "}
                <span className="text-[28px] align-baseline">₹200</span> OFF
              </span>
              <span className="mt-1 block text-[12px] font-semibold text-black">
                On orders above ₹499
              </span>
              <span className="mt-1 block text-[8px] leading-snug text-black/75">
                *Add products worth ₹499 to the cart to avail the offer. Apply
                PhonePe code at checkout.
              </span>
            </span>
          </div>
        </section>

        {/* Mutual funds promo */}
        <section className="mt-3">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-[#1c1c1c] px-4 py-3 text-left transition-colors hover:bg-[#232323] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ShareMarketMark />
            <span className="min-w-0 flex-1 text-[15px] font-bold leading-snug text-white">
              Don&apos;t just save, grow your money with Mutual Funds. Invest
              now!
            </span>
            <ChevronRight
              className="h-6 w-6 shrink-0 text-[#9a5bff]"
              strokeWidth={2.2}
            />
          </button>
        </section>

        {/* Done */}
        <div className="mt-auto border-t border-white/10 pt-1">
          <button
            type="button"
            onClick={() => navigate({ to: "/check-balance" })}
            className="w-full cursor-pointer rounded-lg py-2.5 text-center text-[17px] font-semibold text-[#8666c3] transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Done
          </button>
        </div>
      </div>
    </main>
  );
}
