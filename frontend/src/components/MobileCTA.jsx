import { Phone } from "lucide-react";
import { RESTAURANT } from "@/data/site";

export default function MobileCTA() {
    return (
        <div
            data-testid="mobile-sticky-cta"
            className="fixed bottom-0 inset-x-0 z-40 md:hidden grid grid-cols-2 border-t border-white/10 bg-ink/90 backdrop-blur-xl"
        >
            <a
                href={RESTAURANT.phoneHref}
                data-testid="mobile-cta-call"
                className="flex items-center justify-center gap-2 py-4 text-xs font-semibold tracking-[0.18em] uppercase text-cream hover:text-gold transition-colors duration-300"
            >
                <Phone size={14} aria-hidden="true" /> {RESTAURANT.phoneDisplay}
            </a>
            <a
                href="#reservation"
                data-testid="mobile-cta-reserve"
                className="flex items-center justify-center py-4 text-xs font-semibold tracking-[0.18em] uppercase bg-gold text-ink"
            >
                Reserve a Table
            </a>
        </div>
    );
}
