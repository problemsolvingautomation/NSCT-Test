import { subjects, COMBINED_MCQ_COUNT } from "./mock-data";

// ===== SITE CONFIG =====
// Update SITE_URL before deploying to production
export const SITE_URL = "https://nsctprep.com";
export const SITE_NAME = "NSCT Prep";
export const SITE_DESCRIPTION = `Practice ${COMBINED_MCQ_COUNT.toLocaleString()}+ verified MCQs for the NSCT test across ${subjects.length} CS subjects. Filter by topic and difficulty. Free online test preparation for Pakistani CS students.`;
export const DEVELOPER_NAME = "Muhammad Abdullah Awais";
export const DEVELOPER_URL = "https://abdullahawais.me";

// ===== PRIMARY KEYWORDS =====
export const PRIMARY_KEYWORDS = [
  "NSCT test preparation",
  "NSCT MCQs",
  "NSCT practice test",
  "NSCT quiz online",
  "National Science & Computing Test",
];

// ===== SECONDARY KEYWORDS =====
export const SECONDARY_KEYWORDS = [
  "Pakistan CS test",
  "computer science MCQs",
  "NSCT mock test",
  "NSCT exam practice",
  "CS MCQ quiz",
];

// ===== LONG-TAIL KEYWORDS =====
export const LONG_TAIL_KEYWORDS = [
  "NSCT data structures algorithms MCQs",
  "NSCT programming questions with answers",
  "NSCT web development practice test",
  "NSCT AI machine learning quiz",
  "NSCT database MCQs online free",
  "NSCT cyber security practice questions",
  "NSCT operating systems quiz",
  "NSCT software engineering MCQs",
  "NSCT computer networks cloud computing",
  "NSCT problem solving analytical skills",
];

// ===== ALL KEYWORDS (for metadata) =====
export const ALL_KEYWORDS = [
  ...PRIMARY_KEYWORDS,
  ...SECONDARY_KEYWORDS,
  "free MCQ practice",
  "online quiz Pakistan",
  "CS exam preparation",
  "NSCT syllabus topics",
];

// ===== SUBJECT SEO DESCRIPTIONS =====
export const SUBJECT_SEO: Record<string, { title: string; description: string; keywords: string[] }> = {
  "problem-solving": {
    title: "Problem Solving & Analytical Skills",
    description: `Practice ${subjects.find(s => s.id === "problem-solving")?.mcqCount ?? 0}+ MCQs on logical reasoning, critical thinking, and algorithmic problem solving for the NSCT test.`,
    keywords: ["NSCT problem solving MCQs", "analytical skills quiz", "logical reasoning test", "critical thinking questions"],
  },
  "ai-ml": {
    title: "AI / Machine Learning & Data Analytics",
    description: `Practice ${subjects.find(s => s.id === "ai-ml")?.mcqCount ?? 0}+ MCQs on artificial intelligence, machine learning, deep learning, and data analytics for the NSCT test.`,
    keywords: ["NSCT AI MCQs", "machine learning quiz", "data analytics questions", "deep learning test"],
  },
  "cn-cloud": {
    title: "Computer Networks & Cloud Computing",
    description: `Practice ${subjects.find(s => s.id === "cn-cloud")?.mcqCount ?? 0}+ MCQs on networking fundamentals, cloud computing, and network security for the NSCT test.`,
    keywords: ["NSCT networking MCQs", "cloud computing quiz", "computer networks test", "network security questions"],
  },
  "dsa": {
    title: "Data Structures & Algorithms",
    description: `Practice ${subjects.find(s => s.id === "dsa")?.mcqCount ?? 0}+ MCQs on arrays, trees, graphs, sorting, searching, and algorithm design for the NSCT test.`,
    keywords: ["NSCT DSA MCQs", "data structures quiz", "algorithms test", "sorting searching questions"],
  },
  "os": {
    title: "Operating Systems",
    description: `Practice ${subjects.find(s => s.id === "os")?.mcqCount ?? 0}+ MCQs on process management, memory management, file systems, and OS security for the NSCT test.`,
    keywords: ["NSCT operating systems MCQs", "OS quiz", "process management test", "memory management questions"],
  },
  "webdev": {
    title: "Web Development",
    description: `Practice ${subjects.find(s => s.id === "webdev")?.mcqCount ?? 0}+ MCQs on HTML, CSS, JavaScript, React, backend development, and web security for the NSCT test.`,
    keywords: ["NSCT web development MCQs", "HTML CSS JavaScript quiz", "frontend backend test", "web security questions"],
  },
  "se": {
    title: "Software Engineering",
    description: `Practice ${subjects.find(s => s.id === "se")?.mcqCount ?? 0}+ MCQs on software design, testing, agile development, and project management for the NSCT test.`,
    keywords: ["NSCT software engineering MCQs", "agile development quiz", "software testing questions", "project management test"],
  },
  "programming": {
    title: "Programming",
    description: `Practice ${subjects.find(s => s.id === "programming")?.mcqCount ?? 0}+ MCQs on OOP, data types, control structures, functions, and error handling for the NSCT test.`,
    keywords: ["NSCT programming MCQs", "OOP quiz", "programming fundamentals test", "coding questions"],
  },
  "db": {
    title: "Databases",
    description: `Practice ${subjects.find(s => s.id === "db")?.mcqCount ?? 0}+ MCQs on SQL, normalization, transactions, indexing, and NoSQL for the NSCT test.`,
    keywords: ["NSCT database MCQs", "SQL quiz", "normalization test", "NoSQL questions"],
  },
  "cyber": {
    title: "Cyber Security",
    description: `Practice ${subjects.find(s => s.id === "cyber")?.mcqCount ?? 0}+ MCQs on cryptography, network security, malware, digital forensics, and incident response for the NSCT test.`,
    keywords: ["NSCT cyber security MCQs", "cryptography quiz", "network security test", "ethical hacking questions"],
  },
};

// ===== FAQ DATA (for structured data + home page) =====
export const FAQ_ITEMS = [
  {
    question: "What is the NSCT test?",
    answer: "The NSCT (National Science & Computing Test) is a standardized exam for computer science students in Pakistan, covering subjects like Programming, Data Structures, AI/ML, Web Development, Databases, and more.",
  },
  {
    question: "How many MCQs are available on NSCT Prep?",
    answer: `NSCT Prep offers ${COMBINED_MCQ_COUNT.toLocaleString()}+ verified multiple-choice questions across ${subjects.length} subjects and 140+ topics, covering all NSCT syllabus areas.`,
  },
  {
    question: "Is NSCT Prep free to use?",
    answer: "Yes, NSCT Prep is completely free. You can practice unlimited MCQs across all subjects and difficulty levels without any registration or payment.",
  },
  {
    question: "What subjects does NSCT Prep cover?",
    answer: `NSCT Prep covers all ${subjects.length} NSCT subjects: ${subjects.map(s => s.name).join(", ")}.`,
  },
  {
    question: "Can I filter questions by difficulty level?",
    answer: "Yes, you can filter questions by three difficulty levels: Easy (fundamentals & basics), Medium (application & analysis), and Hard (advanced & tricky).",
  },
  {
    question: "How does the quiz scoring work?",
    answer: "After submitting a quiz, you see your score as a percentage along with correct, incorrect, and skipped counts. Each question includes a detailed explanation to help you learn from mistakes.",
  },
];
