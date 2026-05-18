"use client";

import { useState, type SubmitEvent } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #f8f9fc;
          --surface: #ffffff;
          --border: #e4e7ef;
          --border-focus: #4f6ef7;
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --text-muted: #9ca3af;
          --accent: #4f6ef7;
          --accent-hover: #3b55e0;
          --accent-light: #eef1fe;
          --success: #10b981;
          --danger: #ef4444;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
          --shadow-focus: 0 0 0 3px rgba(79,110,247,0.15);
          --radius: 10px;
          --radius-sm: 6px;
          --font: 'DM Sans', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }

        .fp-root {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          font-family: var(--font);
          color: var(--text-primary);
        }

        /* Left brand panel */
        .fp-panel {
          width: 420px;
          flex-shrink: 0;
          background: linear-gradient(145deg, #1e2d6b 0%, #2d3f9e 50%, #3b55e0 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 44px;
          position: relative;
          overflow: hidden;
        }

        .fp-panel::before {
          content: '';
          position: absolute;
          top: -120px;
          right: -80px;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          pointer-events: none;
        }

        .fp-panel::after {
          content: '';
          position: absolute;
          bottom: -60px;
          left: -60px;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          pointer-events: none;
        }

        .fp-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .fp-brand-icon {
          width: 38px;
          height: 38px;
          background: rgba(255,255,255,0.15);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .fp-brand-name {
          font-size: 17px;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 0.3px;
        }

        .fp-panel-body {
          position: relative;
          z-index: 1;
        }

        .fp-panel-tag {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 20px;
          padding: 5px 14px;
          font-size: 12px;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.4px;
          margin-bottom: 28px;
        }

        .fp-panel-tag-dot {
          width: 6px;
          height: 6px;
          background: #fbbf24;
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.8); }
        }

        .fp-panel-heading {
          font-size: 32px;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 18px;
          letter-spacing: -0.5px;
        }

        .fp-panel-heading span { color: rgba(255,255,255,0.5); }

        .fp-panel-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          max-width: 280px;
        }

        .fp-panel-steps {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-top: 36px;
        }

        .fp-panel-step {
          display: flex;
          gap: 16px;
          position: relative;
        }

        .fp-panel-step:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 9px;
          top: 24px;
          bottom: -4px;
          width: 1.5px;
          background: rgba(255,255,255,0.15);
        }

        .fp-panel-step + .fp-panel-step {
          margin-top: 20px;
        }

        .fp-step-num {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
          font-family: var(--font-mono);
          flex-shrink: 0;
          margin-top: 1px;
        }

        .fp-step-num.done {
          background: rgba(52,211,153,0.2);
          border-color: rgba(52,211,153,0.4);
        }

        .fp-step-text {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          line-height: 1.5;
          padding-bottom: 4px;
        }

        .fp-step-text strong {
          display: block;
          color: rgba(255,255,255,0.9);
          font-weight: 500;
          font-size: 13px;
          margin-bottom: 2px;
        }

        .fp-panel-footer {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          position: relative;
          z-index: 1;
        }

        /* Main form area */
        .fp-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .fp-card {
          width: 100%;
          max-width: 440px;
          background: var(--surface);
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border);
          padding: 40px 40px 36px;
          animation: fadeSlide 0.35s ease forwards;
        }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Card icon */
        .fp-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #fef3c7;
          border: 1px solid #fde68a;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .fp-card-icon.success {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          border-color: #6ee7b7;
        }

        /* Card header */
        .fp-card-header { margin-bottom: 28px; }

        .fp-card-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .fp-card-title {
          font-size: 22px;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: -0.3px;
          margin-bottom: 8px;
        }

        .fp-card-sub {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .fp-card-sub strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        /* Info notice */
        .fp-notice {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          background: var(--accent-light);
          border: 1px solid #c7d2fe;
          border-radius: var(--radius-sm);
          margin-bottom: 22px;
        }

        .fp-notice-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          margin-top: 1px;
          color: var(--accent);
        }

        .fp-notice-text {
          font-size: 12.5px;
          color: #3730a3;
          line-height: 1.5;
        }

        /* Field */
        .fp-field { margin-bottom: 16px; }

        .fp-label {
          display: block;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 7px;
          letter-spacing: 0.1px;
        }

        .fp-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          background: #fff;
          font-family: var(--font);
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }

        .fp-input:hover { border-color: #c5cae9; }

        .fp-input:focus {
          border-color: var(--border-focus);
          box-shadow: var(--shadow-focus);
        }

        .fp-input::placeholder { color: var(--text-muted); }

        /* Submit button */
        .fp-btn {
          width: 100%;
          padding: 12px 20px;
          background: var(--accent);
          color: #ffffff;
          border: none;
          border-radius: var(--radius-sm);
          font-family: var(--font);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.18s, box-shadow 0.18s, transform 0.12s;
          margin-top: 4px;
          letter-spacing: 0.2px;
          box-shadow: 0 2px 8px rgba(79,110,247,0.3);
        }

        .fp-btn:not(:disabled):hover {
          background: var(--accent-hover);
          box-shadow: 0 4px 14px rgba(79,110,247,0.4);
          transform: translateY(-1px);
        }

        .fp-btn:active { transform: translateY(0); }

        .fp-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Success box */
        .fp-success-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: var(--radius-sm);
          margin: 22px 0;
        }

        .fp-success-box-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #dcfce7;
          border: 1px solid #86efac;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .fp-success-box-text {
          font-size: 13px;
          color: #166534;
          line-height: 1.6;
        }

        .fp-success-box-text strong {
          display: block;
          font-weight: 600;
          margin-bottom: 2px;
          color: #14532d;
        }

        /* Expiry note */
        .fp-expiry {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 24px;
          font-family: var(--font-mono);
        }

        .fp-expiry-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--warning, #f59e0b);
          flex-shrink: 0;
        }

        /* Back / secondary link */
        .fp-back {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font);
          padding: 0;
          transition: color 0.15s;
          text-decoration: none;
        }

        .fp-back:hover { color: var(--text-primary); }
        .fp-back:hover svg { transform: translateX(-3px); }
        .fp-back svg { transition: transform 0.18s; }

        .fp-card-divider {
          height: 1px;
          background: var(--border);
          margin: 22px 0;
        }

        .fp-retry-btn {
          width: 100%;
          padding: 11px 18px;
          background: #fff;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: var(--font);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          box-shadow: var(--shadow-sm);
          margin-bottom: 16px;
        }

        .fp-retry-btn:hover {
          border-color: #c5cae9;
          background: #fafbff;
          box-shadow: 0 2px 8px rgba(79,110,247,0.1);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .fp-panel { display: none; }
        }

        @media (max-width: 540px) {
          .fp-card { padding: 28px 22px; }
        }
      `}</style>

      <div className="fp-root">

        {/* Left Brand Panel */}
        <aside className="fp-panel">
          <div className="fp-brand">
            <div className="fp-brand-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.9"/>
                <rect x="11" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.5"/>
                <rect x="2" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.5"/>
                <rect x="11" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.7"/>
              </svg>
            </div>
            <Link to="/">
            <span className="fp-brand-name">Smart Leads</span>
          </Link>
          </div>

          <div className="fp-panel-body">
            <div className="fp-panel-tag">
              <div className="fp-panel-tag-dot" />
              Account Recovery
            </div>
            <h2 className="fp-panel-heading">
              Locked out?<br />
              <span>We've got</span><br />
              you covered.
            </h2>
            <p className="fp-panel-desc">
              Follow these steps to regain access to your Smart Leads account securely.
            </p>

            <ul className="fp-panel-steps">
              {[
                { n: "1", title: "Enter your email", desc: "We'll look up your account", done: submitted },
                { n: "2", title: "Check your inbox",  desc: "Click the link we send you", done: false },
                { n: "3", title: "Set a new password", desc: "Choose something strong", done: false },
              ].map(({ n, title, desc, done }) => (
                <li className="fp-panel-step" key={n}>
                  <div className={`fp-step-num ${done ? "done" : ""}`}>
                    {done ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4 7L8 3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : n}
                  </div>
                  <div className="fp-step-text">
                    <strong>{title}</strong>
                    {desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="fp-panel-footer">
            © {new Date().getFullYear()} Smart Leads Dashboard
          </div>
        </aside>

        {/* Right Form Area */}
        <main className="fp-main">
          <div className="fp-card">

            {!submitted ? (
              <>
                <div className="fp-card-icon">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="2" y="6" width="18" height="13" rx="2" stroke="#d97706" strokeWidth="1.5"/>
                    <path d="M2 9l9 5 9-5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M11 3v3M8.5 4.5L11 3l2.5 1.5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div className="fp-card-header">
                  <div className="fp-card-eyebrow">Account Recovery · Step 1 of 3</div>
                  <h1 className="fp-card-title">Forgot your password?</h1>
                  <p className="fp-card-sub">
                    No problem. Enter the email linked to your account and we'll send a reset link.
                  </p>
                </div>

                <div className="fp-notice">
                  <svg className="fp-notice-icon" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  <span className="fp-notice-text">
                    The reset link expires in <strong>2 minutes</strong> and can only be used once.
                  </span>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="fp-field">
                    <label htmlFor="email" className="fp-label">Email address</label>
                    <input
                      id="email"
                      type="email"
                      className="fp-input"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      autoFocus
                    />
                  </div>

                  <button type="submit" className="fp-btn" disabled={!email}>
                    Send reset link →
                  </button>
                </form>

                <div className="fp-card-divider" />

                <a href="/signin" className="fp-back">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back to sign in
                </a>
              </>
            ) : (
              <>
                <div className="fp-card-icon success">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M4 11L9 16L18 7" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div className="fp-card-header">
                  <div className="fp-card-eyebrow">Account Recovery · Step 2 of 3</div>
                  <h1 className="fp-card-title">Check your inbox</h1>
                  <p className="fp-card-sub">
                    We've sent a reset link to <strong>{email}</strong>.
                  </p>
                </div>

                <div className="fp-success-box">
                  <div className="fp-success-box-icon">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="fp-success-box-text">
                    <strong>Email sent successfully</strong>
                    Click the link in the email to set a new password. Check your spam folder if you don't see it.
                  </div>
                </div>

                <div className="fp-expiry">
                  <div className="fp-expiry-dot" />
                  Link expires in 15 minutes
                </div>

                <button
                  className="fp-retry-btn"
                  onClick={() => { setSubmitted(false); setEmail(""); }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7a5 5 0 1 0 1-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    <path d="M3 4H1V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Try a different email
                </button>

                <a href="/signin" className="fp-back">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back to sign in
                </a>
              </>
            )}

          </div>
        </main>
      </div>
    </>
  );
}