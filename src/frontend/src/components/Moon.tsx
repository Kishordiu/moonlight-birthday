import { useCallback, useState } from "react";

interface MoonProps {
  onMoonClick?: () => void;
}

export function Moon({ onMoonClick }: MoonProps) {
  const [blazing, setBlazing] = useState(false);
  const [sparkleTrail, setSparkleTrail] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  const handleClick = useCallback(() => {
    setBlazing(true);
    onMoonClick?.();

    // Spawn sparkle trail particles — hidden easter egg for "kishor"
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 180,
      y: -(Math.random() * 120 + 20),
    }));
    setSparkleTrail(newSparkles);

    setTimeout(() => {
      setBlazing(false);
      setSparkleTrail([]);
    }, 1800);
  }, [onMoonClick]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: "clamp(180px, 35vw, 280px)",
        height: "clamp(180px, 35vw, 280px)",
      }}
    >
      {/* Outer glow halo — expands when blazing */}
      <div
        className="absolute rounded-full"
        style={{
          inset: blazing ? "-60px" : "-30px",
          background: `radial-gradient(circle, oklch(0.97 0.03 80 / ${blazing ? 0.3 : 0.15}) 0%, oklch(0.90 0.08 80 / ${blazing ? 0.2 : 0.08}) 40%, transparent 70%)`,
          transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          animation: "glow-pulse 4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Mid glow ring */}
      <div
        className="absolute rounded-full"
        style={{
          inset: blazing ? "-20px" : "-10px",
          background: `radial-gradient(circle, oklch(0.97 0.02 70 / ${blazing ? 0.5 : 0.25}) 0%, transparent 60%)`,
          transition: "all 0.8s ease-out",
          pointerEvents: "none",
        }}
      />

      {/* Moon body */}
      <button
        type="button"
        onClick={handleClick}
        aria-label="Click the moon"
        data-ocid="moon-button"
        className="relative rounded-full cursor-pointer focus:outline-none"
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at 35% 35%, oklch(0.98 0.03 80) 0%, oklch(0.93 0.06 75) 35%, oklch(0.86 0.08 70) 65%, oklch(0.78 0.07 65) 100%)",
          boxShadow: blazing
            ? "0 0 80px 30px oklch(0.97 0.05 80 / 0.7), 0 0 140px 60px oklch(0.90 0.08 75 / 0.4)"
            : "0 0 40px 10px oklch(0.90 0.06 80 / 0.35), 0 0 80px 30px oklch(0.85 0.08 75 / 0.2)",
          transform: blazing ? "scale(1.08)" : "scale(1.0)",
          transition: "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          animation: "pulse-soft 4s ease-in-out infinite",
        }}
      >
        {/* Crater details */}
        <div
          className="absolute rounded-full"
          style={{
            width: "18%",
            height: "18%",
            top: "28%",
            left: "55%",
            background: "oklch(0.82 0.06 70 / 0.45)",
            boxShadow: "inset 2px 2px 4px oklch(0.70 0.06 65 / 0.3)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "12%",
            height: "12%",
            top: "55%",
            left: "25%",
            background: "oklch(0.80 0.06 68 / 0.35)",
            boxShadow: "inset 1px 1px 3px oklch(0.70 0.06 65 / 0.3)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "8%",
            height: "8%",
            top: "42%",
            left: "68%",
            background: "oklch(0.83 0.05 72 / 0.3)",
          }}
        />

        {/* Surface shimmer */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, oklch(0.99 0.01 80 / 0.6) 0%, transparent 45%)",
            pointerEvents: "none",
          }}
        />
      </button>

      {/* Hidden sparkle trail (easter egg — kishor's touch) */}
      {sparkleTrail.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 6,
            height: 6,
            left: "50%",
            top: "50%",
            background: "oklch(0.97 0.03 80)",
            boxShadow: "0 0 8px 3px oklch(0.97 0.03 80 / 0.8)",
            transform: `translate(calc(-50% + ${s.x}px), calc(-50% + ${s.y}px))`,
            animation: "sparkle 1.5s ease-out forwards",
          }}
        />
      ))}
    </div>
  );
}
