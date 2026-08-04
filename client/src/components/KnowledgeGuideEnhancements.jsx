import React, { useState } from "react";
import { C, FONT, card, h2s } from "../theme/tokens";
import { QiwamLogo } from "./ui";

const control = { borderRadius: 999, padding: "7px 13px", fontFamily: FONT, fontSize: 12, cursor: "pointer" };

const START_GUIDE_COPY = {
  ar: { lead: "ابدأ بإنشاء حسابك، ثم احتفظ ببيانات الدخول في مكان آمن.", omittedItem: 2 },
  en: { lead: "Create your account, then keep your sign-in details in a safe place.", omittedItem: null },
};

export function KnowledgeExperience({ entries, query, setQuery, filter, setFilter, open, setOpen, t, lang }) {
  const [offlineShown, setOfflineShown] = useState(false);
  return <div className="qiwam-knowledge-experience">
    <section className="qiwam-knowledge-intro" style={card}><h1>{t.learnH}</h1><p>{t.learnSub}</p></section>
    <section className="qiwam-knowledge-library" style={card}>
      <div className="qiwam-knowledge-controls">
        <input value={query} onChange={(event) => { setQuery(event.target.value); setOfflineShown(false); }} placeholder={t.searchPH} />
        <div className="qiwam-knowledge-filters">{[["all", t.filterAll], ["def", t.filterDefs], ["practice", t.filterPractices]].map(([key, label]) => <button key={key} onClick={() => setFilter(key)} className={filter === key ? "is-active" : ""}>{label}</button>)}</div>
        <button onClick={() => setOfflineShown(true)} disabled={!query.trim()} className="qiwam-knowledge-ask">✨ {t.askQiwam}</button>
      </div>
      {offlineShown && <div className="qiwam-knowledge-offline" role="status"><span>✨</span><p>{t.aiOff}</p><button onClick={() => setOfflineShown(false)} aria-label={t.cancelL}>×</button></div>}
      {entries.length === 0 ? <div className="qiwam-knowledge-empty"><strong>{t.noResults}</strong><span>{t.noResultsBody}</span></div> : <div className="qiwam-knowledge-grid">{entries.map((entry) => {
        const expanded = open === entry.id;
        const content = entry[lang];
        return <button key={entry.id} onClick={() => setOpen(expanded ? null : entry.id)} className={`qiwam-knowledge-card ${expanded ? "is-open" : ""}`} aria-expanded={expanded}>
          <span className="qiwam-knowledge-card-top"><span className="qiwam-knowledge-icon">{entry.icon}</span><span><strong>{content.term}</strong><small>{entry.kind === "def" ? t.defTag : t.practiceTag}</small></span><i aria-hidden="true">›</i></span>
          {expanded && <span className="qiwam-knowledge-body">{content.body}</span>}
        </button>;
      })}</div>}
      <p className="qiwam-knowledge-disclaimer">{t.disclaimer}</p>
    </section>
  </div>;
}

