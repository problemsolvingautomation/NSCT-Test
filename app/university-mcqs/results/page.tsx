import type { Metadata } from "next";
import UniResultsClient from "./results-client";

export const metadata: Metadata = {
  title: "University MCQs - Results",
  description: "Review your university MCQ practice results.",
  robots: { index: false, follow: false },
};

export default function UniResultsPage() {
  return <UniResultsClient />;
}
