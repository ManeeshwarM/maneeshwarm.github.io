import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { candidate, roadmap } from "../../data/portfolioData";
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  BadgeCheck,
  Play,
  Pause,
  Radio,
  ExternalLink,
  Users,
  Activity,
  ArrowRight,
  Clock,
  Cpu,
  Flame,
  Volume2,
  Terminal,
} from "lucide-react";

// --- Framer Motion Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function SpotifyAboutView({ onGoToProjects }) {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 font-sans text-zinc-200 selection:bg-[#1db954] selection:text-black"
    >
      {/* Dynamic Keyframes & Spotify Aura */}
      <style>{`
        @keyframes subtle-pulse {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.6; }
          50% { transform: scale(1.1) translate(-20px, 15px); opacity: 0.9; }
        }
        @keyframes eq-bounce {
          0%, 100% { height: 4px; }
          50% { height: 18px; }
        }
        .hero-glow {
          animation: subtle-pulse 7s ease-in-out infinite alternate;
        }
        .eq-bar-1 { animation: eq-bounce 0.8s ease-in-out infinite 0.1s; }
        .eq-bar-2 { animation: eq-bounce 0.6s ease-in-out infinite 0.3s; }
        .eq-bar-3 { animation: eq-bounce 0.9s ease-in-out infinite 0.15s; }
        .eq-bar-4 { animation: eq-bounce 0.7s ease-in-out infinite 0.4s; }
      `}</style>

      {/* --- 1. HERO BILLBOARD BANNER --- */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1db954]/25 via-[#121212]/90 to-[#0a0a0a] border border-white/10 p-6 sm:p-10 mb-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] group"
      >
        {/* Animated Radial Backdrop Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#1db954]/20 rounded-full blur-[100px] pointer-events-none hero-glow" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-7">
          {/* Avatar with Glow Ring & Status */}
          <div className="relative shrink-0">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-br from-[#1db954] via-[#10b981] to-[#047857] p-[3px] shadow-[0_0_30px_rgba(29,185,84,0.3)] flex items-center justify-center cursor-pointer"
            >
              <div className="w-full h-full rounded-[22px] bg-[#09090b]/95 backdrop-blur-md flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
                {/* Visualizer Lines Background in Avatar */}
                <div className="absolute inset-0 opacity-10 flex items-center justify-around px-4">
                  {[40, 70, 90, 60, 30, 85, 50].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-1 bg-[#1db954] rounded-full"
                    />
                  ))}
                </div>
                <span className="font-display text-4xl sm:text-5xl font-black text-white tracking-wider">
                  MM
                </span>
                <span className="text-[10px] font-mono text-[#1db954] mt-1 font-semibold tracking-widest">
                  AI ARCHITECT
                </span>
              </div>
            </motion.div>

            {/* Verified Badge */}
            <div className="absolute -bottom-2 -right-2 bg-[#1db954] text-black p-1.5 rounded-full shadow-lg border-4 border-[#121212] flex items-center justify-center">
              <BadgeCheck className="w-4 h-4 fill-current text-black stroke-[#1db954]" />
            </div>
          </div>

          {/* Artist Metadata */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1db954]/15 border border-[#1db954]/30 text-[11px] font-mono font-bold text-[#1db954] uppercase tracking-wider shadow-[0_0_12px_rgba(29,185,84,0.2)]">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified AI Engineer
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-zinc-400">
                <Radio className="w-3 h-3 text-[#1db954] animate-pulse" /> INFERENCE READY
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-sm">
              {candidate.name}
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 font-medium max-w-2xl leading-relaxed">
              {candidate.role}
            </p>

            {/* Quick Live Stats Pill Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
              <span className="flex items-center gap-1.5 text-zinc-300 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/5">
                <MapPin className="w-3.5 h-3.5 text-[#1db954]" /> {candidate.location}
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/5">
                <Activity className="w-3.5 h-3.5 text-[#38bdf8]" /> 4 Production ML Systems
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/5">
                <Users className="w-3.5 h-3.5 text-[#a855f7]" /> 40k+ Inferences/mo
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- 2. MAIN GRID CONTENT --- */}
      <div className="max-w-5xl space-y-8">
        {/* Biography Deck & Latest Release Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bio Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3 }}
            className="md:col-span-2 bg-[#141414]/90 hover:bg-[#181818]/90 border border-white/[0.08] hover:border-[#1db954]/30 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#1db954] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> Engineer Overview
                </span>
                <span className="text-[11px] font-mono text-zinc-500">DISCOGRAPHY BIO</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3 tracking-tight">
                Background & Engineering Vision
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                {candidate.bio}
              </p>
            </div>

            <div className="pt-5 mt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-xs font-mono text-zinc-500 gap-2">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Cpu className="w-3.5 h-3.5 text-[#1db954]" /> APPLIED DEEP LEARNING & LLM OPS
              </span>
              <span className="px-2 py-0.5 rounded bg-[#1db954]/10 text-[#1db954] border border-[#1db954]/20 font-semibold">
                SYSTEMS ONLINE
              </span>
            </div>
          </motion.div>

          {/* Latest Release Spotlight */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3 }}
            className="bg-gradient-to-br from-[#181818] to-[#0f0f0f] border border-white/[0.08] hover:border-[#38bdf8]/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#38bdf8]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#38bdf8] font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#38bdf8]" /> Latest Drop
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.06] px-2 py-0.5 rounded-full">
                  v2.4 Production
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight mb-1">
                Retinal Triage Net
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                ResNet-50 + Spatial Attention Map inference engine for automated clinical grading.
              </p>
            </div>

            {/* Audio Wave Visualizer on Toggle */}
            <div className="pt-5 space-y-3">
              {isPlayingPreview && (
                <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-[#1db954] animate-pulse" />
                    <span className="text-[10px] font-mono text-[#1db954]">Synthesizing loss tone...</span>
                  </div>
                  <div className="flex items-end gap-[3px] h-4">
                    <div className="w-[3px] bg-[#1db954] rounded-full eq-bar-1" />
                    <div className="w-[3px] bg-[#1db954] rounded-full eq-bar-2" />
                    <div className="w-[3px] bg-[#1db954] rounded-full eq-bar-3" />
                    <div className="w-[3px] bg-[#1db954] rounded-full eq-bar-4" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsPlayingPreview((prev) => !prev)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-200 ${
                    isPlayingPreview
                      ? "bg-[#1db954] text-black shadow-[0_0_15px_rgba(29,185,84,0.4)]"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {isPlayingPreview ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  {isPlayingPreview ? "Streaming" : "Preview Model"}
                </button>

                <button
                  onClick={onGoToProjects}
                  className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                  title="View All Projects"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Key Performance Metrics HUD */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1db954] animate-ping" /> Career Telemetry & Benchmarks
            </h2>
            <span className="text-[11px] font-mono text-zinc-500">PRODUCTION AUDITED</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {candidate.stats.map((st, idx) => (
              <motion.div
                key={st.label}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
                className="bg-[#141414]/90 border border-white/[0.08] hover:border-[#1db954]/40 rounded-xl p-4 transition-all duration-200 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#1db954]/5 rounded-full blur-xl group-hover:bg-[#1db954]/15 transition-all" />
                <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1 group-hover:text-zinc-300">
                  {st.label}
                </p>
                <p className="text-2xl sm:text-3xl font-mono font-black text-white group-hover:text-[#1db954] transition-colors">
                  {st.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Core Specializations */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-bold text-white mb-3 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1db954]" /> Core Specializations & Architecture
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              "Agentic RAG Pipelines (Multi-Agent Retrieval, Citation Verification, Auto-Redraft)",
              "Deep Learning & Computer Vision (CNNs for Financial Anomaly & Fraud Detection)",
              "LLM Fine-Tuning & Deployment (BERT, GPT-4, LLaMA)",
              "Production ML Systems (AWS SageMaker/Lambda, CI/CD, Model Monitoring)",
            ].map((spec, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
                className="flex items-start gap-3 bg-[#141414]/80 border border-white/[0.06] hover:border-white/20 hover:bg-[#181818] rounded-xl p-3.5 text-xs text-zinc-300 leading-relaxed transition-all cursor-default"
              >
                <CheckCircle2 className="w-4 h-4 text-[#1db954] shrink-0 mt-0.5" />
                <span>{spec}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Roadmap */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-400" /> On the Roadmap
          </h2>
          <p className="text-xs text-zinc-400 mb-4">
            Scoped, not yet built — next up: <span className="text-zinc-200 font-medium">{roadmap[0]?.title}</span>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roadmap.map((r) => (
              <motion.div
                key={r.title}
                whileHover={{ scale: 1.01 }}
                className="bg-white/[0.02] border border-dashed border-white/10 hover:border-white/25 rounded-xl px-4 py-3.5 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-bold text-white/90">{r.title}</p>
                  <span className="text-[9px] uppercase font-mono tracking-wide text-zinc-400 border border-white/10 rounded px-1.5 py-0.5 shrink-0 ml-2 bg-white/[0.03]">
                    {r.domain}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{r.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Disc Deck */}
        <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onGoToProjects}
            className="px-6 py-3.5 rounded-full bg-[#1db954] hover:bg-[#1ed760] text-black font-extrabold text-sm transition-colors flex items-center gap-2.5 shadow-[0_0_25px_rgba(29,185,84,0.35)]"
          >
            <Play className="w-4 h-4 fill-current" /> Explore Project Discography
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}