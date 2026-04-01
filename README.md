<div align="center">

# NSCT Prep

### Free NSCT Test Preparation Platform for Pakistani CS Students

[![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.1-47A248?logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**11,458+ MCQs** across **10 subjects** and **140+ topics** — completely free.

[Live Demo](https://nsctprep.com) &nbsp;&middot;&nbsp; [Report Bug](https://github.com/m-abdullah-awais/NSCT-Quiz-App/issues) &nbsp;&middot;&nbsp; [Request Feature](https://github.com/m-abdullah-awais/NSCT-Quiz-App/issues)

</div>

---

## The Problem

Thousands of Computer Science students across Pakistan prepare for the **National Skills Certification Test (NSCT)** every year. Yet they face a common set of challenges:

- **No centralized platform** — Study material is scattered across PDFs, WhatsApp groups, and random websites
- **Low-quality MCQs** — Most available questions lack explanations, have incorrect answers, or are poorly structured
- **No practice environment** — Students can't simulate the real exam experience with timed tests
- **Expensive alternatives** — Paid coaching and test series are out of reach for many students
- **No university-sourced content** — Real exam-style questions from universities are shared informally and get lost

## The Solution

**NSCT Prep** is a free, open-source platform that solves all of these problems:

- **11,458+ verified MCQs** — 8,940 curated practice questions + 2,518 university-shared MCQs
- **10 core CS subjects** with 140+ granular topics covering the entire NSCT syllabus
- **3 difficulty levels** (Easy, Medium, Hard) for progressive learning
- **Flexible quiz modes** — Per-question timer (20s), total time countdown, or unlimited practice
- **Instant & end-of-quiz feedback** with detailed explanations for every question
- **University MCQ module** — 2,500+ real exam questions from universities, organized in structured sets of 30
- **Beautiful, responsive UI** with dark/light themes and multiple color palettes
- **SEO-optimized blog** with 12 expert articles on exam strategies and career guidance
- **100% free** — No ads-gated content, no premium tier, no registration required

---

## Features

### Quiz System
- Topic-wise and subject-wise MCQ practice
- Configurable quiz sessions (topic, difficulty, count, timer, review mode)
- Instant review mode — see correct answer immediately after selecting
- End-of-quiz review — see all answers and explanations after submitting
- Question navigator with color-coded progress dots
- Keyboard shortcuts (A/B/C/D to select, Enter to advance, Arrow keys to navigate)
- Quiz progress sidebar with live stats

### University MCQs Module
- **2,518 MCQs** sourced from university exam papers across 9 subjects
- Fixed sets of 30 questions — never loads more than 30 at a time
- Auto-generated range-based selection (MCQs 1–30, 31–60, etc.)
- Same quiz experience as the main platform (timer, review modes, sidebar)
- "Practice Only" badge for questions without verified correct answers

### User Experience
- Responsive design — works on desktop, tablet, and mobile
- Theme support — Light/Dark mode with 6+ color palettes
- Leave quiz confirmation with progress summary
- Tab close/refresh protection during active quizzes
- Mobile bottom navigation bar
- Google AdSense integration

### Content & SEO
- 12 expert blog articles on exam preparation
- JSON-LD structured data for rich search results
- OpenGraph and Twitter Card meta tags
- Auto-generated sitemap and robots.txt
- FAQ schema for Google featured snippets

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.2.0 |
| **UI Library** | React | 19.2.4 |
| **Language** | TypeScript | 5 |
| **Styling** | Tailwind CSS | 4 |
| **Database** | MongoDB (Atlas) | 7.1 |
| **Content** | Markdown + gray-matter + marked | — |
| **Deployment** | Vercel | — |

---

## Dataset

### System MCQs (8,940 questions)

Curated across 10 NSCT syllabus subjects:

| Subject | MCQs | Topics | Weightage |
|---------|------|--------|-----------|
| Problem Solving & Analytical Skills | 960 | 16 | 20% |
| AI / Machine Learning & Data Analytics | 1,020 | 17 | 10% |
| Computer Networks & Cloud Computing | 600 | 10 | 10% |
| Data Structures & Algorithms | 720 | 12 | 10% |
| Operating Systems | 720 | 12 | 5% |
| Web Development | 1,020 | 17 | 10% |
| Software Engineering | 960 | 16 | 10% |
| Programming | 960 | 16 | 10% |
| Databases | 1,020 | 17 | 10% |
| Cyber Security | 960 | 16 | 5% |

Every question includes:
- 4 options (A–D) with balanced wording
- Verified correct answer
- Detailed explanation
- Difficulty classification (Easy / Medium / Hard)
- Topic and subtopic tags

### University MCQs (2,518 questions)

Sourced from university exam papers, parsed from raw text data:

| Subject | MCQs | Answers Available |
|---------|------|-------------------|
| Computer Networks & Cloud Computing | 337 | 337 verified |
| Operating Systems | 300 | 300 verified |
| Software Engineering | 300 | 300 verified |
| Web Development | 327 | 327 verified |
| AI / Machine Learning & Data Analytics | 300 | 300 verified |
| Cyber Security | 55 | 55 verified |
| Databases | 300 | 300 verified |
| Problem Solving & Analytical Skills | 300 | 300 verified |
| Programming (C++, Java, Python) | 299 | 299 verified |

All questions have verified answers and explanations.

---

## Project Structure

```
NSCT-Quiz-App/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage
│   ├── quiz/
│   │   ├── configure/            # Quiz configuration page
│   │   ├── play/                 # Quiz play page
│   │   └── results/              # Quiz results page
│   ├── university-mcqs/
│   │   ├── page.tsx              # University MCQs landing
│   │   ├── play/                 # University quiz play
│   │   └── results/              # University quiz results
│   ├── subjects/                 # Browse all subjects
│   ├── blog/                     # Blog listing & articles
│   ├── about/                    # About page
│   └── api/                      # API routes
│       ├── subjects/             # GET subjects (system/university)
│       ├── mcqs/                 # GET MCQs (quiz/sequential/browse)
│       ├── topics/               # GET topics with counts
│       └── revalidate/           # Cache invalidation
├── components/                   # Shared React components
├── lib/
│   ├── db/
│   │   ├── mongodb.ts            # MongoDB connection pool
│   │   └── queries.ts            # Database query functions
│   ├── mock-data.ts              # Subject definitions & types
│   ├── cache.ts                  # In-memory TTL cache
│   ├── seo.ts                    # SEO constants & keywords
│   └── articles.ts               # Blog article utilities
├── data/
│   ├── mcqs/                     # System MCQ JSON files (10 subjects)
│   ├── mcqs-university/          # Parsed university MCQ JSON files
│   ├── mcqs-from-uni/            # Raw university data (data.txt)
│   └── university-mcqs-all.json  # Combined university MCQs
├── content/articles/             # Markdown blog articles
├── scripts/
│   ├── seed-mongodb.ts           # Database seeding script
│   └── parse-university-data.ts  # University data parser
└── public/                       # Static assets
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/m-abdullah-awais/NSCT-Quiz-App.git
   cd NSCT-Quiz-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your MongoDB connection string:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nsct
   REVALIDATE_SECRET=your-secret-key
   ```

4. **Parse university data** (generates JSON files from raw text)
   ```bash
   npx tsx scripts/parse-university-data.ts
   ```

5. **Seed the database**
   ```bash
   npx tsx scripts/seed-mongodb.ts
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/subjects` | GET | Fetch all subjects. `?source=university` for university subjects |
| `/api/topics?subjectId=X` | GET | Fetch topics with question counts for a subject |
| `/api/mcqs?mode=quiz` | GET | Fetch random MCQs for quiz mode |
| `/api/mcqs?mode=sequential` | GET | Fetch ordered MCQs with `skip` and `count` params |
| `/api/mcqs?mode=browse` | GET | Fetch paginated MCQs with search support |
| `/api/mcqs/count` | GET | Count MCQs with optional filters |
| `/api/mcqs/[id]` | GET | Fetch a single MCQ by ID |
| `/api/revalidate` | POST | Invalidate cache by tag (requires secret) |

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx tsx scripts/seed-mongodb.ts` | Seed database with all MCQs |
| `npx tsx scripts/parse-university-data.ts` | Parse raw university data into JSON |

---

## Developer

<div align="center">

**Muhammad Abdullah Awais**

Full-stack developer helping Pakistani CS students ace the NSCT exam.

[![Portfolio](https://img.shields.io/badge/Portfolio-abdullahawais.me-000?style=for-the-badge&logo=vercel)](https://abdullahawais.me)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/m-abdullah-awais-programmer)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/m-abdullah-awais)
[![YouTube](https://img.shields.io/badge/YouTube-Subscribe-FF0000?style=for-the-badge&logo=youtube)](https://www.youtube.com/@m_abdullah_awais)
[![Upwork](https://img.shields.io/badge/Upwork-Hire_Me-6FDA44?style=for-the-badge&logo=upwork)](https://www.upwork.com/freelancers/~01b48456a3c0c4bd1b)
[![Fiverr](https://img.shields.io/badge/Fiverr-Hire_Me-1DBF73?style=for-the-badge&logo=fiverr)](https://www.fiverr.com/m_abdullah_tech)

</div>

---

## Contributing

Contributions are welcome! If you'd like to add MCQs, fix bugs, or improve the platform:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with passion for Pakistani CS students**

If this project helped you, consider giving it a star on GitHub.

</div>
