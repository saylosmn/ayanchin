import { useState } from "react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { API } from "@/data/site";

const inputCls =
    "w-full bg-ink border border-white/15 text-sm text-cream placeholder:text-stone2/50 px-4 py-3.5 focus:border-gold focus:outline-none transition-colors duration-300";

export default function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setError("");
        setLoading(true);
        try {
            const { data } = await axios.post(`${API}/auth/login`, {
                email: email.trim(),
                password,
            });
            onLogin(data.token, data.user);
        } catch (err) {
            const detail = err.response?.data?.detail;
            setError(typeof detail === "string" ? detail : "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div data-testid="admin-login-card" className="w-full max-w-md border border-white/10 bg-ink-soft p-9 md:p-11">
                <div className="flex items-center gap-3 mb-8">
                    <Lock size={18} className="text-gold" aria-hidden="true" />
                    <div>
                        <p className="font-serif text-2xl text-cream">
                            Ayanchin <span className="italic text-gold">Downtown</span>
                        </p>
                        <p className="text-[11px] tracking-[0.3em] uppercase text-stone2 mt-1">Staff Admin</p>
                    </div>
                </div>

                <form onSubmit={submit} data-testid="admin-login-form">
                    <label htmlFor="admin-email" className="block text-[11px] tracking-[0.2em] uppercase text-stone2 mb-2">
                        Email
                    </label>
                    <input
                        id="admin-email"
                        data-testid="admin-login-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin email"
                        autoComplete="email"
                        required
                        className={inputCls}
                    />
                    <label htmlFor="admin-password" className="block text-[11px] tracking-[0.2em] uppercase text-stone2 mb-2 mt-5">
                        Password
                    </label>
                    <input
                        id="admin-password"
                        data-testid="admin-login-password-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                        className={inputCls}
                    />
                    {error && (
                        <p data-testid="admin-login-error" className="mt-4 text-xs text-red-400">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        data-testid="admin-login-submit-button"
                        disabled={loading}
                        className="mt-7 w-full bg-gold text-ink text-xs font-semibold tracking-[0.25em] uppercase px-8 py-4 hover:bg-cream transition-colors duration-300 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
                        {loading ? "Signing In…" : "Sign In"}
                    </button>
                </form>

                <a
                    href="/"
                    data-testid="admin-back-to-site-link"
                    className="mt-7 block text-center text-xs tracking-[0.2em] uppercase text-stone2 hover:text-gold transition-colors duration-300"
                >
                    ← Back to Website
                </a>
            </div>
        </div>
    );
}
