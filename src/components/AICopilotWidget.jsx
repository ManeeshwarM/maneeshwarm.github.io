import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, RefreshCw } from "lucide-react";
import { candidate } from "../data/portfolioData";

const PRESETS = [
  "What is Maneeshwar's experience with PyTorch & RAG?",
  "Tell me about his highest impact production model.",
  "Is he open to remote or relocation?",
  "What certifications does he hold?",
];

export default function AICopilotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hi! I'm Maneeshwar's AI Portfolio Assistant. Ask me anything about his ML engineering experience, shipped models, or technical background!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, open]);

  const generateAnswer = (q) => {
    const query = q.toLowerCase();

    if (query.includes("pytorch") || query.includes("rag") || query.includes("llm")) {
      return `Maneeshwar has extensive experience with PyTorch and LLMs! He built the "Support Copilot" (fine-tuned Llama-3-8B with pgvector RAG) serving 40k tickets/month with a 62% deflection rate. He also fine-tuned ResNet-50 + Attention networks in PyTorch for medical image triage achieving 98.1% AUC-ROC.`;
    }

    if (query.includes("impact") || query.includes("model") || query.includes("highest")) {
      return `His top impact projects include:
1. Retinal Triage Net (98.1% AUC-ROC diabetic retinopathy grading)
2. Support Copilot (62% ticket deflection with RAG Llama-3-8B)
3. Churn Horizon ($1.4M saved in ARR using LightGBM survival models)
4. Feature Mesh (<1s online feature freshness with Flink + Kafka)`;
    }

    if (query.includes("remote") || query.includes("relocation") || query.includes("location")) {
      return `Maneeshwar is based in ${candidate.location}. He is open to both onsite and full-time remote AI/ML Engineer positions.`;    }

    if (query.includes("certif")) {
      return `He holds 4 verified certifications:
• AWS Certified Machine Learning – Specialty
• DeepLearning.AI Deep Learning Specialization (Andrew Ng)
• Databricks Certified Data Engineer Associate
• Google TensorFlow Developer Certificate`;
    }

    return `Maneeshwar M is a ${candidate.role} with 4+ years of experience shipping production ML systems. He specializes in Deep Learning, RAG/LLM pipelines, Survival Telemetry, and MLOps feature stores. Feel free to contact him directly at ${candidate.email}!`;
  };

  const handleSend = (textToSend) => {
    const userText = textToSend || input;
    if (!userText.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: userText.trim() }]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const answer = generateAnswer(userText);
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-20 right-5 z-[9999] font-body select-none">
      {/* Floating Launcher Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white font-semibold text-xs shadow-2xl hover:scale-105 transition-transform"
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI Assistant</span>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="w-80 sm:w-96 rounded-2xl bg-[#12121c] border border-white/15 shadow-2xl flex flex-col h-[480px] overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="p-3.5 border-b border-white/10 bg-[#181826] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-emerald-400 flex items-center justify-center text-black">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="font-display font-bold text-xs text-white">Maneeshwar AI Copilot</p>
                <p className="text-[10px] text-emerald-400 font-mono">● Online Recruiter Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/40 hover:text-white p-1"
              aria-label="Close AI assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 text-xs leading-relaxed ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-md bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] ${
                    m.role === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-white/[0.05] border border-white/10 text-white/90 rounded-bl-none whitespace-pre-line"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-white/40 font-mono">
                <RefreshCw className="w-3 h-3 animate-spin text-purple-400" />
                Thinking...
              </div>
            )}
          </div>

          {/* Presets */}
          <div className="px-3 py-2 border-t border-white/5 bg-black/20 flex gap-1.5 overflow-x-auto">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-white/60 hover:text-white transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 border-t border-white/10 bg-[#161622] flex gap-2"
          >
            <input
              type="text"
              aria-label="Ask the AI assistant about Maneeshwar's skills"
              placeholder="Ask AI about Maneeshwar's skills…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-purple-500/50"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shrink-0"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
