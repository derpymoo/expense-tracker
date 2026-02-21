import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing-shell">
      <nav className="topbar">
        <div className="logo-row">
          <div className="auth-logo">ET</div>
          Expense Tracker
        </div>
        <div className="landing-actions">
          <Link className="btn ghost" href="/login">
            Sign in
          </Link>
          <Link className="btn primary" href="/register">
            Create account
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <p className="auth-subtitle">Modern expense tracking for teams</p>
        <h1>Stay on top of spending with calm, real-time visibility.</h1>
        <p className="auth-subtitle">
          Track income, flag expenses, and close the month with confidence.
        </p>
        <div className="landing-actions">
          <Link className="btn primary" href="/register">
            Start free
          </Link>
          <Link className="btn secondary" href="/dashboard">
            View dashboard
          </Link>
        </div>
      </section>

      <section className="landing-cards">
        <div className="landing-card">
          <h3>Clean reporting</h3>
          <p className="auth-subtitle">
            Export-ready summaries with clear category insights.
          </p>
        </div>
        <div className="landing-card">
          <h3>Smart categories</h3>
          <p className="auth-subtitle">
            Auto-group transactions and keep budgets on track.
          </p>
        </div>
        <div className="landing-card">
          <h3>Fast reconciliation</h3>
          <p className="auth-subtitle">
            Review recent activity and approve changes in seconds.
          </p>
        </div>
      </section>

      <footer className="landing-footer">
        <p className="auth-subtitle">
          Ready to organize your finances in one place?
        </p>
        <Link className="btn primary" href="/register">
          Create your workspace
        </Link>
      </footer>
    </main>
  );
}
