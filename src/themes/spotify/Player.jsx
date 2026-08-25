import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Mic2,
  X,
  Heart,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  Maximize2,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import AlbumArt from "./AlbumArt";
import VinylArt from "./VinylArt";
import { audioEngine } from "../../utils/audioEngine";
import { useNarration } from "../../hooks/useNarration";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const GREEN = "#1db954";

function VolumeIcon({ vol }) {
  if (vol === 0) return <VolumeX className="w-4 h-4" />;
  if (vol < 40) return <Volume1 className="w-4 h-4" />;
  return <Volume2 className="w-4 h-4" />;
}

export default function Player({
  project,
  playing,
  setPlaying,
  onSkip,
  likedIds,
  onToggleLike,
  volume,
  setVolume,
  shuffle,
  setShuffle,
  repeat,
  setRepeat,
}) {
  const [epoch, setEpoch] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [prevVol, setPrevVol] = useState(70);
  const [collapsed, setCollapsed] = useState(false);
  const progressRef = useRef(null);
  const volRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const narration = useNarration(project);

  const totalEpochs = project ? project.lossCurve.length : 10;

  useEffect(() => {
    if (project) setEpoch(0);
  }, [project?.id]);

  // Handle narration when lyrics view is open
  useEffect(() => {
    if (playing && showLyrics && project && !narration.speaking && !narration.revealed) {
      narration.play(narration.text);
    }
  }, [playing, showLyrics, project?.id]);

  // Pause narration on track pause
  useEffect(() => {
    if (!playing) narration.stop();
  }, [playing]);

  // Model tone and epoch stepper
  useEffect(() => {
    if (!playing || !project) {
      audioEngine.stopModelTone();
      return;
    }

    audioEngine.playModelTone(project.accent, epoch);

    const t = setInterval(() => {
      setEpoch((e) => {
        if (e >= totalEpochs - 1) {
          if (repeat === "one") return 0;
          if (repeat === "all") {
            onSkip("forward");
            return 0;
          }
          setPlaying(false);
          audioEngine.stopModelTone();
          return e;
        }
        return e + 1;
      });
    }, 900);

    return () => {
      clearInterval(t);
      audioEngine.stopModelTone();
    };
  }, [playing, totalEpochs, repeat, project?.id]);

  const pct = project ? (epoch / Math.max(totalEpochs - 1, 1)) * 100 : 0;
  const loss = project ? project.lossCurve[epoch] : 0;
  const isLiked = project ? likedIds.has(project.id) : false;
  const chartData = project
    ? project.lossCurve.map((v, i) => ({ epoch: i + 1, loss: v }))
    : [];

  const handleProgressClick = (e) => {
    if (!progressRef.current || !project) return;
    audioEngine.playClickSound();
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPct = Math.max(0, Math.min(1, x / rect.width));
    setEpoch(Math.round(newPct * (totalEpochs - 1)));
  };

  const handleVolumeClick = (e) => {
    if (!volRef.current) return;
    const rect = volRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVol = Math.round(Math.max(0, Math.min(100, (x / rect.width) * 100)));
    setVolume(newVol);
    audioEngine.muted = newVol === 0;
  };

  const toggleMute = () => {
    audioEngine.playClickSound();
    if (volume === 0) {
      setVolume(prevVol || 70);
      audioEngine.muted = false;
    } else {
      setPrevVol(volume);
      setVolume(0);
      audioEngine.muted = true;
      audioEngine.stopModelTone();
    }
  };

  const cycleRepeat = () => {
    audioEngine.playClickSound();
    setRepeat((r) => (r === "none" ? "all" : r === "all" ? "one" : "none"));
  };

  // Convert narration & project description into lines for karaoke synchronization
  const lyricLines = project
    ? [
        `Architecture: ${project.architecture}`,
        ...(narration.text ? narration.text.split(". ").filter(Boolean) : [project.description]),
        `Current Loss: ${loss.toFixed(4)} at Epoch ${epoch + 1}/${totalEpochs}`,
      ]
    : [];

  const activeLineIdx = Math.min(
    Math.floor((pct / 100) * lyricLines.length),
    lyricLines.length - 1
  );

  return (
    <>
      {/* ================= SPOTIFY FULL-SCREEN LYRICS DRAWER ================= */}
      <AnimatePresence>
        {showLyrics && project && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed inset-0 bottom-[90px] z-[80] overflow-hidden flex flex-col p-6 sm:p-12 select-none backdrop-blur-3xl"
            style={{
              background: `linear-gradient(180deg, ${project.accent || "#1db954"}33 0%, #0c0c0c 70%, #070707 100%)`,
            }}
          >
            {/* Header / Top controls */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-4">
                <VinylArt project={project} size={48} playing={playing} />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#1db954] font-bold">
                    Now Explaining • Model Walkthrough
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{project.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    audioEngine.playClickSound();
                    narration.play(narration.text);
                  }}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  title="Restart Walkthrough"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    audioEngine.playClickSound();
                    narration.toggleVoice();
                  }}
                  className={`p-2.5 rounded-full border transition-all ${
                    narration.voiceEnabled
                      ? "bg-[#1db954] text-black border-[#1db954]"
                      : "bg-white/10 text-white border-white/10"
                  }`}
                  title={narration.voiceEnabled ? "Voice Enabled" : "Voice Off (Text Only)"}
                >
                  {narration.voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowLyrics(false)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  aria-label="Close lyrics"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Karaoke-Style Synced Lyrics Stream */}
            <div
              ref={lyricsContainerRef}
              className="flex-1 overflow-y-auto py-10 space-y-6 sm:space-y-8 max-w-3xl pr-4"
            >
              {lyricLines.map((line, idx) => {
                const isCurrent = idx === activeLineIdx;
                const isPast = idx < activeLineIdx;

                return (
                  <motion.p
                    key={idx}
                    animate={{
                      scale: isCurrent ? 1.03 : 1,
                      opacity: isCurrent ? 1 : isPast ? 0.6 : 0.25,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`font-display text-2xl sm:text-4xl font-extrabold cursor-pointer transition-all ${
                      isCurrent
                        ? "text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                    onClick={() => {
                      const targetPct = idx / lyricLines.length;
                      setEpoch(Math.round(targetPct * (totalEpochs - 1)));
                    }}
                  >
                    {line}
                  </motion.p>
                );
              })}

              {/* Code Snippet Box inside Lyrics view */}
              {project.codeSnippet && (
                <div className="pt-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">
                    Kernel Implementation
                  </span>
                  <pre className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                    {project.codeSnippet}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= FULLSCREEN VISUALIZER ================= */}
      {showFullscreen && project && (
        <div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center p-8 select-none"
          style={{ background: "#0d0d0d" }}
        >
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-6 right-6 text-white/40 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <AlbumArt project={project} size={64} rounded="rounded-lg" />
              <div>
                <span
                  className="text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded border"
                  style={{
                    color: project.accent,
                    borderColor: `${project.accent}44`,
                    background: `${project.accent}11`,
                  }}
                >
                  Now Playing Visualizer
                </span>
                <h2 className="font-display text-3xl font-bold text-white mt-1">
                  {project.title}
                </h2>
                <p className="text-sm text-white/50">{project.architecture}</p>
              </div>
            </div>

            {/* Spectrum animation bar */}
            <div className="flex items-end gap-1 h-12 mb-6 justify-center">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 rounded-t transition-all"
                  style={{
                    background: project.accent,
                    height: playing ? `${20 + ((i * 17 + epoch * 13) % 80)}%` : "15%",
                  }}
                />
              ))}
            </div>

            <p className="text-xs uppercase tracking-widest mb-2 font-mono text-white/40">
              Training Loss Curve
            </p>
            <div
              className="h-56 rounded-xl border p-4 mb-6"
              style={{ background: "#111", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="epoch"
                    tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1a2a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: 11,
                    }}
                    formatter={(v) => [v.toFixed(4), "loss"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="loss"
                    stroke={project.accent}
                    strokeWidth={2}
                    dot={{ r: 3, fill: project.accent }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs uppercase tracking-widest mb-2 font-mono text-white/40">
              Architecture Snippet
            </p>
            <pre
              className="font-mono text-xs rounded-xl p-4 overflow-x-auto leading-relaxed border"
              style={{
                background: "#111",
                borderColor: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              {project.codeSnippet}
            </pre>
          </div>
        </div>
      )}

      {/* ================= BOTTOM PERSISTENT PLAYER ================= */}
      <div
        className="shrink-0 border-t select-none relative z-50"
        style={{ background: "#181818", borderColor: "rgba(255,255,255,0.1)" }}
      >
        {/* Pull tab */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand player bar" : "Collapse player bar"}
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-4 rounded-t-md flex items-center justify-center hover:bg-white/5 transition-colors"
          style={{
            background: "#181818",
            border: "1px solid rgba(255,255,255,0.1)",
            borderBottom: "none",
          }}
        >
          {collapsed ? (
            <ChevronUp className="w-3.5 h-3.5 text-white/50" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-white/50" />
          )}
        </button>

        {collapsed ? (
          <div className="flex items-center gap-3 px-4 py-2">
            {project ? (
              <VinylArt project={project} size={28} playing={playing} />
            ) : (
              <div className="w-7 h-7 rounded-full bg-white/5" />
            )}
            <p className="text-xs font-semibold text-white truncate flex-1">
              {project ? project.title : "Nothing playing"}
            </p>
            <button
              onClick={() => {
                audioEngine.playClickSound();
                if (project) setPlaying((p) => !p);
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ background: project ? "#fff" : "rgba(255,255,255,0.15)" }}
              aria-label={playing ? "Pause" : "Play"}
              disabled={!project}
            >
              {playing ? (
                <Pause className="w-3 h-3 text-black fill-black" />
              ) : (
                <Play className="w-3 h-3 text-black fill-black ml-0.5" />
              )}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 items-center px-4 py-3 gap-4">
            {/* Left: Now Playing Info */}
            <div className="flex items-center gap-3 min-w-0">
              {project ? (
                <>
                  <VinylArt project={project} size={56} playing={playing} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate text-white">{project.title}</p>
                    <p
                      className="text-xs truncate font-mono"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {project.architecture}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      audioEngine.playClickSound();
                      onToggleLike(project.id);
                    }}
                    className="ml-2 shrink-0 transition-transform hover:scale-110"
                    aria-label={isLiked ? "Unlike" : "Like"}
                  >
                    <Heart
                      className="w-4 h-4 transition-colors"
                      style={{
                        color: isLiked ? GREEN : "rgba(255,255,255,0.4)",
                        fill: isLiked ? GREEN : "none",
                      }}
                    />
                  </button>
                </>
              ) : (
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Select a project to begin
                </p>
              )}
            </div>

            {/* Center: Controls & Scrubber */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-5">
                <button
                  onClick={() => {
                    audioEngine.playClickSound();
                    setShuffle((s) => !s);
                  }}
                  className="transition-colors"
                  aria-label="Shuffle"
                  style={{ color: shuffle ? GREEN : "rgba(255,255,255,0.55)" }}
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    audioEngine.playClickSound();
                    onSkip("backward");
                  }}
                  className="transition-colors"
                  aria-label="Previous"
                  disabled={!project}
                  style={{
                    color: project ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
                    cursor: project ? "pointer" : "default",
                  }}
                >
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>

                <button
                  onClick={() => {
                    audioEngine.playClickSound();
                    if (project) setPlaying((p) => !p);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-105"
                  style={{
                    background: project ? "#fff" : "rgba(255,255,255,0.3)",
                    cursor: project ? "pointer" : "default",
                  }}
                  aria-label={playing ? "Pause" : "Play"}
                  disabled={!project}
                >
                  {playing ? (
                    <Pause className="w-3.5 h-3.5 text-black fill-black" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-black fill-black ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => {
                    audioEngine.playClickSound();
                    onSkip("forward");
                  }}
                  className="transition-colors"
                  aria-label="Next"
                  disabled={!project}
                  style={{
                    color: project ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
                    cursor: project ? "pointer" : "default",
                  }}
                >
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>

                <button
                  onClick={cycleRepeat}
                  className="relative transition-colors"
                  aria-label="Repeat"
                  style={{ color: repeat !== "none" ? GREEN : "rgba(255,255,255,0.55)" }}
                >
                  {repeat === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                  {repeat !== "none" && (
                    <span
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: GREEN }}
                    />
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-2 w-full max-w-md">
                <span
                  className="text-[10px] font-mono w-16 text-right"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {project ? `${epoch + 1}/${totalEpochs}` : "–/–"}
                </span>
                <div
                  ref={progressRef}
                  onClick={handleProgressClick}
                  className="flex-1 h-1 rounded-full cursor-pointer group relative"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300 relative"
                    style={{
                      width: `${pct}%`,
                      background: project ? GREEN : "rgba(255,255,255,0.3)",
                    }}
                  >
                    <span
                      className="absolute right-0 top-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: "#fff",
                        transform: "translate(50%, -50%)",
                        boxShadow: "0 0 4px rgba(0,0,0,0.5)",
                      }}
                    />
                  </div>
                </div>
                <span
                  className="text-[10px] font-mono w-16"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {project ? `loss ${loss.toFixed(2)}` : "–"}
                </span>
              </div>
            </div>

            {/* Right: Lyrics / Metrics / Volume */}
            <div className="flex items-center justify-end gap-3">
              {/* Metrics */}
              {project &&
                project.metrics.slice(0, 2).map((m) => (
                  <div key={m.label} className="text-right hidden lg:block">
                    <p
                      className="text-[10px] uppercase tracking-wide font-mono"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {m.label}
                    </p>
                    <p className="text-xs font-mono text-white">
                      {m.value}
                      {m.unit}
                    </p>
                  </div>
                ))}

              {/* Spotify-style Lyrics Toggle Button */}
              <button
                onClick={() => {
                  audioEngine.playClickSound();
                  setShowLyrics((s) => !s);
                }}
                className={`p-2 rounded-full transition-all ${
                  showLyrics
                    ? "bg-[#1db954] text-black shadow-[0_0_15px_rgba(29,185,84,0.4)]"
                    : "text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
                aria-label="Toggle Lyrics"
                title="Lyrics / Architecture Walkthrough"
                disabled={!project}
              >
                <Mic2 className="w-4 h-4" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                  aria-label="Toggle mute"
                >
                  <VolumeIcon vol={volume} />
                </button>
                <div
                  ref={volRef}
                  className="w-20 h-1 rounded-full cursor-pointer group relative"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                  onClick={handleVolumeClick}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${volume}%`, background: "#fff" }}
                  >
                    <span
                      className="absolute right-0 top-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: "#fff",
                        transform: "translate(50%, -50%)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Fullscreen Modal Toggle */}
              <button
                onClick={() => {
                  audioEngine.playClickSound();
                  if (project) setShowFullscreen(true);
                }}
                className="transition-colors hover:text-white"
                style={{
                  color: project ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)",
                  cursor: project ? "pointer" : "default",
                }}
                aria-label="Expand"
                disabled={!project}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}