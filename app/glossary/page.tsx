import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossary · Moroccan Rug Terms & Tribes",
  description: "Understanding Moroccan rug terminology and weaving traditions — from abrash to Zemmour.",
};

const glossary = [
  {
    term: "Abrash",
    definition: "The natural color variations that appear as horizontal bands or shifts in a hand-dyed rug. Caused by different dye lots, water sources, or seasonal wool. Far from a defect, abrash is prized as proof of handcraft—a record of the making process visible in the finished piece."
  },
  {
    term: "Amazigh",
    definition: "The indigenous people of North Africa, often called Berbers—though many prefer Amazigh (plural: Imazighen), meaning 'free people.' The geometric patterns in Moroccan rugs are Amazigh visual language, encoding protection symbols, territorial markers, and ancestral knowledge."
  },
  {
    term: "Beni M'Guild",
    definition: "Rugs originating from the Middle Atlas Mountains, crafted by the Ait M'Guild tribe. Known for bold geometric patterns and rich, saturated colors—particularly deep reds and burgundies. The diamond motifs represent protection symbols, territorial markers, and ancestral pathways."
  },
  {
    term: "Beni Mrirt",
    definition: "Rugs from the Middle Atlas region near Khénifra, known for dense pile and muted, sophisticated palettes—often creams, grays, and soft browns. The nearly neutral tones speak of restraint rather than limitation."
  },
  {
    term: "Beni Ourain",
    definition: "Iconic rugs woven by the Beni Ourain tribe of the Middle Atlas Mountains. Feature cream or ivory wool with minimal geometric patterns in black or dark brown—a stark aesthetic born from harsh mountain winters. Traditionally used as sleeping mats and blankets."
  },
  {
    term: "Boujad",
    definition: "Rugs from the town of Boujad in Khouribga Province. Celebrated for abstract expressionism—vibrant pinks, corals, and roses dancing across fields of geometric improvisation. The rose tones, derived from madder root, connect to the terracotta landscape."
  },
  {
    term: "Flatweave",
    definition: "A rug woven without knots, where weft threads pass over and under warp threads to create the pattern. Thinner and lighter than pile rugs, flatweaves include kilims and hanbels. Often reversible."
  },
  {
    term: "Hanbel",
    definition: "A Moroccan flatweave textile, typically used as a floor covering or blanket. Lighter than pile rugs with bold geometric patterns. The term comes from the Arabic word for 'blanket.'"
  },
  {
    term: "Kilim",
    definition: "A flatwoven textile with no pile, created by tightly interweaving warp and weft threads. Produces a thin, reversible fabric. In Morocco, kilim sections often appear at the ends of pile rugs as decorative bands."
  },
  {
    term: "Knot Density",
    definition: "The number of knots per square inch or centimeter, indicating how tightly a rug is woven. Moroccan tribal rugs typically have lower knot density than Persian rugs, prioritizing boldness over intricacy."
  },
  {
    term: "Lanolin",
    definition: "Natural oil found in sheep's wool that provides water resistance and softness. Some Moroccan rugs retain lanolin for added durability and a subtle sheen."
  },
  {
    term: "Madder",
    definition: "A plant root (Rubia tinctorum) used to create red, orange, and rust dyes. Produces the warm reds characteristic of Boujad and Zayan rugs."
  },
  {
    term: "Marmoucha",
    definition: "Rugs from the remote reaches of the Middle Atlas, reflecting balanced precision of highland craftsmanship. Geometric patterns carry protection symbols, blessing markers, and territorial boundaries."
  },
  {
    term: "Pile",
    definition: "The raised surface of a rug created by knotting yarn around warp threads, then cutting the loops. Deep pile (like Beni Ourain) provides cushion and warmth; shorter pile shows pattern more crisply."
  },
  {
    term: "Rehamna",
    definition: "Rugs from the plains south of Marrakech, crafted by Arabic-speaking tribes. Feature distinctive flat-weave construction and stark geometric patterns—often black forms against rust-red or orange fields."
  },
  {
    term: "Selvedge",
    definition: "The finished edges running along the length of a rug, preventing unraveling. In Moroccan rugs, selvedge is often reinforced with goat hair or wrapped wool."
  },
  {
    term: "Talsint",
    definition: "Rugs from eastern Morocco near the Algerian border. Reflect the stark beauty of the high desert—earth tones, geometric precision, and patterns that once guided nomads across territories."
  },
  {
    term: "Taznakht",
    definition: "Rugs from the Anti-Atlas Mountains near Ouarzazate. Known for mastery of natural dyes and geometric precision, reflecting both Berber highland traditions and Saharan trading routes."
  },
  {
    term: "Warp",
    definition: "The vertical threads stretched on the loom before weaving begins, forming the structural foundation of the rug. In Moroccan rugs, typically cotton or wool."
  },
  {
    term: "Weft",
    definition: "The horizontal threads woven over and under the warp threads. In pile rugs, weft passes between rows of knots; in flatweaves, the weft creates the visible pattern."
  },
  {
    term: "Zayan",
    definition: "Rugs from Morocco's central highlands, characterized by bold geometric patterns, strong contrast, and vibrant crimson fields. Diamond patterns encode safe passage routes, territorial claims, and protection symbols."
  },
  {
    term: "Zemmour",
    definition: "Rugs from the Zemmour confederation in Morocco's central plains between Rabat and Meknes. Feature distinctive horizontal bands and bold geometric patterns marking tribal boundaries and seasonal grazing rights."
  },
];

export default function GlossaryPage() {
  // Get unique first letters
  const letters = [...new Set(glossary.map(item => item.term[0].toUpperCase()))].sort();
  
  // Group by first letter
  const grouped = glossary.reduce((acc, item) => {
    const letter = item.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(item);
    return acc;
  }, {} as Record<string, typeof glossary>);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="pt-32 pb-12 px-6 md:px-12 text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-6">
          Glossary
        </h1>
        <p className="text-charcoal/70 max-w-xl mx-auto">
          Terms, tribes, and traditions of Moroccan rugs
        </p>
      </div>

      {/* Letter Navigation */}
      <div className="sticky top-16 z-10 bg-cream/95 backdrop-blur-sm border-y border-charcoal/10">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-4">
          <div className="flex flex-wrap justify-center gap-x-1 gap-y-2">
            {letters.map((letter, index) => (
              <span key={letter} className="flex items-center">
                <a
                  href={`#${letter}`}
                  className="px-2 py-1 text-[13px] text-stone hover:text-charcoal transition-colors"
                >
                  {letter}
                </a>
                {index < letters.length - 1 && (
                  <span className="text-charcoal/20 text-[13px]">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Glossary entries */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        {letters.map((letter) => (
          <div key={letter} id={letter} className="mb-12 scroll-mt-32">
            <h2 className="font-serif text-2xl text-charcoal mb-6 pb-2 border-b border-charcoal/10">
              {letter}
            </h2>
            <div className="space-y-6">
              {grouped[letter].map((item) => (
                <div key={item.term}>
                  <h3 className="font-serif text-lg text-charcoal mb-1">
                    {item.term}
                  </h3>
                  <p className="text-[15px] text-charcoal/70 leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
