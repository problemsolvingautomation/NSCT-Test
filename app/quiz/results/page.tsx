import type { Metadata } from "next";
import ResultsClient from "./results-client";

export const metadata: Metadata = {
  title: "Quiz Results",
  description: "Review your NSCT quiz results. See your score, correct answers, and detailed explanations for every question.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResultsPage() {
  return <ResultsClient />;
}
