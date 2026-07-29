import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  ComposedChart, Bar, Line,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const C = {
  pine: "#123C33", oasis: "#1E6B58", gold: "#C09A52", bg: "#F2F4F3",
  card: "#FFFFFF", line: "#E2E6E4", ink: "#14201D", sub: "#5C6B66",
  good: "#2C7A57", warn: "#B77F1F", bad: "#B4452F", goldSoft: "#F4ECDD",
};
const FONT = "'IBM Plex Sans Arabic', system-ui, sans-serif";

/* ------------------------------------------------------------------ */
/*  Bilingual dictionary                                               */
/* ------------------------------------------------------------------ */
const T = {
  ar: {
    dir: "rtl", lang: "العربية", other: "English",
    brand: "قِوام", tagline: "المال باعتدال… والمستقبل باستقلال",
    loginTitle: "تسجيل الدخول", registerTitle: "إنشاء حساب جديد",
    name: "الاسم", email: "البريد الإلكتروني", password: "كلمة المرور",
    login: "دخول", register: "إنشاء الحساب", logout: "تسجيل الخروج",
    toRegister: "ليس لديك حساب؟ سجّل الآن", toLogin: "لديك حساب؟ سجّل الدخول",
    gateNote: "الحاسبة متاحة للمستخدمين المسجّلين فقط. بياناتك تُحفظ في حسابك.",
    errExists: "هذا البريد مسجّل مسبقاً. سجّل الدخول بدلاً من ذلك.",
    errBad: "البريد أو كلمة المرور غير صحيحة.",
    errFill: "أكمل جميع الحقول (كلمة المرور ٦ أحرف فأكثر).",
    welcome: "أهلاً", saved: "تم حفظ خطتك ✓", save: "احفظ الخطة",
    tabProfile: "بيانات العائلة", tabGoals: "الأهداف", tabResults: "النتائج",
    incomeH: "الدخل الشهري", you: "دخلك", spouse: "دخل الزوج/الزوجة", otherInc: "دخل آخر",
    expH: "المصروفات الشهرية", housing: "السكن", transport: "المواصلات", food: "الطعام",
    education: "التعليم", utilities: "الفواتير والاتصالات", otherExp: "مصروفات أخرى",
    debtH: "الالتزامات", debtPay: "أقساط شهرية (تمويل/بطاقات)", debtTotal: "إجمالي المديونية",
    wealthH: "المدخرات والأصول", liquid: "مدخرات سائلة", invested: "استثمارات حالية",
    familyH: "العائلة", age: "عمرك", retireAge: "عمر التقاعد", children: "عدد الأبناء",
    assumpH: "افتراضات النمو", ret: "عائد استثماري متوقع ٪ سنوياً", inf: "تضخم متوقع ٪ سنوياً",
    goalsH: "أهداف العائلة طويلة المدى",
    goalsNote: "حدّد المبلغ المستهدف وعدد السنوات، وسنحسب الادخار الشهري المطلوب لكل هدف.",
    gHouse: "دفعة أولى لمنزل", gEdu: "تعليم الأبناء", gHajj: "حج وعمرة",
    gWedding: "زواج", gEmergency: "صندوق الطوارئ", gCar: "سيارة",
    target: "المبلغ المستهدف", years: "خلال (سنوات)", enabled: "مفعّل",
    itemName: "اسم البند", amount: "المبلغ", remove: "حذف البند",
    addIncome: "أضف بند دخل", addExpense: "أضف بند مصروف", addGoal: "أضف هدفاً مخصصاً",
    customGoalName: "اسم الهدف", customGoalDefault: "هدف جديد",
    tabSpend: "المصروف اليومي", tabReport: "التقرير الشهري",
    pageCalc: "حاسبة التخطيط", pageSpend: "تسجيل المصروفات",
    spendH: "سجّل مصروفاً", dateL: "التاريخ", categoryL: "الفئة", noteL: "ملاحظة (اختياري)",
    addTx: "إضافة المصروف", monthTx: "مصروفات هذا الشهر", noTx: "لا توجد مصروفات مسجّلة بعد.",
    newCat: "اسم فئة جديدة…", addCat: "أضف فئة", spentTotal: "إجمالي المصروف",
    reportH: "توزيع مصروفات الشهر", monthL: "الشهر", targetL: "الهدف الشهري",
    actualL: "الفعلي", shareL: "٪ من الإجمالي", statusCol: "الحالة",
    within: "ضمن الهدف", over: "تجاوز الهدف", noTarget: "بدون هدف",
    targetsH: "الأهداف الشهرية للفئات", targetsTotal: "مجموع الأهداف الشهرية", vsSpent: "المصروف الفعلي",
    txCount: "عملية", errAmount: "أدخل مبلغاً صحيحاً.",
    catFood: "مطاعم وقهوة", catGroceries: "تموينات", catTransport: "مواصلات ووقود",
    catBills: "فواتير واتصالات", catShopping: "تسوق", catHealth: "صحة",
    catFun: "ترفيه", catEduC: "تعليم", catOtherC: "أخرى",
    fixedH: "المصروفات الثابتة الشهرية", dueDayL: "يوم الاستحقاق",
    fixedNameL: "اسم البند (مثال: راتب العاملة المنزلية)", addFixed: "أضف مصروفاً ثابتاً",
    markPaid: "سجّل كمدفوع", paidTag: "مدفوع ✓", dueTag: "يستحق يوم", overdueTag: "متأخر",
    fixedTotal: "إجمالي الالتزامات الثابتة", noFixed: "لا توجد مصروفات ثابتة بعد. أضف الرواتب والإيجارات والاشتراكات الشهرية هنا.",
    dailyH: "التقدم اليومي خلال الشهر", perDayL: "مصروف اليوم", cumulativeL: "التراكمي",
    dayL: "يوم", summaryH: "ملخص نهاية الشهر",
    fixedShare: "مصروفات ثابتة", variableShare: "مصروفات متغيرة", avgDayL: "متوسط الصرف اليومي", topCatL: "أعلى فئة صرفاً",
    heroLeft: "الباقي من الدخل", heroIncome: "دخل الشهر", heroSpent: "المصروف حتى الآن",
    salaryDayL: "يوم الراتب", daysToSalary: "يوم حتى الراتب", safeDaily: "معدلك الآمن لليوم",
    tapHint: "اضغط على أي بند لتسجيل مصروف فوراً", quickFor: "تسجيل مصروف",
    budgetOf: "من", cancelL: "إغلاق",
    pageLearn: "المعرفة المالية",
    learnH: "كيف يعمل المال؟ دليل العائلة",
    learnSub: "تعريفات ومصطلحات مالية أساسية وممارسات مجرّبة تساعد عائلتك على فهم المال وإدارته بثقة.",
    searchPH: "ابحث عن مصطلح أو ممارسة…",
    filterAll: "الكل", filterDefs: "تعريفات", filterPractices: "ممارسات",
    noResults: "لا توجد نتائج مطابقة.",
    defTag: "تعريف", practiceTag: "ممارسة",
    scoreH: "درجة العائلة المالية", outOf: "من ١٠٠",
    lvlExcellent: "متينة", lvlGood: "جيدة", lvlFair: "تحتاج انتباهاً", lvlWeak: "حرجة",
    kSurplus: "الفائض الشهري", kSavingsRate: "معدل الادخار", kDebt: "نسبة الالتزامات",
    kEmergency: "تغطية الطوارئ", months: "شهر",
    debtGuide: "الحد الإرشادي ٣٣٪", emGuide: "المستهدف ٦ أشهر", srGuide: "المستهدف ٢٠٪",
    projH: "مسار الثروة حتى التقاعد", nominal: "القيمة الاسمية", real: "القوة الشرائية (بعد التضخم)",
    atRetire: "المتوقع عند التقاعد", needed: "المطلوب للتقاعد (قاعدة ٤٪ الإرشادية)",
    readiness: "جاهزية التقاعد",
    goalTable: "خطة الأهداف", gName: "الهدف", gMonthly: "الادخار الشهري المطلوب",
    gStatus: "الحالة", ok: "ممكن ضمن الفائض", tight: "يزاحم الفائض", short: "الفائض لا يكفي",
    totalRequired: "إجمالي المطلوب شهرياً للأهداف", vs: "مقابل فائض", advice: "قراءة مستشارك",
    disclaimer: "أداة تعليمية للتخطيط، وليست استشارة مالية أو استثمارية مرخّصة. النتائج تقديرية وفق افتراضاتك.",
    yearsAxis: "سنة", sar: "ر.س",
    aSurplusNeg: "مصروفاتكم تتجاوز الدخل — الأولوية الأولى إيقاف النزيف قبل أي هدف طويل المدى.",
    aDebtHigh: "نسبة الالتزامات أعلى من الحد الإرشادي ٣٣٪ — خطة سداد متسارعة سترفع درجتكم أسرع من أي استثمار.",
    aEmLow: "صندوق الطوارئ أقل من ٣ أشهر — اجعلوه الهدف الأول قبل الأهداف الأخرى.",
    aGoalsShort: "الأهداف الحالية تتطلب أكثر من فائضكم — مدّدوا المدد أو رتّبوا الأولويات.",
    aRetireLow: "مسار التقاعد يغطي أقل من نصف المطلوب — رفع الادخار الشهري مبكراً أقوى أثراً من رفع العائد.",
    aStrong: "وضعكم متين: فائض إيجابي، التزامات منضبطة، وطوارئ كافية. ثبّتوا الادخار التلقائي وراجعوا الخطة كل ربع سنة.",
  },
  en: {
    dir: "ltr", lang: "English", other: "العربية",
    brand: "Qiwam", tagline: "Balanced money. Independent future.",
    loginTitle: "Sign in", registerTitle: "Create your account",
    name: "Name", email: "Email", password: "Password",
    login: "Sign in", register: "Create account", logout: "Sign out",
    toRegister: "No account? Register", toLogin: "Have an account? Sign in",
    gateNote: "The planner is available to registered users only. Your data is saved to your account.",
    errExists: "This email is already registered. Sign in instead.",
    errBad: "Incorrect email or password.",
    errFill: "Complete all fields (password 6+ characters).",
    welcome: "Welcome", saved: "Plan saved ✓", save: "Save plan",
    tabProfile: "Family profile", tabGoals: "Goals", tabResults: "Results",
    incomeH: "Monthly income", you: "Your income", spouse: "Spouse income", otherInc: "Other income",
    expH: "Monthly expenses", housing: "Housing", transport: "Transport", food: "Food",
    education: "Education", utilities: "Utilities & telecom", otherExp: "Other expenses",
    debtH: "Obligations", debtPay: "Monthly installments (finance/cards)", debtTotal: "Total debt outstanding",
    wealthH: "Savings & assets", liquid: "Liquid savings", invested: "Current investments",
    familyH: "Family", age: "Your age", retireAge: "Retirement age", children: "Number of children",
    assumpH: "Growth assumptions", ret: "Expected return % / yr", inf: "Expected inflation % / yr",
    goalsH: "Long-term family goals",
    goalsNote: "Set a target amount and horizon; we compute the required monthly saving per goal.",
    gHouse: "Home down payment", gEdu: "Children's education", gHajj: "Hajj & Umrah",
    gWedding: "Wedding", gEmergency: "Emergency fund", gCar: "Car",
    target: "Target amount", years: "Within (years)", enabled: "On",
    itemName: "Item name", amount: "Amount", remove: "Remove item",
    addIncome: "Add income item", addExpense: "Add expense item", addGoal: "Add custom goal",
    customGoalName: "Goal name", customGoalDefault: "New goal",
    tabSpend: "Daily spend", tabReport: "Monthly report",
    pageCalc: "Planning Calculator", pageSpend: "Spending Tracker",
    spendH: "Log a spend", dateL: "Date", categoryL: "Category", noteL: "Note (optional)",
    addTx: "Add spend", monthTx: "This month's spending", noTx: "No spending logged yet.",
    newCat: "New category name…", addCat: "Add category", spentTotal: "Total spent",
    reportH: "Month spending by category", monthL: "Month", targetL: "Monthly target",
    actualL: "Actual", shareL: "% of total", statusCol: "Status",
    within: "Within target", over: "Over target", noTarget: "No target",
    targetsH: "Monthly category targets", targetsTotal: "Total monthly targets", vsSpent: "Actual spend",
    txCount: "entries", errAmount: "Enter a valid amount.",
    catFood: "Dining & coffee", catGroceries: "Groceries", catTransport: "Transport & fuel",
    catBills: "Bills & telecom", catShopping: "Shopping", catHealth: "Health",
    catFun: "Entertainment", catEduC: "Education", catOtherC: "Other",
    fixedH: "Fixed monthly expenses", dueDayL: "Due day of month",
    fixedNameL: "Item name (e.g., housemaid salary)", addFixed: "Add fixed expense",
    markPaid: "Mark as paid", paidTag: "Paid ✓", dueTag: "Due on day", overdueTag: "Overdue",
    fixedTotal: "Total fixed commitments", noFixed: "No fixed expenses yet. Add monthly salaries, rent, and subscriptions here.",
    dailyH: "Day-by-day progress this month", perDayL: "Spend per day", cumulativeL: "Cumulative",
    dayL: "Day", summaryH: "End-of-month summary",
    fixedShare: "Fixed spending", variableShare: "Variable spending", avgDayL: "Average daily spend", topCatL: "Top category",
    heroLeft: "Remaining from income", heroIncome: "Month income", heroSpent: "Spent so far",
    salaryDayL: "Salary day", daysToSalary: "days to salary", safeDaily: "Your safe daily rate",
    tapHint: "Tap any category to log a spend instantly", quickFor: "Log spend",
    budgetOf: "of", cancelL: "Close",
    pageLearn: "Money Basics",
    learnH: "How money works — a family guide",
    learnSub: "Core financial definitions and proven practices to help your family understand and manage money with confidence.",
    searchPH: "Search a term or practice…",
    filterAll: "All", filterDefs: "Definitions", filterPractices: "Practices",
    noResults: "No matching results.",
    defTag: "Definition", practiceTag: "Practice",
    scoreH: "Family Financial Score", outOf: "out of 100",
    lvlExcellent: "Strong", lvlGood: "Good", lvlFair: "Needs attention", lvlWeak: "Critical",
    kSurplus: "Monthly surplus", kSavingsRate: "Savings rate", kDebt: "Debt burden",
    kEmergency: "Emergency cover", months: "mo",
    debtGuide: "guideline ≤ 33%", emGuide: "target 6 months", srGuide: "target 20%",
    projH: "Wealth path to retirement", nominal: "Nominal value", real: "Purchasing power (real)",
    atRetire: "Projected at retirement", needed: "Needed at retirement (4% rule guideline)",
    readiness: "Retirement readiness",
    goalTable: "Goal plan", gName: "Goal", gMonthly: "Required monthly saving",
    gStatus: "Status", ok: "Fits your surplus", tight: "Crowds your surplus", short: "Exceeds surplus",
    totalRequired: "Total required per month for goals", vs: "vs surplus of", advice: "Your advisor's read",
    disclaimer: "An educational planning tool — not licensed financial or investment advice. Results are estimates based on your assumptions.",
    yearsAxis: "yr", sar: "SAR",
    aSurplusNeg: "Expenses exceed income — stop the bleeding before funding any long-term goal.",
    aDebtHigh: "Debt burden is above the 33% guideline — an accelerated payoff plan lifts your score faster than any investment.",
    aEmLow: "Emergency fund is under 3 months — make it goal #1 before the others.",
    aGoalsShort: "Current goals need more than your surplus — extend horizons or prioritize.",
    aRetireLow: "Your retirement path covers less than half the target — raising monthly saving early beats chasing returns.",
    aStrong: "You are in strong shape: positive surplus, controlled debt, adequate emergency cover. Automate savings and review quarterly.",
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const hash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return "h" + h.toString(36); };
const num = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
const fmt = (v, lang) => new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", { maximumFractionDigits: 0 }).format(Math.round(v));
const pct = (v, lang) => new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", { maximumFractionDigits: 1 }).format(v) + "%";

async function sGet(key) { try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } catch { return null; } }
async function sSet(key, val) { try { await window.storage.set(key, JSON.stringify(val)); } catch (e) { console.error(e); } }
async function sDel(key) { try { await window.storage.delete(key); } catch {} }

