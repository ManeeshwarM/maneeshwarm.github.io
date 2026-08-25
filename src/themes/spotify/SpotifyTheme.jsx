import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import AlbumGrid from "./AlbumGrid";
import Player from "./Player";
import TopBar from "./TopBar";
// import CursorFX from "../../components/CursorFX";
import AmbientCanvas from "../../components/AmbientCanvas";
import BootSequence from "../../components/BootSequence";
import { projects, candidate, experience, skillsCategories, certifications } from "../../data/portfolioData";
import { audioEngine } from "../../utils/audioEngine";
import { generateResumePdf } from "../../utils/generateResumePdf";
import { X, CheckCircle2, Download } from "lucide-react";

// Code-split the secondary views: only the active tab's bundle loads.
const SpotifyAboutView = lazy(() => import("./SpotifyAboutView"));
const SpotifyExperienceView = lazy(() => import("./SpotifyExperienceView"));
const SpotifySkillsView = lazy(() => import("./SpotifySkillsView"));
const SpotifyCertificationsView = lazy(() => import("./SpotifyCertificationsView"));
const SpotifyContactView = lazy(() => import("./SpotifyContactView"));
const CommandPalette = lazy(() => import("../../components/CommandPalette"));
const AICopilotWidget = lazy(() => import("../../components/AICopilotWidget"));
const ModelInferenceModal = lazy(() => import("../../components/ModelInferenceModal"));
// const SpotifySkillsView = lazy(() => import("./SpotifySkillsView"));
const SpotifyAnalyticsView = lazy(() => import("./SpotifyAnalyticsView"));
const viewVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function ViewLoading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div
        className="w-6 h-6 rounded-full border-2 border-white/10 border-t-[#1db954] animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

