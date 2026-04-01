import type { Metadata } from "next";
import UniPlayClient from "./play-client";

export const metadata: Metadata = {
  title: "University MCQs - Practice",
  description: "Practice university MCQs. Answer questions and see instant feedback.",
  robots: { index: false, follow: false },
};

export default function UniPlayPage() {
  return <UniPlayClient />;
}
