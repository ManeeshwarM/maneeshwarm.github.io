import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BOOT_LINES = [
  { text: "$ initializing ml_portfolio_registry@2.0.0", delay: 0 },
  { text: "→ loading model manifests… done (4 models found)", delay: 260 },
  { text: "→ warming up inference engines", delay: 220 },
  { text: "→ connecting embedding store [pgvector] ✓", delay: 240 },
  { text: "→ mounting audio synthesis layer ✓", delay: 200 },
  { text: "→ compiling skills constellation… ✓", delay: 260 },
  { text: "$ status: all systems nominal", delay: 260 },
];

const SESSION_KEY = "portfolio_boot_seen";

export default function BootSequence({ onDone }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = sessionStorage.getItem(SESSION_KEY);
    if (reduced || alreadySeen) {
      setSkip(true);
      onDone();
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");

    let cancelled = false;
    let cumulative = 0;
    BOOT_LINES.forEach((line, i) => {
      cumulative += line.delay;
      setTimeout(() => {
        if (!cancelled) setVisibleLines(i + 1);
      }, cumulative);
    });

    const finishTimer = setTimeout(() => {
      if (!cancelled) setExiting(true);
    }, cumulative + 420);

    const doneTimer = setTimeout(() => {
      if (!cancelled) onDone();
    }, cumulative + 420 + 500);

    return () => {
      cancelled = true;
      clearTimeout(finishTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (skip) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (exiting) onDone();
      }}
      className="fixed inset-0 z-[300] bg-black flex items-center justify-center px-6"
      style={{ pointerEvents: exiting ? "none" : "auto" }}
    >
      <div className="w-full max-w-lg font-mono text-xs sm:text-sm">
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className={
              line.text.startsWith("$")
                ? "text-[#1db954] font-semibold mb-1.5"
                : "text-white/50 mb-1.5"
            }
          >
            {line.text}
          </motion.p>
        ))}
        <span className="inline-block w-2 h-3.5 bg-[#1db954] animate-pulse align-middle" />
      </div>
    </motion.div>
  );
}
