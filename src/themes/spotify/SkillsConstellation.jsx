import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RING_CONFIG = [
  { radius: 100, color: "#10b981", speed: "28s", label: "ZONE_INNER" },
  { radius: 165, color: "#06b6d4", speed: "42s", label: "ZONE_MID" },
  { radius: 230, color: "#8b5cf6", speed: "60s", label: "ZONE_OUTER" },
];

const LEVEL_CONFIG = {
  Expert: { size: 6.5, ring: 13, tag: "LVL_3", glow: 1 },
  Advanced: { size: 5, ring: 10, tag: "LVL_2", glow: 0.8 },
  Intermediate: { size: 3.5, ring: 8, tag: "LVL_1", glow: 0.6 },
};

const CENTER = 260;
const SIZE = 520;

export default function SkillsConstellation({ categories = [], initials = "MM" }) {
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  const [paused, setPaused] = useState(false);
  const [activeDomain, setActiveDomain] = useState(null);
  const wrapperRef = useRef(null);
  const [maxSize, setMaxSize] = useState(380);

  // Dynamic responsive viewport fitting
  useEffect(() => {
    const handleResize = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const availW = rect.width;
      const availH = window.innerHeight - rect.top - 120;
      setMaxSize(Math.max(220, Math.min(availW, availH, 440)));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute nodal telemetry and category clusters
  const rings = useMemo(() => {
    return categories.map((cat, i) => {
      const meta = RING_CONFIG[i % RING_CONFIG.length];
      const count = cat.skills?.length || 1;
      return {
        ...meta,
        category: cat.category,
        nodes: (cat.skills || []).map((sk, j) => {
          const angle = (360 / count) * j + i * 30;
          const rad = (angle * Math.PI) / 180;
          return {
            ...sk,
            id: `${cat.category}-${sk.name}`,
            angle: Math.round(angle),
            x: CENTER + meta.radius * Math.cos(rad),
            y: CENTER + meta.radius * Math.sin(rad),
            color: meta.color,
            category: cat.category,
          };
        }),
      };
    });
  }, [categories]);

  const active = pinned || hovered;

  // Find companion nodes in the same category cluster for constellation lines
  const activeClusterNodes = useMemo(() => {
    if (!active) return [];
    const ring = rings.find((r) => r.category === active.category);
    return ring ? ring.nodes : [];
  }, [active, rings]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none font-mono">
      <style>{`
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ring-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ring-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .radar-sweep-beam {
          transform-origin: ${CENTER}px ${CENTER}px;
          animation: radar-sweep 12s linear infinite;
        }
        .orbit-cw-0 { transform-origin: ${CENTER}px ${CENTER}px; animation: ring-cw 34s linear infinite; }
        .orbit-ccw-1 { transform-origin: ${CENTER}px ${CENTER}px; animation: ring-ccw 52s linear infinite; }
        .orbit-cw-2 { transform-origin: ${CENTER}px ${CENTER}px; animation: ring-cw 70s linear infinite; }
        .constellation-paused .radar-sweep-beam,
        .constellation-paused .orbit-cw-0,
        .constellation-paused .orbit-ccw-1,
        .constellation-paused .orbit-cw-2 {
          animation-play-state: paused;
        }
      `}</style>

      {/* Primary HUD Visualizer */}
      <div
        className={`relative ${paused || pinned ? "constellation-paused" : ""}`}
        style={{ width: maxSize, height: maxSize }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full overflow-visible">
          <defs>
            {/* Sci-Fi Scanner Conic Gradient */}
            <radialGradient id="scannerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
              <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Bloom Node Filter */}
            <filter id="hudBloom" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Ambient Radar Circle */}
          <circle cx={CENTER} cy={CENTER} r={245} fill="url(#scannerGlow)" />

          {/* Crosshair Coordinate Axes */}
          <line x1={CENTER} y1={25} x2={CENTER} y2={SIZE - 25} stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 4" />
          <line x1={25} y1={CENTER} x2={SIZE - 25} y2={CENTER} stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 4" />

          {/* Angular Dial Tick Marks */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = CENTER + 242 * Math.cos(rad);
            const y1 = CENTER + 242 * Math.sin(rad);
            const x2 = CENTER + 250 * Math.cos(rad);
            const y2 = CENTER + 250 * Math.sin(rad);
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" />;
          })}

          {/* Radar Scanner Sweep Beam */}
          <g className="radar-sweep-beam pointer-events-none">
            <line
              x1={CENTER}
              y1={CENTER}
              x2={CENTER}
              y2={20}
              stroke="url(#scannerGlow)"
              strokeWidth="2"
              strokeOpacity="0.5"
            />
            <path
              d={`M ${CENTER} ${CENTER} L ${CENTER} 20 A 240 240 0 0 1 ${CENTER + 160} ${CENTER - 170} Z`}
              fill="rgba(16, 185, 129, 0.04)"
            />
          </g>

          {/* Orbital Grid Rings */}
          {rings.map((r) => {
            const isDim = activeDomain && activeDomain !== r.category;
            return (
              <g key={`track-${r.category}`} opacity={isDim ? 0.08 : 0.35} className="transition-opacity duration-300">
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={r.radius}
                  fill="none"
                  stroke={r.color}
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
                <circle cx={CENTER} cy={CENTER} r={r.radius + 6} fill="none" stroke={r.color} strokeWidth="0.5" strokeOpacity="0.2" />
              </g>
            );
          })}

          {/* Synaptic Constellation Vector Lines between Nodes in Active Cluster */}
          {active &&
            activeClusterNodes.map((n) => (
              <line
                key={`link-${n.id}`}
                x1={active.x}
                y1={active.y}
                x2={n.x}
                y2={n.y}
                stroke={active.color}
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeDasharray="2 3"
              />
            ))}

          {/* Active Anchor Vector to Center Core */}
          {active && (
            <line
              x1={CENTER}
              y1={CENTER}
              x2={active.x}
              y2={active.y}
              stroke={active.color}
              strokeWidth="1.5"
              strokeOpacity="0.75"
              strokeDasharray="4 2"
            />
          )}

          {/* Central Reactor Core */}
          <g
            className="cursor-pointer"
            onClick={() => {
              setPinned(null);
              setActiveDomain(null);
            }}
          >
            <circle cx={CENTER} cy={CENTER} r="32" fill="#050505" stroke="#10b981" strokeWidth="1.2" />
            <circle cx={CENTER} cy={CENTER} r="28" fill="none" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="3 3" />
            <text
              x={CENTER}
              y={CENTER + 4}
              textAnchor="middle"
              className="fill-emerald-400 font-bold text-xs tracking-widest pointer-events-none select-none"
            >
              {initials}
            </text>
          </g>

          {/* Rotating Skill Satellites */}
          {rings.map((r, ringIdx) => {
            const isDim = activeDomain && activeDomain !== r.category;
            const orbitClass = ringIdx === 1 ? "orbit-ccw-1" : ringIdx === 2 ? "orbit-cw-2" : "orbit-cw-0";

            return (
              <g key={r.category} className={`${orbitClass} transition-opacity duration-300`} opacity={isDim ? 0.15 : 1}>
                {r.nodes.map((node) => {
                  const isNodeActive = active?.name === node.name;
                  const cfg = LEVEL_CONFIG[node.level] || LEVEL_CONFIG.Intermediate;

                  return (
                    <g
                      key={node.name}
                      transform={`translate(${node.x}, ${node.y})`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHovered(node)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPinned(pinned?.name === node.name ? null : node);
                      }}
                    >
                      {/* Active Reticle Target Brackets */}
                      {isNodeActive && (
                        <>
                          <circle r={cfg.ring + 4} fill="none" stroke={node.color} strokeWidth="1.2" className="animate-ping" opacity="0.6" />
                          <circle r={cfg.ring} fill="none" stroke={node.color} strokeWidth="1" strokeDasharray="2 2" />
                        </>
                      )}

                      {/* Click Target Cushion */}
                      <circle r="14" fill="transparent" />

                      {/* Primary Node Diamond / Circle */}
                      <circle
                        r={isNodeActive ? cfg.size + 2 : cfg.size}
                        fill={node.color}
                        opacity={isNodeActive ? 1 : cfg.glow}
                        filter={isNodeActive ? "url(#hudBloom)" : undefined}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Cyberpunk HUD Readout Deck */}
      <div className="w-full max-w-sm min-h-[58px] flex items-center justify-center mt-1 mb-2 px-2 z-10">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.name}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="w-full bg-[#0d0d0d]/90 border border-emerald-500/30 backdrop-blur-md rounded-lg px-3.5 py-2 flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full shadow-sm animate-pulse" style={{ backgroundColor: active.color }} />
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">{active.name}</h4>
                  <p className="text-[10px] text-zinc-400 font-mono tracking-tight">{active.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border"
                  style={{
                    color: active.color,
                    borderColor: `${active.color}40`,
                    backgroundColor: `${active.color}15`,
                  }}
                >
                  {LEVEL_CONFIG[active.level]?.tag || active.level}
                </span>
                {pinned?.name === active.name && (
                  <span className="text-[9px] text-emerald-400 font-mono px-1 border border-emerald-500/40 rounded">LOCKED</span>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.span
              key="standby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-ping" />
              SYSTEM ACTIVE // SELECT NODE TO INSPECT
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Domain Sector Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 z-10">
        {rings.map((r) => {
          const isSelected = activeDomain === r.category;
          return (
            <button
              key={r.category}
              onClick={() => setActiveDomain(isSelected ? null : r.category)}
              className={`flex items-center gap-2 px-2.5 py-1 rounded text-[10px] font-mono tracking-wider border transition-all ${
                isSelected
                  ? "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                  : "bg-black/40 border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: r.color }} />
              {r.category}
            </button>
          );
        })}
      </div>
    </div>
  );
}