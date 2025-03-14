import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Podcast Generator",
  description: "Generate podcasts from news articles and other content",
};

export default function PodcastLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main>{children}</main>
      <footer className="bg-white mt-12 py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            Podcast Generator © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}