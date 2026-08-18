import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { API } from "@/data/site";

const FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"];

const BADGE = {
    pending: "border-gold/60 text-gold",
    confirmed: "border-emerald-500/50 text-emerald-400",
    completed: "border-white/25 text-stone2",
    cancelled: "border-red-500/50 text-red-400",
};

const btnBase = "text-[10px] tracking-[0.15em] uppercase px-3.5 py-2 border transition-colors duration-300";

export default function ReservationsTab({ token, reservations, reload }) {
    const [filter, setFilter] = useState("all");
    const [busyId, setBusyId] = useState(null);
    const headers = { Authorization: `Bearer ${token}` };

    const setStatus = async (id, status) => {
        setBusyId(id);
        try {
            await axios.patch(`${API}/reservations/${id}`, { status }, { headers });
            toast.success(`Reservation marked ${status}.`);
            await reload();
        } catch {
            toast.error("Could not update the reservation.");
        } finally {
            setBusyId(null);
        }
    };

    const remove = async (id) => {
        if (!window.confirm("Delete this reservation permanently?")) return;
        setBusyId(id);
        try {
            await axios.delete(`${API}/reservations/${id}`, { headers });
            toast.success("Reservation deleted.");
            await reload();
        } catch {
            toast.error("Could not delete the reservation.");
        } finally {
            setBusyId(null);
        }
    };

    const visible = filter === "all" ? reservations : reservations.filter((r) => r.status === filter);

    return (
        <div className="py-8">
            <div className="flex gap-2 overflow-x-auto pb-2">
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        data-testid={`reservation-filter-${f}`}
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
                <div data-testid="reservations-empty-state" className="mt-8 border border-white/10 bg-ink-soft px-8 py-14 text-center">
                    <p className="font-serif text-2xl text-cream">No reservation requests</p>
                    <p className="mt-2 text-sm text-stone2">New requests from the website will appear here.</p>
                </div>
            ) : (
                <div className="mt-6 space-y-4">
                    {visible.map((r) => (
                        <article
                            key={r.id}
                            data-testid={`reservation-row-${r.id}`}
                            className="border border-white/10 bg-ink-soft p-6 flex flex-col lg:flex-row lg:items-center gap-5 justify-between"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 flex-1">
                                <div>
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-stone2">Guest</p>
                                    <p className="mt-1 text-sm text-cream">{r.name}</p>
                                    <p className="text-xs text-stone2">{r.phone}</p>
                                    <p className="text-xs text-stone2">{r.email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-stone2">Date & Time</p>
                                    <p className="mt-1 text-sm text-cream">{r.date} · {r.time}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-stone2">Guests</p>
                                    <p className="mt-1 text-sm text-cream">{r.guests}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-stone2">Request</p>
                                    <p className="mt-1 text-xs text-stone2 leading-relaxed">
                                        {r.special_request || "—"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    data-testid={`reservation-status-${r.id}`}
                                    className={`text-[10px] tracking-[0.18em] uppercase border px-3 py-1.5 ${BADGE[r.status] || BADGE.pending}`}
                                >
                                    {r.status}
                                </span>
                                {r.status !== "confirmed" && (
                                    <button
                                        data-testid={`reservation-confirm-${r.id}`}
                                        disabled={busyId === r.id}
                                        onClick={() => setStatus(r.id, "confirmed")}
                                        className={`${btnBase} border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10`}
                                    >
                                        Confirm
                                    </button>
                                )}
                                {r.status !== "completed" && r.status !== "cancelled" && (
                                    <button
                                        data-testid={`reservation-complete-${r.id}`}
                                        disabled={busyId === r.id}
                                        onClick={() => setStatus(r.id, "completed")}
                                        className={`${btnBase} border-white/25 text-stone2 hover:text-cream`}
                                    >
                                        Complete
                                    </button>
                                )}
                                {r.status !== "cancelled" && (
                                    <button
                                        data-testid={`reservation-cancel-${r.id}`}
                                        disabled={busyId === r.id}
                                        onClick={() => setStatus(r.id, "cancelled")}
                                        className={`${btnBase} border-red-500/50 text-red-400 hover:bg-red-500/10`}
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    data-testid={`reservation-delete-${r.id}`}
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
