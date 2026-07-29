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
const card = { background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 20 };
const h2s = { fontSize: 14, fontWeight: 700, color: C.pine, margin: "0 0 14px", letterSpacing: 0.2 };

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
      <div style={{ background: C.pine, color: "#fff", padding: "38px 24px 30px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <QiwamLogo size={46} />
          <div style={{ fontSize: 32, fontWeight: 700 }}>{t.brand}</div>
        </div>
        <div style={{ fontSize: 14, opacity: 0.85, marginTop: 8 }}>{t.tagline}</div>
      </div>
      <SaduBand />
      <div style={{ maxWidth: 420, width: "100%", margin: "36px auto", padding: "0 16px" }}>
        <div style={{ ...card, padding: 26 }}>
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
    monthTx.forEach((x) => { byCat[x.cat] = (byCat[x.cat] || 0) + num(x.amount... (54 KB left)
