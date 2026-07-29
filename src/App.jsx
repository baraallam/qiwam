import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  BookOpen,
  CalendarDays,
  CircleDollarSign,
  Goal,
  Home,
  LayoutDashboard,
  Monitor,
  PiggyBank,
  Plus,
  Save,
  Smartphone,
  Target,
  Trash2,
  WalletCards,
} from "lucide-react";
import "./App.css";

const STORAGE_KEY = "qiwam.plan.v2";

const COLORS = {
  pine: "#123c33",
  oasis: "#1f7562",
  gold: "#c79b45",
  coral: "#cf6b53",
  sky: "#4b7f9f",
  ink: "#14201d",
  muted: "#65736f",
  line: "#dde5e1",
  paper: "#ffffff",
  wash: "#f4f7f5",
};

const navItems = [
  { id: "overview", label: "الرئيسية", icon: LayoutDashboard },
  { id: "planner", label: "التخطيط", icon: Target },
  { id: "spending", label: "المصروفات", icon: WalletCards },
  { id: "learn", label: "المعرفة", icon: BookOpen },
];

const categories = [
  { id: "food", name: "مطاعم وقهوة", tone: "#1f7562" },
  { id: "groceries", name: "تموين", tone: "#4b7f9f" },
  { id: "transport", name: "مواصلات", tone: "#c79b45" },
  { id: "bills", name: "فواتير", tone: "#cf6b53" },
  { id: "shopping", name: "تسوق", tone: "#6f5aa7" },
  { id: "health", name: "صحة", tone: "#2f8f79" },
];

const defaultPlan = {
  salaryDay: 27,
  income: 15000,
  spouseIncome: 0,
  otherIncome: 0,
  housing: 3500,
  groceries: 2200,
  transport: 1300,
  bills: 850,
  debt: 1500,
  subscriptions: 320,
  shopping: 900,
  health: 500,
  savings: 26000,
  investments: 18000,
  goals: [
    { id: "emergency", name: "صندوق الطوارئ", target: 60000, saved: 26000, monthly: 2200 },
    { id: "home", name: "دفعة منزل", target: 200000, saved: 35000, monthly: 3000 },
    { id: "education", name: "تعليم الأبناء", target: 120000, saved: 14000, monthly: 1200 },
  ],
  transactions: [
    { id: "t1", date: currentDate(-1), category: "food", amount: 68, note: "قهوة" },
    { id: "t2", date: currentDate(-2), category: "groceries", amount: 420, note: "مشتريات أسبوعية" },
    { id: "t3", date: currentDate(-3), category: "transport", amount: 155, note: "وقود" },
  ],
};

const knowledge = [
  {
    title: "الفائض الشهري",
    type: "أساس",
    body: "هو الفرق بين دخلك ومصاريفك. إذا كان موجبًا، عندك مساحة للادخار والاستثمار. إذا كان سالبًا، ابدأ بتقليل البنود المتكررة قبل الأهداف الكبيرة.",
  },
  {
    title: "صندوق الطوارئ",
    type: "حماية",
    body: "احتفظ بمبلغ يغطي من 3 إلى 6 أشهر من المصاريف. وجوده يقلل الحاجة للديون وقت الظروف المفاجئة.",
  },
  {
    title: "قاعدة 50/30/20",
    type: "توازن",
    body: "فكرة بسيطة: 50% للاحتياجات، 30% للرغبات، و20% للادخار. عدل النسب حسب واقع عائلتك ودخلك.",
  },
  {
    title: "الهدف الذكي",
    type: "ممارسة",
    body: "اجعل الهدف بمبلغ محدد وتاريخ واضح. بدل عبارة أريد ادخارًا أكثر، قل أحتاج 60,000 ريال خلال 18 شهرًا.",
  },
];

function currentDate(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value) {
  return `${new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 0 }).format(Math.round(toNumber(value)))} ر.س`;
}

function formatNumber(value, digits = 0) {
  return new Intl.NumberFormat("ar-SA", { maximumFractionDigits: digits }).format(toNumber(value));
}

function percent(value) {
  return `${formatNumber(value, 1)}%`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function loadPlan() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultPlan;
    const parsed = JSON.parse(saved);
    return {
      ...defaultPlan,
      ...parsed,
      goals: Array.isArray(parsed.goals) ? parsed.goals : defaultPlan.goals,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : defaultPlan.transactions,
    };
  } catch {
    return defaultPlan;
  }
}

