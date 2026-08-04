import React, { useState } from "react";
import { C, FONT, card, h2s } from "../theme/tokens";
import { Field } from "./ui";
import { fmt, num, todayISO } from "../domain/planner";

const uid = () => `goal_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const builtInKeys = ["emergency", "house", "edu", "hajj", "wedding", "car"];

function GoalCard({ goal, label, onUpdate, onDelete, onUseLiquid, t, lang }) {
  const isCustom = !!onDelete;
  const enabled = goal.on !== false;
  const remaining = Math.max(0, num(goal.target) - num(goal.saved));
  return <article className={enabled ? "qiwam-goal-card is-enabled" : "qiwam-goal-card"}>
    <div className="qiwam-goal-card-heading">
      <label><input type="checkbox" checked={enabled} onChange={(event) => onUpdate("on", event.target.checked)} /><span>{t.enabled}</span></label>
      <strong>{label}</strong>
      {isCustom && <button type="button" onClick={onDelete} aria-label={t.remove} title={t.remove}>×</button>}
    </div>
    <div className="qiwam-goal-card-fields" aria-disabled={!enabled}>
      <Field label={t.target} value={goal.target ?? ""} onChange={(value) => onUpdate("target", value)} suffix={t.sar} />
      <Field label={t.years} value={goal.years ?? ""} onChange={(value) => onUpdate("years", value)} />
      <Field label={t.alreadySaved} value={goal.saved ?? 0} onChange={(value) => onUpdate("saved", value)} suffix={t.sar} />
      {onUseLiquid && <button type="button" className="qiwam-goal-liquid" onClick={onUseLiquid}>{t.useLiquid} ({fmt(num(goal.liquid), lang)})</button>}
      {remaining > 0 && num(goal.saved) > 0 && <p>{t.remainingGap}: <strong>{fmt(remaining, lang)} {t.sar}</strong></p>}
      {num(goal.target) > 0 && remaining === 0 && <p className="is-done">{t.goalDone}</p>}
    </div>
  </article>;
}

export function GoalsExperience({ d, setD, calc, t, lang }) {
  const [contribution, setContribution] = useState({ goalId: "", amount: "", note: "" });
  const updateBuiltIn = (key, field, value) => setD((previous) => ({ ...previous, goals: { ...(previous.goals || {}), [key]: { ...(previous.goals || {})[key], [field]: value } } }));
  const updateCustom = (id, field, value) => setD((previous) => ({ ...previous, customGoals: (previous.customGoals || []).map((goal) => goal.id === id ? { ...goal, [field]: value } : goal) }));
  const deleteCustom = (id) => setD((previous) => ({ ...previous, customGoals: (previous.customGoals || []).filter((goal) => goal.id !== id) }));
  const addCustom = () => setD((previous) => ({ ...previous, customGoals: [...(previous.customGoals || []), { id: uid(), name: t.customGoalDefault, target: 50000, years: 5, saved: 0, on: true }] }));
  const logContribution = () => {
    const amount = num(contribution.amount);
    if (!contribution.goalId || amount <= 0) return;
    setD((previous) => {
      const entry = { id: uid(), goalId: contribution.goalId, amount, date: todayISO(), note: contribution.note.trim() };
      if ((previous.goals || {})[contribution.goalId]) return { ...previous, goalContributions: [...(previous.goalContributions || []), entry], goals: { ...previous.goals, [contribution.goalId]: { ...previous.goals[contribution.goalId], saved: num(previous.goals[contribution.goalId].saved) + amount } } };
      return { ...previous, goalContributions: [...(previous.goalContributions || []), entry], customGoals: (previous.customGoals || []).map((goal) => goal.id === contribution.goalId ? { ...goal, saved: num(goal.saved) + amount } : goal) };
    });
    setContribution({ goalId: "", amount: "", note: "" });
  };
  const options = calc.goals || [];

  return <section className="qiwam-goals-experience" style={card}>
    <div className="qiwam-goals-heading"><div><h1>{t.goalsH}</h1><p>{t.goalsNote}</p></div><label className="qiwam-goals-reserve"><input type="checkbox" checked={d.reserveGoals !== false} onChange={(event) => setD((previous) => ({ ...previous, reserveGoals: event.target.checked }))} />{t.reserveGoals}</label></div>
    <div className="qiwam-goal-grid">
      {builtInKeys.map((key) => {
        const goal = (d.goals || {})[key] || { on: false, target: "", years: "", saved: 0 };
        const label = ({ emergency: t.gEmergency, house: t.gHouse, edu: t.gEdu, hajj: t.gHajj, wedding: t.gWedding, car: t.gCar })[key];
        return <GoalCard key={key} goal={{ ...goal, liquid: key === "emergency" ? d.liquid : 0 }} label={label} onUpdate={(field, value) => updateBuiltIn(key, field, value)} onUseLiquid={key === "emergency" ? () => updateBuiltIn(key, "saved", num(d.liquid)) : undefined} t={t} lang={lang} />;
      })}
      {(d.customGoals || []).map((goal) => <GoalCard key={goal.id} goal={goal} label={goal.name || t.customGoalDefault} onUpdate={(field, value) => updateCustom(goal.id, field, value)} onDelete={() => deleteCustom(goal.id)} t={t} lang={lang} />)}
      <button type="button" className="qiwam-goal-add" onClick={addCustom}>+ {t.addGoal}</button>
    </div>
    <details className="qiwam-goal-contribution"><summary>{t.goalContributionDetails}</summary><div><label>{t.gName}<select value={contribution.goalId} onChange={(event) => setContribution((value) => ({ ...value, goalId: event.target.value }))}><option value="">—</option>{options.map((goal) => <option key={goal.key} value={goal.key}>{goal.label}</option>)}</select></label><Field label={t.amount} value={contribution.amount} onChange={(value) => setContribution((previous) => ({ ...previous, amount: value }))} suffix={t.sar} /><Field label={t.noteL} type="text" value={contribution.note} onChange={(value) => setContribution((previous) => ({ ...previous, note: value }))} /><button type="button" onClick={logContribution}>{t.saveContribution}</button></div></details>
  </section>;
}

export function GoalReservePanel() { return null; }
