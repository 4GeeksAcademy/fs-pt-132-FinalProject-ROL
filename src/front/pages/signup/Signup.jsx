import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import "./Signup.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Signup = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (store.isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [store.isAuthenticated, navigate]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validate = () => {
    const errs = {};

    if (!form.username.trim()) {
      errs.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) {
      errs.username = "Username must be 3–20 alphanumeric characters";
    }

    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Invalid email format";
    }

    if (!form.password) {
      errs.password = "Password is required";
    } else if (form.password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
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
      const resp = await fetch(`${VITE_BACKEND_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setApiError(data.msg || "Registration failed. Please try again.");
        return;
      }

      navigate("/login", {
        state: { message: "Account created. Please log in." },
      });
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__subtitle">Join Game-Side today</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {apiError && <div className="auth-form__error">{apiError}</div>}

          <div className="auth-form__field">
            <label htmlFor="username" className="auth-form__label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className={`auth-form__input ${errors.username ? "auth-form__input--error" : ""}`}
              placeholder="Your username"
              value={form.username}
              onChange={handleChange("username")}
            />
            {errors.username && (
              <span className="auth-form__field-error">{errors.username}</span>
            )}
          </div>

          <div className="auth-form__field">
            <label htmlFor="email" className="auth-form__label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`auth-form__input ${errors.email ? "auth-form__input--error" : ""}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange("email")}
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
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange("password")}
            />
            {errors.password && (
              <span className="auth-form__field-error">{errors.password}</span>
            )}
          </div>

          <div className="auth-form__field">
            <label htmlFor="confirmPassword" className="auth-form__label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`auth-form__input ${errors.confirmPassword ? "auth-form__input--error" : ""}`}
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
            />
            {errors.confirmPassword && (
              <span className="auth-form__field-error">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="auth-form__btn"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-card__link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
