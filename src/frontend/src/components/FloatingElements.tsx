import { useCallback, useEffect, useRef, useState } from "react";

interface FloatingItem {
  id: number;
  type: "heart" | "star";
  x: number;
  color: string;
  size: number;
  duration: number;
  swayAngle: number;
}

const COLORS = [
  "oklch(0.80 0.16 340 / 0.75)", // rose
  "oklch(0.82 0.12 300 / 0.75)", // lavender
  "oklch(0.85 0.14 80 / 0.75)", // warm gold
  "oklch(0.88 0.10 340 / 0.70)", // soft pink
];

const HeartSVG = ({ color, size }: { color: string; size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ filter: `drop-shadow(0 0 5px ${color})` }}
    aria-hidden="true"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const StarSVG = ({ color, size }: { color: string; size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ filter: `drop-shadow(0 0 5px ${color})` }}
    aria-hidden="true"
  >
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

let idCounter = 0;

export function FloatingElements() {
  const [items, setItems] = useState<FloatingItem[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const spawnItem = useCallback(() => {
    setItems((prev) => {
      if (prev.length >= 8) return prev;
      const item: FloatingItem = {
        id: ++idCounter,
        type: Math.random() > 0.45 ? "heart" : "star",
        x: 5 + Math.random() * 90,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 14 + Math.random() * 14,
        duration: 7 + Math.random() * 6,
        swayAngle: (Math.random() - 0.5) * 40,
      };
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    const schedule = () => {
      const delay = 3000 + Math.random() * 2000;
      timerRef.current = setTimeout(() => {
        spawnItem();
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timerRef.current);
  }, [spawnItem]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute"
          style={
            {
              left: `${item.x}%`,
              bottom: "-60px",
              animation: `floatUp ${item.duration}s ease-out forwards`,
              "--sway": `${item.swayAngle}px`,
            } as React.CSSProperties & { "--sway": string }
          }
          onAnimationEnd={() => removeItem(item.id)}
        >
          {item.type === "heart" ? (
            <HeartSVG color={item.color} size={item.size} />
          ) : (
            <StarSVG color={item.color} size={item.size} />
          )}
        </div>
      ))}
    </div>
  );
}
