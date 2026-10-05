import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import promoBanner from "@/assets/success-promo.png";
import promoBanner2 from "@/assets/promo-banner-2.png";
import promoBanner3 from "@/assets/promo-banner-3.png";
import { addStoredPayment } from "@/lib/paymentHistory";

const successSearchSchema = z.object({
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
});

export const Route = createFileRoute("/success")({
  validateSearch: (search) => successSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Payment Successful" },
      { name: "description", content: "Your payment was completed successfully." },
      { property: "og:title", content: "Payment Successful" },
      {
        property: "og:description",
        content: "Your payment was completed successfully.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SuccessPage,
});

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return (parts[0] ?? "").slice(0, 2).toUpperCase();
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

function formatPaymentDate(d: Date) {
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-GB", { month: "long" });
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day} ${month} ${year} at ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
}

function SuccessPage() {
  const navigate = useNavigate();
  const { name, upi, amount, message } = Route.useSearch();

  const [activeSlide, setActiveSlide] = useState(0);
  const slideCount = 3;

  // Record this payment so it shows up in the History tab.
  useEffect(() => {
    addStoredPayment({ name, upi, amount, message });
  }, [name, upi, amount, message]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideCount);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="flex min-h-screen justify-center bg-[#262626]">
      <div className="flex w-full max-w-[430px] flex-col bg-[#262626]">
        {/* Green success hero */}
        <div className="bg-[#2E7D46] px-4 pb-28 pt-16 text-center">
          <div className="mx-auto flex h-[74px] w-[74px] items-center justify-center rounded-full bg-white shadow-md">
            <svg
              className="h-9 w-9 text-[#2E7D46]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 text-[22px] font-bold text-white">
            Payment Successful
          </h1>
          <p className="mt-1 text-base font-medium text-[#D9E85A]">
            {formatPaymentDate(new Date())}
          </p>
        </div>

        {/* Payment card overlapping the green hero */}
        <div className="relative z-10 -mt-20 mx-3 rounded-2xl bg-[#161616] p-5 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-2xl bg-[#29A9E0]">
              <span className="text-lg font-semibold text-white">
                {getInitials(name) || "PP"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="break-words text-lg font-bold uppercase leading-snug tracking-wide text-white">
                {name || "Receiver"}
              </p>
              <p className="mt-1 truncate text-sm text-zinc-400">{upi || "—"}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-3xl font-bold text-white">₹{formattedAmount}</p>
            <button
              type="button"
              className="text-base font-bold text-[#A78BFA]"
            >
              Split Expense
            </button>
          </div>

          <div className="mt-5 border-t border-zinc-700" />

          <div className="mt-1 grid grid-cols-2 divide-x divide-zinc-700">
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: "/success-details",
                  search: { name, upi, amount, message, from: "" },
                })
              }
              className="flex items-center justify-center gap-3 py-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3A2C6B]">
                <svg
                  className="h-5 w-5 text-[#A78BFA]"
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
              <span className="text-base text-white">View Details</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-3 py-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3A2C6B]">
                <svg
                  className="h-5 w-5 text-[#A78BFA]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path
                    strokeLinecap="round"
                    d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"
                  />
                </svg>
              </span>
              <span className="text-base text-white">Share Receipt</span>
            </button>
          </div>
        </div>

        {/* Promo banner slider */}
        <div className="relative mx-3 mt-5 overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {/* Slide 1: original promo with overlay text */}
            <div className="relative w-full shrink-0">
              <img
                src={promoBanner}
                alt="Automatic bill payments"
                className="block w-full"
              />
              <div className="absolute right-4 top-4 w-[58%] rounded-[2rem] rounded-bl-lg bg-[#6D28D9] p-4 shadow-md">
                <p className="text-[15px] font-medium leading-snug text-white">
                  Enable <span className="font-bold">automatic</span> bill
                  payments for Piped Gas
                </p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-sm font-bold text-[#6D28D9]"
                >
                  Know More
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Slide 2: placeholder */}
            <div className="w-full shrink-0">
              <img
                src={promoBanner2}
                alt="Instant money transfers"
                loading="lazy"
                className="block w-full"
              />
            </div>

            {/* Slide 3: placeholder */}
            <div className="w-full shrink-0">
              <img
                src={promoBanner3}
                alt="Rewards and offers"
                loading="lazy"
                className="block w-full"
              />
            </div>
          </div>
        </div>

        {/* Carousel dots */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {Array.from({ length: slideCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeSlide ? "w-6 bg-white" : "w-1.5 bg-zinc-600"
              }`}
            />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-auto bg-black px-4 py-5 text-center">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="text-lg font-bold text-[#7C5CFC]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
