import type { Metadata } from "next";
import Link from "next/link";
import { subjects, COMBINED_MCQ_COUNT, TOTAL_MCQ_COUNT } from "@/lib/mock-data";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import PdfDownloadSection from "./PdfDownloadSection";

export const metadata: Metadata = {
  title: "All NSCT Subjects — Browse Topics & Practice MCQs",
  description: `Explore all ${subjects.length} NSCT subjects with ${COMBINED_MCQ_COUNT.toLocaleString()}+ practice MCQs. Browse topics in Programming, DSA, Databases, AI/ML, Networking, and more.`,
  keywords: [
    "NSCT subjects",
    "NSCT syllabus topics",
    "NSCT MCQ subjects",
    "computer science subjects NSCT",
    "NSCT practice topics",
  ],
  openGraph: {
    title: "All NSCT Subjects — Browse Topics & Practice MCQs",
    description: `Explore all ${subjects.length} NSCT subjects with ${COMBINED_MCQ_COUNT.toLocaleString()}+ practice MCQs across 140+ topics.`,
    url: `${SITE_URL}/subjects`,
    siteName: SITE_NAME,
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/subjects`,
  },
};

export default function SubjectsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Subjects", url: `${SITE_URL}/subjects` },
        ]}
      />

      <div className="flex gap-6 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <main className="flex-1 min-w-0">
          {/* Header */}
          <section className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink leading-tight">
              NSCT{" "}
              <span className="text-primary">Subjects</span>
            </h1>
            <p className="mt-3 text-base text-muted max-w-xl leading-relaxed">
              {subjects.length} subjects &middot; 140+ topics &middot;{" "}
              {COMBINED_MCQ_COUNT.toLocaleString()}+ verified MCQs. Choose a subject
              to start practicing.
            </p>

            {/* Quick stats */}
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-surface border border-edge rounded-lg text-sm theme-transition">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted">Total MCQs:</span>
                <span className="font-semibold text-ink">
                  {COMBINED_MCQ_COUNT.toLocaleString()}+
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-surface border border-edge rounded-lg text-sm theme-transition">
                <span className="w-2 h-2 rounded-full bg-correct" />
                <span className="text-muted">Difficulty Levels:</span>
                <span className="font-semibold text-ink">3</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-surface border border-edge rounded-lg text-sm theme-transition">
                <span className="w-2 h-2 rounded-full bg-warning" />
                <span className="text-muted">Status:</span>
                <span className="font-semibold text-primary">Adding more</span>
              </div>
            </div>
          </section>

          {/* Download MCQ PDFs */}
          <PdfDownloadSection />

          {/* All subjects */}
          <section className="space-y-5" aria-label="Subjects list">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </section>

          {/* Bottom ad — mobile only (desktop uses sidebar) */}
          <div className="mt-8 lg:hidden">
            <AdBanner size="banner" />
          </div>
        </main>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-75 shrink-0">
          <div className="sticky top-20 space-y-6">
            <div className="bg-surface border border-edge rounded-xl p-5 shadow-sm theme-transition">
              <h3 className="font-semibold text-ink text-sm mb-3">Quick Stats</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Total MCQs</span>
                  <span className="font-medium text-ink">{COMBINED_MCQ_COUNT.toLocaleString()}+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Subjects</span>
                  <span className="font-medium text-ink">{subjects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Difficulty Levels</span>
                  <span className="font-medium text-ink">3</span>
                </div>
              </div>
            </div>
            <AdBanner size="sidebar" />
          </div>
        </aside>
      </div>
      <Footer />
    </>
  );
}

function SubjectCard({
  subject,
}: {
  subject: (typeof subjects)[number];
}) {
  return (
    <Link
      href={`/quiz/configure?subject=${subject.id}`}
      className="group block no-underline"
      title={`Practice ${subject.name} MCQs for NSCT`}
    >
      <article className="bg-surface border border-edge rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 theme-transition overflow-hidden">
        {/* Subject header */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ backgroundColor: subject.color }}
              aria-hidden="true"
            >
              {subject.abbr}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg text-ink group-hover:text-primary transition-colors leading-snug">
                {subject.name}
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted">
                <span>{subject.mcqCount.toLocaleString()} MCQs</span>
                <span className="hidden sm:inline" aria-hidden="true">
                  &middot;
                </span>
                <span className="hidden sm:inline">
                  {subject.topics.length} topics
                </span>
                <span className="hidden sm:inline" aria-hidden="true">
                  &middot;
                </span>
                <span className="hidden sm:inline">
                  Weightage: {subject.weightage}%
                </span>
              </div>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-muted group-hover:text-primary transition-colors hidden sm:block"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>

          {/* Topic chips */}
          <div className="flex flex-wrap gap-1.5">
            {subject.topics.slice(0, 6).map((topic) => (
              <span
                key={topic.id}
                className="text-xs px-2.5 py-1 bg-page border border-edge rounded-full text-muted"
              >
                {topic.name}
              </span>
            ))}
            {subject.topics.length > 6 && (
              <span className="text-xs px-2.5 py-1 bg-primary-light text-primary rounded-full font-medium">
                +{subject.topics.length - 6} more
              </span>
            )}
          </div>
        </div>

        {/* Mobile-visible meta bar */}
        <div className="border-t border-edge px-5 py-3 flex items-center justify-between bg-page/50 sm:hidden">
          <span className="text-xs text-muted">
            {subject.topics.length} topics &middot; Weightage:{" "}
            {subject.weightage}%
          </span>
          <span className="text-xs font-medium text-primary flex items-center gap-1">
            Practice
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}
