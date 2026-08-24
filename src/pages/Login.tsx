import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { LockIcon } from "@solar-icons/react/outline/lock";
import { EyeIcon } from "@solar-icons/react/outline/eye";
import { EyeClosedIcon } from "@solar-icons/react/outline/eye-closed";
import { useAuth } from "../context/AuthContext";
import { ADMIN_UID } from "../constants";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (!ADMIN_UID) {
      setError("Admin UID is not set. Paste it into src/constants.ts first.");
      return;
    }
    setBusy(true);
    const err = await login(email.trim(), password);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    navigate("/admin", { replace: true });
  };

  return (
    <div className="container">
      <div className="login-wrap">
        <p className="eyebrow">Restricted access</p>
        <h1 className="login-title">Portal Login</h1>
        <p style={{ color: "var(--ink-soft)" }}>
          Authorised personnel only. This portal is reserved for the
          administrator of the Raid Analysis Wing.
        </p>

        <div className="login-panel">
          {error && <div className="form-err" style={{ marginBottom: "18px" }}>{error}</div>}
          <form onSubmit={onSubmit} noValidate>
            <div className="form-grid">
              <div className="form-field full">
                <label>Email</label>
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-field full">
                <label>Password</label>
                <div style={{ display: "flex" }}>
                  <input
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ borderRight: "none" }}
                  />
                  <button
                    type="button"
                    className="icon-btn"
                    style={{ borderLeft: "none" }}
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => setShow((v) => !v)}
                  >
                    {show ? <EyeClosedIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </div>
            </div>
            <button className="btn" type="submit" disabled={busy} style={{ marginTop: "24px", width: "100%", justifyContent: "center" }}>
              <LockIcon size={16} />
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}