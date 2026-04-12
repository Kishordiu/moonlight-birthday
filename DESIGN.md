# Design Brief: Romantic Night Sky

**Purpose**: A deeply romantic, magical interactive birthday gift website celebrating love through a premium night sky aesthetic. Emotional impact through visual storytelling, smooth motion, and hidden surprises.

## Direction & Tone
Premium, tender, deeply romantic — never cheesy or loud. Dark mode exclusive. Magical, dreamlike quality with continuous subtle animations and glowing elements. Mobile-first, polished, luxurious appearance.

## Color Palette

| Token | OKLCH | Purpose |
|-------|-------|---------|
| Night Sky (Background) | 0.08 0.02 280 | Deep navy-purple primary background |
| Deep Purple (Card) | 0.12 0.03 275 | Glassmorphism card base |
| Cloud Purple (Popover) | 0.15 0.04 278 | Elevated surfaces, modals |
| Soft White (Foreground) | 0.97 0.01 260 | Primary text, moon, stars |
| Rose (Primary Accent) | 0.80 0.16 340 | Buttons, highlights, emphasis |
| Lavender (Secondary Accent) | 0.82 0.12 300 | Secondary highlights, borders |
| Pale Gold (Tertiary) | 0.75 0.10 80 | Sparkles, decorative accents |
| Muted Purple | 0.20 0.02 280 | Borders, subtle dividers |
| Silver | 0.65 0.02 260 | Muted text, secondary labels |

## Typography
- **Display**: Instrument Serif (italic) — romantic, elegant, dreamy headings
- **Body**: General Sans — clean, readable, premium sans-serif
- **Mono**: JetBrains Mono — technical/code elements (minimal use)

## Motion Tokens
| Duration | Value |
|----------|-------|
| Slow | 800ms |
| Medium | 500ms |
| Fast | 200ms |
| Easing | cubic-bezier(0.25, 0.46, 0.45, 0.94) |

**Animations**: Float (4s), Pulse-Soft (3s), Twinkle (2s), Sparkle (0.8s), Glow-Pulse (2s), Drift (6s)

## Structural Zones
| Zone | Background | Border | Treatment |
|------|-----------|--------|-----------|
| Hero/Header | `--background` gradient | None | Full-height, centered content, animated moon |
| Card Container | `glass` (0.6 opacity + blur 12px) | `--muted` 0.4 opacity | Rounded-lg, elevated with rose/lavender glow |
| Button CTA | Rose gradient or lavender | Rose ring | Glow effect, medium transition |
| Footer | None (transparent) | Subtle `--muted` | Centered, minimal text |

## Shadows & Depth
- **Glow-Rose**: `0 0 20px oklch(0.80 0.16 340 / 0.4)` — button/card accents
- **Glow-Lavender**: `0 0 20px oklch(0.82 0.12 300 / 0.4)` — secondary highlights
- **Glow-Gold**: `0 0 20px oklch(0.75 0.10 80 / 0.3)` — sparkle effects
- **Glow-Cream**: `0 0 30px oklch(0.97 0.01 260 / 0.4)` — moon, text emphasis

## Component Patterns
- **Cards**: `.glass` class + `.card-elevated` with transition-slow
- **Buttons**: Rose or Lavender gradient with `.glow-rose` or `.glow-lavender`, hover scale-up
- **Text**: `.text-glow` for emphasis on headings, soft shadows
- **Stars**: Twinkle animation, hover sparkle burst

## Spacing & Rhythm
Desktop-first grid with 4px base unit. Cards use `p-6` (24px) padding. Section gaps: 2rem–4rem. Mobile: reduced to `p-4` with adjusted gaps.

## Differentiation
Hidden "moonlight message" easter egg reveals on scroll-bottom or specific interaction. Continuous, smooth micro-animations (floating hearts, drifting clouds, pulsing moon). Glassmorphism cards with colorful glow shadows. No external images — all code-generated visuals (SVG canvas elements).

## Constraints
- No auto-playing audio; user interaction required
- No external images or photos
- All color values from OKLCH palette
- Motion: smooth easing-out curves, no bouncy animations
- Accessibility: high contrast maintained on all interactive elements
