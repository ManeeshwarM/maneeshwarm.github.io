import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  Disc3,
  Sparkles,
  Layers,
  Terminal,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { experience } from "../../data/portfolioData";

export default function SpotifyExperienceView() {
  const [selectedId, setSelectedId] = useState(experience[0]?.id || null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSkillFilter, setActiveSkillFilter] = useState(null);

  // Extract all unique skills across experiences for filter chips
  const allSkills = Array.from(
    new Set(experience.flatMap((exp) => exp.skills || []))
  );

  const filteredExperience = activeSkillFilter
    ? experience.filter((exp) => exp.skills?.includes(activeSkillFilter))
    : experience;

  const currentTrack =
    experience.find((exp) => exp.id === selectedId) || experience[0];

  const handleSelectTrack = (id) => {
    if (selectedId === id) {
      setIsPlaying((prev) => !prev);
    } else {
      setSelectedId(id);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 font-sans text-zinc-200">
      {/* Visualizer & Turntable Keyframes */}
      <style>{`
        @keyframes eq-bounce {
          0%, 100% { height: 4px; }
          50% { height: 18px; }
        }
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .eq-bar-1 { animation: eq-bounce 0.8s ease-in-out infinite 0.1s; }
        .eq-bar-2 { animation: eq-bounce 0.6s ease-in-out infinite 0.3s; }
        .eq-bar-3 { animation: eq-bounce 0.9s ease-in-out infinite 0.15s; }
        .eq-bar-4 { animation: eq-bounce 0.7s ease-in-out infinite 0.4s; }
        .spin-vinyl {
          animation: vinyl-spin 12s linear infinite;
        }
        .paused-vinyl {
          animation-play-state: paused;
        }
      `}</style>

      {/* --- HEADER BANNER --- */}
      <div className="pb-6 border-b border-white/[0.08] mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1db954]/10 border border-[#1db954]/25 text-xs font-mono font-bold text-[#1db954] mb-2 shadow-[0_0_15px_rgba(29,185,84,0.15)]">
            <Disc3 className={`w-3.5 h-3.5 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "4s" }} />
            PRODUCTION MASTER TRACKS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
            Career Experience
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Shipped engineering roles, MLOps orchestration, and system benchmarks in production.
          </p>
        </div>

        {/* Live Filter Pill List */}
        <div className="flex flex-wrap items-center gap-1.5 max-w-lg">
          <span className="text-[10px] font-mono uppercase text-zinc-400 mr-1">Filter:</span>
          {allSkills.slice(0, 6).map((skill) => {
            const isSelected = activeSkillFilter === skill;
            return (
              <button
                key={skill}
                onClick={() => setActiveSkillFilter(isSelected ? null : skill)}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-full border transition-all ${
                  isSelected
                    ? "bg-[#1db954] text-black font-bold border-[#1db954] shadow-[0_0_10px_rgba(29,185,84,0.3)]"
                    : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                }`}
              >
                #{skill}
              </button>
            );
          })}
          {activeSkillFilter && (
            <button
              onClick={() => setActiveSkillFilter(null)}
              className="text-[10px] font-mono text-rose-400 hover:underline ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* --- TWO-COLUMN SPOTIFY STUDIO DECK --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: Interactive Tracklist (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 px-3 flex items-center justify-between">
            <span># Title / Organization</span>
            <span>Period</span>
          </div>

          <div className="space-y-2">
            {filteredExperience.map((exp, idx) => {
              const isSelected = currentTrack?.id === exp.id;

              return (
                <motion.div
                  key={exp.id}
                  whileHover={{ x: 4 }}
                  onClick={() => handleSelectTrack(exp.id)}
                  className={`group relative rounded-xl p-3.5 cursor-pointer border transition-all duration-200 flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-gradient-to-r from-[#1db954]/15 via-[#181818] to-[#121212] border-[#1db954]/50 shadow-[0_0_20px_rgba(29,185,84,0.15)]"
                      : "bg-[#121212]/80 border-white/[0.05] hover:border-white/20 hover:bg-[#181818]"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Index or Audio Spectrum Indicator */}
                    <div className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-mono text-xs font-bold bg-white/[0.04]">
                      {isSelected && isPlaying ? (
                        <div className="flex items-end gap-[2px] h-3.5">
                          <span className="w-1 bg-[#1db954] rounded-full eq-bar-1" />
                          <span className="w-1 bg-[#1db954] rounded-full eq-bar-2" />
                          <span className="w-1 bg-[#1db954] rounded-full eq-bar-3" />
                        </div>
                      ) : (
                        <span className={isSelected ? "text-[#1db954]" : "text-zinc-500"}>
                          0{idx + 1}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3
                        className={`text-sm font-bold truncate transition-colors ${
                          isSelected ? "text-[#1db954]" : "text-white group-hover:text-zinc-100"
                        }`}
                      >
                        {exp.role}
                      </h3>
                      <p className="text-xs text-zinc-400 truncate flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-zinc-500" /> {exp.company}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-zinc-400 block">
                      {exp.period.split("—")[0]}
                    </span>
                    <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${isSelected ? "text-[#1db954] translate-x-0.5" : "text-zinc-600 opacity-0 group-hover:opacity-100"}`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Master Track Deep Dive & Vinyl Deck (7 Cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {currentTrack && (
              <motion.div
                key={currentTrack.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-[#141414]/95 border border-white/10 rounded-3xl p-6 sm:p-7 relative overflow-hidden backdrop-blur-2xl shadow-2xl"
              >
                {/* Vinyl Disc & Glow Accent Header */}
                <div className="relative flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/[0.08]">
                  {/* Turntable Disc */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-28 h-28 rounded-full bg-gradient-to-tr from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] border-4 border-zinc-800 shadow-[0_0_25px_rgba(0,0,0,0.8)] flex items-center justify-center relative overflow-hidden ${
                        isPlaying ? "spin-vinyl" : "paused-vinyl"
                      }`}
                    >
                      {/* Vinyl Grooves */}
                      <div className="absolute inset-1 rounded-full border border-white/5" />
                      <div className="absolute inset-3 rounded-full border border-white/5" />
                      <div className="absolute inset-5 rounded-full border border-white/5" />
                      <div className="w-10 h-10 rounded-full bg-[#1db954] flex items-center justify-center shadow-inner">
                        <div className="w-3 h-3 rounded-full bg-black" />
                      </div>
                    </div>

                    {/* Master Play/Pause Floating Action */}
                    <button
                      onClick={() => setIsPlaying((p) => !p)}
                      className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#1db954] text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Now Playing Metadata */}
                  <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1db954]/15 border border-[#1db954]/30 text-[#1db954] font-bold uppercase">
                        MASTER PLAYBACK
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-500" /> {currentTrack.location}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {currentTrack.role}
                    </h2>

                    <p className="text-sm font-semibold text-[#1db954] flex items-center justify-center sm:justify-start gap-1.5">
                      <Briefcase className="w-4 h-4" /> {currentTrack.company}
                      <span className="text-zinc-500 font-mono font-normal text-xs ml-2">
                        ({currentTrack.period})
                      </span>
                    </p>
                  </div>
                </div>

                {/* Looping Track Progress Wave */}
                <div className="py-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1.5">
                    <span className="flex items-center gap-1 text-[#1db954]">
                      <Volume2 className="w-3 h-3" /> 44.1kHz • Studio Master
                    </span>
                    <span>Production Telemetry Active</span>
                  </div>
                  <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-[#10b981] to-[#1db954] h-full rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: isPlaying ? "100%" : "45%" }}
                      transition={{
                        duration: isPlaying ? 10 : 0.5,
                        ease: isPlaying ? "linear" : "easeOut",
                        repeat: isPlaying ? Infinity : 0,
                      }}
                    />
                  </div>
                </div>

                {/* Role Description */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal mb-5">
                  {currentTrack.description}
                </p>

                {/* High-Yield Production Highlights */}
                <div className="space-y-2 mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#1db954]" /> Shipped Deliverables & Impact
                  </span>
                  {currentTrack.highlights?.map((hl, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl hover:border-white/10 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#1db954] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Skills Audio Frequency Tags */}
                <div className="pt-4 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">
                    Orchestrated Tech Stacks
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTrack.skills?.map((sk) => (
                      <span
                        key={sk}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-300 font-medium"
                      >
                        #{sk}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}