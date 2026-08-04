export const num = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
export const fmt = (v, lang) => new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", { maximumFractionDigits: 0 }).format(Math.round(v));
export const pct = (v, lang) => new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", { maximumFractionDigits: 1 }).format(v) + "%";

export const DEFAULTS = {
  incYou: 15000, incSpouse: 0, incOther: 0,
  housing: 3500, transport: 1500, food: 3000, education: 800, utilities: 900, otherExp: 1200,
  debtPay: 1500, debtTotal: 60000, liquid: 20000, invested: 15000,
  age: 32, retireAge: 60, children: 2, ret: 6, inf: 2.5,
  goals: {
    emergency: { on: true, target: 50000, years: 2, saved: 0 },
    house: { on: true, target: 200000, years: 6, saved: 0 },
    edu: { on: true, target: 300000, years: 12, saved: 0 },
    hajj: { on: false, target: 40000, years: 4, saved: 0 },
    wedding: { on: false, target: 120000, years: 10, saved: 0 },
    car: { on: false, target: 90000, years: 4, saved: 0 },
  },
  useActuals: false,
  debtInRetirement: "partly",
  salaryGrowth: 2.5,
  excludeRecon: [],
  removedDefaults: [],
  customIncome: [],
  customExpense: [],
  customGoals: [],
  categories: [
    { id: "housing_c", key: "catHousing" },
    { id: "food", key: "catFood" }, { id: "groceries", key: "catGroceries" },
    { id: "transport", key: "catTransport" }, { id: "bills", key: "catBills" },
    { id: "shopping", key: "catShopping" }, { id: "health", key: "catHealth" },
    { id: "fun", key: "catFun" }, { id: "edu2", key: "catEduC" }, { id: "other2", key: "catOtherC" },
  ],
  targets: {},
  tx: [],
  fixed: [],
  salaryDay: 27,
  // Optional planning data used by the new client-only pages. Existing fields
  // above remain the source of truth for the established calculation engine.
  familyMembers: [],
  goalContributions: [],
  goldPricePerGram: "",
};

const CAT_ICONS = { housing_c: "🏠", food: "🍽️", groceries: "🛒", transport: "⛽", bills: "📱", shopping: "🛍️", health: "🩺", fun: "🎮", edu2: "🎓", other2: "📦" };
export const catIcon = (c) => (c.custom ? "🏷️" : CAT_ICONS[c.id] || "📦");
export const catName = (c, t) => (c.custom ? c.name || "—" : t[c.key] || c.id);
export const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

export function daysInMonthOf(m) { return new Date(Number(m.slice(0, 4)), Number(m.slice(5, 7)), 0).getDate(); }
export function reqMonthly(target, years, annualRet) {
  const n = Math.max(1, Math.round(years * 12));
  const r = annualRet / 100 / 12;
  if (r === 0) return target / n;
  return (target * r) / (Math.pow(1 + r, n) - 1);
}
export function normalizePlan(saved) {
  const src = saved || {};
  const goals = { ...DEFAULTS.goals };
  Object.keys(goals).forEach((k) => { goals[k] = { ...goals[k], ...((src.goals || {})[k] || {}) }; });
  let categories = (src.categories && src.categories.length) ? src.categories.slice() : DEFAULTS.categories.slice();
  const removed = src.removedDefaults || [];
  if (!categories.some((c) => c.id === "housing_c") && !removed.includes("housing_c")) {
    categories = [{ id: "housing_c", key: "catHousing" }, ...categories];
  }
  return { ...DEFAULTS, ...src, goals, categories };
}
export function estExpensesOf(d) {
  const customExp = (d.customExpense || []).reduce((a, i) => a + num(i.amount), 0);
  return num(d.housing) + num(d.transport) + num(d.food) + num(d.education) + num(d.utilities) + num(d.otherExp) + customExp;
}

// Kept deliberately separate from computeAll: Zakat does not affect the
// retirement, goals, expense, reconciliation, or score calculations.
export function computeZakat(liquid, invested, goldPricePerGram) {
  const zakatableWealth = Math.max(0, num(liquid)) + Math.max(0, num(invested));
  const pricePerGram = Math.max(0, num(goldPricePerGram));
  const nisabThreshold = pricePerGram * 85;
  const liable = pricePerGram > 0 && zakatableWealth >= nisabThreshold;
  const zakatDue = liable ? zakatableWealth * 0.025 : 0;

  return { zakatableWealth, goldPricePerGram: pricePerGram, nisabThreshold, liable, zakatDue };
}

