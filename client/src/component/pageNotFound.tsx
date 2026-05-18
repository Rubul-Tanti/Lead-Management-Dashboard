const NotFound = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #f8f9fc;
          --surface: #ffffff;
          --border: #e4e7ef;
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --text-muted: #9ca3af;
          --accent: #4f6ef7;
          --accent-hover: #3b55e0;
          --accent-light: #eef1fe;
          --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
          --radius-sm: 6px;
          --font: 'DM Sans', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }

        .nf-root {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font);
          color: var(--text-primary);
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle background grid */
        .nf-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          opacity: 0.5;
        }

        /* Large ghost 404 watermark */
        .nf-watermark {
          position: fixed;
          bottom: -40px;
          right: -20px;
          font-family: var(--font-mono);
          font-size: clamp(160px, 25vw, 320px);
          font-weight: 500;
          line-height: 1;
          color: rgba(79,110,247,0.05);
          pointer-events: none;
          user-select: none;
          letter-spacing: -8px;
        }

        .nf-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 480px;
          background: var(--surface);
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border);
          padding: 48px 44px 44px;
          text-align: center;
          animation: fadeSlide 0.4s ease forwards;
        }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Icon */
        .nf-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: var(--accent-light);
          border: 1px solid #c7d2fe;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 28px;
        }

        /* Code badge */
        .nf-code {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 6px 14px;
          margin-bottom: 20px;
        }

        .nf-code-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.6;
        }

        .nf-code-text {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 500;
          color: var(--accent);
          letter-spacing: 1px;
        }

        .nf-title {
          font-size: 26px;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: -0.4px;
          margin-bottom: 10px;
        }

        .nf-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 320px;
          margin: 0 auto 32px;
        }

        /* Actions */
        .nf-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .nf-btn-primary {
          width: 100%;
          padding: 12px 20px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          font-family: var(--font);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.18s, box-shadow 0.18s, transform 0.12s;
          box-shadow: 0 2px 8px rgba(79,110,247,0.3);
          letter-spacing: 0.2px;
        }

        .nf-btn-primary:hover {
          background: var(--accent-hover);
          box-shadow: 0 4px 14px rgba(79,110,247,0.4);
          transform: translateY(-1px);
        }

        .nf-btn-primary:active { transform: translateY(0); }

        .nf-btn-secondary {
          width: 100%;
          padding: 11px 18px;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: var(--font);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: border-color 0.18s, color 0.18s, background 0.18s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .nf-btn-secondary:hover {
          border-color: #c5cae9;
          color: var(--text-primary);
          background: #fafbff;
        }

        /* Divider */
        .nf-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0;
        }

        .nf-divider-line { flex: 1; height: 1px; background: var(--border); }

        .nf-divider-text {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        /* Brand footer */
        .nf-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }

        .nf-brand-icon {
          width: 22px;
          height: 22px;
          background: linear-gradient(135deg, #2d3f9e, #3b55e0);
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nf-brand-name {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.3px;
        }
      `}</style>

      <div className="nf-root">
        <div className="nf-watermark">404</div>

        <div className="nf-card">
          <div className="nf-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 4L4 10v8l10 6 10-6v-8L14 4z" stroke="#4f6ef7" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M14 14v4M14 10v1" stroke="#4f6ef7" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          <div className="nf-code">
            <div className="nf-code-dot" />
            <span className="nf-code-text">ERROR 404</span>
          </div>

          <h1 className="nf-title">Page not found</h1>
          <p className="nf-desc">
            The page you're looking for doesn't exist or may have been moved. Head back to your dashboard to continue.
          </p>

          <div className="nf-actions">
            <a href="/" className="nf-btn-primary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Go to Dashboard
            </a>

            <div className="nf-divider">
              <div className="nf-divider-line" />
              <span className="nf-divider-text">or</span>
              <div className="nf-divider-line" />
            </div>

            <button className="nf-btn-secondary" onClick={() => window.history.back()}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Go back
            </button>
          </div>

          <div className="nf-brand">
            <div className="nf-brand-icon">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.9"/>
                <rect x="11" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.5"/>
                <rect x="2" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.5"/>
                <rect x="11" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.7"/>
              </svg>
            </div>
            <span className="nf-brand-name">Smart Leads Dashboard</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;