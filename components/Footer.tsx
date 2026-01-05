"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Social Icons - flat, minimal, Anthropic style
function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    pinterest: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6C8 6 6.5 7.5 6.5 9.5C6.5 11 7.5 12 8.5 12.5C8 14 7.5 15.5 7.5 15.5" />
        <path d="M10 6C10 8 10 14 10 14" />
        <path d="M10 6C12 6 13.5 7.5 13.5 9.5C13.5 11.5 12 12.5 10 12.5" />
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
        <rect x="3" y="3" width="14" height="14" rx="4" />
        <circle cx="10" cy="10" r="3.5" />
        <circle cx="14.5" cy="5.5" r="0.75" fill="currentColor" />
      </svg>
    ),
  };

  return icons[name.toLowerCase()] || null;
}

interface FooterLink {
  order?: number;
  label: string;
  href: string;
  type?: string;
}

interface FooterColumn {
  number: number;
  title: string;
  links: FooterLink[];
}

interface FooterData {
  brandId: string;
  newsletter: {
    show: boolean;
    title: string;
    description: string;
    brandName: string;
  };
  columns: FooterColumn[];
  legal: { label: string; href: string }[];
  copyright: {
    year: number;
    name: string;
  };
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch footer data from API (which pulls from database)
  useEffect(() => {
    async function fetchFooter() {
      try {
        const response = await fetch("/api/footer");
        const result = await response.json();
        if (result.success && result.data) {
          setFooterData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch footer data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFooter();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubscribing) return;

    setIsSubscribing(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setSubscribed(true);
        setSubscribeMessage(data.message || "You're in.");
        setEmail("");
      } else {
        setSubscribeMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setSubscribeMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  // Show minimal footer while loading
  if (loading || !footerData) {
    return (
      <footer className="text-white">
        <section className="py-16 md:py-20 bg-[#1f1f1f]" />
        <section className="py-12 md:py-16 bg-[#161616]" />
        <section className="py-6 bg-[#0e0e0e]" />
      </footer>
    );
  }

  // Extract social links and email from first column
  const brandColumn = footerData.columns.find((c) => c.number === 1);
  const socialLinks = brandColumn?.links.filter((l) => l.type === "social") || [];
  const emailLink = brandColumn?.links.find((l) => l.type === "email");
  
  // Navigation columns (columns 2+)
  const navColumns = footerData.columns.filter((c) => c.number > 1);

  return (
    <footer className="text-white">
      {/* ════════════════════════════════════════════════════════════════════
          LEVEL 1: Newsletter (lightest - #1f1f1f)
          ════════════════════════════════════════════════════════════════════ */}
      {footerData.newsletter.show && (
        <section className="py-16 md:py-20 bg-[#1f1f1f]">
          <div className="max-w-xl mx-auto px-6 text-center">
            <h3 className="font-serif text-2xl md:text-3xl mb-3">
              {footerData.newsletter.title}
            </h3>
            <p className="text-white/60 mb-8 text-sm">
              {footerData.newsletter.description}
            </p>

            {subscribed ? (
              <p className="text-white/80">{subscribeMessage}</p>
            ) : (
              <>
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    disabled={isSubscribing}
                    className="flex-1 px-0 py-3 bg-transparent border-0 border-b border-white/30 text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="px-6 py-3 border border-white/20 text-xs tracking-[0.15em] uppercase hover:bg-white hover:text-[#1f1f1f] transition-colors disabled:opacity-50"
                  >
                    {isSubscribing ? "..." : "Subscribe"}
                  </button>
                </form>
                {subscribeMessage && !subscribed && (
                  <p className="text-white/50 text-sm mt-3">{subscribeMessage}</p>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          LEVEL 2: Navigation Links (medium - #161616)
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 bg-[#161616]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Brand Column */}
            <div>
              <Link href="/" className="font-serif text-xl mb-6 block text-white/90">
                {footerData.newsletter.brandName}
              </Link>
              
              {/* Contact Email */}
              {emailLink && (
                <a
                  href={emailLink.href}
                  className="text-sm text-white/60 hover:text-white transition-colors block mb-4"
                >
                  {emailLink.label}
                </a>
              )}

              {/* Social Icons */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 hover:text-white transition-colors"
                      aria-label={social.label}
                    >
                      <SocialIcon name={social.label} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Columns from Database */}
            {navColumns.map((column) => (
              <div key={column.number}>
                <h4 className="text-xs tracking-[0.15em] uppercase mb-6 text-white/40">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((link, linkIndex) => {
                      const isExternal = link.href.startsWith("http");
                      return (
                        <li key={linkIndex}>
                          {isExternal ? (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-2"
                            >
                              {link.label}
                              <span className="text-xs">↗</span>
                            </a>
                          ) : (
                            <Link
                              href={link.href}
                              className="text-sm text-white/60 hover:text-white transition-colors"
                            >
                              {link.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          LEVEL 3: Legal + Copyright (darkest - #0e0e0e)
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-6 bg-[#0e0e0e]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Legal links row */}
          {footerData.legal.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-4">
              {footerData.legal.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Copyright */}
          <p className="text-center text-xs text-white/30">
            © {footerData.copyright.year} {footerData.copyright.name}. All rights reserved.
          </p>
        </div>
      </section>
    </footer>
  );
}
