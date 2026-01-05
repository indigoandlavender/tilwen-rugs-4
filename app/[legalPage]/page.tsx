import { getLegalPage } from "@/lib/nexus";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Valid legal page slugs
const LEGAL_PAGES = ["privacy", "terms", "disclaimer", "intellectual-property"];

export async function generateStaticParams() {
  return LEGAL_PAGES.map((slug) => ({ legalPage: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { legalPage: string };
}): Promise<Metadata> {
  const titles: Record<string, string> = {
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    disclaimer: "Disclaimer",
    "intellectual-property": "Intellectual Property",
  };

  const title = titles[params.legalPage] || "Legal";

  return {
    title,
    description: `${title} for Tilwen - Moroccan rugs with character and soul.`,
  };
}

export default async function LegalPage({
  params,
}: {
  params: { legalPage: string };
}) {
  const { legalPage } = params;

  // Check if valid legal page
  if (!LEGAL_PAGES.includes(legalPage)) {
    notFound();
  }

  // Fetch legal content from Nexus with template variable substitution
  const page = await getLegalPage(legalPage);

  // Fallback titles
  const fallbackTitles: Record<string, string> = {
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    disclaimer: "Disclaimer",
    "intellectual-property": "Intellectual Property",
  };

  const displayTitle = page?.title || fallbackTitles[legalPage] || "Legal";

  return (
    <main className="min-h-screen bg-cream">
      <Header />

      {/* Header Section */}
      <div className="pt-32 pb-12 md:pt-40 md:pb-16 px-6 md:px-12 border-b border-charcoal/10">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            {displayTitle}
          </h1>
          <p className="mt-4 text-stone text-sm">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 md:py-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          {page && page.sections.length > 0 ? (
            <div className="space-y-10">
              {page.sections.map((section, index) => (
                <section key={index}>
                  {section.title && (
                    <h2 className="font-serif text-xl text-charcoal mb-4">
                      {section.title}
                    </h2>
                  )}
                  <div className="text-stone text-sm leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="text-stone text-sm leading-relaxed">
              <p>
                This page is being updated. Please contact us at{" "}
                <a
                  href="mailto:hello@tilwen.com"
                  className="text-charcoal hover:text-terracotta transition-colors"
                >
                  hello@tilwen.com
                </a>{" "}
                if you have any questions.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
