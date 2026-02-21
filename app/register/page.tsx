"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMsg(null);

        if (password !== confirm) {
            setMsg("Passwords do not match");
            return;
        }

        setLoading(true);

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
        });

        setLoading(false);

        if (res.ok) {
            setMsg("Registered! Redirecting to login...");
            setTimeout(() => router.push("/login"), 700);
        } else {
            const text = await res.text();
            try {
                const data = JSON.parse(text) as { error?: string };
                setMsg(data.error ?? "Registration failed");
            } catch {
                setMsg(text || "Registration failed");
            }
        }
    }

    const [showPassword, setShowPassword] = useState(false);
    const [confirm, setConfirm] = useState("");

    return (
        <main className="auth-shell">
            <section className="auth-card">
                <div className="auth-logo">ET</div>
                <div>
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Start tracking your expenses today</p>
                </div>

                <form className="form-grid" onSubmit={onSubmit}>
                    <div className="field">
                        <label htmlFor="register-name">Full Name</label>
                        <div className="input-wrap">
                            <span className="input-icon">ID</span>
                            <input
                                className="input"
                                id="register-name"
                                placeholder="Jane Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="register-email">Email</label>
                        <div className="input-wrap">
                            <span className="input-icon">@</span>
                            <input
                                className="input"
                                id="register-email"
                                placeholder="you@company.com"
                                type="email"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="register-password">Password</label>
                        <div className="input-wrap">
                            <span className="input-icon">*</span>
                            <input
                                className="input"
                                id="register-password"
                                placeholder="Minimum 8 characters"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                className="input-toggle"
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="register-confirm">Confirm Password</label>
                        <div className="input-wrap">
                            <span className="input-icon">OK</span>
                            <input
                                className="input"
                                id="register-confirm"
                                placeholder="Re-enter password"
                                type={showPassword ? "text" : "password"}
                                value={confirm}
                                required
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="btn primary" disabled={loading} type="submit">
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                    {msg && <p className="auth-footer">{msg}</p>}
                </form>

                <div className="divider">OR</div>
                <button className="social-btn" type="button">
                    <span>G</span> Continue with Google
                </button>
                <p className="auth-footer">
                    Already have an account? <Link href="/login">Sign in</Link>
                </p>
            </section>
        </main>
    );
}