const CHAPTERS = [
  {
    id: "start", icon: "🔑", action: null,
    ar: { title: "البداية وتسجيل الدخول", lead: "ابدأ بإنشاء حسابك ثم احتفظ ببيانات الدخول والنسخة الاحتياطية في مكان آمن.", items: [["اسم المستخدم وكلمة المرور", "أدخل بيانات الدخول المطلوبة وأنشئ كلمة مرور قوية. تستخدم هذه البيانات للوصول إلى خطتك المحفوظة."], ["تبديل اللغة", "يمكنك التبديل بين العربية والإنجليزية من القائمة في أي وقت؛ يتغير اتجاه الواجهة مع اللغة."], ["النسخة الاحتياطية", "استخدم خيار النسخة الاحتياطية من القائمة للاحتفاظ بنسخة من بيانات خطتك."], ["تسجيل الخروج", "استخدم تسجيل الخروج عند الانتهاء، ثم سجّل الدخول مرة أخرى للوصول إلى بياناتك المحفوظة."]] },
    en: { title: "Getting started & sign-in", lead: "Create your account, then keep your sign-in details in a safe place.", items: [["Account and password", "Enter the required sign-in details and choose a strong password. These details give you access to your saved plan."], ["Language switch", "Switch between Arabic and English from the menu at any time; the interface direction changes with the language."], ["Sign out", "Use Sign out when you finish, then sign in again to access your saved data."]] },
  },
  {
    id: "family", icon: "👪", action: "family",
    ar: { title: "صفحة العائلة", lead: "أضف أفراد الأسرة حتى تعكس الخطة واقع عائلتك وتعليم الأبناء والإعالة.", items: [["بياناتك", "أضف الاسم وسنة الميلاد؛ يعرض قِوام العمر الحالي من سنة الميلاد."], ["الزوج أو الزوجة", "أضف شريك الحياة عند الحاجة. يسمح النظام بسجل واحد فقط لكل من أنت والزوج أو الزوجة."], ["الأبناء", "أضف اسم كل طفل وسنة ميلاده ومرحلة التعليم ونوعه وتكلفة التعليم السنوية عند الحاجة."], ["من تعولهم", "أضف من تدعمهم وسجل مبلغ الإعالة الشهري ليظهر في الخطة والتقارير."], ["التعديل والحذف", "يمكن تعديل البيانات أو حذفها من بطاقة العضو، مع بقاء السجلات القديمة متوافقة."]] },
    en: { title: "Family page", lead: "Add household members so the plan reflects your family, children’s education, and dependants.", items: [["Your details", "Add a name and birth year; Qiwam displays the current age from the birth year."], ["Spouse", "Add a spouse when applicable. The app permits only one Self and one Spouse record."], ["Children", "Add each child’s name, birth year, education stage and type, plus an annual education cost when needed."], ["Dependants", "Add people you support and record their monthly support so it appears in the plan and reports."], ["Edit and remove", "Edit data or remove it from the member card while preserving compatibility with older records."]] },
  },
  {
    id: "calc", icon: "🧮", action: "calculator",
    ar: { title: "حاسبة التخطيط", lead: "تجمع الحاسبة الدخل والالتزامات والمدخرات والأهداف لعرض مؤشرات الخطة ونتائجها.", items: [["الملف المالي", "أدخل الدخل الشهري والالتزامات والمدخرات والاستثمارات وافتراضات النمو."], ["العائلة والمصروفات", "انتقل إلى العائلة والمصروفات لتحديث البيانات المرتبطة؛ تظهر نتائجها ضمن الخطة الحالية."], ["الأهداف", "فعّل الهدف، وأدخل المبلغ والمدة والمدخر له. يحسب قِوام المبلغ الشهري المطلوب من المتبقي."], ["النتائج", "راجع الدرجة المالية ومسار الثروة حتى التقاعد وتوزيع الفائض وخطة الأهداف."], ["الديون بعد التقاعد", "اختر ما إذا كانت الأقساط تستمر أو تنتهي؛ تنعكس النتائج المرتبطة على التقاعد فوراً."]] },
    en: { title: "Planning Calculator", lead: "The calculator combines income, commitments, savings, and goals to show plan indicators and results.", items: [["Financial profile", "Enter monthly income, obligations, savings, investments, and growth assumptions."], ["Family and spending", "Open Family and Spending to update the connected data; their results appear in the current plan."], ["Goals", "Enable a goal and enter its amount, horizon, and saved amount. Qiwam calculates the required monthly amount from the remaining gap."], ["Results", "Review the financial score, wealth path to retirement, surplus allocation, and goal plan."], ["Debt after retirement", "Choose whether installments continue or end; the related retirement results update immediately."]] },
  },
  {
    id: "spend", icon: "💳", action: "spending",
    ar: { title: "تسجيل المصروفات", lead: "سجل المصروفات الفعلية والتزاماتك الثابتة لتعرف المتبقي من الدخل ومعدل الصرف الآمن.", items: [["المتبقي من الدخل", "تعرض البطاقة دخل الشهر والمصروف المسجل والمتبقي ومعدل الصرف الآمن."], ["الفئات", "اختر فئة سريعة ثم أدخل المبلغ والتاريخ والملاحظة لإضافة عملية حقيقية."], ["الأهداف المحجوزة", "استخدم خيار حجز مبالغ الأهداف لإظهار الالتزامات المخططة ضمن المتابعة."], ["المصروفات الثابتة", "أضف بنداً ثابتاً أو قالباً شائعاً وحدد الفئة والمبلغ ويوم الاستحقاق، ثم سجله كمدفوع."], ["المخططات والأهداف", "راجع تقدم اليوم وتوزيع مصروفات الشهر وأهداف الفئات للشهر المحدد."]] },
    en: { title: "Spending Tracker", lead: "Record actual spending and fixed commitments to see income remaining and the safe daily amount.", items: [["Income remaining", "The hero card shows monthly income, recorded spending, the amount remaining, and a safe daily amount."], ["Categories", "Choose a quick category, then enter the amount, date, and note to add a real transaction."], ["Reserved goals", "Use the goal-reservation option to include planned goal commitments in the follow-up."], ["Fixed expenses", "Add a fixed item or a common template, select its category, amount, and due day, then mark it paid."], ["Charts and targets", "Review daily progress, the selected month’s distribution, and category targets."]] },
  },
  {
    id: "reports", icon: "📊", action: "reports",
    ar: { title: "التقارير", lead: "ستة تقارير مبنية على بيانات الخطة والمصروفات والعائلة، ويمكن تصديرها أو طباعتها.", items: [["المصروفات الشهرية", "يعرض مجموعات الفئات والمصروف الفعلي وأهداف الفئات للشهر المحدد."], ["الأهداف", "يعرض الهدف والمدخر والمتبقي والمبلغ الشهري المطلوب ونسبة الإنجاز."], ["الاتجاهات", "يعرض مقارنة المصروفات الحقيقية عبر نطاق ٣ أو ٦ أو ١٢ شهراً عند توفر تاريخ كافٍ."], ["العائلة والتعليم", "يعرض أفراد العائلة والعلاقة وسنة الميلاد وتكلفة التعليم أو الإعالة."], ["الثروة والتقاعد والزكاة", "يعرض مسار الثروة ومؤشرات التقاعد وملخص الأموال الخاضعة للزكاة."], ["CSV وPDF", "استخدم تصدير CSV أو PDF / طباعة من داخل التقرير المحدد."]] },
    en: { title: "Reports", lead: "Six reports built from plan, spending, and family data, with export and print options.", items: [["Monthly spending", "Shows category totals, actual spending, and category targets for the selected month."], ["Goals", "Shows each goal’s target, saved amount, remaining amount, required monthly saving, and progress."], ["Trends", "Shows real spending across 3, 6, or 12 months when sufficient history exists."], ["Family and education", "Shows family members, relation, birth year, and education cost or support."], ["Wealth, retirement, and Zakat", "Shows the wealth path, retirement indicators, and a zakatable-wealth summary."], ["CSV and PDF", "Use Export CSV or Print / PDF inside the selected report."]] },
  },
  {
    id: "learn", icon: "📚", action: "learn",
    ar: { title: "المعرفة المالية", lead: "مكتبة مختصرة للمفاهيم والممارسات المالية المفيدة للعائلة.", items: [["البحث", "ابحث عن مصطلح أو ممارسة، ثم استخدم الفلاتر بين التعريفات والممارسات."], ["فتح المقال", "اضغط بطاقة المقال لقراءة الشرح الكامل، واضغطها مرة أخرى لإغلاقه."], ["اسأل قِوام", "هذا تفاعل واجهة صادق: عند عدم توفر اتصال ذكي يوضح أن الإجابات غير متصلة ويقترح استخدام المكتبة."], ["الخصوصية", "لا يرسل هذا التفاعل بيانات الراتب أو الأرصدة ولا يقدم إجابة أو توصية مالية مخترعة."]] },
    en: { title: "Financial Knowledge", lead: "A compact library of financial concepts and practices for the family.", items: [["Search", "Search for a term or practice, then filter between definitions and practices."], ["Open an article", "Select an article card to read its full explanation, then select it again to close it."], ["Ask Qiwam", "This is an honest interface interaction: when no smart connection is available it explains that answers are offline and suggests the library."], ["Privacy", "This interaction sends no salary or balance data and does not invent an answer or financial recommendation."]] },
  },
  {
    id: "review", icon: "🔎", action: null,
    ar: { title: "المراجعة الشاملة والأسئلة الشائعة", lead: "راجع الخطة دورياً واستخدم لغة الألوان لمعرفة ما يحتاج إلى قرار.", items: [["مراجعة شهرية", "راجع المصروفات والفئات والأهداف بعد اكتمال الشهر، ثم عدل خطة الشهر التالي عند الحاجة."], ["مراجعة سنوية", "راجع المدخرات والاستثمارات والأهداف والزكاة وتكاليف التعليم والالتزامات الثابتة مرة كل سنة."], ["الأخضر", "يشير إلى وضع ضمن الهدف أو نطاق صحي."], ["الذهبي", "يشير إلى بند يحتاج الانتباه أو رقماً مخصصاً أو هدفاً يحتاج متابعة."], ["الأحمر", "يشير إلى تجاوز أو تأخر يحتاج قراراً الآن."], ["هل هذه استشارة مالية؟", "لا. قِوام أداة تعليمية للتخطيط، والنتائج تقديرية بحسب بياناتك وافتراضاتك."]] },
    en: { title: "Comprehensive review & common questions", lead: "Review the plan regularly and use the colour language to see what needs a decision.", items: [["Monthly review", "Review spending, categories, and goals after the month closes, then adjust the next month’s plan when needed."], ["Annual review", "Review savings, investments, goals, Zakat, education costs, and fixed commitments once a year."], ["Green", "Indicates a result within its target or healthy range."], ["Gold", "Indicates an item needing attention, a custom figure, or a target requiring follow-up."], ["Red", "Indicates an overage or delay that needs a decision now."], ["Is this financial advice?", "No. Qiwam is an educational planning tool and results are estimates based on your data and assumptions."]] },
  },
];

