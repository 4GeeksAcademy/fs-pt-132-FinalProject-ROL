// ─── Hooks de React ───
import { useEffect, useState } from "react";
// ─── Hook del store global ───
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
// ─── Link para navegación interna ───
import { Link } from "react-router-dom";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Cargar juegos desde el backend ───
  const loadGames = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!VITE_BACKEND_URL)
        throw new Error("VITE_BACKEND_URL is not defined in .env file");

      const response = await fetch(`${VITE_BACKEND_URL}/api/games`);

      if (!response.ok)
        throw new Error(`Failed to fetch games (${response.status})`);

      const data = await response.json();

      dispatch({ type: "set_games", payload: data });
    } catch (err) {
      setError(
        err.message ||
          "Could not load games. Please check if the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const games = store.games || [];

  // ═══════════════════════════════════════
  //  HERO
  // ═══════════════════════════════════════
  const HeroSection = () => (
    <section className="bg-dark text-white text-center py-5">
      <div className="container">
        <h1 className="display-4 fw-bold mb-3">Tu Universo Gaming</h1>
        <p className="lead mb-4">
          Descubre, rastrea y califica tus videojuegos favoritos. Únete a una
          comunidad apasionada de gamers.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <a href="#features" className="btn btn-primary btn-lg">
            Comenzar ahora &rarr;
          </a>
          <a href="#trending" className="btn btn-outline-light btn-lg">
            Explorar juegos
          </a>
        </div>
      </div>
    </section>
  );

  // ═══════════════════════════════════════
  //  FEATURES
  // ═══════════════════════════════════════
  const FeaturesSection = () => (
    <section id="features" className="py-5">
      <div className="container">
        <h2 className="text-center mb-5">Tu experiencia Game-side</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <div style={{ fontSize: "2.5rem" }}>🔍</div>
                <h3 className="card-title h5 mt-3">Descubre</h3>
                <p className="card-text text-muted">Miles de juegos</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <div style={{ fontSize: "2.5rem" }}>📚</div>
                <h3 className="card-title h5 mt-3">Organiza</h3>
                <p className="card-text text-muted">Biblioteca personalizada</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <div style={{ fontSize: "2.5rem" }}>💬</div>
                <h3 className="card-title h5 mt-3">Comparte</h3>
                <p className="card-text text-muted">Tus gustos y opiniones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // ═══════════════════════════════════════
  //  GAME CARD (renderiza un juego individual)
  // ═══════════════════════════════════════
  const GameCardItem = ({ game }) => (
    <div className="col-md-6 col-lg-3">
      <div className="card h-100 shadow-sm">
        <Link to={`/games/${game.id}`} className="text-decoration-none">
          <div
            className="bg-light d-flex align-items-center justify-content-center"
            style={{ height: "200px", overflow: "hidden" }}
          >
            {game.cover_img_url ? (
              <img
                src={game.cover_img_url}
                alt={game.title}
                className="img-fluid"
                style={{ objectFit: "cover", height: "100%", width: "100%" }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <span
              className="text-muted"
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                display: game.cover_img_url ? "none" : "flex",
              }}
            >
              {game.title?.slice(0, 2).toUpperCase() || "??"}
            </span>
          </div>
        </Link>
        <div className="card-body">
          <Link
            to={`/games/${game.id}`}
            className="text-decoration-none text-dark"
          >
            <h5 className="card-title">{game.title}</h5>
          </Link>
          {game.genre && (
            <span className="badge bg-secondary me-1">{game.genre}</span>
          )}
          {game.platform && (
            <span className="badge bg-info text-dark">{game.platform}</span>
          )}
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════
  //  SURVEY CTA
  // ═══════════════════════════════════════
  const SurveyCTASection = () => (
    <section className="bg-light py-5">
      <div className="container text-center">
        <h2 className="mb-3">
          Tu pr&oacute;ximo descubrimiento est&aacute; aqu&iacute;
        </h2>
        <p className="text-muted mb-5">
          Responde unas preguntas r&aacute;pidas y recibe recomendaciones
          hechas para ti.
        </p>
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h4 className="card-title h5">Personaliza</h4>
                <p className="card-text text-muted">
                  Recibe recomendaciones basadas en tus g&eacute;neros, estilo
                  de juego y preferencias reales.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h4 className="card-title h5">Ahorra tiempo</h4>
                <p className="card-text text-muted">
                  Deja de perder horas buscando y encuentra t&iacute;tulos que
                  encajen contigo al instante.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h4 className="card-title h5">Descubre</h4>
                <p className="card-text text-muted">
                  Explora juegos nuevos, joyas ocultas y experiencias que
                  probablemente nunca has encontrado.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Link to="/survey" className="btn btn-primary btn-lg">
          Comenzar encuesta &rarr;
        </Link>
      </div>
    </section>
  );

  // ═══════════════════  LOADING  ═══════════════════
  if (loading) {
    return (
      <>
        <HeroSection />
        <section className="py-5">
          <div className="container">
            <h2 className="text-center mb-4">Tendencias Ahora</h2>
            <div className="row g-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="col-md-6 col-lg-3">
                  <div className="card shadow-sm" aria-hidden="true">
                    <div
                      className="bg-secondary placeholder"
                      style={{ height: "200px" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title placeholder-glow">
                        <span className="placeholder col-8" />
                      </h5>
                      <span className="placeholder col-4 placeholder-xs" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  // ═══════════════════  ERROR  ═══════════════════
  if (error) {
    return (
      <>
        <HeroSection />
        <div className="container py-5 text-center">
          <div className="alert alert-danger">
            <h4 className="alert-heading">Something went wrong</h4>
            <p className="mb-0">{error}</p>
          </div>
          <button className="btn btn-primary" onClick={loadGames}>
            Retry
          </button>
        </div>
        <SurveyCTASection />
      </>
    );
  }

  // ═══════════════════  MAIN CONTENT  ═══════════════════
  return (
    <>
      <HeroSection />
      <FeaturesSection />

      {/* ─── Trending ─── */}
      <section id="trending" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Tendencias Ahora</h2>
          {games.length > 0 ? (
            <div className="row g-4">
              {games.map((game) => (
                <GameCardItem key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <h4 className="text-muted">No games available</h4>
              <p>Be the first to add one!</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Recommendations ─── */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Recomendaciones (para ti)</h2>
          {games.length > 0 ? (
            <div className="row g-4">
              {games.slice(0, 4).map((game) => (
                <GameCardItem key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <h4 className="text-muted">No hay recomendaciones a&uacute;n</h4>
              <p>
                Completa tu perfil para recibir recomendaciones personalizadas.
              </p>
            </div>
          )}
        </div>
      </section>

      <SurveyCTASection />
    </>
  );
};
