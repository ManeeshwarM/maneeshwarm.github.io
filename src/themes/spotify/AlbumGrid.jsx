import { Play, Heart, Zap } from "lucide-react";
import AlbumArt from "./AlbumArt";
import { domains } from "../../data/portfolioData";

const GREEN = "#1db954";

function Equalizer({ color = GREEN }) {
  return (
    <span className="flex items-end gap-[2px] h-4" aria-label="Now playing">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-sm"
          style={{
            background: color,
            height: "100%",
            animation: `eq-bar${i} 0.8s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </span>
  );
}

export default function AlbumGrid({
  projects,
  activeDomain,
  nowPlayingId,
  playing,
  likedIds,
  onPlay,
  onToggleLike,
  onOpenInference,
}) {
  const domainName = activeDomain
    ? domains.find((d) => d.id === activeDomain)?.name
    : "All Models";

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-8 font-body select-none">
      {/* Header */}
      <div className="pt-2 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest font-mono text-[#1db954] mb-1">
            Machine Learning Catalog
          </p>
          <h1 className="font-display text-4xl font-bold text-white">
            {domainName}
          </h1>
          <p className="mt-1 text-xs text-white/50">
            {projects.length} shipped model{projects.length !== 1 ? "s" : ""} · Click any track to play training loss & audio tone
          </p>
        </div>

        {projects.length > 0 && (
          <button
            onClick={() => onPlay(projects[0])}
            className="px-6 py-3 rounded-full flex items-center gap-2 font-bold text-xs text-black shadow-lg transition-transform hover:scale-105"
            style={{ background: GREEN }}
          >
            <Play className="w-4 h-4 fill-black text-black ml-0.5" /> Play All Models
          </button>
        )}
      </div>

      {/* Track list */}
      <div>
        {/* Table header */}
        <div
          className="grid gap-4 px-4 pb-2 mb-2 text-xs uppercase tracking-widest font-mono"
          style={{
            gridTemplateColumns: "16px 4fr 3fr 2fr 100px auto",
            color: "rgba(255,255,255,0.4)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span>#</span>
          <span>Model Name</span>
          <span>Architecture</span>
          <span>Best Metric</span>
          <span className="text-center">Sandbox</span>
          <span className="text-right pr-2">♥</span>
        </div>

        {/* Track rows */}
        {projects.map((p, idx) => {
          const isNowPlaying = nowPlayingId === p.id;
          const isLiked = likedIds.has(p.id);
          const topMetric = p.metrics[0];

          return (
            <button
              key={p.id}
              onClick={() => onPlay(p)}
              className="w-full grid gap-4 px-4 py-3 rounded-xl group transition-all text-left items-center border border-transparent"
              style={{
                gridTemplateColumns: "16px 4fr 3fr 2fr 100px auto",
                background: isNowPlaying ? "rgba(255,255,255,0.08)" : "transparent",
                borderColor: isNowPlaying ? "rgba(29,185,84,0.3)" : "transparent",
                color: isNowPlaying ? GREEN : "rgba(255,255,255,0.85)",
              }}
              onMouseEnter={(e) => {
                if (!isNowPlaying) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                if (!isNowPlaying) e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Index / Equalizer */}
              <span
                className="text-xs font-mono flex items-center justify-center"
                style={{ color: isNowPlaying ? GREEN : "rgba(255,255,255,0.4)" }}
              >
                {isNowPlaying && playing ? (
                  <Equalizer />
                ) : isNowPlaying ? (
                  <span style={{ color: GREEN }}>{idx + 1}</span>
                ) : (
                  <span className="group-hover:hidden">{idx + 1}</span>
                )}
                {!isNowPlaying && (
                  <Play className="hidden group-hover:block w-3.5 h-3.5 fill-white text-white" />
                )}
              </span>

              {/* Title & Art */}
              <span className="flex items-center gap-3 min-w-0">
                <span className="shrink-0 transition-transform duration-300 group-hover:scale-110 will-change-transform">
                  <AlbumArt project={p} size={42} rounded="rounded-lg" />
                </span>
                <span className="min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: isNowPlaying ? GREEN : "#fff" }}
                  >
                    {p.title}
                  </p>
                  <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {p.tagline}
                  </p>
                </span>
              </span>

              {/* Architecture */}
              <span className="text-xs font-mono truncate" style={{ color: "rgba(255,255,255,0.55)" }}>
                {p.architecture}
              </span>

              {/* Top Metric */}
              <span className="text-xs font-mono font-semibold" style={{ color: p.accent }}>
                {topMetric.label}: {topMetric.value}{topMetric.unit}
              </span>

              {/* Live Inference Sandbox Button */}
              <span className="flex justify-center">
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenInference) onOpenInference(p);
                  }}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border transition-transform hover:scale-105"
                  style={{
                    background: `${p.accent}22`,
                    borderColor: `${p.accent}44`,
                    color: p.accent,
                  }}
                  title="Run Live Model Inference Sandbox"
                >
                  <Zap className="w-3 h-3 fill-current" /> Test
                </span>
              </span>

              {/* Like Button */}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(p.id);
                }}
                className="flex justify-end pr-1 cursor-pointer"
                role="button"
                aria-label={isLiked ? "Unlike" : "Like"}
              >
                <Heart
                  className="w-4 h-4 transition-colors"
                  style={{
                    color: isLiked ? GREEN : "rgba(255,255,255,0.0)",
                    fill: isLiked ? GREEN : "none",
                    stroke: isLiked ? GREEN : "rgba(255,255,255,0.4)",
                  }}
                />
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes eq-bar1 { 0% { transform: scaleY(0.3); } 100% { transform: scaleY(1); } }
        @keyframes eq-bar2 { 0% { transform: scaleY(0.7); } 100% { transform: scaleY(0.3); } }
        @keyframes eq-bar3 { 0% { transform: scaleY(0.5); } 100% { transform: scaleY(0.9); } }
      `}</style>
    </div>
  );
}