const DEFAULTS = {
  incYou: 15000, incSpouse: 0, incOther: 0,
  housing: 3500, transport: 1500, food: 3000, education: 800, utilities: 900, otherExp: 1200,
  debtPay: 1500, debtTotal: 60000, liquid: 20000, invested: 15000,
  age: 32, retireAge: 60, children: 2, ret: 6, inf: 2.5,
  goals: {
    emergency: { on: true, target: 50000, years: 2 },
    house: { on: true, target: 200000, years: 6 },
    edu: { on: true, target: 300000, years: 12 },
    hajj: { on: false, target: 40000, years: 4 },
    wedding: { on: false, target: 120000, years: 10 },
    car: { on: false, target: 90000, years: 4 },
  },
  customIncome: [],
  customExpense: [],
  customGoals: [],
  categories: [
    { id: "food", key: "catFood" }, { id: "groceries", key: "catGroceries" },
    { id: "transport", key: "catTransport" }, { id: "bills", key: "catBills" },
    { id: "shopping", key: "catShopping" }, { id: "health", key: "catHealth" },
    { id: "fun", key: "catFun" }, { id: "edu2", key: "catEduC" }, { id: "other2", key: "catOtherC" },
  ],
  targets: {},
  tx: [],
  fixed: [],
  salaryDay: 27,
};

const CAT_ICONS = { food: "🍽️", groceries: "🛒", transport: "⛽", bills: "📱", shopping: "🛍️", health: "🩺", fun: "🎮", edu2: "🎓", other2: "📦" };
const catIcon = (c) => (c.custom ? "🏷️" : CAT_ICONS[c.id] || "📦");

