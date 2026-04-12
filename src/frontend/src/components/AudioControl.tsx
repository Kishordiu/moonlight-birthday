import { useCallback, useEffect, useRef, useState } from "react";

interface AudioNodes {
  ctx: AudioContext;
  masterGain: GainNode;
}

function buildAmbience(ctx: AudioContext, master: GainNode) {
  // --- Deep bass drone (40 Hz) ---
  const drone = ctx.createOscillator();
  drone.type = "sine";
  drone.frequency.value = 41.2;
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.06;
  drone.connect(droneGain);
  droneGain.connect(master);
  drone.start();

  // Tremolo on drone
  const tremoloLFO = ctx.createOscillator();
  tremoloLFO.frequency.value = 0.3;
  tremoloLFO.type = "sine";
  const tremoloDepth = ctx.createGain();
  tremoloDepth.gain.value = 0.02;
  tremoloLFO.connect(tremoloDepth);
  tremoloDepth.connect(droneGain.gain);
  tremoloLFO.start();

  // --- Harmonic overtone (82 Hz) ---
  const harm1 = ctx.createOscillator();
  harm1.type = "sine";
  harm1.frequency.value = 82.4;
  const harm1Gain = ctx.createGain();
  harm1Gain.gain.value = 0.025;
  harm1.connect(harm1Gain);
  harm1Gain.connect(master);
  harm1.start();

  // Vibrato on harm1
  const vibratoLFO = ctx.createOscillator();
  vibratoLFO.frequency.value = 5;
  vibratoLFO.type = "sine";
  const vibratoDepth = ctx.createGain();
  vibratoDepth.gain.value = 0.8;
  vibratoLFO.connect(vibratoDepth);
  vibratoDepth.connect(harm1.frequency);
  vibratoLFO.start();

  // --- High overtone shimmer (164 Hz) ---
  const harm2 = ctx.createOscillator();
  harm2.type = "sine";
  harm2.frequency.value = 164.8;
  const harm2Gain = ctx.createGain();
  harm2Gain.gain.value = 0.012;
  harm2.connect(harm2Gain);
  harm2Gain.connect(master);
  harm2.start();

  // --- Cricket-like texture (rapid modulation at ~3200 Hz) ---
  const cricket = ctx.createOscillator();
  cricket.type = "sine";
  cricket.frequency.value = 3200;
  const cricketEnvLFO = ctx.createOscillator();
  cricketEnvLFO.type = "square";
  cricketEnvLFO.frequency.value = 14;
  const cricketGain = ctx.createGain();
  cricketGain.gain.value = 0;
  const cricketDepth = ctx.createGain();
  cricketDepth.gain.value = 0.006;
  cricketEnvLFO.connect(cricketDepth);
  cricketDepth.connect(cricketGain.gain);
  cricket.connect(cricketGain);
  cricketGain.connect(master);
  cricket.start();
  cricketEnvLFO.start();

  // --- Second cricket layer offset ---
  const cricket2 = ctx.createOscillator();
  cricket2.type = "sine";
  cricket2.frequency.value = 3600;
  const cricketEnvLFO2 = ctx.createOscillator();
  cricketEnvLFO2.type = "square";
  cricketEnvLFO2.frequency.value = 11;
  const cricketGain2 = ctx.createGain();
  cricketGain2.gain.value = 0;
  const cricketDepth2 = ctx.createGain();
  cricketDepth2.gain.value = 0.004;
  cricketEnvLFO2.connect(cricketDepth2);
  cricketDepth2.connect(cricketGain2.gain);
  cricket2.connect(cricketGain2);
  cricketGain2.connect(master);
  cricket2.start();
  cricketEnvLFO2.start();

  // --- Gentle piano-like tone: 261.6 Hz (middle C) with fade LFO ---
  const pianoOsc = ctx.createOscillator();
  pianoOsc.type = "sine";
  pianoOsc.frequency.value = 261.6;
  const pianoGain = ctx.createGain();
  pianoGain.gain.value = 0;
  const pianoLFO = ctx.createOscillator();
  pianoLFO.type = "sine";
  pianoLFO.frequency.value = 0.07;
  const pianoLFOGain = ctx.createGain();
  pianoLFOGain.gain.value = 0.018;
  pianoLFO.connect(pianoLFOGain);
  pianoLFOGain.connect(pianoGain.gain);
  pianoOsc.connect(pianoGain);
  pianoGain.connect(master);
  pianoOsc.start();
  pianoLFO.start();

  // --- Soft wind via filtered noise ---
  const bufferSize = ctx.sampleRate * 2;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    noiseData[i] = Math.random() * 2 - 1;
  }
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 400;
  noiseFilter.Q.value = 0.5;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.018;
  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(master);
  noiseSource.start();

  // --- Delay / reverb ---
  const delay = ctx.createDelay(1.0);
  delay.delayTime.value = 0.35;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.3;
  const delayGain = ctx.createGain();
  delayGain.gain.value = 0.08;
  master.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(ctx.destination);
}

export function AudioControl() {
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<AudioNodes | null>(null);

  const startAudio = useCallback(() => {
    if (audioRef.current) return;
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0.12;
    master.connect(ctx.destination);
    buildAmbience(ctx, master);
    audioRef.current = { ctx, masterGain: master };
    setStarted(true);
  }, []);

  useEffect(() => {
    const handler = () => {
      if (!audioRef.current) startAudio();
    };
    window.addEventListener("click", handler, { once: true });
    window.addEventListener("touchstart", handler, {
      once: true,
      passive: true,
    });
    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, [startAudio]);

  const toggleMute = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!audioRef.current) {
        startAudio();
        return;
      }
      const newMuted = !muted;
      setMuted(newMuted);
      const { masterGain, ctx } = audioRef.current;
      masterGain.gain.setTargetAtTime(
        newMuted ? 0 : 0.12,
        ctx.currentTime,
        0.3,
      );
    },
    [muted, startAudio],
  );

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? "Unmute ambient sound" : "Mute ambient sound"}
      data-ocid="audio-toggle"
      className="fixed top-4 right-4 z-50 w-11 h-11 rounded-full flex items-center justify-center transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{
        background: "oklch(0.12 0.03 275 / 0.65)",
        backdropFilter: "blur(12px)",
        border: "1px solid oklch(0.30 0.06 280 / 0.45)",
        boxShadow: muted
          ? "none"
          : "0 0 14px 2px oklch(0.82 0.12 300 / 0.25), 0 0 28px 6px oklch(0.82 0.12 300 / 0.12)",
      }}
    >
      {muted || !started ? (
        // Muted waveform / crossed note
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 7h3l4-4v14l-4-4H3V7z"
            fill="oklch(0.65 0.02 260 / 0.8)"
            stroke="oklch(0.65 0.02 260 / 0.5)"
            strokeWidth="0.5"
          />
          <line
            x1="14"
            y1="7"
            x2="18"
            y2="13"
            stroke="oklch(0.80 0.16 340 / 0.8)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1="18"
            y1="7"
            x2="14"
            y2="13"
            stroke="oklch(0.80 0.16 340 / 0.8)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        // Glowing waveform bars
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          {[3, 7, 11, 15].map((x, i) => (
            <rect
              key={x}
              x={x}
              y={10 - [6, 9, 7, 4][i]}
              width="2.5"
              height={[12, 18, 14, 8][i]}
              rx="1.25"
              fill="oklch(0.82 0.12 300 / 0.9)"
              style={{
                animation: `waveBar 1.2s ${i * 0.15}s ease-in-out infinite`,
              }}
            />
          ))}
        </svg>
      )}
    </button>
  );
}