export function GuideExperience({ t, lang, go }) {
  const [open, setOpen] = useState(["start"]);
  const all = CHAPTERS.map((chapter) => chapter.id);
  const toggle = (id) => setOpen((previous) => previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]);
  const printGuide = () => {
    const beforePrint = open;
    setOpen(all);
    const restore = () => setOpen(beforePrint);
    window.addEventListener("afterprint", restore, { once: true });
    setTimeout(() => window.print(), 100);
  };
  return <div className="qiwam-guide-experience">
    <section className="qiwam-guide-heading" style={card}><div className="qiwam-guide-brand"><QiwamLogo size={34} /><div><h1>{t.guideH}</h1><small>{t.tagline}</small></div></div><p>{t.guideLead}</p><div className="qiwam-guide-actions no-print"><button onClick={() => setOpen(all)}>{t.guideExpand}</button><button onClick={() => setOpen([])}>{t.guideCollapse}</button><button className="is-print" onClick={printGuide}>{t.guidePrint}</button></div></section>
    {CHAPTERS.map((chapter, chapterIndex) => {
      const copy = chapter.id === "start"
        ? { ...chapter[lang], lead: START_GUIDE_COPY[lang].lead, items: chapter[lang].items.filter((_, index) => index !== START_GUIDE_COPY[lang].omittedItem) }
        : chapter[lang];
      const expanded = open.includes(chapter.id);
      return <section key={chapter.id} className="qiwam-guide-chapter" style={card}><button className="qiwam-guide-chapter-toggle no-print" onClick={() => toggle(chapter.id)} aria-expanded={expanded}><span className="qiwam-guide-chapter-icon">{chapter.icon}</span><span><small>{chapterIndex + 1}</small><strong>{copy.title}</strong></span><i>{expanded ? "−" : "+"}</i></button><div className={expanded ? "qiwam-guide-chapter-content" : "qiwam-guide-chapter-content is-collapsed"}><h2 className="qiwam-guide-print-title">{chapterIndex + 1}. {copy.title}</h2><p>{copy.lead}</p><div>{copy.items.map(([label, body], itemIndex) => <article key={label}><span>{itemIndex + 1}</span><div><strong>{label}</strong><p>{body}</p></div></article>)}</div>{chapter.action && <button className="qiwam-guide-link no-print" onClick={() => go(chapter.action)}>{copy.title} ›</button>}</div></section>;
    })}
    <p className="qiwam-guide-footer">{t.brand} — {t.tagline}</p>
  </div>;
}
