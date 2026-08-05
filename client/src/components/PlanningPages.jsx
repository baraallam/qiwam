import React, { useMemo, useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { C, FONT, card, h2s } from "../theme/tokens";
import { Field, Stat } from "./ui";
import { fmt, num, todayISO } from "../domain/planner";

const B={border:"none",borderRadius:9,padding:"9px 13px",background:C.oasis,color:"#fff",fontFamily:FONT,fontWeight:700,cursor:"pointer"};
const G={...B,background:"#fff",color:C.oasis,border:`1px solid ${C.line}`};
const L=(t,k,f)=>t[k]||f; const uid=()=>`p_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`;

export function FamilyPage({d,setD,t}) {
 const members=d.familyMembers||[];
 const add=(relation)=>setD(p=>({...p,familyMembers:[...(p.familyMembers||[]),{id:uid(),relation,name:"",birthYear:"",schoolType:"private",enrolled:true,annualEducationCost:"",monthlySupport:""}]}));
 const upd=(id,k,v)=>setD(p=>{const m=(p.familyMembers||[]).map(x=>x.id===id?{...x,[k]:v}:x), self=m.find(x=>x.relation==="self");return {...p,familyMembers:m,age:self?.birthYear?Math.max(0,new Date().getFullYear()-num(self.birthYear)):p.age,children:m.filter(x=>x.relation==="child").length};});
 const del=(id)=>setD(p=>{const m=(p.familyMembers||[]).filter(x=>x.id!==id);return {...p,familyMembers:m,children:m.filter(x=>x.relation==="child").length};});
 return <section className="qiwam-reference-card qiwam-family-page" style={card}><div className="qiwam-page-eyebrow">{L(t,"navFamily","العائلة")}</div><h1 style={{...h2s,fontSize:28}}>{L(t,"famH","Family details")}</h1><p style={{color:C.sub,fontSize:13.5}}>{L(t,"famLead","Add household details. Your birth year updates the existing retirement-age input; children update the existing child count.")}</p><div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>{[["self","Add yourself"],["spouse","Add spouse"],["child","Add child"],["dependent","Add dependent"]].map(([r,label])=><button key={r} style={r==="self"?B:G} onClick={()=>add(r)}>{L(t,`add${r[0].toUpperCase()+r.slice(1)}`,label)}</button>)}</div>{members.length===0?<p style={{color:C.sub}}>{L(t,"famEmpty","No household members yet.")}</p>:<div style={{display:"grid",gap:10}}>{members.map(m=><div key={m.id} style={{border:`1px solid ${C.line}`,borderRadius:12,padding:14,background:"#FBFCFB"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><strong>{m.relation}</strong><button style={{...G,color:C.bad}} onClick={()=>del(m.id)}>{t.remove}</button></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10}}><Field label={L(t,"nameL","Name")} type="text" value={m.name} onChange={v=>upd(m.id,"name",v)}/><Field label={L(t,"birthYear","Birth year")} value={m.birthYear} onChange={v=>upd(m.id,"birthYear",v)}/>{m.relation==="child"&&<><label style={{fontSize:12.5,color:C.sub}}>{L(t,"schoolType","Education type")}<select value={m.schoolType} onChange={e=>upd(m.id,"schoolType",e.target.value)} style={{display:"block",width:"100%",marginTop:5,padding:10,borderRadius:10,border:`1px solid ${C.line}`,fontFamily:FONT}}><option value="public">{L(t,"schPublic","Public")}</option><option value="private">{L(t,"schPrivate","Private")}</option><option value="international">{L(t,"schIntl","International")}</option></select></label><Field label={L(t,"schCostOverride","Annual education cost (optional)")} value={m.annualEducationCost} onChange={v=>upd(m.id,"annualEducationCost",v)}/></>}{m.relation==="dependent"&&<Field label={L(t,"supportMonthly","Monthly support")} value={m.monthlySupport} onChange={v=>upd(m.id,"monthlySupport",v)}/>}</div></div>)}</div>}</section>;
}

export function FixedChecklist({setD,t}) {const items=[["Rent / mortgage","housing_c"],["Electricity","bills"],["Water","bills"],["Mobile & internet","bills"],["School fees","edu2"],["Insurance","bills"],["Loan installment","other2"]];const add=([name,cat])=>setD(p=>({...p,fixed:[...(p.fixed||[]),{id:uid(),name,cat,amount:"",dueDay:1}]}));return <section style={{...card,padding:16}}><h2 style={h2s}>{L(t,"checklistH","Common fixed expenses")}</h2><p style={{color:C.sub,fontSize:12.5}}>{L(t,"checklistLead","Add a template, then enter its amount and due date below.")}</p><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{items.map(i=><button key={i[0]} style={G} onClick={()=>add(i)}>+ {i[0]}</button>)}</div></section>}

export function GoalContributionPanel({d,setD,calc,t}) {const [goalId,setGoalId]=useState(""),[amount,setAmount]=useState(""),[note,setNote]=useState("");const log=()=>{const v=num(amount);if(!goalId||v<=0)return;setD(p=>{const base={...p,goalContributions:[...(p.goalContributions||[]),{id:uid(),goalId,amount:v,date:todayISO(),note:note.trim()}]};return base.goals?.[goalId]?{...base,goals:{...base.goals,[goalId]:{...base.goals[goalId],saved:num(base.goals[goalId].saved)+v}}}:{...base,customGoals:(base.customGoals||[]).map(g=>g.id===goalId?{...g,saved:num(g.saved)+v}:g)}});setAmount("");setNote("")};return <section style={{...card,padding:16}}><h2 style={h2s}>{L(t,"logSaving","Log a goal saving")}</h2><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr auto",gap:8,alignItems:"end"}}><label style={{fontSize:12.5,color:C.sub}}>{t.gName}<select value={goalId} onChange={e=>setGoalId(e.target.value)} style={{display:"block",width:"100%",marginTop:5,padding:10,borderRadius:10,border:`1px solid ${C.line}`,fontFamily:FONT}}><option value="">—</option>{(calc.goals||[]).map(g=><option key={g.key} value={g.key}>{g.label}</option>)}</select></label><Field label={t.amount} value={amount} onChange={setAmount} suffix={t.sar}/><Field label={t.noteL} type="text" value={note} onChange={setNote}/><button style={B} onClick={log}>{L(t,"logSaving","Log saving")}</button></div></section>}

const download=(rows)=>{const csv="\uFEFF"+rows.map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\n"),a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download=`qiwam-report-${todayISO()}.csv`;a.click();URL.revokeObjectURL(a.href)};

export function ReportsPage({ d, setD, calc, monthTx, report, t, lang }) {
  const trend = useMemo(() => {
    const x = {};

    (d.tx || []).forEach((a) => {
      const k = (a.date || "").slice(0, 7);

      if (k) {
        x[k] = (x[k] || 0) + num(a.amount);
      }
    });

    return Object.entries(x)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, spent]) => ({
        month,
        spent: Math.round(spent),
      }));
  }, [d.tx]);

  const out = () =>
    download([
      ["Section", "Metric", "Value"],
      ["Monthly", "Income", calc.income],
      ["Monthly", "Tracked spending", report.total],
      ["Goals", "Required monthly", calc.goalsTotal],
      ["Retirement", "Projected", calc.atRetire],
      ...(d.goalContributions || []).map((x) => [
        "Goal contribution",
        x.goalId,
        `${x.date}: ${x.amount}`,
      ]),
    ]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <section
        style={{
          ...card,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ ...h2s, fontSize: 24, marginBottom: 4 }}>
            {L(t, "reportsH", "Family reports")}
          </h1>

          <p style={{ margin: 0, color: C.sub, fontSize: 13 }}>
            {L(
              t,
              "reportsLead",
              "A consolidated view built from your saved plan and activity."
            )}
          </p>
        </div>

        <button style={B} onClick={out}>
          {L(t, "exportCsv", "Export CSV")}
        </button>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
          gap: 12,
        }}
      >
        <Stat
          label={t.heroIncome}
          value={`${fmt(calc.income, lang)} ${t.sar}`}
        />

        <Stat
          label={t.spentTotal}
          value={`${fmt(report.total, lang)} ${t.sar}`}
        />

        <Stat
          label={t.kSurplus}
          value={`${fmt(calc.surplus, lang)} ${t.sar}`}
          tone={calc.surplus >= 0 ? "good" : "bad"}
        />

        <Stat
          label={t.readiness}
          value={`${fmt(calc.readiness, lang)}%`}
        />
      </div>

      <section style={card}>
        <h2 style={h2s}>
          {L(t, "trendsH", "Spending trend")}
        </h2>

        {trend.length ? (
          <div style={{ height: 250 }} dir="ltr">
            <ResponsiveContainer>
              <LineChart data={trend}>
                <CartesianGrid stroke={C.line} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="spent"
                  stroke={C.oasis}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p style={{ color: C.sub }}>{t.noTx}</p>
        )}
      </section>

      <section style={card}>
        <h2 style={h2s}>{t.goalsH}</h2>

        {(calc.goals || []).map((g) => (
          <div
            key={g.key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              borderBottom: `1px solid ${C.line}`,
              paddingBottom: 8,
              marginBottom: 8,
            }}
          >
            <span>{g.label}</span>

            <strong>
              {fmt(g.saved, lang)} / {fmt(g.target, lang)} {t.sar}
            </strong>
          </div>
        ))}
      </section>

      <section style={card}>
        <h2 style={h2s}>
          {L(t, "repFamily", "Family & education")}
        </h2>

        <p style={{ color: C.sub, margin: 0 }}>
          {(d.familyMembers || []).length}{" "}
          {L(t, "famCount", "family members")} ·{" "}
          {fmt(d.education, lang)} {t.sar} {t.perMonth} {t.education}
        </p>
      </section>
    </div>
  );
}