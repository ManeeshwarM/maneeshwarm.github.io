import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Cpu,
  Database,
  Cloud,
  Activity,
  Search,
  Orbit,
  LayoutGrid,
  Radio,
  Zap,
} from "lucide-react";

const SKILL_CATEGORIES = [
  {
    id: "ml-dl",
    title: "Deep Learning & Vision",
    subtitle: "CNNs • ResNet • Attention Maps",
    gradient: "from-[#8400e7] via-[#581c87] to-[#1e1b4b]",
    accent: "#a855f7",
    icon: Cpu,
    mastery: "94% Production Match",
    skills: [
      { name: "PyTorch", level: 95 },
      { name: "TensorFlow", level: 90 },
      { name: "OpenCV", level: 88 },
      { name: "ResNet-50", level: 92 },
      { name: "Spatial Attention", level: 85 },
      { name: "Transfer Learning", level: 90 },
    ],
  },
  {
    id: "llm-rag",
    title: "Generative AI & LLMs",
    subtitle: "RAG • Multi-Agent • Citations",
    gradient: "from-[#006450] via-[#064e3b] to-[#022c22]",
    accent: "#10b981",
    icon: Sparkles,
    mastery: "98% Production Match",
    skills: [
      { name: "LangChain", level: 96 },
      { name: "LlamaIndex", level: 94 },
      { name: "GPT-4 / Claude", level: 98 },
      { name: "FAISS / ChromaDB", level: 92 },
      { name: "Vector Embeddings", level: 95 },
      { name: "Prompt Ops", level: 90 },
    ],
  },
  {
    id: "mlops-cloud",
    title: "MLOps & Cloud Infra",
    subtitle: "SageMaker • Kubernetes • CI/CD",
    gradient: "from-[#1e3264] via-[#1e293b] to-[#0f172a]",
    accent: "#38bdf8",
    icon: Cloud,
    mastery: "92% Production Match",
    skills: [
      { name: "AWS SageMaker", level: 90 },
      { name: "Docker", level: 95 },
      { name: "Kubernetes", level: 88 },
      { name: "AWS Lambda", level: 92 },
      { name: "Terraform", level: 86 },
      { name: "Prometheus / Grafana", level: 89 },
    ],
  },
  {
    id: "backend-data",
    title: "Backend & Pipelines",
    subtitle: "FastAPI • Distributed • Redis",
    gradient: "from-[#ba5d07] via-[#7c2d12] to-[#451a03]",
    accent: "#f97316",
    icon: Database,
    mastery: "95% Production Match",
    skills: [
      { name: "FastAPI", level: 96 },
      { name: "Python", level: 98 },
      { name: "PostgreSQL", level: 90 },
      { name: "Redis", level: 88 },
      { name: "Apache Kafka", level: 84 },
      { name: "AsyncIO", level: 92 },
    ],
  },
];

const ALL_CONSTELLATION_NODES = SKILL_CATEGORIES.flatMap((cat, catIdx) =>
  cat.skills.map((skill, skillIdx) => ({
    ...skill,
    category: cat.title,
    accent: cat.accent,
    catId: cat.id,
    ring: (catIdx % 3) + 1,
    angle: (skillIdx / cat.skills.length) * 360 + catIdx * 45,
  }))
);

