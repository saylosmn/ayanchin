import { Flame, Gem, Leaf, MapPin, Sparkles, UserCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import { ABOUT_IMAGE } from "@/data/site";

const PILLARS = [
    { icon: Flame, label: "Authentic local flavors" },
    { icon: Gem, label: "Premium ingredients" },
    { icon: Sparkles, label: "Modern presentation" },
    { icon: Leaf, label: "Comfortable atmosphere" },
    { icon: UserCheck, label: "Professional service" },
    { icon: MapPin, label: "Downtown location" },
];

export default function About() {
    return (
        <section id="story" data-testid="about-section" className="scroll-mt-24 py-24 md:py-32 bg-ink">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-center">
                <Reveal className="relative">
                    <div className="absolute -top-4 -left-4 w-full h-full border border-gold/30" aria-hidden="true" />
                    <div className="relative overflow-hidden">
                        <img
                            src={ABOUT_IMAGE}
                            alt="Chef preparing a dish in the Ayanchin Downtown kitchen at night"
                            loading="lazy"
                            className="w-full h-[420px] md:h-[560px] object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </Reveal>

                <div>
                    <Reveal>
                        <p className="text-gold tracking-[0.35em] text-xs uppercase mb-5">Our Story</p>
                        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream leading-[1.05]">
                            A Taste of Mongolia, <span className="italic text-gold">Reimagined</span>
                        </h2>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className="mt-7 text-sm md:text-base text-stone2 leading-relaxed">
                            Ayanchin Downtown brings together Mongolia's culinary traditions and
                            contemporary restaurant craft. In the heart of Ulaanbaatar, our kitchen
                            honors authentic local flavors while presenting them with the refinement
                            of an international dining room.
                        </p>
                        <p className="mt-4 text-sm md:text-base text-stone2 leading-relaxed">
                            From premium cuts and traditional khuushuur to lighter international
                            plates, every dish is built on quality ingredients and careful,
                            modern technique — served in an elegant, comfortable setting made for
                            dates, business dinners, family gatherings, and special occasions.
                        </p>
                    </Reveal>
                    <Reveal delay={0.25}>
                        <ul className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                            {PILLARS.map(({ icon: Icon, label }) => (
                                <li key={label} className="flex items-center gap-3 text-sm text-cream/85">
                                    <Icon size={15} className="text-gold shrink-0" aria-hidden="true" />
                                    {label}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
