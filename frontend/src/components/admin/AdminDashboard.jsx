import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Globe, LogOut } from "lucide-react";
import { toast } from "sonner";
import ReservationsTab from "@/components/admin/ReservationsTab";
import ReviewsTab from "@/components/admin/ReviewsTab";
import { API } from "@/data/site";

export default function AdminDashboard({ token, user, onLogout }) {
    const [tab, setTab] = useState("reservations");
    const [reservations, setReservations] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const headers = { Authorization: `Bearer ${token}` };

    const load = useCallback(async () => {
        try {
            const [resRes, revRes] = await Promise.all([
                axios.get(`${API}/reservations`, { headers }),
                axios.get(`${API}/admin/reviews`, { headers }),
            ]);
            setReservations(resRes.data);
            setReviews(revRes.data);
        } catch (err) {
            if (err.response?.status === 401) {
                onLogout();
            } else {
                toast.error("Failed to load admin data.");
            }
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        load();
    }, [load]);

    const pendingReservations = reservations.filter((r) => r.status === "pending").length;
    const pendingReviews = reviews.filter((r) => r.status === "pending").length;
    const approvedReviews = reviews.filter((r) => r.status === "approved").length;

    const stats = [
        { label: "Total Reservations", value: reservations.length, testid: "stat-total-reservations" },
        { label: "Pending Reservations", value: pendingReservations, testid: "stat-pending-reservations" },
        { label: "Pending Reviews", value: pendingReviews, testid: "stat-pending-reviews" },
        { label: "Approved Reviews", value: approvedReviews, testid: "stat-approved-reviews" },
    ];

    return (
        <div data-testid="admin-dashboard" className="min-h-screen">
            <header className="border-b border-white/10 bg-ink-soft">
                <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="font-serif text-xl text-cream">
                            Ayanchin <span className="italic text-gold">Downtown</span>
                            <span className="ml-3 text-[10px] tracking-[0.3em] uppercase text-stone2 align-middle">Admin</span>
                        </p>
                        <p data-testid="admin-user-email" className="text-xs text-stone2 mt-1">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href="/"
                            data-testid="admin-view-site-link"
                            className="inline-flex items-center gap-2 border border-white/15 text-stone2 text-[11px] tracking-[0.2em] uppercase px-4 py-2.5 hover:text-cream hover:border-gold/50 transition-colors duration-300"
                        >
                            <Globe size={13} aria-hidden="true" /> View Site
                        </a>
                        <button
                            data-testid="admin-logout-button"
                            onClick={onLogout}
                            className="inline-flex items-center gap-2 border border-gold/50 text-gold text-[11px] tracking-[0.2em] uppercase px-4 py-2.5 hover:bg-gold hover:text-ink transition-colors duration-300"
                        >
                            <LogOut size={13} aria-hidden="true" /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s) => (
                        <div key={s.testid} className="border border-white/10 bg-ink-soft p-6">
                            <p data-testid={s.testid} className="font-serif text-4xl text-cream">{s.value}</p>
                            <p className="mt-2 text-[11px] tracking-[0.2em] uppercase text-stone2">{s.label}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex gap-2 border-b border-white/10">
                    <button
                        data-testid="admin-tab-reservations"
                        onClick={() => setTab("reservations")}
                        className={`text-[11px] tracking-[0.2em] uppercase px-6 py-3.5 border-b-2 -mb-px transition-colors duration-300 ${
                            tab === "reservations"
                                ? "border-gold text-gold"
                                : "border-transparent text-stone2 hover:text-cream"
                        }`}
                    >
                        Reservation Requests
                    </button>
                    <button
                        data-testid="admin-tab-reviews"
                        onClick={() => setTab("reviews")}
                        className={`text-[11px] tracking-[0.2em] uppercase px-6 py-3.5 border-b-2 -mb-px transition-colors duration-300 ${
                            tab === "reviews"
                                ? "border-gold text-gold"
                                : "border-transparent text-stone2 hover:text-cream"
                        }`}
                    >
                        Review Moderation
                    </button>
                </div>

                {loading ? (
                    <p data-testid="admin-tab-loading" className="py-16 text-center text-xs tracking-[0.3em] uppercase text-stone2">
                        Loading…
                    </p>
                ) : tab === "reservations" ? (
                    <ReservationsTab token={token} reservations={reservations} reload={load} />
                ) : (
                    <ReviewsTab token={token} reviews={reviews} reload={load} />
                )}
            </div>
        </div>
    );
}
