import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { API, MENU_CATEGORIES, slugify } from "@/data/site";

export default function MenuSection() {
    const [items, setItems] = useState([]);
    const [active, setActive] = useState("All");
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${API}/menu`)
            .then((res) => setItems(res.data.filter((d) => d.available)))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items.filter((item) => {
            const inCategory = active === "All" || item.category === active;
            const inQuery =
                !q ||
                item.name.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q);
            return inCategory && inQuery;
        });
    }, [items, active, query]);

    return (
        <section id="menu" data-testid="menu-section" className="scroll-mt-24 py-24 md:py-32 bg-ink">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <SectionHeading
                    eyebrow="The Menu"
                    title="Mongolian Roots, Global Craft"
                    description="Browse by category or search for a favorite. Prices and seasonal dishes are confirmed by our team — the menu is updated directly by the restaurant."
                />

                <Reveal delay={0.15} className="mt-12 flex flex-col lg:flex-row lg:items-center gap-5 lg:justify-between">
                    <div
                        data-testid="menu-category-filters"
                        className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1"
                        role="tablist"
                        aria-label="Menu categories"
                    >
                        {MENU_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                role="tab"
                                aria-selected={active === cat}
                                data-testid={`menu-filter-${slugify(cat)}`}
                                onClick={() => setActive(cat)}
                                className={`whitespace-nowrap text-[11px] tracking-[0.18em] uppercase px-5 py-2.5 border transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-gold ${
                                    active === cat
                                        ? "bg-gold text-ink border-gold font-semibold"
                                        : "border-white/15 text-stone2 hover:border-gold/60 hover:text-cream"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative lg:w-72 shrink-0">
                        <Search
                            size={15}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone2"
                            aria-hidden="true"
                        />
                        <input
                            data-testid="menu-search-input"
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search the menu"
                            aria-label="Search the menu"
                            className="w-full bg-ink-soft border border-white/15 text-sm text-cream placeholder:text-stone2/60 pl-11 pr-4 py-3 focus:border-gold focus:outline-none transition-colors duration-300"
                        />
                    </div>
                </Reveal>

                <div data-testid="menu-items-grid" className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((item, i) => (
                        <Reveal key={item.id} delay={Math.min(i * 0.06, 0.3)}>
                            <article
                                data-testid={`menu-item-card-${item.id}`}
                                className="group bg-ink-soft border border-white/10 overflow-hidden h-full flex flex-col hover:border-gold/40 transition-colors duration-500"
                            >
                                <div className="h-56 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.alt}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-2">
                                        {item.category}
                                    </p>
                                    <h3 className="font-serif text-2xl text-cream">{item.name}</h3>
                                    <p className="mt-2.5 text-sm text-stone2 leading-relaxed flex-1">
                                        {item.description}
                                    </p>
                                    <div className="mt-5 flex items-center justify-between gap-3">
                                        <span className="text-xs text-gold tracking-wide">
                                            {item.price ? `₮${item.price.toLocaleString()}` : "Price on request"}
                                        </span>
                                        <div className="flex gap-2">
                                            {item.tags?.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[10px] tracking-[0.15em] uppercase border border-white/15 text-stone2 px-2.5 py-1"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>

                {!loading && filtered.length === 0 && (
                    <div
                        data-testid="menu-empty-state"
                        className="mt-12 border border-white/10 bg-ink-soft px-8 py-14 text-center"
                    >
                        <p className="font-serif text-2xl text-cream">This section is being curated</p>
                        <p className="mt-3 text-sm text-stone2 max-w-md mx-auto">
                            Our team is updating dishes for this category. Please ask our staff for
                            today's offerings when you visit.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
