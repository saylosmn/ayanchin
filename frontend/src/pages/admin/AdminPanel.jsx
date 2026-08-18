import { useEffect, useState } from "react";
import axios from "axios";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { API } from "@/data/site";

const TOKEN_KEY = "ayanchin_admin_token";

export default function AdminPanel() {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(() => !!localStorage.getItem(TOKEN_KEY));

    useEffect(() => {
        document.title = "Admin | Ayanchin Downtown Restaurant";
    }, []);

    useEffect(() => {
        if (!token) {
            setChecking(false);
            return;
        }
        axios
            .get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => setUser(res.data))
            .catch(() => {
                localStorage.removeItem(TOKEN_KEY);
                setToken(null);
            })
            .finally(() => setChecking(false));
    }, [token]);

    const onLogin = (newToken, newUser) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        setUser(newUser);
        setToken(newToken);
    };

    const onLogout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
    };

    if (checking) {
        return (
            <div className="min-h-screen bg-ink flex items-center justify-center">
                <p data-testid="admin-loading" className="text-stone2 text-xs tracking-[0.3em] uppercase">
                    Loading…
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ink text-cream font-sans antialiased">
            {user && token ? (
                <AdminDashboard token={token} user={user} onLogout={onLogout} />
            ) : (
                <AdminLogin onLogin={onLogin} />
            )}
        </div>
    );
}
