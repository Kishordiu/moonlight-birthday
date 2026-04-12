import { useCallback, useEffect, useRef, useState } from "react";

interface ParallaxOffset {
  x: number;
  y: number;
}

export function useParallax(maxOffset = 20): ParallaxOffset {
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });
  const targetRef = useRef<ParallaxOffset>({ x: 0, y: 0 });
  const currentRef = useRef<ParallaxOffset>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const cx = currentRef.current.x;
    const cy = currentRef.current.y;
    const tx = targetRef.current.x;
    const ty = targetRef.current.y;

    const nx = lerp(cx, tx, 0.06);
    const ny = lerp(cy, ty, 0.06);

    if (Math.abs(nx - cx) > 0.01 || Math.abs(ny - cy) > 0.01) {
      currentRef.current = { x: nx, y: ny };
      setOffset({ x: nx, y: ny });
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      targetRef.current = {
        x: dx * maxOffset,
        y: dy * maxOffset,
      };
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      const x = Math.max(
        -maxOffset,
        Math.min(maxOffset, (e.gamma / 45) * maxOffset),
      );
      const y = Math.max(
        -maxOffset,
        Math.min(maxOffset, ((e.beta - 45) / 45) * maxOffset),
      );
      targetRef.current = { x, y };
    };

    const isMobile = "ontouchstart" in window;

    if (isMobile) {
      window.addEventListener("deviceorientation", handleOrientation, {
        passive: true,
      });
    } else {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    return () => {
      if (isMobile) {
        window.removeEventListener("deviceorientation", handleOrientation);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [maxOffset]);

  return offset;
}
