import React, { useState } from "react";
import { C, FONT, card, h2s } from "../theme/tokens";
import { Field } from "./ui";

const uid = () => `family_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function ageOf(birthYear) {
  const year = Number(birthYear);
  return Number.isFinite(year) && year > 1900 ? Math.max(0, new Date().getFullYear() - year) : null;
}

function memberSchooling(member) {
  return {
    type: member.schoolType || "private",
    enrolled: member.enrolled !== false,
    annualCostOverride: member.annualEducationCost || "",
    ...(member.schooling || {}),
  };
}

function MemberCard({ member, relation, canDelete, onDelete, onUpdate, t }) {
  const schooling = memberSchooling(member);
  const age = ageOf(member.birthYear);
  const setSchooling = (patch) => onUpdate({
    ...patch,
    schooling: { ...schooling, ...patch.schooling },
  });

  return <article className="qiwam-family-member-card">
    <div className="qiwam-family-member-heading">
      <div><strong>{relation}</strong>{age !== null && <span>{t.familyAgeValue.replace("{age}", age)}</span>}</div>
      {canDelete && <button type="button" className="qiwam-family-remove" onClick={onDelete}>{t.deleteMember}</button>}
    </div>
    <Field label={t.familyName} value={member.name || ""} type="text" onChange={(value) => onUpdate({ name: value })} />
    <Field label={t.birthYear} value={member.birthYear || ""} onChange={(value) => onUpdate({ birthYear: value })} />
    {member.relation === "child" && <>
      <label className="qiwam-family-select"><span>{t.schoolType}</span><select value={schooling.type} onChange={(event) => setSchooling({ schoolType: event.target.value, schooling: { type: event.target.value } })}><option value="public">{t.schPublic}</option><option value="private">{t.schPrivate}</option><option value="international">{t.schIntl}</option></select></label>
      <label className="qiwam-family-check"><input type="checkbox" checked={schooling.enrolled} onChange={(event) => setSchooling({ enrolled: event.target.checked, schooling: { enrolled: event.target.checked } })} />{t.schEnrolled}</label>
      <Field label={t.schCostOverride} value={schooling.annualCostOverride} onChange={(value) => setSchooling({ annualEducationCost: value, schooling: { annualCostOverride: value } })} suffix={t.sar} />
    </>}
    {member.relation === "dependent" && <Field label={t.supportMonthly} value={member.monthlySupport || ""} onChange={(value) => onUpdate({ monthlySupport: value })} suffix={t.sar} />}
  </article>;
}

function AddCard({ label, onClick }) {
  return <button type="button" className="qiwam-family-add" onClick={onClick}><span>+</span>{label}</button>;
}

export default function FamilyExperience({ d, setD, t }) {
  const members = d.familyMembers || [];
  const [error, setError] = useState("");
  const byRelation = (relation) => members.filter((member) => member.relation === relation);
  const selves = byRelation("self");
  const spouses = byRelation("spouse");
  const children = byRelation("child");
  const dependants = byRelation("dependent");

  const add = (relation) => {
    if ((relation === "self" || relation === "spouse") && byRelation(relation).length) {
      setError(relation === "self" ? t.familyUniqueSelf : t.familyUniqueSpouse);
      return;
    }
    setError("");
    setD((previous) => ({
      ...previous,
      familyMembers: [...(previous.familyMembers || []), {
        id: uid(), relation, name: "", birthYear: "", schoolType: "private", enrolled: true,
        annualEducationCost: "", monthlySupport: "", schooling: { type: "private", enrolled: true, annualCostOverride: "" },
      }],
    }));
  };

  const update = (id, patch) => setD((previous) => ({
    ...previous,
    familyMembers: (previous.familyMembers || []).map((member) => member.id === id ? { ...member, ...patch } : member),
  }));
  const remove = (id) => setD((previous) => ({ ...previous, familyMembers: (previous.familyMembers || []).filter((member) => member.id !== id) }));
  const relationLabel = (relation) => relation === "self" ? t.relSelf : relation === "spouse" ? t.relSpouse : relation === "dependent" ? t.relDependent : t.relChild;

  const memberCards = (items, relation) => items.map((member) => <MemberCard key={member.id} member={member} relation={relationLabel(relation)} canDelete={relation !== "self" || selves.length > 1} onDelete={() => remove(member.id)} onUpdate={(patch) => update(member.id, patch)} t={t} />);

  return <div className="qiwam-family-experience">
    <section className="qiwam-family-summary" style={card}>
      <div className="qiwam-page-eyebrow">{t.navFamily}</div>
      <h1 style={{ ...h2s, fontSize: 21 }}>{t.famH}</h1>
      <p>{t.famLead}</p>
      <div className="qiwam-family-summary-meta"><span>{t.familyMembersCount.replace("{count}", members.length)}</span><span>{t.familyChildrenCount.replace("{count}", children.length)}</span></div>
    </section>

    {error && <p className="qiwam-family-error" role="alert">{error}</p>}

    <div className="qiwam-family-pair">
      <section className="qiwam-family-role-card" style={card}>
        <h2>{t.familySelfSection}</h2>
        <div className="qiwam-family-role-content">{selves.length ? memberCards(selves, "self") : <AddCard label={t.addSelf} onClick={() => add("self")} />}</div>
      </section>
      <section className="qiwam-family-role-card" style={card}>
        <h2>{t.familySpouseSection}</h2>
        <div className="qiwam-family-role-content">{spouses.length ? memberCards(spouses, "spouse") : <AddCard label={t.addSpouse} onClick={() => add("spouse")} />}</div>
      </section>
    </div>

    <section className="qiwam-family-group" style={card}>
      <div className="qiwam-family-section-heading"><div><h2>{t.familyChildrenSection}</h2><p>{t.familyChildrenLead}</p></div></div>
      <div className="qiwam-family-grid">{memberCards(children, "child")}<AddCard label={t.addChild} onClick={() => add("child")} /></div>
    </section>

    <section className="qiwam-family-group" style={card}>
      <div className="qiwam-family-section-heading"><div><h2>{t.familyDependantsSection}</h2><p>{t.familyDependantsLead}</p></div></div>
      <div className="qiwam-family-grid">{memberCards(dependants, "dependent")}<AddCard label={t.addDependent} onClick={() => add("dependent")} /></div>
    </section>
  </div>;
}
