import { useCallback, useEffect, useRef, useState } from "react";

interface StarDot {
  id: number;
  x: number;
  y: number;
  label: string;
  size: number;
  color: string;
  delay: number;
}

const MEMORIES = [
  "First smile ✦",
  "Late nights ✦",
  "Your laugh ✦",
  "Our songs ✦",
  "Your eyes ✦",
  "Quiet mornings ✦",
  "Your warmth ✦",
  "Our secrets ✦",
  "Your hands ✦",
  "This moment ✦",
];

// Deterministic spiral — seeded positions
function buildStarDots(): StarDot[] {
  const cx = 50;
  const cy = 50;
  return MEMORIES.map((label, i) => {
    const angle = (i / MEMORIES.length) * Math.PI * 2 - Math.PI / 2;
    const radius = 28 + (i % 3) * 6;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    const colors = [
      "oklch(0.90 0.08 80)",
      "oklch(0.82 0.12 300)",
      "oklch(0.80 0.16 340)",
      "oklch(0.97 0.01 260)",
    ];
    return {
      id: i,
      x,
      y,
      label,
      size: 4 + (i % 3) * 2,
      color: colors[i % colors.length],
      delay: i * 120,
    };
  });
}

const STAR_DOTS = buildStarDots();

interface GoldenSpark {
  id: number;
  tx: number;
  ty: number;
  color: string;
}

