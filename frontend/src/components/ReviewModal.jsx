import { useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Star, X } from "lucide-react";
import { toast } from "sonner";
import { API } from "@/data/site";

const inputCls =
    "w-full bg-ink border border-white/15 text-sm text-cream placeholder:text-stone2/50 px-4 py-3.5 focus:border-gold focus:outline-none transition-colors duration-300";

export default function ReviewModal({ open, onClose }) {
    const [name, setName] = useState("");
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const close = () => {
        onClose();
        setTimeout(() => {
            setDone(false);
            setName("");
            setText("");
            setRating(5);
        }, 300);
    };

    const submit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        if (name.trim().length < 2) {
            toast.error("Please enter your name.");
            return;
        }
        if (text.trim().length < 10) {
            toast.error("Please write a short review (at least 10 characters).");
            return;
        }
        setSubmitting(true);
        try {
            await axios.post(`${API}/reviews/submit`, {
                name: name.trim(),
                rating,
                text: text.trim(),
            });
            setDone(true);
        } catch (err) {
            const detail = err.response?.data?.detail;
            toast.error(typeof detail === "string" ? detail : "Could not submit your review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    data-testid="review-submit-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Leave a review"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
                    onClick={close}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-lg bg-ink-soft border border-white/10 p-8 md:p-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            data-testid="review-modal-close"
                            aria-label="Close review form"
                            onClick={close}
                            className="absolute top-4 right-4 text-stone2 hover:text-gold p-2 transition-colors duration-300"
                        >
                            <X size={18} />
                        </button>

                        {done ? (
                            <div data-testid="review-submit-success" className="text-center py-6">
                                <CheckCircle2 size={40} className="text-gold mx-auto" aria-hidden="true" />
                                <h3 className="mt-5 font-serif text-3xl text-cream">Thank You</h3>
                                <p className="mt-3 text-sm text-stone2 leading-relaxed">
                                    Your review has been received and is pending moderation. It will appear
                                    on the website once approved by our team.
                                </p>
                                <button
                                    data-testid="review-success-close-button"
                                    onClick={close}
                                    className="mt-7 bg-gold text-ink text-xs font-semibold tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-cream transition-colors duration-300"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={submit} data-testid="review-submit-form">
                                <h3 className="font-serif text-3xl text-cream">Leave a Review</h3>
                                <p className="mt-2 text-xs text-stone2">
                                    Reviews are moderated before appearing on the website.
                                </p>
                                <label htmlFor="review-name" className="block text-[11px] tracking-[0.2em] uppercase text-stone2 mb-2 mt-7">
                                    Your Name *
                                </label>
                                <input
                                    id="review-name"
                                    data-testid="review-name-input"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Name shown with your review"
                                    maxLength={60}
                                    className={inputCls}
                                />
                                <p className="text-[11px] tracking-[0.2em] uppercase text-stone2 mb-2 mt-5">Rating *</p>
                                <div className="flex gap-1.5" data-testid="review-rating-select">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button
                                            key={n}
                                            type="button"
                                            data-testid={`review-star-${n}`}
                                            aria-label={`${n} star${n > 1 ? "s" : ""}`}
                                            onClick={() => setRating(n)}
                                            className="p-1"
                                        >
                                            <Star
                                                size={22}
                                                className={n <= rating ? "fill-gold text-gold" : "text-white/25 hover:text-gold/60"}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <label htmlFor="review-text" className="block text-[11px] tracking-[0.2em] uppercase text-stone2 mb-2 mt-5">
                                    Your Review *
                                </label>
                                <textarea
                                    id="review-text"
                                    data-testid="review-text-input"
                                    rows={4}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Tell us about your evening at Ayanchin Downtown…"
                                    maxLength={600}
                                    className={`${inputCls} resize-none`}
                                />
                                <button
                                    type="submit"
                                    data-testid="review-submit-button"
                                    disabled={submitting}
                                    className="mt-7 w-full bg-gold text-ink text-xs font-semibold tracking-[0.25em] uppercase px-8 py-4 hover:bg-cream transition-colors duration-300 disabled:opacity-60"
                                >
                                    {submitting ? "Submitting…" : "Submit Review"}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
