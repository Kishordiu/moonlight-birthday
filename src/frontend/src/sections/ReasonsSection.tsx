import { useCallback, useEffect, useRef, useState } from "react";

interface ReasonCard {
  title: string;
  body: string;
}

const REASONS: ReasonCard[] = [
  {
    title: "You are my moonlight",
    body: "Even in my darkest hour, you find a way to make everything bright. You are the soft glow I always find my way back to.",
  },
  {
    title: "My favorite place",
    body: "My favorite place in the entire world is anywhere your smile exists. Nothing compares to you.",
  },
  {
    title: "You make the night warm",
    body: "You make even the darkest night feel like the warmest shelter. In you, I have found my calm and my home.",
  },
  {
    title: "Every star is you",
    body: "Every star in this sky reminds me of one more reason to love you. And still, they are not enough to count them all.",
  },
  {
    title: "My calm, my sky",
    body: "You are my peace. My quiet. My soft place to land. In a world full of noise, you are my stillness.",
  },
  {
    title: "You are irreplaceable",
    body: "There is no one in this world quite like you. The way you love, the way you laugh — it is entirely your own, and it is perfect.",
  },
  {
    title: "I choose you, always",
    body: "If I had to choose again, a thousand times over, I would choose you every single time — without hesitation, without doubt.",
  },
  {
    title: "You are my universe",
    body: "You are not just a part of my world — you are the whole universe I live in. Every good thing leads back to you.",
  },
];

interface SparkBurst {
  id: number;
  x: number;
  y: number;
}

function ReasonCard({
  card,
  index,
}: {
  card: ReasonCard;
  index: number;
}) {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [sparks, setSparks] = useState<SparkBurst[]>([]);
  const ref = useRef<HTMLDivElement>(null);

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
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const onHoverEnter = useCallback((_e: React.MouseEvent<HTMLDivElement>) => {
    setHovering(true);
    const newSparks: SparkBurst[] = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
    }));
    setSparks(newSparks);
    setTimeout(() => setSparks([]), 900);
  }, []);

  const accentColors = [
    "oklch(0.80 0.16 340 / 0.35)",
    "oklch(0.82 0.12 300 / 0.35)",
    "oklch(0.75 0.10 80 / 0.35)",
    "oklch(0.80 0.16 340 / 0.35)",
    "oklch(0.82 0.12 300 / 0.35)",
    "oklch(0.75 0.10 80 / 0.35)",
    "oklch(0.80 0.16 340 / 0.35)",
    "oklch(0.82 0.12 300 / 0.35)",
  ];

  return (
    <div
      ref={ref}
      data-ocid={`reason-card-${index}`}
      onMouseEnter={onHoverEnter}
      onMouseLeave={() => setHovering(false)}
      className="relative overflow-hidden rounded-xl p-5 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "scale(1) translateY(0)"
          : "scale(0.88) translateY(24px)",
        transition: `opacity 0.75s cubic-bezier(0.25,0.46,0.45,0.94) ${index * 90}ms, transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94) ${index * 90}ms`,
        background: hovering
          ? "oklch(0.15 0.05 278 / 0.72)"
          : "oklch(0.12 0.04 275 / 0.60)",
        backdropFilter: "blur(14px)",
        border: `1px solid ${accentColors[index % accentColors.length]}`,
        boxShadow: hovering
          ? `0 4px 32px oklch(0.82 0.12 300 / 0.18), 0 0 0 1px ${accentColors[index % accentColors.length]}`
          : "0 2px 16px oklch(0.08 0.02 280 / 0.4)",
        transitionProperty: "opacity, transform, background, box-shadow",
        transitionDuration: "0.75s, 0.75s, 0.35s, 0.35s",
        transitionTimingFunction: "cubic-bezier(0.25,0.46,0.45,0.94)",
        minHeight: "140px",
      }}
    >
      {/* Star spark burst on hover */}
      {sparks.map((s) => (
        <div
          key={s.id}
          className="absolute pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: "0.6rem",
            color: "oklch(0.90 0.08 80)",
            animation: "sparkle 0.8s ease-out forwards",
          }}
          aria-hidden="true"
        >
          ✦
        </div>
      ))}

      <h3
        className="font-display text-base md:text-lg mb-2"
        style={{
          color: "oklch(0.95 0.04 80)",
          fontStyle: "italic",
          lineHeight: 1.3,
          textShadow: "0 0 16px oklch(0.90 0.08 80 / 0.3)",
        }}
      >
        {card.title}
      </h3>
      <p
        className="font-body text-sm"
        style={{ color: "oklch(0.72 0.03 270)", lineHeight: 1.75 }}
      >
        {card.body}
      </p>
    </div>
  );
}

export function ReasonsSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="reasons"
      className="relative px-4 py-24 md:py-32"
      style={{ zIndex: 10 }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <div
          ref={titleRef}
          className="text-center mb-14"
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
          }}
        >
          <h2
            className="font-display text-3xl md:text-5xl text-glow"
            style={{
              color: "oklch(0.97 0.02 80)",
              fontStyle: "italic",
              lineHeight: 1.2,
              textShadow: "0 0 30px oklch(0.90 0.08 80 / 0.35)",
            }}
          >
            Reasons I adore you…
          </h2>
          <div className="mt-3 flex justify-center gap-2" aria-hidden="true">
            {(["star-a", "star-b", "star-c"] as const).map((k, i) => (
              <span
                key={k}
                style={{
                  color: "oklch(0.82 0.12 300 / 0.7)",
                  fontSize: "0.55rem",
                  animation: `twinkle ${2 + i * 0.4}s ease-in-out infinite`,
                  animationDelay: `${i * 300}ms`,
                }}
              >
                ✦
              </span>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {REASONS.map((card, i) => (
            <ReasonCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
