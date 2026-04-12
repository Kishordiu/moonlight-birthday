import { useCallback, useEffect, useRef, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  sway: number;
}

interface OverlaySpark {
  id: number;
  x: number;
  y: number;
  delay: number;
}

const CONFETTI_COLORS = [
  "oklch(0.80 0.16 340 / 0.85)",
  "oklch(0.82 0.12 300 / 0.85)",
  "oklch(0.85 0.14 80 / 0.85)",
  "oklch(0.97 0.01 260 / 0.70)",
  "oklch(0.88 0.10 340 / 0.80)",
];

// Seeded confetti
function buildConfetti(): ConfettiPiece[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: 3 + ((i * 3.2) % 94),
    size: 5 + (i % 4) * 2,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    duration: 5 + (i % 5) * 1.2,
    delay: (i % 8) * 0.4,
    sway: ((i % 5) - 2) * 22,
  }));
}

const CONFETTI = buildConfetti();

const OVERLAY_SPARKS: OverlaySpark[] = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 5 + ((i * 6.5) % 90),
  y: 5 + ((i * 7.2) % 90),
  delay: i * 160,
}));

const POEM_LINES = [
  "My love,",
  "If you are reading this, you found the moonlight.",
  "That is so very you — curious, gentle, wonderful.",
  "I want you to know:",
  "You are loved beyond what words can hold.",
  "Every star I see reminds me of your smile.",
  "Every quiet night feels safer because of you.",
  "You are my moonlight, my home, my heart.",
  "Happy Birthday.",
  "Forever yours. ✦",
];

