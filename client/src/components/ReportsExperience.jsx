import React, { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { C, FONT, card, h2s } from "../theme/tokens";
import { catName, fmt, num, todayISO } from "../domain/planner";

const button = { border: "none", borderRadius: 999, padding: "8px 14px", fontFamily: FONT, fontSize: 12.5, fontWeight: 700, cursor: "pointer" };

function exportCsv(filename, rows) {
  const quote = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = "\uFEFF" + rows.map((row) => row.map(quote).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function ReportTable({ head, rows, lang }) {
  return <div className="qiwam-table-wrap"><table className="qiwam-report-table"><thead><tr>{head.map((label) => <th key={label}>{label}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((value, valueIndex) => <td key={valueIndex}>{typeof value === "number" ? fmt(value, lang) : value}</td>)}</tr>)}</tbody></table></div>;
}

function Metrics({ items }) {
  return <div className="qiwam-report-metrics">{items.map(({ label, value, tone }) => <div key={label} className={`qiwam-report-metric ${tone ? `is-${tone}` : ""}`}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}

export default function ReportsExperience({ d, calc, monthTx, report, month, t, lang }) {
  const [view, setView] = useState(null);
  const [range, setRange] = useState(6);
  const cats = d.categories || [];
  const tx = d.tx || [];
  const selectedMonth = month || todayISO().slice(0, 7);
  
  const months = useMemo(() => Array.from({ length: range }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - range + index + 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }), [range]);
  const trend = useMemo(() => months.map((trendMonth) => ({
    month: trendMonth,
    spent: tx.filter((item) => (item.date || "").slice(0, 7) === trendMonth && item.cat !== "goal_savings").reduce((sum, item) => sum + num(item.amount), 0),
  })), [months, tx]);
  const trendRows = trend.filter((item) => item.spent > 0);
  const monthlyRows = useMemo(() => cats.map((category) => [
    catName(category, t),
    (monthTx || []).filter((item) => item.cat === category.id).reduce((sum, item) => sum + num(item.amount), 0),
    num((d.targets || {})[category.id]),
  ]), [cats, d.targets, monthTx, t]);
 const titles = {
  monthly: t.repMonthly,
  goals: t.repGoals,
  trends: t.repTrends,
  family: t.repFamily,
  wealth: t.repWealth,
};
  const reportChoices = [
    ["monthly", "📅", t.repMonthly, t.repMonthlyD],
    ["goals", "🎯", t.repGoals, t.repGoalsD],
    ["trends", "📈", t.repTrends, t.repTrendsD],
    ["family", "🎓", t.repFamily, t.repFamilyD],
    ["wealth", "🏦", t.repWealth, t.repWealthD],
   
  ];
  const Header = ({ csvRows, filename }) => <>
    <div className="qiwam-report-actions no-print">
      <button style={{ ...button, color: C.ink, background: "#fff", border: `1px solid ${C.line}` }} onClick={() => setView(null)}>{t.backToReports}</button>
      <div className="qiwam-report-action-spacer" />
      <button style={{ ...button, background: C.pine, color: "#fff" }} onClick={() => window.print()}>{t.printBtn}</button>
      <button style={{ ...button, background: "#fff", color: C.oasis, border: `1px solid ${C.oasis}` }} onClick={() => exportCsv(filename, csvRows)}>{t.csvBtn}</button>
    </div>
    <h1 className="qiwam-report-detail-title">{titles[view]}</h1>
    <p className="qiwam-print-meta">{t.brand} · {t.reportDate}: {todayISO()}</p>
  </>;
  const Empty = () => <p className="qiwam-report-empty">{t.noData}</p>;

  if (!view) return <div className="qiwam-reports-landing">
    <section className="qiwam-reports-heading" style={card}><h1>{t.reportsH}</h1><p>{t.reportsLead}</p></section>
    <div className="qiwam-report-grid">{reportChoices.map(([key, icon, name, description]) => <button key={key} className="qiwam-report-picker" onClick={() => setView(key)}><span className="qiwam-report-icon">{icon}</span><span><b>{name}</b><small>{description}</small></span></button>)}</div>
  </div>;

  if (view === "monthly") {
    const head = [t.catsH, t.spent, t.targetL];
    return <section className="qiwam-report-detail" style={card}><Header filename={`qiwam-${selectedMonth}.csv`} csvRows={[head, ...monthlyRows]} />
      <Metrics items={[{ label: t.total, value: `${fmt(report?.total || 0, lang)} ${t.sar}` }, { label: t.targetsTotal, value: `${fmt(report?.targetsTotal || 0, lang)} ${t.sar}` }, { label: t.txCount, value: fmt((monthTx || []).length, lang) }]} />
      <ReportTable head={head} rows={monthlyRows} lang={lang} />
    </section>;
  }

  if (view === "goals") {
    const head = [t.gName, t.target, t.alreadySaved, t.remainingGap, t.gMonthly, t.goalProgress];
    const rows = (calc.goals || []).map((goal) => [goal.label, goal.target, goal.saved, Math.max(0, goal.target - goal.saved), Math.round(goal.monthly), goal.target > 0 ? `${fmt((goal.saved / goal.target) * 100, lang)}%` : "—"]);
    return <section className="qiwam-report-detail" style={card}><Header filename="qiwam-goals.csv" csvRows={[head, ...rows]} />
      {rows.length ? <><Metrics items={[{ label: t.totalRequired, value: `${fmt(calc.goalsTotal || 0, lang)} ${t.sar}` }, { label: t.gName, value: fmt(rows.length, lang) }]} /><ReportTable head={head} rows={rows} lang={lang} /></> : <Empty />}
    </section>;
  }

  if (view === "trends") {
    const head = [t.monthL, t.total];
    const hasHistory = trendRows.length >= 2;
    return <section className="qiwam-report-detail" style={card}><Header filename="qiwam-trends.csv" csvRows={[head, ...(hasHistory ? trendRows.map((item) => [item.month, item.spent]) : [])]} />
      <div className="qiwam-report-range no-print">{[[3, t.r3m], [6, t.r6m], [12, t.r12m]].map(([value, label]) => <button key={value} onClick={() => setRange(value)} style={{ ...button, background: range === value ? C.oasis : "#fff", color: range === value ? "#fff" : C.ink, border: `1px solid ${range === value ? C.oasis : C.line}` }}>{label}</button>)}</div>
      {hasHistory ? <><div className="qiwam-report-chart" dir="ltr"><ResponsiveContainer><BarChart data={trendRows}><CartesianGrid stroke={C.line} strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value) => `${fmt(value, lang)} ${t.sar}`} /><Bar dataKey="spent" fill={C.oasis} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div><ReportTable head={head} rows={trendRows.map((item) => [item.month, item.spent])} lang={lang} /></> : <Empty />}
    </section>;
  }

  if (view === "family") {
    const members = d.familyMembers || d.members || [];
    const relation = (member) => member.relation === "self" ? t.relSelf : member.relation === "spouse" ? t.relSpouse : member.relation === "dependent" || member.relation === "dependant" ? t.relDependent : t.relChild;
    const amount = (value) => num(value) > 0 ? num(value) : "—";
    const head = [t.familyName, t.familyH, t.birthYear, t.schCostOverride, t.supportMonthly];
    const rows = members.map((member) => [member.name || "—", relation(member), member.birthYear || "—", amount(member.schooling?.annualCostOverride ?? member.annualEducationCost), amount(member.monthlySupport ?? member.supportMonthly)]);
    return <section className="qiwam-report-detail" style={card}><Header filename="qiwam-family.csv" csvRows={[head, ...rows]} />
      {rows.length ? <ReportTable head={head} rows={rows} lang={lang} /> : <Empty />}
    </section>;
  }

  if (view === "wealth") {
    const head = [t.perYear, t.projected, t.real];
    const rows = (calc.rows || []).map((row) => [new Date().getFullYear() + row.year, row.nominal, row.real]);
    const chartRows = rows.map(([year, nominal, real]) => ({ year, nominal, real }));
    return <section className="qiwam-report-detail" style={card}><Header filename="qiwam-wealth.csv" csvRows={[head, ...rows]} />
      {rows.length ? <><Metrics items={[{ label: t.atRetire, value: `${fmt(calc.atRetire || 0, lang)} ${t.sar}` }, { label: t.needed, value: `${fmt(calc.neededAtRetire || 0, lang)} ${t.sar}` }, { label: t.readiness, value: `${fmt(calc.readiness || 0, lang)}%` }]} /><div className="qiwam-report-chart" dir="ltr"><ResponsiveContainer><AreaChart data={chartRows}><CartesianGrid stroke={C.line} strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis /><Tooltip formatter={(value) => `${fmt(value, lang)} ${t.sar}`} /><Area dataKey="nominal" stroke={C.oasis} fill={C.oasis} fillOpacity={.2} /><Area dataKey="real" stroke={C.gold} fill="none" /></AreaChart></ResponsiveContainer></div><ReportTable head={head} rows={rows} lang={lang} /></> : <Empty />}
    </section>;
  }

 return null;
}
