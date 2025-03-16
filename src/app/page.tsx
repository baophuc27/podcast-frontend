import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-16 pb-32 flex content-center items-center justify-center" style={{ minHeight: "85vh" }}>
        <div className="absolute top-0 w-full h-full bg-cover bg-center" style={{ 
          backgroundImage: "url('/hero-bg.jpg')", 
          backgroundSize: "cover",
          filter: "brightness(0.7)"
        }}></div>
        <div className="container relative mx-auto px-4">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <div className="animate-fade-in">
                <h1 className="text-white font-bold text-5xl md:text-6xl mb-6">
                  Transform Content Into <span className="text-blue-400">Conversations</span>
                </h1>
                <p className="mt-4 text-lg text-gray-200 mb-8">
                  Create professional-sounding podcasts from articles and content in minutes.
                  Our AI handles the script, voices, and audio production.
                </p>
                <Link
                  href="/podcast"
                  className="bg-blue-600 text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-blue-700 transition-colors shadow-lg inline-block"
                >
                  Start Creating
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2 inline" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
              <h3 className="text-3xl mb-2 font-semibold leading-normal text-gray-800 dark:text-gray-200">
                Podcast Creation Made Simple
              </h3>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700 dark:text-gray-300">
                Our platform handles the entire podcast creation process from start to finish. Just provide your content, and we'll do the rest.
              </p>
              <div className="mt-8">
                <div className="flex items-center mb-6">
                  <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">Dynamic Script Generation</h4>
                    <p className="text-gray-600 dark:text-gray-400">AI creates engaging podcast scripts from your URLs</p>
                  </div>
                </div>
                <div className="flex items-center mb-6">
                  <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">Natural Voice Synthesis</h4>
                    <p className="text-gray-600 dark:text-gray-400">Lifelike voices that capture the right tone and emotion</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">Full Editorial Control</h4>
                    <p className="text-gray-600 dark:text-gray-400">Edit scripts and regenerate audio until perfect</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-4/12 px-4 mr-auto ml-auto mt-12 md:mt-0">
              <div className="relative flex flex-col min-w-0 break-words bg-blue-600 w-full mb-6 shadow-lg rounded-lg p-8">
                <div className="rounded-lg bg-blue-700 p-6 mb-4">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.897-7.72m-3.95 10.5a9 9 0 0111.556-1.226L9.516 23.362l-4.983-4.983zm9.9-17.779a9 9 0 00-11.556 1.226L9.516.637l4.983 4.983z" />
                  </svg>
                </div>
                <blockquote className="relative">
                  <p className="text-xl font-medium text-white leading-loose">
                    "This tool saved our content team countless hours. We now publish twice as many podcast episodes with half the effort."
                  </p>
                  <div className="mt-6 flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-blue-600 text-xl font-bold">JD</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-white font-medium">Jane Doe</p>
                      <p className="text-blue-200 text-sm">Content Director, Company XYZ</p>
                    </div>
                  </div>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Ready to transform your content?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who use our platform to produce high-quality podcasts from their existing content.
            </p>
            <Link
              href="/podcast"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-base h-12 px-8 inline-flex"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
              Launch Podcast Generator
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <a
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              href="#"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              GitHub
            </a>
            <a
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              href="#"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
              Twitter
            </a>
            <Link
              href="/podcast"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
              Podcast Generator
            </Link>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Podcast Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}