export function ClosingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const moonBtnRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDialogElement>(null);

  const [visible, setVisible] = useState(false);
  const [moonGlowing, setMoonGlowing] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [poemLine, setPoemLine] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Stagger poem lines once overlay opens
  useEffect(() => {
    if (!overlayOpen) {
      setPoemLine(0);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setPoemLine(i);
      if (i >= POEM_LINES.length) clearInterval(interval);
    }, 420);
    return () => clearInterval(interval);
  }, [overlayOpen]);

  const openOverlay = useCallback(() => {
    setMoonGlowing(true);
    setTimeout(() => setOverlayOpen(true), 400);
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false);
    setTimeout(() => setMoonGlowing(false), 600);
  }, []);

  // Trap focus + keyboard escape
  useEffect(() => {
    if (!overlayOpen) return;
    const el = overlayRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [tabindex]:not([tabindex="-1"])',
    );
    focusable[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlayOpen, closeOverlay]);

  const lineDelay = (i: number) => `${i * 80}ms`;

  return (
    <section
      id="closing"
      ref={sectionRef}
      className="relative px-4 py-24 md:py-36 overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* Drifting confetti — triggers on visible */}
      {visible && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {CONFETTI.map((c) => (
            <div
              key={c.id}
              className="absolute rounded-full"
              style={
                {
                  left: `${c.x}%`,
                  top: "-10px",
                  width: `${c.size}px`,
                  height: `${c.size}px`,
                  background: c.color,
                  boxShadow: `0 0 ${c.size}px ${c.color}`,
                  animation: `floatUp ${c.duration}s ease-out forwards`,
                  animationDelay: `${c.delay}s`,
                  "--sway": `${c.sway}px`,
                } as React.CSSProperties & { "--sway": string }
              }
            />
          ))}
        </div>
      )}

      <div className="max-w-lg mx-auto text-center">
        {/* Main closing message */}
        <div
          className="mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease-out 0.2s",
          }}
        >
          {[
            {
              key: "line-sky",
              text: "No matter how far the sky stretches,",
              size: "text-xl md:text-3xl",
              color: "oklch(0.82 0.04 270)",
              delay: "0ms",
              weight: "normal",
            },
            {
              key: "line-heart",
              text: "my heart always finds you.",
              size: "text-xl md:text-3xl",
              color: "oklch(0.88 0.06 280)",
              delay: "350ms",
              weight: "normal",
            },
            {
              key: "line-bday",
              text: "Happy Birthday, my forever moon.",
              size: "text-2xl md:text-5xl",
              color: "oklch(0.97 0.05 80)",
              delay: "900ms",
              weight: "bold",
            },
          ].map((line, i) => (
            <p
              key={line.key}
              className={`font-display ${line.size} mb-3`}
              style={{
                color: line.color,
                fontStyle: "italic",
                lineHeight: 1.3,
                opacity: visible ? 1 : 0,
                transform: visible
                  ? "translateY(0) scale(1)"
                  : "translateY(16px) scale(0.97)",
                transition: `opacity 0.9s ease-out ${line.delay}, transform 0.9s ease-out ${line.delay}`,
                textShadow:
                  i === 2
                    ? "0 0 40px oklch(0.90 0.10 80 / 0.55), 0 0 80px oklch(0.85 0.12 80 / 0.3)"
                    : "none",
                background:
                  i === 2
                    ? "linear-gradient(135deg, oklch(0.97 0.05 80), oklch(0.90 0.12 75), oklch(0.97 0.04 85))"
                    : "none",
                WebkitBackgroundClip: i === 2 ? "text" : "unset",
                WebkitTextFillColor: i === 2 ? "transparent" : "unset",
              }}
            >
              {line.text}
            </p>
          ))}
        </div>

        {/* Star divider */}
        <div
          className="flex justify-center items-center gap-2 mb-10"
          aria-hidden="true"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease-out 1.2s",
          }}
        >
          {(
            ["d0", "s1", "d2", "s3", "d4", "s5", "d6", "s7", "d8"] as const
          ).map((k, i) => (
            <span
              key={k}
              style={{
                color:
                  i % 3 === 0
                    ? "oklch(0.85 0.10 80 / 0.8)"
                    : "oklch(0.50 0.03 280 / 0.5)",
                fontSize: i % 3 === 0 ? "0.65rem" : "0.35rem",
                animation: `twinkle ${2 + i * 0.25}s ease-in-out infinite`,
                animationDelay: `${i * 200}ms`,
              }}
            >
              {i % 3 === 0 ? "✦" : "·"}
            </span>
          ))}
        </div>

        {/* MOONLIGHT MESSAGE EASTER EGG — crescent moon button */}
        <div
          className="flex justify-center mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease-out 1.5s",
          }}
        >
          <button
            ref={moonBtnRef}
            type="button"
            aria-label="A gentle moonlight"
            data-ocid="moonlight-egg"
            className="relative focus:outline-none rounded-full"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              width: "52px",
              height: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "44px",
              minHeight: "44px",
            }}
            onClick={openOverlay}
          >
            {/* Crescent SVG */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              style={{
                filter: moonGlowing
                  ? "drop-shadow(0 0 18px oklch(0.97 0.03 80)) drop-shadow(0 0 36px oklch(0.90 0.06 80 / 0.6))"
                  : "drop-shadow(0 0 8px oklch(0.90 0.06 80 / 0.45)) drop-shadow(0 0 16px oklch(0.85 0.08 80 / 0.2))",
                transition: "filter 0.8s ease-out",
                animation: "pulse-soft 3.5s ease-in-out infinite",
              }}
              aria-hidden="true"
            >
              <path
                d="M22 6C16.477 6 12 10.477 12 16C12 21.523 16.477 26 22 26C23.5 26 24.9 25.65 26.15 25.05C24.1 26.9 21.4 28 18.5 28C12.149 28 7 22.851 7 16.5C7 10.149 12.149 5 18.5 5C19.7 5 20.88 5.18 22 5.52C22 5.68 22 5.84 22 6Z"
                fill="oklch(0.97 0.04 80)"
                opacity="0.9"
              />
              {/* Subtle shimmer */}
              <path
                d="M14 11C14 11 16 9 20 10"
                stroke="oklch(0.99 0.01 80 / 0.6)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Final line */}
        <p
          className="font-body text-xs italic"
          style={{
            color: "oklch(0.48 0.02 270)",
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease-out 1.8s",
            letterSpacing: "0.04em",
          }}
        >
          Every night sky feels closer to you.
        </p>
      </div>

      {/* MOONLIGHT MESSAGE OVERLAY */}
      {overlayOpen && (
        <dialog
          aria-label="A hidden moonlight message"
          ref={overlayRef}
          open
          className="fixed inset-0 flex items-center justify-center p-4 bg-transparent border-0 w-full h-full max-w-none max-h-none"
          style={{ zIndex: 100 }}
        >
          {/* Backdrop */}
          <div
            role="presentation"
            className="absolute inset-0"
            style={{
              background: "oklch(0.06 0.02 280 / 0.94)",
              backdropFilter: "blur(22px)",
            }}
            onClick={closeOverlay}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") closeOverlay();
            }}
          />

          {/* Panel */}
          <div
            className="relative max-w-sm w-full rounded-2xl p-8 overflow-hidden"
            style={{
              background: "oklch(0.09 0.04 278 / 0.93)",
              backdropFilter: "blur(20px)",
              border: "1px solid oklch(0.90 0.05 80 / 0.35)",
              boxShadow:
                "0 0 80px oklch(0.90 0.06 80 / 0.2), 0 30px 80px oklch(0.06 0.02 280 / 0.7)",
            }}
          >
            {/* Floating sparkles inside overlay */}
            {OVERLAY_SPARKS.map((s) => (
              <div
                key={s.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  fontSize: "0.50rem",
                  color: "oklch(0.90 0.06 80 / 0.6)",
                  animation: `twinkle ${2.2 + s.id * 0.18}s ease-in-out infinite`,
                  animationDelay: `${s.delay}ms`,
                }}
                aria-hidden="true"
              >
                ✦
              </div>
            ))}

            {/* Poem */}
            <div className="text-center mb-6">
              {POEM_LINES.map((line, i) => (
                <p
                  key={line}
                  className={`font-body ${i === 0 || i === POEM_LINES.length - 1 || i === POEM_LINES.length - 2 ? "font-display italic" : ""}`}
                  style={{
                    color:
                      i === 0
                        ? "oklch(0.97 0.04 80)"
                        : i === POEM_LINES.length - 1
                          ? "oklch(0.90 0.08 80)"
                          : "oklch(0.74 0.03 270)",
                    fontSize:
                      i === 0
                        ? "1.05rem"
                        : i === POEM_LINES.length - 1
                          ? "1rem"
                          : "0.855rem",
                    lineHeight: 1.9,
                    opacity: i < poemLine ? 1 : 0,
                    transform:
                      i < poemLine ? "translateY(0)" : "translateY(6px)",
                    transition: `opacity 0.55s ease-out ${lineDelay(i)}, transform 0.55s ease-out ${lineDelay(i)}`,
                    marginBottom: i === 0 || i === 3 ? "0.75rem" : "0",
                    textShadow:
                      i === POEM_LINES.length - 1
                        ? "0 0 16px oklch(0.90 0.08 80 / 0.4)"
                        : "none",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                data-ocid="moonlight-overlay-close"
                className="font-body px-7 py-2.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                style={{
                  border: "1px solid oklch(0.90 0.06 80 / 0.55)",
                  color: "oklch(0.90 0.06 80)",
                  background: "oklch(0.90 0.06 80 / 0.08)",
                  fontSize: "0.85rem",
                  letterSpacing: "0.06em",
                  minHeight: "44px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "oklch(0.90 0.06 80 / 0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "oklch(0.90 0.06 80 / 0.08)";
                }}
                onClick={closeOverlay}
              >
                Close ✦
              </button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
