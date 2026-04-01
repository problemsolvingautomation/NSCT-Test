import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getArticleBySlug, getAllSlugs } from "@/lib/articles";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: article.meta_title,
    description: article.meta_description,
    keywords: article.keywords,
    openGraph: {
      title: article.meta_title,
      description: article.meta_description,
      url: `${SITE_URL}/blog/${article.slug}`,
      siteName: SITE_NAME,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.meta_title,
      description: article.meta_description,
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const htmlContent = await marked(article.content);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: article.title, url: `${SITE_URL}/blog/${article.slug}` },
        ]}
      />

      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.meta_description,
            url: `${SITE_URL}/blog/${article.slug}`,
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
            },
          }),
        }}
      />

      <div className="flex gap-6 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1.5 text-sm text-muted"
          >
            <Link
              href="/"
              className="hover:text-primary transition-colors"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/blog"
              className="hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink truncate max-w-50 sm:max-w-none">
              {article.title}
            </span>
          </nav>

          {/* Article Content */}
          <article className="bg-surface border border-edge rounded-xl p-5 sm:p-8 shadow-sm theme-transition">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </article>

          {/* Related Links */}
          <aside className="mt-8 grid gap-5 sm:grid-cols-2">
            {/* Internal Links */}
            {article.internal_links.length > 0 && (
              <div className="bg-surface border border-edge rounded-xl p-5 shadow-sm theme-transition">
                <h2 className="font-semibold text-ink text-sm mb-3">
                  Related on NSCT Prep
                </h2>
                <ul className="space-y-2">
                  {article.internal_links.map((link) => (
                    <li key={link.url}>
                      <Link
                        href={link.url}
                        className="text-sm text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-1.5"
                      >
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
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* External Links */}
            {article.external_links.length > 0 && (
              <div className="bg-surface border border-edge rounded-xl p-5 shadow-sm theme-transition">
                <h2 className="font-semibold text-ink text-sm mb-3">
                  Further Reading
                </h2>
                <ul className="space-y-2">
                  {article.external_links.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-1.5"
                      >
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
                          <path d="M7 17L17 7" />
                          <path d="M7 7h10v10" />
                        </svg>
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* Back to blog */}
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              Back to all articles
            </Link>
          </div>

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
