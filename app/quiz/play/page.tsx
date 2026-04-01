import type { Metadata } from "next";
import PlayClient from "./play-client";

export const metadata: Metadata = {
  title: "Quiz in Progress",
  description: "Answer NSCT practice questions and test your knowledge. Choose options, navigate between questions, and submit when ready.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PlayPage() {
  return <PlayClient />;
}
