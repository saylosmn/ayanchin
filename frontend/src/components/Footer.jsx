import { Clock, MapPin, Phone, Star } from "lucide-react";
import { NAV_LINKS, RESTAURANT, slugify } from "@/data/site";

export default function Footer() {
    return (
        <footer data-testid="footer-section" className="bg-ink border-t border-white/10 pb-20 md:pb-0">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                <div>
                    <p className="font-serif text-2xl text-cream">
                        Ayanchin <span className="italic text-gold">Downtown</span>
                    </p>
                    <p className="mt-4 text-sm text-stone2 leading-relaxed">
                        Modern Mongolian dining in the heart of Ulaanbaatar.
                    </p>
                    <p className="mt-5 inline-flex items-center gap-2 text-xs text-stone2 border border-white/10 px-3 py-2">
                        <Star size={12} className="fill-gold text-gold" aria-hidden="true" />
                        {RESTAURANT.rating} · {RESTAURANT.reviewCount} Reviews
                    </p>
                </div>

                <nav aria-label="Footer">
                    <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-5">Explore</p>
                    <ul className="space-y-3">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    data-testid={`footer-link-${slugify(link.label)}`}
                                    className="text-sm text-stone2 hover:text-cream transition-colors duration-300"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div>
                    <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-5">Visit</p>
                    <ul className="space-y-3 text-sm text-stone2">
                        <li>
                            <a href="#menu" data-testid="footer-link-full-menu" className="hover:text-cream transition-colors duration-300">
                                Full Menu
                            </a>
                        </li>
                        <li>
                            <a href="#reservation" data-testid="footer-link-reservations" className="hover:text-cream transition-colors duration-300">
                                Reservations
                            </a>
                        </li>
                        <li>
                            <a href="#gallery" data-testid="footer-link-gallery" className="hover:text-cream transition-colors duration-300">
                                Gallery
                            </a>
                        </li>
                        <li>
                            <a
                                href={RESTAURANT.mapsDirectionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid="footer-google-maps-link"
                                className="hover:text-cream transition-colors duration-300"
                            >
                                Google Maps
                            </a>
                        </li>
                        <li>
                            <a href="/admin" data-testid="footer-staff-login-link" className="hover:text-cream transition-colors duration-300">
                                Staff Login
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-5">Find Us</p>
                    <ul className="space-y-4 text-sm text-stone2">
                        <li className="flex items-start gap-3">
                            <MapPin size={15} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                            <span className="leading-relaxed">{RESTAURANT.address}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Phone size={15} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                            <a href={RESTAURANT.phoneHref} data-testid="footer-phone-link" className="hover:text-cream transition-colors duration-300">
                                {RESTAURANT.phoneDisplay}
                            </a>
                        </li>
                        <li className="flex items-start gap-3">
                            <Clock size={15} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                            {RESTAURANT.hoursNote}
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-stone2/70 tracking-wide">
                        © 2026 {RESTAURANT.name}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-stone2/70">
                        <a href="#" data-testid="footer-privacy-link" className="hover:text-gold transition-colors duration-300">
                            Privacy Policy
                        </a>
                        <a href="#" data-testid="footer-terms-link" className="hover:text-gold transition-colors duration-300">
                            Terms
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
