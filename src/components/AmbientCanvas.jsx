import { useEffect, useRef } from "react";
import { audioEngine } from "../utils/audioEngine";

// A full-viewport canvas of drifting particles that pulse to the *actual*
// Web Audio frequency data coming off the currently playing model tone —
// not a simulated waveform. Falls back to a slow idle drift when nothing
// is playing or before the AudioContext has been unlocked by a click.
export default function AmbientCanvas({ accent = "#1db954", active = false }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let width, height;

    const hexToRgb = (hex) => {
      const v = hex.replace("#", "");
      return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
    };

    const resize = () => {
      width = canvas.width = window.innerWidth * window.devicePixelRatio;
      height = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 46;
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: COUNT }).map(() => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.6 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.00012,
        vy: (Math.random() - 0.5) * 0.00012,
        bin: Math.floor(Math.random() * 32),
      }));
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const [r, g, b] = hexToRgb(accent);
      const freq = active ? audioEngine.getFrequencyData() : null;

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;

        const energy = freq ? freq[p.bin] / 255 : 0.12 + 0.06 * Math.sin(Date.now() / 1400 + p.bin);
        const radius = (p.r + energy * 5) * window.devicePixelRatio;
        const alpha = 0.12 + energy * 0.55;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.shadowColor = `rgba(${r},${g},${b},${Math.min(alpha * 1.4, 0.9)})`;
        ctx.shadowBlur = energy > 0.35 ? 10 * window.devicePixelRatio : 0;
        ctx.arc(p.x * width, p.y * height, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [accent, active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, mixBlendMode: "screen", opacity: 0.8 }}
    />
  );
}
