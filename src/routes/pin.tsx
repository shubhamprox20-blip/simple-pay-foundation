import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

const pinSearchSchema = z.object({
  name: z.string().max(100).catch(""),
  upi: z.string().max(100).catch(""),
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
});

export const Route = createFileRoute("/pin")({
  validateSearch: (search) => pinSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Enter UPI PIN" },
      { name: "description", content: "Enter your UPI PIN to authorize the payment." },
      { property: "og:title", content: "Enter UPI PIN" },
      { property: "og:description", content: "Enter your UPI PIN to authorize the payment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PinPage,
});

const PIN_LENGTH = 6;

function PinPage() {
  const navigate = useNavigate();
  const { name, upi, amount, message } = Route.useSearch();
  const [pin, setPin] = useState("");

  const formattedAmount = (() => {
    const n = Number(amount);
    if (!Number.isFinite(n) || amount === "") return amount;
    return n % 1 === 0
      ? n.toLocaleString("en-IN")
      : n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  })();

  const pressKey = (key: string) => {
    if (key === "back") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (pin.length >= PIN_LENGTH) return;
    setPin((p) => p + key);
  };

  const handlePay = () => {
    if (pin.length !== PIN_LENGTH) return;
    navigate({ to: "/success", search: { name, upi, amount, message } });
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "back", "0", "pay"];

  return (
    <div className="flex min-h-screen justify-center bg-[#f0f0f0]">
      <div className="flex w-full max-w-[430px] flex-col bg-white">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-6">
          <div>
            {/* UPI logo */}
            <div className="flex items-center gap-1">
              <span className="text-3xl font-black italic tracking-tight text-[#3d3d3d]">
                UPI
              </span>
              <svg className="h-7 w-5" viewBox="0 0 20 28" fill="none">
                <path d="M0 0l8 14-8 14h6l8-14-8-14H0z" fill="#f7941d" />
                <path d="M8 0l8 14-8 14h4l8-14-8-14H8z" fill="#00843d" />
              </svg>
            </div>
            <p className="mt-0.5 text-[8px] font-semibold tracking-wide text-[#3d3d3d]">
              UNIFIED PAYMENTS INTERFACE
            </p>
            <p className="mt-4 text-xl text-black">Kotak Mahindra Bank</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => navigate({ to: "/pay" })}
            className="p-1 text-zinc-500"
          >
            <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Pay summary card */}
        <div className="mx-5 mt-4 flex items-center justify-between rounded-xl bg-[#fdf6e3] px-5 py-5">
          <div>
            <p className="text-2xl font-bold text-black">Pay ₹{formattedAmount}</p>
            <p className="mt-1 text-lg text-black">To {name || "Receiver"}</p>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-9 w-9 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 5h9M6 9h9M6 5c4 0 6 2 6 4s-2 4-6 4l7 6" />
            </svg>
            <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0l-5-5m5 5l-5 5" />
            </svg>
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#5b5ea6]">
              <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="12" cy="8" r="3.5" />
                <path strokeLinecap="round" d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
              </svg>
            </span>
          </div>
        </div>

        {/* PIN entry */}
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          <p className="text-xl font-semibold text-black">Enter your PIN</p>
          <div className="mt-8 flex items-center gap-4">
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <span
                key={i}
                className={`h-5 w-5 rounded-full border-2 ${
                  i < pin.length
                    ? "border-[#1a2f8a] bg-[#1a2f8a]"
                    : "border-zinc-500 bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-center justify-center gap-2 pb-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f5a623]">
            <span className="text-xs font-bold text-white">!</span>
          </span>
          <p className="text-sm text-zinc-500">Never enter your UPI PIN to receive money</p>
        </div>

        {/* Keypad */}
        <div className="bg-[#ececec] px-3 pb-6 pt-3">
          <div className="grid grid-cols-3 gap-2.5">
            {keys.map((key) => {
              if (key === "back") {
                return (
                  <button
                    key={key}
                    type="button"
                    aria-label="Delete"
                    onClick={() => pressKey("back")}
                    className="flex h-16 items-center justify-center rounded-full bg-[#c9cbe8] active:bg-[#b5b8dd]"
                  >
                    <svg className="h-7 w-7 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h11a1 1 0 011 1v12a1 1 0 01-1 1H9l-6-7 6-7z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10l4 4m0-4l-4 4" />
                    </svg>
                  </button>
                );
              }
              if (key === "pay") {
                const ready = pin.length === PIN_LENGTH;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={handlePay}
                    disabled={!ready}
                    className={`flex h-16 items-center justify-center rounded-full text-xl font-medium text-white transition-colors ${
                      ready ? "bg-[#0b3d91] active:bg-[#0a357c]" : "bg-[#0b3d91]/50"
                    }`}
                  >
                    Pay
                  </button>
                );
              }
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => pressKey(key)}
                  className="flex h-16 items-center justify-center rounded-full bg-white text-3xl text-black active:bg-zinc-200"
                >
                  {key}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