export default function SpotifySkillsView() {
  const [viewMode, setViewMode] = useState("genres");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePill, setActivePill] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const isSearching = searchQuery.trim().length > 0;

  const filteredCategories = SKILL_CATEGORIES.filter((cat) => {
    if (activeCategory !== "all" && cat.id !== activeCategory) return false;
    if (!searchQuery) return true;
    const matchCat = cat.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSkill = cat.skills.some((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchCat || matchSkill;
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 font-sans text-zinc-200 selection:bg-[#1db954] selection:text-black">
      <style>{`
        @keyframes eq-dance {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        @keyframes orbit-rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .eq-bar-1 { animation: eq-dance 0.7s ease-in-out infinite 0.1s; }
        .eq-bar-2 { animation: eq-dance 0.5s ease-in-out infinite 0.3s; }
        .eq-bar-3 { animation: eq-dance 0.8s ease-in-out infinite 0.15s; }
        .spin-orbit-1 { animation: orbit-rotate-slow 50s linear infinite; }
        .spin-orbit-2 { animation: orbit-rotate-reverse 70s linear infinite; }
        .spin-orbit-3 { animation: orbit-rotate-slow 90s linear infinite; }
      `}</style>

      {/* Header Deck */}
      <div className="pb-6 border-b border-white/[0.08] mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1db954]/10 border border-[#1db954]/25 text-xs font-mono font-bold text-[#1db954] mb-2 shadow-[0_0_15px_rgba(29,185,84,0.15)]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#1db954]" /> BROWSE REPERTOIRE & HUBS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
            Technical Stack
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Applied deep learning frameworks, MLOps orchestration, and production system tools.
          </p>
        </div>

        {/* Search & View Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/[0.04] p-1 rounded-full border border-white/10 shrink-0">
            <button
              onClick={() => setViewMode("genres")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                viewMode === "genres"
                  ? "bg-[#1db954] text-black shadow-[0_0_12px_rgba(29,185,84,0.3)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Genres
            </button>
            <button
              onClick={() => setViewMode("constellation")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                viewMode === "constellation"
                  ? "bg-[#1db954] text-black shadow-[0_0_12px_rgba(29,185,84,0.3)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Orbit className="w-3.5 h-3.5" /> Constellation
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skills or tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 hover:border-white/20 focus:border-[#1db954] text-xs text-white placeholder-zinc-500 focus:outline-none transition-all font-sans"
            />
          </div>
        </div>
      </div>

      {/* Genres View */}
      {viewMode === "genres" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all ${
                activeCategory === "all"
                  ? "bg-white text-black shadow-md scale-105"
                  : "bg-white/[0.04] border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              All Genres ({SKILL_CATEGORIES.length})
            </button>
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#1db954] text-black shadow-[0_0_12px_rgba(29,185,84,0.3)] scale-105"
                    : "bg-white/[0.04] border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            {filteredCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${cat.gradient} p-7 min-h-[17rem] flex flex-col justify-between group border border-white/10 hover:border-white/25 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)]`}
                >
                  <div className="absolute -bottom-5 -right-5 w-36 h-36 bg-black/25 rounded-3xl rotate-12 flex items-center justify-center pointer-events-none group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl backdrop-blur-sm">
                    <Icon className="w-18 h-18 text-white/30" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 font-bold flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" style={{ color: cat.accent }} />
                        {cat.subtitle}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-zinc-300">
                        {cat.mastery}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {cat.title}
                    </h2>
                  </div>

                  <div className="relative z-10 flex flex-wrap gap-2 pt-4 max-w-[90%]">
                    {cat.skills.map((skill) => {
                      const isHovered = activePill === skill.name;
                      return (
                        <motion.div
                          key={skill.name}
                          onMouseEnter={() => setActivePill(skill.name)}
                          onMouseLeave={() => setActivePill(null)}
                          whileHover={{ scale: 1.05 }}
                          className="group/pill flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl bg-black/45 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/30 text-zinc-100 font-medium transition-all shadow-md cursor-default"
                        >
                          <div className="flex items-end gap-[2px] h-3">
                            <span
                              className={`w-[2px] rounded-full transition-all ${
                                isHovered ? "bg-[#1db954] eq-bar-1" : "bg-white/40 h-2"
                              }`}
                            />
                            <span
                              className={`w-[2px] rounded-full transition-all ${
                                isHovered ? "bg-[#1db954] eq-bar-2" : "bg-white/40 h-3"
                              }`}
                            />
                            <span
                              className={`w-[2px] rounded-full transition-all ${
                                isHovered ? "bg-[#1db954] eq-bar-3" : "bg-white/40 h-1.5"
                              }`}
                            />
                          </div>
                          <span>{skill.name}</span>
                          <span className="text-[9px] text-zinc-400 font-bold ml-0.5">
                            {skill.level}%
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Constellation View with Live Search Filtering */}
      {viewMode === "constellation" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="relative w-full max-w-5xl h-[620px] rounded-3xl bg-[#09090b]/90 border border-white/10 overflow-hidden flex items-center justify-center backdrop-blur-2xl shadow-2xl"
        >
          <div className="absolute w-[450px] h-[450px] bg-[#1db954]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute w-[300px] h-[300px] bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none" />

          {/* SVG Orbital Track Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <circle cx="50%" cy="50%" r="100" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <circle cx="50%" cy="50%" r="180" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="6 6" />
            <circle cx="50%" cy="50%" r="260" fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="8 8" />

            {hoveredNode && (
              <line
                x1="50%"
                y1="50%"
                x2={`${50 + ((hoveredNode.ring * 80) * Math.cos((hoveredNode.angle * Math.PI) / 180)) / 4.5}%`}
                y2={`${50 + ((hoveredNode.ring * 80) * Math.sin((hoveredNode.angle * Math.PI) / 180)) / 4.5}%`}
                stroke={hoveredNode.accent || "#1db954"}
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            )}
          </svg>

          {/* Center Identity Node */}
          <div className="relative z-20 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-[#1db954] to-[#10b981] p-1 shadow-[0_0_35px_rgba(29,185,84,0.4)]">
            <div className="w-full h-full rounded-full bg-black flex flex-col items-center justify-center text-center p-2">
              <Zap className="w-5 h-5 text-[#1db954] mb-0.5" />
              <span className="font-mono text-[9px] font-bold text-white tracking-widest uppercase">
                CORE
              </span>
            </div>
          </div>

          {/* Orbit Rings with Search Highlighting */}
          {[1, 2, 3].map((ringNum) => {
            const ringNodes = ALL_CONSTELLATION_NODES.filter((n) => n.ring === ringNum);
            const radius = ringNum === 1 ? 100 : ringNum === 2 ? 180 : 260;
            const spinClass = ringNum === 1 ? "spin-orbit-1" : ringNum === 2 ? "spin-orbit-2" : "spin-orbit-3";

            return (
              <div
                key={ringNum}
                className={`absolute w-full h-full flex items-center justify-center pointer-events-none ${spinClass}`}
              >
                {ringNodes.map((node) => {
                  const rad = (node.angle * Math.PI) / 180;
                  const x = radius * Math.cos(rad);
                  const y = radius * Math.sin(rad);

                  const isMatch = isSearching && node.name.toLowerCase().includes(searchQuery.toLowerCase());
                  const isDimmed = isSearching && !isMatch;

                  return (
                    <div
                      key={node.name}
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                      className="absolute pointer-events-auto"
                    >
                      <motion.div
                        onMouseEnter={() => setHoveredNode(node)}
                        onMouseLeave={() => setHoveredNode(null)}
                        animate={{
                          scale: isMatch ? 1.4 : isDimmed ? 0.6 : 1,
                          opacity: isDimmed ? 0.2 : 1,
                        }}
                        transition={{ duration: 0.25 }}
                        className="cursor-pointer group relative flex items-center justify-center"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center p-0.5 border transition-all ${
                            isMatch ? "ring-4 ring-[#1db954] ring-offset-2 ring-offset-black" : ""
                          }`}
                          style={{
                            borderColor: isMatch ? "#1db954" : `${node.accent}88`,
                            background: "rgba(10,10,10,0.9)",
                            boxShadow: isMatch
                              ? "0 0 25px rgba(29, 185, 84, 0.8)"
                              : `0 0 15px ${node.accent}44`,
                          }}
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: isMatch ? "#1db954" : node.accent }}
                          />
                        </div>

                        {/* Node Label Tooltip */}
                        <div
                          className={`absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border px-2.5 py-0.5 rounded-md text-[10px] font-mono text-white shadow-xl z-30 pointer-events-none transition-opacity ${
                            isMatch
                              ? "opacity-100 border-[#1db954] text-[#1db954]"
                              : "opacity-0 group-hover:opacity-100 border-white/15"
                          }`}
                        >
                          <span className="font-bold">{node.name}</span> • {node.level}%
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Telemetry HUD */}
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-80 bg-black/80 border border-white/10 backdrop-blur-xl p-4 rounded-2xl z-30 shadow-2xl">
            {hoveredNode ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                    Node Inspected
                  </span>
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10"
                    style={{ color: hoveredNode.accent }}
                  >
                    {hoveredNode.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{hoveredNode.name}</h3>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-300 pt-1">
                  <span>Proficiency Weight:</span>
                  <span className="font-bold text-[#1db954]">{hoveredNode.level}%</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-xs text-zinc-400 font-mono">
                <Sparkles className="w-4 h-4 text-[#1db954] animate-pulse" />
                <span>
                  {isSearching
                    ? `Highlighting matches for "${searchQuery}"`
                    : "Hover over planetary skill nodes to inspect telemetry."}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}