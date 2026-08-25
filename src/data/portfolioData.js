export const domains = [
  { id: "dl", name: "Deep Learning", icon: "brain-circuit" },
  { id: "nlp", name: "NLP & LLMs", icon: "message-square-text" },
  { id: "pa", name: "Predictive Analytics", icon: "trending-up" },
  { id: "mlops", name: "MLOps", icon: "server-cog" },
];

export const projects = [
  {
    id: "rag-financial-intel",
    title: "Financial Document Intelligence",
    domain: "nlp",
    architecture: "LangChain + LlamaIndex + GPT-4 (RAG)",
    accent: "#22D3A5",
    tagline: "RAG pipeline answering compliance & risk questions over 10k+ financial documents.",
    description:
      "A retrieval-augmented generation pipeline built on LangChain, LlamaIndex, and GPT-4 that answers compliance and risk questions over 10,000+ financial documents. Hybrid search — BM25 keyword matching fused with vector embeddings — plus citation-grounded responses keep the hallucination rate under 5%, served through AWS Lambda and API Gateway with sub-2-second response latency.",
    stack: ["LangChain", "LlamaIndex", "GPT-4", "AWS Lambda", "API Gateway", "BM25 + Embeddings"],
    metrics: [
      { label: "Hallucination Rate", value: 5, unit: "%" },
      { label: "Response Latency", value: 2, unit: "s" },
      { label: "Documents Indexed", value: 10, unit: "k+" },
    ],
    achievements: [
      { name: "Hallucination Rate Under 5%", desc: "Citation-grounded responses, hybrid retrieval." },
      { name: "Sub-2s Response Latency", desc: "Served via AWS Lambda + API Gateway." },
      { name: "10,000+ Documents Indexed", desc: "Compliance & risk corpus, hybrid search." },
    ],
    lossCurve: [0.42, 0.35, 0.29, 0.24, 0.19, 0.15, 0.11, 0.08, 0.06, 0.05],
    codeSnippet: `def hybrid_retrieve(query, k=8):
    bm25_hits = bm25_index.search(query, k=k)
    vec_hits = vector_store.similarity_search(query, k=k)
    ranked = rerank(bm25_hits + vec_hits)
    return [d for d in ranked[:k] if d.citation]`,
    layers: [
      { name: "Cited Answer", desc: "Grounded response with source citations, hallucination-checked." },
      { name: "GPT-4 Synthesis", desc: "LLM composes the answer from retrieved grounding chunks." },
      { name: "Hybrid Reranking", desc: "BM25 and embedding scores fused, then reranked." },
      { name: "Vector + Keyword Retrieval", desc: "Parallel BM25 keyword search and vector similarity search." },
      { name: "Document Ingestion", desc: "10,000+ financial documents chunked and embedded." },
    ],
    chat: [
      { user: "sys.logger", msg: "index refreshed — 10,412 documents, 96k chunks" },
      { user: "recruiter_amy", msg: "how do you keep hallucination that low?" },
      { user: "you", msg: "no citation, no send — hybrid search + reranking first" },
      { user: "sys.logger", msg: "eval run complete — hallucination 4.2%" },
    ],
  },
  {
    id: "fraud-triage-engine",
    title: "Fraud Detection & LLM Triage Engine",
    domain: "pa",
    architecture: "LightGBM + Graph Ensemble + GPT-4 Triage",
    accent: "#FF7A45",
    tagline: "Two-stage real-time fraud detection with LLM-generated analyst briefs.",
    description:
      "A two-stage real-time fraud detection system: a sub-50ms LightGBM model scores every transaction at authorization, escalating high-risk cases to a graph-based ensemble and a GPT-4 triage layer that generates auditable, feature-grounded analyst briefs. Cuts analyst review time by roughly 70% while holding the false-positive rate under 2% across a 50k+ transaction simulated dataset.",
    stack: ["LightGBM", "GPT-4", "Graph-based Ensemble", "AWS SageMaker", "AWS Lambda", "Feature Store"],
    metrics: [
      { label: "Scoring Latency", value: 50, unit: "ms" },
      { label: "False Positive Rate", value: 2, unit: "%" },
      { label: "Review Time Saved", value: 70, unit: "%" },
    ],
    achievements: [
      { name: "Sub-50ms Authorization Scoring", desc: "LightGBM model at the point of authorization." },
      { name: "70% Less Analyst Review Time", desc: "GPT-4 generates auditable, feature-grounded briefs." },
      { name: "False Positive Rate Under 2%", desc: "Validated across 50k+ simulated transactions." },
    ],
    lossCurve: [0.58, 0.47, 0.39, 0.33, 0.28, 0.24, 0.21, 0.19, 0.17, 0.16],
    codeSnippet: `score = lightgbm_model.predict(tx_features)
if score > AUTH_THRESHOLD:
    case = graph_ensemble.escalate(tx_features)
    brief = gpt4_triage.summarize(case, grounded=True)
    queue.push(brief)`,
    layers: [
      { name: "Analyst Brief", desc: "Auditable, feature-grounded GPT-4 summary for human review." },
      { name: "Graph Ensemble Triage", desc: "High-risk cases escalated to graph-based ensemble scoring." },
      { name: "LightGBM Authorization Score", desc: "Sub-50ms transaction-level risk score at authorization." },
      { name: "Feature Store Lookup", desc: "Real-time behavioral and transactional features fetched." },
      { name: "Raw Transaction Event", desc: "Incoming payment authorization request." },
    ],
    chat: [
      { user: "sys.logger", msg: "scoring service healthy — p99 latency 47ms" },
      { user: "recruiter_amy", msg: "what happens on a false positive?" },
      { user: "you", msg: "analyst gets a grounded brief, not a black-box flag" },
      { user: "sys.logger", msg: "eval run complete — FPR 1.8% @ 50k tx" },
    ],
  },

  {
    id: "clausewitz-contract-risk",
    title: "Clausewitz — Contract Risk Analyzer",
    domain: "nlp",
    architecture: "RAG + Multi-Agent Pipeline",
    accent: "#C9A227",
    tagline: "Agentic contract risk scoring with citation-grounded redlines.",
    description:
      "A RAG and multi-agent pipeline that ingests commercial contracts in PDF, DOCX, or TXT, segments them into clauses, scores each against a configurable legal risk taxonomy, drafts negotiation-ready redlines with an adjustable stance, and answers free-form questions with citations back to the exact clause.",
    stack: ["FastAPI", "FAISS", "sentence-transformers", "React", "Tailwind"],
    metrics: [
      { label: "Pipeline Stages", value: 5, unit: "" },
      { label: "Input Formats", value: 3, unit: "" },
      { label: "Tech Stack", value: 5, unit: "" },
    ],
    achievements: [
      { name: "Full Ingestion-to-Redline Pipeline", desc: "PDF, DOCX, and TXT contracts handled end to end." },
      { name: "Citation-Grounded Q&A", desc: "Every answer traces back to a specific clause." },
      { name: "Configurable Risk Taxonomy", desc: "Scoring adapts to different legal risk frameworks." },
    ],
    lossCurve: [0.51, 0.44, 0.38, 0.33, 0.29, 0.25, 0.22, 0.19, 0.17, 0.15],
    codeSnippet: `for clause in segment_contract(doc):
    risk = score_against_taxonomy(clause, taxonomy)
    if risk.level >= THRESHOLD:
        redline = draft_redline(clause, stance=STANCE)
        report.add(clause, risk, redline, citation=clause.span)`,
    layers: [
      { name: "Redline Report", desc: "Scored clauses with negotiation-ready redlines and cited answers." },
      { name: "Risk Scoring", desc: "Each clause scored against a configurable legal risk taxonomy." },
      { name: "Clause Segmentation", desc: "Contract split into discrete, addressable clauses." },
      { name: "Multi-Format Parsing", desc: "PDF, DOCX, and TXT contracts normalized to text." },
      { name: "Raw Contract Upload", desc: "Commercial contract submitted for review." },
    ],
    chat: [
      { user: "sys.logger", msg: "taxonomy loaded — 42 risk categories" },
      { user: "recruiter_amy", msg: "does it just flag risk or negotiate too?" },
      { user: "you", msg: "drafts the redline directly, with an adjustable stance" },
      { user: "sys.logger", msg: "review complete — 18 clauses flagged, 6 redlined" },
    ],
  },
  {
    id: "ledger-equity-research",
    title: "Ledger — Equity Research Assistant",
    domain: "nlp",
    architecture: "Multi-Agent RAG + Citation Verification",
    accent: "#38BDF8",
    tagline: "Grounded, cited investment theses from SEC filings — with a built-in fact-checker.",
    description:
      "A multi-agent RAG pipeline that turns SEC 10-K/10-Q filings into a grounded, cited investment thesis. A dedicated citation-verification agent checks every claim against the source filing and triggers an automatic redraft before the report ships.",
    stack: ["FastAPI", "FAISS", "SEC EDGAR API", "React", "Recharts"],
    metrics: [
      { label: "Pipeline Stages", value: 4, unit: "" },
      { label: "Filing Types", value: 2, unit: "" },
      { label: "Tech Stack", value: 5, unit: "" },
    ],
    achievements: [
      { name: "Built-in Citation Verification", desc: "Dedicated agent catches unsupported claims before shipping." },
      { name: "Automatic Redraft Loop", desc: "Flagged claims trigger a re-grounded rewrite, not a manual fix." },
      { name: "SEC EDGAR Integration", desc: "Pulls 10-K/10-Q filings directly from the source." },
    ],
    lossCurve: [0.46, 0.39, 0.33, 0.28, 0.24, 0.20, 0.17, 0.14, 0.12, 0.10],
    codeSnippet: `draft = synthesize_thesis(retrieve(filing, k=12))
claims = extract_claims(draft)
unsupported = citation_agent.verify(claims, filing)
if unsupported:
    draft = redraft(draft, flagged=unsupported)`,
    layers: [
      { name: "Cited Investment Thesis", desc: "Grounded thesis shipped after citation verification." },
      { name: "Citation Verification Agent", desc: "Catches unsupported claims, triggers redraft." },
      { name: "Thesis Synthesis", desc: "Draft thesis composed from retrieved filing context." },
      { name: "SEC Filing Retrieval", desc: "10-K/10-Q sections retrieved via FAISS + EDGAR." },
      { name: "Raw SEC Filing", desc: "10-K or 10-Q submitted for analysis." },
    ],
    chat: [
      { user: "sys.logger", msg: "EDGAR sync complete — 3 filings indexed" },
      { user: "recruiter_amy", msg: "how do you stop it from hallucinating numbers?" },
      { user: "you", msg: "dedicated verification agent — no citation, forced redraft" },
      { user: "sys.logger", msg: "redraft triggered — 2 unsupported claims caught" },
    ],
  },
  {
    id: "roughneck-drilling-intel",
    title: "Roughneck — Drilling Report Intelligence",
    domain: "pa",
    architecture: "LLM Extraction + Deterministic Rollup + RAG Chat",
    accent: "#B45309",
    tagline: "Free-text drilling reports turned into structured NPT analytics.",
    description:
      "An agentic pipeline that converts free-text Daily Drilling Reports into structured non-productive-time analytics. An LLM extraction agent classifies downtime causes against a taxonomy, a deterministic rollup agent aggregates trends, and a RAG chat layer answers questions over a well's full operational history.",
    stack: ["FastAPI", "FAISS", "React", "Recharts"],
    metrics: [
      { label: "Pipeline Stages", value: 4, unit: "" },
      { label: "Data Source", value: 1, unit: " (DDRs)" },
      { label: "Tech Stack", value: 4, unit: "" },
    ],
    achievements: [
      { name: "Structured NPT Taxonomy", desc: "Free-text reports become classified downtime analytics." },
      { name: "Deterministic Trend Rollup", desc: "Aggregation stays reproducible, not LLM-guessed." },
      { name: "Full Well History RAG Chat", desc: "Ask questions across a well's entire operational record." },
    ],
    lossCurve: [0.60, 0.51, 0.44, 0.38, 0.33, 0.29, 0.26, 0.23, 0.21, 0.19],
    codeSnippet: `events = extraction_agent.classify(ddr_text, taxonomy=NPT_CAUSES)
trends = rollup_agent.aggregate(events, by="well_id")
answer = rag_chat.query(question, context=well_history)`,
    layers: [
      { name: "Well History Chat", desc: "RAG chat answers questions over full operational history." },
      { name: "Trend Rollup", desc: "Deterministic agent aggregates NPT trends across wells." },
      { name: "NPT Classification", desc: "LLM extraction agent classifies downtime against taxonomy." },
      { name: "Report Parsing", desc: "Free-text Daily Drilling Reports structured." },
      { name: "Raw Drilling Report", desc: "Daily Drilling Report submitted from the field." },
    ],
    chat: [
      { user: "sys.logger", msg: "DDR batch ingested — 214 reports parsed" },
      { user: "recruiter_amy", msg: "what counts as non-productive time?" },
      { user: "you", msg: "anything off the taxonomy — stuck pipe, waiting on weather, etc" },
      { user: "sys.logger", msg: "rollup complete — top NPT cause: waiting on weather" },
    ],
  },
  {
    id: "sentry-pipeline-anomaly",
    title: "Sentry — Pipeline Anomaly & Incident Response",
    domain: "mlops",
    architecture: "Rolling Z-Score + Agentic RAG Investigation",
    accent: "#EF4444",
    tagline: "Statistical anomaly detection feeding an agentic root-cause investigator.",
    description:
      "Deterministic statistical anomaly detection (rolling z-score) over SCADA sensor data feeds an agentic RAG pipeline that investigates root causes against a maintenance-manual and incident-history knowledge base, drafting structured incident reports with recommended actions.",
    stack: ["FastAPI", "FAISS", "React", "Recharts"],
    metrics: [
      { label: "Pipeline Stages", value: 4, unit: "" },
      { label: "Detection Window", value: 15, unit: "m" },
      { label: "Tech Stack", value: 4, unit: "" },
    ],
    achievements: [
      { name: "Statistical + Agentic Hybrid", desc: "Deterministic z-score detection feeds an investigative RAG layer." },
      { name: "Grounded Root-Cause Reports", desc: "Findings cite the maintenance manual and incident history." },
      { name: "Actionable Incident Drafts", desc: "Every report ships with recommended next steps." },
    ],
    lossCurve: [0.55, 0.47, 0.40, 0.35, 0.30, 0.27, 0.24, 0.22, 0.20, 0.18],
    codeSnippet: `z = rolling_zscore(sensor_stream, window="15m")
if abs(z) > Z_THRESHOLD:
    context = retrieve(manual_kb, incident_history)
    report = draft_incident_report(context, sensor_stream, actions=True)`,
    layers: [
      { name: "Incident Report", desc: "Structured report with root cause and recommended actions." },
      { name: "RAG Root-Cause Investigation", desc: "Agent investigates against maintenance manuals & incident history." },
      { name: "Anomaly Flag", desc: "Rolling z-score crosses the alert threshold." },
      { name: "Statistical Monitoring", desc: "SCADA sensor stream scored in real time." },
      { name: "Raw SCADA Telemetry", desc: "Live pipeline sensor data." },
    ],
    chat: [
      { user: "sys.logger", msg: "z-score monitor live — window 15m" },
      { user: "recruiter_amy", msg: "false alarms must be a problem at that sensitivity" },
      { user: "you", msg: "the RAG investigation agent filters most before they reach a human" },
      { user: "sys.logger", msg: "incident report drafted — root cause: valve drift" },
    ],
  },
  {
    id: "watthead-grid-planning",
    title: "Watthead — Grid Demand Scenario Planning",
    domain: "pa",
    architecture: "Seasonal-Naive Forecast + Agentic Scenario Planning",
    accent: "#FACC15",
    tagline: 'Plain-English "what-if" scenarios grounded in real grid operating procedures.',
    description:
      "Deterministic seasonal-naive demand forecasting for an electricity grid, combined with an agent that interprets natural-language what-if scenarios like a 4-day heatwave at 111°F, computes capacity headroom, and grounds the risk assessment in real grid operating procedures via RAG.",
    stack: ["FastAPI", "FAISS", "React", "Recharts"],
    metrics: [
      { label: "Pipeline Stages", value: 4, unit: "" },
      { label: "Forecast Horizon", value: 72, unit: "h" },
      { label: "Tech Stack", value: 4, unit: "" },
    ],
    achievements: [
      { name: "Natural-Language Scenario Planning", desc: '"A 4-day heatwave at 111°F" becomes a capacity calculation.' },
      { name: "Deterministic Forecast Baseline", desc: "Seasonal-naive model keeps the baseline auditable." },
      { name: "Procedure-Grounded Risk Read", desc: "Risk assessment cites real grid operating procedures." },
    ],
    lossCurve: [0.48, 0.41, 0.35, 0.30, 0.26, 0.23, 0.20, 0.18, 0.16, 0.15],
    codeSnippet: `baseline = seasonal_naive_forecast(grid_load, horizon="72h")
scenario = agent.interpret("4-day heatwave at 111F")
headroom = capacity - baseline.adjust(scenario)
risk = ground_in_procedures(headroom, grid_ops_kb)`,
    layers: [
      { name: "Grounded Risk Assessment", desc: "Scenario risk grounded in real grid operating procedures." },
      { name: "Capacity Headroom", desc: "Computed against the adjusted demand forecast." },
      { name: "Scenario Interpretation", desc: "Agent parses natural-language what-if scenarios." },
      { name: "Seasonal-Naive Forecast", desc: "Deterministic baseline demand forecast." },
      { name: "Raw Grid Load Data", desc: "Historical electricity demand telemetry." },
    ],
    chat: [
      { user: "sys.logger", msg: "forecast refreshed — 72h horizon" },
      { user: "recruiter_amy", msg: "can it really handle 'what if' questions?" },
      { user: "you", msg: "yes — plain English scenario, grounded headroom calc" },
      { user: "sys.logger", msg: "scenario run — 4-day heatwave at 111°F — headroom 6.2%" },
    ],
  },
  {
    id: "statute-regulatory-compliance",
    title: "Statute — Regulatory Compliance Assistant",
    domain: "nlp",
    architecture: "RAG-Grounded Compliance Gap Analysis",
    accent: "#8B5CF6",
    tagline: "Company policy checked section by section against the regulatory corpus.",
    description:
      "A RAG-grounded compliance gap analysis tool: upload a company policy document, and each section is checked against a regulatory corpus — reliability standards, interconnection rules, RPS reporting — producing a scored compliance report with per-finding citations and remediation recommendations.",
    stack: ["FastAPI", "FAISS", "React", "Tailwind"],
    metrics: [
      { label: "Pipeline Stages", value: 4, unit: "" },
      { label: "Reg. Categories", value: 3, unit: "" },
      { label: "Tech Stack", value: 4, unit: "" },
    ],
    achievements: [
      { name: "Section-by-Section Gap Analysis", desc: "Every policy section checked against the regulatory corpus." },
      { name: "Cited, Scored Compliance Report", desc: "Each finding backed by a specific regulatory citation." },
      { name: "Remediation Built In", desc: "Findings ship with concrete recommendations, not just flags." },
    ],
    lossCurve: [0.52, 0.45, 0.39, 0.34, 0.30, 0.26, 0.23, 0.21, 0.19, 0.17],
    codeSnippet: `sections = parse_policy(doc)
for section in sections:
    gap = compare_to_corpus(section, reg_corpus)
    report.add(section, gap.score, citations=gap.sources, remediation=gap.fix)`,
    layers: [
      { name: "Compliance Report", desc: "Scored report with per-finding citations and remediation." },
      { name: "Gap Scoring", desc: "Each policy section checked against the regulatory corpus." },
      { name: "Section Parsing", desc: "Company policy document broken into addressable sections." },
      { name: "Regulatory Corpus Indexing", desc: "Reliability standards, interconnection rules, RPS reporting indexed." },
      { name: "Raw Policy Upload", desc: "Company compliance policy document submitted." },
    ],
    chat: [
      { user: "sys.logger", msg: "regulatory corpus indexed — 3 standards families" },
      { user: "recruiter_amy", msg: "does it just find gaps or fix them too?" },
      { user: "you", msg: "every finding ships with a remediation recommendation" },
      { user: "sys.logger", msg: "compliance scan complete — 11 findings, 2 high severity" },
    ],
  },


];

