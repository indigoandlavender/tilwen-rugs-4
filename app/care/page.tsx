import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Care Guide",
  description: "How to care for your Tilwen Moroccan rug.",
};

export default function CarePage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <div className="py-16 md:py-24 px-6 md:px-12 border-b border-charcoal/10">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            Care Guide
          </h1>
          <p className="mt-4 text-stone">
            How to keep your Moroccan rug beautiful for years to come.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 md:py-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <section>
            <h2 className="font-serif text-xl text-charcoal mb-4">
              When Your Rug Arrives
            </h2>
            <div className="text-stone text-sm leading-relaxed space-y-4">
              <p>
                Your rug has been rolled for shipping and may have some creases or 
                a slight curl at the edges. This is completely normal. Unroll it flat 
                and let it rest for 24-48 hours — the weight of the wool will help it 
                settle.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-4">
              Regular Care
            </h2>
            <div className="text-stone text-sm leading-relaxed space-y-4">
              <p>
                <strong className="text-charcoal">Vacuum regularly</strong> — Use a 
                low-suction setting and vacuum with the pile, not against it. Avoid 
                vacuuming the fringes directly.
              </p>
              <p>
                <strong className="text-charcoal">Rotate occasionally</strong> — Every 
                few months, rotate your rug 180° to ensure even wear, especially in 
                high-traffic areas or sunny spots.
              </p>
              <p>
                <strong className="text-charcoal">Shake it out</strong> — For smaller 
                rugs, take them outside occasionally and shake to remove dust.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-4">
              Spills & Stains
            </h2>
            <div className="text-stone text-sm leading-relaxed space-y-4">
              <p>
                Act quickly. Blot (don't rub) with a clean, dry cloth to absorb 
                as much liquid as possible. Then blot with a damp cloth and mild soap 
                if needed. Always test any cleaning solution on an inconspicuous area first.
              </p>
              <p>
                For serious stains, we recommend professional cleaning.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-4">
              Deep Cleaning
            </h2>
            <div className="text-stone text-sm leading-relaxed space-y-4">
              <p>
                We recommend professional cleaning every 2-3 years, or as needed. 
                Look for a cleaner experienced with handmade wool rugs — the 
                techniques differ from machine-made carpets.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-4">
              Shedding
            </h2>
            <div className="text-stone text-sm leading-relaxed space-y-4">
              <p>
                New wool rugs shed. This is normal and will decrease over the first 
                few months of use. Regular vacuuming helps. The shedding comes from 
                loose fibers left from the weaving process, not the rug falling apart.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-4">
              Storage
            </h2>
            <div className="text-stone text-sm leading-relaxed space-y-4">
              <p>
                If storing your rug, roll it (never fold) with the pile facing inward. 
                Wrap in breathable fabric or acid-free paper — avoid plastic, which 
                can trap moisture. Store in a cool, dry place.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-4">
              Questions?
            </h2>
            <div className="text-stone text-sm leading-relaxed">
              <p>
                Contact us at{" "}
                <a
                  href="mailto:hello@tilwen.com"
                  className="text-charcoal hover:text-terracotta transition-colors"
                >
                  hello@tilwen.com
                </a>{" "}
                — we're happy to help.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
