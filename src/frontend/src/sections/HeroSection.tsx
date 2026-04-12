import { useEffect, useRef, useState } from "react";
import { Moon } from "../components/Moon";

export function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [moonGlowing, setMoonGlowing] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const baseStyle: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition:
      "opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)",
  };

  const delay = (ms: number): React.CSSProperties => ({
    ...baseStyle,
    transitionDelay: `${ms}ms`,
  });

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ zIndex: 10 }}
    >
      {/* Moon */}
      <div
        style={delay(0)}
        className="flex items-center justify-center mb-6 md:mb-10"
      >
        <Moon onMoonClick={() => setMoonGlowing(true)} />
      </div>

      {/* Sparkle dots row */}
      <div
        style={delay(200)}
        className="flex items-center gap-2 mb-5"
        aria-hidden="true"
      >
        {(["s0", "d1", "s2", "d3", "s4", "d5", "s6"] as const).map((key, i) => (
          <span
            key={key}
            style={{
              color:
                i % 2 === 0
                  ? "oklch(0.85 0.10 80 / 0.85)"
                  : "oklch(0.60 0.03 280 / 0.5)",
              fontSize: i % 2 === 0 ? "0.65rem" : "0.4rem",
              animation: `twinkle ${1.8 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 180}ms`,
            }}
          >
            {i % 2 === 0 ? "✦" : "·"}
          </span>
        ))}
      </div>

      {/* Main card */}
      <div
        style={{
          ...delay(400),
          background: moonGlowing
            ? "oklch(0.12 0.04 280 / 0.60)"
            : "oklch(0.12 0.04 280 / 0.55)",
          backdropFilter: "blur(18px)",
          border: "1px solid oklch(0.35 0.06 300 / 0.35)",
          boxShadow: moonGlowing
            ? "0 0 60px 20px oklch(0.82 0.12 300 / 0.2), 0 8px 40px oklch(0.08 0.02 280 / 0.5)"
            : "0 8px 40px oklch(0.08 0.02 280 / 0.5)",
          transition:
            "box-shadow 1.2s ease-out, opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)",
          transitionDelay: "400ms",
        }}
        className="max-w-sm md:max-w-lg w-full text-center p-8 md:p-12 rounded-2xl"
      >
        <h1
          className="font-display text-4xl md:text-6xl mb-4 text-glow"
          style={{
            color: "oklch(0.97 0.02 80)",
            lineHeight: 1.15,
            fontStyle: "italic",
            textShadow:
              "0 0 30px oklch(0.90 0.08 80 / 0.4), 0 0 60px oklch(0.85 0.10 80 / 0.2)",
          }}
        >
          Happy Birthday,
          <br />
          my love
        </h1>

        <p
          className="font-body text-sm md:text-base mb-8 italic"
          style={{ color: "oklch(0.78 0.04 280)", lineHeight: 1.8 }}
        >
          Tonight, the sky is beautiful…
          <br />
          but it is not as beautiful as you.
        </p>

        <button
          type="button"
          data-ocid="begin-night-cta"
          className="font-body px-8 py-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          style={{
            background: "oklch(0.75 0.10 80 / 0.08)",
            border: "1px solid oklch(0.75 0.10 80 / 0.65)",
            color: "oklch(0.92 0.08 80)",
            letterSpacing: "0.07em",
            fontSize: "0.88rem",
            boxShadow: "0 0 18px oklch(0.75 0.10 80 / 0.22)",
            minHeight: "44px",
            transition: "all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
            animation: "float 4s ease-in-out infinite",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 35px oklch(0.75 0.10 80 / 0.55), 0 0 70px oklch(0.82 0.12 300 / 0.25)";
            (e.currentTarget as HTMLButtonElement).style.background =
              "oklch(0.75 0.10 80 / 0.18)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 18px oklch(0.75 0.10 80 / 0.22)";
            (e.currentTarget as HTMLButtonElement).style.background =
              "oklch(0.75 0.10 80 / 0.08)";
          }}
          onClick={() => {
            document
              .getElementById("reasons")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Begin the Night →
        </button>
      </div>

      {/* Scroll chevron */}
      <div
        style={delay(900)}
        className="absolute bottom-8 flex flex-col items-center gap-1"
        aria-hidden="true"
      >
        <svg
          width="20"
          height="12"
          viewBox="0 0 20 12"
          fill="none"
          aria-hidden="true"
          style={{
            color: "oklch(0.65 0.04 280 / 0.7)",
            animation: "float 2.4s ease-in-out infinite",
          }}
        >
          <path
            d="M2 2L10 10L18 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