export function computeAll(d, expensesUsed, labels, t) {
  const customInc = (d.customIncome || []).reduce((a, i) => a + num(i.amount), 0);
  const income = num(d.incYou) + num(d.incSpouse) + num(d.incOther) + customInc;
  const expenses = expensesUsed;
  const debtPay = num(d.debtPay);
  const surplus = income - expenses - debtPay;
  const savingsRate = income > 0 ? (surplus / income) * 100 : 0;
  const debtRatio = income > 0 ? (debtPay / income) * 100 : 0;
  const emergencyMonths = expenses + debtPay > 0 ? num(d.liquid) / (expenses + debtPay) : 0;

  const sSR = Math.max(0, Math.min(1, savingsRate / 20));
  const sDR = debtPay <= 0 ? 1 : income <= 0 ? 0 : Math.max(0, Math.min(1, (45 - debtRatio) / 45));
  const sEM = Math.max(0, Math.min(1, emergencyMonths / 6));
  const yearsTo = Math.max(1, num(d.retireAge) - num(d.age));
  const r = num(d.ret) / 100, infl = num(d.inf) / 100;

  const goalDefs = ["emergency", "house", "edu", "hajj", "wedding", "car"];
  const fixedGoals = goalDefs.filter((k) => d.goals[k] && d.goals[k].on).map((k) => {
    const g = d.goals[k];
    const target = num(g.target), saved = Math.max(0, num(g.saved)), gap = Math.max(0, target - saved);
    return { key: k, label: t["g"+k.charAt(0).toUpperCase()+k.slice(1)], target, saved, years: num(g.years), monthly: gap > 0 ? reqMonthly(gap, num(g.years), num(d.ret)) : 0, done: gap <= 0 };
  });
  const customGoals = (d.customGoals || []).filter((g) => g.on !== false).map((g) => {
    const yrs = Math.max(0.5, num(g.years) || 1);
    const target = num(g.target), saved = Math.max(0, num(g.saved)), gap = Math.max(0, target - saved);
    return { key: g.id, label: g.name || "—", target, saved, years: yrs, monthly: gap > 0 ? reqMonthly(gap, yrs, num(d.ret)) : 0, done: gap <= 0 };
  });
  const allGoals = [...fixedGoals, ...customGoals];
  const goalsTotal = allGoals.reduce((a, g) => a + g.monthly, 0);
  const toGoals = Math.min(Math.max(0, surplus), goalsTotal);
  const toRetirement = Math.max(0, Math.max(0, surplus) - toGoals);

  const schedule = allGoals.map((g) => ({ months: Math.max(1, Math.round(g.years * 12)), monthly: g.monthly }));
  const start = num(d.liquid) + num(d.invested);
  const rows = [];
  let bal = start;
  const rm = r / 12;
  const capacity = Math.max(0, surplus);
  const growth = num(d.salaryGrowth) / 100;
  for (let y = 0; y <= yearsTo; y++) {
    rows.push({ year: y, nominal: Math.round(bal), real: Math.round(bal / Math.pow(1 + infl, y)) });
    const yearCapacity = capacity * Math.pow(1 + growth, y);
    for (let m = 0; m < 12; m++) {
      const idx = y * 12 + m;
      const committed = schedule.reduce((a, g) => a + (idx < g.months ? g.monthly : 0), 0);
      bal = bal * (1 + rm) + Math.max(0, yearCapacity - committed);
    }
  }
  const lastGoalMonths = schedule.reduce((a, g) => Math.max(a, g.months), 0);
  const fullFromYear = Math.ceil(lastGoalMonths / 12);
  const debtFactor = d.debtInRetirement === "no" ? 0 : d.debtInRetirement === "yes" ? 1 : 0.4;
  const annualExpNow = (expenses + debtPay * debtFactor) * 12;
  const neededAtRetire = annualExpNow * Math.pow(1 + infl, yearsTo) * 25;
  const atRetire = rows[rows.length - 1]?.nominal || 0; // [الحماية النهائية للمتغير]
  const readiness = neededAtRetire > 0 ? Math.min(150, (atRetire / neededAtRetire) * 100) : 0;
  const sRT = Math.max(0, Math.min(1, readiness / 100));
  const score = Math.round(sSR * 30 + sDR * 25 + sEM * 25 + sRT * 20);

  return {
    income, expenses, debtPay, surplus, savingsRate, debtRatio, emergencyMonths,
    score, rows, atRetire, neededAtRetire, readiness, debtFactor,
    goals: allGoals, goalsTotal, toGoals, toRetirement, yearsTo,
    retireFull: capacity * Math.pow(1 + growth, fullFromYear), fullFromYear
  };
}

