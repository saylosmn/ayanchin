import { motion } from "framer-motion";
import { ArrowDown, MapPin, Star } from "lucide-react";
import { HERO_IMAGE, RESTAURANT } from "@/data/site";

const fadeUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
};

export default function Hero() {
    return (
        <section
            id="home"
            data-testid="hero-section"
            className="relative min-h-screen flex items-end md:items-center overflow-hidden"
        >
            <img
                src={HERO_IMAGE}
                alt="Warm, dimly lit bar and dining room of Ayanchin Downtown Restaurant in Ulaanbaatar"
                className="absolute inset-0 w-full h-full object-cover"
                fetchpriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/55 to-black/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/70 via-transparent to-transparent" />

            <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 pb-24 pt-44 md:py-40">
                <motion.p
                    {...fadeUp}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-gold tracking-[0.4em] text-[11px] md:text-xs uppercase mb-6"
                >
                    Sukhbaatar District · Ulaanbaatar
                </motion.p>
                <motion.h1
                    {...fadeUp}
                    transition={{ duration: 0.9, delay: 0.25 }}
                    className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.95] text-cream"
                >
                    AYANCHIN
                    <br />
                    <span className="italic font-light text-gold">Downtown</span>
                </motion.h1>
                <motion.p
                    {...fadeUp}
                    transition={{ duration: 0.9, delay: 0.4 }}
                    className="mt-7 text-base md:text-lg text-cream/90 max-w-xl"
                >
                    {RESTAURANT.tagline}
                </motion.p>
                <motion.p
                    {...fadeUp}
                    transition={{ duration: 0.9, delay: 0.5 }}
                    className="mt-3 text-sm md:text-base text-stone2 max-w-xl leading-relaxed"
                >
                    {RESTAURANT.description}
                </motion.p>

                <motion.div
                    {...fadeUp}
                    transition={{ duration: 0.9, delay: 0.65 }}
                    className="mt-10 flex flex-wrap items-center gap-4"
                >
                    <a
                        href="#reservation"
                        data-testid="hero-reserve-button"
                        className="bg-gold text-ink text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 hover:bg-cream transition-colors duration-300"
                    >
                        Reserve a Table
                    </a>
                    <a
                        href="#menu"
                        data-testid="hero-view-menu-button"
                        className="border border-gold/70 text-gold text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 hover:bg-gold hover:text-ink transition-colors duration-300"
                    >
                        View Menu
                    </a>
                    <a
                        href={RESTAURANT.mapsDirectionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="hero-directions-button"
                        className="inline-flex items-center gap-2 text-cream/85 text-xs font-semibold tracking-[0.2em] uppercase px-2 py-4 hover:text-gold transition-colors duration-300"
                    >
                        <MapPin size={15} /> Get Directions
                    </a>
                </motion.div>

                <motion.div
                    {...fadeUp}
                    transition={{ duration: 0.9, delay: 0.8 }}
                    data-testid="hero-info-row"
                    className="mt-12 inline-flex flex-wrap items-center gap-x-4 gap-y-2 border border-white/10 bg-ink/50 backdrop-blur-md px-5 py-3 text-xs md:text-sm text-stone2"
                >
                    <span className="inline-flex items-center gap-1.5 text-cream">
                        <Star size={14} className="fill-gold text-gold" /> {RESTAURANT.rating}
                    </span>
                    <span aria-hidden="true" className="text-gold/60">·</span>
                    <span>{RESTAURANT.reviewCount} Reviews</span>
                    <span aria-hidden="true" className="text-gold/60">·</span>
                    <span>Open Until 12 AM</span>
                </motion.div>
            </div>

            <motion.a
                href="#story"
                data-testid="hero-scroll-cue"
                aria-label="Scroll to our story"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 1 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-stone2 hover:text-gold transition-colors duration-300 hidden md:block"
            >
                <ArrowDown size={18} className="animate-bounce" />
            </motion.a>
        </section>
    );
}
