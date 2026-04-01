export interface Topic {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  abbr: string;
  color: string;
  weightage: number;
  mcqCount: number;
  topics: Topic[];
  source?: "system" | "university";
}

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  difficulty: "easy" | "medium" | "hard" | "unrated";
  text: string;
  options: string[];
  correctAnswer: number; // 0-3, or -1 if unknown (practice only)
  explanation: string;
  source?: "system" | "university";
}

// ===== SUBJECTS (Real NSCT Syllabus) =====
export const subjects: Subject[] = [
  {
    id: "problem-solving",
    name: "Problem Solving & Analytical Skills",
    abbr: "PS",
    color: "#0D9488",
    weightage: 20,
    mcqCount: 960,
    topics: [
      { id: "intro-ps", name: "Introduction to Problem Solving" },
      { id: "problem-analysis", name: "Problem Understanding & Analysis" },
      { id: "logical-reasoning", name: "Logical Reasoning Fundamentals" },
      { id: "algo-flow", name: "Algorithms & Flow Control" },
      { id: "data-repr", name: "Data Representation & Abstraction" },
      { id: "pattern-recog", name: "Pattern Recognition & Generalization" },
      { id: "math-reasoning", name: "Mathematical & Quantitative Reasoning" },
      { id: "algo-thinking", name: "Algorithmic Thinking" },
      { id: "critical-thinking", name: "Critical Thinking & Decision Making" },
      { id: "debugging-analysis", name: "Debugging & Error Analysis" },
      { id: "complexity-aware", name: "Complexity & Efficiency Awareness" },
      { id: "ps-programming", name: "Problem Solving Using Programming" },
      { id: "data-driven-ps", name: "Data-Driven Problem Solving" },
      { id: "creative-thinking", name: "Creative & Innovative Thinking" },
      { id: "real-world-ps", name: "Real-World Problem Solving" },
      { id: "comm-docs", name: "Communication & Documentation of Solutions" },
    ],
  },
  {
    id: "ai-ml",
    name: "AI / Machine Learning & Data Analytics",
    abbr: "AI",
    color: "#7C3AED",
    weightage: 10,
    mcqCount: 1020,
    topics: [
      { id: "intro-ai", name: "Introduction to AI, ML & Data Analytics" },
      { id: "math-foundations", name: "Mathematical Foundations" },
      { id: "python-ai", name: "Python for AI" },
      { id: "data-preprocessing", name: "Data Collection & Pre-processing" },
      { id: "eda", name: "Exploratory Data Analysis" },
      { id: "supervised", name: "Supervised Learning" },
      { id: "ensemble", name: "Ensemble Learning" },
      { id: "unsupervised", name: "Unsupervised Learning" },
      { id: "model-eval", name: "Model Evaluation & Validation" },
      { id: "feature-eng", name: "Feature Engineering" },
      { id: "deep-learning", name: "Deep Learning Fundamentals" },
      { id: "advanced-dl", name: "Advanced Deep Learning" },
      { id: "nlp", name: "NLP" },
      { id: "computer-vision", name: "Computer Vision" },
      { id: "big-data", name: "Big Data Analytics" },
      { id: "mlops", name: "Model Deployment & MLOps" },
      { id: "ai-ethics", name: "AI Ethics, Security & Privacy" },
    ],
  },
  {
    id: "cn-cloud",
    name: "Computer Networks & Cloud Computing",
    abbr: "CN",
    color: "#2563EB",
    weightage: 10,
    mcqCount: 600,
    topics: [
      { id: "data-comm", name: "Data Communication" },
      { id: "computer-networks", name: "Computer Networks" },
      { id: "data-link-layer", name: "Data Link Layer" },
      { id: "network-layer", name: "Network Layer" },
      { id: "transport-layer", name: "Transport Layer" },
      { id: "application-layer", name: "Application Layer" },
      { id: "wireless-networks", name: "Wireless Networks" },
      { id: "cloud-computing", name: "Cloud Computing" },
      { id: "network-security", name: "Network Security (Network Perspective)" },
      { id: "next-gen-networks", name: "Next Generation Networks" },
    ],
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    abbr: "DSA",
    color: "#059669",
    weightage: 10,
    mcqCount: 720,
    topics: [
      { id: "foundations", name: "Foundations of DS & Algorithms" },
      { id: "linear-ds", name: "Linear Data Structures" },
      { id: "non-linear-ds", name: "Non-Linear Data Structures" },
      { id: "searching", name: "Searching Algorithms" },
      { id: "sorting", name: "Sorting Algorithms" },
      { id: "hashing", name: "Hashing" },
      { id: "tree-algo", name: "Tree Algorithms" },
      { id: "graph-algo", name: "Graph Algorithms" },
      { id: "algo-design", name: "Algorithm Design Techniques" },
      { id: "advanced-ds", name: "Advanced Data Structures" },
      { id: "string-algo", name: "String Algorithms" },
      { id: "complexity-opt", name: "Complexity & Optimization" },
    ],
  },
  {
    id: "os",
    name: "Operating Systems",
    abbr: "OS",
    color: "#DC2626",
    weightage: 5,
    mcqCount: 720,
    topics: [
      { id: "intro-os", name: "Introduction to OS" },
      { id: "os-structures", name: "OS Structures" },
      { id: "process-mgmt", name: "Process Management" },
      { id: "cpu-scheduling", name: "CPU Scheduling" },
      { id: "thread-mgmt", name: "Thread Management" },
      { id: "concurrency-sync", name: "Concurrency & Synchronization" },
      { id: "deadlocks", name: "Deadlocks" },
      { id: "memory-mgmt", name: "Memory Management" },
      { id: "file-systems", name: "File Systems" },
      { id: "secondary-storage", name: "Secondary Storage" },
      { id: "io-systems", name: "I/O Systems" },
      { id: "protection-security", name: "Protection & Security" },
    ],
  },
  {
    id: "webdev",
    name: "Web Development",
    abbr: "WEB",
    color: "#EC4899",
    weightage: 10,
    mcqCount: 1020,
    topics: [
      { id: "intro-web", name: "Introduction to Web Development" },
      { id: "web-arch", name: "Web Architecture & Protocols" },
      { id: "html", name: "HTML Fundamentals" },
      { id: "css", name: "CSS Fundamentals" },
      { id: "advanced-css", name: "Advanced CSS & Responsive Design" },
      { id: "js-fundamentals", name: "JavaScript Fundamentals" },
      { id: "advanced-js", name: "Advanced JavaScript" },
      { id: "frontend-frameworks", name: "Frontend Frameworks & Libraries" },
      { id: "backend-fundamentals", name: "Backend Development Fundamentals" },
      { id: "server-side", name: "Server-Side Programming" },
      { id: "web-databases", name: "Databases for Web Applications" },
      { id: "web-security", name: "Web Security" },
      { id: "web-perf", name: "Web Performance & Optimization" },
      { id: "web-testing", name: "Web Testing & Debugging" },
      { id: "deployment", name: "Deployment & Hosting" },
      { id: "web-apis", name: "Web APIs & Integration" },
      { id: "modern-web", name: "Modern Web Practices" },
    ],
  },
  {
    id: "se",
    name: "Software Engineering",
    abbr: "SE",
    color: "#0891B2",
    weightage: 10,
    mcqCount: 960,
    topics: [
      { id: "intro-se", name: "Introduction to Software Engineering" },
      { id: "process-models", name: "Software Process Models" },
      { id: "agile", name: "Agile Development" },
      { id: "requirements", name: "Requirements Engineering" },
      { id: "project-mgmt", name: "Project Management" },
      { id: "software-design", name: "Software Design" },
      { id: "software-arch", name: "Software Architecture" },
      { id: "ui-design", name: "UI Design" },
      { id: "implementation", name: "Implementation & Coding" },
      { id: "testing", name: "Software Testing" },
      { id: "maintenance", name: "Maintenance & Evolution" },
      { id: "qa", name: "Quality Assurance" },
      { id: "metrics", name: "Metrics & Measurement" },
      { id: "config-mgmt", name: "Configuration Management" },
      { id: "risk-mgmt", name: "Risk Management" },
      { id: "security-eng", name: "Security Engineering" },
    ],
  },
  {
    id: "programming",
    name: "Programming",
    abbr: "PRG",
    color: "#4F46E5",
    weightage: 10,
    mcqCount: 960,
    topics: [
      { id: "prog-fundamentals", name: "Programming Fundamentals" },
      { id: "data-types", name: "Data Types & Variables" },
      { id: "operators", name: "Operators & Expressions" },
      { id: "control-structures", name: "Control Structures" },
      { id: "functions", name: "Functions / Methods" },
      { id: "io-handling", name: "Input / Output Handling" },
      { id: "strings", name: "Strings & Text Processing" },
      { id: "arrays-collections", name: "Arrays & Collections" },
      { id: "oop", name: "Object-Oriented Programming (OOP)" },
      { id: "memory-mgmt", name: "Memory Management Concepts" },
      { id: "exception-handling", name: "Exception & Error Handling" },
      { id: "modules-packages", name: "Modules, Packages & Libraries" },
      { id: "advanced-prog", name: "Advanced Programming Concepts" },
      { id: "concurrency-intro", name: "Concurrency & Parallelism (Intro)" },
      { id: "debugging-testing", name: "Debugging, Testing & Optimization" },
      { id: "dev-practices", name: "Software Development Practices" },
    ],
  },
  {
    id: "db",
    name: "Databases",
    abbr: "DB",
    color: "#D97706",
    weightage: 10,
    mcqCount: 1020,
    topics: [
      { id: "intro-db", name: "Introduction to Database Systems" },
      { id: "db-architecture", name: "Database Architecture" },
      { id: "data-models", name: "Data Models" },
      { id: "relational-concepts", name: "Relational Database Concepts" },
      { id: "relational-algebra", name: "Relational Algebra & Calculus" },
      { id: "sql", name: "SQL" },
      { id: "advanced-sql", name: "Advanced SQL" },
      { id: "normalization", name: "Database Design & Normalization" },
      { id: "transactions", name: "Transaction Management" },
      { id: "concurrency-ctrl", name: "Concurrency Control" },
      { id: "recovery", name: "Recovery Management" },
      { id: "indexing", name: "Indexing & File Organization" },
      { id: "query-opt", name: "Query Processing & Optimization" },
      { id: "db-security", name: "Database Security" },
      { id: "distributed-db", name: "Distributed Databases" },
      { id: "nosql", name: "NoSQL & Modern Databases" },
      { id: "data-warehousing", name: "Data Warehousing & Data Mining" },
    ],
  },
  {
    id: "cyber",
    name: "Cyber Security",
    abbr: "SEC",
    color: "#EA580C",
    weightage: 5,
    mcqCount: 960,
    topics: [
      { id: "intro-cyber", name: "Introduction to Cyber Security" },
      { id: "security-fundamentals", name: "Security Fundamentals" },
      { id: "cryptography", name: "Cryptography" },
      { id: "network-sec", name: "Network Security" },
      { id: "os-security", name: "OS Security" },
      { id: "web-sec", name: "Web Security" },
      { id: "malware-attacks", name: "Malware & Attacks" },
      { id: "auth-access", name: "Authentication & Access Control" },
      { id: "secure-dev", name: "Secure Software Development" },
      { id: "wireless-mobile-sec", name: "Wireless & Mobile Security" },
      { id: "cloud-sec", name: "Cloud Security" },
      { id: "digital-forensics", name: "Digital Forensics" },
      { id: "incident-response", name: "Incident Response" },
      { id: "security-monitoring", name: "Security Monitoring" },
      { id: "cyber-laws", name: "Cyber Laws & Ethics" },
      { id: "emerging-trends", name: "Emerging Trends" },
    ],
  },
];


// ===== HELPER FUNCTIONS =====

export function getSubjectById(id: string): Subject | undefined {
  return subjects.find((s) => s.id === id);
}

export function getTopicsForSubject(subjectId: string): Topic[] {
  return getSubjectById(subjectId)?.topics ?? [];
}

export const TOTAL_MCQ_COUNT = 17880;
export const UNI_MCQ_COUNT = 2518;
export const COMBINED_MCQ_COUNT = TOTAL_MCQ_COUNT + UNI_MCQ_COUNT;
