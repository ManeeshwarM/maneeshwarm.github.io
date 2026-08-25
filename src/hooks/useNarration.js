import { useCallback, useEffect, useRef, useState } from "react";
import { buildNarration } from "../utils/narrator";

const VOICE_PREF_KEY = "portfolio_narrator_voice_enabled";

function getPreferredVoice() {
  const voices = window.speechSynthesis?.getVoices() || [];
  return (
    voices.find((v) => /en-US/i.test(v.lang) && /Google|Natural|Neural|Samantha/i.test(v.name)) ||
    voices.find((v) => /^en-US/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0] ||
    null
  );
}

// Drives the "AI Narrator" panel: reveals a project's narration script over
// time, optionally spoken aloud via the browser's built-in speech synthesis
// (native Web Speech API — no API key, no network call). The text itself
// always renders, spoken or not, like an optional lyrics track; voice is a
// remembered user preference layered on top.
export function useNarration(project) {
  const text = buildNarration(project);

  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    try {
      return localStorage.getItem(VOICE_PREF_KEY) !== "off";
    } catch {
      return true;
    }
  });
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [revealed, setRevealed] = useState("");
  const [speaking, setSpeaking] = useState(false);

  const revealTimerRef = useRef(null);
  const onDoneRef = useRef(null);

  // Voice list loads asynchronously in some browsers.
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const check = () => setVoiceSupported((window.speechSynthesis.getVoices() || []).length > 0);
    check();
    window.speechSynthesis.addEventListener?.("voiceschanged", check);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", check);
  }, []);

  const stopReveal = useCallback(() => {
    if (revealTimerRef.current) {
      clearInterval(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  }, []);

  const runReveal = useCallback(
    (durationMs, fullText) => {
      stopReveal();
      const start = performance.now();
      revealTimerRef.current = setInterval(() => {
        const elapsed = performance.now() - start;
        const pct = Math.min(1, elapsed / durationMs);
        setRevealed(fullText.slice(0, Math.round(fullText.length * pct)));
        if (pct >= 1) {
          stopReveal();
          setSpeaking(false);
          onDoneRef.current?.();
        }
      }, 30);
    },
    [stopReveal]
  );

  const stop = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    stopReveal();
    setSpeaking(false);
  }, [stopReveal]);

  // Clear stale text and cancel any in-flight speech whenever the track changes.
  useEffect(() => {
    setRevealed("");
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      stopReveal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  const play = useCallback(
    (scriptText, onDone) => {
      if (!scriptText) return;
      onDoneRef.current = onDone;
      setRevealed("");
      setSpeaking(true);

      const words = scriptText.trim().split(/\s+/).length;
      const estMs = Math.max(1800, (words / 165) * 60000); // ~165 wpm

      if (voiceEnabled && window.speechSynthesis && voiceSupported) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(scriptText);
        const voice = getPreferredVoice();
        if (voice) utter.voice = voice;
        utter.rate = 1;
        utter.onend = () => {
          stopReveal();
          setRevealed(scriptText);
          setSpeaking(false);
          onDoneRef.current?.();
        };
        utter.onerror = () => {
          stopReveal();
          setRevealed(scriptText);
          setSpeaking(false);
          onDoneRef.current?.();
        };
        window.speechSynthesis.speak(utter);
        runReveal(estMs, scriptText);
      } else {
        // No voice — just type it out, a little faster since nothing to keep pace with.
        runReveal(Math.max(1200, scriptText.length * 16), scriptText);
      }
    },
    [voiceEnabled, voiceSupported, runReveal, stopReveal]
  );

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((v) => {
      const next = !v;
      try {
        localStorage.setItem(VOICE_PREF_KEY, next ? "on" : "off");
      } catch {
        // ignore storage failures (private browsing, etc.)
      }
      if (!next && window.speechSynthesis) window.speechSynthesis.cancel();
      return next;
    });
  }, []);

  return { text, revealed, speaking, voiceEnabled, voiceSupported, toggleVoice, play, stop };
}