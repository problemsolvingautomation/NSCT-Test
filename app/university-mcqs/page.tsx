import type { Metadata } from "next";
import UniversityClient from "./university-client";

export const metadata: Metadata = {
  title: "MCQs Shared by Our University | NSCT Quiz",
  description: "Practice MCQs shared by our university. Select a subject, choose how many questions, and start practicing.",
};

export default function UniversityMcqsPage() {
  return <UniversityClient />;
}
