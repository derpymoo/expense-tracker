"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    if (status === "loading") return <p style={{ padding: 24 }}>Loading...</p>;
    if (!session) return null;

    return (
        <div className="page-shell">
            <aside className="sidebar">
                <div className="logo-row">
                    <div className="auth-logo">ET</div>
                    Expense Tracker
                </div>
                <nav className="nav-list">
                    <div className="nav-item active">Dashboard</div>
                    <div className="nav-item">Transactions</div>
                    <div className="nav-item">Budgets</div>
                    <div className="nav-item">Reports</div>
                    <div className="nav-item">Settings</div>
                </nav>
                <div className="sidebar-footer">
                    <button className="btn ghost" type="button">
                        Logout
                    </button>
                </div>
            </aside>

            <section className="content">
                <header className="topbar">
                    <div className="search">
                        <span className="input-icon">S</span>
                        <input placeholder="Search transactions, merchants..." />
                    </div>
                    <div className="topbar-actions">
                        <button className="btn secondary" type="button">
                            + Add
                        </button>
                        <button className="icon-btn" type="button" aria-label="Notifications">
                            N
                        </button>
                        <div className="avatar">JD</div>
                    </div>
                </header>

                <div className="content-inner">
                    <div>
                        <p className="auth-subtitle">Overview</p>
                        <h1 className="page-title">Dashboard</h1>
                        <p className="auth-subtitle">
                            Signed in as {(session.user as any)?.email}
                        </p>
                    </div>

                    <section className="summary-grid">
                        <div className="summary-card highlight">
                            <span className="auth-subtitle">Total Balance</span>
                            <strong>$12,480.40</strong>
                        </div>
                        <div className="summary-card">
                            <span className="auth-subtitle">Total Income</span>
                            <strong className="amount income">$5,640.00</strong>
                        </div>
                        <div className="summary-card">
                            <span className="auth-subtitle">Total Expenses</span>
                            <strong className="amount expense">$3,214.20</strong>
                        </div>
                        <div className="summary-card">
                            <span className="auth-subtitle">This Month</span>
                            <strong>$1,820.50</strong>
                        </div>
                    </section>

                    <section className="chart-grid">
                        <div className="chart-card">
                            <div className="card-header">
                                <h2 className="page-title" style={{ fontSize: 16 }}>
                                    Monthly Spending
                                </h2>
                                <span className="pill">Feb</span>
                            </div>
                            <div className="chart-placeholder" />
                            <div className="bar">
                                <span style={{ width: "68%" }} />
                            </div>
                        </div>
                        <div className="chart-card">
                            <div className="card-header">
                                <h2 className="page-title" style={{ fontSize: 16 }}>
                                    Expense Breakdown
                                </h2>
                            </div>
                            <div className="chart-placeholder" />
                        </div>
                    </section>

                    <section className="chart-card">
                        <div className="card-header">
                            <h2 className="page-title" style={{ fontSize: 16 }}>
                                Category Bar Chart
                            </h2>
                        </div>
                        <div className="bar">
                            <span style={{ width: "72%" }} />
                        </div>
                        <div className="bar">
                            <span style={{ width: "54%" }} />
                        </div>
                        <div className="bar">
                            <span style={{ width: "38%" }} />
                        </div>
                    </section>

                    <section className="table-card">
                        <div className="card-header">
                            <h2 className="page-title" style={{ fontSize: 16 }}>
                                Recent Transactions
                            </h2>
                            <button className="btn secondary" type="button">
                                View all
                            </button>
                        </div>
                        <div className="table">
                            <div className="table-row">
                                <span>Feb 21</span>
                                <span>Coffee Avenue</span>
                                <span>Dining</span>
                                <span className="tag expense">Expense</span>
                                <span className="amount expense">-$12.40</span>
                            </div>
                            <div className="table-row">
                                <span>Feb 20</span>
                                <span>Paycheck</span>
                                <span>Income</span>
                                <span className="tag income">Income</span>
                                <span className="amount income">+$2,840.00</span>
                            </div>
                            <div className="table-row">
                                <span>Feb 19</span>
                                <span>Market Fresh</span>
                                <span>Groceries</span>
                                <span className="tag expense">Expense</span>
                                <span className="amount expense">-$84.22</span>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
}
