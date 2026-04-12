import { useEffect, useMemo, useRef } from "react";
import { useParallax } from "../hooks/useParallax";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  animDelay: number;
  animDuration: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

// Seeded random number generator for deterministic star positions
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateStars(count: number): Star[] {
  const rand = seededRandom(42);
  return Array.from({ length: count }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    size: rand() * 2.5 + 0.8,
    opacity: rand() * 0.5 + 0.4,
    animDelay: rand() * 4,
    animDuration: rand() * 3 + 2,
  }));
}

function generateParticles(count: number): Particle[] {
  const rand = seededRandom(99);
  return Array.from({ length: count }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    size: rand() * 2 + 1,
    delay: rand() * 8,
    duration: rand() * 6 + 8,
    drift: (rand() - 0.5) * 30,
  }));
}

const STARS = generateStars(100);
const PARTICLES = generateParticles(18);

const CLOUDS = [
  {
    width: 280,
    height: 80,
    top: 15,
    opacity: 0.12,
    duration: 60,
    delay: 0,
    blur: 18,
  },
  {
    width: 220,
    height: 60,
    top: 22,
    opacity: 0.09,
    duration: 80,
    delay: -20,
    blur: 22,
  },
  {
    width: 340,
    height: 90,
    top: 35,
    opacity: 0.07,
    duration: 100,
    delay: -45,
    blur: 28,
  },
  {
    width: 190,
    height: 55,
    top: 10,
    opacity: 0.11,
    duration: 70,
    delay: -30,
    blur: 16,
  },
];

export function NightSky() {
  const { x: px, y: py } = useParallax(20);
  const containerRef = useRef<HTMLDivElement>(null);

  // Star hover sparkle
  const handleStarHover = (e: React.MouseEvent<SVGCircleElement>) => {
    const el = e.currentTarget;
    el.style.filter = "brightness(3) drop-shadow(0 0 6px white)";
    setTimeout(() => {
      el.style.filter = "";
    }, 600);
  };

  const stars = useMemo(() => STARS, []);
  const particles = useMemo(() => PARTICLES, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Deep night sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, oklch(0.18 0.06 290) 0%, oklch(0.10 0.04 280) 40%, oklch(0.06 0.02 265) 100%)",
        }}
      />

      {/* Star field SVG layer */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{
          transform: `translate(${px * 0.3}px, ${py * 0.3}px)`,
          transition: "transform 0.1s linear",
          width: "110%",
          height: "110%",
          left: "-5%",
          top: "-5%",
        }}
        role="img"
        aria-label="Twinkling star field"
      >
        {stars.map((star, i) => (
          <circle
            key={`star-${i}-${Math.round(star.x)}-${Math.round(star.y)}`}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="white"
            style={{
              opacity: star.opacity,
              animation: `twinkle ${star.animDuration}s ${star.animDelay}s ease-in-out infinite`,
              cursor: "crosshair",
              transition: "filter 0.3s ease",
            }}
            onMouseEnter={handleStarHover}
          />
        ))}
      </svg>

      {/* Drifting cloud blobs */}
      {CLOUDS.map((cloud, i) => (
        <div
          key={`cloud-${cloud.top}-${cloud.width}`}
          className="absolute"
          style={{
            top: `${cloud.top}%`,
            left: "-30%",
            width: cloud.width,
            height: cloud.height,
            background: "oklch(0.75 0.04 280 / 0.18)",
            borderRadius: "50%",
            filter: `blur(${cloud.blur}px)`,
            opacity: cloud.opacity * 2,
            animation: `drift ${cloud.duration}s ${cloud.delay}s linear infinite`,
            transform: `translate(${px * (0.5 + i * 0.15)}px, ${py * 0.2}px)`,
          }}
        />
      ))}

      {/* Stardust particles */}
      {particles.map((p, i) => (
        <div
          key={`particle-${Math.round(p.x * 10)}-${Math.round(p.y * 10)}-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background:
              i % 3 === 0
                ? "oklch(0.82 0.12 300 / 0.7)"
                : i % 3 === 1
                  ? "oklch(0.75 0.10 80 / 0.6)"
                  : "oklch(0.97 0.01 260 / 0.5)",
            animation: `stardust ${p.duration}s ${p.delay}s ease-in-out infinite`,
            transform: `translateX(${p.drift}px)`,
          }}
        />
      ))}

      {/* Soft purple nebula glow */}
      <div
        className="absolute"
        style={{
          top: "20%",
          left: "60%",
          width: 400,
          height: 300,
          background:
            "radial-gradient(ellipse, oklch(0.50 0.10 300 / 0.12) 0%, transparent 70%)",
          transform: `translate(${px * 0.5}px, ${py * 0.4}px)`,
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute"
        style={{
          top: "60%",
          left: "10%",
          width: 300,
          height: 250,
          background:
            "radial-gradient(ellipse, oklch(0.55 0.12 340 / 0.10) 0%, transparent 70%)",
          transform: `translate(${px * -0.3}px, ${py * 0.3}px)`,
          borderRadius: "50%",
          filter: "blur(50px)",
        }}
      />
    </div>
  );
}