/* ------------------------------------------------------------------ */
/*  Knowledge base — bilingual family finance content                  */
/* ------------------------------------------------------------------ */
const KB = [
  { id: "budget", kind: "def", icon: "🧮",
    ar: { term: "الميزانية", body: "خطة مكتوبة توزّع دخلك الشهري على المصروفات والادخار والأهداف قبل بداية الشهر. الميزانية لا تعني الحرمان، بل تعني أن تقرر أنت مسبقاً أين تذهب أموالك بدلاً من أن تتساءل لاحقاً أين ذهبت." },
    en: { term: "Budget", body: "A written plan that allocates your monthly income to expenses, savings, and goals before the month begins. A budget is not deprivation — it means you decide in advance where your money goes instead of wondering afterwards where it went." } },
  { id: "networth", kind: "def", icon: "⚖️",
    ar: { term: "صافي الثروة", body: "كل ما تملكه العائلة (نقد، مدخرات، استثمارات، عقار) مطروحاً منه كل ما عليها من التزامات (تمويلات، بطاقات). هو المقياس الحقيقي لتقدّمكم المالي عبر السنوات، وليس حجم الراتب." },
    en: { term: "Net worth", body: "Everything the family owns (cash, savings, investments, property) minus everything it owes (financing, cards). It is the true measure of your financial progress over the years — not the size of your salary." } },
  { id: "savingsrate", kind: "def", icon: "💧",
    ar: { term: "معدل الادخار", body: "النسبة المئوية من دخلك التي تدخرها كل شهر. مثال: دخل 20,000 ريال وادخار 3,000 ريال يعني معدل ادخار 15٪. الهدف الإرشادي للعائلات هو 20٪ من الدخل." },
    en: { term: "Savings rate", body: "The percentage of your income you save each month. Example: SAR 20,000 income with SAR 3,000 saved is a 15% savings rate. A common family guideline target is 20% of income." } },
  { id: "emergency", kind: "def", icon: "🛟",
    ar: { term: "صندوق الطوارئ", body: "مبلغ سائل يغطي 3 إلى 6 أشهر من مصروفات العائلة الأساسية، يُحفظ في حساب منفصل سهل الوصول. هو خط الدفاع الأول ضد فقدان الوظيفة أو المرض أو الأعطال المفاجئة، ويمنعك من اللجوء إلى الدين عند الأزمات." },
    en: { term: "Emergency fund", body: "A liquid amount covering 3–6 months of the family's essential expenses, kept in a separate, accessible account. It is the first line of defense against job loss, illness, or sudden repairs — and it keeps you from turning to debt in a crisis." } },
  { id: "dbr", kind: "def", icon: "📉",
    ar: { term: "نسبة عبء الدين", body: "نسبة أقساطك الشهرية إلى دخلك الشهري. إذا كان دخلك 15,000 ريال وأقساطك 5,000 ريال فنسبتك 33٪ — وهو الحد الإرشادي الأعلى المتعارف عليه. كلما انخفضت النسبة زادت حرية عائلتك المالية." },
    en: { term: "Debt burden ratio (DBR)", body: "Your monthly installments as a share of monthly income. If you earn SAR 15,000 and pay SAR 5,000 in installments, your DBR is 33% — the commonly used upper guideline. The lower the ratio, the more financial freedom your family has." } },
  { id: "cashflow", kind: "def", icon: "🔄",
    ar: { term: "التدفق النقدي والفائض", body: "التدفق النقدي هو حركة الدخل والمصروفات خلال الشهر، والفائض هو ما يتبقى بعد كل المصروفات والأقساط. الفائض الإيجابي المنتظم هو الوقود لكل هدف مالي: الطوارئ، والمنزل، والتقاعد." },
    en: { term: "Cash flow & surplus", body: "Cash flow is the movement of income and expenses through the month; surplus is what remains after all spending and installments. A consistent positive surplus is the fuel for every financial goal — emergencies, the house, retirement." } },
  { id: "inflation", kind: "def", icon: "🎈",
    ar: { term: "التضخم", body: "الارتفاع التدريجي للأسعار الذي يقلل القوة الشرائية لأموالك مع الوقت. تضخم 2.5٪ سنوياً يعني أن 100,000 ريال اليوم تشتري ما قيمته نحو 78,000 ريال بعد 10 سنوات — ولهذا يجب أن تنمو مدخراتك بمعدل أعلى من التضخم." },
    en: { term: "Inflation", body: "The gradual rise in prices that erodes your money's purchasing power over time. At 2.5% yearly inflation, SAR 100,000 today buys only about SAR 78,000 worth in 10 years — which is why savings must grow faster than inflation." } },
  { id: "compound", kind: "def", icon: "🌱",
    ar: { term: "النمو المركب", body: "أن تربح أرباحاً على أرباحك السابقة. من يدخر 1,000 ريال شهرياً بعائد 6٪ يجمع نحو 165,000 ريال في 10 سنوات ونحو 465,000 ريال في 20 سنة — الضعف الثالث يأتي من الزمن لا من المال. أثمن ما تملكه هو البدء مبكراً." },
    en: { term: "Compound growth", body: "Earning returns on your previous returns. Saving SAR 1,000 monthly at a 6% return builds roughly SAR 165,000 in 10 years and about SAR 465,000 in 20 — the later growth comes from time, not money. Your most valuable asset is starting early." } },
  { id: "assets", kind: "def", icon: "🏦",
    ar: { term: "الأصول والخصوم", body: "الأصل شيء تملكه وله قيمة أو يدرّ دخلاً (مدخرات، صندوق استثماري، عقار مؤجّر). الخصم التزام عليك سداده (تمويل شخصي، بطاقة ائتمانية). القاعدة الذهبية: اجعل أصولك تنمو أسرع من خصومك." },
    en: { term: "Assets & liabilities", body: "An asset is something you own that holds value or produces income (savings, an investment fund, a rented property). A liability is an obligation you must repay (personal financing, a credit card). The golden rule: grow your assets faster than your liabilities." } },
  { id: "liquidity", kind: "def", icon: "💵",
    ar: { term: "السيولة", body: "مدى سرعة تحويل الأصل إلى نقد دون خسارة قيمته. الحساب الجاري عالي السيولة، والعقار منخفض السيولة. صندوق الطوارئ يجب أن يبقى في أصول عالية السيولة دائماً." },
    en: { term: "Liquidity", body: "How quickly an asset can become cash without losing value. A current account is highly liquid; real estate is not. Your emergency fund must always stay in highly liquid assets." } },
  { id: "diversify", kind: "def", icon: "🧺",
    ar: { term: "التنويع", body: "توزيع استثماراتك بين أصول مختلفة (أسهم، صكوك، عقار، ذهب) حتى لا يعتمد مستقبل عائلتك على أداء أصل واحد. المثل المالي الأشهر: لا تضع كل البيض في سلة واحدة." },
    en: { term: "Diversification", body: "Spreading investments across different assets (equities, sukuk, real estate, gold) so your family's future never depends on a single asset's performance. The oldest rule in finance: don't put all your eggs in one basket." } },
  { id: "zakat", kind: "def", icon: "🕌",
    ar: { term: "الزكاة", body: "ركن مالي سنوي يُحسب عادة بنسبة 2.5٪ على الأموال الزكوية (النقد، الذهب، عروض التجارة، الاستثمارات) التي بلغت النصاب وحال عليها الحول. تتبّع أصولك خلال السنة يجعل حسابها دقيقاً وسهلاً — استشر أهل العلم في الحالات الخاصة." },
    en: { term: "Zakat", body: "An annual financial pillar, typically 2.5% of zakatable wealth (cash, gold, trade goods, investments) that meets the nisab and has been held a full lunar year. Tracking assets through the year makes the calculation accurate and easy — consult qualified scholars for special cases." } },
  { id: "murabaha", kind: "def", icon: "🤝",
    ar: { term: "المرابحة والإجارة", body: "أشهر صيغتين للتمويل الإسلامي: في المرابحة تشتري الجهة الممولة السلعة ثم تبيعها لك بربح معلوم تسدده أقساطاً. وفي الإجارة (المستخدمة كثيراً في التمويل العقاري) تستأجر الأصل مع وعد بالتملك. قارن دائماً التكلفة الإجمالية الفعلية بين العروض وليس القسط الشهري فقط." },
    en: { term: "Murabaha & Ijara", body: "The two most common Islamic financing structures: in murabaha, the financier buys the item and sells it to you at a disclosed markup paid in installments. In ijara (widely used in home finance), you lease the asset with a promise of ownership. Always compare the total effective cost across offers — not just the monthly installment." } },
  { id: "gosi", kind: "def", icon: "🧓",
    ar: { term: "التقاعد: التأمينات ومكافأة نهاية الخدمة", body: "معاش التأمينات الاجتماعية ومكافأة نهاية الخدمة هما أساس تقاعد الموظف في السعودية، لكنهما وحدهما لا يكفيان غالباً للحفاظ على مستوى المعيشة. الادخار الخاص المنتظم هو الركن الثالث الذي تبنيه أنت — وكلما بدأت أبكر قلّ المبلغ الشهري المطلوب." },
    en: { term: "Retirement: GOSI & end-of-service", body: "The GOSI pension and end-of-service benefit are the foundation of employee retirement in Saudi Arabia, but alone they are rarely enough to maintain your standard of living. Regular private saving is the third pillar — and the earlier you start, the smaller the required monthly amount." } },
  { id: "rule4", kind: "def", icon: "🧭",
    ar: { term: "قاعدة الـ 4٪ (إرشادية)", body: "قاعدة تقريبية لتقدير مبلغ التقاعد: اضرب مصروفك السنوي المتوقع عند التقاعد في 25. عائلة تحتاج 120,000 ريال سنوياً تستهدف نحو 3 ملايين ريال. هي نقطة انطلاق للتخطيط وليست ضماناً — راجعها دورياً مع تغيّر ظروفك." },
    en: { term: "The 4% rule (guideline)", body: "A rough retirement sizing rule: multiply your expected annual retirement spending by 25. A family needing SAR 120,000 a year would target about SAR 3 million. It is a planning starting point, not a guarantee — revisit it as circumstances change." } },
  { id: "p5030", kind: "practice", icon: "🥧",
    ar: { term: "قاعدة 50/30/20", body: "وجّه نحو 50٪ من الدخل للأساسيات (سكن، غذاء، مواصلات، التزامات)، و30٪ لنمط الحياة (ترفيه، مطاعم، تسوق)، و20٪ للادخار والأهداف. عدّل النسب حسب واقع عائلتك — المهم أن يكون للادخار نصيب ثابت لا يُمَس." },
    en: { term: "The 50/30/20 rule", body: "Direct roughly 50% of income to essentials (housing, food, transport, obligations), 30% to lifestyle (dining, shopping, fun), and 20% to savings and goals. Adjust the ratios to your family's reality — what matters is that savings always gets a fixed, untouchable share." } },
  { id: "payfirst", kind: "practice", icon: "⏰",
    ar: { term: "ادفع لنفسك أولاً", body: "حوّل مبلغ الادخار تلقائياً يوم نزول الراتب — قبل أي صرف — إلى حساب منفصل. ما يتبقى بعد الادخار هو ميزانية الشهر، وليس العكس. هذه العادة الواحدة تبني الثروة أكثر من أي مهارة استثمارية." },
    en: { term: "Pay yourself first", body: "Automatically transfer your savings amount on salary day — before any spending — into a separate account. What remains after saving becomes the month's budget, not the other way around. This single habit builds more wealth than any investing skill." } },
  { id: "pemergency", kind: "practice", icon: "🚨",
    ar: { term: "ابنِ الطوارئ قبل الاستثمار", body: "قبل أي استثمار أو هدف كبير، أكمل صندوق طوارئ يغطي 3 أشهر على الأقل (و6 أشهر لمن دخله غير ثابت). الاستثمار بدون طوارئ يعني أنك قد تضطر للبيع بخسارة في أسوأ وقت." },
    en: { term: "Build emergencies before investing", body: "Before any investment or big goal, complete an emergency fund covering at least 3 months (6 if your income is variable). Investing without an emergency cushion means you may be forced to sell at a loss at the worst possible time." } },
  { id: "pdebt", kind: "practice", icon: "✂️",
    ar: { term: "خطة سداد الديون: كرة الثلج أو الانهيار", body: "طريقتان مجرّبتان: «كرة الثلج» تسدد أصغر دين أولاً لتكسب دفعة نفسية، و«الانهيار» تسدد الأعلى تكلفة أولاً لتوفر أكثر. اختر ما ستلتزم به فعلاً، وحافظ على نسبة أقساطك تحت 33٪ من الدخل." },
    en: { term: "Debt payoff: snowball or avalanche", body: "Two proven methods: the snowball clears the smallest debt first for psychological momentum; the avalanche clears the costliest first to save the most. Choose the one you will actually stick to — and keep installments under 33% of income." } },
  { id: "pmeeting", kind: "practice", icon: "🗓️",
    ar: { term: "اجتماع العائلة المالي الشهري", body: "خصص 30 دقيقة شهرياً مع شريك حياتك لمراجعة ثلاث نقاط فقط: أين صرفنا؟ أين وصلنا في أهدافنا؟ وماذا سنغيّر الشهر القادم؟ الشفافية المنتظمة تمنع 90٪ من الخلافات المالية الزوجية." },
    en: { term: "The monthly family money meeting", body: "Set 30 minutes a month with your spouse to review just three things: where did we spend, where are our goals, and what changes next month? Regular transparency prevents most marital money conflict." } },
  { id: "pchildren", kind: "practice", icon: "🧒",
    ar: { term: "علّم أبناءك المال بالمصروف", body: "امنح الأبناء مصروفاً أسبوعياً ثابتاً وقسّمه معهم ثلاثة أقسام: صرف، وادخار لهدف قريب، وصدقة. الطفل الذي يدّخر لشراء لعبته يتعلم في شهرين ما لا تعلّمه المحاضرات في سنوات." },
    en: { term: "Teach children money through allowance", body: "Give children a fixed weekly allowance and split it together into three jars: spending, saving for a near goal, and charity. A child who saves for their own toy learns in two months what lectures cannot teach in years." } },
  { id: "plifestyle", kind: "practice", icon: "🪜",
    ar: { term: "احذر تضخم نمط الحياة", body: "عند كل زيادة راتب أو ترقية، وجّه نصف الزيادة على الأقل للادخار قبل رفع مستوى المعيشة. من يرفع مصروفه مع كل زيادة يبقى في نفس النقطة مالياً مهما ارتفع دخله." },
    en: { term: "Beware lifestyle inflation", body: "With every raise or promotion, direct at least half of the increase to savings before upgrading your lifestyle. Those who raise spending with every raise stay in the same financial place no matter how high their income climbs." } },
  { id: "preview", kind: "practice", icon: "🔍",
    ar: { term: "المراجعة السنوية الشاملة", body: "مرة كل سنة (كثير من العائلات تختار رمضان أو بداية السنة): احسب صافي ثروتك، وراجع الزكاة، وحدّث أهدافك، وقارن عروض التأمين والاتصالات والاشتراكات. ساعتان سنوياً توفران آلاف الريالات." },
    en: { term: "The annual full review", body: "Once a year (many families choose Ramadan or the new year): compute your net worth, review Zakat, refresh your goals, and re-shop insurance, telecom, and subscriptions. Two hours a year can save thousands of riyals." } },
];

const catName = (c, t) => (c.custom ? c.name || "—" : t[c.key] || c.id);
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

/* Required monthly saving for a future target (annuity with monthly compounding) */
function reqMonthly(target, years, annualRet) {
  const n = Math.max(1, Math.round(years * 12));
  const r = annualRet / 100 / 12;
  if (r === 0) return target / n;
  return (target * r) / (Math.pow(1 + r, n) - 1);
}

function QiwamLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="20" cy="20" r="19" fill="#0E312A" stroke={C.gold} strokeWidth="1.2" />
      {/* balance beam */}
      <rect x="8" y="13.5" width="24" height="2.6" rx="1.3" fill={C.gold} />
      {/* pivot */}
      <path d="M18.2 13.5 L21.8 13.5 L20 9.5 Z" fill={C.gold} />
      {/* sadu pans */}
      <path d="M8.5 18 L15.5 18 L12 26 Z" fill={C.gold} />
      <path d="M24.5 18 L31.5 18 L28 26 Z" fill="#2E8A70" />
      {/* base */}
      <rect x="19" y="16" width="2" height="12" rx="1" fill="#E9E2D2" opacity="0.9" />
      <rect x="14.5" y="28.5" width="11" height="2.4" rx="1.2" fill="#E9E2D2" opacity="0.9" />
    </svg>
  );
}

/* Sadu band — signature element */
function SaduBand({ height = 10 }) {
  return (
    <svg width="100%" height={height} preserveAspectRatio="none" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <pattern id="sadu" width="28" height={height} patternUnits="userSpaceOnUse">
          <rect width="28" height={height} fill={C.pine} />
          <path d={`M0 ${height} L7 0 L14 ${height} Z`} fill={C.gold} />
          <path d={`M14 ${height} L21 0 L28 ${height} Z`} fill={C.oasis} />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill="url(#sadu)" />
    </svg>
  );
}