function useMediaQuery(query) {
  const read = () => (typeof window === "undefined" ? false : window.matchMedia(query).matches);
  const [matches, setMatches] = useState(read);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

function buildStats(plan) {
  const income = toNumber(plan.income) + toNumber(plan.spouseIncome) + toNumber(plan.otherIncome);
  const fixed = toNumber(plan.housing) + toNumber(plan.bills) + toNumber(plan.debt) + toNumber(plan.subscriptions);
  const budgetedVariable =
    toNumber(plan.groceries) + toNumber(plan.transport) + toNumber(plan.shopping) + toNumber(plan.health);
  const monthKey = currentDate().slice(0, 7);
  const monthTransactions = plan.transactions.filter((item) => item.date?.slice(0, 7) === monthKey);
  const actualVariable = monthTransactions.reduce((sum, item) => sum + toNumber(item.amount), 0);
  const plannedExpenses = fixed + budgetedVariable;
  const actualExpenses = fixed + actualVariable;
  const remaining = income - actualExpenses;
  const plannedSurplus = income - plannedExpenses;
  const savingsRate = income > 0 ? (plannedSurplus / income) * 100 : 0;
  const emergencyMonths = plannedExpenses > 0 ? toNumber(plan.savings) / plannedExpenses : 0;
  const goalsMonthly = plan.goals.reduce((sum, goalItem) => sum + toNumber(goalItem.monthly), 0);
  const goalsTarget = plan.goals.reduce((sum, goalItem) => sum + toNumber(goalItem.target), 0);
  const goalsSaved = plan.goals.reduce((sum, goalItem) => sum + toNumber(goalItem.saved), 0);
  const goalsProgress = goalsTarget > 0 ? (goalsSaved / goalsTarget) * 100 : 0;
  const day = new Date().getDate();
  const salaryDay = clamp(toNumber(plan.salaryDay) || 27, 1, 31);
  const daysToSalary = day <= salaryDay ? salaryDay - day : 31 - day + salaryDay;
  const safeDaily = daysToSalary > 0 ? Math.max(0, remaining / daysToSalary) : Math.max(0, remaining);
  const debtRatio = income > 0 ? (toNumber(plan.debt) / income) * 100 : 0;
  const score = clamp(
    35 +
      (plannedSurplus > 0 ? 18 : -18) +
      clamp(savingsRate, -20, 30) * 0.7 +
      clamp(emergencyMonths, 0, 6) * 4 -
      Math.max(0, debtRatio - 33) * 0.8,
    0,
    100,
  );

  const categorySpend = categories.map((category) => {
    const spent = monthTransactions
      .filter((item) => item.category === category.id)
      .reduce((sum, item) => sum + toNumber(item.amount), 0);
    const budget = toNumber(plan[category.id]) || (category.id === "food" ? toNumber(plan.groceries) : 0);
    return { ...category, spent, budget };
  });

  return {
    actualExpenses,
    actualVariable,
    budgetedVariable,
    categorySpend,
    debtRatio,
    emergencyMonths,
    fixed,
    goalsMonthly,
    goalsProgress,
    income,
    monthTransactions,
    plannedExpenses,
    plannedSurplus,
    remaining,
    safeDaily,
    savingsRate,
    score,
    daysToSalary,
  };
}

export default function App() {
  const [plan, setPlan] = useState(loadPlan);
  const [activeView, setActiveView] = useState("overview");
  const [saved, setSaved] = useState(false);
  const isMobile = useMediaQuery("(max-width: 820px)");
  const stats = useMemo(() => buildStats(plan), [plan]);

  useEffect(() => {
    document.title = "قوام";
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  }, [plan]);

  const updatePlan = (key, value) => {
    setPlan((current) => ({ ...current, [key]: value }));
  };

  const updateGoal = (id, key, value) => {
    setPlan((current) => ({
      ...current,
      goals: current.goals.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    }));
  };

  const addGoal = () => {
    setPlan((current) => ({
      ...current,
      goals: [
        ...current.goals,
        { id: `g-${Date.now()}`, name: "هدف جديد", target: 50000, saved: 0, monthly: 500 },
      ],
    }));
  };

  const removeGoal = (id) => {
    setPlan((current) => ({ ...current, goals: current.goals.filter((item) => item.id !== id) }));
  };

  const addTransaction = (transaction) => {
    setPlan((current) => ({
      ...current,
      transactions: [{ id: `t-${Date.now()}`, ...transaction }, ...current.transactions],
    }));
  };

  const removeTransaction = (id) => {
    setPlan((current) => ({
      ...current,
      transactions: current.transactions.filter((item) => item.id !== id),
    }));
  };

  const saveNow = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  const actions = {
    addGoal,
    addTransaction,
    removeGoal,
    removeTransaction,
    saveNow,
    updateGoal,
    updatePlan,
  };

  return (
    <div className="app-shell" dir="rtl">
      {isMobile ? (
        <MobileExperience
          actions={actions}
          activeView={activeView}
          plan={plan}
          saved={saved}
          setActiveView={setActiveView}
          stats={stats}
        />
      ) : (
        <DesktopExperience
          actions={actions}
          activeView={activeView}
          plan={plan}
          saved={saved}
          setActiveView={setActiveView}
          stats={stats}
        />
      )}
    </div>
  );
}

function DesktopExperience({ actions, activeView, plan, saved, setActiveView, stats }) {
  return (
    <div className="desktop-layout">
      <aside className="desktop-sidebar">
        <BrandBlock />
        <nav className="side-nav" aria-label="التنقل الرئيسي">
          {navItems.map((item) => (
            <NavButton
              active={activeView === item.id}
              item={item}
              key={item.id}
              onClick={() => setActiveView(item.id)}
            />
          ))}
        </nav>
        <div className="sidebar-meter">
          <Monitor size={18} />
          <div>
            <span>تجربة المتصفح</span>
            <strong>{formatMoney(stats.safeDaily)}</strong>
            <small>المتاح اليومي الآمن</small>
          </div>
        </div>
      </aside>

      <main className="desktop-main">
        <HeaderBar actions={actions} saved={saved} stats={stats} subtitle="لوحة مالية واسعة للعائلة" />
        {activeView === "overview" && <DesktopOverview actions={actions} plan={plan} stats={stats} />}
        {activeView === "planner" && <PlannerView actions={actions} plan={plan} stats={stats} />}
        {activeView === "spending" && <SpendingView actions={actions} plan={plan} stats={stats} />}
        {activeView === "learn" && <LearnView />}
      </main>
    </div>
  );
}

function MobileExperience({ actions, activeView, plan, saved, setActiveView, stats }) {
  return (
    <div className="mobile-layout">
      <header className="mobile-header">
        <BrandMark />
        <button className="icon-pill" onClick={actions.saveNow} type="button" aria-label="حفظ">
          <Save size={18} />
        </button>
      </header>

      <main className="mobile-main">
        {activeView === "overview" && <MobileOverview plan={plan} saved={saved} stats={stats} />}
        {activeView === "planner" && <MobilePlanner actions={actions} plan={plan} stats={stats} />}
        {activeView === "spending" && <MobileSpending actions={actions} plan={plan} stats={stats} />}
        {activeView === "learn" && <LearnView compact />}
      </main>

      <nav className="bottom-nav" aria-label="تنقل الجوال">
        {navItems.map((item) => (
          <NavButton
            active={activeView === item.id}
            compact
            item={item}
            key={item.id}
            onClick={() => setActiveView(item.id)}
          />
        ))}
      </nav>
    </div>
  );
}

function HeaderBar({ actions, saved, stats, subtitle }) {
  return (
    <header className="header-bar">
      <div>
        <p className="eyebrow">{subtitle}</p>
        <h1>قوام المال للعائلة</h1>
      </div>
      <div className="header-actions">
        <div className="header-stat">
          <CalendarDays size={17} />
          <span>{formatNumber(stats.daysToSalary)} يوم للراتب</span>
        </div>
        <button className="primary-button" onClick={actions.saveNow} type="button">
          <Save size={17} />
          {saved ? "تم الحفظ" : "حفظ الخطة"}
        </button>
      </div>
    </header>
  );
}

function DesktopOverview({ actions, plan, stats }) {
  return (
    <div className="view-stack">
      <KpiGrid stats={stats} />
      <div className="dashboard-grid">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">المتبقي من الدخل</p>
            <strong>{formatMoney(stats.remaining)}</strong>
            <span>
              الدخل {formatMoney(stats.income)} والمصروف الفعلي حتى الآن {formatMoney(stats.actualExpenses)}
            </span>
          </div>
          <HealthRing score={stats.score} />
        </section>
        <section className="panel">
          <SectionTitle icon={PiggyBank} title="صحة الخطة" />
          <MetricRows stats={stats} />
        </section>
      </div>
      <div className="dashboard-grid wide-left">
        <section className="panel">
          <SectionTitle icon={CircleDollarSign} title="تدفق الشهر" />
          <CashFlowChart stats={stats} />
        </section>
        <section className="panel">
          <SectionTitle icon={Goal} title="الأهداف" />
          <GoalsSummary actions={actions} plan={plan} stats={stats} />
        </section>
      </div>
    </div>
  );
}

function PlannerView({ actions, plan, stats }) {
  return (
    <div className="view-stack">
      <KpiGrid stats={stats} />
      <div className="editor-grid">
        <BudgetEditor actions={actions} plan={plan} />
        <GoalEditor actions={actions} plan={plan} />
      </div>
    </div>
  );
}

function SpendingView({ actions, plan, stats }) {
  return (
    <div className="view-stack">
      <div className="dashboard-grid wide-right">
        <SpendLogger actions={actions} />
        <section className="panel">
          <SectionTitle icon={WalletCards} title="توزيع مصروفات الشهر" />
          <CategoryBreakdown stats={stats} />
        </section>
      </div>
      <TransactionsList actions={actions} plan={plan} stats={stats} />
    </div>
  );
}

function MobileOverview({ plan, saved, stats }) {
  return (
    <div className="mobile-stack">
      <section className="mobile-balance-card">
        <div>
          <p>المتبقي هذا الشهر</p>
          <strong>{formatMoney(stats.remaining)}</strong>
          <span>{formatMoney(stats.safeDaily)} متاح يوميًا</span>
        </div>
        <HealthRing score={stats.score} compact />
      </section>
      {saved && <div className="toast-inline">تم حفظ الخطة</div>}
      <div className="mobile-kpis">
        <MiniStat label="الدخل" value={formatMoney(stats.income)} />
        <MiniStat label="المصروف" value={formatMoney(stats.actualExpenses)} />
        <MiniStat label="الادخار" value={percent(stats.savingsRate)} />
      </div>
      <section className="panel mobile-panel">
        <SectionTitle icon={Goal} title="تقدم الأهداف" />
        <GoalsSummary plan={plan} stats={stats} />
      </section>
      <section className="panel mobile-panel">
        <SectionTitle icon={WalletCards} title="أكثر البنود صرفًا" />
        <CategoryBreakdown compact stats={stats} />
      </section>
    </div>
  );
}

function MobilePlanner({ actions, plan, stats }) {
  return (
    <div className="mobile-stack">
      <section className="mobile-balance-card quiet">
        <div>
          <p>الفائض المخطط</p>
          <strong>{formatMoney(stats.plannedSurplus)}</strong>
          <span>الأهداف الشهرية {formatMoney(stats.goalsMonthly)}</span>
        </div>
      </section>
      <BudgetEditor actions={actions} mobile plan={plan} />
      <GoalEditor actions={actions} mobile plan={plan} />
    </div>
  );
}

function MobileSpending({ actions, plan, stats }) {
  return (
    <div className="mobile-stack">
      <SpendLogger actions={actions} mobile />
      <section className="panel mobile-panel">
        <SectionTitle icon={WalletCards} title="حسب الفئة" />
        <CategoryBreakdown compact stats={stats} />
      </section>
      <TransactionsList actions={actions} compact plan={plan} stats={stats} />
    </div>
  );
}

function BrandBlock() {
  return (
    <div className="brand-block">
      <BrandMark />
      <p>المال باعتدال، والمستقبل باستقلال.</p>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-label="قوام">
      <span>ق</span>
      <strong>قوام</strong>
    </div>
  );
}

function NavButton({ active, compact = false, item, onClick }) {
  const Icon = item.icon;
  return (
    <button
      className={`${compact ? "bottom-nav-item" : "side-nav-item"} ${active ? "is-active" : ""}`}
      onClick={onClick}
      type="button"
    >
      <Icon size={compact ? 19 : 18} />
      <span>{item.label}</span>
    </button>
  );
}

function KpiGrid({ stats }) {
  return (
    <div className="kpi-grid">
      <KpiCard icon={Banknote} label="دخل الشهر" tone="green" value={formatMoney(stats.income)} />
      <KpiCard icon={WalletCards} label="المصروف الفعلي" tone="coral" value={formatMoney(stats.actualExpenses)} />
      <KpiCard icon={PiggyBank} label="معدل الادخار" tone="gold" value={percent(stats.savingsRate)} />
      <KpiCard icon={Target} label="جاهزية الطوارئ" tone="sky" value={`${formatNumber(stats.emergencyMonths, 1)} شهر`} />
    </div>
  );
}

function KpiCard({ icon: Icon, label, tone, value }) {
  return (
    <article className={`kpi-card tone-${tone}`}>
      <div className="kpi-icon">
        <Icon size={19} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="mini-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function HealthRing({ compact = false, score }) {
  const radius = compact ? 34 : 48;
  const stroke = compact ? 8 : 10;
  const size = compact ? 88 : 126;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamp(score, 0, 100) / 100) * circumference;

  return (
    <div className={`health-ring ${compact ? "is-compact" : ""}`}>
      <svg height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
        <circle cx={center} cy={center} fill="none" r={radius} stroke="rgba(255,255,255,.28)" strokeWidth={stroke} />
        <circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={stroke}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div>
        <strong>{formatNumber(score)}</strong>
        <span>درجة الخطة</span>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="section-title">
      <Icon size={18} />
      <h2>{title}</h2>
    </div>
  );
}

function MetricRows({ stats }) {
  const rows = [
    { label: "الفائض المخطط", value: formatMoney(stats.plannedSurplus), color: stats.plannedSurplus >= 0 ? COLORS.oasis : COLORS.coral },
    { label: "الأهداف الشهرية", value: formatMoney(stats.goalsMonthly), color: COLORS.gold },
    { label: "نسبة الالتزامات", value: percent(stats.debtRatio), color: stats.debtRatio <= 33 ? COLORS.oasis : COLORS.coral },
    { label: "صندوق الطوارئ", value: `${formatNumber(stats.emergencyMonths, 1)} شهر`, color: COLORS.sky },
  ];

  return (
    <div className="metric-rows">
      {rows.map((row) => (
        <div className="metric-row" key={row.label}>
          <span>{row.label}</span>
          <strong style={{ color: row.color }}>{row.value}</strong>
        </div>
      ))}
    </div>
  );
}

function CashFlowChart({ stats }) {
  const max = Math.max(stats.income, stats.fixed, stats.actualVariable, Math.abs(stats.plannedSurplus), 1);
  const bars = [
    { label: "الدخل", value: stats.income, color: COLORS.oasis },
    { label: "الثابت", value: stats.fixed, color: COLORS.sky },
    { label: "المتغير", value: stats.actualVariable, color: COLORS.gold },
    { label: "الفائض", value: Math.max(0, stats.plannedSurplus), color: stats.plannedSurplus >= 0 ? COLORS.pine : COLORS.coral },
  ];

  return (
    <div className="cash-chart">
      {bars.map((bar) => (
        <div className="cash-bar" key={bar.label}>
          <div className="cash-bar-label">
            <span>{bar.label}</span>
            <strong>{formatMoney(bar.value)}</strong>
          </div>
          <div className="cash-track">
            <span style={{ background: bar.color, width: `${clamp((bar.value / max) * 100, 3, 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function GoalsSummary({ actions, plan, stats }) {
  const topGoals = [...plan.goals].sort((a, b) => toNumber(b.target) - toNumber(a.target)).slice(0, 3);

  return (
    <div className="goal-summary">
      <div className="goal-total">
        <span>تقدم إجمالي</span>
        <strong>{percent(stats.goalsProgress)}</strong>
      </div>
      {topGoals.map((goalItem) => {
        const progress = toNumber(goalItem.target) > 0 ? (toNumber(goalItem.saved) / toNumber(goalItem.target)) * 100 : 0;
        return (
          <div className="goal-row" key={goalItem.id}>
            <div>
              <strong>{goalItem.name}</strong>
              <span>{formatMoney(goalItem.saved)} من {formatMoney(goalItem.target)}</span>
            </div>
            <div className="goal-progress">
              <span style={{ width: `${clamp(progress, 2, 100)}%` }} />
            </div>
          </div>
        );
      })}
      {actions?.addGoal && (
        <button className="soft-button" onClick={actions.addGoal} type="button">
          <Plus size={16} />
          إضافة هدف
        </button>
      )}
    </div>
  );
}

function BudgetEditor({ actions, mobile = false, plan }) {
  return (
    <section className={`panel ${mobile ? "mobile-panel" : ""}`}>
      <SectionTitle icon={Home} title="بيانات الميزانية" />
      <div className="form-columns">
        <div>
          <h3>الدخل الشهري</h3>
          <MoneyField label="دخلك" onChange={(value) => actions.updatePlan("income", value)} value={plan.income} />
          <MoneyField label="دخل الزوج/الزوجة" onChange={(value) => actions.updatePlan("spouseIncome", value)} value={plan.spouseIncome} />
          <MoneyField label="دخل آخر" onChange={(value) => actions.updatePlan("otherIncome", value)} value={plan.otherIncome} />
          <NumberField label="يوم الراتب" max={31} min={1} onChange={(value) => actions.updatePlan("salaryDay", value)} value={plan.salaryDay} />
        </div>
        <div>
          <h3>المصاريف الثابتة</h3>
          <MoneyField label="السكن" onChange={(value) => actions.updatePlan("housing", value)} value={plan.housing} />
          <MoneyField label="الفواتير" onChange={(value) => actions.updatePlan("bills", value)} value={plan.bills} />
          <MoneyField label="الأقساط" onChange={(value) => actions.updatePlan("debt", value)} value={plan.debt} />
          <MoneyField label="الاشتراكات" onChange={(value) => actions.updatePlan("subscriptions", value)} value={plan.subscriptions} />
        </div>
        <div>
          <h3>المصاريف المتغيرة</h3>
          <MoneyField label="التموين" onChange={(value) => actions.updatePlan("groceries", value)} value={plan.groceries} />
          <MoneyField label="المواصلات" onChange={(value) => actions.updatePlan("transport", value)} value={plan.transport} />
          <MoneyField label="التسوق" onChange={(value) => actions.updatePlan("shopping", value)} value={plan.shopping} />
          <MoneyField label="الصحة" onChange={(value) => actions.updatePlan("health", value)} value={plan.health} />
        </div>
        <div>
          <h3>الأصول</h3>
          <MoneyField label="مدخرات سائلة" onChange={(value) => actions.updatePlan("savings", value)} value={plan.savings} />
          <MoneyField label="استثمارات حالية" onChange={(value) => actions.updatePlan("investments", value)} value={plan.investments} />
        </div>
      </div>
    </section>
  );
}

function GoalEditor({ actions, mobile = false, plan }) {
  return (
    <section className={`panel ${mobile ? "mobile-panel" : ""}`}>
      <div className="section-title with-action">
        <div>
          <Goal size={18} />
          <h2>الأهداف طويلة المدى</h2>
        </div>
        <button className="icon-button" onClick={actions.addGoal} type="button" aria-label="إضافة هدف">
          <Plus size={17} />
        </button>
      </div>
      <div className="goals-editor">
        {plan.goals.map((goalItem) => (
          <article className="goal-editor-card" key={goalItem.id}>
            <div className="goal-card-head">
              <input
                aria-label="اسم الهدف"
                onChange={(event) => actions.updateGoal(goalItem.id, "name", event.target.value)}
                type="text"
                value={goalItem.name}
              />
              <button
                className="danger-icon"
                onClick={() => actions.removeGoal(goalItem.id)}
                type="button"
                aria-label="حذف الهدف"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="goal-card-grid">
              <MoneyField compact label="المستهدف" onChange={(value) => actions.updateGoal(goalItem.id, "target", value)} value={goalItem.target} />
              <MoneyField compact label="المدخر" onChange={(value) => actions.updateGoal(goalItem.id, "saved", value)} value={goalItem.saved} />
              <MoneyField compact label="شهريًا" onChange={(value) => actions.updateGoal(goalItem.id, "monthly", value)} value={goalItem.monthly} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SpendLogger({ actions, mobile = false }) {
  const [form, setForm] = useState({
    amount: "",
    category: "food",
    date: currentDate(),
    note: "",
  });

  const submit = (event) => {
    event.preventDefault();
    if (toNumber(form.amount) <= 0) return;
    actions.addTransaction({ ...form, amount: toNumber(form.amount) });
    setForm((current) => ({ ...current, amount: "", note: "" }));
  };

  return (
    <section className={`panel spend-logger ${mobile ? "mobile-panel" : ""}`}>
      <SectionTitle icon={CircleDollarSign} title="تسجيل مصروف" />
      <form onSubmit={submit}>
        <MoneyField label="المبلغ" onChange={(value) => setForm((current) => ({ ...current, amount: value }))} value={form.amount} />
        <label className="field">
          <span>الفئة</span>
          <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>التاريخ</span>
          <input value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} type="date" />
        </label>
        <label className="field">
          <span>ملاحظة</span>
          <input value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} type="text" />
        </label>
        <button className="primary-button full" type="submit">
          <Plus size={17} />
          إضافة المصروف
        </button>
      </form>
    </section>
  );
}

function CategoryBreakdown({ compact = false, stats }) {
  const max = Math.max(...stats.categorySpend.map((item) => item.spent), 1);
  const rows = stats.categorySpend
    .filter((item) => !compact || item.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  return (
    <div className="category-list">
      {rows.length === 0 && <p className="empty-text">لا توجد مصروفات لهذا الشهر بعد.</p>}
      {rows.map((item) => (
        <div className="category-row" key={item.id}>
          <div className="category-row-head">
            <strong>{item.name}</strong>
            <span>{formatMoney(item.spent)}</span>
          </div>
          <div className="category-track">
            <span style={{ background: item.tone, width: `${clamp((item.spent / max) * 100, 4, 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TransactionsList({ actions, compact = false, plan, stats }) {
  const rows = compact ? stats.monthTransactions.slice(0, 8) : stats.monthTransactions;

  return (
    <section className={`panel ${compact ? "mobile-panel" : ""}`}>
      <SectionTitle icon={WalletCards} title="مصروفات هذا الشهر" />
      {rows.length === 0 ? (
        <p className="empty-text">لا توجد مصروفات مسجلة.</p>
      ) : (
        <div className="transactions-list">
          {rows.map((item) => {
            const category = categories.find((entry) => entry.id === item.category);
            return (
              <div className="transaction-row" key={item.id}>
                <div>
                  <strong>{category?.name || "أخرى"}</strong>
                  <span>{item.note || item.date}</span>
                </div>
                <b>{formatMoney(item.amount)}</b>
                <button
                  className="danger-icon"
                  onClick={() => actions.removeTransaction(item.id)}
                  type="button"
                  aria-label="حذف المصروف"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {!compact && plan.transactions.length > rows.length && <p className="empty-text">يعرض الشهر الحالي فقط.</p>}
    </section>
  );
}

function LearnView({ compact = false }) {
  return (
    <div className={compact ? "mobile-stack" : "view-stack"}>
      <section className={`panel learn-intro ${compact ? "mobile-panel" : ""}`}>
        <SectionTitle icon={BookOpen} title="المعرفة المالية" />
        <p>مفاهيم قصيرة تساعدك تقرأ وضعك المالي وتاخذ قرار أوضح مع كل راتب.</p>
      </section>
      <section className={`knowledge-grid ${compact ? "is-compact" : ""}`}>
        {knowledge.map((item) => (
          <article className="knowledge-card" key={item.title}>
            <span>{item.type}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

function MoneyField({ compact = false, label, onChange, value }) {
  return (
    <label className={`field ${compact ? "is-compact" : ""}`}>
      <span>{label}</span>
      <div className="money-input">
        <input
          inputMode="decimal"
          min="0"
          onChange={(event) => onChange(event.target.value)}
          type="number"
          value={value}
        />
        <small>ر.س</small>
      </div>
    </label>
  );
}

function NumberField({ label, max, min, onChange, value }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input max={max} min={min} onChange={(event) => onChange(event.target.value)} type="number" value={value} />
    </label>
  );
}
