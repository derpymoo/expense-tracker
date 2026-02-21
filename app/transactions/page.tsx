"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Txn = {
    id: string;
    type: "INCOME" | "EXPENSE";
    amountCents: number;
    date: string;
    merchant?: string | null;
    note?: string | null;
};

export default function TransactionsPage() {
    const { status } = useSession();
    const router = useRouter();

    const [txns, setTxns] = useState<Txn[]>([]);
    const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
    const [amount, setAmount] = useState("12.34");
    const [merchant, setMerchant] = useState("");
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [msg, setMsg] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    async function load() {
        const res = await fetch("/api/transactions");
        if (!res.ok) return;
        const data = await res.json();
        setTxns(data);
    }

    useEffect(() => {
        if (status === "authenticated") load();
    }, [status]);

    async function addTxn(e: React.FormEvent) {
        e.preventDefault();
        setMsg(null);

        const amountCents = Math.round(Number(amount) * 100);
        if (!Number.isFinite(amountCents) || amountCents <= 0) {
            setMsg("Amount must be > 0");
            return;
        }

        const res = await fetch("/api/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type,
                amountCents,
                date: new Date(date).toISOString(),
                merchant: merchant || undefined,
            }),
        });

        if (res.ok) {
            setMsg("Added!");
            setMerchant("");
            await load();
        } else {
            setMsg("Failed to add transaction");
        }
    }

    return (
        <div className="page-shell">
            <aside className="sidebar">
                <div className="logo-row">
                    <div className="auth-logo">ET</div>
                    Expense Tracker
                </div>
                <nav className="nav-list">
                    <div className="nav-item">Dashboard</div>
                    <div className="nav-item active">Transactions</div>
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
                        <input placeholder="Search transactions, categories..." />
                    </div>
                    <div className="topbar-actions">
                        <button className="btn primary" type="button">
                            Add Transaction
                        </button>
                        <button className="icon-btn" type="button" aria-label="Notifications">
                            N
                        </button>
                        <div className="avatar">JD</div>
                    </div>
                </header>

                <div className="content-inner">
                    <div>
                        <p className="auth-subtitle">Ledger</p>
                        <h1 className="page-title">Transactions</h1>
                    </div>

                    <section className="table-card">
                        <div className="card-header">
                            <h2 className="page-title" style={{ fontSize: 16 }}>
                                Filters
                            </h2>
                        </div>
                        <div className="filters">
                            <div className="field">
                                <label htmlFor="filter-category">Category</label>
                                <select className="filter-input" id="filter-category">
                                    <option>All categories</option>
                                    <option>Groceries</option>
                                    <option>Dining</option>
                                    <option>Travel</option>
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="filter-date-from">Date Range</label>
                                <input
                                    className="filter-input"
                                    id="filter-date-from"
                                    type="date"
                                />
                                <input
                                    className="filter-input"
                                    id="filter-date-to"
                                    type="date"
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="filter-search">Search</label>
                                <input
                                    className="filter-input"
                                    id="filter-search"
                                    placeholder="Merchant or note"
                                />
                            </div>
                            <button className="btn secondary" type="button">
                                Apply
                            </button>
                        </div>
                    </section>

                    <section className="table-card">
                        <div className="card-header">
                            <h2 className="page-title" style={{ fontSize: 16 }}>
                                Recent Transactions
                            </h2>
                            <span className="pill">{txns.length} items</span>
                        </div>
                        <div className="table">
                            <div className="table-row table-head actions">
                                <span>Date</span>
                                <span>Description</span>
                                <span>Category</span>
                                <span>Type</span>
                                <span>Amount</span>
                                <span>Actions</span>
                            </div>
                            {txns.map((t) => (
                                <div className="table-row actions" key={t.id}>
                                    <span>{new Date(t.date).toLocaleDateString()}</span>
                                    <span>{t.merchant || "Untitled transaction"}</span>
                                    <span>{t.note || "General"}</span>
                                    <span
                                        className={`tag ${
                                            t.type === "EXPENSE" ? "expense" : "income"
                                        }`}
                                    >
                                        {t.type === "EXPENSE" ? "Expense" : "Income"}
                                    </span>
                                    <span
                                        className={`amount ${
                                            t.type === "EXPENSE" ? "expense" : "income"
                                        }`}
                                    >
                                        {t.type === "EXPENSE" ? "-" : "+"}$
                                        {(t.amountCents / 100).toFixed(2)}
                                    </span>
                                    <span className="table-actions">
                                        <button type="button">Edit</button>
                                        <button type="button">Delete</button>
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="pagination">
                            <button className="btn ghost" type="button">
                                Prev
                            </button>
                            <span className="pill">1 / 4</span>
                            <button className="btn ghost" type="button">
                                Next
                            </button>
                        </div>
                    </section>
                </div>
            </section>

            <div className="modal" style={{ display: "none" }}>
                <div className="modal-card">
                    <div className="card-header">
                        <h2 className="page-title" style={{ fontSize: 18 }}>
                            Add Transaction
                        </h2>
                    </div>
                    <form className="form-grid" onSubmit={addTxn}>
                        <div className="field">
                            <label htmlFor="txn-description">Description</label>
                            <input
                                className="input"
                                id="txn-description"
                                value={merchant}
                                onChange={(e) => setMerchant(e.target.value)}
                                placeholder="Merchant or note"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="txn-amount">Amount</label>
                            <input
                                className="input"
                                id="txn-amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="txn-category">Category</label>
                            <select className="input" id="txn-category">
                                <option>General</option>
                                <option>Dining</option>
                                <option>Groceries</option>
                                <option>Travel</option>
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="txn-type">Type</label>
                            <select
                                className="input"
                                id="txn-type"
                                value={type}
                                onChange={(e) => setType(e.target.value as any)}
                            >
                                <option value="EXPENSE">Expense</option>
                                <option value="INCOME">Income</option>
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="txn-date">Date</label>
                            <input
                                className="input"
                                id="txn-date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                type="date"
                            />
                        </div>
                        <button className="btn primary" type="submit">
                            Save
                        </button>
                        {msg && <p className="auth-footer">{msg}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
