import React from "react";
import { C, FONT, card } from "../theme/tokens";

export function QiwamLogo({ size = 40 }) {
  return (<svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" style={{ flexShrink: 0 }}>
    <circle cx="20" cy="20" r="19" fill="#0E312A" stroke={C.gold} strokeWidth="1.2" />
    <rect x="8" y="13.5" width="24" height="2.6" rx="1.3" fill={C.gold} />
    <path d="M18.2 13.5 L21.8 13.5 L20 9.5 Z" fill={C.gold} />
    <path d="M8.5 18 L15.5 18 L12 26 Z" fill={C.gold} />
    <path d="M24.5 18 L31.5 18 L28 26 Z" fill="#2E8A70" />
    <rect x="19" y="16" width="2" height="12" rx="1" fill="#E9E2D2" opacity="0.9" />
    <rect x="14.5" y="28.5" width="11" height="2.4" rx="1.2" fill="#E9E2D2" opacity="0.9" />
  </svg>);
}
export function SaduBand({ height = 10 }) { return (<svg width="100%" height={height} preserveAspectRatio="none" aria-hidden="true" style={{ display: "block" }}><defs><pattern id="sadu" width="28" height={height} patternUnits="userSpaceOnUse"><rect width="28" height={height} fill={C.pine} /><path d={`M0 ${height} L7 0 L14 ${height} Z`} fill={C.gold} /><path d={`M14 ${height} L21 0 L28 ${height} Z`} fill={C.oasis} /></pattern></defs><rect width="100%" height={height} fill="url(#sadu)" /></svg>); }
export function Gauge({ score, label, sub }) {
  const R = 84, CX = 100, CY = 100, start = -210, end = 30;
  const arc = (a0, a1, color, w) => {
    const p = (a) => [CX + R * Math.cos((a * Math.PI) / 180), CY + R * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    const large = a1 - a0 > 180 ? 1 : 0;
    return <path d={`M${x0} ${y0} A${R} ${R} 0 ${large} 1 ${x1} ${y1}`} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" />;
  };
  const frac = Math.max(0.02, Math.min(1, score / 100));
  const color = score >= 75 ? C.good : score >= 55 ? C.oasis : score >= 35 ? C.warn : C.bad;
  return (<svg viewBox="0 0 200 150" style={{ width: "100%", maxWidth: 260 }}>{arc(start, end, C.line, 14)}{arc(start, start + (end - start) * frac, color, 14)}<text x={CX} y={92} textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="44" fill={C.ink}>{score}</text><text x={CX} y={114} textAnchor="middle" fontFamily={FONT} fontSize="11" fill={C.sub}>{sub}</text><text x={CX} y={140} textAnchor="middle" fontFamily={FONT} fontWeight="500" fontSize="14" fill={color}>{label}</text></svg>);
}
export function Field({ label, value, onChange, type = "number", suffix }) { return (<label style={{ display: "block", marginBottom: 12 }}><span style={{ display: "block", fontSize: 12.5, color: C.sub, marginBottom: 5 }}>{label}</span><div style={{ display: "flex", alignItems: "center", gap: 8 }}><input type={type} value={value} inputMode={type === "number" ? "decimal" : undefined} autoComplete={type === "password" ? "current-password" : type === "email" ? "email" : undefined} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`, fontFamily: FONT, fontSize: 15, color: C.ink, background: "#FBFCFB", outline: "none" }} onFocus={(e) => (e.target.style.borderColor = C.oasis)} onBlur={(e) => (e.target.style.borderColor = C.line)} />{suffix && <span style={{ fontSize: 12, color: C.sub, whiteSpace: "nowrap" }}>{suffix}</span>}</div></label>); }
export function Stat({ label, value, note, tone }) { const col = tone === "good" ? C.good : tone === "warn" ? C.warn : tone === "bad" ? C.bad : C.ink; return (<div style={{ ...card, padding: 16 }}><div style={{ fontSize: 12, color: C.sub, marginBottom: 6 }}>{label}</div><div style={{ fontSize: 22, fontWeight: 700, color: col, fontVariantNumeric: "tabular-nums" }}>{value}</div>{note && <div style={{ fontSize: 11, color: C.sub, marginTop: 4 }}>{note}</div>}</div>); }
export function CustomItems({ items, t, addLabel, onAdd, onUpd, onDel }) { return (<div>{items.map((it) => (<div key={it.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}><div style={{ flex: 1.3 }}><Field label={t.itemName} value={it.name} onChange={onUpd(it.id, "name")} type="text" /></div><div style={{ flex: 1 }}><Field label={t.amount} value={it.amount} onChange={onUpd(it.id, "amount")} suffix={t.sar} /></div><button onClick={() => onDel(it.id)} aria-label={t.remove} title={t.remove} style={{ marginTop: 22, width: 34, height: 40, borderRadius: 10, border: `1px solid ${C.line}`, background: "#fff", color: C.bad, cursor: "pointer", fontSize: 15, flexShrink: 0 }}>✕</button></div>))}<button onClick={onAdd} style={{ width: "100%", padding: "9px 0", borderRadius: 10, border: `1.5px dashed ${C.oasis}`, background: "transparent", color: C.oasis, fontFamily: FONT, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 4 }}>+ {addLabel}</button></div>); }
