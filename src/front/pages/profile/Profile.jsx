import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import "./Profile.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const STATUS_LABELS = {
  playing: "Jugando",
  completed: "Completado",
  want_to_play: "Pendiente",
  dropped: "Abandonado",
};

const STATUS_COLORS = {
  playing: "#7DD750",
  completed: "#AC4FD6",
  want_to_play: "#D64F82",
  dropped: "#574B50",
};

export const Profile = () => {
  const { store } = useGlobalReducer();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);

  useEffect(() => {
    if (!store.user?.id) {
      setLoading(false);
      setError("No se encontr\u00f3 informaci\u00f3n del usuario.");
      return;
    }

    const token = store.token;
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.all([
      fetch(`${VITE_BACKEND_URL}/api/users/${store.user.id}`, {
        headers: authHeaders,
      }),
      fetch(`${VITE_BACKEND_URL}/api/user/game-list`, {
        headers: authHeaders,
      }),
    ])
      .then(async ([userRes, listRes]) => {
        if (!userRes.ok) throw new Error(`Error ${userRes.status}`);
        const userData = await userRes.json();
        const user = userData.user || userData;

        let allGames = [];
        if (listRes.ok) {
          const listData = await listRes.json();
          const list = listData.entry || listData;
          allGames = list.games || [];
        }

        setUserData({ ...user, games: allGames });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [store.user?.id, store.token]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="alert alert-danger">
              <h4 className="alert-heading">Something went wrong</h4>
              <p className="mb-0">{error}</p>
            </div>
            <Link to="/" className="btn btn-primary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const user = userData || store.user;
  const allGames = userData?.games || [];

  const nowPlaying = allGames.filter((g) => g.status === "playing");
  const completed = allGames.filter((g) => g.status === "completed");
  const pending = allGames.filter((g) => g.status === "want_to_play");
  const dropped = allGames.filter((g) => g.status === "dropped");
  const favorites = allGames.filter((g) => g.is_favorite);

  let displayedGames = allGames;
  if (showFavoritesOnly) displayedGames = favorites;
  else if (filterStatus) displayedGames = allGames.filter((g) => g.status === filterStatus);

  const GameCard = ({ entry }) => {
    const game = entry.game || entry;
    const status = entry.status;
    const genre = Array.isArray(game.genres) ? game.genres[0] : game.genres || game.genre || "";
    const rating = game.average_rating || game.rating;
    const userCount = game.favorite_count || game.user_count || "";

    return (
      <Link to={`/game-detail/${game.id}`} className="text-decoration-none">
        <div className="profile-game-card">
          <div className="profile-game-card__cover">
            {game.cover_img_url ? (
              <img src={game.cover_img_url} alt={game.title} />
            ) : (
              <div className="profile-game-card__fallback">
                {game.title?.slice(0, 2).toUpperCase() || "??"}
              </div>
            )}
            {status && (
              <span
                className="profile-game-card__status"
                style={{ backgroundColor: STATUS_COLORS[status] || "#999" }}
              >
                {STATUS_LABELS[status] || status}
              </span>
            )}
            {entry.is_favorite && (
              <span className="profile-game-card__fav">★</span>
            )}
          </div>
          <div className="profile-game-card__info">
            <h4 className="profile-game-card__title">{game.title}</h4>
            <p className="profile-game-card__genre">{genre || ""}</p>
            <p className="profile-game-card__rating">
              ★ {Number(rating || 0).toFixed(1)}
              {userCount ? ` | U: ${userCount}` : ""}
            </p>
          </div>
        </div>
      </Link>
    );
  };

  const SectionRow = ({ title, games, emptyMsg, linkTo = null }) => {
    if (games.length === 0 && !emptyMsg) return null;
    return (
      <div className="profile-section">
        <div className="profile-section__header">
          <h3 className="profile-section__title">{title}</h3>
          {linkTo && (
            <Link to={linkTo} className="profile-section__link">
              Ver todo →
            </Link>
          )}
        </div>
        {games.length === 0 ? (
          <p className="profile-section__empty">{emptyMsg}</p>
        ) : (
          <div className="profile-section__scroll">
            {games.map((entry, i) => (
              <GameCard key={entry.id || entry.game?.id || i} entry={entry} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="profile">
      <div className="profile__inner">
        {/* ═══ Profile Header ═══ */}
        <div className="profile-header">
          <div className="profile-header__avatar">
            {user?.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="profile-header__info">
            <h1 className="profile-header__name">{user?.username || "Usuario"}</h1>
            <p className="profile-header__tag">top tier player</p>
          </div>
        </div>

        {/* ═══ Stats Counters ═══ */}
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat__value">{allGames.length}</span>
            <span className="profile-stat__label">Juegos</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value">{completed.length}</span>
            <span className="profile-stat__label">Completados</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value">{pending.length}</span>
            <span className="profile-stat__label">Pendientes</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value">{favorites.length}</span>
            <span className="profile-stat__label">Favoritos</span>
          </div>
        </div>

        {/* ═══ Now Playing ═══ */}
        <SectionRow
          title="Jugando actualmente"
          games={nowPlaying}
          emptyMsg="No hay juegos en progreso."
        />

        {/* ═══ Favorites ═══ */}
        <SectionRow
          title="Juegos favoritos"
          games={favorites}
          emptyMsg="No tienes juegos favoritos todavía."
        />

        {/* ═══ Mi Biblioteca ═══ */}
        <div className="profile-section">
          <div className="profile-section__header">
            <h3 className="profile-section__title">Mi Biblioteca</h3>
            <div className="profile-library__filters">
              {["all", "completed", "playing", "want_to_play", "dropped"].map((key) => {
                const label =
                  key === "all"
                    ? "Todos"
                    : STATUS_LABELS[key] || key;
                const count =
                  key === "all"
                    ? allGames.length
                    : key === "completed"
                    ? completed.length
                    : key === "playing"
                    ? nowPlaying.length
                    : key === "want_to_play"
                    ? pending.length
                    : dropped.length;
                return (
                  <button
                    key={key}
                    className={`profile-library__filter ${filterStatus === key || (key === "all" && !filterStatus && !showFavoritesOnly) ? "profile-library__filter--active" : ""}`}
                    onClick={() => {
                      setFilterStatus(key === "all" ? null : key);
                      setShowFavoritesOnly(false);
                    }}
                  >
                    {label} ({count})
                  </button>
                );
              })}
              {favorites.length > 0 && (
                <button
                  className={`profile-library__filter ${showFavoritesOnly ? "profile-library__filter--active" : ""}`}
                  onClick={() => {
                    setShowFavoritesOnly(true);
                    setFilterStatus(null);
                  }}
                >
                  ★ Favoritos ({favorites.length})
                </button>
              )}
            </div>
          </div>

          {displayedGames.length === 0 ? (
            <p className="profile-section__empty">
              No tienes juegos registrados aún.
            </p>
          ) : (
            <div className="profile-library__grid">
              {displayedGames.map((entry, i) => (
                <GameCard key={entry.id || entry.game?.id || i} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
