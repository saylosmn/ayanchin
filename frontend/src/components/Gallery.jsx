import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { API, GALLERY_FILTERS, slugify } from "@/data/site";

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [filter, setFilter] = useState("All");
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        axios
            .get(`${API}/gallery`)
            .then((res) => setImages(res.data))
            .catch(() => setImages([]));
    }, []);

    const visible = filter === "All" ? images : images.filter((img) => img.category === filter);

    const step = useCallback(
        (dir) => {
            if (lightbox === null) return;
            setLightbox((lightbox + dir + visible.length) % visible.length);
        },
        [lightbox, visible.length]
    );

    useEffect(() => {
        const onKey = (e) => {
            if (lightbox === null) return;
            if (e.key === "Escape") setLightbox(null);
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightbox, step]);

    return (
        <section id="gallery" data-testid="gallery-section" className="scroll-mt-24 py-24 md:py-32 bg-ink">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <SectionHeading
                    eyebrow="Gallery"
                    title="Inside Ayanchin Downtown"
                    description="Moments from our kitchen, dining room, and bar — click any image to view it full screen."
                />

                <Reveal delay={0.15} className="mt-12 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                    {GALLERY_FILTERS.map((cat) => (
                        <button
                            key={cat}
                            data-testid={`gallery-filter-${slugify(cat)}`}
                            onClick={() => {
                                setFilter(cat);
                                setLightbox(null);
                            }}
                            className={`whitespace-nowrap text-[11px] tracking-[0.18em] uppercase px-5 py-2.5 border transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-gold ${
                                filter === cat
                                    ? "bg-gold text-ink border-gold font-semibold"
                                    : "border-white/15 text-stone2 hover:border-gold/60 hover:text-cream"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </Reveal>

                <div data-testid="gallery-masonry" className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-5">
                    {visible.map((img, i) => (
                        <button
                            key={img.id}
                            data-testid={`gallery-image-${img.id}`}
                            onClick={() => setLightbox(i)}
                            aria-label={`View ${img.alt} fullscreen`}
                            className="group relative block w-full mb-5 overflow-hidden border border-white/10 break-inside-avoid focus:outline-none focus:ring-1 focus:ring-gold"
                        >
                            <img
                                src={img.url}
                                alt={img.alt}
                                loading="lazy"
                                className="w-full group-hover:scale-105 transition-transform duration-700"
                            />
                            <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-colors duration-500" />
                            <span className="absolute bottom-3 left-3 text-[10px] tracking-[0.25em] uppercase text-cream/0 group-hover:text-cream/90 transition-colors duration-500 bg-ink/60 px-2.5 py-1">
                                {img.category}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {lightbox !== null && visible[lightbox] && (
                    <motion.div
                        data-testid="gallery-lightbox"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Image viewer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 backdrop-blur-lg p-4"
                        onClick={() => setLightbox(null)}
                    >
                        <button
                            data-testid="lightbox-close"
                            aria-label="Close image viewer"
                            onClick={() => setLightbox(null)}
                            className="absolute top-5 right-5 text-cream hover:text-gold p-2 transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-gold"
                        >
                            <X size={24} />
                        </button>
                        <button
                            data-testid="lightbox-prev"
                            aria-label="Previous image"
                            onClick={(e) => {
                                e.stopPropagation();
                                step(-1);
                            }}
                            className="absolute left-3 md:left-8 text-cream hover:text-gold p-2 transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-gold"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <motion.img
                            key={visible[lightbox].id}
                            src={visible[lightbox].url}
                            alt={visible[lightbox].alt}
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="max-h-[85vh] max-w-full object-contain border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            data-testid="lightbox-next"
                            aria-label="Next image"
                            onClick={(e) => {
                                e.stopPropagation();
                                step(1);
                            }}
                            className="absolute right-3 md:right-8 text-cream hover:text-gold p-2 transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-gold"
                        >
                            <ChevronRight size={32} />
                        </button>
                        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-[0.25em] uppercase text-stone2">
                            {visible[lightbox].category} · {lightbox + 1} / {visible.length}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
