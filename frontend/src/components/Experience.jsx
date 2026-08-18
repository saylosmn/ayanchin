import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { EXPERIENCE_CARDS } from "@/data/site";

export default function Experience() {
    return (
        <section data-testid="experience-section" className="py-24 md:py-32 bg-ink-soft">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <SectionHeading
                    eyebrow="The Experience"
                    title="More Than a Meal"
                    description="An evening at Ayanchin Downtown is shaped by heritage, craft, and the rhythm of the city."
                />
                <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-6">
                    {EXPERIENCE_CARDS.map((card, i) => (
                        <Reveal key={card.id} delay={i * 0.08} className={card.span}>
                            <article
                                data-testid={`experience-card-${card.id}`}
                                className="group relative overflow-hidden border border-white/10 h-72 md:h-80"
                            >
                                <img
                                    src={card.image}
                                    alt={card.alt}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-7">
                                    <h3 className="font-serif text-3xl text-cream group-hover:text-gold transition-colors duration-500">
                                        {card.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-stone2 max-w-sm">{card.text}</p>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