export function UniverseSection() {
  const [visible, setVisible] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [eggExploded, setEggExploded] = useState(false);
  const [eggSparks, setEggSparks] = useState<GoldenSpark[]>([]);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [moonlightPhase, setMoonlightPhase] = useState<"swirl" | "message">(
    "swirl",
  );
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDialogElement>(null);

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
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleEggClick = useCallback(() => {
    if (eggExploded) return;
    setEggExploded(true);

    // Spawn golden sparks
    const sparks: GoldenSpark[] = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      tx: (Math.random() - 0.5) * 280,
      ty: (Math.random() - 0.5) * 280,
      color:
        i % 3 === 0
          ? "oklch(0.90 0.12 80)"
          : i % 3 === 1
            ? "oklch(0.85 0.14 80)"
            : "oklch(0.97 0.05 80)",
    }));
    setEggSparks(sparks);

    setTimeout(() => {
      setEggSparks([]);
      setOverlayOpen(true);
      setMoonlightPhase("swirl");
      setTimeout(() => setMoonlightPhase("message"), 2200);
    }, 900);
  }, [eggExploded]);

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false);
    setTimeout(() => setEggExploded(false), 600);
  }, []);

  // Trap focus in overlay
  useEffect(() => {
    if (!overlayOpen) return;
    const el = overlayRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], [tabindex]:not([tabindex="-1"])',
    );
    focusable[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlayOpen, closeOverlay]);

  return (
    <section
      id="universe"
      ref={sectionRef}
      className="relative px-4 py-24 md:py-32"
      style={{ zIndex: 10 }}
    >
      <div className="max-w-xl mx-auto text-center">
        {/* Heading */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
          }}
        >
          <h2
            className="font-display text-3xl md:text-5xl mb-3"
            style={{
              color: "oklch(0.97 0.02 80)",
              fontStyle: "italic",
              textShadow: "0 0 30px oklch(0.90 0.08 80 / 0.35)",
            }}
          >
            Our little universe
          </h2>
          <p
            className="font-body text-sm md:text-base italic mb-12"
            style={{ color: "oklch(0.70 0.03 270)", lineHeight: 1.8 }}
          >
            Every star a memory. Every night, closer to you.
          </p>
        </div>

        {/* Starfield cluster */}
        <div
          className="relative mx-auto"
          style={{
            width: "clamp(280px, 80vw, 360px)",
            height: "clamp(280px, 80vw, 360px)",
            opacity: visible ? 1 : 0,
            transition: "opacity 1.2s ease-out 0.3s",
          }}
        >
          {/* SVG constellation lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            {STAR_DOTS.map((dot, i) => {
              const next = STAR_DOTS[(i + 1) % STAR_DOTS.length];
              const dist = Math.hypot(dot.x - next.x, dot.y - next.y);
              if (dist > 22) return null;
              return (
                <line
                  key={`line-${dot.id}`}
                  x1={dot.x}
                  y1={dot.y}
                  x2={next.x}
                  y2={next.y}
                  stroke="oklch(0.82 0.08 300 / 0.18)"
                  strokeWidth="0.4"
                />
              );
            })}
          </svg>

          {/* Star dots */}
          {STAR_DOTS.map((dot) => (
            <button
              key={dot.id}
              type="button"
              aria-label={dot.label}
              data-ocid={`star-dot-${dot.id}`}
              className="absolute rounded-full focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                width: `${dot.size + 8}px`,
                height: `${dot.size + 8}px`,
                transform: "translate(-50%, -50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                zIndex: 2,
                minWidth: "44px",
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={() => setActiveTooltip(dot.id)}
              onMouseLeave={() => setActiveTooltip(null)}
              onFocus={() => setActiveTooltip(dot.id)}
              onBlur={() => setActiveTooltip(null)}
            >
              {/* Dot */}
              <div
                style={{
                  width: `${dot.size}px`,
                  height: `${dot.size}px`,
                  borderRadius: "50%",
                  background: dot.color,
                  boxShadow: `0 0 ${dot.size * 2}px ${dot.color}`,
                  animation: `twinkle ${2 + dot.delay / 500}s ease-in-out infinite`,
                  animationDelay: `${dot.delay}ms`,
                }}
              />

              {/* Tooltip */}
              {activeTooltip === dot.id && (
                <div
                  className="absolute font-body pointer-events-none"
                  style={{
                    bottom: "calc(100% + 8px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "oklch(0.10 0.04 278 / 0.92)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid oklch(0.82 0.12 300 / 0.4)",
                    borderRadius: "8px",
                    padding: "5px 10px",
                    fontSize: "0.72rem",
                    color: "oklch(0.90 0.04 270)",
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 16px oklch(0.08 0.02 280 / 0.5)",
                    zIndex: 10,
                  }}
                >
                  {dot.label}
                </div>
              )}
            </button>
          ))}

          {/* HIDDEN EASTER EGG — "Kishor" firefly */}
          <div
            className="absolute"
            style={{
              right: "-10%",
              bottom: "12%",
              zIndex: 3,
            }}
          >
            <button
              type="button"
              aria-label="A glowing light"
              data-ocid="kishor-egg"
              className="relative focus:outline-none rounded-full"
              style={{
                width: "44px",
                height: "44px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={handleEggClick}
            >
              {/* Outer pulse halo */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: "-10px",
                  background:
                    "radial-gradient(circle, oklch(0.85 0.14 80 / 0.12) 0%, transparent 70%)",
                  animation: "glow-pulse 3.5s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />
              {/* Orb body */}
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 35% 35%, oklch(0.97 0.05 80) 0%, oklch(0.82 0.14 75) 60%, oklch(0.70 0.12 65) 100%)",
                  boxShadow:
                    "0 0 12px 4px oklch(0.85 0.14 80 / 0.55), 0 0 24px oklch(0.85 0.14 80 / 0.25)",
                  animation: "pulse-soft 2.8s ease-in-out infinite",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {/* Faint K glyph */}
                <span
                  style={{
                    fontSize: "7px",
                    fontFamily: "serif",
                    color: "oklch(0.65 0.08 65 / 0.55)",
                    lineHeight: 1,
                    userSelect: "none",
                    position: "absolute",
                  }}
                  aria-hidden="true"
                >
                  K
                </span>
              </div>
            </button>

            {/* Golden sparks from egg */}
            {eggSparks.map((s) => (
              <div
                key={s.id}
                className="absolute pointer-events-none rounded-full"
                style={{
                  width: "5px",
                  height: "5px",
                  left: "50%",
                  top: "50%",
                  background: s.color,
                  boxShadow: `0 0 6px 2px ${s.color}`,
                  opacity: 0,
                  animation: "sparkle 0.9s ease-out forwards",
                  transform: `translate(calc(-50% + ${s.tx}px), calc(-50% + ${s.ty}px))`,
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Romantic quote */}
        <p
          className="font-display text-sm md:text-base italic mt-12"
          style={{
            color: "oklch(0.68 0.04 280)",
            opacity: visible ? 1 : 0,
            transition: "opacity 1.2s ease-out 0.8s",
          }}
        >
          "You are my calm, my star, my soft sky."
        </p>
      </div>

      {/* KISHOR OVERLAY */}
      {overlayOpen && (
        <dialog
          aria-label="A moonlight message for Kishor"
          ref={overlayRef}
          open
          className="fixed inset-0 flex items-center justify-center p-4 bg-transparent border-0 w-full h-full max-w-none max-h-none"
          style={{ zIndex: 100 }}
        >
          {/* Backdrop */}
          <div
            role="presentation"
            tabIndex={-1}
            className="absolute inset-0"
            style={{
              background: "oklch(0.06 0.02 280 / 0.92)",
              backdropFilter: "blur(20px)",
            }}
            onClick={closeOverlay}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") closeOverlay();
            }}
          />

          {/* Panel */}
          <div
            className="relative max-w-sm w-full rounded-2xl p-8 text-center overflow-hidden"
            style={{
              background: "oklch(0.10 0.04 278 / 0.90)",
              backdropFilter: "blur(18px)",
              border: "1px solid oklch(0.85 0.14 80 / 0.4)",
              boxShadow:
                "0 0 60px oklch(0.85 0.14 80 / 0.25), 0 20px 60px oklch(0.08 0.02 280 / 0.6)",
            }}
          >
            {/* Floating overlay sparkles */}
            {(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"] as const).map(
              (k, i) => (
                <div
                  key={k}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${10 + i * 9}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    fontSize: "0.55rem",
                    color: "oklch(0.90 0.10 80 / 0.7)",
                    animation: `twinkle ${2 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${i * 200}ms`,
                  }}
                  aria-hidden="true"
                >
                  ✦
                </div>
              ),
            )}

            <h2
              className="font-display text-2xl md:text-3xl mb-6"
              style={{
                color: "oklch(0.97 0.05 80)",
                fontStyle: "italic",
                textShadow: "0 0 30px oklch(0.90 0.10 80 / 0.5)",
              }}
            >
              You found it, Kishor! ✦
            </h2>

            {/* Animated MOONLIGHT text */}
            {moonlightPhase === "swirl" && (
              <div
                className="font-display text-3xl md:text-4xl mb-6"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.97 0.05 80), oklch(0.85 0.14 80), oklch(0.90 0.10 75))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "pulse-soft 1s ease-in-out infinite",
                  letterSpacing: "0.15em",
                  textShadow: "none",
                  fontStyle: "italic",
                }}
              >
                ✦ ✦ ✦ ✦ ✦
              </div>
            )}

            {moonlightPhase === "message" && (
              <>
                <div
                  className="font-display text-2xl md:text-3xl mb-5"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.97 0.05 80), oklch(0.85 0.14 80), oklch(0.90 0.10 75))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "0.2em",
                    fontStyle: "italic",
                    animation: "glow-pulse 2s ease-in-out infinite",
                  }}
                >
                  MOONLIGHT
                </div>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: "oklch(0.75 0.03 270)", lineHeight: 1.85 }}
                >
                  This entire sky was built for her.
                  <br />
                  Every star, every glow, every wish —
                  <br />
                  it was always about her.
                </p>
              </>
            )}

            <button
              type="button"
              data-ocid="kishor-overlay-close"
              className="mt-7 font-body px-7 py-2.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{
                border: "1px solid oklch(0.85 0.14 80 / 0.6)",
                color: "oklch(0.90 0.08 80)",
                background: "oklch(0.85 0.14 80 / 0.10)",
                fontSize: "0.85rem",
                letterSpacing: "0.06em",
                minHeight: "44px",
                transition: "all 0.3s ease",
              }}
              onClick={closeOverlay}
            >
              Close
            </button>
          </div>
        </dialog>
      )}
    </section>
  );
}
