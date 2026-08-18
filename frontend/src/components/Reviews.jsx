import { useEffect, useState } from "react";
import axios from "axios";
import { Star, StarHalf } from "lucide-react";
import Reveal from "@/components/Reveal";
import ReviewModal from "@/components/ReviewModal";
import SectionHeading from "@/components/SectionHeading";
import { API, RESTAURANT } from "@/data/site";

export default function Reviews() {
    const [data, setData] = useState({ rating: 4.2, count: 133, themes: [], approved: [] });
    const [reviewOpen, setReviewOpen] = useState(false);

    useEffect(() => {
        axios
            .get(`${API}/reviews`)
            .then((res) => setData(res.data))
            .catch(() => {});
    }, []);

    return (
        <section id="reviews" data-testid="reviews-section" className="scroll-mt-24 py-24 md:py-32 bg-ink-soft">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <SectionHeading
                    eyebrow="Guest Reviews"
                    title="What Our Guests Say"
                    description="Themes from real guest feedback. Individual reviews are loaded from the restaurant's verified review source."
                />

                <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <Reveal className="lg:col-span-4">
                        <div
                            data-testid="reviews-summary"
                            className="border border-white/10 bg-ink p-9 h-full flex flex-col justify-between"
                        >
                            <div>
                                <p className="font-serif text-7xl md:text-8xl text-cream leading-none">
                                    {data.rating}
                                    <span className="text-3xl text-stone2"> / 5</span>
                                </p>
                                <div className="mt-5 flex items-center gap-1.5" aria-label={`Rated ${data.rating} out of 5`}>
                                    {[0, 1, 2, 3].map((i) => (
                                        <Star key={i} size={18} className="fill-gold text-gold" aria-hidden="true" />
                                    ))}
                                    <StarHalf size={18} className="fill-gold/40 text-gold" aria-hidden="true" />
                                </div>
                                <p className="mt-4 text-sm text-stone2">
                                    Based on {data.count} guest reviews
                                </p>
                            </div>
                            <div className="mt-9 flex flex-col gap-3">
                                <a
                                    href={RESTAURANT.reviewsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-testid="read-all-reviews-button"
                                    className="bg-gold text-ink text-xs font-semibold tracking-[0.2em] uppercase px-6 py-3.5 text-center hover:bg-cream transition-colors duration-300"
                                >
                                    Read All Reviews
                                </a>
                                <button
                                    data-testid="leave-review-button"
                                    onClick={() => setReviewOpen(true)}
                                    className="border border-gold/60 text-gold text-xs font-semibold tracking-[0.2em] uppercase px-6 py-3.5 text-center hover:bg-gold hover:text-ink transition-colors duration-300"
                                >
                                    Leave a Review
                                </button>
                            </div>
                        </div>
                    </Reveal>

                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {data.themes.map((theme, i) => (
                            <Reveal key={theme.id} delay={i * 0.06}>
                                <article
                                    data-testid={`review-theme-${theme.id}`}
                                    className="border border-white/10 bg-ink p-7 h-full hover:border-gold/40 transition-colors duration-500"
                                >
                                    <div className="flex items-center gap-1 mb-4" aria-hidden="true">
                                        {[0, 1, 2, 3, 4].map((s) => (
                                            <Star key={s} size={12} className="fill-gold/70 text-gold/70" />
                                        ))}
                                    </div>
                                    <h3 className="font-serif text-xl text-cream">{theme.title}</h3>
                                    <p className="mt-2.5 text-sm text-stone2 leading-relaxed">{theme.note}</p>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                </div>

                {data.approved?.length > 0 && (
                    <div data-testid="approved-reviews-block" className="mt-16">
                        <Reveal>
                            <h3 className="font-serif text-3xl text-cream mb-8">Recent Guest Reviews</h3>
                        </Reveal>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {data.approved.map((review, i) => (
                                <Reveal key={review.id} delay={Math.min(i * 0.05, 0.3)}>
                                    <article
                                        data-testid={`approved-review-${review.id}`}
                                        className="border border-white/10 bg-ink p-7 h-full"
                                    >
                                        <div className="flex items-center gap-1 mb-4" aria-label={`${review.rating} out of 5 stars`}>
                                            {Array.from({ length: 5 }, (_, s) => (
                                                <Star
                                                    key={s}
                                                    size={13}
                                                    className={s < review.rating ? "fill-gold text-gold" : "text-white/20"}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm text-cream/90 leading-relaxed">"{review.text}"</p>
                                        <p className="mt-4 text-xs tracking-[0.2em] uppercase text-stone2">
                                            — {review.name}
                                        </p>
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                )}

                <ReviewModal open={reviewOpen} onClose={() => setReviewOpen(false)} />
            </div>
        </section>
    );
}
