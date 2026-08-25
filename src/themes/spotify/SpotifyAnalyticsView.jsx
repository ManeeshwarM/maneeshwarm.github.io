import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Sparkles, TrendingUp, Layers, Database, Cpu } from "lucide-react";
import { projects, domains } from "../../data/portfolioData";

const AXIS_COLOR = "rgba(255,255,255,0.4)";
const GRID_COLOR = "rgba(255,255,255,0.05)";
const DOMAIN_COLORS = ["#1db954", "#38bdf8", "#a855f7", "#f97316", "#ec4899"];

function GlassCard({ title, subtitle, children, icon: Icon, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden bg-[#121212]/80 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 shadow-2xl transition-all duration-300 group ${className}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#1db954]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#1db954]/10 transition-colors" />
      
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-mono font-semibold text-[#1db954] flex items-center gap-1">
            {subtitle}
          </span>
          <h3 className="font-display text-base font-bold text-white tracking-tight mt-0.5">
            {title}
          </h3>
        </div>
        {Icon && (
          <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-400 group-hover:text-[#1db954] transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      {children}
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0a0a]/95 border border-white/15 backdrop-blur-md rounded-xl px-3.5 py-2.5 shadow-2xl text-xs space-y-1">
      {label !== undefined && (
        <p className="text-zinc-400 font-mono border-b border-white/10 pb-1 mb-1 font-medium">
          Epoch {label}
        </p>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 font-medium text-zinc-300">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color || p.fill }}
            />
            {p.name}
          </span>
          <span className="font-mono font-bold" style={{ color: p.color || p.fill }}>
            {typeof p.value === "number" ? p.value.toFixed(3) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SpotifyAnalyticsView() {
  const [activeModel, setActiveModel] = useState("all");

  const lossData = useMemo(() => {
    const maxLen = Math.max(...projects.map((p) => p.lossCurve?.length || 0), 1);
    return Array.from({ length: maxLen }).map((_, epoch) => {
      const row = { epoch: epoch + 1 };
      projects.forEach((p) => {
        row[p.title] = p.lossCurve ? p.lossCurve[epoch] ?? null : null;
      });
      return row;
    });
  }, []);

  const metricBars = useMemo(
    () =>
      projects.map((p) => ({
        name: p.title.length > 14 ? p.title.slice(0, 13) + "…" : p.title,
        fullName: p.title,
        value: p.metrics?.[0]?.value > 1 ? p.metrics[0].value : (p.metrics?.[0]?.value || 0) * 100,
        label: p.metrics?.[0]?.label || "Score",
        color: p.accent || "#1db954",
      })),
    []
  );

  const domainDist = useMemo(
    () =>
      domains
        .map((d) => ({
          name: d.name,
          value: projects.filter((p) => p.domain === d.id).length,
        }))
        .filter((d) => d.value > 0),
    []
  );

  const convergenceRadar = useMemo(
    () =>
      projects.map((p) => {
        const curve = p.lossCurve || [1, 0.5];
        const finalLoss = curve[curve.length - 1];
        const initialLoss = curve[0];
        const improvement = Math.max(0, ((initialLoss - finalLoss) / (initialLoss || 1)) * 100);
        return {
          model: p.title.length > 12 ? p.title.slice(0, 11) + "…" : p.title,
          improvement: Math.round(improvement),
        };
      }),
    []
  );

  const stats = [
    { label: "Models Online", value: projects.length, icon: Cpu },
    { label: "Domains Covered", value: domains.length, icon: Layers },
    {
      label: "Avg. Stack Depth",
      value: (projects.reduce((a, p) => a + (p.stack?.length || 0), 0) / (projects.length || 1)).toFixed(1),
      icon: Database,
    },
    {
      label: "Mean Convergence",
      value:
        Math.round(
          convergenceRadar.reduce((a, c) => a + c.improvement, 0) / (convergenceRadar.length || 1)
        ) + "%",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 font-sans text-zinc-200">
      {/* Header */}
      <div className="pb-5 border-b border-white/[0.08] mb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1db954]/10 border border-[#1db954]/20 text-xs font-mono font-semibold text-[#1db954] mb-2">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> Telemetry & Evaluation
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Model Analytics
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Live loss curves, training convergence rates, and architectural stack depth across every deployed model.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#141414]/90 border border-white/[0.07] hover:border-white/[0.15] rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-2xl font-bold text-white font-mono">{s.value}</p>
                <p className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider mt-0.5">
                  {s.label}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#1db954]">
                <Icon className="w-4 h-4" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Main Loss Graph */}
        <GlassCard
          title="Training Loss Trajectory"
          subtitle="Convergence"
          icon={Sparkles}
          className="lg:col-span-2"
        >
          {/* Interactive Isolation Filter */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <button
              onClick={() => setActiveModel("all")}
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium border transition-all ${
                activeModel === "all"
                  ? "bg-[#1db954]/20 border-[#1db954] text-[#1db954]"
                  : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              All Runs
            </button>
            {projects.map((p) => {
              const isSelected = activeModel === p.title;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveModel(isSelected ? "all" : p.title)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium border flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? "bg-white/15 border-white/40 text-white"
                      : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.accent }} />
                  {p.title}
                </button>
              );
            })}
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lossData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {projects.map((p) => (
                    <linearGradient key={p.id} id={`grad-${p.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={p.accent || "#1db954"} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={p.accent || "#1db954"} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke={GRID_COLOR} vertical={false} />
                <XAxis
                  dataKey="epoch"
                  stroke={AXIS_COLOR}
                  tick={{ fontSize: 10, fill: AXIS_COLOR }}
                  label={{ value: "Epochs", position: "insideBottomRight", offset: -5, fill: AXIS_COLOR, fontSize: 10 }}
                />
                <YAxis stroke={AXIS_COLOR} tick={{ fontSize: 10, fill: AXIS_COLOR }} domain={['dataMin', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                {projects.map((p) => {
                  const isDimmed = activeModel !== "all" && activeModel !== p.title;
                  return (
                    <Area
                      key={p.id}
                      type="monotone"
                      dataKey={p.title}
                      stroke={p.accent || "#1db954"}
                      strokeWidth={activeModel === p.title ? 3 : 1.8}
                      fillOpacity={isDimmed ? 0.02 : 1}
                      strokeOpacity={isDimmed ? 0.15 : 1}
                      fill={`url(#grad-${p.id})`}
                      connectNulls
                    />
                  );
                })}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Benchmark Bar Chart */}
        <GlassCard title="Benchmark Performance" subtitle="Evaluation" icon={Activity}>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricBars} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={GRID_COLOR} vertical={false} />
                <XAxis dataKey="name" stroke={AXIS_COLOR} tick={{ fontSize: 10, fill: AXIS_COLOR }} />
                <YAxis stroke={AXIS_COLOR} tick={{ fontSize: 10, fill: AXIS_COLOR }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Score %" radius={[6, 6, 0, 0]}>
                  {metricBars.map((b, i) => (
                    <Cell key={i} fill={b.color} className="hover:opacity-80 transition-opacity cursor-pointer" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Domain Donut */}
        <GlassCard title="Domain Allocation" subtitle="Architecture" icon={Layers}>
          <div className="h-[240px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={domainDist}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  stroke="none"
                >
                  {domainDist.map((_, i) => (
                    <Cell
                      key={i}
                      fill={DOMAIN_COLORS[i % DOMAIN_COLORS.length]}
                      className="hover:scale-105 transition-transform duration-200 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 pr-4">
              {domainDist.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: DOMAIN_COLORS[i % DOMAIN_COLORS.length] }}
                  />
                  <span className="text-zinc-400 font-medium">{d.name}</span>
                  <span className="font-mono text-zinc-500 font-bold ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Radar Improvement Chart */}
        <GlassCard title="Convergence Efficiency" subtitle="Optimization" icon={TrendingUp} className="lg:col-span-2">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={convergenceRadar}>
                <PolarGrid stroke={GRID_COLOR} />
                <PolarAngleAxis dataKey="model" tick={{ fontSize: 10, fill: AXIS_COLOR }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: AXIS_COLOR }} stroke={GRID_COLOR} angle={45} />
                <Radar
                  name="Loss Drop %"
                  dataKey="improvement"
                  stroke="#1db954"
                  fill="#1db954"
                  fillOpacity={0.25}
                  dot={{ r: 3, fill: "#1db954" }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}