export const candidate = {
  name: "Maneeshwar M",
  role: "AI/ML Engineer",
  location: "TX, USA",
  email: "maneeshwar.m@mycvhire.com",
  phone: "(979) 398-2463",
  linkedin: "https://www.linkedin.com/in/maneeshwar-m/",
  github: "https://github.com/ManeeshwarM?tab=repositories",
  bio: "AI/ML Engineer with 4+ years of experience building production-ready machine learning systems spanning NLP, Generative AI, LLMs, and advanced analytics. Strong background across the full ML lifecycle — from classical supervised/unsupervised/ensemble methods (Logistic Regression, Random Forest, XGBoost, SVM, KMeans) to fine-tuned deep learning architectures (CNNs, LSTMs, Transformers, BERT, GPT, LLaMA) for production AI use cases.",
  stats: [
    { label: "Experience", value: "4+ Yrs" },
    { label: "Model Validation Lift", value: "+30%" },
    { label: "Analyst Review Time Saved", value: "70%" },
    { label: "Deploy Cycle Reduction", value: "43%" },
  ],
};

export const experience = [
  {
    id: "exp-1",
    role: "AI/ML Engineer",
    company: "Stripe",
    period: "Sep 2025 — Present",
    location: "California",
    description:
      "Building deep learning and NLP systems for payment risk and fraud detection, and architecting the ML pipelines that ship them to production.",
    highlights: [
      "Developed DL solutions using CNNs and computer vision techniques to detect transaction anomalies and risk indicators across financial datasets, improving model validation performance by 30% while accelerating fraud detection workflows.",
      "Engineered 20+ behavioral and transactional features — spending patterns, transaction frequency, statistical indicators — strengthening model discrimination by 29% and improving real-time payment risk monitoring.",
      "Built BERT-based NLP solutions to extract sentiment, financial signals, and market insights from financial news and unstructured text, increasing signal quality for predictive modeling.",
      "Implemented real-time anomaly detection and feature transformation algorithms for payment transaction data, improving detection stability across merchant environments and payment scenarios.",
      "Architected ML pipelines using AWS Lambda, AWS Glue, and Amazon S3, integrating PyTorch and data-processing workflows to improve model deployment efficiency and scalability.",
      "Built CI/CD pipelines for ML workflows, automating training, validation, and production deployment for payment risk and fraud detection models.",
    ],
    skills: ["PyTorch", "CNN", "BERT", "AWS Lambda", "AWS Glue", "S3", "CI/CD for ML"],
  },
  {
    id: "exp-2",
    role: "Junior AI/ML Engineer",
    company: "Accenture",
    period: "Aug 2021 — Jul 2024",
    location: "Bangalore, India",
    description:
      "Optimized and modernized ML workloads across document classification, computer vision, and regression modeling for enterprise-scale deployments, with model monitoring and BI reporting layered on top.",
    highlights: [
      "Optimized RNN architectures for document classification and computer vision object detection, improving processing efficiency and supporting scalable enterprise implementations.",
      "Built regression models (Linear, Ridge, Lasso, Elastic Net) to analyze complex datasets and predict business outcomes, improving prediction accuracy.",
      "Modernized legacy ML workloads by optimizing Scikit-learn models with containerized deployments, reducing production deployment cycles by 43%.",
      "Ran model monitoring and governance workflows using MLflow and AWS CloudWatch to track performance and drift, reducing production-related issues.",
      "Deployed Tableau dashboards integrating prediction confidence intervals and performance KPIs, enabling faster data-driven decisions across teams.",
      "Used Pandas for preprocessing, transformation, and exploratory analysis, and Matplotlib to visualize model inputs and prediction patterns.",
      "Ran Cohort Analysis and Hypothesis Testing to evaluate model performance and experimental outcomes, surfacing statistically significant patterns.",
    ],
    skills: ["Scikit-learn", "RNN", "MLflow", "AWS CloudWatch", "Tableau", "Pandas", "Hypothesis Testing"],
  },
];

