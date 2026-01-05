import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossary · Moroccan Rug Tribes & Traditions",
  description: "Understanding the weaving traditions of Morocco's Amazigh tribes — Beni M'Guild, Boujad, Zayan, Talsint, Taznakht, and more.",
};

const tribes = [
  {
    name: "Beni M'Guild",
    content: [
      "Beni M'Guild rugs originate from the Middle Atlas Mountains, crafted by the Ait M'Guild tribe. Known for their bold geometric patterns and rich, saturated colors—particularly deep reds and burgundies—these pieces reflect a culture shaped by mountain winters and pastoral traditions.",
      "The diamond motifs common in Beni M'Guild weaving often represent protection symbols, territorial markers, and ancestral pathways. Unlike the minimalist Beni Ourain style, these rugs embrace complexity and color as expressions of abundance and celebration."
    ]
  },
  {
    name: "Beni Mrirt",
    content: [
      "Beni Mrirt rugs come from the Middle Atlas region near Khénifra. These pieces are known for their dense pile and muted, sophisticated palettes—often featuring creams, grays, and soft browns that create a contemporary aesthetic while honoring traditional techniques.",
      "The nearly neutral tones speak of restraint rather than limitation, with subtle variations creating depth that reveals itself gradually over time and use."
    ]
  },
  {
    name: "Beni Ourain",
    content: [
      "Beni Ourain rugs are woven by the Beni Ourain tribe of the Middle Atlas Mountains. These iconic pieces feature cream or ivory wool with minimal geometric patterns in black or dark brown—a stark aesthetic born from harsh mountain winters.",
      "Traditionally used as sleeping mats and blankets, their thick pile provided insulation against cold nights. The simple diamond and linear motifs carry protective meanings, marking safe paths and warding against misfortune."
    ]
  },
  {
    name: "Boujad",
    content: [
      "Boujad rugs come from the town of Boujad in the Khouribga Province, where the warm plains meet the foothills of the Middle Atlas. These textiles are celebrated for their abstract expressionism—vibrant pinks, corals, and roses dancing across fields of geometric improvisation.",
      "Unlike the more structured tribal rugs, Boujad weavers embraced individual creativity within traditional frameworks. The rose and coral tones, derived from madder root, connect each piece to the terracotta landscape and the pomegranate orchards that flourish in this region."
    ]
  },
  {
    name: "Marmoucha",
    content: [
      "Marmoucha rugs originate from the remote reaches of the Middle Atlas, crafted by Amazigh communities who have maintained their weaving traditions for centuries. These pieces reflect the balanced precision of highland craftsmanship.",
      "The geometric patterns carry meanings passed through generations—protection symbols, blessing markers, and territorial boundaries distilled into their most fundamental expressions."
    ]
  },
  {
    name: "Rehamna",
    content: [
      "Rehamna rugs come from the plains south of Marrakech, crafted by Arabic-speaking tribes rather than Amazigh communities. These pieces feature distinctive flat-weave construction and stark geometric patterns—often black forms against rust-red or orange fields.",
      "The bold contrast and precise geometry speak of a culture where survival demanded different wisdom than the mountain tribes—where resource scarcity transformed necessity into stark, uncompromising beauty."
    ]
  },
  {
    name: "Talsint",
    content: [
      "Talsint rugs emerge from the eastern reaches of Morocco, near the Algerian border. These pieces reflect the stark beauty of the high desert—earth tones, geometric precision, and patterns that once guided nomads across territories without maps.",
      "The restrained palette speaks of a culture where resource scarcity transformed necessity into stark beauty. Each triangular form and diamond motif marks routes between oases, water sources, and safe passages through difficult terrain."
    ]
  },
  {
    name: "Taznakht",
    content: [
      "Taznakht rugs originate from the town of the same name in the Anti-Atlas Mountains, near Ouarzazate. This region has long been a center for rug production, with weavers known for their mastery of natural dyes and geometric precision.",
      "Taznakht textiles often feature bold geometric forms and sophisticated color harmonies, reflecting influence from both Berber highland traditions and the trading routes that connected this region to the Sahara."
    ]
  },
  {
    name: "Zayan",
    content: [
      "Zayan rugs represent the weaving traditions of the Zayan tribe from Morocco's central highlands. These pieces are characterized by bold geometric patterns, strong contrast, and vibrant crimson fields that speak to a culture defined by tribal boundaries and mountain survival.",
      "The diamond patterns in Zayan rugs often encode practical knowledge—safe passage routes, territorial claims, and protection symbols for family spaces. Each piece serves as both functional textile and cultural document."
    ]
  },
  {
    name: "Zemmour",
    content: [
      "Zemmour rugs represent the weaving traditions of the Zemmour confederation from Morocco's central plains between Rabat and Meknes. These textiles feature distinctive horizontal bands and bold geometric patterns that speak an ancient visual language.",
      "Each geometric division traditionally marked territories both physical and symbolic—tribal boundaries, seasonal grazing rights, and protection markers for nomadic journeys."
    ]
  },
];

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="pt-32 pb-16 px-6 md:px-12 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone mb-4">
          The Weaving Traditions
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-6">
          Glossary
        </h1>
        <p className="text-charcoal/70 max-w-xl mx-auto">
          Understanding the tribes and regions behind Morocco&apos;s handwoven heritage
        </p>
      </div>

      {/* Tribe entries */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 pb-20">
        {tribes.map((tribe, index) => (
          <div 
            key={tribe.name}
            id={tribe.name.toLowerCase().replace(/[^a-z]/g, '-')}
            className={`py-12 ${index !== tribes.length - 1 ? 'border-b border-charcoal/10' : ''}`}
          >
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-6">
              {tribe.name}
            </h2>
            <div className="space-y-4">
              {tribe.content.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-[15px] text-charcoal/80 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="border-t border-charcoal/10 py-12 px-6 md:px-12 text-center">
        <p className="text-[13px] text-charcoal/60 max-w-xl mx-auto">
          Each rug in our collection carries the distinct character of its tribal origin. 
          The names reference not just geography, but generations of weavers who developed 
          and refined these traditions.
        </p>
      </div>
    </div>
  );
}
