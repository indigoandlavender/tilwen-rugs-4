import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Shipping information for Tilwen Moroccan rugs.",
};

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <div className="py-16 md:py-24 px-6 md:px-12 border-b border-charcoal/10">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            Shipping
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 md:py-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <section>
            <h2 className="font-serif text-xl text-charcoal mb-4">
              Worldwide Shipping
            </h2>
            <div className="text-stone text-sm leading-relaxed space-y-4">
              <p>
                We ship our rugs worldwide from Marrakech, Morocco. Each rug is carefully 
                rolled and wrapped to ensure it arrives in perfect condition.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-4">
              Delivery Times
            </h2>
            <div className="text-stone text-sm leading-relaxed space-y-4">
              <p>
                <strong className="text-charcoal">Europe:</strong> 5-10 business days
              </p>
              <p>
                <strong className="text-charcoal">North America:</strong> 10-15 business days
              </p>
              <p>
                <strong className="text-charcoal">Rest of World:</strong> 10-20 business days
              </p>
              <p className="text-xs">
                Delivery times may vary depending on customs processing in your country.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-4">
              Shipping Costs
            </h2>
            <div className="text-stone text-sm leading-relaxed space-y-4">
              <p>
                Shipping costs are calculated at checkout based on your location and the 
                size of your rug. We always aim to offer the most competitive rates.
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
                for any shipping questions.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