export const skillsCategories = [
  {
    category: "AI & Deep Learning",
    icon: "BrainCircuit",
    skills: [
      { name: "PyTorch & TensorFlow/Keras", level: "Expert" },
      { name: "CNN, ANN & Computer Vision", level: "Expert" },
      { name: "BERT, GPT-4 & LLaMA", level: "Advanced" },
      { name: "Retrieval-Augmented Generation (RAG)", level: "Advanced" },
      { name: "LangChain & LlamaIndex", level: "Advanced" },
      { name: "NER, RoBERTa & Sentiment Analysis", level: "Advanced" },
    ],
  },
  {
    category: "Machine Learning & MLOps",
    icon: "Server",
    skills: [
      { name: "XGBoost, Random Forest & SVM", level: "Expert" },
      { name: "Regression & Ensemble Methods", level: "Expert" },
      { name: "MLflow & Model Monitoring", level: "Advanced" },
      { name: "CI/CD for ML & Model Deployment", level: "Advanced" },
      { name: "AWS (SageMaker, Lambda, Glue, S3)", level: "Advanced" },
      { name: "Cohort Analysis & Hypothesis Testing", level: "Advanced" },
    ],
  },
  {
    category: "Languages & Databases",
    icon: "Database",
    skills: [
      { name: "Python & R", level: "Expert" },
      { name: "SQL (PostgreSQL, SQL Server)", level: "Expert" },
      { name: "MongoDB, Redis & Neo4j", level: "Advanced" },
      { name: "Tableau & Power BI (DAX)", level: "Advanced" },
      { name: "NumPy, Pandas & Scikit-learn", level: "Expert" },
    ],
  },
];

