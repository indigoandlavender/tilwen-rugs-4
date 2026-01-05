import Link from "next/link";

export default function Header() {
  return (
    <header className="py-6 md:py-8 px-6 md:px-12 border-b border-charcoal/5">
      <nav className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Logo — serif, understated */}
        <Link href="/" className="font-serif text-xl md:text-2xl tracking-wide">
          Tilwen
        </Link>

        {/* Navigation — minimal, spaced */}
        <div className="flex items-center gap-6 md:gap-10 text-[11px] uppercase tracking-[0.12em]">
          <Link 
            href="/shop" 
            className="text-charcoal/70 hover:text-charcoal transition-colors"
          >
            Shop
          </Link>
          <Link 
            href="/about" 
            className="text-charcoal/70 hover:text-charcoal transition-colors"
          >
            About
          </Link>
          <Link 
            href="/faq" 
            className="text-charcoal/70 hover:text-charcoal transition-colors"
          >
            FAQ
          </Link>
          <Link 
            href="/contact" 
            className="text-charcoal/70 hover:text-charcoal transition-colors"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
