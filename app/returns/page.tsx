import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns",
  description: "Return policy for Tilwen Moroccan rugs.",
};

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <div className="py-16 md:py-24 px-6 md:px-12 border-b border-charcoal/10">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            Returns
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 md:py-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <section>
            <h2 className="font-serif text-xl text-charcoal mb-4">
              All Sales Are Final
            </h2>
            <div className="text-stone text-sm leading-relaxed space-y-4">
              <p>
                Every rug in our collection is one-of-one. We photograph each piece 
                honestly, showing its true colors, texture, and any signs of age or wear. 
                What you see is what you receive.
              </p>
              <p>
                Because of the nature of vintage and handmade textiles — and the logistics 
                of international shipping from Morocco — we do not accept returns. Please 
                review photos and measurements carefully before purchasing.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-4">
              Questions Before You Buy
            </h2>
            <div className="text-stone text-sm leading-relaxed space-y-4">
              <p>
                Not sure about size, color, or condition? Email us at{" "}
                <a
                  href="mailto:hello@tilwen.com"
                  className="text-charcoal hover:text-terracotta transition-colors"
                >
                  hello@tilwen.com
                </a>{" "}
                — we're happy to provide additional photos, measurements, or details 
                about any rug. We'd rather answer questions now than have you end up 
                with something that doesn't work for your space.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-4">
              Damaged in Transit
            </h2>
            <div className="text-stone text-sm leading-relaxed space-y-4">
              <p>
                If your rug arrives damaged during shipping, contact us within 48 hours 
                with photos of the damage and packaging. We'll work with the carrier 
                to resolve the issue.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
