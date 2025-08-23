import React from "react";
import "../styles/loading.css";

export default function Loading({
  text = "Cargando…",
  variant = "spinner", // "spinner" | "dots" | "bar"
  size = 40,           // px (para spinner/dots)
  fullScreen = false,  // overlay a pantalla completa
  className = "",
}) {
  const content = (() => {
    switch (variant) {
      case "dots":
        return (
          <div className="ld-dots" style={{ fontSize: size * 0.35 }}>
            <span />
            <span />
            <span />
          </div>
        );
      case "bar":
        return <div className="ld-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" />;
      case "spinner":
      default:
        return (
          <div
            className="ld-spinner"
            style={{ width: size, height: size, borderWidth: Math.max(3, size * 0.1) }}
          />
        );
    }
  })();

  return (
    <div
      className={`ld-root ${fullScreen ? "ld-overlay" : ""} ${className}`}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      {content}
      {text && <span className="ld-text">{text}</span>}
    </div>
  );
}
