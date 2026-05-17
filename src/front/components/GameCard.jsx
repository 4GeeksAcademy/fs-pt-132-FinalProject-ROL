import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./GameCard.css";

const TIER_COLORS = {
  S: "#FFD700",
  A: "#4CAF50",
  B: "#2196F3",
  C: "#9E9E9E",
  D: "#FF9800",
  F: "#F44336",
  Undefined: "#C0C0C0",
};

const PLATFORM_ICONS = {
  pc: "\uD83D\uDDA5\uFE0F",
  windows: "\uD83D\uDDA5\uFE0F",
  mac: "\uD83D\uDDBB\uFE0F",
  linux: "\uD83D\uDC27",
  playstation: "\uD83C\uDFAE",
  ps: "\uD83C\uDFAE",
  ps4: "\uD83C\uDFAE",
  ps5: "\uD83C\uDFAE",
  xbox: "\uD83C\uDFAE",
  nintendo: "\uD83C\uDFAE",
  switch: "\uD83C\uDFAE",
  mobile: "\uD83D\uDCF1",
  ios: "\uD83D\uDCF1",
  android: "\uD83D\uDCF1",
};

export const GameCard = ({ game }) => {
  const [imgError, setImgError] = useState(false);

  const getInitials = (title) =>
    title
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const renderStars = (rating) => {
    if (rating == null) return null;
    const rounded = Math.round(rating);
    return (
      <span className="game-card__rating">
        {"\u2605".repeat(rounded)}
        {"\u2606".repeat(5 - rounded)}
        <span className="game-card__rating-value">
          {" "}({rating.toFixed(1)})
        </span>
      </span>
    );
  };

  const description = game.description || game.summary || "";

  return (
    <Link to={`/game-detail/${game.id}`} className="game-card-link">
      <div className="game-card">
        <div className="game-card__cover">
          {!imgError ? (
            <img
              src={game.cover_img_url}
              alt={game.title}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="game-card__fallback">
              {getInitials(game.title)}
            </div>
          )}
          <span
            className="game-card__tier"
            style={{
              backgroundColor:
                TIER_COLORS[game.tier] || TIER_COLORS.Undefined,
            }}
          >
            {game.tier || "Undefined"}
          </span>
        </div>

        <div className="game-card__info">
          <h3 className="game-card__title">{game.title}</h3>
          {renderStars(game.average_rating)}

          {description && (
            <p className="game-card__description">{description}</p>
          )}

          <div className="game-card__genres">
            {(game.genres || []).map((genre, i) => (
              <span key={i} className="game-card__genre">
                {genre}
              </span>
            ))}
          </div>

          <div className="game-card__platforms">
            {(game.platforms || []).map((platform, i) => (
              <span
                key={i}
                className="game-card__platform-icon"
                title={platform}
              >
                {PLATFORM_ICONS[platform.toLowerCase()] || "\uD83C\uDFAE"}
              </span>
            ))}
          </div>

          <div className="game-card__meta">
            <span>
              {"\uD83D\uDCAC"} {game.comment_count ?? 0}
            </span>
            <span>
              {"\u2764\uFE0F"} {game.favorite_count ?? 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
