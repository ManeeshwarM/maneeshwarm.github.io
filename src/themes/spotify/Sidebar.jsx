import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderGit2,
  User,
  Briefcase,
  BrainCircuit,
  Award,
  Mail,
  Heart,
  BarChart3,
  Library,
  Plus,
  ArrowRight,
  Search,
  Pin,
  Sparkles,
  Radio,
  SlidersHorizontal,
} from "lucide-react";
import { domains } from "../../data/portfolioData";

const GREEN = "#1db954";

export default function Sidebar({
  activeTab,
  setActiveTab,
  activeDomain,
  setActiveDomain,
  likedIds,
}) {
  const [libraryFilter, setLibraryFilter] = useState("all"); // 'all' | 'playlists' | 'liked'
  const [librarySearch, setLibrarySearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const mainNav = [
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "about", label: "About", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: BrainCircuit },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  const filteredDomains = domains.filter((d) => {
    if (libraryFilter === "liked") return false;
    if (!librarySearch) return true;
    return d.name.toLowerCase().includes(librarySearch.toLowerCase());
  });

  return (
    <aside className="w-64 shrink-0 flex flex-col h-full select-none gap-2 p-2 bg-black font-sans text-zinc-300">
      <style>{`
        @keyframes mini-eq {
          0%, 100% { height: 3px; }
          50% { height: 12px; }
        }
        .sidebar-eq-1 { animation: mini-eq 0.6s ease-in-out infinite 0.1s; }
        .sidebar-eq-2 { animation: mini-eq 0.8s ease-in-out infinite 0.3s; }
        .sidebar-eq-3 { animation: mini-eq 0.5s ease-in-out infinite 0.15s; }
      `}</style>

      {/* --- BOX 1: MAIN NAVIGATION --- */}
      <div className="bg-[#121212] rounded-xl p-4 flex flex-col gap-3 shadow-lg border border-white/[0.04]">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pb-1">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 1134 340" width="80" height="24" fill="white">
              <title>Spotify</title>
              <path d="M8 171c0 92 76 168 168 168s168-76 168-168S268 4 176 4 8 79 8 171zm230 78c-39-24-89-30-147-17-14 2-16-18-4-20 64-15 118-8 162 19 11 7 0 24-11 18zm31-47c-49-30-124-39-182-21-17 5-23-21-7-25 67-20 148-10 203 24 13 8 0 28-14 22zM82 85c-19 6-27-25-9-30 59-18 159-15 210 22 15 9 1 31-13 24-45-27-138-30-188-16zm189 285c-41-8-94 0-120 49h276c-26-49-79-57-120-49h-36zm28 16h-20c10-18 27-28 45-29 7-1 14 0 20 3l-12 26h-33zm-60 0h-20c10-18 27-28 45-29 7-1 14 0 20 3l-12 26h-33z" />
              <path d="M430 129h100c41 0 68 24 68 63v1c0 39-27 65-68 65H430V129zm30 27v74h70c23 0 38-14 38-36v-1c0-23-15-37-38-37h-70zm171-27h30v129h-30V129zm64 129V129h30v103h66v26H695zm113 0V129h30v103h66v26H808zm113 0V129h131v26H951v28h92v25h-92v50h-28z" />
            </svg>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#1db954]/20 text-[#1db954] border border-[#1db954]/30 uppercase">
              ML STUDIO
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === "projects") setActiveDomain(null);
                }}
                aria-current={isActive ? "page" : undefined}
                className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-lg text-xs font-bold transition-all group ${
                  isActive
                    ? "text-white bg-white/[0.1] shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-[#1db954]" : "text-zinc-400 group-hover:text-white"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="truncate">{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="w-1.5 h-1.5 rounded-full bg-[#1db954] ml-auto"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* --- BOX 2: YOUR LIBRARY (MODELS & PLAYLISTS) --- */}
      <div className="flex-1 bg-[#121212] rounded-xl flex flex-col overflow-hidden shadow-lg border border-white/[0.04]">
        {/* Library Header */}
        <div className="px-4 pt-3.5 pb-2">
          <div className="flex items-center justify-between mb-2.5">
            <button
              onClick={() => {
                setActiveTab("projects");
                setActiveDomain(null);
              }}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors group"
            >
              <Library className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              <span>Your Library</span>
            </button>
            
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              title="Search Library Playlists"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Filter Pill Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "all", label: "Playlists" },
              { id: "liked", label: `Liked (${likedIds?.size || 0})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setLibraryFilter(f.id)}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                  libraryFilter === f.id
                    ? "bg-white text-black font-bold shadow-sm"
                    : "bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Collapsible Search Input */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-2"
              >
                <div className="relative">
                  <Search className="w-3 h-3 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter domains..."
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-md pl-7 pr-2 py-1 text-[11px] text-white placeholder-zinc-500 focus:outline-none focus:border-[#1db954]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scrollable Playlist Area */}
        <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
          {/* Liked Models Special Playlist */}
          {(libraryFilter === "all" || libraryFilter === "liked") && (
            <button
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all group text-left ${
                activeTab === "projects" && activeDomain === "liked"
                  ? "bg-white/[0.08]"
                  : "hover:bg-white/[0.04]"
              }`}
              onClick={() => {
                setActiveTab("projects");
                setActiveDomain("liked");
              }}
            >
              <div className="w-9 h-9 rounded-md bg-gradient-to-br from-[#450af5] via-[#8e2de2] to-[#c4efd9] flex items-center justify-center shrink-0 shadow-md">
                <Heart className="w-4 h-4 fill-white text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs font-semibold truncate ${
                    activeTab === "projects" && activeDomain === "liked"
                      ? "text-[#1db954]"
                      : "text-white group-hover:text-white"
                  }`}
                >
                  Liked Models
                </p>
                <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                  <Pin className="w-2.5 h-2.5 text-[#1db954] fill-current" /> Auto-Playlist • {likedIds?.size || 0} tracks
                </p>
              </div>
            </button>
          )}

          {/* Domain Playlists */}
          {libraryFilter !== "liked" &&
            filteredDomains.map((d) => {
              const isActive = activeTab === "projects" && activeDomain === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => {
                    setActiveTab("projects");
                    setActiveDomain(d.id);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all text-left group ${
                    isActive
                      ? "bg-white/[0.08] text-white"
                      : "hover:bg-white/[0.04] text-zinc-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                        isActive
                          ? "bg-[#1db954]/20 border-[#1db954]/40 text-[#1db954]"
                          : "bg-white/[0.03] border-white/5 text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    >
                      <FolderGit2 className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`truncate font-semibold text-xs transition-colors ${
                          isActive ? "text-[#1db954]" : "text-zinc-200 group-hover:text-white"
                        }`}
                      >
                        {d.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        Playlist • Catalog
                      </p>
                    </div>
                  </div>

                  {/* Equalizer Indicator when selected */}
                  {isActive && (
                    <div className="flex items-end gap-[2px] h-3 shrink-0 mr-1">
                      <div className="w-[2px] bg-[#1db954] rounded-full sidebar-eq-1" />
                      <div className="w-[2px] bg-[#1db954] rounded-full sidebar-eq-2" />
                      <div className="w-[2px] bg-[#1db954] rounded-full sidebar-eq-3" />
                    </div>
                  )}
                </button>
              );
            })}
        </div>
      </div>
    </aside>
  );
}