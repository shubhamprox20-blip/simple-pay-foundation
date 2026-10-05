import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan any QR — Scan & Pay" },
      { name: "description", content: "Scan any QR code to pay instantly." },
      { property: "og:title", content: "Scan any QR — Scan & Pay" },
      { property: "og:description", content: "Scan any QR code to pay instantly." },
    ],
  }),
  component: ScanPage,
});

type Scanner = {
  stop: () => Promise<void>;
  isScanning: boolean;
  scanFile: (f: File, show?: boolean) => Promise<string>;
  applyVideoConstraints: (c: MediaTrackConstraints) => Promise<void>;
};

function ScanPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const scannerRef = useRef<Scanner | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleText = (text: string) => {
    if (text.toLowerCase().startsWith("upi://")) {
      const params = new URLSearchParams(text.split("?")[1] ?? "");
      navigate({
        to: "/pay",
        search: {
          pa: params.get("pa") ?? undefined,
          pn: params.get("pn") ?? undefined,
        },
      });
      return;
    }
    setResult(text);
  };

  useEffect(() => {
    if (result) return;
    let cancelled = false;
    (async () => {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled) return;
      const scanner = new Html5Qrcode("qr-reader") as unknown as Scanner & {
        start: (...a: unknown[]) => Promise<void>;
      };
      scannerRef.current = scanner;
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10 },
          (text: string) => {
            scanner.stop().catch(() => {});
            handleText(text);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const toggleTorch = async () => {
    const s = scannerRef.current;
    if (!s?.isScanning) return;
    try {
      await s.applyVideoConstraints({
        advanced: [{ torch: !torchOn } as MediaTrackConstraintSet],
      });
      setTorchOn(!torchOn);
    } catch {
      setError("Torch is not supported on this device.");
    }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    const s = scannerRef.current;
    if (!file || !s) return;
    try {
      if (s.isScanning) await s.stop();
      const text = await s.scanFile(file, false);
      handleText(text);
    } catch {
      setError("No QR code found in this image.");
    }
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#3a3a3a] text-white">
      <style>{`#qr-reader video{width:100%!important;height:100%!important;object-fit:cover}`}</style>
      <div id="qr-reader" className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-black/30" />

      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-10">
        <div className="flex items-center gap-8">
          <button type="button" aria-label="Back" onClick={() => navigate({ to: "/" })}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Scan any QR</h1>
        </div>
        <button type="button" aria-label="Help" className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-sm font-bold">
          ?
        </button>
      </header>

      <div className="absolute inset-x-0 top-[21%] z-10 flex flex-col items-center">
        <div className="relative aspect-square w-[79%] max-w-[340px] rounded-2xl bg-white/15">
          <span className="absolute left-[6%] top-[6%] h-[16%] w-[16%] rounded-tl-xl border-l-4 border-t-4 border-[#8a3ffc]" />
          <span className="absolute right-[6%] top-[6%] h-[16%] w-[16%] rounded-tr-xl border-r-4 border-t-4 border-[#8a3ffc]" />
          <span className="absolute bottom-[6%] left-[6%] h-[16%] w-[16%] rounded-bl-xl border-b-4 border-l-4 border-[#8a3ffc]" />
          <span className="absolute bottom-[6%] right-[6%] h-[16%] w-[16%] rounded-br-xl border-b-4 border-r-4 border-[#8a3ffc]" />
          {result && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="break-all text-sm">{result}</p>
              <button type="button" onClick={() => setResult(null)} className="rounded-full bg-[#8a3ffc] px-4 py-2 text-sm">
                Scan again
              </button>
            </div>
          )}
        </div>

        <div className="mt-14 flex gap-20">
          <button type="button" onClick={() => fileRef.current?.click()} className="flex flex-col items-center gap-2">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="1" />
                <path d="M7 16l3-4 2 2 2-3 3 5z" fill="currentColor" />
              </svg>
            </span>
            <span className="text-base">Upload QR</span>
          </button>
          <button type="button" onClick={toggleTorch} className="flex flex-col items-center gap-2">
            <span className={`flex h-16 w-16 items-center justify-center rounded-full ${torchOn ? "bg-white/50" : "bg-white/20"}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                <path d="M7 3h10v4l-2 3v11H9V10L7 7z" />
                <path d="M12 13v2" />
              </svg>
            </span>
            <span className="text-base">Torch</span>
          </button>
        </div>
        {error && <p className="mt-4 px-6 text-center text-sm text-red-300">{error}</p>}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
      </div>

      <div className="absolute inset-x-0 bottom-12 z-10 flex items-center justify-center gap-3 text-white/50">
        <span className="text-xl font-black italic tracking-wider">BHIM ▸</span>
        <span className="h-5 w-px bg-white/50" />
        <span className="text-xl font-black italic tracking-wider">UPI ▸</span>
      </div>
    </main>
  );
}
