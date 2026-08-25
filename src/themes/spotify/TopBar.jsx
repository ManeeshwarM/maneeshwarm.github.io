import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  User,
  ExternalLink,
  Check,
  Copy,
  X,
  BadgeCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  Activity,
  Radio,
  Users,
} from "lucide-react";
import { candidate } from "../../data/portfolioData";

export default function TopBar({
  searchQuery,
  setSearchQuery,
  onOpenResume,
  onOpenCmd,
  onNavigate,
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyEmail = () => {
    if (candidate?.email) {
      navigator.clipboard.writeText(candidate.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenBio = () => {
    setShowProfileMenu(false);
    setShowBioModal(true);
  };

  const handleGoToFullAbout = () => {
    setShowBioModal(false);
    if (typeof onNavigate === "function") {
      onNavigate("about");
    }
  };

  return (
    <>
      <div
        className="flex items-center gap-3 px-4 py-1.5 shrink-0 select-none relative z-40"
        style={{ background: "transparent" }}
      >
        {/* Navigation Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/20 cursor-pointer"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/20 cursor-pointer"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => window.history.forward()}
            aria-label="Go forward"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Search Command Palette Trigger */}
        <div
          onClick={onOpenCmd}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpenCmd();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Open command palette"
          className="relative flex-1 max-w-sm cursor-pointer group"
        >
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors"
            aria-hidden="true"
          />
          <input
            type="text"
            readOnly
            tabIndex={-1}
            aria-hidden="true"
            placeholder="Search models, skills, or press Ctrl+K…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-14 py-1.5 rounded-full text-[11px] outline-none transition-all cursor-pointer bg-white/10 hover:bg-white/15 border border-transparent hover:border-white/20 text-white placeholder-white/40 font-sans"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/50 border border-white/10">
            Ctrl+K
          </span>
        </div>

        {/* Candidate Actions & Profile Menu */}
        <div className="flex items-center gap-2 ml-auto" ref={menuRef}>
          <button
            onClick={onOpenResume}
            className="px-3.5 py-1.5 rounded-full font-bold text-[11px] transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 shadow-md font-sans cursor-pointer"
            style={{ background: "#1db954", color: "#000" }}
          >
            <FileText className="w-3.5 h-3.5" /> Resume
          </button>

          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all cursor-pointer border ${
              showProfileMenu
                ? "bg-[#1db954] border-[#1db954] text-black scale-105 ring-2 ring-[#1db954]/30"
                : "bg-white/15 hover:bg-white/25 border-white/10 text-white"
            }`}
            title="Account & Engineer Profile"
            aria-label="User menu"
          >
            <User className="w-3.5 h-3.5" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-4 top-12 w-64 bg-[#1f1f1f] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl z-50 text-zinc-200 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 border-b border-white/[0.08] mb-1">
                <p className="text-xs font-bold text-white truncate">
                  {candidate?.name || "Maneeshwar M"}
                </p>
                <p className="text-[10px] font-mono text-[#1db954] truncate">
                  {candidate?.role || "AI/ML Engineer"}
                </p>
              </div>

              <div className="space-y-0.5 text-xs font-sans">
                <button
                  onClick={handleOpenBio}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>Artist Biography</span>
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                <button
                  onClick={handleCopyEmail}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>{copied ? "Email Copied!" : "Copy Email"}</span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-[#1db954]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                </button>

                {candidate?.github && (
                  <a
                    href={candidate.github}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-between transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <span>GitHub Profile</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  </a>
                )}

                {candidate?.linkedin && (
                  <a
                    href={candidate.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-between transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  </a>
                )}
              </div>

              <div className="mt-1 pt-2 border-t border-white/[0.08] px-3 py-1 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>STATUS</span>
                <span className="text-[#1db954] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1db954] animate-pulse" /> OPEN FOR ROLES
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- PREMIUM SPOTIFY ARTIST BIOGRAPHY MODAL --- */}
      <AnimatePresence>
        {showBioModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#121212] border border-white/15 rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative"
            >
              {/* Glowing Top Ambient Header */}
              <div className="relative p-6 sm:p-7 bg-gradient-to-b from-[#1db954]/20 via-[#181818]/60 to-[#121212] border-b border-white/10">
                <button
                  onClick={() => setShowBioModal(false)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-black/40 hover:bg-white/20 text-zinc-400 hover:text-white transition-all cursor-pointer z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-4">
                  {/* Mini Avatar Badge */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1db954] to-[#10b981] p-0.5 shrink-0 shadow-lg">
                    <div className="w-full h-full rounded-[14px] bg-[#09090b] flex items-center justify-center font-display text-xl font-extrabold text-white">
                      MM
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1db954]/15 border border-[#1db954]/30 text-[10px] font-mono font-bold text-[#1db954] uppercase tracking-wider">
                        <BadgeCheck className="w-3 h-3 text-[#1db954]" /> Verified Artist
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                        <Radio className="w-2.5 h-2.5 text-[#1db954] animate-pulse" /> LIVE
                      </span>
                    </div>

                    <h2 className="text-2xl font-black text-white tracking-tight">
                      {candidate?.name || "Maneeshwar M"}
                    </h2>
                    <p className="text-xs font-mono text-zinc-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#1db954]" /> {candidate?.location} • {candidate?.role}
                    </p>
                  </div>
                </div>

                {/* Micro Stats Telemetry */}
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1 text-zinc-300">
                    <Activity className="w-3.5 h-3.5 text-[#38bdf8]" /> 4 ML Systems
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-zinc-300">
                    <Users className="w-3.5 h-3.5 text-[#a855f7]" /> 40k+ Inferences/mo
                  </span>
                </div>
              </div>

              {/* Bio Content */}
              <div className="p-6 sm:p-7 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1db954] font-bold block">
                  Professional Bio
                </span>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal bg-black/40 p-4 rounded-2xl border border-white/5 max-h-48 overflow-y-auto">
                  {candidate?.bio ||
                    "AI/ML Engineer specializing in production-ready machine learning systems, Generative AI, LLMs, and high-performance distributed architectures."}
                </p>

                {/* Action Button to Full About Tab */}
                <button
                  onClick={handleGoToFullAbout}
                  className="w-full py-3.5 rounded-full bg-[#1db954] hover:bg-[#1ed760] text-black font-extrabold text-xs transition-transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(29,185,84,0.35)] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Open Full About Page</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}