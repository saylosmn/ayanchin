import { Phone } from "lucide-react";
import Reveal from "@/components/Reveal";
import { RESTAURANT } from "@/data/site";

export default function ContactCTA() {
    return (
        <section
            id="contact"
            data-testid="contact-cta-section"
            className="scroll-mt-24 py-28 md:py-36 bg-ink border-t border-gold/20"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <Reveal>
                    <p className="text-gold tracking-[0.35em] text-xs uppercase mb-6">Contact</p>
                    <h2 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-cream leading-[1.02] max-w-3xl">
                        Your Table Is <span className="italic text-gold">Waiting</span>
                    </h2>
                    <p className="mt-6 text-sm md:text-base text-stone2 max-w-xl leading-relaxed">
                        Join us for authentic Mongolian flavors, modern dining, and an
                        unforgettable downtown experience.
                    </p>
                    <div className="mt-10 flex flex-wrap gap-4">
                        <a
                            href="#reservation"
                            data-testid="cta-reserve-button"
                            className="bg-gold text-ink text-xs font-semibold tracking-[0.2em] uppercase px-9 py-4 hover:bg-cream transition-colors duration-300"
                        >
                            Reserve a Table
                        </a>
                        <a
                            href={RESTAURANT.phoneHref}
                            data-testid="cta-call-button"
                            className="inline-flex items-center gap-2.5 border border-gold/60 text-gold text-xs font-semibold tracking-[0.2em] uppercase px-9 py-4 hover:bg-gold hover:text-ink transition-colors duration-300"
                        >
                            <Phone size={14} aria-hidden="true" /> Call {RESTAURANT.phoneDisplay}
                        </a>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
