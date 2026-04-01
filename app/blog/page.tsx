import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Blog — NSCT Preparation Tips & Study Guides",
  description:
    "Read expert articles on NSCT exam preparation, study strategies, MCQ tips, time management, and career guidance for CS students in Pakistan.",
  keywords: [
    "NSCT blog",
    "NSCT study tips",
    "exam preparation articles",
    "NSCT guide",
    "CS student blog Pakistan",
  ],
  openGraph: {
    title: "Blog — NSCT Preparation Tips & Study Guides",
    description:
      "Read expert articles on NSCT exam preparation, study strategies, MCQ tips, time management, and career guidance.",
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
        ]}
      />

      <div className="flex gap-6 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <main className="flex-1 min-w-0">
          {/* Header */}
          <section className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink leading-tight">
              NSCT Prep{" "}
              <span className="text-primary">Blog</span>
            </h1>
            <p className="mt-3 text-base text-muted max-w-xl leading-relaxed">
              Expert articles on exam preparation, study strategies, and career
              guidance to help you ace the NSCT test.
            </p>
          </section>

          {/* Articles Grid */}
          <section aria-labelledby="articles-heading">
            <h2 id="articles-heading" className="sr-only">
              All Articles
            </h2>
            <div className="grid gap-4 sm:gap-5">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group block no-underline"
                >
                  <article className="bg-surface border border-edge rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 theme-transition">
                    <h3 className="font-semibold text-lg text-ink group-hover:text-primary transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-2">
                      {article.meta_description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {article.keywords.slice(0, 3).map((kw) => (
                        <span
                          key={kw}
                          className="text-xs px-2.5 py-1 bg-primary-light text-primary rounded-full"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>

          {/* Bottom ad — mobile only (desktop uses sidebar) */}
          <div className="mt-8 lg:hidden">
            <AdBanner size="banner" />
          </div>
        </main>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-75 shrink-0">
          <div className="sticky top-20 space-y-6">
            <AdBanner size="sidebar" />
          </div>
        </aside>
      </div>
      <Footer />
    </>
  );
}
