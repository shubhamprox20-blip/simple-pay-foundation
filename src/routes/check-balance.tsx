import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CircleHelp,
  CirclePlus,
  Send,
  Wallet,
} from "lucide-react";
import adIxigo from "../assets/ad-ixigo.png";
import cashbackIllustration from "../assets/cashback-illustration.png";

export const Route = createFileRoute("/check-balance")({
  head: () => ({
    meta: [
      { title: "Check Balance — Money Transfers & More" },
      {
        name: "description",
        content:
          "Check your bank account, UPI Lite and wallet balances in one place.",
      },
      { property: "og:title", content: "Check Balance — Money Transfers & More" },
      {
        property: "og:description",
        content:
          "Check your bank account, UPI Lite and wallet balances in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckBalancePage,
});

function KotakLogo() {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <circle cx="16" cy="16" r="14" fill="#ED1C24" />
        <path
          d="M9 20.5c3.2-5.5 10.8-5.5 14 0-3.2-1.6-10.8-1.6-14 0Zm0-9c3.2 5.5 10.8 5.5 14 0-3.2 1.6-10.8 1.6-14 0Z"
          fill="#fff"
        />
      </svg>
    </span>
  );
}

function CheckBalancePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-dvh bg-[#0e0e0e]">
      <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-[#0e0e0e] pb-8 text-white">
        {/* Header */}
        <header className="flex items-center gap-4 px-5 pb-4 pt-5">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => navigate({ to: "/" })}
            className="cursor-pointer rounded-full p-1 text-white/90 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2} />
          </button>
          <h1 className="flex-1 text-[22px] font-bold tracking-tight">
            Check Balance
          </h1>
          <button
            type="button"
            aria-label="Help"
            className="cursor-pointer rounded-full p-1 text-white/90 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <CircleHelp className="h-6 w-6" strokeWidth={1.8} />
          </button>
        </header>

        {/* Cashback banner */}
        <section className="mx-4 mt-2">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl bg-[#1c1c1e] px-5 py-5 text-left transition-colors hover:bg-[#242427] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span className="min-w-0">
              <span className="flex items-center gap-2 text-[17px] font-bold">
                Up to ₹100* cashback
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
                  <ArrowRight className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
                </span>
              </span>
              <span className="mt-1 block text-[15px] text-white/55">
                Save your VISA Card and earn
              </span>
            </span>
            <img
              src={cashbackIllustration}
              alt=""
              width={1024}
              height={1024}
              loading="lazy"
              className="h-20 w-20 shrink-0 rounded-lg object-cover"
            />
          </button>
        </section>

        {/* Accounts list */}
        <section className="mt-4 px-4">
          {/* Bank account */}
          <button
            type="button"
            onClick={() => navigate({ to: "/balance-pin" })}
            className="flex w-full cursor-pointer items-center gap-4 rounded-xl px-1 py-5 text-left transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <KotakLogo />
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-semibold">
                Kotak Mahindra Bank-4539
              </span>
              <span className="mt-0.5 block text-[15px] text-white/55">
                Bank Account
              </span>
            </span>
            <ChevronRight className="h-6 w-6 shrink-0 text-white/70" strokeWidth={1.8} />
          </button>

          {/* UPI Lite */}
          <div className="flex items-center gap-4 border-t border-white/5 px-1 py-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full">
              <Send className="h-7 w-7 text-white/85" strokeWidth={1.5} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-semibold">UPI Lite</span>
              <span className="mt-0.5 block text-[15px] text-white/55">
                Pin-less payments up to ₹1,000
              </span>
            </span>
            <button
              type="button"
              className="shrink-0 cursor-pointer rounded-lg px-2 py-1 text-[16px] font-semibold text-[#a685ff] transition-colors hover:bg-[#a685ff]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Try Now
            </button>
          </div>

          {/* Wallet */}
          <div className="flex items-center gap-4 border-t border-white/5 px-1 py-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full">
              <Wallet className="h-7 w-7 text-white/85" strokeWidth={1.5} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-semibold">
                PhonePe Wallet
              </span>
              <span className="mt-0.5 block text-[15px] text-white/55">
                Balance: ₹0
              </span>
            </span>
            <button
              type="button"
              className="shrink-0 cursor-pointer rounded-lg px-2 py-1 text-[16px] font-semibold text-[#a685ff] transition-colors hover:bg-[#a685ff]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Activate
            </button>
          </div>

          {/* Add UPI account */}
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-4 border-t border-white/5 px-1 py-5 text-left transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full">
              <CirclePlus className="h-7 w-7 text-white/85" strokeWidth={1.5} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-semibold">
                Add UPI account
              </span>
              <span className="mt-0.5 block text-[15px] text-white/55">
                RuPay card, bank account &amp; more
              </span>
            </span>
            <ChevronRight className="h-6 w-6 shrink-0 text-white/70" strokeWidth={1.8} />
          </button>
        </section>

        {/* Ad */}
        <section className="mt-6 bg-[#181818] px-3 pb-6 pt-4">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={adIxigo}
              alt="ixigo ad: get up to ₹5000 off on flights"
              width={1088}
              height={1216}
              loading="lazy"
              className="block w-full select-none"
              draggable={false}
            />
            <span className="absolute left-0 top-0 rounded-br-lg rounded-tl-xl bg-[#7c1fd1] px-2 py-0.5 text-[11px] font-semibold text-white">
              Ad
            </span>
          </div>
        </section>

        {/* Powered by UPI footer */}
        <footer className="flex flex-col items-center gap-1 py-4">
          <span className="text-[11px] font-medium tracking-[0.2em] text-white/45">
            POWERED BY
          </span>
          <span className="flex items-baseline text-[28px] font-extrabold italic leading-none text-white">
            UP<span className="text-[#e6854e]">I</span>
            <span className="ml-0.5 inline-block h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-[#3d8a4e]" />
          </span>
          <span className="text-[9px] font-semibold tracking-[0.18em] text-white/45">
            UNIFIED PAYMENTS INTERFACE
          </span>
        </footer>
      </div>
    </main>
  );
}
