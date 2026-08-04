export const C = {
  pine: "#123C33", oasis: "#1E6B58", gold: "#C09A52", bg: "#F2F4F3",
  card: "#FFFFFF", line: "#E2E6E4", ink: "#14201D", sub: "#5C6B66",
  good: "#2C7A57", warn: "#B77F1F", bad: "#B4452F", goldSoft: "#F4ECDD",
};

export const FONT = "'IBM Plex Sans Arabic', system-ui, sans-serif";

// Shared reference visual language.  Keep these tokens here so new views and
// the established calculator use the exact same surfaces.
export const card = { background: C.card, border: `1px solid ${C.line}`, borderRadius: 20, padding: "clamp(16px, 2vw, 28px)", boxShadow: "0 10px 30px rgba(18,60,51,.06)" };
export const h2s = { fontSize: "clamp(14px, 1.5vw, 20px)", fontWeight: 700, color: C.pine, margin: "0 0 14px", letterSpacing: 0.2 };
