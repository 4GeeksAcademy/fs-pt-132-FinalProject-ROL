import { Link } from "react-router-dom";
import "./Footer.css";

export const Footer = () => (
  <footer className="footer">
    <div className="footer__inner">
      <div className="footer__brand">
        <h3 className="footer__logo">Game-Side</h3>
        <p>
          Descubre, organiza y comparte tus videojuegos favoritos en una
          experiencia moderna y personalizada.
        </p>
      </div>
      <div className="footer__links">
        <h4>Enlaces</h4>
        <Link to="/">Home</Link>
        <Link to="/">Games</Link>
        <Link to="/tier-list">Tier List</Link>
      </div>
      <div className="footer__contact">
        <h4>Contacto</h4>
        <p>contact@game-side.org</p>
        <p>GitHub</p>
        <p>Twitter</p>
      </div>
    </div>
    <div className="footer__bottom">
      <p>&copy; {new Date().getFullYear()} Game-Side. All rights reserved.</p>
    </div>
  </footer>
);
