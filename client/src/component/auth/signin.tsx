"use client";

import { useUserContext } from "../../contextProvider";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useGoogleLogin } from "@react-oauth/google";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { registerWithGoogle, loginWithEmail } = useAuthentication();
  const { setUser } = useUserContext();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    loginWithEmail.mutate({ email, password }, {
      onSuccess: (v) => {
        toast("Logged in successfully");
        localStorage.setItem("access_token", v.data.access_token);
        setUser({
          isAuthenticated: true,
          role: v.data.data.role,
          email: v.data.data.email,
          userName: v.data.data.userName,
          profilePicture: v.data.data.profilePicture,
        });
        setLoading(false);
      },
      onError: (e: any) => {
        setLoading(false);
        if (e.response) toast.error(e.response.data.message);
      },
    });
  };

  const handleGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const token = tokenResponse.access_token;
      registerWithGoogle.mutate(token, {
        onSuccess: (v) => {
          toast(v.data.message);
          localStorage.setItem("access_token", v.data.access_token);
          setUser({
            isAuthenticated: true,
            role: v.data.data.role,
            email: v.data.data.email,
            userName: v.data.data.userName,
            profilePicture: v.data.data.profilePicture,
          });
        },
        onError: (e: any) => {
          if (e.response) toast.error(e.response.data.message);
        },
      });
    },
    onError: () => console.log("Login Failed"),
  });

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

        .lg-root {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          font-family: var(--font);
          color: var(--text-primary);
        }

        /* Left brand panel */
        .lg-panel {
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

        .lg-panel::before {
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

        .lg-panel::after {
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

        .lg-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .lg-brand-icon {
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

        .lg-brand-name {
          font-size: 17px;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 0.3px;
        }

        .lg-panel-body {
          position: relative;
          z-index: 1;
        }

        .lg-panel-tag {
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

        .lg-panel-tag-dot {
          width: 6px;
          height: 6px;
          background: #34d399;
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.8); }
        }

        .lg-panel-heading {
          font-size: 32px;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 18px;
          letter-spacing: -0.5px;
        }

        .lg-panel-heading span { color: rgba(255,255,255,0.5); }

        .lg-panel-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          max-width: 280px;
        }

        .lg-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 36px;
        }

        .lg-stat {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 16px;
        }

        .lg-stat-value {
          font-size: 22px;
          font-weight: 600;
          color: #ffffff;
          font-family: var(--font-mono);
          line-height: 1;
          margin-bottom: 5px;
        }

        .lg-stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.3px;
        }

        .lg-panel-footer {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          position: relative;
          z-index: 1;
        }

        /* Main form area */
        .lg-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .lg-card {
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

        /* Card header */
        .lg-card-header { margin-bottom: 28px; }

        .lg-card-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--accent);
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .lg-card-eyebrow-dot {
          width: 5px;
          height: 5px;
          background: var(--accent);
          border-radius: 50%;
        }

        .lg-card-title {
          font-size: 22px;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: -0.3px;
          margin-bottom: 6px;
        }

        .lg-card-sub {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Google button */
        .lg-google-btn {
          width: 100%;
          padding: 11px 18px;
          background: #fff;
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          font-family: var(--font);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          margin-bottom: 20px;
          box-shadow: var(--shadow-sm);
        }

        .lg-google-btn:hover {
          border-color: #c5cae9;
          background: #fafbff;
          box-shadow: 0 2px 8px rgba(79,110,247,0.1);
        }

        /* Divider */
        .lg-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .lg-divider-line { flex: 1; height: 1px; background: var(--border); }

        .lg-divider-text {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        /* Fields */
        .lg-field { margin-bottom: 14px; }

        .lg-label {
          display: block;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 7px;
          letter-spacing: 0.1px;
        }

        .lg-input-wrap { position: relative; }

        .lg-input {
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

        .lg-input:hover { border-color: #c5cae9; }

        .lg-input:focus {
          border-color: var(--border-focus);
          box-shadow: var(--shadow-focus);
        }

        .lg-input::placeholder { color: var(--text-muted); }
        .lg-input-pw { padding-right: 44px; }

        .lg-eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
          border-radius: 4px;
        }

        .lg-eye-btn:hover { color: var(--text-primary); }

        /* Forgot row */
        .lg-row {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 18px;
          margin-top: -2px;
        }

        .lg-forgot {
          font-size: 12.5px;
          font-weight: 500;
          color: var(--accent);
          text-decoration: none;
          transition: opacity 0.15s;
        }

        .lg-forgot:hover { opacity: 0.7; text-decoration: underline; }

        /* Submit button */
        .lg-btn {
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
          letter-spacing: 0.2px;
          box-shadow: 0 2px 8px rgba(79,110,247,0.3);
        }

        .lg-btn:not(:disabled):hover {
          background: var(--accent-hover);
          box-shadow: 0 4px 14px rgba(79,110,247,0.4);
          transform: translateY(-1px);
        }

        .lg-btn:active { transform: translateY(0); }

        .lg-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }

        .lg-spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Register link */
        .lg-register {
          margin-top: 22px;
          font-size: 13px;
          color: var(--text-secondary);
          text-align: center;
        }

        .lg-register a {
          color: var(--accent);
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.15s;
        }

        .lg-register a:hover { opacity: 0.75; text-decoration: underline; }

        /* Divider between btn and register */
        .lg-card-divider {
          height: 1px;
          background: var(--border);
          margin: 22px 0;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .lg-panel { display: none; }
        }

        @media (max-width: 540px) {
          .lg-card { padding: 28px 22px; }
        }
      `}</style>

      <div className="lg-root">
        {/* Left Brand Panel */}
        <aside className="lg-panel">
          <div className="lg-brand">
            <div className="lg-brand-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.9"/>
                <rect x="11" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.5"/>
                <rect x="2" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.5"/>
                <rect x="11" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.7"/>
              </svg>
            </div>
            <Link to="/">
            <span className="lg-brand-name">Smart Leads</span>
          </Link>
          </div>

          <div className="lg-panel-body">
            <div className="lg-panel-tag">
              <div className="lg-panel-tag-dot" />
              Lead Management Platform
            </div>
            <h2 className="lg-panel-heading">
              Welcome<br />
              <span>back to</span><br />
              your pipeline.
            </h2>
            <p className="lg-panel-desc">
              Pick up right where you left off. Your leads, filters, and team are ready.
            </p>

            <div className="lg-stats">
              {[
                { value: "2.4k+", label: "Leads tracked" },
                { value: "98%",   label: "Uptime SLA" },
                { value: "4 src", label: "Lead sources" },
                { value: "RBAC",  label: "Access control" },
              ].map(({ label }) => (
                <div className="lg-stat" key={label}>
                  <div className="lg-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg-panel-footer">
            © {new Date().getFullYear()} Smart Leads Dashboard
          </div>
        </aside>

        {/* Right Form Area */}
        <main className="lg-main">
          <div className="lg-card">

            <div className="lg-card-header">
              <div className="lg-card-eyebrow">
                <div className="lg-card-eyebrow-dot" />
                Secure sign in
              </div>
              <h1 className="lg-card-title">Welcome back</h1>
              <p className="lg-card-sub">Sign in to your Smart Leads account to continue.</p>
            </div>

            <button className="lg-google-btn" onClick={() => handleGoogle()} type="button">
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              {registerWithGoogle.isPending ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Loader size={14} className="animate-spin" /> Signing in with Google...
                </span>
              ) : "Continue with Google"}
            </button>

            <div className="lg-divider">
              <div className="lg-divider-line" />
              <span className="lg-divider-text">or</span>
              <div className="lg-divider-line" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="lg-field">
                <label htmlFor="email" className="lg-label">Email address</label>
                <input
                  id="email"
                  type="email"
                  className="lg-input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="lg-field">
                <label htmlFor="password" className="lg-label">Password</label>
                <div className="lg-input-wrap">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="lg-input lg-input-pw"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="lg-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="lg-row">
                <a href="/forgot-password" className="lg-forgot">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="lg-btn"
                disabled={!email || !password || loading}
              >
                {loading && <span className="lg-spinner" />}
                {loading ? "Signing in..." : "Sign in →"}
              </button>
            </form>

            <div className="lg-card-divider" />

            <p className="lg-register">
              Don't have an account? <a href="/signup">Create one for free</a>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}