export const roadmap = [
  {
    title: "Agentic Personalized Tutor",
    domain: "Education",
    description:
      "RAG over curriculum materials with an adaptive question-generation agent and a progress-tracking agent that calibrates difficulty to the student's demonstrated level.",
  },
  {
    title: "Dynamic NPC Dialogue Engine",
    domain: "Gaming",
    description:
      "Memory-backed LLM dialogue system — each character keeps a vector-store memory of past player interactions instead of resetting every session.",
  },
  {
    title: "Player Behavior Analytics & Churn Agent",
    domain: "Gaming",
    description:
      "RAG-powered analytics over session and chat logs; retrieval-grounded agents flag toxicity and churn risk and draft summarized reports for community teams.",
  },
  {
    title: "Clinical Note Summarizer & Differential Assistant",
    domain: "Medical",
    description:
      "Agentic summarization of clinical notes with a literature-grounded differential diagnosis candidate list — built as decision support, not diagnosis.",
  },
  {
    title: "Multi-Hop Medical Literature Research Assistant",
    domain: "Medical",
    description:
      "Agentic RAG performing multi-hop retrieval across medical literature, chaining retrieval and reasoning steps to answer complex research questions.",
  },
  {
    title: "Trend Forecasting & Visual Style Recommender",
    domain: "Fashion Tech",
    description:
      "Trend-signal retrieval over fashion editorial and data sources, combined with an agentic forecasting layer and a style-recommendation engine.",
  },
];

// Your resume doesn't list separate certifications — this section is your
// education. Component/tab labels still say "Certifications"; see the
// one-line rename note below if you'd rather it say "Education".
export const certifications = [
  {
    id: "edu-1",
    title: "M.S. in Engineering Data Science",
    issuer: "University of Houston",
    date: "Aug 2024 — May 2026 (In Progress)",
    credentialId: "Houston, TX",
    badgeColor: "#1db954",
    skills: ["Data Science", "Statistical Modeling", "Machine Learning", "Engineering"],
  },

  
];