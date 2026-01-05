import { getSettings } from "@/lib/sheets";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About Tilwen — Moroccan rugs curated by the founder of House of Weaves, an ethnographic textile archive documenting weaving traditions across five continents.",
};

export const revalidate = 3600;

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="px-6 md:px-12 py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* Left column — title and intro */}
            <div className="lg:col-span-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone mb-6">
                About the Collection
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-8">
                Rugs with<br />
                <span className="text-stone">provenance</span>
              </h1>
            </div>

            {/* Right column — text */}
            <div className="lg:col-span-6 lg:col-start-7 lg:pt-16">
              <div className="space-y-6 text-charcoal leading-relaxed">
                <p>
                  {settings.aboutText || "Tilwen is a curated collection of Moroccan rugs — vintage pieces with decades of patina and contemporary works from Atlas Mountain weavers."}
                </p>
                <p>
                  Every piece has been personally sourced. Walked through souks, held up to the light, felt underfoot. We seek rugs with presence: the bold geometry of a Beni Ourain, the joyful chaos of a Boucherouite, the quiet elegance of an aged Azilal.
                </p>
                <p>
                  Because each piece is singular — one weaver, one loom, one moment in time — what you see is what remains. When it's gone, it's gone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy section */}
      <section className="px-6 md:px-12 py-20 md:py-32 bg-sand/40">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone mb-8">
            Philosophy
          </p>
          <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed text-charcoal mb-8">
            "We don't sell rugs by the meter. We find the ones that want to be found."
          </blockquote>
        </div>
      </section>

      {/* House of Weaves connection — expanded */}
      <section className="px-6 md:px-12 py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone mb-4">
                The Research
              </p>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
                House of Weaves
              </h2>
              <p className="text-stone text-sm leading-relaxed">
                An ethnographic archive documenting textile traditions across five continents — from the silk roads of Uzbekistan to the indigo vats of West Africa.
              </p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="space-y-6 text-charcoal leading-relaxed">
                <p>
                  Tilwen is curated by the founder of House of Weaves — a living archive of over 170 stories about weaving cultures worldwide. The same eye that researches the Tuareg tent makers of Niger and the byssus weavers of Sardinia informs what enters this collection.
                </p>
                <p>
                  When you buy a rug from Tilwen, you're not just acquiring a floor covering. You're acquiring a piece of documented tradition — with all the context of who made it, how, and why it matters.
                </p>
                <p className="text-stone text-sm">
                  House of Weaves covers Moroccan textiles extensively: from the wedding blankets of the Middle Atlas to the recycled Boucherouite tradition that emerged when imported synthetics reached remote villages. Each rug here carries that depth.
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-charcoal/10">
                <a 
                  href="https://www.houseofweaves.love" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.15em] border border-charcoal/20 px-6 py-4 hover:bg-charcoal hover:text-cream transition-colors"
                >
                  Explore the Archive
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Difference section */}
      <section className="px-6 md:px-12 py-20 md:py-32 bg-sand/40">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone mb-4">
                What Sets Us Apart
              </p>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">
                The Tilwen<br />
                <span className="text-stone">difference</span>
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-lg mb-2">Research-backed selection</h3>
                  <p className="text-charcoal text-sm leading-relaxed">
                    Not just "pretty rugs from Morocco" — pieces selected with ethnographic knowledge of weaving traditions, regional styles, and what makes certain rugs exceptional.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-2">One-of-one inventory</h3>
                  <p className="text-charcoal text-sm leading-relaxed">
                    No reproductions, no factory production. Each rug is a singular artifact. We'd rather sell fewer pieces than compromise on provenance.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-2">Transparent sourcing</h3>
                  <p className="text-charcoal text-sm leading-relaxed">
                    We know where our rugs come from. Ask us about any piece and we'll tell you its origin region, approximate age, and what makes it interesting.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-2">No pressure</h3>
                  <p className="text-charcoal text-sm leading-relaxed">
                    Video consultations, additional photos, sizing advice — take your time. These rugs have waited decades. They can wait for the right home.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-6 md:px-12 py-20 md:py-32 border-t border-charcoal/10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone mb-3">
              Get in touch
            </p>
            <p className="text-charcoal">
              Questions about a piece? Looking for something specific?
            </p>
          </div>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.15em] border border-charcoal/20 px-6 py-4 hover:bg-charcoal hover:text-cream transition-colors"
          >
            Contact Us
            <span className="text-lg">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
