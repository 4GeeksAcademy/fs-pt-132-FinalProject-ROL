import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "./Navbar.css";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path ? "nav__link--active" : "";

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          Game-Side
        </Link>

        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div
          className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}
        >
          <Link
            to="/"
            className={`nav__link ${isActive("/")}`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/"
            className={`nav__link ${isActive("/")}`}
            onClick={() => setMenuOpen(false)}
          >
            Games
          </Link>
          <Link
            to="/tier-list"
            className={`nav__link ${isActive("/tier-list")}`}
            onClick={() => setMenuOpen(false)}
          >
            Tier List
          </Link>
          <Link
            to="/survey"
            className={`nav__link ${isActive("/survey")}`}
            onClick={() => setMenuOpen(false)}
          >
            Survey
          </Link>
        </div>

        <div className="navbar__auth">
          {store.isAuthenticated ? (
            <div className="navbar__user">
              <Link
                to="/profile"
                className={`nav__link ${isActive("/profile")}`}
              >
                {store.user?.username}
              </Link>
              <button
                onClick={() => dispatch({ type: "logout" })}
                className="nav__btn"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`nav__link ${isActive("/login")}`}
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
