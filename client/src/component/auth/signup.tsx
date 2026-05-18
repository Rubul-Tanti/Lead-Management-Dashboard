import { useUserContext } from "../../contextProvider";
import { useGoogleLogin } from "@react-oauth/google";
import { Loader } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuthentication } from "../../hooks/useAuthentication";
import { Link } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [form, setForm] = useState({ userName: "", email: "", password: "" });
  const [otpTimer, setOtpTimer] = useState(5 * 60);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { registerUserWithEmail: emailVerification, otpVerifation, registerWithGoogle } = useAuthentication();
  const { setUser } = useUserContext();

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setOtpTimer(5 * 60);
    timerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTimer = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const timerExpired = otpTimer === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const onSuccess = () => {
      toast("OTP has been sent to your email");
      setLoading(false);
      setStep(2);
      startTimer();
    };
    const onError = (err: any) => {
      toast.error(err.response.data.message);
      setLoading(false);
    };
    emailVerification.mutate(form, { onSuccess, onError });
  };

  const handleResend = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOtp(["", "", "", "", "", ""]);
    handleSubmit(e);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.join("").length < 6) return;
    setLoading(true);
    const Otp = otp.reduce((accumulator, currentVallue) => accumulator + currentVallue);
    otpVerifation.mutate({ ...form, otp: Otp }, {
      onSuccess: (v: any) => {
        const data = v.data.data;
        setUser({ role: data.role, userName: data.userName, email: data.email, profilePicture: data.profilePicture, isAuthenticated: true });
        localStorage.setItem('access_token', v.data.access_token);
        toast('User created successfully');
        setStep(3);
      },
      onError: (e) => { toast.error(e.message); }
    });
  };

  const handleGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const token = tokenResponse.access_token;
      registerWithGoogle.mutate(token, {
        onSuccess: (v: any) => {
          toast(v.data.message);
          localStorage.setItem('access_token', v.data.access_token);
          setUser({
            isAuthenticated: true,
            role: v.data.data.role,
            email: v.data.data.email,
            userName: v.data.data.userName,
            profilePicture: v.data.data.profilePicture
          });
          setStep(3);
        },
        onError: (e: any) => {
          if (e.response) toast.error(e.response.data.message);
        },
      });
    },
    onError: () => console.log("Login Failed"),
  });

  const filledOtp = otp.every((d) => d !== "");

  const passwordStrength = (pw: string) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const strength = passwordStrength(form.password);
  const strengthColors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

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
          --warning: #f59e0b;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
          --shadow-focus: 0 0 0 3px rgba(79,110,247,0.15);
          --radius: 10px;
          --radius-sm: 6px;
          --font: 'DM Sans', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }

        .sl-root {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          font-family: var(--font);
          color: var(--text-primary);
          position: relative;
        }

        /* Left brand panel */
        .sl-panel {
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

        .sl-panel::before {
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

        .sl-panel::after {
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

        .sl-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .sl-brand-icon {
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

        .sl-brand-name {
          font-size: 17px;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 0.3px;
        }

        .sl-panel-body {
          position: relative;
          z-index: 1;
        }

        .sl-panel-tag {
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

        .sl-panel-tag-dot {
          width: 6px;
          height: 6px;
          background: #34d399;
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }

        .sl-panel-heading {
          font-size: 32px;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 18px;
          letter-spacing: -0.5px;
        }

        .sl-panel-heading span {
          color: rgba(255,255,255,0.5);
        }

        .sl-panel-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          max-width: 280px;
        }

        /* Feature list */
        .sl-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 36px;
        }

        .sl-feature {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .sl-feature-check {
          width: 20px;
          height: 20px;
          background: rgba(52,211,153,0.18);
          border: 1px solid rgba(52,211,153,0.35);
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .sl-feature-text {
          font-size: 13px;
          color: rgba(255,255,255,0.72);
          line-height: 1.5;
        }

        .sl-panel-footer {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          position: relative;
          z-index: 1;
        }

        /* Main form area */
        .sl-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .sl-card {
          width: 100%;
          max-width: 460px;
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

        /* Step indicator */
        .sl-steps {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 32px;
        }

        .sl-step {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .sl-step-bubble {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          flex-shrink: 0;
          transition: all 0.25s;
          font-family: var(--font-mono);
        }

        .sl-step-bubble.active {
          border-color: var(--accent);
          background: var(--accent);
          color: #fff;
        }

        .sl-step-bubble.done {
          border-color: var(--success);
          background: var(--success);
          color: #fff;
        }

        .sl-step-label {
          font-size: 11.5px;
          color: var(--text-muted);
          font-weight: 500;
          transition: color 0.25s;
        }

        .sl-step-label.active { color: var(--accent); }
        .sl-step-label.done  { color: var(--success); }

        .sl-step-line {
          flex: 1;
          height: 1.5px;
          background: var(--border);
          margin: 0 10px;
          transition: background 0.25s;
        }

        .sl-step-line.done { background: var(--success); }

        /* Header */
        .sl-card-header { margin-bottom: 28px; }

        .sl-card-title {
          font-size: 22px;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: -0.3px;
          margin-bottom: 6px;
        }

        .sl-card-sub {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .sl-card-sub strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        /* Google btn */
        .sl-google-btn {
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

        .sl-google-btn:hover {
          border-color: #c5cae9;
          background: #fafbff;
          box-shadow: 0 2px 8px rgba(79,110,247,0.1);
        }

        /* Divider */
        .sl-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .sl-divider-line { flex: 1; height: 1px; background: var(--border); }

        .sl-divider-text {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        /* Form fields */
        .sl-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .sl-field { margin-bottom: 14px; }

        .sl-label {
          display: block;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 7px;
          letter-spacing: 0.1px;
        }

        .sl-input-wrap { position: relative; }

        .sl-input {
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

        .sl-input:hover { border-color: #c5cae9; }

        .sl-input:focus {
          border-color: var(--border-focus);
          box-shadow: var(--shadow-focus);
        }

        .sl-input::placeholder { color: var(--text-muted); }
        .sl-input-pw { padding-right: 44px; }

        .sl-eye-btn {
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

        .sl-eye-btn:hover { color: var(--text-primary); }

        /* Password strength */
        .sl-strength-wrap {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sl-strength-bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }

        .sl-strength-bar {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          background: var(--border);
          transition: background 0.3s;
        }

        .sl-strength-label {
          font-size: 11.5px;
          font-weight: 500;
          font-family: var(--font-mono);
          min-width: 42px;
          text-align: right;
        }

        /* Submit button */
        .sl-btn {
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
          margin-top: 6px;
          letter-spacing: 0.2px;
          box-shadow: 0 2px 8px rgba(79,110,247,0.3);
        }

        .sl-btn:not(:disabled):hover {
          background: var(--accent-hover);
          box-shadow: 0 4px 14px rgba(79,110,247,0.4);
          transform: translateY(-1px);
        }

        .sl-btn:active { transform: translateY(0); }

        .sl-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }

        .sl-spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Footer login link */
        .sl-footer-link {
          margin-top: 22px;
          font-size: 13px;
          color: var(--text-secondary);
          text-align: center;
        }

        .sl-footer-link a {
          color: var(--accent);
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.15s;
        }

        .sl-footer-link a:hover { opacity: 0.75; text-decoration: underline; }

        /* OTP Timer */
        .sl-otp-timer {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          margin-bottom: 22px;
        }

        .sl-timer-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--accent-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sl-timer-digits {
          font-family: var(--font-mono);
          font-size: 20px;
          font-weight: 500;
          line-height: 1;
          transition: color 0.3s;
          min-width: 52px;
        }

        .sl-timer-track { flex: 1; }

        .sl-timer-bar-bg {
          height: 3px;
          background: var(--border);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 5px;
        }

        .sl-timer-bar-fill {
          height: 100%;
          transform-origin: left;
          border-radius: 2px;
          transition: transform 1s linear, background 0.3s;
        }

        .sl-timer-caption {
          font-size: 11.5px;
          color: var(--text-muted);
          transition: color 0.3s;
        }

        /* OTP Grid */
        .sl-otp-grid {
          display: flex;
          gap: 9px;
          margin-bottom: 22px;
        }

        .sl-otp-cell {
          flex: 1;
          aspect-ratio: 1;
          max-width: 58px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          background: #fff;
          font-family: var(--font-mono);
          font-size: 22px;
          font-weight: 500;
          text-align: center;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          caret-color: transparent;
        }

        .sl-otp-cell:focus {
          border-color: var(--border-focus);
          box-shadow: var(--shadow-focus);
        }

        .sl-otp-cell.filled {
          border-color: var(--accent);
          background: var(--accent-light);
        }

        .sl-otp-cell:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Resend + back */
        .sl-resend {
          font-size: 13px;
          color: var(--text-secondary);
          text-align: center;
          margin-top: 16px;
        }

        .sl-resend button {
          background: none;
          border: none;
          font-family: var(--font);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          color: var(--accent);
          padding: 0;
          transition: opacity 0.15s;
        }

        .sl-resend button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          color: var(--text-muted);
        }

        .sl-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 20px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          background: none;
          border: none;
          font-family: var(--font);
          color: var(--text-secondary);
          padding: 0;
          transition: color 0.15s;
        }

        .sl-back-btn:not(:disabled):hover { color: var(--text-primary); }
        .sl-back-btn:not(:disabled):hover svg { transform: translateX(-3px); }
        .sl-back-btn svg { transition: transform 0.18s; }
        .sl-back-btn:disabled { cursor: not-allowed; opacity: 0.35; }

        /* Success */
        .sl-success-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          border: 1px solid #6ee7b7;
        }

        .sl-success-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 22px 0 26px;
          padding: 18px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
        }

        .sl-success-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .sl-success-feature-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--success);
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .sl-panel { display: none; }
        }

        @media (max-width: 540px) {
          .sl-card { padding: 28px 22px; }
          .sl-row-2 { grid-template-columns: 1fr; }
          .sl-otp-cell { max-width: 48px; font-size: 18px; }
        }
      `}</style>

      <div className="sl-root">
        {/* Left Brand Panel */}
        <aside className="sl-panel">
          <div className="sl-brand">
            <div className="sl-brand-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.9"/>
                <rect x="11" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.5"/>
                <rect x="2" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.5"/>
                <rect x="11" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.7"/>
              </svg>
            </div>
            <Link to="/">
            <span className="sl-brand-name">Smart Leads</span>
            </Link>
          </div>

          <div className="sl-panel-body">
            <div className="sl-panel-tag">
              <div className="sl-panel-tag-dot" />
              Lead Management Platform
            </div>
            <h2 className="sl-panel-heading">
              Manage your<br />
              <span>leads</span> smarter,<br />
              close deals faster.
            </h2>
            <p className="sl-panel-desc">
              A unified dashboard to track, filter, and convert your leads across every channel.
            </p>
            <ul className="sl-features">
              {[
                "Full lead lifecycle management",
                "Advanced filters & search",
                "Role-based access control",
                "CSV export & reporting",
              ].map((f) => (
                <li className="sl-feature" key={f}>
                  <div className="sl-feature-check">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="sl-feature-text">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="sl-panel-footer">
            © {new Date().getFullYear()} Smart Leads Dashboard
          </div>
        </aside>

        {/* Right Form Area */}
        <main className="sl-main">
          <div className="sl-card" key={step}>

            {/* Step Indicator */}
            <div className="sl-steps">
              {[
                { n: 1, label: "Account" },
                { n: 2, label: "Verify" },
                { n: 3, label: "Done" },
              ].map(({ n, label }, i) => (
                <React.Fragment key={n}>
                  {i > 0 && <div className={`sl-step-line ${step > n - 1 ? "done" : ""}`} />}
                  <div className="sl-step">
                    <div className={`sl-step-bubble ${step === n ? "active" : step > n ? "done" : ""}`}>
                      {step > n ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : n}
                    </div>
                    <span className={`sl-step-label ${step === n ? "active" : step > n ? "done" : ""}`}>{label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <>
                <div className="sl-card-header">
                  <h1 className="sl-card-title">Create your account</h1>
                  <p className="sl-card-sub">Get started with your free Smart Leads workspace.</p>
                </div>

                <button className="sl-google-btn" onClick={() => handleGoogle()} type="button">
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

                <div className="sl-divider">
                  <div className="sl-divider-line" />
                  <span className="sl-divider-text">or</span>
                  <div className="sl-divider-line" />
                </div>

                <form>
                  <div className="sl-row-2">
                    <div className="sl-field">
                      <label className="sl-label" htmlFor="userName">Username</label>
                      <input
                        id="userName" name="userName" type="text"
                        className="sl-input" placeholder="e.g. john_doe"
                        value={form.userName} onChange={handleChange}
                        required autoComplete="username"
                      />
                    </div>
                    <div className="sl-field">
                      <label className="sl-label" htmlFor="email">Email address</label>
                      <input
                        id="email" name="email" type="email"
                        className="sl-input" placeholder="you@company.com"
                        value={form.email} onChange={handleChange}
                        required autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="sl-field">
                    <label className="sl-label" htmlFor="password">Password</label>
                    <div className="sl-input-wrap">
                      <input
                        id="password" name="password"
                        type={showPassword ? "text" : "password"}
                        className="sl-input sl-input-pw"
                        placeholder="Min. 8 characters"
                        value={form.password} onChange={handleChange}
                        required autoComplete="new-password"
                      />
                      <button
                        type="button" className="sl-eye-btn"
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
                    {form.password && (
                      <div className="sl-strength-wrap">
                        <div className="sl-strength-bars">
                          {[1, 2, 3, 4].map((lvl) => (
                            <div
                              key={lvl}
                              className="sl-strength-bar"
                              style={{ background: strength >= lvl ? strengthColors[strength] : undefined }}
                            />
                          ))}
                        </div>
                        <span className="sl-strength-label" style={{ color: strengthColors[strength] }}>
                          {strengthLabels[strength]}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="sl-btn"
                    disabled={!form.userName || !form.email || !form.password || loading}
                  >
                    {loading && <span className="sl-spinner" />}
                    {loading ? "Creating account..." : "Create account →"}
                  </button>
                </form>

                <p className="sl-footer-link">
                  Already have an account? <a href="/signin">Sign in</a>
                </p>
              </>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <>
                <div className="sl-card-header">
                  <h1 className="sl-card-title">Verify your email</h1>
                  <p className="sl-card-sub">
                    We sent a 6-digit code to <strong>{form.email}</strong>. Enter it below.
                  </p>
                </div>

                {/* Timer */}
                <div className="sl-otp-timer">
                  <div className="sl-timer-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6.5" stroke={timerExpired ? "#ef4444" : "#4f6ef7"} strokeWidth="1.5"/>
                      <path d="M8 4.5V8L10.5 10" stroke={timerExpired ? "#ef4444" : "#4f6ef7"} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="sl-timer-digits" style={{ color: timerExpired ? "var(--danger)" : "var(--text-primary)" }}>
                    {formatTimer(otpTimer)}
                  </div>
                  <div className="sl-timer-track">
                    <div className="sl-timer-bar-bg">
                      <div
                        className="sl-timer-bar-fill"
                        style={{
                          background: timerExpired ? "var(--danger)" : "var(--accent)",
                          transform: `scaleX(${otpTimer / 300})`,
                        }}
                      />
                    </div>
                    <div className="sl-timer-caption" style={{ color: timerExpired ? "var(--danger)" : undefined }}>
                      {timerExpired ? "Code expired — request a new one" : "Code expires in"}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleVerify}>
                  <div className="sl-otp-grid" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el: HTMLInputElement | null) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className={`sl-otp-cell ${digit ? "filled" : ""}`}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        autoFocus={i === 0}
                        disabled={timerExpired}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="sl-btn"
                    disabled={!filledOtp || otpVerifation.isPending || timerExpired}
                  >
                    {otpVerifation.isPending && <span className="sl-spinner" />}
                    {otpVerifation.isPending ? "Verifying..." : "Verify & continue →"}
                  </button>
                </form>

                <p className="sl-resend">
                  Didn't receive a code?{" "}
                  <button
                    type="button"
                    disabled={!timerExpired}
                    onClick={handleResend}
                  >
                    {timerExpired ? "Resend code" : `Resend in ${formatTimer(otpTimer)}`}
                  </button>
                </p>

                <button
                  className="sl-back-btn"
                  disabled={!timerExpired}
                  onClick={() => { if (timerExpired) { clearInterval(timerRef.current!); setStep(1); } }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {timerExpired ? "Back to registration" : "Back (locked until timer expires)"}
                </button>
              </>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <>
                <div className="sl-success-icon">
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <path d="M5 13L10.5 18.5L21 8" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="sl-card-header">
                  <h1 className="sl-card-title">You're all set, {form.userName}!</h1>
                  <p className="sl-card-sub">
                    Your account is ready. Start managing your leads and tracking your pipeline.
                  </p>
                </div>

                <ul className="sl-success-features">
                  {[
                    "Create and manage leads",
                    "Filter by status, source & more",
                    "Export data to CSV",
                  ].map((f) => (
                    <li className="sl-success-feature" key={f}>
                      <div className="sl-success-feature-dot" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="/"
                  className="sl-btn"
                  style={{
                    display: "flex",
                    textDecoration: "none",
                    padding: "12px 20px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--accent)",
                    color: "#fff",
                    fontFamily: "var(--font)",
                    fontSize: 14,
                    fontWeight: 600,
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 2px 8px rgba(79,110,247,0.3)",
                  }}
                >
                  Go to Dashboard →
                </a>
              </>
            )}

          </div>
        </main>
      </div>
    </>
  );
}