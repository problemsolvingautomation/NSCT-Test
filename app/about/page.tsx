import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME, DEVELOPER_NAME, DEVELOPER_URL } from "@/lib/seo";
import { COMBINED_MCQ_COUNT, subjects } from "@/lib/mock-data";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "About the Developer — Muhammad Abdullah Awais",
  description:
    "Meet Muhammad Abdullah Awais, the developer behind NSCT Prep. Full-stack developer passionate about building modern web solutions for students.",
  openGraph: {
    title: "About the Developer — Muhammad Abdullah Awais",
    description:
      "Meet the developer behind NSCT Prep — a free platform helping Pakistani CS students prepare for the NSCT exam.",
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    type: "profile",
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

const SKILLS = [
  { label: "Next.js", category: "frontend" },
  { label: "React", category: "frontend" },
  { label: "TypeScript", category: "frontend" },
  { label: "Tailwind CSS", category: "frontend" },
  { label: "Node.js", category: "backend" },
  { label: "MongoDB", category: "backend" },
  { label: "REST APIs", category: "backend" },
  { label: "Git & GitHub", category: "tools" },
  { label: "UI/UX Design", category: "design" },
  { label: "SEO", category: "other" },
  { label: "Responsive Design", category: "design" },
  { label: "Performance Optimization", category: "other" },
] as const;

const SOCIAL_LINKS = [
  {
    label: "Portfolio",
    href: "https://www.abdullahawais.me",
    description: "View my work and projects",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/m-abdullah-awais-programmer",
    description: "Connect professionally",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/m-abdullah-awais",
    description: "Browse my repositories",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@m_abdullah_awais",
    description: "Watch tutorials & content",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Upwork",
    href: "https://www.upwork.com/freelancers/~01b48456a3c0c4bd1b",
    description: "Hire me on Upwork",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
      </svg>
    ),
  },
  {
    label: "Fiverr",
    href: "https://www.fiverr.com/m_abdullah_tech",
    description: "Hire me on Fiverr",
    icon: <span className="text-xs font-black leading-none tracking-tight">fiverr</span>,
  },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
        ]}
      />

      {/* Person JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: DEVELOPER_NAME,
            url: DEVELOPER_URL,
            jobTitle: "Full Stack Developer",
            sameAs: SOCIAL_LINKS.map((l) => l.href),
          }),
        }}
      />

      <div className="flex gap-6 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <main className="flex-1 min-w-0">

          {/* Hero */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="text-muted hover:text-primary transition-colors text-sm">Home</Link>
              <span className="text-muted text-sm" aria-hidden="true">/</span>
              <span className="text-ink text-sm font-medium">About</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink leading-tight">
              About the{" "}
              <span className="text-primary">Developer</span>
            </h1>
            <p className="mt-3 text-base text-muted max-w-xl leading-relaxed">
              Building modern web solutions to help students succeed.
            </p>
          </section>

          {/* Intro Card */}
          <section className="mb-8">
            <div className="bg-surface border border-edge rounded-xl p-6 sm:p-8 shadow-sm theme-transition">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-on-primary text-2xl font-bold shrink-0">
                  MAA
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-ink">{DEVELOPER_NAME}</h2>
                  <p className="text-sm font-medium text-primary mt-0.5">Full Stack Developer</p>
                  <p className="mt-3 text-sm text-muted leading-relaxed">
                    I am a passionate full-stack developer from Pakistan, specializing in building performant,
                    accessible, and visually polished web applications. I enjoy turning ideas into real products
                    that solve problems and create value for users.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Mission */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Why I Built NSCT Prep
            </h2>
            <div className="bg-surface border border-edge rounded-xl shadow-sm theme-transition overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">The Problem</h3>
                    <p className="text-sm text-muted leading-relaxed mt-1">
                      CS students in Pakistan preparing for the NSCT exam lacked a free, organized, and
                      high-quality platform to practice MCQs across all syllabus topics.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">The Solution</h3>
                    <p className="text-sm text-muted leading-relaxed mt-1">
                      NSCT Prep provides {COMBINED_MCQ_COUNT.toLocaleString()}+ verified MCQs across {subjects.length} subjects
                      with topic filtering, difficulty levels, instant feedback, and detailed explanations — all completely free.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">The Goal</h3>
                    <p className="text-sm text-muted leading-relaxed mt-1">
                      To become the go-to free resource for NSCT preparation, helping thousands of students
                      practice smarter and pass with confidence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
              </svg>
              Skills & Technologies
            </h2>
            <div className="bg-surface border border-edge rounded-xl p-5 sm:p-6 shadow-sm theme-transition">
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <span
                    key={skill.label}
                    className="px-3 py-1.5 text-sm font-medium bg-primary-light text-primary rounded-lg border border-primary/10 theme-transition"
                  >
                    {skill.label}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
              </svg>
              Connect with Me
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3.5 bg-surface border border-edge rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all theme-transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors" aria-hidden="true">
                    {link.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-ink group-hover:text-primary transition-colors">
                      {link.label}
                    </div>
                    <div className="text-xs text-muted truncate">
                      {link.description}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted group-hover:text-primary transition-colors" aria-hidden="true">
                    <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                  </svg>
                </a>
              ))}
            </div>
          </section>

          {/* Contact CTA */}
          <section className="mb-4">
            <div className="bg-primary-light border border-primary/10 rounded-xl p-6 sm:p-8 text-center theme-transition">
              <h2 className="text-lg font-semibold text-ink mb-2">
                Want to collaborate or report an issue?
              </h2>
              <p className="text-sm text-muted leading-relaxed max-w-md mx-auto mb-5">
                If you find any bugs, have feature suggestions, or want to work together on a project,
                feel free to reach out through my portfolio.
              </p>
              <a
                href={DEVELOPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-hover transition-colors active:scale-[0.97]"
              >
                Visit My Portfolio
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                </svg>
              </a>
            </div>
          </section>

          {/* Bottom ad — mobile only */}
          <div className="mt-8 lg:hidden">
            <AdBanner size="banner" />
          </div>
        </main>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-75 shrink-0">
          <div className="sticky top-20 space-y-6">
            {/* Quick card */}
            <div className="bg-surface border border-edge rounded-xl p-5 shadow-sm theme-transition">
              <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-on-primary text-xl font-bold mb-3">
                MAA
              </div>
              <h3 className="font-semibold text-ink text-sm">{DEVELOPER_NAME}</h3>
              <p className="text-xs text-muted mt-1">Full Stack Developer</p>
              <div className="mt-3 pt-3 border-t border-edge space-y-2 text-sm">
                <a
                  href={DEVELOPER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors font-medium"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Portfolio
                </a>
                <a
                  href="https://github.com/m-abdullah-awais"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  Github
                </a>
                <a
                  href="https://www.linkedin.com/in/m-abdullah-awais-programmer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
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
