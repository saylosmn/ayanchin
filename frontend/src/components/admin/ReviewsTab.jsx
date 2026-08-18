import { useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { API } from "@/data/site";

const FILTERS = ["all", "pending", "approved", "rejected"];

const BADGE = {
    pending: "border-gold/60 text-gold",
    approved: "border-emerald-500/50 text-emerald-400",
    rejected: "border-red-500/50 text-red-400",
};

const btnBase = "text-[10px] tracking-[0.15em] uppercase px-3.5 py-2 border transition-colors duration-300";

export default function ReviewsTab({ token, reviews, reload }) {
    const [filter, setFilter] = useState("all");
    const [busyId, setBusyId] = useState(null);
    const headers = { Authorization: `Bearer ${token}` };

    const setStatus = async (id, status) => {
        setBusyId(id);
        try {
            await axios.patch(`${API}/admin/reviews/${id}`, { status }, { headers });
            toast.success(`Review ${status}.`);
            await reload();
        } catch {
            toast.error("Could not update the review.");
        } finally {
            setBusyId(null);
        }
    };

    const remove = async (id) => {
        if (!window.confirm("Delete this review permanently?")) return;
        setBusyId(id);
        try {
            await axios.delete(`${API}/admin/reviews/${id}`, { headers });
            toast.success("Review deleted.");
            await reload();
        } catch {
            toast.error("Could not delete the review.");
        } finally {
            setBusyId(null);
        }
    };

    const visible = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

    return (
        <div className="py-8">
            <div className="flex gap-2 overflow-x-auto pb-2">
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        data-testid={`review-filter-${f}`}
                        onClick={() => setFilter(f)}
                        className={`whitespace-nowrap text-[10px] tracking-[0.18em] uppercase px-4 py-2 border transition-colors duration-300 ${
                            filter === f
                                ? "bg-gold text-ink border-gold font-semibold"
                                : "border-white/15 text-stone2 hover:border-gold/60 hover:text-cream"
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {visible.length === 0 ? (
                <div data-testid="reviews-empty-state" className="mt-8 border border-white/10 bg-ink-soft px-8 py-14 text-center">
                    <p className="font-serif text-2xl text-cream">No reviews here yet</p>
                    <p className="mt-2 text-sm text-stone2">
                        Reviews submitted through the website will appear here for moderation.
                    </p>
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {visible.map((r) => (
                        <article
                            key={r.id}
                            data-testid={`review-row-${r.id}`}
                            className="border border-white/10 bg-ink-soft p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm text-cream">{r.name}</p>
                                    <div className="mt-1.5 flex items-center gap-1" aria-label={`${r.rating} out of 5 stars`}>
                                        {Array.from({ length: 5 }, (_, s) => (
                                            <Star
                                                key={s}
                                                size={12}
                                                className={s < r.rating ? "fill-gold text-gold" : "text-white/20"}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <span
                                    data-testid={`review-status-${r.id}`}
                                    className={`text-[10px] tracking-[0.18em] uppercase border px-3 py-1.5 ${BADGE[r.status] || BADGE.pending}`}
                                >
                                    {r.status}
                                </span>
                            </div>
                            <p className="mt-4 text-sm text-stone2 leading-relaxed flex-1">"{r.text}"</p>
                            <p className="mt-3 text-[10px] text-stone2/60">
                                {new Date(r.created_at).toLocaleString()}
                            </p>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {r.status !== "approved" && (
                                    <button
                                        data-testid={`review-approve-${r.id}`}
                                        disabled={busyId === r.id}
                                        onClick={() => setStatus(r.id, "approved")}
                                        className={`${btnBase} border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10`}
                                    >
                                        Approve
                                    </button>
                                )}
                                {r.status !== "rejected" && (
                                    <button
                                        data-testid={`review-reject-${r.id}`}
                                        disabled={busyId === r.id}
                                        onClick={() => setStatus(r.id, "rejected")}
                                        className={`${btnBase} border-red-500/50 text-red-400 hover:bg-red-500/10`}
                                    >
                                        Reject
                                    </button>
                                )}
                                <button
                                    data-testid={`review-delete-${r.id}`}
                                    disabled={busyId === r.id}
                                    onClick={() => remove(r.id)}
                                    className={`${btnBase} border-white/15 text-stone2/70 hover:text-red-400 hover:border-red-500/50`}
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
