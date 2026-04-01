import fs from "fs";
import path from "path";
import matter from "gray-matter";

const articlesDirectory = path.join(process.cwd(), "content", "articles");

export interface ArticleMeta {
  title: string;
  meta_title: string;
  meta_description: string;
  slug: string;
  keywords: string[];
  internal_links: { title: string; url: string }[];
  external_links: { title: string; url: string }[];
}

export interface Article extends ArticleMeta {
  content: string;
}

/** Return metadata for all articles, sorted by filename (numeric prefix). */
export function getAllArticles(): ArticleMeta[] {
  const files = fs
    .readdirSync(articlesDirectory)
    .filter((f) => f.endsWith(".md") && !f.startsWith("index"));

  return files.map((filename) => {
    const filePath = path.join(articlesDirectory, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    return data as ArticleMeta;
  });
}

/** Return a single article by slug, including its markdown content body. */
export function getArticleBySlug(slug: string): Article | null {
  const files = fs
    .readdirSync(articlesDirectory)
    .filter((f) => f.endsWith(".md") && !f.startsWith("index"));

  for (const filename of files) {
    const filePath = path.join(articlesDirectory, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    if (data.slug === slug) {
      return { ...(data as ArticleMeta), content };
    }
  }

  return null;
}

/** Return all slugs for static generation. */
export function getAllSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}
