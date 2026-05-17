import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "./TierList.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TIER_ORDER = { S: 0, A: 1, B: 2, C: 3, D: 4, F: 5, Undefined: 6 };

const TIER_COLORS = {
  S: "#FFD700",
  A: "#4CAF50",
  B: "#2196F3",
  C: "#9E9E9E",
  D: "#FF9800",
  F: "#F44336",
  Undefined: "#C0C0C0",
};

export const TierList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [viewMode, setViewMode] = useState("table"); // "table" | "tier"

  useEffect(() => {
    fetch(`${VITE_BACKEND_URL}/api/games`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setGames(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortArrow = (key) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  const sortedGames = useMemo(() => {
    if (!sortKey) return games;
    return [...games].sort((a, b) => {
      let aVal, bVal;

      switch (sortKey) {
        case "genre":
          aVal = (a.genres?.[0] || "").toLowerCase();
          bVal = (b.genres?.[0] || "").toLowerCase();
          break;
        case "release":
          aVal = a.release_date || "";
          bVal = b.release_date || "";
          break;
        case "platform":
          aVal = (a.platforms?.[0] || "").toLowerCase();
          bVal = (b.platforms?.[0] || "").toLowerCase();
          break;
        case "tier":
          aVal = TIER_ORDER[a.tier] ?? TIER_ORDER.Undefined;
          bVal = TIER_ORDER[b.tier] ?? TIER_ORDER.Undefined;
          break;
        case "rating":
          aVal = a.average_rating ?? 0;
          bVal = b.average_rating ?? 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [games, sortKey, sortDir]);

  // ── Tier grouping ──
  const tierGroups = useMemo(() => {
    const groups = { S: [], A: [], B: [], C: [], D: [], F: [] };
    games.forEach((game) => {
      const tier = game.tier || "Undefined";
      if (groups[tier]) {
        groups[tier].push(game);
      } else {
        groups.F.push(game);
      }
    });
    return groups;
  }, [games]);

  // ═══════════════════════════════════════
  //  LOADING
  // ═══════════════════════════════════════
  if (loading) {
    return (
      <div className="tier-list">
        <div className="tier-list__inner">
          <div className="skeleton-table">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="skeleton-table__row" />
            ))}
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
      <div className="tier-list">
        <div className="tier-list__inner">
          <div className="error-state">
            <h2 className="error-state__title">Something went wrong</h2>
            <p className="error-state__desc">{error}</p>
            <button
              className="error-state__btn"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tier-list">
      <div className="tier-list__inner">
        <div className="tier-list__header">
          <h1 className="tier-list__title">Tier List</h1>
          <div className="tier-list__toggle">
            <button
              className={`tier-list__toggle-btn ${viewMode === "table" ? "tier-list__toggle-btn--active" : ""}`}
              onClick={() => setViewMode("table")}
            >
              Tabla
            </button>
            <button
              className={`tier-list__toggle-btn ${viewMode === "tier" ? "tier-list__toggle-btn--active" : ""}`}
              onClick={() => setViewMode("tier")}
            >
              Tier
            </button>
          </div>
        </div>

        {games.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-state__title">No games available</h3>
            <p className="empty-state__desc">
              Be the first to add one!
            </p>
          </div>
        ) : viewMode === "table" ? (
          /* ── Table View ── */
          <div className="tier-list__table-wrapper">
            <table className="tier-list__table">
              <thead>
                <tr>
                  <th
                    className={`tier-list__th ${sortKey === "genre" ? "tier-list__th--sorted" : ""}`}
                    onClick={() => handleSort("genre")}
                  >
                    G\u00e9nero{sortArrow("genre")}
                  </th>
                  <th
                    className={`tier-list__th ${sortKey === "release" ? "tier-list__th--sorted" : ""}`}
                    onClick={() => handleSort("release")}
                  >
                    Lanzamiento{sortArrow("release")}
                  </th>
                  <th
                    className={`tier-list__th ${sortKey === "platform" ? "tier-list__th--sorted" : ""}`}
                    onClick={() => handleSort("platform")}
                  >
                    Plataforma{sortArrow("platform")}
                  </th>
                  <th
                    className={`tier-list__th ${sortKey === "tier" ? "tier-list__th--sorted" : ""}`}
                    onClick={() => handleSort("tier")}
                  >
                    Jugabilidad{sortArrow("tier")}
                  </th>
                  <th
                    className={`tier-list__th ${sortKey === "rating" ? "tier-list__th--sorted" : ""}`}
                    onClick={() => handleSort("rating")}
                  >
                    Puntuaci\u00f3n{sortArrow("rating")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedGames.map((game) => (
                  <tr key={game.id} className="tier-list__tr">
                    <td className="tier-list__td">
                      <Link
                        to={`/game-detail/${game.id}`}
                        className="tier-list__link"
                      >
                        {game.title}
                      </Link>
                      <div className="tier-list__genres">
                        {(game.genres || []).join(", ")}
                      </div>
                    </td>
                    <td className="tier-list__td">
                      {game.release_date
                        ? new Date(game.release_date).toLocaleDateString(
                            "es-ES",
                            { year: "numeric", month: "short", day: "numeric" }
                          )
                        : "—"}
                    </td>
                    <td className="tier-list__td">
                      {(game.platforms || []).slice(0, 3).join(", ")}
                      {(game.platforms || []).length > 3 ? "..." : ""}
                    </td>
                    <td className="tier-list__td">
                      <span
                        className="tier-list__badge"
                        style={{
                          backgroundColor:
                            TIER_COLORS[game.tier] || TIER_COLORS.Undefined,
                        }}
                      >
                        {game.tier || "Undefined"}
                      </span>
                    </td>
                    <td className="tier-list__td tier-list__td--rating">
                      {game.average_rating != null
                        ? Number(game.average_rating).toFixed(1)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* ── Tier View ── */
          <div className="tier-list__tiers">
            {Object.entries(tierGroups).map(([tier, tierGames]) =>
              tierGames.length > 0 ? (
                <div key={tier} className="tier-row">
                  <div
                    className="tier-row__label"
                    style={{ backgroundColor: TIER_COLORS[tier] }}
                  >
                    {tier}
                  </div>
                  <div className="tier-row__games">
                    {tierGames.map((game) => (
                      <Link
                        key={game.id}
                        to={`/game-detail/${game.id}`}
                        className="tier-row__card"
                      >
                        <img
                          src={game.cover_img_url}
                          alt={game.title}
                          className="tier-row__cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <span className="tier-row__name">{game.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
};
