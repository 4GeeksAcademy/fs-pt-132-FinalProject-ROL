import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import "./Login.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Login = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || ""
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (store.isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [store.isAuthenticated, navigate]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Invalid email format";
    }
    if (!password) {
      errs.password = "Password is required";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const resp = await fetch(`${VITE_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setApiError(data.msg || "Invalid email or password.");
        return;
      }

      const { token, user } = data;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: "set_auth",
        payload: { token, user },
      });

      navigate("/", { replace: true });
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Welcome Back</h1>
        <p className="auth-card__subtitle">Log in to your Game-Side account</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {successMessage && (
            <div className="auth-form__success">{successMessage}</div>
          )}
          {apiError && <div className="auth-form__error">{apiError}</div>}

          <div className="auth-form__field">
            <label htmlFor="email" className="auth-form__label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`auth-form__input ${errors.email ? "auth-form__input--error" : ""}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <span className="auth-form__field-error">{errors.email}</span>
            )}
          </div>

          <div className="auth-form__field">
            <label htmlFor="password" className="auth-form__label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`auth-form__input ${errors.password ? "auth-form__input--error" : ""}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <span className="auth-form__field-error">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-form__btn"
            disabled={loading}
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>

        <p className="auth-card__footer">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="auth-card__link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
