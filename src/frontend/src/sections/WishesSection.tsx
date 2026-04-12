import { useCallback, useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
  symbol: string;
  size: number;
  duration: number;
}

const PARTICLE_COLORS = [
  "oklch(0.80 0.16 340)",
  "oklch(0.82 0.12 300)",
  "oklch(0.85 0.14 80)",
  "oklch(0.97 0.01 260)",
  "oklch(0.88 0.10 340)",
  "oklch(0.90 0.08 80)",
];

const PARTICLE_SYMBOLS = ["✦", "✧", "♥", "·", "⁕"];

const BLESSINGS = [
  "May every day feel as magical as tonight. May you always know how deeply and completely you are loved.",
  "May your year ahead be filled with joy that matches your beautiful spirit, warmth that equals the love you give, and dreams that come true one by one.",
  "May the moonlight always find you. May you always feel my heart reaching across every distance, holding you close.",
];

function BlessingCard({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full rounded-xl p-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.8s ease-out ${index * 150}ms, transform 0.8s ease-out ${index * 150}ms`,
        background: "oklch(0.12 0.04 275 / 0.60)",
        backdropFilter: "blur(14px)",
        border: "1px solid oklch(0.82 0.12 300 / 0.30)",
        boxShadow: "0 2px 20px oklch(0.08 0.02 280 / 0.4)",
      }}
    >
      <p
        className="font-body text-sm md:text-base text-center"
        style={{
          color: "oklch(0.78 0.03 270)",
          lineHeight: 1.85,
          fontStyle: "italic",
        }}
      >
        {text}
      </p>
    </div>
  );
}

export function WishesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [wishMade, setWishMade] = useState(false);
  const [wishCooling, setWishCooling] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleWish = useCallback(() => {
    if (wishCooling) return;
    setWishCooling(true);
    setWishMade(false);

    const btn = btnRef.current;
    const btnRect = btn?.getBoundingClientRect();
    const scrollY = window.scrollY;

    const pCount = 42;
    const newParticles: Particle[] = Array.from({ length: pCount }, (_, i) => {
      const angle = (i / pCount) * Math.PI * 2;
      const distance = 80 + Math.random() * 220;
      const bx = btnRect
        ? btnRect.left + btnRect.width / 2
        : window.innerWidth / 2;
      const by = btnRect ? btnRect.top + scrollY + btnRect.height / 2 : 0;
      return {
        id: i,
        x: bx,
        y: by,
        tx: Math.cos(angle) * distance + (Math.random() - 0.5) * 60,
        ty: Math.sin(angle) * distance + (Math.random() - 0.5) * 60,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        symbol: PARTICLE_SYMBOLS[i % PARTICLE_SYMBOLS.length],
        size: 10 + Math.random() * 10,
        duration: 1.4 + Math.random() * 0.8,
      };
    });

    setParticles(newParticles);

    setTimeout(() => {
      setParticles([]);
      setWishMade(true);
    }, 2200);

    setTimeout(() => {
      setWishCooling(false);
    }, 5000);
  }, [wishCooling]);

  return (
    <section
      id="wishes"
      ref={sectionRef}
      className="relative px-4 py-24 md:py-32"
      style={{ zIndex: 10 }}
    >
      <div className="max-w-lg mx-auto text-center">
        {/* Title */}
        <div
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
          }}
        >
          <h2
            className="font-display text-3xl md:text-5xl mb-3"
            style={{
              color: "oklch(0.88 0.10 300)",
              fontStyle: "italic",
              textShadow: "0 0 30px oklch(0.82 0.12 300 / 0.4)",
            }}
          >
            A wish for you
          </h2>
          <p
            className="font-body text-sm md:text-base italic mb-12"
            style={{ color: "oklch(0.65 0.03 270)", lineHeight: 1.8 }}
          >
            Close your eyes. Breathe in the night. This is all for you.
          </p>
        </div>

        {/* Blessing cards */}
        <div className="flex flex-col gap-4 mb-12">
          {BLESSINGS.map((text, i) => (
            <BlessingCard key={text.slice(0, 20)} text={text} index={i} />
          ))}
        </div>

        {/* Make a wish button */}
        <div className="relative flex flex-col items-center gap-4">
          <button
            ref={btnRef}
            type="button"
            data-ocid="make-wish-btn"
            disabled={wishCooling && !wishMade}
            className="font-body px-9 py-4 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            style={{
              background: "oklch(0.82 0.12 300 / 0.12)",
              border: "1px solid oklch(0.82 0.12 300 / 0.65)",
              color: "oklch(0.92 0.06 290)",
              letterSpacing: "0.08em",
              fontSize: "1rem",
              boxShadow:
                wishCooling && !wishMade
                  ? "0 0 50px oklch(0.82 0.12 300 / 0.55), 0 0 100px oklch(0.82 0.12 300 / 0.25)"
                  : "0 0 24px oklch(0.82 0.12 300 / 0.30)",
              minHeight: "52px",
              transition: "all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
              transform: wishCooling && !wishMade ? "scale(1.06)" : "scale(1)",
              opacity: wishCooling && !wishMade ? 0.6 : 1,
              cursor: wishCooling && !wishMade ? "wait" : "pointer",
              animation: !wishCooling
                ? "pulse-soft 3s ease-in-out infinite"
                : "none",
            }}
            onClick={handleWish}
            onMouseEnter={(e) => {
              if (wishCooling) return;
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 40px oklch(0.82 0.12 300 / 0.55)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.82 0.12 300 / 0.22)";
            }}
            onMouseLeave={(e) => {
              if (wishCooling) return;
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 24px oklch(0.82 0.12 300 / 0.30)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.82 0.12 300 / 0.12)";
            }}
          >
            {wishCooling && !wishMade ? "✦ sending… ✦" : "✦ Make a Wish ✦"}
          </button>

          {/* Wish confirmed message */}
          {wishMade && (
            <p
              className="font-body text-sm italic"
              style={{
                color: "oklch(0.82 0.12 300)",
                opacity: 1,
                animation: "stardust 6s ease-out forwards",
                textShadow: "0 0 12px oklch(0.82 0.12 300 / 0.4)",
              }}
            >
              Your wish has been sent to the stars ✦
            </p>
          )}
        </div>
      </div>

      {/* Full-screen particle burst — fixed */}
      {particles.length > 0 && (
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 50 }}
          aria-hidden="true"
        >
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute"
              style={
                {
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  fontSize: `${p.size}px`,
                  color: p.color,
                  filter: `drop-shadow(0 0 4px ${p.color})`,
                  animation: `sparkle ${p.duration}s ease-out forwards`,
                  "--tx": `${p.tx}px`,
                  "--ty": `${p.ty}px`,
                } as React.CSSProperties & { "--tx": string; "--ty": string }
              }
            >
              {p.symbol}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
