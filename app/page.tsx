import Link from "next/link";
import { subjects, TOTAL_MCQ_COUNT, UNI_MCQ_COUNT, COMBINED_MCQ_COUNT } from "@/lib/mock-data";
// TOTAL_MCQ_COUNT = system MCQs, UNI_MCQ_COUNT = university MCQs, COMBINED = both
import { SITE_URL, FAQ_ITEMS } from "@/lib/seo";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import ScrollToSubjects from "@/components/ScrollToSubjects";
import TypingText from "@/components/TypingText";
import { OrganizationJsonLd, WebSiteJsonLd, FAQJsonLd, HomePageJsonLd } from "@/components/JsonLd";

const TYPING_PHRASES = [
  "Problem Solving & Analytical Skills",
  "Programming",
  "Computer Networks & Cloud Computing",
  "Data Structures & Algorithms",
  "Databases",
  "Web Development",
  "AI / Machine Learning & Data Analytics",
  "Software Engineering",
  "Operating Systems",
  "Cyber Security",
];

export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <FAQJsonLd />
      <HomePageJsonLd />

      <div className="flex gap-6 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Hero */}
          <section className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink leading-tight">
              Master Your{" "}
              <span className="text-primary">NSCT Test</span>
            </h1>

            {/* Typing animation line */}
            <p className="mt-3 text-lg sm:text-xl text-ink/80 min-h-14 sm:min-h-8">
              Practice{" "}
              <TypingText
                phrases={TYPING_PHRASES}
                typeSpeed={70}
                deleteSpeed={35}
                pauseDuration={1800}
                className="text-primary font-semibold"
              />
            </p>

            <p className="mt-3 text-base text-muted max-w-xl leading-relaxed">
              {COMBINED_MCQ_COUNT.toLocaleString()}+ MCQs — {TOTAL_MCQ_COUNT.toLocaleString()} practice questions across {subjects.length} subjects + {UNI_MCQ_COUNT.toLocaleString()} university-shared MCQs.
            </p>

            {/* Adding more notice */}
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-primary bg-primary-light px-3 py-1.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              New MCQs are being added regularly
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ScrollToSubjects />
              <span className="text-sm text-muted">
                {subjects.length} {" "} subjects &middot; 140+ topics &middot; 3 difficulty levels
              </span>
            </div>
          </section>

          {/* Subject Grid */}
          <section id="subjects" aria-labelledby="subjects-heading">
            <h2 id="subjects-heading" className="text-xl font-semibold text-ink mb-5">
              Choose a Subject
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {subjects.map((subject) => (
                <Link
                  key={subject.id}
                  href={`/quiz/configure?subject=${subject.id}`}
                  className="group block no-underline"
                  title={`Practice ${subject.name} MCQs for NSCT`}
                >
                  <article className="bg-surface border border-edge rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 theme-transition h-full flex flex-col items-center text-center">
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 mb-3"
                      style={{ backgroundColor: subject.color }}
                      aria-hidden="true"
                    >
                      {subject.abbr}
                    </div>
                    <h3 className="font-semibold text-sm text-ink group-hover:text-primary transition-colors leading-snug mb-1.5 line-clamp-2 min-h-10">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-muted">
                      {subject.mcqCount.toLocaleString()} MCQs
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          </section>

          {/* University MCQs Banner */}
          <section className="mt-10">
            <Link
              href="/university-mcqs"
              className="block no-underline group"
            >
              <div className="bg-surface border-[1.5px] border-primary/30 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 theme-transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-ink group-hover:text-primary transition-colors">
                      MCQs Shared by Our University
                    </h3>
                    <p className="text-sm text-muted mt-0.5">
                      2,500+ MCQs across 9 subjects &mdash; practice with real university questions
                    </p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-primary transition-colors shrink-0 hidden sm:block" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </Link>
          </section>

          {/* FAQ Section — SEO-optimized for featured snippets */}
          <section className="mt-12" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-xl font-semibold text-ink mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, index) => (
                <details
                  key={index}
                  className="bg-surface border border-edge rounded-xl shadow-sm theme-transition group"
                >
                  <summary className="px-5 py-4 cursor-pointer text-[15px] font-medium text-ink hover:text-primary transition-colors list-none flex items-center justify-between gap-3">
                    {faq.question}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 text-muted group-open:rotate-180 transition-transform"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-muted leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Internal Links — improves crawlability */}
          <section className="mt-10 mb-4" aria-labelledby="popular-topics-heading">
            <h2 id="popular-topics-heading" className="text-lg font-semibold text-ink mb-4">
              Popular NSCT Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {subjects.slice(0, 6).flatMap((subject) =>
                subject.topics.slice(0, 2).map((topic) => (
                  <Link
                    key={`${subject.id}-${topic.id}`}
                    href={`/quiz/configure?subject=${subject.id}`}
                    className="text-xs px-3 py-1.5 bg-surface border border-edge rounded-full text-muted hover:text-primary hover:border-primary/30 transition-colors"
                  >
                    {topic.name}
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Bottom ad — mobile only (desktop uses sidebar) */}
          <div className="mt-6 lg:hidden">
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
                <div className="flex justify-between">
                  <span className="text-muted">Status</span>
                  <span className="font-medium text-primary text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-correct" />
                    Adding more
                  </span>
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
