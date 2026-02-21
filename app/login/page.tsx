"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMsg(null);
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl,
        });

        setLoading(false);

        if (res?.ok) {
            router.push(callbackUrl);
        } else {
            setMsg("Invalid email or password");
        }
    }

    const [showPassword, setShowPassword] = useState(false);

    return (
        <section className="auth-card">
            <div className="auth-logo">ET</div>
            <div>
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to your account</p>
            </div>

            <form className="form-grid" onSubmit={onSubmit}>
                <div className="field">
                    <label htmlFor="login-email">Email</label>
                    <div className="input-wrap">
                        <span className="input-icon">@</span>
                        <input
                            className="input"
                            id="login-email"
                            placeholder="you@company.com"
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="login-password">Password</label>
                    <div className="input-wrap">
                        <span className="input-icon">*</span>
                        <input
                            className="input"
                            id="login-password"
                            placeholder="Enter your password"
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
                <div className="auth-footer" style={{ textAlign: "right" }}>
                    <Link href="/forgot-password">Forgot Password?</Link>
                </div>
                <button className="btn primary" disabled={loading} type="submit">
                    {loading ? "Signing in..." : "Sign In"}
                </button>
                {msg && <p className="auth-footer">{msg}</p>}
            </form>

            <p className="auth-footer">
                Don't have an account? <Link href="/register">Register</Link>
            </p>
        </section>
    );
}

export default function LoginPage() {
    return (
        <main className="auth-shell">
            <Suspense fallback={<section className="auth-card" />}>
                <LoginForm />
            </Suspense>
        </main>
    );
}
