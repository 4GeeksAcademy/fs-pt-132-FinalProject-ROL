import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import "./Profile.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const STATUS_LABELS = {
  want_to_play: "Quiero jugar",
  playing: "Jugando",
  completed: "Completado",
  dropped: "Abandonado",
};

const STATUS_COLORS = {
  want_to_play: "#2196F3",
  playing: "#4CAF50",
  completed: "#FFD700",
  dropped: "#F44336",
};

export const Profile = () => {
  const { store } = useGlobalReducer();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!store.user?.id) {
      setLoading(false);
      setError("No se encontr\u00f3 informaci\u00f3n del usuario.");
      return;
    }

    fetch(`${VITE_BACKEND_URL}/api/users/${store.user.id}`, {
      headers: {
        Authorization: `Bearer ${store.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [store.user?.id, store.token]);

  const userGames = userData?.games || [];
  const stats = {
    total: userGames.length,
    comments: userData?.comment_count ?? userData?.comments?.length ?? 0,
    favorites: userData?.favorite_count ?? userData?.favorites?.length ?? 0,
  };

  // ═══════════════════════════════════════
  //  LOADING
  // ═══════════════════════════════════════
  if (loading) {
    return (
      <div className="profile">
        <div className="profile__inner">
          <div className="skeleton-profile">
            <div className="skeleton-profile__avatar" />
            <div className="skeleton-profile__line skeleton-profile__line--medium" />
            <div className="skeleton-profile__line skeleton-profile__line--short" />
            <div className="skeleton-profile__stats">
              <div className="skeleton-profile__stat" />
              <div className="skeleton-profile__stat" />
              <div className="skeleton-profile__stat" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  //  ERROR
  // ═══════════════════════════════════════
  if (error) {
    return (
      <div className="profile">
        <div className="profile__inner">
          <div className="error-state">
            <h2 className="error-state__title">Something went wrong</h2>
            <p className="error-state__desc">{error}</p>
            <Link to="/" className="error-state__btn">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const user = userData || store.user;

  return (
    <div className="profile">
      <div className="profile__inner">
        {/* ── Profile Header ── */}
        <div className="profile__header">
          <div className="profile__avatar">
            {user?.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="profile__info">
            <h1 className="profile__username">
              {user?.username || "Usuario"}
            </h1>
            <p className="profile__email">{user?.email || ""}</p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="profile__stats">
          <div className="profile__stat">
            <span className="profile__stat-value">{stats.total}</span>
            <span className="profile__stat-label">Juegos</span>
          </div>
          <div className="profile__stat">
            <span className="profile__stat-value">{stats.comments}</span>
            <span className="profile__stat-label">Comentarios</span>
          </div>
          <div className="profile__stat">
            <span className="profile__stat-value">{stats.favorites}</span>
            <span className="profile__stat-label">Favoritos</span>
          </div>
        </div>

        {/* ── Game List ── */}
        <div className="profile__section">
          <h2 className="profile__section-title">Mis Juegos</h2>

          {userGames.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__desc">
                No tienes juegos registrados a\u00fan.
              </p>
              <Link to="/" className="error-state__btn">
                Explorar juegos
              </Link>
            </div>
          ) : (
            <div className="profile__games-list">
              {userGames.map((entry) => {
                const game = entry.game || entry;
                const status = entry.status || entry.user_status;
                return (
                  <div key={game.id || entry.id} className="profile__game">
                    <Link
                      to={`/games/${game.id}`}
                      className="profile__game-cover"
                    >
                      <img
                        src={game.cover_img_url}
                        alt={game.title}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <span className="profile__game-fallback">
                        {game.title?.slice(0, 2).toUpperCase() || "??"}
                      </span>
                    </Link>
                    <div className="profile__game-info">
                      <Link
                        to={`/games/${game.id}`}
                        className="profile__game-title"
                      >
                        {game.title}
                      </Link>
                      {status && (
                        <span
                          className="profile__game-status"
                          style={{
                            backgroundColor:
                              STATUS_COLORS[status] || "#9E9E9E",
                          }}
                        >
                          {STATUS_LABELS[status] || status}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
