import { useMemo, useState } from "react";
import axios from "axios";
import { CheckCircle2, Clock, Loader2, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { API, RESTAURANT } from "@/data/site";

const EMPTY = { name: "", phone: "", email: "", date: "", time: "", guests: "2", special_request: "" };

const inputCls =
    "w-full bg-ink-soft border border-white/15 text-sm text-cream placeholder:text-stone2/50 px-4 py-3.5 focus:border-gold focus:outline-none transition-colors duration-300";
const labelCls = "block text-[11px] tracking-[0.2em] uppercase text-stone2 mb-2";
const errCls = "mt-1.5 text-xs text-red-400";

export default function Reservation() {
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const [idemKey, setIdemKey] = useState(() => crypto.randomUUID());

    const today = useMemo(() => new Date().toISOString().split("T")[0], []);

    const set = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        setErrors((er) => ({ ...er, [field]: undefined }));
    };

    const validate = () => {
        const er = {};
        if (form.name.trim().length < 2) er.name = "Please enter your name.";
        if (!/^[0-9+\-\s()]{6,20}$/.test(form.phone.trim())) er.phone = "Please enter a valid phone number.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) er.email = "Please enter a valid email.";
        if (!form.date) er.date = "Please choose a date.";
        else if (form.date < today) er.date = "Date cannot be in the past.";
        if (!form.time) er.time = "Please choose a time.";
        const guests = Number(form.guests);
        if (!guests || guests < 1 || guests > 20) er.guests = "1–20 guests.";
        setErrors(er);
        return Object.keys(er).length === 0;
    };

    const submit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        if (!validate()) {
            toast.error("Please review the highlighted fields.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await axios.post(
                `${API}/reservations`,
                { ...form, guests: Number(form.guests), special_request: form.special_request || null },
                { headers: { "X-Idempotency-Key": idemKey } }
            );
            setSuccess(res.data.reservation);
            toast.success("Reservation request received.");
        } catch (err) {
            const detail = err.response?.data?.detail;
            const msg =
                typeof detail === "string"
                    ? detail
                    : Array.isArray(detail)
                      ? detail[0]?.msg
                      : "Something went wrong. Please call us at 7707 2611.";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const reset = () => {
        setForm(EMPTY);
        setErrors({});
        setSuccess(null);
        setIdemKey(crypto.randomUUID());
    };

    return (
        <section id="reservation" data-testid="reservation-section" className="scroll-mt-24 py-24 md:py-32 bg-ink">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-14">
                <div className="lg:col-span-5">
                    <SectionHeading
                        eyebrow="Reservations"
                        title="Reserve Your Table"
                        description="Send a request and our team will confirm shortly by phone. For parties larger than 20 or same-evening requests, please call us directly."
                    />
                    <Reveal delay={0.2}>
                        <ul className="mt-10 space-y-5 text-sm text-stone2">
                            <li className="flex items-start gap-3">
                                <Clock size={16} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                                {RESTAURANT.hoursNote}
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone size={16} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                                <a href={RESTAURANT.phoneHref} className="hover:text-gold transition-colors duration-300">
                                    {RESTAURANT.phoneDisplay}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={16} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                                {RESTAURANT.address}
                            </li>
                        </ul>
                    </Reveal>
                </div>

                <Reveal delay={0.15} className="lg:col-span-7">
                    <div className="border border-white/10 bg-ink-soft p-7 md:p-10">
                        {success ? (
                            <div data-testid="reservation-success-message" className="text-center py-8">
                                <CheckCircle2 size={44} className="text-gold mx-auto" aria-hidden="true" />
                                <h3 className="mt-6 font-serif text-3xl text-cream">Request Received</h3>
                                <p className="mt-4 text-sm text-stone2 max-w-md mx-auto leading-relaxed">
                                    Thank you, {success.name}. Your table for {success.guests}{" "}
                                    {success.guests === 1 ? "guest" : "guests"} on {success.date} at{" "}
                                    {success.time} has been requested. Our team will confirm shortly by
                                    phone.
                                </p>
                                <button
                                    data-testid="reservation-make-another-button"
                                    onClick={reset}
                                    className="mt-8 border border-gold/60 text-gold text-xs font-semibold tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-gold hover:text-ink transition-colors duration-300"
                                >
                                    Make Another Reservation
                                </button>
                            </div>
                        ) : (
                            <form data-testid="reservation-form" onSubmit={submit} noValidate>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="res-name" className={labelCls}>Name *</label>
                                        <input id="res-name" data-testid="reservation-name-input" type="text" value={form.name} onChange={set("name")} placeholder="Your full name" className={inputCls} autoComplete="name" />
                                        {errors.name && <p className={errCls} data-testid="reservation-error-name">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="res-phone" className={labelCls}>Phone *</label>
                                        <input id="res-phone" data-testid="reservation-phone-input" type="tel" value={form.phone} onChange={set("phone")} placeholder="7707 2611" className={inputCls} autoComplete="tel" />
                                        {errors.phone && <p className={errCls} data-testid="reservation-error-phone">{errors.phone}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="res-email" className={labelCls}>Email *</label>
                                        <input id="res-email" data-testid="reservation-email-input" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className={inputCls} autoComplete="email" />
                                        {errors.email && <p className={errCls} data-testid="reservation-error-email">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="res-date" className={labelCls}>Date *</label>
                                        <input id="res-date" data-testid="reservation-date-input" type="date" min={today} value={form.date} onChange={set("date")} className={`${inputCls} [color-scheme:dark]`} />
                                        {errors.date && <p className={errCls} data-testid="reservation-error-date">{errors.date}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="res-time" className={labelCls}>Time *</label>
                                        <input id="res-time" data-testid="reservation-time-input" type="time" value={form.time} onChange={set("time")} className={`${inputCls} [color-scheme:dark]`} />
                                        {errors.time && <p className={errCls} data-testid="reservation-error-time">{errors.time}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="res-guests" className={labelCls}>Number of Guests *</label>
                                        <select id="res-guests" data-testid="reservation-guests-select" value={form.guests} onChange={set("guests")} className={inputCls}>
                                            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                                                <option key={n} value={n}>
                                                    {n} {n === 1 ? "Guest" : "Guests"}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.guests && <p className={errCls} data-testid="reservation-error-guests">{errors.guests}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="res-notes" className={labelCls}>Special Request</label>
                                        <textarea id="res-notes" data-testid="reservation-notes-input" rows={4} value={form.special_request} onChange={set("special_request")} placeholder="Occasion, seating preference, dietary needs…" className={`${inputCls} resize-none`} maxLength={600} />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    data-testid="reservation-submit-button"
                                    disabled={submitting}
                                    className="mt-8 w-full bg-gold text-ink text-xs font-semibold tracking-[0.25em] uppercase px-8 py-4.5 py-4 hover:bg-cream transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                                >
                                    {submitting && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
                                    {submitting ? "Sending Request…" : "Reserve a Table"}
                                </button>
                                <p className="mt-4 text-[11px] text-stone2/70 text-center tracking-wide">
                                    Your details are sent securely to the restaurant and never shared.
                                </p>
                            </form>
                        )}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
