import { AudioControl } from "./components/AudioControl";
import { FloatingElements } from "./components/FloatingElements";
import { NightSky } from "./components/NightSky";
import { ClosingSection } from "./sections/ClosingSection";
import { HeroSection } from "./sections/HeroSection";
import { ReasonsSection } from "./sections/ReasonsSection";
import { UniverseSection } from "./sections/UniverseSection";
import { WishesSection } from "./sections/WishesSection";

export default function App() {
  return (
    <div
      className="relative"
      style={{
        minHeight: "100vh",
        overflowY: "scroll",
        overflowX: "hidden",
        background: "oklch(0.08 0.02 280)",
        scrollBehavior: "smooth",
      }}
    >
      {/* Fixed full-screen background */}
      <NightSky />

      {/* Drifting hearts and stars */}
      <FloatingElements />

      {/* Audio control — top right corner */}
      <AudioControl />

      {/* Story sections */}
      <HeroSection />
      <ReasonsSection />
      <UniverseSection />
      <WishesSection />
      <ClosingSection />

      {/* Footer */}
      <footer
        className="relative py-8 text-center"
        style={{
          zIndex: 10,
          color: "oklch(0.38 0.02 280)",
          fontSize: "0.72rem",
          letterSpacing: "0.03em",
        }}
      >
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            typeof window !== "undefined" ? window.location.hostname : "",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "oklch(0.52 0.05 295)" }}
          className="transition-smooth hover:opacity-80"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
