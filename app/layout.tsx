import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Nanum_Myeongjo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair",
  display: "swap",
});

const nanum = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-nanum",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tilwen — Moroccan Rugs",
    template: "%s | Tilwen",
  },
  description:
    "Moroccan rugs with character and soul. Vintage and contemporary pieces, each one-of-a-kind.",
  keywords: [
    "moroccan rugs",
    "berber rugs",
    "azilal rugs",
    "boucherouite rugs",
    "beni ourain rugs",
    "handmade rugs",
    "vintage moroccan rugs",
    "contemporary moroccan rugs",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Tilwen",
    title: "Tilwen — Moroccan Rugs",
    description:
      "Moroccan rugs with character and soul. Vintage and contemporary pieces, each one-of-a-kind.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tilwen — Moroccan Rugs",
    description:
      "Moroccan rugs with character and soul. Vintage and contemporary pieces, each one-of-a-kind.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${nanum.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RSJ2F7NVQ3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RSJ2F7NVQ3');
          `}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