/* Score gauge — SVG arc */
function Gauge({ score, label, sub }) {
  const R = 84, CX = 100, CY = 100, start = -210, end = 30;
  const arc = (a0, a1, color, w) => {
    const p = (a) => [CX + R * Math.cos((a * Math.PI) / 180), CY + R * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    const large = a1 - a0 > 180 ? 1 : 0;
    return <path d={`M${x0} ${y0} A${R} ${R} 0 ${large} 1 ${x1} ${y1}`} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" />;
  };
  const frac = Math.max(0.02, Math.min(1, score / 100));
  const color = score >= 75 ? C.good : score >= 55 ? C.oasis : score >= 35 ? C.warn : C.bad;
  return (
    <svg viewBox="0 0 200 150" style={{ width: "100%", maxWidth: 260 }}>
      {arc(start, end, C.line, 14)}
      {arc(start, start + (end - start) * frac, color, 14)}
      <text x={CX} y={92} textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="44" fill={C.ink}>{score}</text>
      <text x={CX} y={114} textAnchor="middle" fontFamily={FONT} fontSize="11" fill={C.sub}>{sub}</text>
      <text x={CX} y={140} textAnchor="middle" fontFamily={FONT} fontWeight="500" fontSize="14" fill={color}>{label}</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Small UI atoms                                                     */
/* ------------------------------------------------------------------ */
const card = { background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: "clamp(16px, 2vw, 28px)" };
const h2s = { fontSize: "clamp(14px, 1.5vw, 20px)", fontWeight: 700, color: C.pine, margin: "0 0 14px", letterSpacing: 0.2 };

function Field({ label, value, onChange, type = "number", suffix }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", fontSize: 12.5, color: C.sub, marginBottom: 5 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type={type} value={value}
          inputMode={type === "number" ? "decimal" : undefined}
          autoComplete={type === "password" ? "current-password" : type === "email" ? "email" : undefined}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`,
            fontFamily: FONT, fontSize: 15, color: C.ink, background: "#FBFCFB", outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = C.oasis)}
          onBlur={(e) => (e.target.style.borderColor = C.line)}
        />
        {suffix && <span style={{ fontSize: 12, color: C.sub, whiteSpace: "nowrap" }}>{suffix}</span>}
      </div>
    </label>
  );
}

function Stat({ label, value, note, tone }) {
  const col = tone === "good" ? C.good : tone === "warn" ? C.warn : tone === "bad" ? C.bad : C.ink;
  return (
    <div style={{ ...card, padding: 16 }}>
      <div style={{ fontSize: 12, color: C.sub, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: col, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {note && <div style={{ fontSize: 11, color: C.sub, marginTop: 4 }}>{note}</div>}
    </div>
  );
}

function CustomItems({ items, t, addLabel, onAdd, onUpd, onDel }) {
  return (
    <div>
      {items.map((it) => (
        <div key={it.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <div style={{ flex: 1.3 }}>
            <Field label={t.itemName} value={it.name} onChange={onUpd(it.id, "name")} type="text" />
          </div>
          <div style={{ flex: 1 }}>
            <Field label={t.amount} value={it.amount} onChange={onUpd(it.id, "amount")} suffix={t.sar} />
          </div>
          <button onClick={() => onDel(it.id)} aria-label={t.remove} title={t.remove}
            style={{ marginTop: 22, width: 34, height: 40, borderRadius: 10, border: `1px solid ${C.line}`, background: "#fff", color: C.bad, cursor: "pointer", fontSize: 15, flexShrink: 0 }}>
            ✕
          </button>
        </div>
      ))}
      <button onClick={onAdd}
        style={{ width: "100%", padding: "9px 0", borderRadius: 10, border: `1.5px dashed ${C.oasis}`, background: "transparent", color: C.oasis, fontFamily: FONT, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 4 }}>
        + {addLabel}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Auth screen                                                        */
/* ------------------------------------------------------------------ */
function Auth({ t, lang, setLang, onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState(""), [email, setEmail] = useState(""), [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  async function submit() {
    setErr("");
    const em = email.trim().toLowerCase();
    if (!em || pw.length < 6 || (mode === "register" && !name.trim())) { setErr(t.errFill); return; }
    const accounts = (await sGet("accounts")) || {};
    if (mode === "register") {
      if (accounts[em]) { setErr(t.errExists); return; }
      accounts[em] = { name: name.trim(), pw: hash(pw) };
      await sSet("accounts", accounts);
      await sSet("session", { email: em });
      onLogin({ email: em, name: name.trim() });
    } else {
      if (!accounts[em] || accounts[em].pw !== hash(pw)) { setErr(t.errBad); return; }
      await sSet("session", { email: em });
      onLogin({ email: em, name: accounts[em].name });
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: FONT }} dir={t.dir}>
      <div style={{ background: C.pine, color: "#fff", padding: "clamp(24px, 5vw, 48px) 24px 30px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <QiwamLogo size={46} />
          <div style={{ fontSize: 32, fontWeight: 700 }}>{t.brand}</div>
        </div>
        <div style={{ fontSize: 14, opacity: 0.85, marginTop: 8 }}>{t.tagline}</div>
      </div>
      <SaduBand />
      <div style={{ maxWidth: 440, width: "100%", margin: "36px auto", padding: "0 16px" }}>
        <div style={{ ...card, padding: "clamp(20px, 3vw, 36px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h1 style={{ fontSize: 19, fontWeight: 700, color: C.ink, margin: 0 }}>
              {mode === "login" ? t.loginTitle : t.registerTitle}
            </h1>
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              style={{ border: `1px solid ${C.line}`, background: "#fff", borderRadius: 999, padding: "5px 12px", fontFamily: FONT, fontSize: 12.5, cursor: "pointer", color: C.oasis }}>
              {t.other}
            </button>
          </div>
          <p style={{ fontSize: 12.5, color: C.sub, marginTop: 0, marginBottom: 18, lineHeight: 1.6 }}>{t.gateNote}</p>
          {mode === "register" && <Field label={t.name} value={name} onChange={setName} type="text" />}
          <Field label={t.email} value={email} onChange={setEmail} type="email" />
          <Field label={t.password} value={pw} onChange={setPw} type="password" />
          {err && <div style={{ color: C.bad, fontSize: 13, marginBottom: 10 }}>{err}</div>}
          <button onClick={submit}
            style={{ width: "100%", background: C.oasis, color: "#fff", border: "none", borderRadius: 10, padding: "12px 0", fontFamily: FONT, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            {mode === "login" ? t.login : t.register}
          </button>
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setErr(""); }}
            style={{ width: "100%", background: "none", border: "none", color: C.oasis, fontFamily: FONT, fontSize: 13, marginTop: 12, cursor: "pointer" }}>
            {mode === "login" ? t.toRegister : t.toLogin}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main app                                                           */
/* ------------------------------------------------------------------ */
export default function App() {
  const [lang, setLang] = useState("ar");
  const t = T[lang];
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const pageFromHash = () => {
    const h = typeof window !== "undefined" ? window.location.hash : "";
    return h === "#/spending" ? "spending" : h === "#/learn" ? "learn" : "calculator";
  };
  const [page, setPage] = useState(pageFromHash);
  const [tab, setTab] = useState("profile");
  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const go = (p) => { try { window.location.hash = p === "spending" ? "#/spending" : p === "learn" ? "#/learn" : "#/calculator"; } catch {} setPage(p); };
  const [d, setD] = useState(DEFAULTS);
  const [savedMsg, setSavedMsg] = useState(false);

  /* boot: restore session + data */
  useEffect(() => {
    (async () => {
      const sess = await sGet("session");
      if (sess?.email) {
        const accounts = (await sGet("accounts")) || {};
        if (accounts[sess.email]) {
          setUser({ email: sess.email, name: accounts[sess.email].name });
          const saved = await sGet("plan:" + sess.email);
          if (saved) setD({ ...DEFAULTS, ...saved, goals: { ...DEFAULTS.goals, ...(saved.goals || {}) } });
        }
      }
      setBooting(false);
    })();
  }, []);

  async function loginDone(u) {
    setUser(u);
    const saved = await sGet("plan:" + u.email);
    if (saved) setD({ ...DEFAULTS, ...saved, goals: { ...DEFAULTS.goals, ...(saved.goals || {}) } });
    else setD(DEFAULTS);
    setTab("profile");
  }
  async function logout() { await sDel("session"); setUser(null); }
  async function savePlan() { await sSet("plan:" + user.email, d); setSavedMsg(true); setTimeout(() => setSavedMsg(false), 1800); }

  const set = (k) => (v) => setD((p) => ({ ...p, [k]: v }));
  const setGoal = (g, k) => (v) => setD((p) => ({ ...p, goals: { ...p.goals, [g]: { ...p.goals[g], [k]: k === "on" ? v : v } } }));
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const addItem = (k, item) => setD((p) => ({ ...p, [k]: [...(p[k] || []), item] }));
  const updItem = (k, id, field) => (v) => setD((p) => ({ ...p, [k]: (p[k] || []).map((it) => (it.id === id ? { ...it, [field]: v } : it)) }));
  const delItem = (k, id) => setD((p) => ({ ...p, [k]: (p[k] || []).filter((it) => it.id !== id) }));

  /* --- daily spend / categories / targets (auto-saved) --- */
  const [month, setMonth] = useState(() => todayISO().slice(0, 7));
  const [txForm, setTxForm] = useState({ date: todayISO(), cat: "food", amount: "", note: "" });
  const [newCat, setNewCat] = useState("");
  const [txErr, setTxErr] = useState("");
  const persist = (updater) =>
    setD((p) => { const next = updater(p); if (user) sSet("plan:" + user.email, next); return next; });

  const addTx = () => {
    if (!(num(txForm.amount) > 0)) { setTxErr(t.errAmount); return; }
    setTxErr("");
    const rec = { id: newId(), date: txForm.date || todayISO(), cat: txForm.cat, amount: num(txForm.amount), note: txForm.note.trim() };
    persist((p) => ({ ...p, tx: [...(p.tx || []), rec] }));
    setTxForm((f) => ({ ...f, amount: "", note: "" }));
  };
  const delTx = (id) => persist((p) => ({ ...p, tx: (p.tx || []).filter((x) => x.id !== id) }));
  const setTarget = (catId) => (v) => persist((p) => ({ ...p, targets: { ...(p.targets || {}), [catId]: v } }));
  const addCategory = () => {
    const name = newCat.trim();
    if (!name) return;
    const c = { id: newId(), name, custom: true };
    persist((p) => ({ ...p, categories: [...(p.categories || []), c] }));
    setTxForm((f) => ({ ...f, cat: c.id }));
    setNewCat("");
  };
  const delCategory = (id) =>
    persist((p) => ({ ...p, categories: (p.categories || []).filter((c) => c.id !== id) }));

  const cats = d.categories || [];
  const monthTx = useMemo(
    () => (d.tx || []).filter((x) => (x.date || "").slice(0, 7) === month).sort((a, b) => (a.date < b.date ? 1 : -1)),
    [d.tx, month]
  );
  const report = useMemo(() => {
    const byCat = {};
    monthTx.forEach((x) => { byCat[x.cat] = (byCat[x.cat] || 0) + num(x.amount); });
    const total = Object.values(byCat).reduce((a, b) => a + b, 0);
    const rowsR = cats
      .map((c) => ({ c, spent: byCat[c.id] || 0, target: num((d.targets || {})[c.id]) }))
      .filter((r) => r.spent > 0 || r.target > 0)
      .sort((a, b) => b.spent - a.spent);
    const targetsTotal = cats.reduce((a, c) => a + num((d.targets || {})[c.id]), 0);
    return { rowsR, total, targetsTotal };
  }, [monthTx, cats, d.targets]);

  /* --- fixed monthly expenses --- */
  const [fxForm, setFxForm] = useState({ name: "", cat: "bills", amount: "", dueDay: 1 });
  const daysIn = (m) => { const [y, mm] = m.split("-").map(Number); return new Date(y, mm, 0).getDate(); };
  const addFixed = () => {
    if (!fxForm.name.trim() || !(num(fxForm.amount) > 0)) return;
    const f = { id: newId(), name: fxForm.name.trim(), cat: fxForm.cat, amount: num(fxForm.amount), dueDay: Math.min(31, Math.max(1, num(fxForm.dueDay) || 1)) };
    persist((p) => ({ ...p, fixed: [...(p.fixed || []), f] }));
    setFxForm({ name: "", cat: "bills", amount: "", dueDay: 1 });
  };
  const delFixed = (id) => persist((p) => ({ ...p, fixed: (p.fixed || []).filter((f) => f.id !== id) }));
  const paidThisMonth = (f) => monthTx.some((x) => x.fixedId === f.id);
  const markPaid = (f) => {
    if (paidThisMonth(f)) return;
    const day = Math.min(f.dueDay, daysIn(month));
    const rec = { id: newId(), date: `${month}-${String(day).padStart(2, "0")}`, cat: f.cat, amount: f.amount, note: f.name, fixedId: f.id };
    persist((p) => ({ ...p, tx: [...(p.tx || []), rec] }));
  };
  const fixedList = d.fixed || [];
  const fixedTotal = fixedList.reduce((a, f) => a + num(f.amount), 0);
  const todayDay = Number(todayISO().slice(8, 10));
  const isCurrentMonth = month === todayISO().slice(0, 7);

  /* --- day-by-day progress + month summary --- */
  const daily = useMemo(() => {
    const n = daysIn(month);
    const perDay = Array.from({ length: n }, () => 0);
    monthTx.forEach((x) => { const dd = Number((x.date || "").slice(8, 10)); if (dd >= 1 && dd <= n) perDay[dd - 1] += num(x.amount); });
    let cum = 0;
    const series = perDay.map((v, i) => { cum += v; return { day: i + 1, spent: Math.round(v), cum: Math.round(cum) }; });
    const total = cum;
    const fixedSpent = monthTx.filter((x) => x.fixedId).reduce((a, x) => a + num(x.amount), 0);
    const elapsed = isCurrentMonth ? Math.max(1, todayDay) : n;
    const byCat = {};
    monthTx.forEach((x) => { byCat[x.cat] = (byCat[x.cat] || 0) + num(x.amount); });
    let topCat = null, topVal = 0;
    Object.entries(byCat).forEach(([k, v]) => { if (v > topVal) { topVal = v; topCat = k; } });
    const topC = cats.find((c) => c.id === topCat);
    return { series, total, fixedSpent, variable: total - fixedSpent, avg: total / elapsed, topName: topC ? catName(topC, t) : "—", topVal };
  }, [monthTx, month, cats, t, isCurrentMonth, todayDay]);

  /* group month transactions by day for the list */
  const byDayList = useMemo(() => {
    const g = {};
    monthTx.forEach((x) => { (g[x.date] = g[x.date] || []).push(x); });
    return Object.entries(g).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [monthTx]);

  /* --- Masareef-style home: quick tiles, remaining balance, salary countdown --- */
  const [quickCat, setQuickCat] = useState(null);
  const catSpentMap = useMemo(() => {
    const m = {};
    monthTx.forEach((x) => { m[x.cat] = (m[x.cat] || 0) + num(x.amount); });
    return m;
  }, [monthTx]);
  const monthIncome =
    num(d.incYou) + num(d.incSpouse) + num(d.incOther) +
    (d.customIncome || []).reduce((a, i) => a + num(i.amount), 0);
  const remainingM = monthIncome - daily.total;
  const salaryDay = Math.min(31, Math.max(1, num(d.salaryDay) || 27));
  const daysToSalary = useMemo(() => {
    const now = new Date();
    const nxt = new Date(now.getFullYear(), now.getMonth() + (now.getDate() >= salaryDay ? 1 : 0), salaryDay);
    return Math.max(1, Math.round((nxt - now) / 86400000));
  }, [salaryDay]);
  const safeDaily = remainingM > 0 ? remainingM / daysToSalary : 0;
  const hijriToday = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA-u-ca-islamic-umalqura" : "en-u-ca-islamic-umalqura",
        { day: "numeric", month: "long", year: "numeric" }).format(new Date());
    } catch { return ""; }
  }, [lang]);

  /* --- knowledge base state --- */
  const [kbQuery, setKbQuery] = useState("");
  const [kbFilter, setKbFilter] = useState("all");
  const [kbOpen, setKbOpen] = useState(null);
  const kbList = useMemo(() => {
    const q = kbQuery.trim().toLowerCase();
    return KB.filter((e) => {
      if (kbFilter !== "all" && e.kind !== kbFilter) return false;
      if (!q) return true;
      const a = e.ar.term + " " + e.ar.body, en = e.en.term + " " + e.en.body;
      return (a + " " + en).toLowerCase().includes(q);
    });
  }, [kbQuery, kbFilter]);

  /* ---------- calculations ---------- */
  const calc = useMemo(() => {
    const customInc = (d.customIncome || []).reduce((a, i) => a + num(i.amount), 0);
    const customExp = (d.customExpense || []).reduce((a, i) => a + num(i.amount), 0);
    const income = num(d.incYou) + num(d.incSpouse) + num(d.incOther) + customInc;
    const expenses = num(d.housing) + num(d.transport) + num(d.food) + num(d.education) + num(d.utilities) + num(d.otherExp) + customExp;
    const debtPay = num(d.debtPay);
    const surplus = income - expenses - debtPay;
    const savingsRate = income > 0 ? (surplus / income) * 100 : 0;
    const debtRatio = income > 0 ? (debtPay / income) * 100 : 0;
    const emergencyMonths = expenses + debtPay > 0 ? num(d.liquid) / (expenses + debtPay) : 0;

    /* score */
    const sSR = Math.max(0, Math.min(1, savingsRate / 20));         // 20% target
    const sDR = debtRatio <= 0 ? 1 : Math.max(0, Math.min(1, (45 - debtRatio) / 45)); // 0 at 45%+
    const sEM = Math.max(0, Math.min(1, emergencyMonths / 6));      // 6 months target
    const yearsTo = Math.max(1, num(d.retireAge) - num(d.age));
    const r = num(d.ret) / 100, infl = num(d.inf) / 100;
    const monthlySave = Math.max(0, surplus);
    /* projection */
    const start = num(d.liquid) + num(d.invested);
    const rows = [];
    let bal = start;
    for (let y = 0; y <= yearsTo; y++) {
      rows.push({ year: y, nominal: Math.round(bal), real: Math.round(bal / Math.pow(1 + infl, y)) });
      const rm = r / 12;
      for (let m = 0; m < 12; m++) bal = bal * (1 + rm) + monthlySave;
    }
    const atRetire = rows[rows.length - 1].nominal;
    const annualExpNow = (expenses + debtPay * 0.4) * 12; /* assume most installments retired by then */
    const neededAtRetire = annualExpNow * Math.pow(1 + infl, yearsTo) * 25; /* 4% rule guideline */
    const readiness = neededAtRetire > 0 ? Math.min(150, (atRetire / neededAtRetire) * 100) : 0;
    const sRT = Math.max(0, Math.min(1, readiness / 100));
    const score = Math.round(sSR * 30 + sDR * 25 + sEM * 25 + sRT * 20);

    /* goals */
    const goalDefs = [
      ["emergency", t.gEmergency], ["house", t.gHouse], ["edu", t.gEdu],
      ["hajj", t.gHajj], ["wedding", t.gWedding], ["car", t.gCar],
    ];
    const goals = goalDefs
      .filter(([k]) => d.goals[k].on)
      .map(([k, label]) => {
        const g = d.goals[k];
        const m = reqMonthly(num(g.target), num(g.years), num(d.ret));
        return { key: k, label, target: num(g.target), years: num(g.years), monthly: m };
      });
    const customGoals = (d.customGoals || [])
      .filter((g) => g.on !== false)
      .map((g) => {
        const yrs = Math.max(0.5, num(g.years) || 1);
        return { key: g.id, label: g.name || "—", target: num(g.target), years: yrs, monthly: reqMonthly(num(g.target), yrs, num(d.ret)) };
      });
    const allGoals = [...goals, ...customGoals];
    const goalsTotal = allGoals.reduce((a, g) => a + g.monthly, 0);

    return { income, expenses, debtPay, surplus, savingsRate, debtRatio, emergencyMonths, score, rows, atRetire, neededAtRetire, readiness, goals: allGoals, goalsTotal, yearsTo };
  }, [d, t]);

  const level = calc.score >= 75 ? t.lvlExcellent : calc.score >= 55 ? t.lvlGood : calc.score >= 35 ? t.lvlFair : t.lvlWeak;

  const adviceList = useMemo(() => {
    const a = [];
    if (calc.surplus < 0) a.push(t.aSurplusNeg);
    if (calc.debtRatio > 33) a.push(t.aDebtHigh);
    if (calc.emergencyMonths < 3) a.push(t.aEmLow);
    if (calc.goalsTotal > Math.max(0, calc.surplus)) a.push(t.aGoalsShort);
    if (calc.readiness < 50) a.push(t.aRetireLow);
    if (a.length === 0) a.push(t.aStrong);
    return a;
  }, [calc, t]);

  /* ---------- render ---------- */
  if (booting) {
    return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, color: C.sub }}>…</div>;
  }
  if (!user) return (
    <>
      <FontLink />
      <Auth t={t} lang={lang} setLang={setLang} onLogin={loginDone} />
    </>
  );

  const subTabs = [["profile", t.tabProfile], ["goals", t.tabGoals], ["results", t.tabResults]];

  return (
    <div dir={t.dir} style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, color: C.ink }}>
      <FontLink />
      {/* header */}
      <header style={{ background: C.pine, color: "#fff" }}>
        <div style={{ width: "100%", maxWidth: "min(1280px, 100%)", margin: "0 auto", padding: "clamp(12px, 2vw, 20px) clamp(16px, 3vw, 40px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "clamp(10px, 2vw, 20px)", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <QiwamLogo size={38} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{t.brand}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{t.welcome}، {user.name}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              style={{ border: "1px solid rgba(255,255,255,.35)", background: "transparent", color: "#fff", borderRadius: 999, padding: "6px 14px", fontFamily: FONT, fontSize: 12.5, cursor: "pointer" }}>
              {t.other}
            </button>
            <button onClick={logout}
              style={{ border: "none", background: "rgba(255,255,255,.12)", color: "#fff", borderRadius: 999, padding: "6px 14px", fontFamily: FONT, fontSize: 12.5, cursor: "pointer" }}>
              {t.logout}
            </button>
          </div>
        </div>
      </header>
      <SaduBand />

      {/* website page navigation */}
      <nav style={{ background: "#fff", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ width: "100%", maxWidth: "min(1280px, 100%)", margin: "0 auto", padding: "0 clamp(16px, 3vw, 40px)", display: "flex", gap: "clamp(4px, 1vw, 8px)", boxSizing: "border-box" }}>
          {[["calculator", t.pageCalc], ["spending", t.pageSpend], ["learn", t.pageLearn]].map(([k, label]) => (
            <button key={k} onClick={() => go(k)}
              style={{
                fontFamily: FONT, fontSize: "clamp(13px, 1.5vw, 15px)", fontWeight: page === k ? 700 : 500, cursor: "pointer",
                padding: "clamp(12px, 1.5vw, 16px) clamp(14px, 2vw, 20px)", border: "none", background: "none",
                color: page === k ? C.pine : C.sub,
                borderBottom: `3px solid ${page === k ? C.gold : "transparent"}`,
              }}>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* calculator page sub-tabs */}
      {page === "calculator" && (
        <div style={{ width: "100%", maxWidth: "min(1280px, 100%)", margin: "clamp(14px, 2vw, 24px) auto 0", padding: "0 clamp(16px, 3vw, 40px)", display: "flex", gap: "clamp(8px, 1.5vw, 16px)", flexWrap: "wrap", alignItems: "center", boxSizing: "border-box" }}>
          {subTabs.map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{
                fontFamily: FONT, fontSize: 13.5, fontWeight: tab === k ? 700 : 500, cursor: "pointer",
                padding: "9px 18px", borderRadius: 999,
                border: `1px solid ${tab === k ? C.oasis : C.line}`,
                background: tab === k ? C.oasis : "#fff", color: tab === k ? "#fff" : C.ink,
              }}>
              {label}
            </button>
          ))}
          <div style={{ marginInlineStart: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            {savedMsg && <span style={{ fontSize: 12.5, color: C.good }}>{t.saved}</span>}
            <button onClick={savePlan}
              style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: "9px 18px", borderRadius: 999, border: "none", background: C.gold, color: C.pine }}>
              {t.save}
            </button>
          </div>
        </div>
      )}

      <main style={{ width: "100%", maxWidth: "min(1280px, 100%)", margin: "clamp(16px, 2vw, 24px) auto 60px", padding: "0 clamp(16px, 3vw, 40px)", boxSizing: "border-box" }}>
        {/* ---------------- PROFILE ---------------- */}
        {page === "calculator" && tab === "profile" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "clamp(12px, 2vw, 24px)" }}>
            <section style={card}>
              <h2 style={h2s}>{t.incomeH}</h2>
              <Field label={t.you} value={d.incYou} onChange={set("incYou")} suffix={t.sar} />
              <Field label={t.spouse} value={d.incSpouse} onChange={set("incSpouse")} suffix={t.sar} />
              <Field label={t.otherInc} value={d.incOther} onChange={set("incOther")} suffix={t.sar} />
              <CustomItems items={d.customIncome || []} t={t} addLabel={t.addIncome}
                onAdd={() => addItem("customIncome", { id: newId(), name: "", amount: 0 })}
                onUpd={(id, f) => updItem("customIncome", id, f)}
                onDel={(id) => delItem("customIncome", id)} />
              <h2 style={{ ...h2s, marginTop: 20 }}>{t.familyH}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: "clamp(6px, 1.5vw, 14px)" }}>
                <Field label={t.age} value={d.age} onChange={set("age")} />
                <Field label={t.retireAge} value={d.retireAge} onChange={set("retireAge")} />
                <Field label={t.children} value={d.children} onChange={set("children")} />
              </div>
            </section>
            <section style={card}>
              <h2 style={h2s}>{t.expH}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "clamp(6px, 1.5vw, 14px)" }}>
                <Field label={t.housing} value={d.housing} onChange={set("housing")} suffix={t.sar} />
                <Field label={t.transport} value={d.transport} onChange={set("transport")} suffix={t.sar} />
                <Field label={t.food} value={d.food} onChange={set("food")} suffix={t.sar} />
                <Field label={t.education} value={d.education} onChange={set("education")} suffix={t.sar} />
                <Field label={t.utilities} value={d.utilities} onChange={set("utilities")} suffix={t.sar} />
                <Field label={t.otherExp} value={d.otherExp} onChange={set("otherExp")} suffix={t.sar} />
              </div>
              <CustomItems items={d.customExpense || []} t={t} addLabel={t.addExpense}
                onAdd={() => addItem("customExpense", { id: newId(), name: "", amount: 0 })}
                onUpd={(id, f) => updItem("customExpense", id, f)}
                onDel={(id) => delItem("customExpense", id)} />
            </section>
            <section style={card}>
              <h2 style={h2s}>{t.debtH}</h2>
              <Field label={t.debtPay} value={d.debtPay} onChange={set("debtPay")} suffix={t.sar} />
              <Field label={t.debtTotal} value={d.debtTotal} onChange={set("debtTotal")} suffix={t.sar} />
              <h2 style={{ ...h2s, marginTop: 20 }}>{t.wealthH}</h2>
              <Field label={t.liquid} value={d.liquid} onChange={set("liquid")} suffix={t.sar} />
              <Field label={t.invested} value={d.invested} onChange={set("invested")} suffix={t.sar} />
              <h2 style={{ ...h2s, marginTop: 20 }}>{t.assumpH}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "clamp(6px, 1.5vw, 14px)" }}>
                <Field label={t.ret} value={d.ret} onChange={set("ret")} />
                <Field label={t.inf} value={d.inf} onChange={set("inf")} />
              </div>
            </section>
          </div>
        )}

        {/* ---------------- DAILY SPEND ---------------- */}
        {page === "spending" && (
          <div style={{ display: "grid", gap: "clamp(12px, 2vw, 24px)" }}>
            {/* hero: remaining balance (Masareef-style) */}
            <section style={{ ...card, background: C.pine, border: "none", color: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "clamp(12px, 2vw, 24px)", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 11.5, opacity: 0.75 }}>{hijriToday}{hijriToday ? " · " : ""}{todayISO()}</div>
                  <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 12 }}>{t.heroLeft}</div>
                  <div style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, lineHeight: 1.15, fontVariantNumeric: "tabular-nums", color: remainingM < 0 ? "#F0A08C" : "#fff" }}>
                    {fmt(remainingM, lang)} <span style={{ fontSize: 16, fontWeight: 500 }}>{t.sar}</span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(6px, 1vw, 16px) clamp(16px, 3vw, 32px)", alignContent: "center" }}>
                  {[[t.heroIncome, fmt(monthIncome, lang) + " " + t.sar], [t.heroSpent, fmt(daily.total, lang) + " " + t.sar],
                    [t.daysToSalary, fmt(daysToSalary, lang)], [t.safeDaily, fmt(safeDaily, lang) + " " + t.sar]].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ fontSize: 11, opacity: 0.7 }}>{l}</div>
                      <div style={{ fontSize: "clamp(14px, 2vw, 18px)", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,.18)", overflow: "hidden", margin: "16px 0 10px" }}>
                <div style={{ width: `${monthIncome > 0 ? Math.min(100, (daily.total / monthIncome) * 100) : 0}%`, height: "100%", background: daily.total > monthIncome ? C.bad : C.gold, borderRadius: 999, transition: "width .3s" }} />
              </div>
              <label style={{ fontSize: 11.5, opacity: 0.8, display: "inline-flex", alignItems: "center", gap: 8 }}>
                {t.salaryDayL}
                <input type="number" min="1" max="31" value={salaryDay}
                  onChange={(e) => persist((p) => ({ ...p, salaryDay: e.target.value }))}
                  style={{ width: 56, padding: "4px 8px", borderRadius: 8, border: "none", fontFamily: FONT, fontSize: 13, textAlign: "center", background: "rgba(255,255,255,.14)", color: "#fff" }} />
              </label>
            </section>

            {/* category tiles — tap to log */}
            <section style={card}>
              <h2 style={{ ...h2s, marginBottom: 4 }}>{t.categoryL}</h2>
              <p style={{ fontSize: 12.5, color: C.sub, margin: "0 0 14px" }}>{t.tapHint}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 140px), 1fr))", gap: "clamp(8px, 1.5vw, 14px)" }}>
                {cats.map((c) => {
                  const spentC = catSpentMap[c.id] || 0;
                  const tgt = num((d.targets || {})[c.id]);
                  const overB = tgt > 0 && spentC > tgt;
                  const active = quickCat === c.id;
                  return (
                    <div key={c.id} style={{ position: "relative" }}>
                      <button
                        onClick={() => { setTxForm((f) => ({ ...f, cat: c.id, date: todayISO() })); setQuickCat(active ? null : c.id); setTxErr(""); }}
                        style={{
                          width: "100%", textAlign: "start", fontFamily: FONT, cursor: "pointer",
                          padding: "12px 12px 10px", borderRadius: 12,
                          border: `1.5px solid ${active ? C.oasis : overB ? C.bad : C.line}`,
                          background: active ? "#EFF6F3" : "#fff",
                        }}>
                        <div style={{ fontSize: 21 }}>{catIcon(c)}</div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, marginTop: 4 }}>{catName(c, t)}</div>
                        <div style={{ fontSize: 12, color: overB ? C.bad : C.sub, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>
                          {fmt(spentC, lang)}{tgt > 0 ? ` ${t.budgetOf} ${fmt(tgt, lang)}` : ""} {t.sar}
                        </div>
                        {tgt > 0 && (
                          <div style={{ height: 4, borderRadius: 999, background: C.line, overflow: "hidden", marginTop: 6 }}>
                            <div style={{ width: `${Math.min(100, (spentC / tgt) * 100)}%`, height: "100%", background: overB ? C.bad : C.oasis }} />
                          </div>
                        )}
                      </button>
                      {c.custom && (
                        <button onClick={() => delCategory(c.id)} title={t.remove}
                          style={{ position: "absolute", top: 6, insetInlineEnd: 6, border: "none", background: "none", color: C.bad, cursor: "pointer", fontSize: 11, padding: 2 }}>✕</button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder={t.newCat}
                  style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: `1px dashed ${C.oasis}`, fontFamily: FONT, fontSize: 13.5, background: "transparent" }} />
                <button onClick={addCategory}
                  style={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, cursor: "pointer", padding: "0 14px", borderRadius: 10, border: "none", background: C.goldSoft, color: C.pine }}>
                  {t.addCat}
                </button>
              </div>

              {/* quick-add panel */}
              {quickCat && (() => {
                const c = cats.find((cc) => cc.id === quickCat);
                if (!c) return null;
                return (
                  <div style={{ marginTop: 14, padding: 16, borderRadius: 12, border: `1.5px solid ${C.oasis}`, background: "#F6FAF8" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.pine }}>{t.quickFor}: {catIcon(c)} {catName(c, t)}</span>
                      <button onClick={() => setQuickCat(null)}
                        style={{ border: "none", background: "none", color: C.sub, cursor: "pointer", fontFamily: FONT, fontSize: 12.5 }}>{t.cancelL} ✕</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0 12px" }}>
                      <Field label={t.amount} value={txForm.amount} onChange={(v) => setTxForm((f) => ({ ...f, amount: v }))} suffix={t.sar} />
                      <label style={{ display: "block", marginBottom: 12 }}>
                        <span style={{ display: "block", fontSize: 12.5, color: C.sub, marginBottom: 5 }}>{t.dateL}</span>
                        <input type="date" value={txForm.date} onChange={(e) => setTxForm((f) => ({ ...f, date: e.target.value }))}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`, fontFamily: FONT, fontSize: 14.5, background: "#fff" }} />
                      </label>
                      <Field label={t.noteL} value={txForm.note} onChange={(v) => setTxForm((f) => ({ ...f, note: v }))} type="text" />
                    </div>
                    {txErr && <div style={{ color: C.bad, fontSize: 13, marginBottom: 8 }}>{txErr}</div>}
                    <button
                      onClick={() => { if (num(txForm.amount) > 0) { addTx(); setQuickCat(null); } else setTxErr(t.errAmount); }}
                      style={{ width: "100%", background: C.oasis, color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontFamily: FONT, fontSize: 14.5, fontWeight: 700, cursor: "pointer" }}>
                      {t.addTx}
                    </button>
                  </div>
                );
              })()}
            </section>

              {/* fixed monthly expenses */}
              <section style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
                  <h2 style={h2s}>{t.fixedH}</h2>
                  <span style={{ fontSize: 12.5, color: C.sub }}>
                    {t.fixedTotal}: <strong style={{ color: C.ink }}>{fmt(fixedTotal, lang)} {t.sar}</strong>
                  </span>
                </div>
                {fixedList.length === 0 && <p style={{ fontSize: 13, color: C.sub }}>{t.noFixed}</p>}
                <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
                  {fixedList.map((f) => {
                    const paid = paidThisMonth(f);
                    const overdue = !paid && isCurrentMonth && todayDay > f.dueDay;
                    const c = cats.find((cc) => cc.id === f.cat);
                    return (
                      <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1px solid ${paid ? C.line : overdue ? C.bad : C.gold}`, background: paid ? "#FAFBFA" : "#fff" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700 }}>{f.name}</div>
                          <div style={{ fontSize: 11.5, color: overdue ? C.bad : C.sub }}>
                            {c ? catName(c, t) : "—"} · {overdue ? t.overdueTag : `${t.dueTag} ${fmt(f.dueDay, lang)}`}
                          </div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{fmt(f.amount, lang)} {t.sar}</div>
                        {paid ? (
                          <span style={{ fontSize: 11.5, color: C.good, fontWeight: 700, whiteSpace: "nowrap" }}>{t.paidTag}</span>
                        ) : (
                          <button onClick={() => markPaid(f)}
                            style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, cursor: "pointer", padding: "6px 10px", borderRadius: 999, border: "none", background: C.oasis, color: "#fff", whiteSpace: "nowrap" }}>
                            {t.markPaid}
                          </button>
                        )}
                        <button onClick={() => delFixed(f.id)} title={t.remove}
                          style={{ border: "none", background: "none", color: C.bad, cursor: "pointer", fontSize: 13, padding: 2 }}>✕</button>
                      </div>
                    );
                  })}
                </div>
                <Field label={t.fixedNameL} value={fxForm.name} onChange={(v) => setFxForm((f) => ({ ...f, name: v }))} type="text" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Field label={t.amount} value={fxForm.amount} onChange={(v) => setFxForm((f) => ({ ...f, amount: v }))} suffix={t.sar} />
                  <Field label={t.dueDayL} value={fxForm.dueDay} onChange={(v) => setFxForm((f) => ({ ...f, dueDay: v }))} />
                </div>
                <span style={{ display: "block", fontSize: 12.5, color: C.sub, marginBottom: 6 }}>{t.categoryL}</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {cats.map((c) => (
                    <button key={c.id} onClick={() => setFxForm((f) => ({ ...f, cat: c.id }))}
                      style={{
                        fontFamily: FONT, fontSize: 12, cursor: "pointer", padding: "5px 11px", borderRadius: 999,
                        border: `1px solid ${fxForm.cat === c.id ? C.gold : C.line}`,
                        background: fxForm.cat === c.id ? C.goldSoft : "#fff", color: C.ink,
                        fontWeight: fxForm.cat === c.id ? 700 : 400,
                      }}>
                      {catName(c, t)}
                    </button>
                  ))}
                </div>
                <button onClick={addFixed}
                  style={{ width: "100%", background: "transparent", color: C.oasis, border: `1.5px dashed ${C.oasis}`, borderRadius: 10, padding: "10px 0", fontFamily: FONT, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
                  + {t.addFixed}
                </button>
              </section>

            {/* day-by-day progress */}
            <section style={card}>
              <h2 style={h2s}>{t.dailyH}</h2>
              <div dir="ltr" style={{ width: "100%", height: 240 }}>
                <ResponsiveContainer>
                  <ComposedChart data={daily.series} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontFamily: FONT, fontSize: 10.5, fill: C.sub }} interval={2} />
                    <YAxis yAxisId="l" tick={{ fontFamily: FONT, fontSize: 10.5, fill: C.sub }} width={46}
                      tickFormatter={(v) => (v >= 1000 ? Math.round(v / 1000) + "K" : v)} />
                    <YAxis yAxisId="r" orientation="right" tick={{ fontFamily: FONT, fontSize: 10.5, fill: C.gold }} width={46}
                      tickFormatter={(v) => (v >= 1000 ? Math.round(v / 1000) + "K" : v)} />
                    <Tooltip formatter={(v, n) => [fmt(v, lang) + " " + t.sar, n]}
                      labelFormatter={(l) => `${t.dayL} ${fmt(l, lang)}`}
                      contentStyle={{ fontFamily: FONT, fontSize: 12, borderRadius: 10, border: `1px solid ${C.line}` }} />
                    <Legend wrapperStyle={{ fontFamily: FONT, fontSize: 12 }} />
                    <Bar yAxisId="l" dataKey="spent" name={t.perDayL} fill={C.oasis} radius={[4, 4, 0, 0]} />
                    <Line yAxisId="r" type="monotone" dataKey="cum" name={t.cumulativeL} stroke={C.gold} strokeWidth={2.5} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* transactions grouped by day */}
            <section style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
                <h2 style={h2s}>{t.monthTx}</h2>
                <span style={{ fontSize: 13, color: C.sub }}>
                  {fmt(monthTx.length, lang)} {t.txCount} · <strong style={{ color: C.ink }}>{fmt(daily.total, lang)} {t.sar}</strong>
                </span>
              </div>
              {monthTx.length === 0 ? (
                <p style={{ fontSize: 13.5, color: C.sub }}>{t.noTx}</p>
              ) : (
                <div style={{ display: "grid", gap: 12, maxHeight: 480, overflowY: "auto" }}>
                  {byDayList.map(([date, items]) => (
                    <div key={date}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.sub, padding: "0 4px 5px", borderBottom: `1px solid ${C.line}`, marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, color: C.pine }}>{date}</span>
                        <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(items.reduce((a, x) => a + num(x.amount), 0), lang)} {t.sar}</span>
                      </div>
                      <div style={{ display: "grid", gap: 5 }}>
                        {items.map((x) => {
                          const c = cats.find((cc) => cc.id === x.cat);
                          return (
                            <div key={x.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "#FAFBFA", border: `1px solid ${C.line}` }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>
                                  {c ? catName(c, t) : "—"}
                                  {x.fixedId && <span style={{ fontSize: 10.5, color: C.gold, fontWeight: 700 }}> · {t.fixedShare}</span>}
                                </div>
                                {x.note && <div style={{ fontSize: 11.5, color: C.sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.note}</div>}
                              </div>
                              <div style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{fmt(x.amount, lang)} {t.sar}</div>
                              <button onClick={() => delTx(x.id)} title={t.remove}
                                style={{ border: "none", background: "none", color: C.bad, cursor: "pointer", fontSize: 13, padding: 3 }}>✕</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ---------------- GOALS ---------------- */}
        {page === "calculator" && tab === "goals" && (
          <section style={card}>
            <h2 style={h2s}>{t.goalsH}</h2>
            <p style={{ fontSize: 13, color: C.sub, marginTop: -6, marginBottom: 18 }}>{t.goalsNote}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "clamp(12px, 2vw, 20px)" }}>
              {[["emergency", t.gEmergency], ["house", t.gHouse], ["edu", t.gEdu], ["hajj", t.gHajj], ["wedding", t.gWedding], ["car", t.gCar]].map(([k, label]) => {
                const g = d.goals[k];
                return (
                  <div key={k} style={{ border: `1px solid ${g.on ? C.oasis : C.line}`, borderRadius: 12, padding: 16, background: g.on ? "#fff" : "#FAFBFA" }}>
                    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, cursor: "pointer" }}>
                      <span style={{ fontWeight: 700, fontSize: 14.5 }}>{label}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.sub }}>
                        {t.enabled}
                        <input type="checkbox" checked={g.on} onChange={(e) => setGoal(k, "on")(e.target.checked)} style={{ width: 17, height: 17, accentColor: C.oasis }} />
                      </span>
                    </label>
                    <div style={{ opacity: g.on ? 1 : 0.45, pointerEvents: g.on ? "auto" : "none" }}>
                      <Field label={t.target} value={g.target} onChange={setGoal(k, "target")} suffix={t.sar} />
                      <Field label={t.years} value={g.years} onChange={setGoal(k, "years")} />
                    </div>
                  </div>
                );
              })}
              {(d.customGoals || []).map((g) => (
                <div key={g.id} style={{ border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: 16, background: "#fff" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                    <div style={{ flex: 1 }}>
                      <Field label={t.customGoalName} value={g.name} onChange={updItem("customGoals", g.id, "name")} type="text" />
                    </div>
                    <button onClick={() => delItem("customGoals", g.id)} aria-label={t.remove} title={t.remove}
                      style={{ width: 34, height: 40, marginTop: 8, borderRadius: 10, border: `1px solid ${C.line}`, background: "#fff", color: C.bad, cursor: "pointer", fontSize: 15, flexShrink: 0 }}>
                      ✕
                    </button>
                  </div>
                  <Field label={t.target} value={g.target} onChange={updItem("customGoals", g.id, "target")} suffix={t.sar} />
                  <Field label={t.years} value={g.years} onChange={updItem("customGoals", g.id, "years")} />
                </div>
              ))}
              <button
                onClick={() => addItem("customGoals", { id: newId(), name: t.customGoalDefault, target: 50000, years: 5, on: true })}
                style={{ minHeight: 160, borderRadius: 12, border: `1.5px dashed ${C.oasis}`, background: "transparent", color: C.oasis, fontFamily: FONT, fontSize: 14.5, fontWeight: 700, cursor: "pointer" }}>
                + {t.addGoal}
              </button>
            </div>
          </section>
        )}

        {/* ---------------- RESULTS ---------------- */}
        {page === "calculator" && tab === "results" && (
          <div style={{ display: "grid", gap: "clamp(12px, 2vw, 24px)" }}>
            {/* score + KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 300px) 1fr", gap: "clamp(12px, 2vw, 20px)", alignItems: "stretch" }}>
              <section style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <h2 style={{ ...h2s, textAlign: "center" }}>{t.scoreH}</h2>
                <Gauge score={calc.score} label={level} sub={t.outOf} />
              </section>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "clamp(8px, 1.5vw, 16px)", alignContent: "start" }}>
                <Stat label={t.kSurplus} value={`${fmt(calc.surplus, lang)} ${t.sar}`} tone={calc.surplus >= 0 ? "good" : "bad"} />
                <Stat label={t.kSavingsRate} value={pct(calc.savingsRate, lang)} note={t.srGuide} tone={calc.savingsRate >= 20 ? "good" : calc.savingsRate >= 10 ? "warn" : "bad"} />
                <Stat label={t.kDebt} value={pct(calc.debtRatio, lang)} note={t.debtGuide} tone={calc.debtRatio <= 33 ? "good" : "bad"} />
                <Stat label={t.kEmergency} value={`${new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", { maximumFractionDigits: 1 }).format(calc.emergencyMonths)} ${t.months}`} note={t.emGuide} tone={calc.emergencyMonths >= 6 ? "good" : calc.emergencyMonths >= 3 ? "warn" : "bad"} />
              </div>
            </div>

            {/* projection */}
            <section style={card}>
              <h2 style={h2s}>{t.projH}</h2>
              <div dir="ltr" style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <AreaChart data={calc.rows} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="nomG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.oasis} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={C.oasis} stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontFamily: FONT, fontSize: 11, fill: C.sub }} tickFormatter={(v) => v + " " + t.yearsAxis} />
                    <YAxis tick={{ fontFamily: FONT, fontSize: 11, fill: C.sub }} tickFormatter={(v) => (v >= 1e6 ? (v / 1e6).toFixed(1) + "M" : v >= 1e3 ? Math.round(v / 1e3) + "K" : v)} width={52} />
                    <Tooltip formatter={(v, n) => [fmt(v, lang) + " " + t.sar, n]} contentStyle={{ fontFamily: FONT, fontSize: 12, borderRadius: 10, border: `1px solid ${C.line}` }} />
                    <Legend wrapperStyle={{ fontFamily: FONT, fontSize: 12 }} />
                    <Area type="monotone" dataKey="nominal" name={t.nominal} stroke={C.oasis} strokeWidth={2.5} fill="url(#nomG)" />
                    <Area type="monotone" dataKey="real" name={t.real} stroke={C.gold} strokeWidth={2} fill="none" strokeDasharray="5 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: "clamp(8px, 1.5vw, 16px)", marginTop: 14 }}>
                <Stat label={t.atRetire} value={`${fmt(calc.atRetire, lang)} ${t.sar}`} />
                <Stat label={t.needed} value={`${fmt(calc.neededAtRetire, lang)} ${t.sar}`} />
                <Stat label={t.readiness} value={pct(calc.readiness, lang)} tone={calc.readiness >= 100 ? "good" : calc.readiness >= 50 ? "warn" : "bad"} />
              </div>
            </section>

            {/* goals table */}
            <section style={card}>
              <h2 style={h2s}>{t.goalTable}</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                  <thead>
                    <tr style={{ color: C.sub, fontSize: 12 }}>
                      {[t.gName, t.target, t.years, t.gMonthly, t.gStatus].map((h) => (
                        <th key={h} style={{ textAlign: "start", padding: "8px 10px", borderBottom: `1px solid ${C.line}`, fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {calc.goals.map((g) => {
                      const share = calc.surplus > 0 ? g.monthly / calc.surplus : 2;
                      const tone = calc.surplus <= 0 || calc.goalsTotal > calc.surplus ? (g.monthly > calc.surplus ? C.bad : C.warn) : share > 0.5 ? C.warn : C.good;
                      const label = tone === C.good ? t.ok : tone === C.warn ? t.tight : t.short;
                      return (
                        <tr key={g.key}>
                          <td style={{ padding: "10px", borderBottom: `1px solid ${C.line}`, fontWeight: 700 }}>{g.label}</td>
                          <td style={{ padding: "10px", borderBottom: `1px solid ${C.line}`, fontVariantNumeric: "tabular-nums" }}>{fmt(g.target, lang)} {t.sar}</td>
                          <td style={{ padding: "10px", borderBottom: `1px solid ${C.line}` }}>{fmt(g.years, lang)}</td>
                          <td style={{ padding: "10px", borderBottom: `1px solid ${C.line}`, fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{fmt(g.monthly, lang)} {t.sar}</td>
                          <td style={{ padding: "10px", borderBottom: `1px solid ${C.line}` }}>
                            <span style={{ background: tone + "1A", color: tone, borderRadius: 999, padding: "3px 10px", fontSize: 12 }}>{label}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 14, fontSize: 13.5 }}>
                <strong>{t.totalRequired}: </strong>
                <span style={{ fontVariantNumeric: "tabular-nums", color: calc.goalsTotal <= Math.max(0, calc.surplus) ? C.good : C.bad, fontWeight: 700 }}>
                  {fmt(calc.goalsTotal, lang)} {t.sar}
                </span>
                <span style={{ color: C.sub }}> — {t.vs} {fmt(Math.max(0, calc.surplus), lang)} {t.sar}</span>
              </div>
            </section>

            {/* advice */}
            <section style={{ ...card, background: C.goldSoft, borderColor: "#E4D6B8" }}>
              <h2 style={{ ...h2s, color: C.pine }}>{t.advice}</h2>
              <ul style={{ margin: 0, paddingInlineStart: 20, display: "grid", gap: 8 }}>
                {adviceList.map((a, i) => (
                  <li key={i} style={{ fontSize: 13.5, lineHeight: 1.7 }}>{a}</li>
                ))}
              </ul>
            </section>

            <p style={{ fontSize: 11.5, color: C.sub, textAlign: "center", margin: "6px 0 0" }}>{t.disclaimer}</p>
          </div>
        )}

        {/* ---------------- MONTHLY REPORT ---------------- */}
        {page === "spending" && (
          <div style={{ display: "grid", gap: "clamp(12px, 2vw, 24px)", marginTop: 16 }}>
            <section style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <h2 style={{ ...h2s, margin: 0 }}>{t.reportH}</h2>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: C.sub }}>
                  {t.monthL}
                  <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
                    style={{ padding: "8px 10px", borderRadius: 10, border: `1px solid ${C.line}`, fontFamily: FONT, fontSize: 14, background: "#FBFCFB" }} />
                </label>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "clamp(8px, 1.5vw, 16px)", margin: "14px 0 18px" }}>
                <Stat label={t.spentTotal} value={`${fmt(report.total, lang)} ${t.sar}`} />
                <Stat label={t.fixedShare} value={`${fmt(daily.fixedSpent, lang)} ${t.sar}`} />
                <Stat label={t.variableShare} value={`${fmt(daily.variable, lang)} ${t.sar}`} />
                <Stat label={t.avgDayL} value={`${fmt(daily.avg, lang)} ${t.sar}`} />
                <Stat label={t.topCatL} value={daily.topName} note={daily.topVal > 0 ? `${fmt(daily.topVal, lang)} ${t.sar}` : undefined} />
                <Stat label={t.targetsTotal} value={`${fmt(report.targetsTotal, lang)} ${t.sar}`}
                  note={report.targetsTotal > 0 ? `${t.vsSpent}: ${pct((report.total / report.targetsTotal) * 100, lang)}` : undefined}
                  tone={report.targetsTotal > 0 ? (report.total <= report.targetsTotal ? "good" : "bad") : undefined} />
              </div>
              {report.rowsR.length === 0 ? (
                <p style={{ fontSize: 13.5, color: C.sub }}>{t.noTx}</p>
              ) : (
                <div style={{ display: "grid", gap: 14 }}>
                  {report.rowsR.map(({ c, spent, target }) => {
                    const share = report.total > 0 ? (spent / report.total) * 100 : 0;
                    const hasT = target > 0;
                    const over = hasT && spent > target;
                    const barColor = over ? C.bad : hasT ? C.oasis : C.gold;
                    const barW = hasT ? Math.min(100, (spent / target) * 100) : share;
                    return (
                      <div key={c.id}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4, gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13.5, fontWeight: 700 }}>
                            {catName(c, t)}
                            <span style={{ fontWeight: 400, color: C.sub, fontSize: 12 }}> · {pct(share, lang)} {lang === "ar" ? "من الإجمالي" : "of total"}</span>
                          </span>
                          <span style={{ fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
                            <strong style={{ color: over ? C.bad : C.ink }}>{fmt(spent, lang)}</strong>
                            {hasT && <span style={{ color: C.sub }}> / {fmt(target, lang)} {t.sar}</span>}
                            {!hasT && <span style={{ color: C.sub }}> {t.sar}</span>}
                          </span>
                        </div>
                        <div style={{ height: 10, borderRadius: 999, background: C.line, overflow: "hidden" }}>
                          <div style={{ width: `${Math.max(2, barW)}%`, height: "100%", borderRadius: 999, background: barColor, transition: "width .3s" }} />
                        </div>
                        <div style={{ fontSize: 11, marginTop: 3, color: over ? C.bad : hasT ? C.good : C.sub }}>
                          {hasT ? (over ? `${t.over} (+${fmt(spent - target, lang)} ${t.sar})` : t.within) : t.noTarget}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section style={card}>
              <h2 style={h2s}>{t.targetsH}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "clamp(6px, 1.5vw, 16px) clamp(10px, 2vw, 24px)" }}>
                {cats.map((c) => (
                  <Field key={c.id} label={catName(c, t)} value={(d.targets || {})[c.id] ?? ""} onChange={setTarget(c.id)} suffix={t.sar} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ---------------- KNOWLEDGE BASE ---------------- */}
        {page === "learn" && (
          <div style={{ display: "grid", gap: "clamp(12px, 2vw, 24px)" }}>
            <section style={{ ...card, background: C.goldSoft, borderColor: "#E4D6B8" }}>
              <h1 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, color: C.pine, margin: "0 0 8px" }}>{t.learnH}</h1>
              <p style={{ fontSize: 13.5, color: C.ink, margin: 0, lineHeight: 1.8, maxWidth: 640 }}>{t.learnSub}</p>
            </section>

            <section style={card}>
              <div style={{ display: "flex", gap: "clamp(8px, 1.5vw, 16px)", flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
                <input value={kbQuery} onChange={(e) => setKbQuery(e.target.value)} placeholder={t.searchPH}
                  style={{ flex: "1 1 220px", padding: "10px 14px", borderRadius: 999, border: `1px solid ${C.line}`, fontFamily: FONT, fontSize: 14, background: "#FBFCFB", outline: "none" }} />
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
          </div>
        )}
      </main>
    </div>
  );
}

/* load IBM Plex Sans Arabic */
function FontLink() {
  useEffect(() => {
    if (document.getElementById("plex-ar")) return;
    const l = document.createElement("link");
    l.id = "plex-ar"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap";
    document.head.appendChild(l);
  }, []);
  return null;
}
