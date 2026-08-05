import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  ComposedChart, Bar, Line,
} from "recharts";
import { api, clearAuthToken, getAuthToken, setAuthToken } from "./lib/api";
import { CustomItems, Field, Gauge, QiwamLogo, SaduBand, Stat } from "./components/ui";
import { GoalContributionPanel } from "./components/PlanningPages";
import ReportsExperience from "./components/ReportsExperience";
import FamilyExperience from "./components/FamilyExperience";
import { GoalReservePanel, GoalsExperience } from "./components/CalculatorEnhancements";
import { GuideExperience, KnowledgeExperience } from "./components/KnowledgeGuideEnhancements";
import LocalizedFixedChecklist from "./components/LocalizedFixedChecklist";
import { KB } from "./data/knowledgeBase";
import { T } from "./data/translations";
import { computeAll, DEFAULTS, catIcon, catName, daysInMonthOf, estExpensesOf, fmt, normalizePlan, num, pct, todayISO } from "./domain/planner";
import { C, FONT, card, h2s } from "./theme/tokens";

const VERSION_LABEL = "الإصدار 1.0 — يوليو 2026 · Version 1.0 — July 2026";

const ROUTES = { "#/family": "family", "#/calculator": "calculator", "#/spending": "spending", "#/reports": "reports", "#/learn": "learn", "#/manual": "manual" };
const routeForPage = (page) => Object.entries(ROUTES).find(([, value]) => value === page)?.[0] || "#/family";

function VersionFooter() {
  return (
    <footer style={{ color: C.sub, fontFamily: FONT, fontSize: 12, padding: "18px clamp(16px, 3vw, 40px) 28px", textAlign: "center" }}>
      {VERSION_LABEL}
    </footer>
  );
}

