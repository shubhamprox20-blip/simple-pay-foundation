import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";
import bottomNavigation from "../assets/paytm-bottom-navigation.png";
import bottomNavigationHistory from "../assets/paytm-bottom-navigation-history.png";
import homeReference from "../assets/paytm-home-clear.png";
import { HistoryScreen } from "@/components/HistoryScreen";
import stickyHeader from "../assets/paytm-sticky-header-clear.png";

export const Route = createFileRoute("/")({
  // The active bottom-bar tab is part of the URL so that going back from
  // success-details restores whichever tab (home/history) the user left.
  validateSearch: (search) =>
    z.object({ tab: z.enum(["home", "history"]).optional() }).parse(search),
  head: () => ({
    meta: [
      { title: "Home — Money Transfers & More" },
      {
        name: "description",
        content: "Transfer money, recharge and pay bills in one place.",
      },
      { property: "og:title", content: "Home — Money Transfers & More" },
      {
        property: "og:description",
        content: "Transfer money, recharge and pay bills in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomeScreenPage,
});

function HomeScreenPage() {
  const navigate = useNavigate();
  const { tab } = Route.useSearch();
  const activeTab: "home" | "history" = tab ?? "home";
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setHasScrolled(window.scrollY > 260);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  const switchTab = (next: "home" | "history") => {
    if (next === activeTab) return;
    // Keep the tab in the URL so browser/app back navigation restores it.
    navigate({
      to: "/",
      search: next === "history" ? { tab: "history" } : {},
      replace: true,
    });
    window.scrollTo(0, 0);
    setHasScrolled(false);
  };

  const transferOptions = [
    { label: "To Mobile Number", left: 0, width: 25, to: "/pay" },
    { label: "To Bank & Self A/c", left: 25, width: 25, to: "/pay" },
    { label: "Refer & Get...", left: 50, width: 25, to: "/pay" },
    { label: "Check Balance", left: 75, width: 25, to: "/check-balance" },
  ];

  return (
    <main className="min-h-dvh bg-foreground">
      <div className="relative mx-auto min-h-dvh w-full max-w-[430px] overflow-x-clip bg-foreground pb-[82px]">
        {activeTab === "home" ? (
          <>
            <div className="relative">
              <img
                src={homeReference}
                alt="Payments home with money transfers, bills, loans, insurance, investments, travel and rewards"
                className="block h-auto w-full select-none"
                draggable={false}
              />

              {transferOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  aria-label={option.label}
                  onClick={() => navigate({ to: option.to })}
                  className="absolute top-[11.5%] h-[7.5%] cursor-pointer bg-transparent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
                  style={{ left: `${option.left}%`, width: `${option.width}%` }}
                />
              ))}
            </div>

            {hasScrolled ? (
              <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-x-0 top-0 z-40 mx-auto w-full max-w-[430px]"
              >
                <img
                  src={stickyHeader}
                  alt=""
                  className="block h-auto w-full select-none"
                  draggable={false}
                />
              </div>
            ) : null}
          </>
        ) : (
          <HistoryScreen />
        )}

        <nav
          aria-label="Primary navigation"
          className="fixed inset-x-0 bottom-0 z-50 mx-auto h-[82px] w-full max-w-[430px] bg-foreground"
        >
          <img
            src={
              activeTab === "home"
                ? bottomNavigation
                : bottomNavigationHistory
            }
            alt="Home, Search, Scan, Alerts and History"
            className="h-full w-full select-none object-fill"
            draggable={false}
          />
          <button
            type="button"
            aria-label="Home"
            onClick={() => switchTab("home")}
            className={`absolute inset-y-0 left-0 w-1/5 bg-transparent ${
              activeTab === "home"
                ? "cursor-default"
                : "cursor-pointer"
            }`}
          />
          <button
            type="button"
            aria-label="Search"
            className="absolute inset-y-0 left-1/5 w-1/5 cursor-pointer bg-transparent"
          />
          <button
            type="button"
            aria-label="Scan and pay"
            onClick={() => navigate({ to: "/scan" })}
            className="absolute inset-y-0 left-2/5 w-1/5 cursor-pointer bg-transparent"
          />
          <button
            type="button"
            aria-label="Alerts"
            className="absolute inset-y-0 left-3/5 w-1/5 cursor-pointer bg-transparent"
          />
          <button
            type="button"
            aria-label="History"
            onClick={() => switchTab("history")}
            className={`absolute inset-y-0 left-4/5 w-1/5 bg-transparent ${
              activeTab === "history"
                ? "cursor-default"
                : "cursor-pointer"
            }`}
          />
        </nav>
      </div>
    </main>
  );
}
