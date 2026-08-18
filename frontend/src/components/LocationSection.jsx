import { MapPin, Phone, Clock, UtensilsCrossed } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { RESTAURANT } from "@/data/site";

export default function LocationSection() {
    return (
        <section id="location" data-testid="location-section" className="scroll-mt-24 py-24 md:py-32 bg-ink-soft">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <SectionHeading
                    eyebrow="Find Us"
                    title="In the Heart of Downtown"
                />
                <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                    <Reveal className="flex flex-col justify-between border border-white/10 bg-ink p-8 md:p-10">
                        <div>
                            <h3 className="font-serif text-3xl text-cream">{RESTAURANT.name}</h3>
                            <ul className="mt-8 space-y-6 text-sm text-stone2">
                                <li className="flex items-start gap-4">
                                    <MapPin size={17} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                                    <span className="leading-relaxed">{RESTAURANT.address}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <Phone size={17} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                                    <a
                                        href={RESTAURANT.phoneHref}
                                        data-testid="location-phone-link"
                                        className="hover:text-gold transition-colors duration-300"
                                    >
                                        {RESTAURANT.phoneDisplay}
                                    </a>
                                </li>
                                <li className="flex items-start gap-4">
                                    <Clock size={17} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                                    {RESTAURANT.hoursNote}
                                </li>
                                <li className="flex items-start gap-4">
                                    <UtensilsCrossed size={17} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                                    {RESTAURANT.services.join(" · ")}
                                </li>
                            </ul>
                        </div>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <a
                                href={RESTAURANT.mapsDirectionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid="get-directions-button"
                                className="bg-gold text-ink text-xs font-semibold tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-cream transition-colors duration-300"
                            >
                                Get Directions
                            </a>
                            <a
                                href={RESTAURANT.phoneHref}
                                data-testid="call-restaurant-button"
                                className="border border-gold/60 text-gold text-xs font-semibold tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-gold hover:text-ink transition-colors duration-300"
                            >
                                Call Restaurant
                            </a>
                        </div>
                    </Reveal>

                    <Reveal delay={0.15} className="min-h-[360px]">
                        <iframe
                            data-testid="google-map-embed"
                            title="Map to Ayanchin Downtown Restaurant, Olympic Street, Ulaanbaatar"
                            src={RESTAURANT.mapsEmbedUrl}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                            className="w-full h-full min-h-[360px] border border-white/10 grayscale-[35%] contrast-[1.05]"
                        />
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
