import { Suspense } from "react";
import type { Metadata } from "next";
import { subjects, COMBINED_MCQ_COUNT } from "@/lib/mock-data";
import { SITE_URL, SITE_NAME, SUBJECT_SEO } from "@/lib/seo";
import { BreadcrumbJsonLd, QuizSubjectJsonLd } from "@/components/JsonLd";
import ConfigureClient from "./configure-client";

type Props = {
  searchParams: Promise<{ subject?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { subject: subjectId } = await searchParams;
  const seo = subjectId ? SUBJECT_SEO[subjectId] : null;
  const subjectData = subjectId ? subjects.find((s) => s.id === subjectId) : null;

  if (!seo || !subjectData) {
    return {
      title: "Configure Quiz",
      description: `Set up your NSCT practice quiz. Choose from ${subjects.length} subjects, 140+ topics, and 3 difficulty levels.`,
    };
  }

  return {
    title: `${seo.title} — NSCT Practice Quiz`,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: `${seo.title} — NSCT Practice Quiz`,
      description: seo.description,
      url: `${SITE_URL}/quiz/configure?subject=${subjectId}`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.title} — NSCT Practice Quiz`,
      description: seo.description,
    },
    alternates: {
      canonical: `${SITE_URL}/quiz/configure?subject=${subjectId}`,
    },
  };
}

async function ConfigureJsonLd({ searchParams }: Props) {
  const { subject: subjectId } = await searchParams;

  if (!subjectId) return null;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: subjects.find((s) => s.id === subjectId)?.name || "Subject", url: `${SITE_URL}/quiz/configure?subject=${subjectId}` },
        ]}
      />
      <QuizSubjectJsonLd subjectId={subjectId} />
    </>
  );
}

export default function ConfigurePage({ searchParams }: Props) {
  return (
    <>
      <Suspense>
        <ConfigureJsonLd searchParams={searchParams} />
      </Suspense>
      <ConfigureClient />
    </>
  );
}
