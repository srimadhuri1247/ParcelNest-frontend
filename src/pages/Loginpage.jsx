import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath } from "../services/authService";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      navigate(getDashboardPath(user.role), { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(emailValue, passwordValue) {
    setEmail(emailValue);
    setPassword(passwordValue);
    setError("");
  }

  return (
    <div className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand">
          <Package size={30} />
          <span>Parcelnest</span>
        </div>

        <div className="login-promo">
          <span className="eyebrow">CAMPUS DELIVERY, SIMPLIFIED</span>
          <h1>Every parcel.<br />Right on track.</h1>
          <p>
            A simpler way to manage campus deliveries,
            track your parcels, and collect them on time.
          </p>

          <div className="promo-card">
            <div className="promo-icon">
              <Package size={24} />
            </div>
            <div>
              <strong>Your deliveries, organized.</strong>
              <p>Track. Get notified. Collect.</p>
            </div>
          </div>
        </div>

        <p className="login-panel-footer">
          Campus Parcel & Delivery Tracking System
        </p>
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrap">
          <div className="mobile-brand">
            <Package size={25} /> Parcelnest
          </div>

          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="muted">
            Enter your credentials to access your workspace.
          </p>

          <form onSubmit={handleSubmit} className="form-stack">
            <div className="form-field">
              <label htmlFor="email">College email</label>
              <input
                id="email"
                type="email"
                placeholder="you@campus.edu"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button className="primary-button login-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="demo-box">
            <strong>Demo accounts</strong>
            <p>Choose a role to fill in its demo credentials.</p>

            <div className="demo-buttons">
              <button
                type="button"
                onClick={() =>fillDemo("user@parcelnest.test", "UserDemo123!")}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => fillDemo("manager@parcelnest.test", "ManagerDemo123!")}
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => fillDemo("admin@parcelnest.tset", "AdminDemo123!")}
              >
                Admin
              </button>
            </div>
          </div>

          <p className="login-legal">
            Demo mode · Do not use real credentials
          </p>
        </div>
      </section>
    </div>
  );
}