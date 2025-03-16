import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "AI Podcast Generator - Transform Content into Conversations",
  description: "Generate professional-sounding podcasts from articles and other content in minutes",
};

export default function PodcastLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Nav />
      <main>{children}</main>
    </div>
  );
}