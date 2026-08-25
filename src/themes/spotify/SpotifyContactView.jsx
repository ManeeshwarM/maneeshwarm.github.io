import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { candidate } from "../../data/portfolioData";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  Check,
  Radio,
  Sparkles,
  MessageSquareCode,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

function GithubIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const TEMPLATE_TOPICS = [
  "🚀 Full-Time Engineering Role",
  "💡 Contract / Advisory",
  "🛠️ AI / RAG Architecture",
  "👋 Quick Tech Chat",
];

export default function SpotifyContactView() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);

  const handleCopyEmail = () => {
    if (candidate?.email) {
      navigator.clipboard.writeText(candidate.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setSent(true);
    }, 700);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 font-sans text-zinc-200">
      <style>{`
        @keyframes signal-ping {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        .signal-glow {
          animation: signal-ping 4s ease-in-out infinite;
        }
      `}</style>

      {/* --- HEADER BANNER --- */}
      <div className="pb-6 border-b border-white/[0.08] mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1db954]/10 border border-[#1db954]/25 text-xs font-mono font-bold text-[#1db954] mb-2 shadow-[0_0_15px_rgba(29,185,84,0.15)]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#1db954]" />
            DIRECT TRANSMISSION PIPELINE
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
            Get In Touch
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Available for production AI/ML engineering, high-throughput systems, and architectural advisory.
          </p>
        </div>

        {/* Live Response SLA Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-zinc-300">
          <Zap className="w-4 h-4 text-[#1db954]" />
          <span>Expected SLA: &lt; 24 Hours</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 max-w-5xl">
        {/* --- LEFT: CHANNELS & PROFILES (5 cols) --- */}
        <div className="lg:col-span-5 space-y-4">
          {/* Direct Email Card */}
          <div className="bg-[#141414]/90 border border-white/10 hover:border-[#1db954]/40 rounded-2xl p-5 transition-all shadow-lg group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1db954]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#1db954]/10 transition-all" />

            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#1db954]/15 border border-[#1db954]/30 flex items-center justify-center text-[#1db954] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white transition-all"
                title="Copy to Clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#1db954]" />
                    <span className="text-[#1db954]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-0.5">
              Primary Endpoint
            </p>
            <a
              href={`mailto:${candidate.email}`}
              className="text-base font-bold text-white hover:text-[#1db954] transition-colors break-all"
            >
              {candidate.email}
            </a>
          </div>

          {/* Location & Relocation Card */}
          <div className="bg-[#141414]/90 border border-white/10 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-0.5">
                  Base Location & Work Status
                </p>
                <p className="text-sm font-bold text-white">{candidate.location}</p>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#1db954] mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Open to Remote & On-Site
                </div>
              </div>
            </div>
          </div>

          {/* Professional Networks */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href={candidate.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#141414]/90 hover:bg-[#181818] border border-white/10 hover:border-[#38bdf8]/40 text-xs font-bold text-white transition-all group shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <LinkedinIcon className="text-zinc-400 group-hover:text-[#38bdf8] transition-colors" />
                <span>LinkedIn</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#38bdf8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

            <a
              href={candidate.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#141414]/90 hover:bg-[#181818] border border-white/10 hover:border-[#1db954]/40 text-xs font-bold text-white transition-all group shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <GithubIcon className="text-zinc-400 group-hover:text-[#1db954] transition-colors" />
                <span>GitHub</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#1db954] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>
        </div>

        {/* --- RIGHT: TRANSMISSION FORM CONSOLE (7 cols) --- */}
        <div className="lg:col-span-7 bg-[#141414]/95 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <MessageSquareCode className="w-4 h-4 text-[#1db954]" />
              <h2 className="font-bold text-white text-base sm:text-lg tracking-tight">
                Send Direct Message
              </h2>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/5">
              SECURE DISPATCH
            </span>
          </div>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1db954]/10 border border-[#1db954]/25 rounded-2xl p-8 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#1db954]/20 border border-[#1db954]/40 flex items-center justify-center mx-auto mb-3 text-[#1db954]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-lg">Packet Transmitted Successfully</h3>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out, <span className="text-white font-semibold">{form.name}</span>. I have received your message and will reply to <span className="text-[#1db954]">{form.email}</span> shortly.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", topic: "", message: "" });
                  }}
                  className="mt-6 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono font-bold text-white transition-all"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Topic Presets */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Quick Intent / Subject Preset
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TEMPLATE_TOPICS.map((topic) => {
                      const isSelected = form.topic === topic;
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => setForm({ ...form, topic: isSelected ? "" : topic })}
                          className={`text-[11px] font-mono px-2.5 py-1.5 rounded-lg border transition-all ${
                            isSelected
                              ? "bg-[#1db954]/20 border-[#1db954] text-[#1db954] font-semibold"
                              : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Email Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Your Name / Company *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins (OpenAI)"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954]/50 transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="s.jenkins@domain.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954]/50 transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Message Body *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details about your team, tech stack, or the project you'd like to collaborate on..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954]/50 transition-all resize-none font-sans leading-relaxed"
                  />
                </div>

                {/* Submit Action */}
                <motion.button
                  type="submit"
                  disabled={isTransmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-full bg-[#1db954] hover:bg-[#1ed760] disabled:bg-zinc-700 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(29,185,84,0.3)] mt-2"
                >
                  {isTransmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Payload...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 fill-current" />
                      <span>Dispatch Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}