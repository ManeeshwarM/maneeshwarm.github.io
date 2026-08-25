import { useState } from "react";
import { X, CheckCircle2, RefreshCw, Zap } from "lucide-react";
import AlbumArt from "../themes/spotify/AlbumArt";

export default function ModelInferenceModal({ project, onClose }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  // Vision Triage state
  const [sampleScan, setSampleScan] = useState("Grade 3 - Moderate DR");
  // Support Copilot state
  const [query, setQuery] = useState("How do I rotate API tokens in production?");
  // Churn state
  const [loginFreq, setLoginFreq] = useState(3);
  const [tickets, setTickets] = useState(4);
  // Feature Mesh state
  const [eventCount, setEventCount] = useState(124);

  if (!project) return null;

  const runInference = () => {
    setRunning(true);
    setResult(null);

    setTimeout(() => {
      setRunning(false);

      if (project.id === "vision-triage") {
        setResult({
          grade: sampleScan.includes("Grade 3") ? "Grade 3 (Severe DR)" : "Grade 1 (Mild DR)",
          confidence: "98.4%",
          latency: "36 ms",
          heatmap: "Attention heatmap highlighted lower-nasal microaneurysms.",
        });
      } else if (project.id === "support-copilot") {
        setResult({
          answer: `To rotate API tokens in production, navigate to Settings > API Keys and click 'Rotate'. Old keys will remain valid for a 24-hour grace period.`,
          citation: "Doc Chunk #4812 (Security Operations Manual v2.4)",
          latency: "740 ms",
          hallucinationScore: "0.01 (Grounded)",
        });
      } else if (project.id === "churn-forecast") {
        const churnProb = Math.min(0.95, (tickets * 0.15 + (10 - loginFreq) * 0.08)).toFixed(2);
        setResult({
          churnProb: `${(churnProb * 100).toFixed(0)}%`,
          riskLevel: churnProb > 0.4 ? "High Risk" : "Low Risk",
          recommendation: churnProb > 0.4 ? "Push account to CSM urgent queue" : "Standard monitoring",
        });
      } else {
        setEventCount((c) => c + 1);
        setResult({
          freshness: "0.74 seconds",
          status: "Materialized into Redis online feature store",
          p99Latency: "4.2 ms",
        });
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-body animate-fade-up">
      <div className="bg-[#11111a] border border-white/20 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#161622]">
          <div className="flex items-center gap-3">
            <AlbumArt project={project} size={48} rounded="rounded-xl" />
            <div>
              <span
                className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border"
                style={{
                  color: project.accent,
                  borderColor: `${project.accent}44`,
                  background: `${project.accent}11`,
                }}
              >
                Interactive Inference Sandbox
              </span>
              <h2 className="font-display text-xl font-bold text-white mt-1">
                {project.title}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1" aria-label="Close inference sandbox">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Retinal Triage Controls */}
          {project.id === "vision-triage" && (
            <div className="space-y-4">
              <label className="block text-xs font-mono text-white/50">
                Select Test Fundus Scan Preset:
              </label>
              <select
                value={sampleScan}
                onChange={(e) => setSampleScan(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              >
                <option>Grade 3 - Moderate DR (Fundus Scan #9012)</option>
                <option>Grade 1 - Mild DR (Fundus Scan #1042)</option>
              </select>
            </div>
          )}

          {/* Support Copilot Controls */}
          {project.id === "support-copilot" && (
            <div className="space-y-4">
              <label className="block text-xs font-mono text-white/50">
                Test User Ticket Query:
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>
          )}

          {/* Churn Horizon Controls */}
          {project.id === "churn-forecast" && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1 text-white/60">
                  <span>Weekly App Logins</span>
                  <span className="font-mono">{loginFreq} logins/wk</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={loginFreq}
                  onChange={(e) => setLoginFreq(parseInt(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-white/60">
                  <span>Support Tickets Submitted</span>
                  <span className="font-mono">{tickets} tickets</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={tickets}
                  onChange={(e) => setTickets(parseInt(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>
            </div>
          )}

          {/* Feature Mesh Controls */}
          {project.id === "feature-mesh" && (
            <div className="text-center py-4">
              <p className="text-xs text-white/60 mb-2">Simulate Ingestion Event Stream</p>
              <p className="text-2xl font-mono font-bold text-cyan-400">
                {eventCount} events processed
              </p>
            </div>
          )}

          {/* Run Button */}
          <button
            onClick={runInference}
            disabled={running}
            className="w-full py-3.5 rounded-xl font-bold text-xs text-black transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
            style={{ background: project.accent }}
          >
            {running ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                Executing Neural Model Forward Pass…
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-black fill-black" />
                Execute Model Inference
              </>
            )}
          </button>

          {/* Result Card */}
          {result && (
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3 animate-fade-up">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Model Output Generated
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  {result.latency || result.p99Latency || "Verified"}
                </span>
              </div>

              {result.grade && (
                <div>
                  <p className="text-xs text-white/50 font-mono">Predicted Grade:</p>
                  <p className="text-lg font-bold text-white">{result.grade}</p>
                  <p className="text-xs text-white/70 mt-1">{result.heatmap}</p>
                </div>
              )}

              {result.answer && (
                <div>
                  <p className="text-xs text-white/50 font-mono">RAG Generated Answer:</p>
                  <p className="text-xs text-white/90 leading-relaxed mt-1">{result.answer}</p>
                  <p className="text-[10px] font-mono text-emerald-400 mt-2">
                    Source Citation: {result.citation}
                  </p>
                </div>
              )}

              {result.churnProb && (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50 font-mono">60-Day Churn Risk:</span>
                    <span className="text-lg font-bold text-orange-400">{result.churnProb}</span>
                  </div>
                  <p className="text-xs text-white/70 mt-1">
                    CRM Action: {result.recommendation}
                  </p>
                </div>
              )}

              {result.freshness && (
                <div>
                  <p className="text-xs text-white/50 font-mono">Feature Freshness:</p>
                  <p className="text-lg font-bold text-cyan-400">{result.freshness}</p>
                  <p className="text-xs text-white/70 mt-1">{result.status}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
