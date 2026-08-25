import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  CheckCircle2,
  BadgeCheck,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Disc3,
  LayoutGrid,
  List,
  Search,
  Calendar,
} from "lucide-react";
import { certifications as defaultCertifications } from "../../data/portfolioData";

// Extended certification catalog with Microsoft Azure Fundamentals & AI Fundamentals
const ALL_CERTIFICATIONS = [
  {
    id: "az-900",
    title: "AZ-900: Microsoft Azure Fundamentals",
    issuer: "Microsoft",
    date: "Certified",
    credentialId: "MS-AZ900-VERIFIED",
    badgeColor: "#0078d4",
    skills: ["Azure Architecture", "Cloud Security", "IAM & Governance", "Cloud Pricing"],
  },
  {
    id: "ai-900",
    title: "AI-900: Microsoft Azure AI Fundamentals",
    issuer: "Microsoft",
    date: "Certified",
    credentialId: "MS-AI900-VERIFIED",
    badgeColor: "#38bdf8",
    skills: ["Azure OpenAI", "Computer Vision", "NLP & Speech", "Responsible AI"],
  },
  ...(defaultCertifications || [
    {
      id: "aws-mls",
      title: "AWS Certified Machine Learning – Specialty",
      issuer: "Amazon Web Services",
      date: "Certified",
      credentialId: "AWS-MLS-78921",
      badgeColor: "#ff9900",
      skills: ["SageMaker", "Feature Engineering", "Model Evaluation", "Distributed Training"],
    },
    {
      id: "deeplearning-ai",
      title: "Deep Learning Specialization",
      issuer: "DeepLearning.AI",
      date: "Certified",
      credentialId: "DLAI-SPEC-4091",
      badgeColor: "#1db954",
      skills: ["Neural Networks", "CNNs", "Transformers", "Hyperparameter Tuning"],
    },
  ]),
];

export default function SpotifyCertificationsView() {
  const [viewStyle, setViewStyle] = useState("cards"); // 'cards' | 'list'
  const [selectedIssuer, setSelectedIssuer] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const issuers = ["all", ...Array.from(new Set(ALL_CERTIFICATIONS.map((c) => c.issuer)))];

  const filteredCerts = ALL_CERTIFICATIONS.filter((cert) => {
    if (selectedIssuer !== "all" && cert.issuer !== selectedIssuer) return false;
    if (!searchQuery) return true;
    const matchTitle = cert.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchIssuer = cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSkill = cert.skills?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchTitle || matchIssuer || matchSkill;
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 font-sans text-zinc-200 selection:bg-[#1db954] selection:text-black">
      {/* Header Deck */}
      <div className="pb-6 border-b border-white/[0.08] mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1db954]/10 border border-[#1db954]/25 text-xs font-mono font-bold text-[#1db954] mb-2 shadow-[0_0_15px_rgba(29,185,84,0.15)]">
            <BadgeCheck className="w-3.5 h-3.5 text-[#1db954]" /> AUDITED INDUSTRY CREDENTIALS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
            Certifications
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Verified production competencies in Azure Cloud, Azure AI, AWS SageMaker, and Deep Learning.
          </p>
        </div>

        {/* View Switcher & Search Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/[0.04] p-1 rounded-full border border-white/10 shrink-0">
            <button
              onClick={() => setViewStyle("cards")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                viewStyle === "cards"
                  ? "bg-[#1db954] text-black shadow-[0_0_12px_rgba(29,185,84,0.3)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Plaques
            </button>
            <button
              onClick={() => setViewStyle("list")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                viewStyle === "list"
                  ? "bg-[#1db954] text-black shadow-[0_0_12px_rgba(29,185,84,0.3)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Azure, AWS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 hover:border-white/20 focus:border-[#1db954] text-xs text-white placeholder-zinc-500 focus:outline-none transition-all font-sans"
            />
          </div>
        </div>
      </div>

      {/* Issuer Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        {issuers.map((issuer) => {
          const isSelected = selectedIssuer === issuer;
          return (
            <button
              key={issuer}
              onClick={() => setSelectedIssuer(issuer)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-white text-black shadow-md"
                  : "bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {issuer === "all" ? "All Issuers" : issuer}
            </button>
          );
        })}
      </div>

      {/* --- 1. SPOTIFY GOLD PLAQUE / CARD VIEW --- */}
      {viewStyle === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-5xl">
          {filteredCerts.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
              whileHover={{ y: -3 }}
              className="relative overflow-hidden bg-[#141414]/90 hover:bg-[#181818] border border-white/10 hover:border-white/20 rounded-3xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between group"
            >
              {/* Plaque Corner Glow */}
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-opacity opacity-20 group-hover:opacity-40"
                style={{ background: cert.badgeColor }}
              />

              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    {/* Badge Emblem */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg transition-transform group-hover:scale-105"
                      style={{
                        background: `${cert.badgeColor}15`,
                        borderColor: `${cert.badgeColor}40`,
                        color: cert.badgeColor,
                      }}
                    >
                      <Award className="w-6 h-6" />
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#1db954] font-bold block">
                        {cert.issuer}
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                        {cert.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-[#1db954] shrink-0 bg-[#1db954]/10 border border-[#1db954]/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Verified</span>
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2 pb-4">
                  {cert.skills?.map((sk) => (
                    <span
                      key={sk}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-300"
                    >
                      #{sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Credential Bar */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>CREDENTIAL: {cert.credentialId}</span>
                <span className="text-zinc-400">{cert.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* --- 2. SPOTIFY TRACKLIST / TABLE VIEW --- */}
      {viewStyle === "list" && (
        <div className="max-w-5xl bg-[#121212]/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/10 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            <span className="col-span-1">#</span>
            <span className="col-span-6 sm:col-span-5">Certification / Title</span>
            <span className="col-span-3 sm:col-span-3">Issuer</span>
            <span className="hidden sm:block sm:col-span-3 text-right">Credential ID</span>
          </div>

          <div className="divide-y divide-white/[0.05]">
            {filteredCerts.map((cert, idx) => (
              <div
                key={cert.id}
                className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-white/[0.04] transition-colors text-xs font-sans group"
              >
                <span className="col-span-1 font-mono text-zinc-500 group-hover:text-[#1db954]">
                  0{idx + 1}
                </span>

                <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-xs"
                    style={{
                      background: `${cert.badgeColor}15`,
                      borderColor: `${cert.badgeColor}30`,
                      color: cert.badgeColor,
                    }}
                  >
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-white truncate">{cert.title}</span>
                </div>

                <span className="col-span-3 sm:col-span-3 font-mono text-zinc-400 truncate">
                  {cert.issuer}
                </span>

                <span className="hidden sm:block sm:col-span-3 text-right font-mono text-[11px] text-zinc-500 truncate">
                  {cert.credentialId}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}