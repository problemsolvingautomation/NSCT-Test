import Link from "next/link";
import { subjects, COMBINED_MCQ_COUNT } from "@/lib/mock-data";

export default function Footer() {
  return (
    <footer className="border-t border-edge bg-surface theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main footer content */}
        <div className="py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src="/NSCTPrep-Logo.png"
                alt="NSCT Prep Logo"
                width={30}
                height={30}
                className="shrink-0 rounded-lg"
              />
              <span className="font-bold text-ink text-lg">NSCT Prep</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Free NSCT test preparation platform for CS students in Pakistan. Practice {COMBINED_MCQ_COUNT.toLocaleString()}+ verified MCQs across all subjects.
            </p>
          </div>

          {/* Subjects — internal links for SEO crawlability */}
          <div>
            <h4 className="font-semibold text-ink text-sm mb-3">Subjects</h4>
            <ul className="space-y-1.5 text-sm">
              {subjects.slice(0, 6).map((subject) => (
                <li key={subject.id}>
                  <Link
                    href={`/quiz/configure?subject=${subject.id}`}
                    className="text-muted hover:text-primary transition-colors"
                  >
                    {subject.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Subjects + Quick Links */}
          <div>
            <h4 className="font-semibold text-ink text-sm mb-3">More Subjects</h4>
            <ul className="space-y-1.5 text-sm">
              {subjects.slice(6).map((subject) => (
                <li key={subject.id}>
                  <Link
                    href={`/quiz/configure?subject=${subject.id}`}
                    className="text-muted hover:text-primary transition-colors"
                  >
                    {subject.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href="/" className="text-muted hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/subjects" className="text-muted hover:text-primary transition-colors">
                  Browse All Subjects
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted hover:text-primary transition-colors">
                  About Developer
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer & Connect */}
          <div>
            <h4 className="font-semibold text-ink text-sm mb-3">Developer</h4>
            <p className="text-sm text-muted leading-relaxed mb-3">
               A full-stack developer helping Pakistani CS students ace the NSCT exam.
            </p>
            <p className="text-xs text-muted mb-3">Follow &amp; connect</p>
            <div className="grid grid-cols-3 gap-1.5">
              <a href="https://www.abdullahawais.me" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-page border border-edge hover:border-primary/30 hover:bg-primary-light transition-colors" aria-label="Portfolio">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-primary transition-colors shrink-0" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span className="text-[11px] font-medium text-muted group-hover:text-primary transition-colors truncate">Portfolio</span>
              </a>
              <a href="https://www.linkedin.com/in/m-abdullah-awais-programmer" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-page border border-edge hover:border-primary/30 hover:bg-primary-light transition-colors" aria-label="LinkedIn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-muted group-hover:text-primary transition-colors shrink-0" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="text-[11px] font-medium text-muted group-hover:text-primary transition-colors truncate">LinkedIn</span>
              </a>
              <a href="https://github.com/m-abdullah-awais" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-page border border-edge hover:border-primary/30 hover:bg-primary-light transition-colors" aria-label="GitHub">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-muted group-hover:text-primary transition-colors shrink-0" aria-hidden="true">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span className="text-[11px] font-medium text-muted group-hover:text-primary transition-colors truncate">GitHub</span>
              </a>
              <a href="https://www.youtube.com/@m_abdullah_awais" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-page border border-edge hover:border-primary/30 hover:bg-primary-light transition-colors" aria-label="YouTube">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-muted group-hover:text-primary transition-colors shrink-0" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span className="text-[11px] font-medium text-muted group-hover:text-primary transition-colors truncate">YouTube</span>
              </a>
              <a href="https://www.upwork.com/freelancers/~01b48456a3c0c4bd1b" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-page border border-edge hover:border-primary/30 hover:bg-primary-light transition-colors" aria-label="Upwork">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-muted group-hover:text-primary transition-colors shrink-0" aria-hidden="true">
                  <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
                </svg>
                <span className="text-[11px] font-medium text-muted group-hover:text-primary transition-colors truncate">Upwork</span>
              </a>
              <a href="https://www.fiverr.com/m_abdullah_tech" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-page border border-edge hover:border-primary/30 hover:bg-primary-light transition-colors" aria-label="Fiverr">
                <span className="text-[9px] font-black text-muted group-hover:text-primary transition-colors shrink-0 leading-none" aria-hidden="true">fiverr</span>
                <span className="text-[11px] font-medium text-muted group-hover:text-primary transition-colors truncate">Fiverr</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-edge py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <span>
            &copy; 2026 NSCT Prep. All rights reserved.
          </span>
          <span>
            Designed & Developed by{" "}
            <a
              href="https://abdullahawais.me"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-primary-hover transition-colors"
            >
              Muhammad Abdullah Awais
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