function NavGlyph({ name }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    calculator: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 11h1M12 11h1M16 11h1M8 15h1M12 15h1M16 15h1" /></>,
    spending: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M7 10h10M7 14h5" /><path d="M7 4v4M17 4v4" /></>,
    family: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.2" /><path d="M3.5 20c.6-3.4 2.6-5 5.5-5s4.9 1.6 5.5 5M15 15.5c2.8.2 4.4 1.7 4.9 4.5" /></>,
    reports: <><path d="M5 20V10M12 20V4M19 20v-7" /><path d="M3 20h18" /></>,
    learn: <><path d="M4 5.5c3.1-1.3 5.8-.8 8 1.1 2.2-1.9 4.9-2.4 8-1.1v13c-3.1-1.3-5.8-.8-8 1.1-2.2-1.9-4.9-2.4-8-1.1z" /><path d="M12 6.6v13" /></>,
    manual: <><circle cx="12" cy="12" r="8" /><path d="M9.7 9.5a2.4 2.4 0 1 1 3.8 2c-1.2.8-1.5 1.3-1.5 2.5M12 17h.01" /></>,
    language: <><circle cx="12" cy="12" r="8" /><path d="M4.5 12h15M12 4a12 12 0 0 1 0 16M12 4a12 12 0 0 0 0 16" /></>,
    logout: <><path d="M10 5H5v14h5M14 8l3 4-3 4M8 12h9" /></>,
    collapse: <><path d="M15 5l-7 7 7 7" /><path d="M21 5v14" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function EyeIcon({ visible }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.75 12s3.25-6 9.25-6 9.25 6 9.25 6-3.25 6-9.25 6-9.25-6-9.25-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.8" />
      {!visible && <path d="M4.5 4.5 19.5 19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
    </svg>
  );
}

/* Auth Component */
function Auth({ t, lang, setLang, onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState(""), [email, setEmail] = useState(""), [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");

  async function submit() {
    setErr("");
    const identifier = email.trim().toLowerCase();
    const em = email.trim().toLowerCase();
    if ((!identifier && mode === "login") || pw.length < 8 || (mode === "register" && (!name.trim() || !em))) { setErr(t.errFill); return; }
    try {
      const result = mode === "register"
        ? await api.register({ name: name.trim(), email: em, password: pw })
        : await api.login({ identifier, password: pw });

      setAuthToken(result.accessToken);
      onLogin(result);
    } catch (error) {
      setErr(mode === "register" ? error.message : t.errBad);
    }
  }

  return (<div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: FONT }} dir={t.dir}>
    <div style={{ background: C.pine, color: "#fff", padding: "clamp(24px, 5vw, 48px) 24px 30px", textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}><QiwamLogo size={46} /><div style={{ fontSize: 32, fontWeight: 700 }}>{t.brand}</div></div>
      <div style={{ fontSize: "clamp(16px, 2.5vw, 24px)", fontWeight: 700, opacity: 0.85, marginTop: 8, whiteSpace: "pre-line", textAlign: "center", lineHeight: 1.6, fontFamily: FONT }}>{t.tagline}</div>
    </div>
    <SaduBand />
    <div style={{ maxWidth: 440, width: "100%", margin: "36px auto", padding: "0 16px", flex: 1 }}>
      <div className="auth-card" style={{ ...card, padding: "clamp(20px, 3vw, 36px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><h1 style={{ fontSize: 19, fontWeight: 700, color: C.ink, margin: 0 }}>{mode === "login" ? t.loginTitle : t.registerTitle}</h1><button onClick={() => setLang(lang === "ar" ? "en" : "ar")} style={{ border: `1px solid ${C.line}`, background: "#fff", borderRadius: 999, padding: "5px 12px", fontFamily: FONT, fontSize: 12.5, cursor: "pointer", color: C.oasis }}>{t.other}</button></div>
        <p style={{ fontSize: 12.5, color: C.sub, marginTop: 0, marginBottom: 18, lineHeight: 1.6 }}>{t.gateNote}</p>
        {mode === "register" && <Field label={t.name} value={name} onChange={setName} type="text" />}
        <Field label={mode === "login" ? t.loginIdentifier : t.email} value={email} onChange={setEmail} type={mode === "login" ? "text" : "email"} />
        <label style={{ display: "block", marginBottom: 12 }}><span style={{ display: "block", fontSize: 12.5, color: C.sub, marginBottom: 5 }}>{t.password}</span><div style={{ position: "relative" }}><input type={showPw ? "text" : "password"} value={pw} autoComplete={mode === "login" ? "current-password" : "new-password"} onChange={(e) => setPw(e.target.value)} style={{ width: "100%", padding: t.dir === "rtl" ? "10px 12px 10px 46px" : "10px 46px 10px 12px", borderRadius: 10, border: `1px solid ${C.line}`, fontFamily: FONT, fontSize: 15, color: C.ink, background: "#FBFCFB", outline: "none" }} onFocus={(e) => (e.target.style.borderColor = C.oasis)} onBlur={(e) => (e.target.style.borderColor = C.line)} /><button className="qiwam-input-trailing-icon qiwam-icon-button" type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"} title={showPw ? "Hide password" : "Show password"} style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", insetInlineEnd: 6, width: 34, height: 34, borderRadius: 8, border: "none", background: "transparent", color: C.oasis, cursor: "pointer", display: "grid", placeItems: "center" }}><EyeIcon visible={showPw} /></button></div></label>
        {err && <div style={{ color: C.bad, fontSize: 13, marginBottom: 10 }}>{err}</div>}
        <button onClick={submit} style={{ width: "100%", background: C.oasis, color: "#fff", border: "none", borderRadius: 10, padding: "12px 0", fontFamily: FONT, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{mode === "login" ? t.login : t.register}</button>
        <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setErr(""); }} style={{ width: "100%", background: "none", border: "none", color: C.oasis, fontFamily: FONT, fontSize: 13, marginTop: 12, cursor: "pointer" }}>{mode === "login" ? t.toRegister : t.toLogin}</button>
      </div>
    </div>
    <VersionFooter />
  </div>);
}

/* Manual Content Component - Full HTML restored */
/* ------------------------------------------------------------------ */
/*  Main app                                                           */
/* ------------------------------------------------------------------ */
export default function App() {
  const [lang, setLang] = useState("ar");
  const t = T[lang];
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const pageFromHash = () => {
    const h = typeof window !== "undefined" ? window.location.hash : "";
    return ROUTES[h] || "family";
  };
  const [page, setPage] = useState(pageFromHash);
  const [tab, setTab] = useState("profile");
  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const go = (p) => { const route = routeForPage(p); try { window.location.hash = route; } catch {} setPage(ROUTES[route]); };
  const [d, setD] = useState(DEFAULTS);
  const [savedMsg, setSavedMsg] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    (async () => {
      if (getAuthToken()) {
        try {
          const { user: currentUser, plan } = await api.me();
          setUser(currentUser);
          if (!ROUTES[window.location.hash]) window.location.hash = "#/family";
          if (plan) setD(normalizePlan(plan));
        } catch {
          clearAuthToken();
          setUser(null);
          setD(DEFAULTS);
        }
      }
      setBooting(false);
    })();
  }, []);

  async function loginDone(result) {
    setUser(result.user);
    setD(result.plan ? normalizePlan(result.plan) : DEFAULTS);
    setTab("profile");
    if (!ROUTES[window.location.hash]) window.location.hash = "#/family";
    setPage(pageFromHash());
  }
  async function logout() {
    try { await api.logout(); } catch {}
    clearAuthToken();
    setUser(null);
    setD(DEFAULTS);
  }
  async function savePlan() {
    if (!user || isSaving) return;

    const cleanData = JSON.parse(JSON.stringify(d));

    const numericFields = ['incYou', 'incSpouse', 'incOther', 'housing', 'transport', 'food', 'education', 'utilities', 'otherExp', 'debtPay', 'debtTotal', 'liquid', 'invested', 'age', 'retireAge', 'children', 'ret', 'inf', 'salaryGrowth'];
    numericFields.forEach(field => {
      if (cleanData[field] !== undefined) cleanData[field] = Number(cleanData[field]) || 0;
    });

    try {
      setIsSaving(true);
      await api.savePlan(cleanData);
      setSavedMsg(true); 
      setTimeout(() => setSavedMsg(false), 1800);
    } catch (error) {
      console.error("فشل الحفظ:", error);
      alert("حدث خطأ أثناء الحفظ: " + error.message);
    } finally {
      setIsSaving(false);
    }
  }

  const set = (k) => (v) => setD((p) => ({ ...p, [k]: v }));
  const setGoal = (g, k) => (v) => setD((p) => ({ ...p, goals: { ...p.goals, [g]: { ...p.goals[g], [k]: k === "on" ? v : v } } }));
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const addItem = (k, item) => setD((p) => ({ ...p, [k]: [...(p[k] || []), item] }));
  const updItem = (k, id, field) => (v) => setD((p) => ({ ...p, [k]: (p[k] || []).map((it) => (it.id === id ? { ...it, [field]: v } : it)) }));
  const delItem = (k, id) => setD((p) => ({ ...p, [k]: (p[k] || []).filter((it) => it.id !== id) }));

  const [month, setMonth] = useState(() => todayISO().slice(0, 7));
  const [txForm, setTxForm] = useState({ date: todayISO(), cat: "food", amount: "", note: "" });
  const [newCat, setNewCat] = useState("");
  const [txErr, setTxErr] = useState("");
  const persist = (updater) => setD((p) => { const next = updater(p); return next; });
  const addTx = () => { if (!(num(txForm.amount) > 0)) { setTxErr(t.errAmount); return; } setTxErr(""); const rec = { id: newId(), date: txForm.date || todayISO(), cat: txForm.cat, amount: num(txForm.amount), note: txForm.note.trim() }; persist((p) => ({ ...p, tx: [...(p.tx || []), rec] })); setTxForm((f) => ({ ...f, amount: "", note: "" })); };
  const delTx = (id) => persist((p) => ({ ...p, tx: (p.tx || []).filter((x) => x.id !== id) }));
  const setTarget = (catId) => (v) => persist((p) => ({ ...p, targets: { ...(p.targets || {}), [catId]: v } }));
  const addCategory = () => { const name = newCat.trim(); if (!name) return; const c = { id: newId(), name, custom: true }; persist((p) => ({ ...p, categories: [...(p.categories || []), c] })); setTxForm((f) => ({ ...f, cat: c.id })); setNewCat(""); };
  const delCategory = (id) => persist((p) => { const cat = (p.categories || []).find((c) => c.id === id); const isDefault = cat && !cat.custom; return { ...p, categories: (p.categories || []).filter((c) => c.id !== id), removedDefaults: isDefault ? Array.from(new Set([...(p.removedDefaults || []), id])) : (p.removedDefaults || []) }; });
  const catHasTx = (id) => (d.tx || []).some((x) => x.cat === id);
  const cats = d.categories || [];
  const monthTx = useMemo(() => (d.tx || []).filter((x) => (x.date || "").slice(0, 7) === month).sort((a, b) => (a.date < b.date ? 1 : -1)), [d.tx, month]);
  const report = useMemo(() => { const byCat = {}; monthTx.forEach((x) => { byCat[x.cat] = (byCat[x.cat] || 0) + num(x.amount); }); const total = Object.values(byCat).reduce((a, b) => a + b, 0); const rowsR = cats.map((c) => ({ c, spent: byCat[c.id] || 0, target: num((d.targets || {})[c.id]) })).filter((r) => r.spent > 0 || r.target > 0).sort((a, b) => b.spent - a.spent); const targetsTotal = cats.reduce((a, c) => a + num((d.targets || {})[c.id]), 0); return { rowsR, total, targetsTotal }; }, [monthTx, cats, d.targets]);

  const [fxForm, setFxForm] = useState({ name: "", cat: "bills", amount: "", dueDay: 1 });
  const daysIn = (m) => new Date(Number(m.slice(0, 4)), Number(m.slice(5, 7)), 0).getDate();
  const addFixed = () => { if (!fxForm.name.trim() || !(num(fxForm.amount) > 0)) return; const f = { id: newId(), name: fxForm.name.trim(), cat: fxForm.cat, amount: num(fxForm.amount), dueDay: Math.min(31, Math.max(1, num(fxForm.dueDay) || 1)) }; persist((p) => ({ ...p, fixed: [...(p.fixed || []), f] })); setFxForm({ name: "", cat: "bills", amount: "", dueDay: 1 }); };
  const delFixed = (id) => persist((p) => ({ ...p, fixed: (p.fixed || []).filter((f) => f.id !== id) }));
  const paidThisMonth = (f) => monthTx.some((x) => x.fixedId === f.id);
  const markPaid = (f) => { if (paidThisMonth(f)) return; const day = Math.min(f.dueDay, daysIn(month)); const rec = { id: newId(), date: `${month}-${String(day).padStart(2, "0")}`, cat: f.cat, amount: f.amount, note: f.name, fixedId: f.id }; persist((p) => ({ ...p, tx: [...(p.tx || []), rec] })); };
  const fixedList = d.fixed || []; const fixedTotal = fixedList.reduce((a, f) => a + num(f.amount), 0);
  const todayDay = Number(todayISO().slice(8, 10)); const isCurrentMonth = month === todayISO().slice(0, 7);

  const daily = useMemo(() => { const n = daysIn(month); const perDay = Array.from({ length: n }, () => 0); monthTx.forEach((x) => { const dd = Number((x.date || "").slice(8, 10)); if (dd >= 1 && dd <= n) perDay[dd - 1] += num(x.amount); }); let cum = 0; const series = perDay.map((v, i) => { cum += v; return { day: i + 1, spent: Math.round(v), cum: Math.round(cum) }; }); const total = cum; const fixedSpent = monthTx.filter((x) => x.fixedId).reduce((a, x) => a + num(x.amount), 0); const elapsed = isCurrentMonth ? Math.max(1, todayDay) : n; const byCat = {}; monthTx.forEach((x) => { byCat[x.cat] = (byCat[x.cat] || 0) + num(x.amount); }); let topCat = null, topVal = 0; Object.entries(byCat).forEach(([k, v]) => { if (v > topVal) { topVal = v; topCat = k; } }); const topC = cats.find((c) => c.id === topCat); return { series, total, fixedSpent, variable: total - fixedSpent, avg: total / elapsed, topName: topC ? catName(topC, t) : "—", topVal }; }, [monthTx, month, cats, t, isCurrentMonth, todayDay]);
  const byDayList = useMemo(() => { const g = {}; monthTx.forEach((x) => { (g[x.date] = g[x.date] || []).push(x); }); return Object.entries(g).sort((a, b) => (a[0] < b[0] ? 1 : -1)); }, [monthTx]);
  const [quickCat, setQuickCat] = useState(null);
  /* ==========================
   Knowledge Base State
========================== */

const [kbQuery, setKbQuery] = useState("");
const [kbFilter, setKbFilter] = useState("all");
const [kbOpen, setKbOpen] = useState(null);

const kbList = useMemo(() => {
  return KB.filter((item) => {
    const data = item[lang];

    const search =
      (
        data.term +
        " " +
        data.body
      ).toLowerCase();

    const matchesSearch =
      kbQuery.trim() === "" ||
      search.includes(kbQuery.toLowerCase());

    const matchesFilter =
      kbFilter === "all" ||
      item.kind === kbFilter;

    return matchesSearch && matchesFilter;
  });
}, [kbQuery, kbFilter, lang]);
  const catSpentMap = useMemo(() => { const m = {}; monthTx.forEach((x) => { m[x.cat] = (m[x.cat] || 0) + num(x.amount); }); return m; }, [monthTx]);
  const monthIncome = num(d.incYou) + num(d.incSpouse) + num(d.incOther) + (d.customIncome || []).reduce((a, i) => a + num(i.amount), 0);
  const remainingM = monthIncome - daily.total;
  const salaryDay = Math.min(31, Math.max(1, num(d.salaryDay) || 27));
  const daysToSalary = useMemo(() => { const now = new Date(); const mIdx = now.getMonth() + (now.getDate() >= salaryDay ? 1 : 0); const y = now.getFullYear() + Math.floor(mIdx / 12), m = ((mIdx % 12) + 12) % 12; const lastDay = new Date(y, m + 1, 0).getDate(); const nxt = new Date(y, m, Math.min(salaryDay, lastDay)); return Math.max(1, Math.round((nxt - now) / 86400000)); }, [salaryDay]);
  const safeDaily = remainingM > 0 ? remainingM / daysToSalary : 0;
  const hijriToday = useMemo(() => { try { return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA-u-ca-islamic-umalqura" : "en-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" }).format(new Date()); } catch { return ""; } }, [lang]);

  const tracked = useMemo(() => { const excl = d.excludeRecon || []; const byMonth = {}, daysWith = {}; (d.tx || []).forEach((x) => { if (excl.includes(x.cat)) return; const m = (x.date || "").slice(0, 7); if (!m) return; byMonth[m] = (byMonth[m] || 0) + num(x.amount); (daysWith[m] = daysWith[m] || new Set()).add(x.date); }); const curM = todayISO().slice(0, 7); const complete = Object.entries(byMonth).filter(([m]) => m < curM); if (complete.length) { const avg = complete.reduce((a, [, v]) => a + v, 0) / complete.length; const coverage = complete.reduce((a, [m]) => a + ((daysWith[m] ? daysWith[m].size : 0) / daysInMonthOf(m)), 0) / complete.length; return { avg, months: complete.length, coverage, partial: false }; } const elapsed = new Date().getDate(); if (byMonth[curM] && elapsed >= 15) { const dim = daysInMonthOf(curM); const curTx = (d.tx || []).filter((x) => (x.date || "").slice(0, 7) === curM && !excl.includes(x.cat)); const fixedPart = curTx.filter((x) => x.fixedId).reduce((a, x) => a + num(x.amount), 0); const varPart = curTx.filter((x) => !x.fixedId).reduce((a, x) => a + num(x.amount), 0); const unpaidFixed = (d.fixed || []).filter((f) => !excl.includes(f.cat) && !curTx.some((x) => x.fixedId === f.id)).reduce((a, f) => a + num(f.amount), 0); return { avg: fixedPart + unpaidFixed + (varPart / elapsed) * dim, months: 1, partial: true, coverage: (daysWith[curM] ? daysWith[curM].size : 0) / elapsed }; } return { avg: 0, months: 0, coverage: 0, partial: false }; }, [d.tx, d.excludeRecon]);
  const estExpenses = estExpensesOf(d);
  const usingActuals = !!d.useActuals && tracked.avg > 0;
  const effExpenses = usingActuals ? tracked.avg : estExpenses;
  const labels = useMemo(() => ({ emergency: t.gEmergency, house: t.gHouse, edu: t.gEdu, hajj: t.gHajj, wedding: t.gWedding, car: t.gCar }), [t]);
  const calc = useMemo(() => computeAll(d, effExpenses, labels, t), [d, effExpenses, labels, t]);
  const calcAlt = useMemo(() => (tracked.avg > 0 ? computeAll(d, usingActuals ? estExpenses : tracked.avg, labels, t) : null), [d, tracked.avg, usingActuals, estExpenses, labels, t]);
  const reconGap = tracked.avg > 0 ? tracked.avg - estExpenses : 0;
  const showRecon = tracked.avg > 0 && estExpenses > 0 && Math.abs(reconGap) / estExpenses > 0.08;
  const levelKey = calc.score >= 75 ? "Excellent" : calc.score >= 55 ? "Good" : calc.score >= 35 ? "Fair" : "Weak";
  const level = t["lvl" + levelKey];
  const shownScore = (levelKey === "Excellent" && !(calc.emergencyMonths >= 6 && calc.readiness >= 70)) ? 74 : (levelKey === "Good" && calc.emergencyMonths < 3) ? 54 : calc.score;
  const lowCoverage = tracked.avg > 0 && tracked.coverage < 0.6;
  const underLogged = tracked.avg > 0 && estExpenses > 0 && tracked.avg < estExpenses * 0.6;
  const adviceList = useMemo(() => { const a = []; if (calc.surplus < 0) a.push(t.aSurplusNeg); if (calc.debtRatio > 33) a.push(t.aDebtHigh); if (calc.emergencyMonths < 3) a.push(t.aEmLow); if (calc.goalsTotal > Math.max(0, calc.surplus)) a.push(t.aGoalsShort); if (calc.readiness < 50) a.push(t.aRetireLow); if (a.length === 0) a.push(t.aStrong); return a; }, [calc, t]);

  if (booting) { return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, color: C.sub }}>…</div>; }
  if (!user) return (<><FontLink /><Auth t={t} lang={lang} setLang={setLang} onLogin={loginDone} /></>);

  const subTabs = [["profile", t.tabProfile], ["goals", t.tabGoals], ["results", t.tabResults]];
  const navItems = [["family", "family", t.navFamily], ["calculator", "calculator", t.pageCalc], ["spending", "spending", t.pageSpend], ["reports", "reports", t.navReports], ["learn", "learn", t.pageLearn], ["manual", "manual", t.pageManual]];
  const editablePage = page === "family" || page === "calculator" || page === "spending";
  const SavePlanAction = ({ className = "" } = {}) => <div className={`qiwam-page-save ${className}`}><span aria-live="polite">{savedMsg ? t.saved : ""}</span><button className="qiwam-save-button" onClick={savePlan} disabled={isSaving}>{isSaving ? "…" : t.save}</button></div>;

  return (<div className={sidebarCollapsed ? "qiwam-app qiwam-sidebar-collapsed" : "qiwam-app"} dir={t.dir} lang={lang} style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, color: C.ink }}>
    <FontLink />
    <header className="qiwam-mobile-header">
      <button className="qiwam-mobile-menu" type="button" onClick={() => setNavOpen(true)} aria-label={t.openMenu}>☰</button>
      <button onClick={() => go("family")} aria-label={t.navFamily} className="qiwam-mobile-brand"><QiwamLogo size={30} /><span>{t.brand}</span></button>
      {editablePage && <SavePlanAction className="qiwam-mobile-save" />}
    </header>
    <header className="qiwam-topbar" style={{ background: C.pine, color: "#fff" }}>
      <div style={{ width: "100%", maxWidth: "min(1280px, 100%)", margin: "0 auto", padding: "clamp(12px, 2vw, 20px) clamp(16px, 3vw, 40px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "clamp(10px, 2vw, 20px)" }}>
        <button className="qiwam-mobile-menu" type="button" onClick={() => setNavOpen(true)} aria-label={t.openMenu} style={{ border: "1px solid rgba(255,255,255,.35)", background: "transparent", color: "#fff", borderRadius: 999, width: 38, height: 38, cursor: "pointer" }}>☰</button>
        <button onClick={() => go("calculator")} aria-label={t.pageCalc} style={{ display: "flex", alignItems: "center", gap: 10, border: "none", background: "transparent", color: "inherit", padding: 0, cursor: "pointer", fontFamily: FONT, textAlign: "start" }}><QiwamLogo size={38} /><div><div style={{ fontSize: 20, fontWeight: 700 }}>{t.brand}</div><div style={{ fontSize: 12, opacity: 0.8 }}>{t.welcome}، {user.name}</div></div></button>
        <div className="qiwam-header-actions">{savedMsg && <span style={{ fontSize: 12.5, color: "#F4ECDD", fontWeight: 700 }}>{t.saved}</span>}<button className="qiwam-save-button" onClick={savePlan} disabled={isSaving} style={{ border: "none", background: C.gold, color: C.pine, borderRadius: 999, padding: "6px 14px", fontFamily: FONT, fontSize: 12.5, fontWeight: 700, cursor: isSaving ? "wait" : "pointer" }}>{isSaving ? "…" : t.save}</button><button onClick={() => setLang(lang === "ar" ? "en" : "ar")} style={{ border: "1px solid rgba(255,255,255,.35)", background: "transparent", color: "#fff", borderRadius: 999, padding: "6px 14px", fontFamily: FONT, fontSize: 12.5, cursor: "pointer" }}>{t.other}</button><button onClick={logout} style={{ border: "none", background: "rgba(255,255,255,.12)", color: "#fff", borderRadius: 999, padding: "6px 14px", fontFamily: FONT, fontSize: 12.5, cursor: "pointer" }}>{t.logout}</button></div>
      </div>
    </header>
    <nav className="qiwam-sidebar" aria-label={t.openMenu}>
      <div className="qiwam-sidebar-brand"><button onClick={() => go("family")} aria-label={t.navFamily} className="qiwam-sidebar-brand-button"><QiwamLogo size={32} /><span className="qiwam-sidebar-label"><strong>{t.brand}</strong><small>{t.welcome}، {user.name}</small></span></button></div>
      <div className="qiwam-sidebar-nav">{navItems.map(([key, icon, label]) => <button key={key} type="button" onClick={() => go(key)} className={page === key ? "qiwam-sidebar-item is-active" : "qiwam-sidebar-item"} aria-current={page === key ? "page" : undefined}><NavGlyph name={icon} /><span className="qiwam-sidebar-label">{label}</span></button>)}</div>
      <div className="qiwam-sidebar-footer"><button type="button" onClick={() => setSidebarCollapsed((value) => !value)} className="qiwam-sidebar-footer-action qiwam-sidebar-collapse"><NavGlyph name="collapse" /><span className="qiwam-sidebar-label">{t.collapseMenu}</span></button><div className="qiwam-sidebar-footer-divider" /><button type="button" onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="qiwam-sidebar-footer-action"><NavGlyph name="language" /><span className="qiwam-sidebar-label">{t.other}</span></button><button type="button" onClick={logout} className="qiwam-sidebar-footer-action"><NavGlyph name="logout" /><span className="qiwam-sidebar-label">{t.logout}</span></button></div>
    </nav>
    {navOpen && (
  <div
    className="qiwam-drawer-backdrop"
    onClick={() => setNavOpen(false)}
  >
    <aside
      className="qiwam-drawer"
      role="dialog"
      aria-modal="true"
      aria-label={t.openMenu}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 20px",
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <strong>{t.brand}</strong>

        <button
          type="button"
          onClick={() => setNavOpen(false)}
          aria-label={t.closeMenu}
          style={{
            border: "none",
            background: "none",
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {navItems.map(([k, , label]) => (
        <button
          key={k}
          type="button"
          onClick={() => {
            go(k);
            setNavOpen(false);
          }}
          className="qiwam-drawer-item"
          aria-current={page === k ? "page" : undefined}
        >
          {label}
        </button>
      ))}

      <button
        type="button"
        onClick={async () => {
          setNavOpen(false);
          await logout();
        }}
        className="qiwam-drawer-item"
        style={{
          marginTop: "12px",
          color: "#b42318",
          fontWeight: 700,
          borderTop: `1px solid ${C.line}`,
        }}
      >
        {t.logout}
      </button>
    </aside>
  </div>
)}


    {page === "calculator" && (<div className="qiwam-subtabs qiwam-nav-scroll" style={{ display: "flex", gap: "clamp(8px, 1.5vw, 16px)", flexWrap: "nowrap", alignItems: "center" }}><div className="qiwam-save-status">{savedMsg && <span>{t.saved}</span>}<button className="qiwam-save-button" onClick={savePlan} disabled={isSaving}>{isSaving ? "…" : t.save}</button></div>{subTabs.map(([k, label]) => (<button className="qiwam-tab-button" key={k} onClick={() => setTab(k)} style={{ fontFamily: FONT, fontSize: 13.5, fontWeight: tab === k ? 700 : 500, cursor: "pointer", padding: "9px 18px", borderRadius: 999, border: `1px solid ${tab === k ? C.oasis : C.line}`, background: tab === k ? C.oasis : "#fff", color: tab === k ? "#fff" : C.ink, whiteSpace: "nowrap" }}>{label}</button>))}</div>)}

    <main className="qiwam-main" style={{ width: "100%", maxWidth: "min(1280px, 100%)", margin: "clamp(16px, 2vw, 24px) auto 60px", padding: "0 clamp(16px, 3vw, 40px)" }}>
      
      {page === "family" && <SavePlanAction />}
      {page === "family" && <FamilyExperience d={d} setD={setD} t={t} lang={lang} />} 
      {page === "reports" && <ReportsExperience d={d} calc={calc} monthTx={monthTx} report={report} month={month} t={t} lang={lang} />} 

      {/* ---------------- PROFILE ---------------- */}
      {page === "calculator" && tab === "profile" && (
        <div className="qiwam-profile-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
          <section style={card}><h2 style={h2s}>{t.incomeH}</h2><Field label={t.you} value={d.incYou} onChange={set("incYou")} suffix={t.sar} /><Field label={t.spouse} value={d.incSpouse} onChange={set("incSpouse")} suffix={t.sar} /><Field label={t.otherInc} value={d.incOther} onChange={set("incOther")} suffix={t.sar} /><CustomItems items={d.customIncome || []} t={t} addLabel={t.addIncome} onAdd={() => addItem("customIncome", { id: newId(), name: "", amount: 0 })} onUpd={(id, f) => updItem("customIncome", id, f)} onDel={(id) => delItem("customIncome", id)} /><h2 style={{ ...h2s, marginTop: 20 }}>{t.familyH}</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: "clamp(6px, 1.5vw, 14px)" }}><Field label={t.age} value={d.age} onChange={set("age")} /><Field label={t.retireAge} value={d.retireAge} onChange={set("retireAge")} /><Field label={t.children} value={d.children} onChange={set("children")} /></div></section>
          <section style={card}><h2 style={h2s}>{t.expH}</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "clamp(6px, 1.5vw, 14px)" }}><Field label={t.housing} value={d.housing} onChange={set("housing")} suffix={t.sar} /><Field label={t.transport} value={d.transport} onChange={set("transport")} suffix={t.sar} /><Field label={t.food} value={d.food} onChange={set("food")} suffix={t.sar} /><Field label={t.education} value={d.education} onChange={set("education")} suffix={t.sar} /><Field label={t.utilities} value={d.utilities} onChange={set("utilities")} suffix={t.sar} /><Field label={t.otherExp} value={d.otherExp} onChange={set("otherExp")} suffix={t.sar} /></div><CustomItems items={d.customExpense || []} t={t} addLabel={t.addExpense} onAdd={() => addItem("customExpense", { id: newId(), name: "", amount: 0 })} onUpd={(id, f) => updItem("customExpense", id, f)} onDel={(id) => delItem("customExpense", id)} /></section>
          <section style={card}><h2 style={h2s}>{t.debtH}</h2><Field label={t.debtPay} value={d.debtPay} onChange={set("debtPay")} suffix={t.sar} /><Field label={t.debtTotal} value={d.debtTotal} onChange={set("debtTotal")} suffix={t.sar} /><h2 style={{ ...h2s, marginTop: 20 }}>{t.wealthH}</h2><Field label={t.liquid} value={d.liquid} onChange={set("liquid")} suffix={t.sar} /><Field label={t.invested} value={d.invested} onChange={set("invested")} suffix={t.sar} /><h2 style={{ ...h2s, marginTop: 20 }}>{t.assumpH}</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "clamp(6px, 1.5vw, 14px)" }}><Field label={t.ret} value={d.ret} onChange={set("ret")} /><Field label={t.inf} value={d.inf} onChange={set("inf")} /></div><Field label={t.growthL} value={d.salaryGrowth} onChange={set("salaryGrowth")} /></section>
        </div>
      )}

      {/* ---------------- DAILY SPEND ---------------- */}
      {page === "spending" && <SavePlanAction />}
      {page === "spending" && ( <div className="qiwam-spending-experience" style={{ display: "grid", gap: "clamp(12px, 2vw, 24px)" }}><LocalizedFixedChecklist setD={setD} t={t} /><section className="qiwam-spending-reserve" style={card}><label><input type="checkbox" checked={d.reserveGoals !== false} onChange={(event) => setD((previous) => ({ ...previous, reserveGoals: event.target.checked }))} />{t.reserveGoals}</label><span>{t.reservedLead}</span></section>
        <section style={{ ...card, background: C.pine, border: "none", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "clamp(12px, 2vw, 24px)", flexWrap: "wrap" }}>
            <div><div style={{ fontSize: 11.5, opacity: 0.75 }}>{hijriToday}{hijriToday ? " · " : ""}{todayISO()}</div><div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 12 }}>{t.heroLeft}</div><div style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, lineHeight: 1.15, fontVariantNumeric: "tabular-nums", color: remainingM < 0 ? "#F0A08C" : "#fff" }}>{fmt(remainingM, lang)} <span style={{ fontSize: 16, fontWeight: 500 }}>{t.sar}</span></div></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(6px, 1vw, 16px) clamp(16px, 3vw, 32px)", alignContent: "center" }}>
              {[[t.heroIncome, fmt(monthIncome, lang) + " " + t.sar], [t.heroSpent, fmt(daily.total, lang) + " " + t.sar], ...(isCurrentMonth ? [[t.daysToSalary, fmt(daysToSalary, lang)], [t.safeDaily, fmt(safeDaily, lang) + " " + t.sar]] : [])].map(([l, v]) => (<div key={l}><div style={{ fontSize: 11, opacity: 0.7 }}>{l}</div><div style={{ fontSize: "clamp(14px, 2vw, 18px)", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{v}</div></div>))}
            </div>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,.18)", overflow: "hidden", margin: "16px 0 10px" }}><div style={{ width: `${monthIncome > 0 ? Math.min(100, (daily.total / monthIncome) * 100) : 0}%`, height: "100%", background: daily.total > monthIncome ? C.bad : C.gold, borderRadius: 999, transition: "width .3s" }} /></div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}><label style={{ fontSize: 11.5, opacity: 0.8, display: "inline-flex", alignItems: "center", gap: 8 }}>{t.salaryDayL}<input type="number" min="1" max="31" value={salaryDay} onChange={(e) => persist((p) => ({ ...p, salaryDay: e.target.value }))} style={{ width: 56, padding: "4px 8px", borderRadius: 8, border: "none", fontFamily: FONT, fontSize: 13, textAlign: "center", background: "rgba(255,255,255,.14)", color: "#fff" }} /></label><label style={{ fontSize: 11.5, opacity: 0.8, display: "inline-flex", alignItems: "center", gap: 8 }}>{t.monthL}<input type="month" value={month} onChange={(e) => setMonth(e.target.value)} style={{ padding: "4px 8px", borderRadius: 8, border: "none", fontFamily: FONT, fontSize: 12.5, background: "rgba(255,255,255,.14)", color: "#fff" }} /></label></div>
          {!isCurrentMonth && (<p style={{ fontSize: 11, opacity: 0.75, margin: "8px 0 0", lineHeight: 1.6 }}>{t.pastMonthNote}</p>)}
        </section>
        <section style={card}><h2 style={{ ...h2s, marginBottom: 4 }}>{t.categoryL}</h2><p style={{ fontSize: 12.5, color: C.sub, margin: "0 0 14px" }}>{t.tapHint}</p><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 140px), 1fr))", gap: "clamp(8px, 1.5vw, 14px)" }}>{cats.map((c) => { const spentC = catSpentMap[c.id] || 0; const tgt = num((d.targets || {})[c.id]); const overB = tgt > 0 && spentC > tgt; const active = quickCat === c.id; return (<div key={c.id} style={{ position: "relative" }}><button onClick={() => { setTxForm((f) => ({ ...f, cat: c.id, date: todayISO() })); setQuickCat(active ? null : c.id); setTxErr(""); }} style={{ width: "100%", textAlign: "start", fontFamily: FONT, cursor: "pointer", padding: "12px 12px 10px", borderRadius: 12, border: `1.5px solid ${active ? C.oasis : overB ? C.bad : C.line}`, background: active ? "#EFF6F3" : "#fff" }}><div style={{ fontSize: 21 }}>{catIcon(c)}</div><div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, marginTop: 4 }}>{catName(c, t)}</div><div style={{ fontSize: 12, color: overB ? C.bad : C.sub, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>{fmt(spentC, lang)}{tgt > 0 ? ` ${t.budgetOf} ${fmt(tgt, lang)}` : ""} {t.sar}</div>{tgt > 0 && <div style={{ height: 4, borderRadius: 999, background: C.line, overflow: "hidden", marginTop: 6 }}><div style={{ width: `${Math.min(100, (spentC / tgt) * 100)}%`, height: "100%", background: overB ? C.bad : C.oasis }} /></div>}</button>{(c.custom || !catHasTx(c.id)) && <button onClick={() => delCategory(c.id)} title={t.remove} style={{ position: "absolute", top: 6, insetInlineEnd: 6, border: "none", background: "none", color: C.bad, cursor: "pointer", fontSize: 11, padding: 2 }}>✕</button>}</div>); })}</div><div style={{ display: "flex", gap: 8, marginTop: 12 }}><input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder={t.newCat} style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: `1px dashed ${C.oasis}`, fontFamily: FONT, fontSize: 13.5, background: "transparent" }} /><button onClick={addCategory} style={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, cursor: "pointer", padding: "0 14px", borderRadius: 10, border: "none", background: C.goldSoft, color: C.pine }}>{t.addCat}</button></div>{quickCat && (() => { const c = cats.find((cc) => cc.id === quickCat); if (!c) return null; return (<div style={{ marginTop: 14, padding: 16, borderRadius: 12, border: `1.5px solid ${C.oasis}`, background: "#F6FAF8" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><span style={{ fontSize: 14, fontWeight: 700, color: C.pine }}>{t.quickFor}: {catIcon(c)} {catName(c, t)}</span><button onClick={() => setQuickCat(null)} style={{ border: "none", background: "none", color: C.sub, cursor: "pointer", fontFamily: FONT, fontSize: 12.5 }}>{t.cancelL} ✕</button></div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0 12px" }}><Field label={t.amount} value={txForm.amount} onChange={(v) => setTxForm((f) => ({ ...f, amount: v }))} suffix={t.sar} /><label style={{ display: "block", marginBottom: 12 }}><span style={{ display: "block", fontSize: 12.5, color: C.sub, marginBottom: 5 }}>{t.dateL}</span><input type="date" value={txForm.date} onChange={(e) => setTxForm((f) => ({ ...f, date: e.target.value }))} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`, fontFamily: FONT, fontSize: 14.5, background: "#fff" }} /></label><Field label={t.noteL} value={txForm.note} onChange={(v) => setTxForm((f) => ({ ...f, note: v }))} type="text" /></div>{txErr && <div style={{ color: C.bad, fontSize: 13, marginBottom: 8 }}>{txErr}</div>}<button onClick={() => { if (num(txForm.amount) > 0) { addTx(); setQuickCat(null); } else setTxErr(t.errAmount); }} style={{ width: "100%", background: C.oasis, color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontFamily: FONT, fontSize: 14.5, fontWeight: 700, cursor: "pointer" }}>{t.addTx}</button></div>); })()}</section>
        <section style={card}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}><h2 style={h2s}>{t.fixedH}</h2><span style={{ fontSize: 12.5, color: C.sub }}>{t.fixedTotal}: <strong style={{ color: C.ink }}>{fmt(fixedTotal, lang)} {t.sar}</strong></span></div>{fixedList.length === 0 && <p style={{ fontSize: 13, color: C.sub }}>{t.noFixed}</p>}<div style={{ display: "grid", gap: 8, marginBottom: 16 }}>{fixedList.map((f) => { const paid = paidThisMonth(f); const overdue = !paid && isCurrentMonth && todayDay > f.dueDay; const c = cats.find((cc) => cc.id === f.cat); return (<div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1px solid ${paid ? C.line : overdue ? C.bad : C.gold}`, background: paid ? "#FAFBFA" : "#fff" }}><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 700 }}>{f.name}</div><div style={{ fontSize: 11.5, color: overdue ? C.bad : C.sub }}>{c ? catName(c, t) : "—"} · {overdue ? t.overdueTag : `${t.dueTag} ${fmt(f.dueDay, lang)}`}</div></div><div style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{fmt(f.amount, lang)} {t.sar}</div>{paid ? <span style={{ fontSize: 11.5, color: C.good, fontWeight: 700, whiteSpace: "nowrap" }}>{t.paidTag}</span> : <button onClick={() => markPaid(f)} style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, cursor: "pointer", padding: "6px 10px", borderRadius: 999, border: "none", background: C.oasis, color: "#fff", whiteSpace: "nowrap" }}>{t.markPaid}</button>}<button onClick={() => delFixed(f.id)} title={t.remove} style={{ border: "none", background: "none", color: C.bad, cursor: "pointer", fontSize: 13, padding: 2 }}>✕</button></div>); })}</div><Field label={t.fixedNameL} value={fxForm.name} onChange={(v) => setFxForm((f) => ({ ...f, name: v }))} type="text" /><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}><Field label={t.amount} value={fxForm.amount} onChange={(v) => setFxForm((f) => ({ ...f, amount: v }))} suffix={t.sar} /><Field label={t.dueDayL} value={fxForm.dueDay} onChange={(v) => setFxForm((f) => ({ ...f, dueDay: v }))} /></div><span style={{ display: "block", fontSize: 12.5, color: C.sub, marginBottom: 6 }}>{t.categoryL}</span><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>{cats.map((c) => (<button key={c.id} onClick={() => setFxForm((f) => ({ ...f, cat: c.id }))} style={{ fontFamily: FONT, fontSize: 12, cursor: "pointer", padding: "5px 11px", borderRadius: 999, border: `1px solid ${fxForm.cat === c.id ? C.gold : C.line}`, background: fxForm.cat === c.id ? C.goldSoft : "#fff", color: C.ink, fontWeight: fxForm.cat === c.id ? 700 : 400 }}>{catName(c, t)}</button>))}</div><button onClick={addFixed} style={{ width: "100%", background: "transparent", color: C.oasis, border: `1.5px dashed ${C.oasis}`, borderRadius: 10, padding: "10px 0", fontFamily: FONT, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>+ {t.addFixed}</button></section>
        <section style={card}><h2 style={h2s}>{t.dailyH}</h2><div dir="ltr" style={{ width: "100%", height: 240 }}><ResponsiveContainer><ComposedChart data={daily.series} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}><CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" tick={{ fontFamily: FONT, fontSize: 10.5, fill: C.sub }} interval={2} /><YAxis yAxisId="l" tick={{ fontFamily: FONT, fontSize: 10.5, fill: C.sub }} width={46} tickFormatter={(v) => (v >= 1000 ? Math.round(v / 1000) + "K" : v)} /><YAxis yAxisId="r" orientation="right" tick={{ fontFamily: FONT, fontSize: 10.5, fill: C.gold }} width={46} tickFormatter={(v) => (v >= 1000 ? Math.round(v / 1000) + "K" : v)} /><Tooltip formatter={(v, n) => [fmt(v, lang) + " " + t.sar, n]} labelFormatter={(l) => `${t.dayL} ${fmt(l, lang)}`} contentStyle={{ fontFamily: FONT, fontSize: 12, borderRadius: 10, border: `1px solid ${C.line}` }} /><Legend wrapperStyle={{ fontFamily: FONT, fontSize: 12 }} /><Bar yAxisId="l" dataKey="spent" name={t.perDayL} fill={C.oasis} radius={[4, 4, 0, 0]} /><Line yAxisId="r" type="monotone" dataKey="cum" name={t.cumulativeL} stroke={C.gold} strokeWidth={2.5} dot={false} /></ComposedChart></ResponsiveContainer></div></section>
        <section style={card}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}><h2 style={h2s}>{t.monthTx}</h2><span style={{ fontSize: 13, color: C.sub }}>{fmt(monthTx.length, lang)} {t.txCount} · <strong style={{ color: C.ink }}>{fmt(daily.total, lang)} {t.sar}</strong></span></div>{monthTx.length === 0 ? <p style={{ fontSize: 13.5, color: C.sub }}>{t.noTx}</p> : <div style={{ display: "grid", gap: 12, maxHeight: 480, overflowY: "auto" }}>{byDayList.map(([date, items]) => (<div key={date}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.sub, padding: "0 4px 5px", borderBottom: `1px solid ${C.line}`, marginBottom: 6 }}><span style={{ fontWeight: 700, color: C.pine }}>{date}</span><span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(items.reduce((a, x) => a + num(x.amount), 0), lang)} {t.sar}</span></div><div style={{ display: "grid", gap: 5 }}>{items.map((x) => { const c = cats.find((cc) => cc.id === x.cat); return (<div key={x.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "#FAFBFA", border: `1px solid ${C.line}` }}><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700 }}>{c ? catName(c, t) : "—"}{x.fixedId && <span style={{ fontSize: 10.5, color: C.gold, fontWeight: 700 }}> · {t.fixedShare}</span>}</div>{x.note && <div style={{ fontSize: 11.5, color: C.sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.note}</div>}</div><div style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{fmt(x.amount, lang)} {t.sar}</div><button onClick={() => delTx(x.id)} title={t.remove} style={{ border: "none", background: "none", color: C.bad, cursor: "pointer", fontSize: 13, padding: 3 }}>✕</button></div>); })}</div></div>))}</div>}</section>
      </div>)}

      {/* ---------------- GOALS ---------------- */}
      {page === "calculator" && tab === "goals" && <GoalsExperience d={d} setD={setD} calc={calc} t={t} lang={lang} />}
      {page === "calculator" && tab === "goals" && <span className="qiwam-legacy-goal-sentinel" aria-hidden="true" />}
      {page === "calculator" && tab === "goals" && <GoalReservePanel d={d} setD={setD} calc={calc} t={t} lang={lang} />}
      {page === "calculator" && tab === "goals" && (<section style={card}><GoalContributionPanel d={d} setD={setD} calc={calc} t={t} /><h2 style={{ ...h2s, marginTop: 20 }}>{t.goalsH}</h2><p style={{ fontSize: 13, color: C.sub, marginTop: -6, marginBottom: 18 }}>{t.goalsNote}</p><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "clamp(12px, 2vw, 20px)" }}>{[["emergency", t.gEmergency], ["house", t.gHouse], ["edu", t.gEdu], ["hajj", t.gHajj], ["wedding", t.gWedding], ["car", t.gCar]].map(([k, label]) => { const g = d.goals[k]; return (<div key={k} style={{ border: `1px solid ${g.on ? C.oasis : C.line}`, borderRadius: 12, padding: 16, background: g.on ? "#fff" : "#FAFBFA" }}><label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, cursor: "pointer" }}><span style={{ fontWeight: 700, fontSize: 14.5 }}>{label}</span><span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.sub }}>{t.enabled}<input type="checkbox" checked={g.on} onChange={(e) => setGoal(k, "on")(e.target.checked)} style={{ width: 17, height: 17, accentColor: C.oasis }} /></span></label><div style={{ opacity: g.on ? 1 : 0.45, pointerEvents: g.on ? "auto" : "none" }}><Field label={t.target} value={g.target} onChange={setGoal(k, "target")} suffix={t.sar} /><Field label={t.years} value={g.years} onChange={setGoal(k, "years")} /><Field label={t.alreadySaved} value={g.saved ?? 0} onChange={setGoal(k, "saved")} suffix={t.sar} />{k === "emergency" && <button onClick={() => setGoal("emergency", "saved")(num(d.liquid))} style={{ width: "100%", background: "transparent", color: C.oasis, border: `1px dashed ${C.oasis}`, borderRadius: 8, padding: "7px 0", fontFamily: FONT, fontSize: 11.5, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>{t.useLiquid} ({fmt(num(d.liquid), lang)})</button>}{num(g.saved) > 0 && num(g.saved) < num(g.target) && <p style={{ fontSize: 11, color: C.sub, margin: "0 0 6px" }}>{t.remainingGap}: <strong style={{ color: C.ink }}>{fmt(num(g.target) - num(g.saved), lang)} {t.sar}</strong></p>}{num(g.saved) >= num(g.target) && num(g.target) > 0 && <p style={{ fontSize: 11.5, color: C.good, fontWeight: 700, margin: "0 0 6px" }}>{t.goalDone}</p>}</div></div>); })}{(d.customGoals || []).map((g) => (<div key={g.id} style={{ border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: 16, background: "#fff" }}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}><div style={{ flex: 1 }}><Field label={t.customGoalName} value={g.name} onChange={updItem("customGoals", g.id, "name")} type="text" /></div><button onClick={() => delItem("customGoals", g.id)} aria-label={t.remove} title={t.remove} style={{ width: 34, height: 40, marginTop: 8, borderRadius: 10, border: `1px solid ${C.line}`, background: "#fff", color: C.bad, cursor: "pointer", fontSize: 15, flexShrink: 0 }}>✕</button></div><Field label={t.target} value={g.target} onChange={updItem("customGoals", g.id, "target")} suffix={t.sar} /><Field label={t.years} value={g.years} onChange={updItem("customGoals", g.id, "years")} /><Field label={t.alreadySaved} value={g.saved ?? 0} onChange={updItem("customGoals", g.id, "saved")} suffix={t.sar} />{num(g.saved) >= num(g.target) && num(g.target) > 0 && <p style={{ fontSize: 11.5, color: C.good, fontWeight: 700, margin: 0 }}>{t.goalDone}</p>}</div>))}<button onClick={() => addItem("customGoals", { id: newId(), name: t.customGoalDefault, target: 50000, years: 5, saved: 0, on: true })} style={{ minHeight: 160, borderRadius: 12, border: `1.5px dashed ${C.oasis}`, background: "transparent", color: C.oasis, fontFamily: FONT, fontSize: 14.5, fontWeight: 700, cursor: "pointer" }}>+ {t.addGoal}</button></div></section>)}

      {/* ---------------- RESULTS ---------------- */}
      {page === "calculator" && tab === "results" && (<div className="qiwam-results-experience" style={{ display: "grid", gap: "clamp(12px, 2vw, 24px)" }}>
        {showRecon && (<section style={{ ...card, background: C.goldSoft, borderColor: "#E4D6B8" }}><h2 style={{ ...h2s, marginBottom: 8 }}>{t.reconTitle}</h2><p style={{ fontSize: 13.5, lineHeight: 1.8, margin: "0 0 10px" }}>{t.reconBody.replace("{m}", fmt(tracked.months, lang)).replace("{a}", fmt(tracked.avg, lang)).replace("{e}", fmt(estExpenses, lang)).replace("{g}", fmt(Math.abs(reconGap), lang))}</p>{calcAlt && !usingActuals && <p style={{ fontSize: 13.5, margin: "0 0 12px" }}>{t.reconScore} <strong style={{ color: calcAlt.score < calc.score ? C.bad : C.good, fontSize: 17 }}>{calcAlt.score}</strong><span style={{ color: C.sub }}> ({t.scoreH}: {calc.score})</span></p>}<div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>{usingActuals ? <><span style={{ background: C.oasis, color: "#fff", borderRadius: 999, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>{t.usingActualsTag}</span><button onClick={() => setD((prev) => ({ ...prev, useActuals: false }))} style={{ border: `1px solid ${C.line}`, background: "#fff", color: C.ink, borderRadius: 999, padding: "7px 16px", fontFamily: FONT, fontSize: 12.5, cursor: "pointer" }}>{t.revertEst}</button></> : <button onClick={() => setD((prev) => ({ ...prev, useActuals: true }))} style={{ border: "none", background: C.pine, color: "#fff", borderRadius: 999, padding: "9px 20px", fontFamily: FONT, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{t.useActualsBtn}</button>}</div><div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #E4D6B8" }}><div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", fontSize: 12 }}><span style={{ color: C.sub }}>{t.coverageL}: <strong style={{ color: lowCoverage ? C.bad : C.good }}>{pct(tracked.coverage * 100, lang)}</strong> {t.ofDays}</span><div style={{ flex: "1 1 90px", minWidth: 90, height: 6, borderRadius: 999, background: "#E4D6B8", overflow: "hidden" }}><div style={{ width: `${Math.min(100, tracked.coverage * 100)}%`, height: "100%", background: lowCoverage ? C.bad : C.oasis }} /></div></div>{tracked.partial && <p style={{ fontSize: 11.5, color: C.warn, margin: "6px 0 0", lineHeight: 1.6 }}>{t.partialNote}</p>}{lowCoverage && <p style={{ fontSize: 11.5, color: C.bad, margin: "6px 0 0", lineHeight: 1.6 }}>{t.lowCoverageWarn}</p>}{underLogged && <p style={{ fontSize: 11.5, color: C.bad, margin: "6px 0 0", lineHeight: 1.6 }}>{t.underLogWarn}</p>}<span style={{ display: "block", fontSize: 11.5, color: C.sub, margin: "10px 0 6px" }}>{t.exclH}</span><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{cats.map((c) => { const ex = (d.excludeRecon || []).includes(c.id); return (<button key={c.id} onClick={() => setD((prev) => ({ ...prev, excludeRecon: ex ? (prev.excludeRecon || []).filter((i) => i !== c.id) : [...(prev.excludeRecon || []), c.id] }))} style={{ fontFamily: FONT, fontSize: 11.5, cursor: "pointer", padding: "4px 10px", borderRadius: 999, border: `1px solid ${ex ? C.bad : C.line}`, background: ex ? "#FBEDE9" : "#fff", color: ex ? C.bad : C.ink, textDecoration: ex ? "line-through" : "none" }}>{catIcon(c)} {catName(c, t)}</button>); })}</div></div><p style={{ fontSize: 11.5, color: C.sub, margin: "10px 0 0", lineHeight: 1.6 }}>{t.reconNote}</p></section>)}
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "clamp(12px, 2vw, 20px)", alignItems: "stretch" }}>
          <section style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><h2 style={{ ...h2s, textAlign: "center" }}>{t.scoreH}</h2><Gauge score={shownScore} label={level} sub={t.outOf} />{(levelKey === "Excellent" && !(calc.emergencyMonths >= 6 && calc.readiness >= 70)) && <><p style={{ fontSize: 11, color: C.warn, textAlign: "center", margin: "4px 0 0", lineHeight: 1.6 }}>{t.capNote}</p><p style={{ fontSize: 10.5, color: C.sub, textAlign: "center", margin: "3px 0 0" }}>{t.rawScore}: {fmt(calc.score, lang)}</p></>}{usingActuals && <p style={{ fontSize: 10.5, color: C.oasis, textAlign: "center", margin: "6px 0 0", fontWeight: 700 }}>{t.usingActualsTag}</p>}</section>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "clamp(8px, 1.5vw, 16px)", alignContent: "start" }}><Stat label={t.kSurplus} value={`${fmt(calc.surplus, lang)} ${t.sar}`} tone={calc.surplus >= 0 ? "good" : "bad"} /><Stat label={t.kSavingsRate} value={pct(calc.savingsRate, lang)} note={t.srGuide} tone={calc.savingsRate >= 20 ? "good" : calc.savingsRate >= 10 ? "warn" : "bad"} /><Stat label={t.kDebt} value={pct(calc.debtRatio, lang)} note={t.debtGuide} tone={calc.debtRatio <= 33 ? "good" : "bad"} /><Stat label={t.kEmergency} value={`${new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", { maximumFractionDigits: 1 }).format(calc.emergencyMonths)} ${t.months}`} note={t.emGuide} tone={calc.emergencyMonths >= 6 ? "good" : calc.emergencyMonths >= 3 ? "warn" : "bad"} /></div>
        </div>

        <section style={card}><h2 style={h2s}>{t.projH}</h2><div dir="ltr" style={{ width: "100%", height: 260 }}><ResponsiveContainer><AreaChart data={calc.rows} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}><defs><linearGradient id="nomG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.oasis} stopOpacity={0.35} /><stop offset="100%" stopColor={C.oasis} stopOpacity={0.03} /></linearGradient></defs><CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} /><XAxis dataKey="year" tick={{ fontFamily: FONT, fontSize: 11, fill: C.sub }} tickFormatter={(v) => v + " " + t.yearsAxis} /><YAxis tick={{ fontFamily: FONT, fontSize: 11, fill: C.sub }} tickFormatter={(v) => (v >= 1e6 ? (v / 1e6).toFixed(1) + "M" : v >= 1e3 ? Math.round(v / 1e3) + "K" : v)} width={52} /><Tooltip formatter={(v, n) => [fmt(v, lang) + " " + t.sar, n]} contentStyle={{ fontFamily: FONT, fontSize: 12, borderRadius: 10, border: `1px solid ${C.line}` }} /><Legend wrapperStyle={{ fontFamily: FONT, fontSize: 12 }} /><Area type="monotone" dataKey="nominal" name={t.nominal} stroke={C.oasis} strokeWidth={2.5} fill="url(#nomG)" /><Area type="monotone" dataKey="real" name={t.real} stroke={C.gold} strokeWidth={2} fill="none" strokeDasharray="5 4" /></AreaChart></ResponsiveContainer></div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: "clamp(8px, 1.5vw, 16px)", marginTop: 14 }}><Stat label={t.atRetire} value={`${fmt(calc.atRetire, lang)} ${t.sar}`} /><Stat label={t.needed} value={`${fmt(calc.neededAtRetire, lang)} ${t.sar}`} /><Stat label={t.readiness} value={pct(calc.readiness, lang)} tone={calc.readiness >= 100 ? "good" : calc.readiness >= 50 ? "warn" : "bad"} /></div><div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.line}` }}><span style={{ display: "block", fontSize: 12.5, color: C.sub, marginBottom: 7 }}>{t.debtRetireQ}</span><div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>{[["no", t.debtNo], ["partly", t.debtPartly], ["yes", t.debtYes]].map(([k, label]) => (<button key={k} onClick={() => setD((prev) => ({ ...prev, debtInRetirement: k }))} style={{ fontFamily: FONT, fontSize: 12.5, cursor: "pointer", padding: "7px 15px", borderRadius: 999, border: `1px solid ${(d.debtInRetirement || "partly") === k ? C.oasis : C.line}`, background: (d.debtInRetirement || "partly") === k ? C.oasis : "#fff", color: (d.debtInRetirement || "partly") === k ? "#fff" : C.ink, fontWeight: (d.debtInRetirement || "partly") === k ? 700 : 400 }}>{label}</button>))}</div></div></section>
        
        <section style={card}><h2 style={h2s}>{t.allocH}</h2><div style={{ display: "flex", height: 14, borderRadius: 999, overflow: "hidden", background: C.line, marginBottom: 10 }}><div style={{ width: `${calc.surplus > 0 ? (calc.toGoals / calc.surplus) * 100 : 0}%`, background: C.oasis }} /><div style={{ width: `${calc.surplus > 0 ? (calc.toRetirement / calc.surplus) * 100 : 0}%`, background: C.gold }} /></div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "clamp(8px, 1.5vw, 16px)" }}><Stat label={t.allocGoals} value={`${fmt(calc.toGoals, lang)} ${t.sar}`} /><Stat label={t.allocRetire} value={`${fmt(calc.toRetirement, lang)} ${t.sar}`} note={calc.retireFull > calc.toRetirement + 1 ? `${t.todayL} → ${fmt(calc.retireFull, lang)} ${t.perMonth} ${t.retireFromY} ${fmt(calc.fullFromYear, lang)}` : undefined} /><Stat label={t.kSurplus} value={`${fmt(calc.surplus, lang)} ${t.sar}`} tone={calc.surplus >= 0 ? "good" : "bad"} /></div><p style={{ fontSize: 11.5, color: C.sub, margin: "10px 0 0", lineHeight: 1.6 }}>{t.allocNote}</p></section>
        
        <section style={card}><h2 style={h2s}>{t.goalTable}</h2><div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}><thead><tr style={{ color: C.sub, fontSize: 12 }}>{[t.gName, t.target, t.years, t.gMonthly, t.gStatus].map((h) => (<th key={h} style={{ textAlign: "start", padding: "8px 10px", borderBottom: `1px solid ${C.line}`, fontWeight: 500 }}>{h}</th>))}</tr></thead><tbody>{calc.goals.map((g) => { const share = calc.surplus > 0 ? g.monthly / calc.surplus : 2; const done = g.done; const tone = done ? C.good : calc.surplus <= 0 || calc.goalsTotal > calc.surplus ? (g.monthly > calc.surplus ? C.bad : C.warn) : share > 0.5 ? C.warn : C.good; const label = done ? t.goalDone : tone === C.good ? t.ok : tone === C.warn ? t.tight : t.short; return (<tr key={g.key}><td style={{ padding: "10px", borderBottom: `1px solid ${C.line}`, fontWeight: 700 }}>{g.label}</td><td style={{ padding: "10px", borderBottom: `1px solid ${C.line}`, fontVariantNumeric: "tabular-nums" }}>{fmt(g.target, lang)} {t.sar}</td><td style={{ padding: "10px", borderBottom: `1px solid ${C.line}` }}>{fmt(g.years, lang)}</td><td style={{ padding: "10px", borderBottom: `1px solid ${C.line}`, fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{fmt(g.monthly, lang)} {t.sar}</td><td style={{ padding: "10px", borderBottom: `1px solid ${C.line}` }}><span style={{ background: tone + "1A", color: tone, borderRadius: 999, padding: "3px 10px", fontSize: 12 }}>{label}</span></td></tr>); })}</tbody></table></div><div style={{ marginTop: 14, fontSize: 13.5 }}><strong>{t.totalRequired}: </strong><span style={{ fontVariantNumeric: "tabular-nums", color: calc.goalsTotal <= Math.max(0, calc.surplus) ? C.good : C.bad, fontWeight: 700 }}>{fmt(calc.goalsTotal, lang)} {t.sar}</span><span style={{ color: C.sub }}> — {t.vs} {fmt(Math.max(0, calc.surplus), lang)} {t.sar}</span></div></section>
        <section style={{ ...card, background: C.goldSoft, borderColor: "#E4D6B8" }}><h2 style={{ ...h2s, color: C.pine }}>{t.advice}</h2><ul style={{ margin: 0, paddingInlineStart: 20, display: "grid", gap: 8 }}>{adviceList.map((a, i) => (<li key={i} style={{ fontSize: 13.5, lineHeight: 1.7 }}>{a}</li>))}</ul></section>
        <p style={{ fontSize: 11.5, color: C.sub, textAlign: "center", margin: "6px 0 0" }}>{t.disclaimer}</p>
      </div>)}

      {/* ---------------- MONTHLY REPORT ---------------- */}
      {page === "spending" && (<div style={{ display: "grid", gap: "clamp(12px, 2vw, 24px)", marginTop: 16 }}><section style={card}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}><h2 style={{ ...h2s, margin: 0 }}>{t.reportH}</h2><span style={{ fontSize: 12.5, color: C.sub }}>{t.monthL}: <strong style={{ color: C.ink }}>{month}</strong></span></div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "clamp(8px, 1.5vw, 16px)", margin: "14px 0 18px" }}><Stat label={t.spentTotal} value={`${fmt(report.total, lang)} ${t.sar}`} /><Stat label={t.fixedShare} value={`${fmt(daily.fixedSpent, lang)} ${t.sar}`} /><Stat label={t.variableShare} value={`${fmt(daily.variable, lang)} ${t.sar}`} /><Stat label={t.avgDayL} value={`${fmt(daily.avg, lang)} ${t.sar}`} /><Stat label={t.topCatL} value={daily.topName} note={daily.topVal > 0 ? `${fmt(daily.topVal, lang)} ${t.sar}` : undefined} /><Stat label={t.targetsTotal} value={`${fmt(report.targetsTotal, lang)} ${t.sar}`} note={report.targetsTotal > 0 ? `${t.vsSpent}: ${pct((report.total / report.targetsTotal) * 100, lang)}` : undefined} tone={report.targetsTotal > 0 ? (report.total <= report.targetsTotal ? "good" : "bad") : undefined} /></div>{report.rowsR.length === 0 ? <p style={{ fontSize: 13.5, color: C.sub }}>{t.noTx}</p> : <div style={{ display: "grid", gap: 14 }}>{report.rowsR.map(({ c, spent, target }) => { const share = report.total > 0 ? (spent / report.total) * 100 : 0; const hasT = target > 0; const over = hasT && spent > target; const barColor = over ? C.bad : hasT ? C.oasis : C.gold; const barW = hasT ? Math.min(100, (spent / target) * 100) : share; return (<div key={c.id}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4, gap: 8, flexWrap: "wrap" }}><span style={{ fontSize: 13.5, fontWeight: 700 }}>{catName(c, t)}<span style={{ fontWeight: 400, color: C.sub, fontSize: 12 }}> · {pct(share, lang)} {lang === "ar" ? "من الإجمالي" : "of total"}</span></span><span style={{ fontSize: 13, fontVariantNumeric: "tabular-nums" }}><strong style={{ color: over ? C.bad : C.ink }}>{fmt(spent, lang)}</strong>{hasT && <span style={{ color: C.sub }}> / {fmt(target, lang)} {t.sar}</span>}{!hasT && <span style={{ color: C.sub }}> {t.sar}</span>}</span></div><div style={{ height: 10, borderRadius: 999, background: C.line, overflow: "hidden" }}><div style={{ width: `${Math.max(2, barW)}%`, height: "100%", borderRadius: 999, background: barColor, transition: "width .3s" }} /></div><div style={{ fontSize: 11, marginTop: 3, color: over ? C.bad : hasT ? C.good : C.sub }}>{hasT ? (over ? `${t.over} (+${fmt(spent - target, lang)} ${t.sar})` : t.within) : t.noTarget}</div></div>); })}</div>}</section><section style={card}><h2 style={h2s}>{t.targetsH}</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "clamp(6px, 1.5vw, 16px) clamp(10px, 2vw, 24px)" }}>{cats.map((c) => (<Field key={c.id} label={catName(c, t)} value={(d.targets || {})[c.id] ?? ""} onChange={setTarget(c.id)} suffix={t.sar} />))}</div></section></div>)}

      {/* ---------------- KNOWLEDGE BASE ---------------- */}
      {page === "learn" && <KnowledgeExperience entries={kbList} query={kbQuery} setQuery={setKbQuery} filter={kbFilter} setFilter={setKbFilter} open={kbOpen} setOpen={setKbOpen} t={t} lang={lang} />}
      {page === "learn" && (<div style={{ display: "grid", gap: "clamp(12px, 2vw, 24px)" }}>
        <section style={{ ...card, background: C.goldSoft, borderColor: "#E4D6B8" }}><h1 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, color: C.pine, margin: "0 0 8px" }}>{t.learnH}</h1><p style={{ fontSize: 13.5, color: C.ink, margin: 0, lineHeight: 1.8, maxWidth: 640 }}>{t.learnSub}</p></section>
        <section style={card}>
          <div style={{ display: "flex", gap: "clamp(8px, 1.5vw, 16px)", flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
            <input value={kbQuery} onChange={(e) => setKbQuery(e.target.value)} placeholder={t.searchPH} style={{ flex: "1 1 220px", padding: "10px 14px", borderRadius: 999, border: `1px solid ${C.line}`, fontFamily: FONT, fontSize: 14, background: "#FBFCFB", outline: "none" }} />
            {[["all", t.filterAll], ["def", t.filterDefs], ["practice", t.filterPractices]].map(([k, label]) => (
              <button key={k} onClick={() => setKbFilter(k)}
                style={{
                  fontFamily: FONT, fontSize: 12.5, fontWeight: kbFilter === k ? 700 : 500, cursor: "pointer",
                  padding: "8px 16px", borderRadius: 999,
                  border: `1px solid ${kbFilter === k ? C.oasis : C.line}`,
                  background: kbFilter === k ? C.oasis : "#fff", color: kbFilter === k ? "#fff" : C.ink,
                }}>
                {label}
              </button>
            ))}
          </div>
          {kbList.length === 0 ? (
            <p style={{ fontSize: 13.5, color: C.sub }}>{t.noResults}</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))", gap: "clamp(8px, 1.5vw, 16px)", alignItems: "start" }}>
              {kbList.map((e) => {
                const open = kbOpen === e.id;
                const c = e[lang];
                return (
                  <button key={e.id} onClick={() => setKbOpen(open ? null : e.id)}
                    style={{
                      textAlign: "start", fontFamily: FONT, cursor: "pointer",
                      padding: "16px 16px 14px", borderRadius: 14,
                      border: `1.5px solid ${open ? C.oasis : C.line}`,
                      background: open ? "#F6FAF8" : "#fff",
                      transition: "border-color .15s",
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{e.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>{c.term}</div>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: e.kind === "def" ? C.oasis : C.gold, letterSpacing: 0.3, marginTop: 2 }}>
                          {e.kind === "def" ? t.defTag : t.practiceTag}
                        </div>
                      </div>
                      <span style={{ color: C.sub, fontSize: 13, transform: open ? "rotate(90deg)" : "none", transition: "transform .15s" }}>›</span>
                    </div>
                    {open && (
                      <p style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.85, margin: "12px 2px 0" }}>{c.body}</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          <p style={{ fontSize: 11.5, color: C.sub, textAlign: "center", margin: "18px 0 0" }}>{t.disclaimer}</p>
        </section>
      </div>)}

      {/* ---------------- USER MANUAL ---------------- */}
      {page === "manual" && (<div style={{ marginTop: "clamp(16px, 2vw, 24px)" }}><GuideExperience t={t} lang={lang} go={go} /></div>)}
    </main>
  </div>);
}

/* load IBM Plex Sans Arabic */
function FontLink() {
  useEffect(() => { if (document.getElementById("plex-ar")) return; const l = document.createElement("link"); l.id = "plex-ar"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap"; document.head.appendChild(l); }, []);
  return null;
}
