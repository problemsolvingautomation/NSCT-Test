import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, DEVELOPER_NAME, DEVELOPER_URL, FAQ_ITEMS } from "@/lib/seo";
import { subjects, COMBINED_MCQ_COUNT } from "@/lib/mock-data";

// ===== Organization Schema =====
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/NSCTPrep-Logo.png`,
    description: SITE_DESCRIPTION,
    founder: {
      "@type": "Person",
      name: DEVELOPER_NAME,
      url: DEVELOPER_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ===== WebSite Schema (enables sitelinks search box) =====
export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ===== FAQ Schema =====
export function FAQJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ===== Breadcrumb Schema =====
export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ===== Course/Quiz Schema (for subject pages) =====
export function QuizSubjectJsonLd({ subjectId }: { subjectId: string }) {
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `NSCT ${subject.name} Practice`,
    description: `Practice ${subject.mcqCount}+ MCQs on ${subject.name} for the NSCT test. Covers ${subject.topics.length} topics across 3 difficulty levels.`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    isAccessibleForFree: true,
    numberOfCredits: 0,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `${subject.mcqCount}+ practice questions`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ===== EducationalOrganization + ItemList for home page =====
export function HomePageJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NSCT Test Subjects",
    description: `Practice ${COMBINED_MCQ_COUNT.toLocaleString()}+ MCQs across ${subjects.length} CS subjects for the NSCT test`,
    numberOfItems: subjects.length,
    itemListElement: subjects.map((subject, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: subject.name,
      url: `${SITE_URL}/quiz/configure?subject=${subject.id}`,
      description: `${subject.mcqCount}+ MCQs across ${subject.topics.length} topics`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
