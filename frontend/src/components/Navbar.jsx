import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, slugify } from "@/data/site";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            data-testid="main-navbar"
            className={`fixed top-0 inset-x-0 z-50 border-b backdrop-blur-xl transition-[background-color,padding] duration-500 ${
                scrolled
                    ? "bg-[#0A0908]/85 border-white/10"
                    : "bg-[#0A0908]/45 border-white/5"
            }`}
        >
            <div
                className={`max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between transition-[padding] duration-500 ${
                    scrolled ? "py-3" : "py-5"
                }`}
            >
                <a
                    href="#home"
                    data-testid="nav-brand"
                    className="font-serif text-xl md:text-2xl tracking-wide text-cream"
                >
                    Ayanchin <span className="italic text-gold">Downtown</span>
                </a>
                <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            data-testid={`nav-link-${slugify(link.label)}`}
                            href={link.href}
                            className="text-xs tracking-[0.2em] uppercase text-stone2 hover:text-cream transition-colors duration-300"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
                <div className="flex items-center gap-3">
                    <a
                        href="#reservation"
                        data-testid="nav-reserve-button"
                        className="hidden md:inline-block bg-gold text-ink text-xs font-semibold tracking-[0.2em] uppercase px-6 py-3 hover:bg-cream transition-colors duration-300"
                    >
                        Reserve a Table
                    </a>
                    <button
                        data-testid="nav-mobile-toggle"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                        className="lg:hidden text-cream p-2 focus:outline-none focus:ring-1 focus:ring-gold"
                    >
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>
            {open && (
                <nav
                    data-testid="nav-mobile-menu"
                    aria-label="Mobile"
                    className="lg:hidden bg-[#0A0908]/95 backdrop-blur-xl border-t border-white/10 px-6 pt-4 pb-8 flex flex-col gap-5"
                >
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            data-testid={`mobile-nav-link-${slugify(link.label)}`}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="text-sm tracking-[0.2em] uppercase text-stone2 hover:text-gold transition-colors duration-300 py-1"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#reservation"
                        data-testid="mobile-nav-reserve-button"
                        onClick={() => setOpen(false)}
                        className="mt-2 bg-gold text-ink text-xs font-semibold tracking-[0.2em] uppercase px-6 py-4 text-center hover:bg-cream transition-colors duration-300"
                    >
                        Reserve a Table
                    </a>
                </nav>
            )}
        </header>
    );
}
