import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";

export const dynamic = "force-dynamic";

interface FAQItem {
  Section: string;
  Question: string;
  Answer: string;
  Order: string;
}

// Default FAQ data if Google Sheets is not configured
const DEFAULT_FAQ: FAQItem[] = [
  // Shopping
  { Section: "Shopping", Question: "Are these rugs authentic?", Answer: "Every rug is hand-selected in Morocco. We work directly with dealers and weavers, often traveling to source villages. Tilwen is curated by the founder of House of Weaves — an ethnographic textile archive — so authenticity and provenance are fundamental to what we do.", Order: "1" },
  { Section: "Shopping", Question: "Why is each rug one-of-one?", Answer: "Moroccan rugs are handwoven by individual weavers or small family groups. No two are identical — each reflects the weaver's choices in color, pattern, and wool. When a rug sells, that exact piece is gone forever.", Order: "2" },
  { Section: "Shopping", Question: "Can I see more photos of a rug?", Answer: "Absolutely. Contact us and we'll send additional angles, close-ups, or even a video walkthrough. We want you to be certain before you commit.", Order: "3" },
  { Section: "Shopping", Question: "Do you offer video consultations?", Answer: "Yes. We're happy to show rugs live via video call, discuss sizing, and answer any questions. Just reach out to schedule a time.", Order: "4" },
  
  // Shipping & Delivery
  { Section: "Shipping & Delivery", Question: "Do you ship internationally?", Answer: "Yes, we ship worldwide. Rugs are carefully rolled and packaged for safe transit. Shipping costs depend on destination and rug size — we'll provide an exact quote before you commit.", Order: "5" },
  { Section: "Shipping & Delivery", Question: "How long does shipping take?", Answer: "Most orders ship within 3-5 business days. Delivery typically takes 1-2 weeks for Europe and North America, 2-3 weeks for other destinations. We provide tracking on all shipments.", Order: "6" },
  { Section: "Shipping & Delivery", Question: "How are rugs packaged?", Answer: "Rugs are rolled (never folded) around a sturdy tube, wrapped in protective material, and placed in a durable shipping bag or box. They arrive ready to unroll and enjoy.", Order: "7" },
  { Section: "Shipping & Delivery", Question: "What about customs and duties?", Answer: "Customs duties and taxes vary by country and are the buyer's responsibility. We'll mark packages accurately with contents and value. Contact your local customs office for specific duty rates.", Order: "8" },
  
  // Returns & Payments
  { Section: "Returns & Payments", Question: "What is your return policy?", Answer: "All sales are final. Each rug is a one-of-one piece, and we want to make sure it's right for you before purchase. We're happy to provide additional photos, measurements, or video calls to help you decide.", Order: "9" },
  { Section: "Returns & Payments", Question: "Why no returns?", Answer: "Unlike mass-produced goods, our rugs can't be restocked or resold as 'new.' Each handling and shipping cycle risks damage to these handmade pieces. We'd rather ensure the right match upfront through consultation.", Order: "10" },
  { Section: "Returns & Payments", Question: "What payment methods do you accept?", Answer: "We accept all major credit cards, PayPal, and Shop Pay through Shopify's secure checkout. For larger purchases, we can discuss payment plans — just ask.", Order: "11" },
  { Section: "Returns & Payments", Question: "Is checkout secure?", Answer: "Yes. All transactions are processed through Shopify's PCI-compliant payment system. We never see or store your full card details.", Order: "12" },
  
  // Rug Types & Care
  { Section: "Rug Types & Care", Question: "What types of Moroccan rugs do you sell?", Answer: "We specialize in Beni Ourain (creamy wool with geometric patterns), Azilal (colorful pile rugs from the Atlas), Boucherouite (recycled textile rugs), Kilims (flatweave), and vintage tribal pieces. Each type has its own character and history.", Order: "13" },
  { Section: "Rug Types & Care", Question: "What makes a rug 'vintage'?", Answer: "We consider rugs vintage when they're 20+ years old and show the beautiful patina that comes from age — softened colors, a certain suppleness in the wool. These have already lived a life, often in Berber homes in the Atlas.", Order: "14" },
  { Section: "Rug Types & Care", Question: "How do I care for a Moroccan rug?", Answer: "Wool rugs are naturally resilient. Vacuum regularly with the beater bar off, rotate occasionally for even wear. For spills, blot immediately — don't rub. Professional cleaning every few years keeps them beautiful. Avoid direct sunlight.", Order: "15" },
  { Section: "Rug Types & Care", Question: "Are wool rugs good for allergies?", Answer: "Wool is naturally hypoallergenic. It resists dust mites, mold, and mildew. Unlike synthetic fibers, wool doesn't release microplastics. Many allergy sufferers find wool rugs preferable to synthetic alternatives.", Order: "16" },
  
  // Sizing & Placement
  { Section: "Sizing & Placement", Question: "How do I choose the right size?", Answer: "A good rule: the rug should extend at least 18 inches beyond furniture on all sides. For living rooms, front legs of sofas often rest on the rug. For dining, chairs should remain on the rug when pulled out. Send us your room dimensions and we can help.", Order: "17" },
  { Section: "Sizing & Placement", Question: "Can I use a rug on carpet?", Answer: "Yes. A rug over carpet adds texture and defines space. Use a thin rug pad to prevent slipping. Flatweave kilims work especially well over low-pile carpet.", Order: "18" },
  { Section: "Sizing & Placement", Question: "Do I need a rug pad?", Answer: "We recommend rug pads for hard floors — they prevent slipping, protect floors from dye transfer, and add cushioning that extends rug life. On carpet, a thin pad helps prevent bunching.", Order: "19" },
  
  // About Tilwen
  { Section: "About Tilwen", Question: "What is House of Weaves?", Answer: "House of Weaves is an ethnographic archive documenting textile traditions across five continents — over 170 stories about weaving cultures worldwide. Tilwen is its commercial sister: the same research eye, applied to finding and selling extraordinary Moroccan rugs.", Order: "20" },
  { Section: "About Tilwen", Question: "Who selects the rugs?", Answer: "Every rug is personally selected by Tilwen's founder, who has lived in Morocco for over a decade and founded House of Weaves. The same eye that researches textile history informs what enters the collection.", Order: "21" },
  { Section: "About Tilwen", Question: "Where is Tilwen based?", Answer: "We're based in Marrakech, Morocco — at the heart of the country's rug trade. This gives us direct access to dealers, weavers, and pieces that never reach international markets.", Order: "22" },
];

export async function GET() {
  try {
    // Try to fetch from Google Sheets
    const sheetData = await getSheetData("FAQ");
    
    if (sheetData && sheetData.length > 0) {
      const faqItems = sheetData as unknown as FAQItem[];
      return NextResponse.json(
        faqItems.sort((a, b) => parseInt(a.Order || "0") - parseInt(b.Order || "0"))
      );
    }
    
    // Return default FAQ data
    return NextResponse.json(DEFAULT_FAQ);
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json(DEFAULT_FAQ);
  }
}
