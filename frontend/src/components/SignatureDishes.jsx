import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { API } from "@/data/site";

export default function SignatureDishes() {
    const [dishes, setDishes] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        axios
            .get(`${API}/menu`)
            .then((res) => setDishes(res.data.filter((d) => d.signature)))
            .catch(() => setDishes([]));
    }, []);

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setSelected(null);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <section data-testid="signature-dishes-section" className="py-24 md:py-32 bg-ink-soft">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
                    <SectionHeading
                        eyebrow="Signature Flavors"
                        title="Dishes Our Guests Remember"
                        description="A selection of house signatures — from traditional Mongolian favorites to contemporary plates."
                    />
                    <Reveal delay={0.2}>
                        <a
                            href="#menu"
                            data-testid="signature-explore-menu-link"
                            className="inline-block border border-gold/60 text-gold text-xs font-semibold tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-gold hover:text-ink transition-colors duration-300"
                        >
                            Explore Full Menu
                        </a>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dishes.map((dish, i) => (
                        <Reveal key={dish.id} delay={i * 0.08}>
                            <article
                                data-testid={`dish-card-${dish.id}`}
                                className={`group relative overflow-hidden bg-ink border border-white/10 ${
                                    i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
                                }`}
                            >
                                <div className={`overflow-hidden ${i === 0 ? "h-72 sm:h-96" : "h-72"}`}>
                                    <img
                                        src={dish.image}
                                        alt={dish.alt}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-2">
                                                {dish.category}
                                            </p>
                                            <h3 className="font-serif text-2xl text-cream">{dish.name}</h3>
                                        </div>
                                        <span className="text-xs text-stone2 whitespace-nowrap pt-1">
                                            Price on request
                                        </span>
                                    </div>
                                    <p className="mt-3 text-sm text-stone2 leading-relaxed">{dish.description}</p>
                                    <button
                                        data-testid={`dish-view-details-${dish.id}`}
                                        onClick={() => setSelected(dish)}
                                        className="mt-5 text-xs tracking-[0.2em] uppercase text-gold hover:text-cream transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-gold px-1 py-1"
                                    >
                                        View Details →
                                    </button>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selected && (
                    <motion.div
                        data-testid="dish-detail-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${selected.name} details`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 24, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-full max-w-2xl bg-ink-soft border border-white/10 max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                data-testid="dish-modal-close"
                                aria-label="Close dish details"
                                onClick={() => setSelected(null)}
                                className="absolute top-4 right-4 z-10 bg-ink/70 backdrop-blur p-2 text-cream hover:text-gold transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-gold"
                            >
                                <X size={18} />
                            </button>
                            <img src={selected.image} alt={selected.alt} className="w-full h-64 md:h-80 object-cover" />
                            <div className="p-7 md:p-9">
                                <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-2">
                                    {selected.category} · {selected.tags?.join(" · ")}
                                </p>
                                <h3 className="font-serif text-3xl md:text-4xl text-cream">{selected.name}</h3>
                                <p className="mt-4 text-sm md:text-base text-stone2 leading-relaxed">
                                    {selected.description}
                                </p>
                                <p className="mt-6 text-xs text-stone2/80 tracking-wide">
                                    Ask our team for today's price and availability — the menu is updated
                                    regularly by the restaurant.
                                </p>
                                <a
                                    href="#reservation"
                                    data-testid="dish-modal-reserve-button"
                                    onClick={() => setSelected(null)}
                                    className="mt-7 inline-block bg-gold text-ink text-xs font-semibold tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-cream transition-colors duration-300"
                                >
                                    Reserve a Table
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
