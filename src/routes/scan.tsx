import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan QR — Scan & Pay" },
      { name: "description", content: "Scan any QR code to pay instantly." },
      { property: "og:title", content: "Scan QR — Scan & Pay" },
      { property: "og:description", content: "Scan any QR code to pay instantly." },
    ],
  }),
  component: ScanPage,
});

function ScanPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<{ stop: () => Promise<void>; isScanning: boolean } | null>(null);

  useEffect(() => {
    if (result) return;
    let cancelled = false;
    (async () => {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled) return;
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (text) => {
            setResult(text);
            scanner.stop().catch(() => {});
          },
          () => {},
        );
      } catch {
        setError("Camera access was blocked or no camera found.");
      }
    })();
    return () => {
      cancelled = true;
      const s = scannerRef.current;
      if (s?.isScanning) s.stop().catch(() => {});
    };
  }, [result]);

  return (
    <main className="flex min-h-screen flex-col bg-foreground text-background">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate({ to: "/" })} className="text-lg">
          ←
        </button>
        <h1 className="text-lg font-semibold">Scan QR Code</h1>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        {result ? (
          <div className="w-full max-w-sm rounded-xl bg-background p-4 text-foreground">
            <p className="text-sm text-muted-foreground">Scanned:</p>
            <p className="mt-1 break-all font-medium">{result}</p>
            <button
              type="button"
              onClick={() => setResult(null)}
              className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              Scan again
            </button>
          </div>
        ) : (
          <>
            <div id="qr-reader" className="w-full max-w-sm overflow-hidden rounded-xl" />
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
          </>
        )}
      </div>
    </main>
  );
}
