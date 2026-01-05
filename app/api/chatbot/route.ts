import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";

export const dynamic = "force-dynamic";

interface TrainingItem {
  Category: string;
  Question: string;
  Answer: string;
  Answer_FR?: string;
  Answer_ES?: string;
  Answer_DE?: string;
  Answer_NL?: string;
  Keywords: string;
  Order: string;
}

interface ChatRequest {
  message: string;
  language?: string;
  history?: { role: string; content: string }[];
}

// Get answer in the requested language
function getLocalizedAnswer(item: TrainingItem, language: string): string {
  switch (language) {
    case "fr": return item.Answer_FR || item.Answer;
    case "es": return item.Answer_ES || item.Answer;
    case "de": return item.Answer_DE || item.Answer;
    case "nl": return item.Answer_NL || item.Answer;
    default: return item.Answer;
  }
}

// Simple keyword matching to find relevant answers
function findBestMatch(query: string, training: TrainingItem[]): TrainingItem | null {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  
  let bestMatch: TrainingItem | null = null;
  let bestScore = 0;

  for (const item of training) {
    let score = 0;
    
    // Check keywords
    if (item.Keywords) {
      const keywords = item.Keywords.toLowerCase().split(",").map(k => k.trim());
      for (const keyword of keywords) {
        if (queryLower.includes(keyword)) {
          score += 3;
        }
      }
    }
    
    // Check question similarity
    if (item.Question) {
      const questionWords = item.Question.toLowerCase().split(/\s+/);
      for (const word of queryWords) {
        if (word.length > 2 && questionWords.some(qw => qw.includes(word) || word.includes(qw))) {
          score += 1;
        }
      }
    }
    
    // Check if query contains category
    if (item.Category && queryLower.includes(item.Category.toLowerCase())) {
      score += 2;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return bestScore >= 2 ? bestMatch : null;
}

// Default training data if Google Sheets is not configured
const DEFAULT_TRAINING: TrainingItem[] = [
  {
    Category: "greeting",
    Question: "Hello",
    Answer: "Welcome to Tilwen. I can help you find the perfect Moroccan rug, answer questions about our collection, or explain the stories behind the weaves. What brings you here today?",
    Answer_FR: "Bienvenue chez Tilwen. Je peux vous aider à trouver le tapis marocain parfait, répondre à vos questions sur notre collection ou expliquer les histoires derrière les tissages. Qu'est-ce qui vous amène aujourd'hui?",
    Keywords: "hi,hello,hey,bonjour,hola",
    Order: "1"
  },
  {
    Category: "shipping",
    Question: "Do you ship internationally?",
    Answer: "Yes, we ship worldwide. Rugs are carefully rolled and packaged for safe transit. Shipping costs depend on destination and rug size — we'll provide an exact quote before you commit. Most orders arrive within 2-3 weeks.",
    Keywords: "ship,shipping,delivery,international,worldwide,send",
    Order: "2"
  },
  {
    Category: "returns",
    Question: "What is your return policy?",
    Answer: "All sales are final — each rug is a one-of-one piece, and we want to make sure it's right for you before purchase. We're happy to provide additional photos, measurements, or video calls to help you decide. Take your time.",
    Keywords: "return,refund,exchange,policy",
    Order: "3"
  },
  {
    Category: "types",
    Question: "What types of rugs do you sell?",
    Answer: "We specialize in authentic Moroccan rugs: Beni Ourain (creamy wool with geometric patterns), Azilal (colorful pile rugs from the Atlas), Boucherouite (recycled textile rugs), Kilims (flatweave), and vintage tribal pieces. Each is hand-selected for quality and character.",
    Keywords: "type,types,kind,beni,azilal,boucherouite,kilim,moroccan",
    Order: "4"
  },
  {
    Category: "vintage",
    Question: "What makes a rug vintage?",
    Answer: "We consider rugs vintage when they're 20+ years old and show the beautiful patina that comes from age — softened colors, a certain suppleness in the wool. These are rugs that have already lived a life, often in Berber homes in the Atlas Mountains.",
    Keywords: "vintage,old,antique,age,patina",
    Order: "5"
  },
  {
    Category: "sizing",
    Question: "How do I choose the right size?",
    Answer: "A good rule: the rug should extend at least 18 inches beyond furniture on all sides. For living rooms, front legs of sofas often rest on the rug. For dining, chairs should remain on the rug when pulled out. Send us your room dimensions and we can suggest options.",
    Keywords: "size,sizing,dimensions,measure,fit,room",
    Order: "6"
  },
  {
    Category: "care",
    Question: "How do I care for a Moroccan rug?",
    Answer: "Wool rugs are naturally resilient. Vacuum regularly (beater bar off), rotate occasionally for even wear. For spills, blot immediately — don't rub. Professional cleaning every few years keeps them beautiful. Avoid direct sunlight to prevent fading.",
    Keywords: "care,clean,cleaning,maintain,maintenance,wash,vacuum",
    Order: "7"
  },
  {
    Category: "authenticity",
    Question: "Are your rugs authentic?",
    Answer: "Every rug is hand-selected in Morocco. We work directly with dealers and weavers, often traveling to source villages. Tilwen is curated by the founder of House of Weaves — an ethnographic textile archive — so authenticity and provenance are fundamental to what we do.",
    Keywords: "authentic,real,genuine,handmade,origin",
    Order: "8"
  },
  {
    Category: "house-of-weaves",
    Question: "What is House of Weaves?",
    Answer: "House of Weaves is an ethnographic archive documenting textile traditions across five continents — over 170 stories about weaving cultures worldwide. Tilwen is its commercial sister: the same research eye, applied to finding and selling extraordinary Moroccan rugs. Visit houseofweaves.love to explore.",
    Keywords: "house of weaves,houseofweaves,archive,research,ethnographic",
    Order: "9"
  },
  {
    Category: "payment",
    Question: "What payment methods do you accept?",
    Answer: "We accept all major credit cards through Shopify's secure checkout, as well as PayPal and Shop Pay. For larger purchases, we can discuss payment plans — just reach out.",
    Keywords: "pay,payment,credit card,paypal,checkout",
    Order: "10"
  },
  {
    Category: "fallback",
    Question: "Default",
    Answer: "I'd be happy to help with that. For specific questions about a rug you've seen, sizing advice, or anything else, feel free to ask or reach out directly through our contact page. Is there something specific about our collection I can help you find?",
    Keywords: "",
    Order: "99"
  }
];

export async function POST(request: Request) {
  try {
    const { message, language = "en" }: ChatRequest = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Try to fetch training data from Google Sheets, fall back to defaults
    let training: TrainingItem[] = DEFAULT_TRAINING;
    try {
      const sheetData = await getSheetData("Chatbot_Training");
      if (sheetData && sheetData.length > 0) {
        training = sheetData as unknown as TrainingItem[];
      }
    } catch {
      // Use default training data
    }
    
    // Check for greeting
    const greetingItem = training.find(t => t.Category?.toLowerCase() === "greeting");
    const greetingWords = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "bonjour", "hola", "guten tag", "hallo"];
    const isGreeting = greetingWords.some(g => message.toLowerCase().trim().startsWith(g));
    
    if (isGreeting && greetingItem) {
      return NextResponse.json({ 
        response: getLocalizedAnswer(greetingItem, language),
        category: "greeting"
      });
    }

    // Find best matching answer
    const match = findBestMatch(message, training.filter(t => t.Category?.toLowerCase() !== "system"));
    
    if (match) {
      return NextResponse.json({ 
        response: getLocalizedAnswer(match, language),
        category: match.Category,
        matched_question: match.Question
      });
    }

    // Default fallback response
    const fallbackItem = training.find(t => t.Category?.toLowerCase() === "fallback");
    const fallbackResponse = fallbackItem 
      ? getLocalizedAnswer(fallbackItem, language)
      : "I'd be happy to help with that. For specific questions, please reach out through our contact page. Is there something about our collection I can help you find?";

    return NextResponse.json({ 
      response: fallbackResponse,
      category: "fallback"
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json({ 
      response: "I'm having trouble right now. Please try again or contact us directly.",
      error: true 
    }, { status: 500 });
  }
}