export default function SpotifyTheme() {
  const [activeTab, setActiveTab] = useState("projects");
  const [activeDomain, setActiveDomain] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(projects[0]);
  const [playing, setPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [likedIds, setLikedIds] = useState(new Set());
  const [volume, setVolume] = useState(70);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("none");
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [sandboxProject, setSandboxProject] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [showBoot, setShowBoot] = useState(true);

  // Command Palette global shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesDomain = activeDomain ? p.domain === activeDomain : true;
    const q = searchQuery.toLowerCase();
    const matchesSearch = q
      ? p.title.toLowerCase().includes(q) ||
        p.architecture.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
      : true;
    return matchesDomain && matchesSearch;
  });

  const handlePlay = useCallback((p) => {
    audioEngine.playClickSound();
    setNowPlaying(p);
    setPlaying(true);
  }, []);

  const handleSkip = useCallback(
    (direction) => {
      if (!nowPlaying) return;
      audioEngine.playClickSound();
      const pool = shuffle
        ? [...projects].sort(() => Math.random() - 0.5)
        : projects;
      const idx = pool.findIndex((p) => p.id === nowPlaying.id);
      let next;
      if (direction === "forward") {
        next = pool[(idx + 1) % pool.length];
      } else {
        next = pool[(idx - 1 + pool.length) % pool.length];
      }
      setNowPlaying(next);
      setPlaying(true);
    },
    [nowPlaying, shuffle]
  );

  const toggleLike = useCallback((id) => {
    setLikedIds((prev) => {
      const s = new Set(prev);
      if (s.has(id)) {
        s.delete(id);
      } else {
        s.add(id);
      }
      return s;
    });
  }, []);

  const handleCommandAction = (actionItem) => {
    if (actionItem.type === "section") {
      setActiveTab(actionItem.id);
      if (actionItem.id === "projects") setActiveDomain(null);
    } else if (actionItem.type === "project") {
      setActiveTab("projects");
      handlePlay(actionItem.projectObj);
    } else if (actionItem.type === "experience") {
      setActiveTab("experience");
    } else if (actionItem.type === "certification") {
      setActiveTab("certifications");
    }
  };

  // Dynamic background gradient based on nowPlaying accent color
  const bgAccent = nowPlaying ? nowPlaying.accent : "#1db954";

  return (
    <div className="flex flex-col h-screen font-body select-none relative" style={{ background: "#000" }}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
    
      <AmbientCanvas accent={bgAccent} active={playing} />
      {showBoot && <BootSequence onDone={() => setShowBoot(false)} />}
      <div className="flex flex-1 min-h-0 relative z-10">
        {/* Spotify Sidebar with Resume Sections */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            audioEngine.playClickSound();
            setActiveTab(tab);
          }}
          activeDomain={activeDomain}
          setActiveDomain={(domain) => {
            audioEngine.playClickSound();
            setActiveDomain(domain);
          }}
          likedIds={likedIds}
        />

        {/* Main Content Area */}
        <div
          className="flex flex-col flex-1 min-w-0 transition-colors duration-700"
          style={{
            background: `linear-gradient(180deg, ${bgAccent}25 0%, #121212 35%)`,
          }}
        >
          <TopBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenResume={() => setShowResumeModal(true)}
            onOpenCmd={() => setCmdOpen(true)}
           onNavigate={(tab) => {
    setActiveTab(tab);
    if (tab === "projects") {
      setActiveDomain(null);
    }
  }}

          />

          {/* Active View Renderer, with a fade/slide transition between tabs */}
          <main id="main-content" className="flex flex-col flex-1 min-h-0">
            <Suspense fallback={<ViewLoading />}>
              <AnimatePresence mode="wait">
                {activeTab === "projects" && (
                  <motion.div
                    key="projects"
                    variants={viewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex flex-col flex-1 min-h-0"
                  >
                    <AlbumGrid
                      projects={filteredProjects}
                      activeDomain={activeDomain}
                      nowPlayingId={nowPlaying?.id}
                      playing={playing}
                      likedIds={likedIds}
                      onPlay={handlePlay}
                      onToggleLike={toggleLike}
                      onOpenInference={(p) => setSandboxProject(p)}
                    />
                  </motion.div>
                )}

                {activeTab === "about" && (
                  <motion.div
                    key="about"
                    variants={viewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex flex-col flex-1 min-h-0"
                  >
                    <SpotifyAboutView onGoToProjects={() => setActiveTab("projects")} />
                  </motion.div>
                )}

                {activeTab === "experience" && (
                  <motion.div
                    key="experience"
                    variants={viewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex flex-col flex-1 min-h-0"
                  >
                    <SpotifyExperienceView />
                  </motion.div>
                )}

                {activeTab === "skills" && (
                  <motion.div
                    key="skills"
                    variants={viewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex flex-col flex-1 min-h-0"
                  >
                    <SpotifySkillsView />
                  </motion.div>
                )}

                {activeTab === "analytics" && (
                  <motion.div
                    key="analytics"
                    variants={viewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex flex-col flex-1 min-h-0"
                  >
                    <SpotifyAnalyticsView />
                  </motion.div>
                )}

                {activeTab === "certifications" && (
                  <motion.div
                    key="certifications"
                    variants={viewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex flex-col flex-1 min-h-0"
                  >
                    <SpotifyCertificationsView />
                  </motion.div>
                )}

                {activeTab === "contact" && (
                  <motion.div
                    key="contact"
                    variants={viewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex flex-col flex-1 min-h-0"
                  >
                    <SpotifyContactView />
                  </motion.div>
                )}
              </AnimatePresence>
            </Suspense>
          </main>
        </div>
      </div>

      {/* Persistent Audio Player at bottom */}
      <Player
        project={nowPlaying}
        playing={playing}
        setPlaying={setPlaying}
        onSkip={handleSkip}
        likedIds={likedIds}
        onToggleLike={toggleLike}
        volume={volume}
        setVolume={setVolume}
        shuffle={shuffle}
        setShuffle={setShuffle}
        repeat={repeat}
        setRepeat={setRepeat}
      />

      <Suspense fallback={null}>
        {/* Command Palette Spotlight Search */}
        <CommandPalette
          isOpen={cmdOpen}
          onClose={() => setCmdOpen(false)}
          onSelectAction={handleCommandAction}
        />

        {/* Floating AI Recruiter Copilot Assistant */}
        <AICopilotWidget />

        {/* Live Model Inference Sandbox Modal */}
        {sandboxProject && (
          <ModelInferenceModal
            project={sandboxProject}
            onClose={() => setSandboxProject(null)}
          />
        )}
      </Suspense>

      {/* Full Resume Modal */}
      {showResumeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Full resume"
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowResumeModal(false);
          }}
        >
          <div className="bg-[#181818] border border-white/15 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-fade-up relative">
            <button
              onClick={() => setShowResumeModal(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white p-1"
              aria-label="Close resume"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-white/10 pb-6 mb-6">
              <span className="text-xs uppercase font-mono tracking-widest text-[#1db954]">
                Curriculum Vitae
              </span>
              <h2 className="font-display text-3xl font-bold text-white mt-1">
                {candidate.name}
              </h2>
              <p className="text-sm text-white/60">
                {candidate.role} · {candidate.location}
              </p>
            </div>

            <div className="space-y-6 text-sm text-white/80">
              <div>
                <h3 className="font-display font-semibold text-white text-base mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1db954]" /> Executive Summary
                </h3>
                <p className="text-white/65 leading-relaxed">
                  {candidate.bio}
                </p>
              </div>

              <div>
                <h3 className="font-display font-semibold text-white text-base mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1db954]" /> Featured Shipped Models
                </h3>
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="bg-black/40 border border-white/10 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-white">{p.title}</h4>
                        <span className="font-mono text-xs text-[#1db954]">
                          {p.architecture}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mb-2">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.stack.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center flex-wrap gap-3">
                <span className="text-xs text-white/40 font-mono">
                  Contact: {candidate.email}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={generatingPdf}
                    onClick={async () => {
                      setGeneratingPdf(true);
                      try {
                        await generateResumePdf({
                          candidate,
                          experience,
                          projects,
                          skillsCategories,
                          certifications,
                        });
                      } finally {
                        setGeneratingPdf(false);
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#1db954]/50 text-[#1db954] font-bold text-xs hover:bg-[#1db954]/10 transition-colors disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {generatingPdf ? "Generating…" : "Download PDF"}
                  </button>
                  <button
                    onClick={() => setShowResumeModal(false)}
                    className="px-4 py-2 rounded-full bg-[#1db954] text-black font-bold text-xs hover:bg-[#1ed760]"
                  >
                    Close Resume
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
