import { useState, useEffect } from "react";
import { Search, X, FolderGit2, User, Briefcase, BrainCircuit, Award, Mail, Sparkles, ArrowRight } from "lucide-react";
import { projects, experience, certifications } from "../data/portfolioData";

export default function CommandPalette({ isOpen, onClose, onSelectAction }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setQuery("");
    setSelectedIndex(0);
  }, [isOpen]);

  if (!isOpen) return null;

  // Build items list
  const items = [];

  // Sections
  const sections = [
    { type: "section", id: "projects", title: "Go to Projects", subtitle: "Machine Learning Models & Case Studies", icon: FolderGit2 },
    { type: "section", id: "about", title: "Go to About Me", subtitle: "Executive Bio & Impact Metrics", icon: User },
    { type: "section", id: "experience", title: "Go to Experience", subtitle: "Career Timeline & Shipped Models", icon: Briefcase },
    { type: "section", id: "skills", title: "Go to Skills", subtitle: "PyTorch, RAG, Kafka, MLOps, SQL", icon: BrainCircuit },
    { type: "section", id: "certifications", title: "Go to Certifications", subtitle: "AWS, DeepLearning.AI, Databricks, Google", icon: Award },
    { type: "section", id: "contact", title: "Go to Contact", subtitle: "Direct Message & Recruiter Email", icon: Mail },
  ];

  sections.forEach((s) => items.push(s));

  // Add projects
  projects.forEach((p) => {
    items.push({
      type: "project",
      id: p.id,
      projectObj: p,
      title: `Model: ${p.title}`,
      subtitle: `${p.architecture} · ${p.tagline}`,
      icon: Sparkles,
      color: p.accent,
    });
  });

  // Add experience
  experience.forEach((e) => {
    items.push({
      type: "experience",
      id: e.id,
      title: `Role: ${e.role} @ ${e.company}`,
      subtitle: `${e.period} · ${e.location}`,
      icon: Briefcase,
    });
  });

  // Add certifications
  certifications.forEach((c) => {
    items.push({
      type: "certification",
      id: c.id,
      title: `Cert: ${c.title}`,
      subtitle: `${c.issuer} · ${c.date}`,
      icon: Award,
    });
  });

  // Filter items
  const q = query.toLowerCase().trim();
  const filtered = q
    ? items.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.subtitle.toLowerCase().includes(q)
      )
    : items;

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelectAction(filtered[selectedIndex]);
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 font-body animate-fade-up"
      onClick={onClose}
    >
      <div
        className="bg-[#14141d] border border-white/20 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#191924]">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, model, skill, or section (Ctrl+K)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
          />
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-1 rounded-md"
            aria-label="Close command palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <p className="p-6 text-center text-xs text-white/40 font-mono">
              No matching results found for "{query}"
            </p>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    onSelectAction(item);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                    isSelected
                      ? "bg-purple-600/30 text-white border border-purple-500/40"
                      : "text-white/75 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: item.color ? `${item.color}22` : "rgba(255,255,255,0.1)",
                        color: item.color || "#fff",
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{item.title}</p>
                      <p className="text-[11px] text-white/40 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-[#0d0d13] flex justify-between items-center text-[10px] font-mono text-white/40">
          <span>Navigation: ↑ ↓ Arrow Keys</span>
          <span>Select: Enter</span>
          <span>Close: Esc</span>
        </div>
      </div>
    </div>
  );
}
