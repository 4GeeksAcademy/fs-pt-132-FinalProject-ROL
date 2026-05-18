import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Login = () => {
  // Store global: dispatch (para setear auth) y store (para leer isAuthenticated)
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const location = useLocation();  // lee el mensaje de éxito que viene desde Signup
  // Estado local del formulario
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});       // errores de validación
  const [apiError, setApiError] = useState("");    // error del backend
  const [loading, setLoading] = useState(false);   // true mientras se hace el fetch
  // Mensaje de éxito desde Signup ("Account created. Please log in.")
  const successMessage = location.state?.message || "";
  // Si ya está logueado, redirige a Home
  useEffect(() => {
    if (store.isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [store.isAuthenticated, navigate]);
  // Validación del formulario antes de enviar
  const validate = () => {
    const errs = {};
    if (!username.trim()) {
      errs.username = "username is required";
    } 
    if (!password) {
      errs.password = "Password is required";
    }
    return errs;
  };
  // Enviar formulario al backend
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
        // El backend espera "username", no "email".
        //    Si usan email para login, cambiar a: { username: email, password }
        body: JSON.stringify({ username, password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setApiError(data.msg || "Invalid email or password.");
        return;
      }
      // Login exitoso: guardar token en sessionStorage y en el store
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="card-title text-center mb-1">Welcome Back</h1>
              <p className="text-muted text-center mb-4">
                Log in to your Game-Side account
              </p>
              <form onSubmit={handleSubmit} noValidate>
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}
                {apiError && (
                  <div className="alert alert-danger" role="alert">
                    {apiError}
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input id="username" type="text"
                    className={`form-control ${errors.username ? "is-invalid" : ""}`}
                    placeholder="Your  username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                   {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input id="password" type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Logging in…
                    </>
                  ) : "Log In"}
                </button>
              </form>
              <p className="text-center mt-4 mb-0">
                Don't have an account?{" "}
                <Link to="/signup" className="text-decoration-none">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};