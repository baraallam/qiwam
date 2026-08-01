import React from "react";

export default function ManualContent() {
  const manualStyle = `
    :root{
      --pine:#123C33; --oasis:#1E6B58; --gold:#C09A52; --goldsoft:#F4ECDD;
      --bg:#F2F4F3; --card:#fff; --line:#E2E6E4; --ink:#14201D; --sub:#5C6B66;
      --bad:#B4452F; --good:#2C7A57;
    }
    *{box-sizing:border-box}
    .manual-content{font-family:'IBM Plex Sans Arabic',system-ui,sans-serif;line-height:1.7;color:var(--ink);max-width:100%}
    .manual-content .wrap{max-width:900px;margin:0 auto;padding:0 20px 80px}

    .manual-content .cover{background:var(--pine);color:#fff;text-align:center;padding:56px 20px 44px}
    .manual-content .cover .mark{display:inline-flex;align-items:center;gap:14px}
    .manual-content .cover h1{font-size:40px;margin:0;font-weight:700}
    .manual-content .cover .sub{font-size:15px;opacity:.85;margin-top:10px}
    .manual-content .cover .en{font-size:13px;opacity:.7;direction:ltr}
    .manual-content .sadu{height:12px;background:repeating-linear-gradient(90deg,var(--pine) 0 4px,transparent 4px 28px),repeating-linear-gradient(-60deg,var(--gold) 0 10px,var(--oasis) 10px 20px,var(--pine) 20px 28px)}
    .manual-content .meta{font-size:12px;color:var(--sub);text-align:center;margin:18px 0 0}

    .manual-content .chapter{background:var(--card);border:1px solid var(--line);border-radius:16px;margin-top:28px;overflow:hidden;page-break-inside:avoid}
    .manual-content .chap-head{background:var(--goldsoft);border-bottom:1px solid #E4D6B8;padding:16px 22px;display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
    .manual-content .chap-no{font-size:13px;font-weight:700;color:var(--gold);letter-spacing:.5px}
    .manual-content .chap-head h2{margin:0;font-size:20px;color:var(--pine)}
    .manual-content .chap-head .en{font-size:13px;color:var(--sub);direction:ltr}
    .manual-content .chap-body{padding:20px 22px 26px}
    .manual-content .intro-ar{font-size:14px;margin:0 0 4px}
    .manual-content .intro-en{font-size:12.5px;color:var(--sub);direction:ltr;text-align:left;margin:0 0 18px}

    .manual-content .wf{border:2px solid var(--pine);border-radius:14px;background:#FAFBFA;padding:12px;position:relative;direction:rtl}
    .manual-content .figcap{font-size:11.5px;color:var(--sub);text-align:center;margin:8px 0 20px}
    .manual-content .wbox{border:1.5px dashed #9FB0AA;border-radius:9px;background:#fff;padding:8px 10px;margin:8px 0;position:relative;min-height:34px;font-size:11px;color:var(--sub)}
    .manual-content .wbox .wt{font-size:11.5px;font-weight:700;color:var(--pine)}
    .manual-content .wrow{display:flex;gap:8px}
    .manual-content .wrow>.wbox{flex:1;margin:8px 0}
    .manual-content .whero{background:var(--pine);border:none;color:#D9E4E0}
    .manual-content .whero .wt{color:#fff}
    .manual-content .badge{position:absolute;top:-9px;inset-inline-start:-9px;width:22px;height:22px;border-radius:50%;background:var(--gold);color:var(--pine);font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.25);z-index:2}
    .manual-content .mini-btn{display:inline-block;background:var(--oasis);color:#fff;border-radius:6px;padding:2px 12px;font-size:10px}
    .manual-content .mini-btn.gold{background:var(--gold);color:var(--pine)}
    .manual-content .mini-pill{display:inline-block;border:1px solid var(--line);border-radius:99px;padding:1px 9px;font-size:9.5px;margin:1px}
    .manual-content .mini-pill.on{background:var(--oasis);color:#fff;border-color:var(--oasis)}
    .manual-content .mini-field{border:1px solid var(--line);border-radius:6px;background:#FBFCFB;height:16px;margin:4px 0}
    .manual-content .mini-gauge{width:64px;height:38px;border:6px solid var(--line);border-bottom:none;border-radius:64px 64px 0 0;margin:6px auto 2px;position:relative}
    .manual-content .mini-gauge::after{content:"78";position:absolute;bottom:-2px;left:0;right:0;text-align:center;font-weight:700;color:var(--pine);font-size:13px}
    .manual-content .mini-bars{display:flex;align-items:flex-end;gap:3px;height:34px;margin-top:6px}
    .manual-content .mini-bars i{flex:1;background:var(--oasis);border-radius:2px 2px 0 0}
    .manual-content .mini-line{height:2px;background:var(--gold);margin-top:3px;border-radius:2px}
    .manual-content .mini-tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-top:6px}
    .manual-content .mini-tile{border:1px solid var(--line);border-radius:7px;padding:4px;text-align:center;font-size:11px;background:#fff}
    .manual-content .mini-track{height:4px;border-radius:99px;background:var(--line);margin-top:3px;overflow:hidden}
    .manual-content .mini-track i{display:block;height:100%;background:var(--oasis);border-radius:99px}
    .manual-content .mini-track i.over{background:var(--bad)}

    .manual-content .legend{margin-top:6px}
    .manual-content .legend h3{font-size:13px;color:var(--pine);margin:18px 0 10px;border-bottom:2px solid var(--goldsoft);padding-bottom:6px}
    .manual-content .item{display:flex;gap:12px;margin:0 0 14px;align-items:flex-start}
    .manual-content .item .n{flex-shrink:0;width:24px;height:24px;border-radius:50%;background:var(--gold);color:var(--pine);font-weight:700;font-size:12.5px;display:flex;align-items:center;justify-content:center;margin-top:2px}
    .manual-content .item .ar{font-size:13.5px;font-weight:500;margin:0}
    .manual-content .item .en{font-size:12px;color:var(--sub);direction:ltr;text-align:left;margin:3px 0 0}
    .manual-content .tip{background:var(--goldsoft);border:1px solid #E4D6B8;border-radius:10px;padding:12px 16px;margin-top:16px;font-size:12.5px}
    .manual-content .tip b{color:var(--pine)}
    .manual-content .tip .en{display:block;font-size:11.5px;color:var(--sub);direction:ltr;text-align:left;margin-top:4px}

    .manual-content .toc{background:var(--card);border:1px solid var(--line);border-radius:16px;margin-top:24px;padding:20px 24px}
    .manual-content .toc h2{font-size:16px;color:var(--pine);margin:0 0 12px}
    .manual-content .toc ol{margin:0;padding-inline-start:22px;font-size:13.5px}
    .manual-content .toc li{margin:6px 0}
    .manual-content .toc .en{color:var(--sub);font-size:12px}
    
    @media print{ .manual-content body{background:#fff} .manual-content .chapter{page-break-after:always;border:none} .manual-content .cover{-webkit-print-color-adjust:exact;print-color-adjust:exact} }
    @media (max-width:560px){ .manual-content .wrow{flex-direction:column;gap:0} }
  `;

  const bodyHTML = `
<div class="wrap">
<p class="meta">الإصدار 1.0 — يوليو 2026 · Version 1.0 — July 2026</p>

<div class="toc">
  <h2>المحتويات · Contents</h2>
  <ol>
    <li>البدء وتسجيل الدخول <span class="en">— Getting started &amp; sign-in</span></li>
    <li>التنقل والعناصر المشتركة <span class="en">— Navigation &amp; shared elements</span></li>
    <li>حاسبة التخطيط: بيانات العائلة <span class="en">— Calculator: Family profile</span></li>
    <li>حاسبة التخطيط: الأهداف <span class="en">— Calculator: Goals</span></li>
    <li>حاسبة التخطيط: النتائج <span class="en">— Calculator: Results</span></li>
    <li>تسجيل المصروفات <span class="en">— Spending Tracker</span></li>
    <li>التقرير الشهري والأهداف الشهرية <span class="en">— Monthly report &amp; targets</span></li>
    <li>المعرفة المالية <span class="en">— Money Basics</span></li>
    <li>دلالات الألوان وأسئلة شائعة <span class="en">— Color meanings &amp; FAQ</span></li>
  </ol>
</div>

<!-- ============ CH 1 : LOGIN ============ -->
<div class="chapter">
  <div class="chap-head"><span class="chap-no">١ · 01</span><h2>البدء وتسجيل الدخول</h2><span class="en">Getting started &amp; sign-in</span></div>
  <div class="chap-body">
    <p class="intro-ar">قِوام متاح للمستخدمين المسجّلين فقط، حمايةً لخصوصية بياناتك المالية. تُنشئ حسابك مرة واحدة، ثم يستقبلك الموقع باسمك في كل زيارة.</p>
    <p class="intro-en">Qiwam is available to registered users only, to protect the privacy of your financial data. Create your account once; the site welcomes you back by name on every visit.</p>

    <div class="wf">
      <div class="wbox whero"><span class="badge">1</span><span class="wt">⚖ قِوام</span> — المال باعتدال… والمستقبل باستقلال</div>
      <div class="wbox" style="height:8px;background:repeating-linear-gradient(-60deg,var(--gold) 0 8px,var(--oasis) 8px 16px);border:none;padding:0"></div>
      <div class="wbox"><span class="badge">2</span><span class="wt">تسجيل الدخول</span> <span class="mini-pill" style="float:left">English</span>
        <div class="mini-field"></div><div class="mini-field"></div>
        <div style="text-align:center;margin-top:6px"><span class="mini-btn">دخول</span></div>
      </div>
      <div class="wbox"><span class="badge">3</span>ليس لديك حساب؟ سجّل الآن</div>
      <div class="wbox"><span class="badge">4</span><span style="color:var(--gold);font-weight:700">استعادة نسخة احتياطية</span></div>
      <div class="wbox" style="background:#FBF1E4;border-color:#E8CFA6"><span class="badge">5</span>⚠ تنبيه التخزين (يظهر عند الحاجة فقط)</div>
    </div>
    <p class="figcap">شكل ١: شاشة الدخول · Figure 1: the sign-in screen</p>

    <div class="legend">
      <div class="item"><span class="n">1</span><div><p class="ar">شعار قِوام ورسالته. زر اللغة أعلى البطاقة يبدّل الموقع كاملاً بين العربية والإنجليزية في أي لحظة.</p><p class="en">The Qiwam mark and promise. The language button at the top of the card switches the whole site between Arabic and English at any moment.</p></div></div>
      <div class="item"><span class="n">2</span><div><p class="ar">حقلا الدخول: اسم المستخدم (٣ أحرف فأكثر، دون مسافات) وكلمة المرور (٦ فأكثر). عند إنشاء حساب جديد يظهر حقل ثالث لاسمك الذي سنرحّب به.</p><p class="en">Sign-in fields: username (3+ characters, no spaces) and password (6+). When registering, a third field appears for the name we greet you with.</p></div></div>
      <div class="item"><span class="n">3</span><div><p class="ar">رابط التبديل بين «دخول» و«إنشاء حساب» — نفس البطاقة تخدم الحالتين.</p><p class="en">Toggles between “Sign in” and “Create account” — the same card serves both.</p></div></div>
      <div class="item"><span class="n">4</span><div><p class="ar">استعادة نسخة احتياطية: ألصق رمز النسخة الذي حفظته سابقاً ليعود حسابك وكل بياناتك فوراً على أي جهاز.</p><p class="en">Restore a backup: paste a previously saved backup code and your account and all data return instantly on any device.</p></div></div>
      <div class="item"><span class="n">5</span><div><p class="ar">شريط تنبيه كهرماني يظهر فقط إذا اكتشف الموقع أن التخزين الدائم غير متاح في بيئتك — فيرشدك لاستخدام النسخة الاحتياطية.</p><p class="en">An amber notice appears only if the site detects that persistent storage is unavailable in your environment, guiding you to use the backup feature.</p></div></div>
    </div>
    <div class="tip"><b>💡 كل ما تُدخله يُحفظ تلقائياً</b> بعد لحظات من كتابته — لا حاجة لزر حفظ.<span class="en">Everything you enter is saved automatically moments after you type it — no save button needed.</span></div>
  </div>
</div>

<!-- ============ CH 2 : NAVIGATION ============ -->
<div class="chapter">
  <div class="chap-head"><span class="chap-no">٢ · 02</span><h2>التنقل والعناصر المشتركة</h2><span class="en">Navigation &amp; shared elements</span></div>
  <div class="chap-body">
    <p class="intro-ar">شريط علوي واحد يرافقك في كل الصفحات، وتحته شريط التنقل بين صفحات الموقع الثلاث.</p>
    <p class="intro-en">One header follows you everywhere, with the three-page navigation bar beneath it.</p>

    <div class="wf">
      <div class="wbox whero"><span class="badge">1</span><span class="wt">⚖ قِوام — أهلاً، محمد</span>
        <span style="float:left"><span class="mini-pill">نسخة احتياطية</span> <span class="mini-pill">English</span> <span class="mini-pill">خروج</span></span></div>
      <div class="wbox"><span class="badge">2</span>
        <span class="mini-pill on">حاسبة التخطيط</span><span class="mini-pill">تسجيل المصروفات</span><span class="mini-pill">المعرفة المالية</span></div>
    </div>
    <p class="figcap">شكل ٢: الرأس وشريط الصفحات · Figure 2: header and page bar</p>

    <div class="legend">
      <div class="item"><span class="n">1</span><div><p class="ar">الرأس: الشعار وترحيب باسمك، وثلاثة أزرار — «نسخة احتياطية» تعرض رمزاً يحوي حسابك وكل بياناتك لتحفظه في ملاحظاتك، وزر اللغة، وتسجيل الخروج.</p><p class="en">Header: logo, greeting, and three buttons — “Backup” shows a code holding your account and all data to save in your notes, the language toggle, and sign-out.</p></div></div>
      <div class="item"><span class="n">2</span><div><p class="ar">صفحات الموقع الثلاث؛ الصفحة الحالية تحتها خط ذهبي. لكل صفحة رابط خاص بها (#/calculator و #/spending و #/learn) فيعمل زر الرجوع وتستطيع مشاركة صفحة بعينها.</p><p class="en">The three site pages; the current one is underlined in gold. Each page has its own URL (#/calculator, #/spending, #/learn), so the back button works and you can share a specific page.</p></div></div>
    </div>
  </div>
</div>

<!-- ============ CH 3 : PROFILE ============ -->
<div class="chapter">
  <div class="chap-head"><span class="chap-no">٣ · 03</span><h2>حاسبة التخطيط — بيانات العائلة</h2><span class="en">Calculator — Family profile</span></div>
  <div class="chap-body">
    <p class="intro-ar">هنا ترسم الصورة المالية الكاملة لعائلتك. كلما كانت الأرقام أدق، كانت النتائج والنصائح أصدق.</p>
    <p class="intro-en">Here you paint your family's full financial picture. The more accurate the numbers, the truer the results and advice.</p>

    <div class="wf">
      <div class="wbox"><span class="mini-pill on">بيانات العائلة</span><span class="mini-pill">الأهداف</span><span class="mini-pill">النتائج</span><span style="float:left" class="mini-btn gold">احفظ الخطة</span><span class="badge">1</span></div>
      <div class="wrow">
        <div class="wbox"><span class="badge">2</span><span class="wt">الدخل الشهري</span><div class="mini-field"></div><div class="mini-field"></div><span class="mini-pill">+ أضف بند دخل</span><div style="margin-top:8px"><span class="wt">العائلة</span></div><div class="mini-field"></div></div>
        <div class="wbox"><span class="badge">3</span><span class="wt">المصروفات الشهرية</span><div class="mini-field"></div><div class="mini-field"></div><div class="mini-field"></div><span class="mini-pill">+ أضف بند مصروف</span></div>
        <div class="wbox"><span class="badge">4</span><span class="wt">الالتزامات</span><div class="mini-field"></div><div style="margin-top:6px"><span class="wt">المدخرات والأصول</span></div><div class="mini-field"></div><div style="margin-top:6px"><span class="wt">افتراضات النمو</span></div><div class="mini-field"></div></div>
      </div>
    </div>
    <p class="figcap">شكل ٣: تبويب بيانات العائلة · Figure 3: the Family profile tab</p>

    <div class="legend">
      <div class="item"><span class="n">1</span><div><p class="ar">تبويبات الحاسبة الثلاثة، وزر «احفظ الخطة» للاطمئنان — مع أن الحفظ يتم تلقائياً.</p><p class="en">The calculator's three tabs, plus a reassurance “Save plan” button — though saving is automatic.</p></div></div>
      <div class="item"><span class="n">2</span><div><p class="ar">الدخل: راتبك ودخل شريك حياتك وأي دخل آخر، مع إمكانية إضافة بنود دخل مخصصة (إيجار عقار، عمل جانبي…). وتحته بيانات العائلة: عمرك وعمر التقاعد وعدد الأبناء — وهي أساس حسابات التقاعد.</p><p class="en">Income: your salary, spouse income, other income — plus custom income items (rental, side business…). Below it, family data: your age, retirement age, and number of children — the basis of retirement math.</p></div></div>
      <div class="item"><span class="n">3</span><div><p class="ar">المصروفات الشهرية الثابتة التقديرية بفئاتها الست، مع بنود مخصصة لما لا تغطيه القائمة (دعم الأهل، السائق…).</p><p class="en">Estimated monthly expenses in six categories, with custom items for anything the list misses (family support, driver…).</p></div></div>
      <div class="item"><span class="n">4</span><div><p class="ar">الالتزامات (الأقساط الشهرية وإجمالي المديونية)، ثم المدخرات السائلة والاستثمارات، ثم افتراضا النمو: العائد المتوقع والتضخم — وهما محركا كل التوقعات طويلة المدى.</p><p class="en">Obligations (monthly installments and total debt), then liquid savings and investments, then the two growth assumptions: expected return and inflation — the engines of every long-term projection.</p></div></div>
    </div>
  </div>
</div>

<!-- ============ CH 4 : GOALS ============ -->
<div class="chapter">
  <div class="chap-head"><span class="chap-no">٤ · 04</span><h2>حاسبة التخطيط — الأهداف</h2><span class="en">Calculator — Goals</span></div>
  <div class="chap-body">
    <p class="intro-ar">حوّل أحلام عائلتك إلى أرقام: لكل هدف مبلغ ومدة، ويحسب قِوام المطلوب ادخاره شهرياً.</p>
    <p class="intro-en">Turn family dreams into numbers: each goal has an amount and a horizon, and Qiwam computes the required monthly saving.</p>

    <div class="wf">
      <div class="wrow">
        <div class="wbox"><span class="badge">1</span><span class="wt">🛟 صندوق الطوارئ</span> <span class="mini-pill on" style="float:left">مفعّل</span><div class="mini-field"></div><div class="mini-field"></div></div>
        <div class="wbox"><span class="wt">🏠 دفعة أولى لمنزل</span> <span class="mini-pill on" style="float:left">مفعّل</span><div class="mini-field"></div><div class="mini-field"></div></div>
      </div>
      <div class="wrow">
        <div class="wbox" style="border-color:var(--gold)"><span class="badge">2</span><span class="wt">🏷 هدف مخصص</span> <span style="float:left;color:var(--bad)">✕</span><div class="mini-field"></div><div class="mini-field"></div></div>
        <div class="wbox" style="border-style:dashed;border-color:var(--oasis);text-align:center;color:var(--oasis);font-weight:700"><span class="badge">3</span>+ أضف هدفاً مخصصاً</div>
      </div>
    </div>
    <p class="figcap">شكل ٤: تبويب الأهداف · Figure 4: the Goals tab</p>

    <div class="legend">
      <div class="item"><span class="n">1</span><div><p class="ar">ستة أهداف جاهزة تناسب العائلة السعودية: الطوارئ، المنزل، تعليم الأبناء، الحج والعمرة، الزواج، والسيارة. فعّل ما يخصك وحدّد المبلغ والمدة بالسنوات.</p><p class="en">Six ready goals for the Saudi family: emergency fund, home, children's education, Hajj &amp; Umrah, wedding, and car. Enable what applies and set the amount and years.</p></div></div>
      <div class="item"><span class="n">2</span><div><p class="ar">الأهداف المخصصة بإطار ذهبي: سمِّ هدفك بنفسك («عمرة للوالدين»، «دراسة بالخارج») وزر ✕ يحذفه.</p><p class="en">Custom goals carry a gold frame: name your own goal (“Umrah for parents,” “study abroad”) and ✕ removes it.</p></div></div>
      <div class="item"><span class="n">3</span><div><p class="ar">بطاقة الإضافة المنقّطة تنشئ هدفاً مخصصاً جديداً بضغطة واحدة.</p><p class="en">The dashed card creates a new custom goal in one tap.</p></div></div>
    </div>
    <div class="tip"><b>💡 نصيحة المستشار:</b> أكمل صندوق الطوارئ أولاً قبل بقية الأهداف — هو أساس كل خطة.<span class="en">Advisor's tip: complete the emergency fund before other goals — it is the foundation of every plan.</span></div>
  </div>
</div>

<!-- ============ CH 5 : RESULTS ============ -->
<div class="chapter">
  <div class="chap-head"><span class="chap-no">٥ · 05</span><h2>حاسبة التخطيط — النتائج</h2><span class="en">Calculator — Results</span></div>
  <div class="chap-body">
    <p class="intro-ar">هنا يتحدث قِوام: درجة عائلتك، ومؤشراتها، ومسار ثروتها حتى التقاعد، وخطة أهدافها، وقراءة مستشارك.</p>
    <p class="intro-en">Here Qiwam speaks: your family's score, its indicators, the wealth path to retirement, the goal plan, and your advisor's read.</p>

    <div class="wf">
      <div class="wrow">
        <div class="wbox" style="text-align:center"><span class="badge">1</span><span class="wt">درجة العائلة المالية</span><div class="mini-gauge"></div><div style="color:var(--good);font-weight:700;font-size:11px">جيدة</div></div>
        <div class="wbox"><span class="badge">2</span>
          <div class="mini-tiles" style="grid-template-columns:repeat(2,1fr)">
            <div class="mini-tile">الفائض الشهري<br><b>4,600</b></div><div class="mini-tile">معدل الادخار<br><b>19٪</b></div>
            <div class="mini-tile">نسبة الالتزامات<br><b>10٪</b></div><div class="mini-tile">تغطية الطوارئ<br><b>2.9 شهر</b></div>
          </div>
        </div>
      </div>
      <div class="wbox"><span class="badge">3</span><span class="wt">مسار الثروة حتى التقاعد</span>
        <div class="mini-bars"><i style="height:15%"></i><i style="height:25%"></i><i style="height:38%"></i><i style="height:55%"></i><i style="height:75%"></i><i style="height:100%"></i></div><div class="mini-line"></div>
        <div style="display:flex;gap:6px;margin-top:6px"><span class="mini-pill">المتوقع عند التقاعد</span><span class="mini-pill">المطلوب (قاعدة ٤٪)</span><span class="mini-pill">الجاهزية ٪</span></div>
      </div>
      <div class="wbox"><span class="badge">4</span><span class="wt">خطة الأهداف</span> — جدول: الهدف · المبلغ · السنوات · الادخار الشهري المطلوب · الحالة</div>
      <div class="wbox" style="background:var(--goldsoft);border-color:#E4D6B8"><span class="badge">5</span><span class="wt">قراءة مستشارك</span> — توصيات مرتّبة حسب الأولوية</div>
    </div>
    <p class="figcap">شكل ٥: تبويب النتائج · Figure 5: the Results tab</p>

    <div class="legend">
      <div class="item"><span class="n">1</span><div><p class="ar">درجة العائلة المالية من ١٠٠ على عدّاد: تجمع معدل الادخار (وزنه ٣٠)، وانضباط الالتزامات (٢٥)، وتغطية الطوارئ (٢٥)، وجاهزية التقاعد (٢٠). لونها يتدرج من الأحمر (حرجة) إلى الأخضر (متينة).</p><p class="en">Your Family Financial Score out of 100 on a gauge: it blends savings rate (weight 30), debt discipline (25), emergency cover (25), and retirement readiness (20). Its color runs from red (critical) to green (strong).</p></div></div>
      <div class="item"><span class="n">2</span><div><p class="ar">أربعة مؤشرات فورية مع أهدافها الإرشادية: الفائض الشهري، معدل الادخار (المستهدف ٢٠٪)، نسبة الالتزامات (الحد ٣٣٪)، وتغطية الطوارئ (المستهدف ٦ أشهر).</p><p class="en">Four instant indicators with their guideline targets: monthly surplus, savings rate (target 20%), debt burden (limit 33%), and emergency cover (target 6 months).</p></div></div>
      <div class="item"><span class="n">3</span><div><p class="ar">رسم مسار الثروة حتى التقاعد: المساحة الخضراء قيمة مدخراتك الاسمية سنة بسنة، والخط الذهبي المتقطع قوّتها الشرائية بعد التضخم. تحته: المتوقع عند التقاعد، والمطلوب وفق قاعدة ٤٪ الإرشادية، ونسبة جاهزيتك.</p><p class="en">The wealth-path chart to retirement: the green area is your nominal savings year by year; the dashed gold line is purchasing power after inflation. Below: projected at retirement, needed per the 4% guideline, and your readiness percentage.</p></div></div>
      <div class="item"><span class="n">4</span><div><p class="ar">جدول خطة الأهداف: لكل هدفٍ الادخارُ الشهري المطلوب لبلوغه في موعده، وحالته الملوّنة: أخضر «ممكن ضمن الفائض»، كهرماني «يزاحم الفائض»، أحمر «الفائض لا يكفي». وأسفله مجموع المطلوب مقابل فائضك.</p><p class="en">The goal-plan table: each goal's required monthly saving to arrive on time, with a colored status — green “fits your surplus,” amber “crowds it,” red “exceeds it.” Beneath: the total required versus your surplus.</p></div></div>
      <div class="item"><span class="n">5</span><div><p class="ar">قراءة مستشارك: توصيات مرتّبة تلقائياً حسب الأولوية — تبدأ بإيقاف العجز إن وُجد، ثم الالتزامات فوق ٣٣٪، ثم الطوارئ، ثم التقاعد.</p><p class="en">Your advisor's read: recommendations auto-ordered by priority — a deficit first if present, then debt above 33%, then emergencies, then retirement.</p></div></div>
    </div>
  </div>
</div>

<!-- ============ CH 6 : SPENDING ============ -->
<div class="chapter">
  <div class="chap-head"><span class="chap-no">٦ · 06</span><h2>تسجيل المصروفات</h2><span class="en">Spending Tracker</span></div>
  <div class="chap-body">
    <p class="intro-ar">صفحة يومك المالي: كم بقي من دخلك؟ وكم تصرف اليوم؟ سجّل أي مصروف بضغطتين.</p>
    <p class="intro-en">Your financial day: how much income remains, and how much you spent today. Log any expense in two taps.</p>

    <div class="wf">
      <div class="wbox whero"><span class="badge">1</span><span style="font-size:9.5px;opacity:.8">١٤ محرم ١٤٤٨ · 2026-07-28</span><br>
        <span class="wt">الباقي من الدخل: 12,400 ر.س</span>
        <span style="float:left;font-size:9.5px">الدخل 24,000 · المصروف 11,600 · <b>29 يوم حتى الراتب</b> · معدلك الآمن 427/يوم</span>
        <div class="mini-track" style="background:rgba(255,255,255,.2)"><i style="width:48%;background:var(--gold)"></i></div>
        <span style="font-size:9px;opacity:.75">يوم الراتب: [27]</span></div>
      <div class="wbox"><span class="badge">2</span><span class="wt">الفئات — اضغط أي بند لتسجيل مصروف فوراً</span>
        <div class="mini-tiles">
          <div class="mini-tile">🍽️<div class="mini-track"><i style="width:60%"></i></div></div>
          <div class="mini-tile">🛒<div class="mini-track"><i class="over" style="width:100%"></i></div></div>
          <div class="mini-tile">⛽<div class="mini-track"><i style="width:30%"></i></div></div>
          <div class="mini-tile">🏷️</div>
        </div>
        <span class="mini-pill" style="border-style:dashed;border-color:var(--oasis);color:var(--oasis)">اسم فئة جديدة… + أضف فئة</span></div>
      <div class="wbox" style="border-color:var(--oasis);background:#F6FAF8"><span class="badge">3</span><span class="wt">تسجيل مصروف: 🍽️ مطاعم وقهوة</span><div class="wrow"><div class="mini-field" style="flex:1"></div><div class="mini-field" style="flex:1"></div><div class="mini-field" style="flex:1"></div></div><div style="text-align:center"><span class="mini-btn">إضافة المصروف</span></div></div>
      <div class="wbox"><span class="badge">4</span><span class="wt">المصروفات الثابتة الشهرية</span> — راتب العاملة المنزلية · يستحق يوم 1 <span class="mini-btn" style="float:left">سجّل كمدفوع</span></div>
      <div class="wbox"><span class="badge">5</span><span class="wt">التقدم اليومي خلال الشهر</span><div class="mini-bars"><i style="height:30%"></i><i style="height:70%"></i><i style="height:20%"></i><i style="height:90%"></i><i style="height:45%"></i><i style="height:60%"></i><i style="height:35%"></i></div><div class="mini-line"></div></div>
      <div class="wbox"><span class="badge">6</span><span class="wt">مصروفات هذا الشهر</span> — قائمة مجمّعة يوماً بيوم مع مجموع كل يوم</div>
    </div>
    <p class="figcap">شكل ٦: صفحة تسجيل المصروفات · Figure 6: the Spending Tracker page</p>

    <div class="legend">
      <div class="item"><span class="n">1</span><div><p class="ar">بطاقة «الباقي من الدخل» — قلب الصفحة: التاريخ الهجري والميلادي، والمبلغ الباقي بعد كل ما صرفته هذا الشهر، وعداد الأيام حتى راتبك القادم، و«معدلك الآمن لليوم» = الباقي ÷ الأيام المتبقية، فتعرف كم تصرف يومياً وتصل إلى الراتب بسلام. عدّل «يوم الراتب» ليناسبك.</p><p class="en">The “Remaining from income” card — the heart of the page: Hijri and Gregorian dates, what remains after everything spent this month, a countdown to your next salary, and your “safe daily rate” = remaining ÷ days left, so you know how much to spend per day and still reach payday. Adjust “salary day” to match yours.</p></div></div>
      <div class="item"><span class="n">2</span><div><p class="ar">شبكة الفئات: كل بند بأيقونته ومصروفه هذا الشهر، ومع تحديد هدف شهري يظهر شريط تقدّم يتحوّل أحمرَ عند التجاوز. أضف فئاتك الخاصة من الحقل المنقّط، واحذف المخصصة بعلامة ✕.</p><p class="en">The category grid: each item shows its icon and this month's spend; with a monthly target set, a progress bar appears and turns red when exceeded. Add your own categories from the dashed field; remove custom ones with ✕.</p></div></div>
      <div class="item"><span class="n">3</span><div><p class="ar">لوحة التسجيل السريع: تظهر عند الضغط على أي بند، والتاريخ مضبوط على اليوم — أدخل المبلغ (وملاحظة إن شئت) واضغط «إضافة المصروف». ضغطتان وينتهي الأمر.</p><p class="en">The quick-log panel: opens when you tap any tile, with today's date preset — enter the amount (and an optional note) and tap “Add spend.” Two taps and done.</p></div></div>
      <div class="item"><span class="n">4</span><div><p class="ar">المصروفات الثابتة: أضف الالتزامات المتكررة (راتب العاملة، الإيجار، الاشتراكات) باسمها ومبلغها ويوم استحقاقها. إطار ذهبي قبل الاستحقاق، وأحمر مع كلمة «متأخر» إن فات اليوم دون سداد، وزر «سجّل كمدفوع» يقيّده في السجل ويضع علامة ✓.</p><p class="en">Fixed expenses: add recurring commitments (housemaid salary, rent, subscriptions) with name, amount, and due day. Gold frame before the due date, red with “Overdue” if the day passes unpaid, and “Mark as paid” records it in the log with a ✓.</p></div></div>
      <div class="item"><span class="n">5</span><div><p class="ar">رسم التقدم اليومي: أعمدة خضراء لمصروف كل يوم، وخط ذهبي تراكمي يريك وتيرة استهلاك الشهر.</p><p class="en">The daily-progress chart: green bars for each day's spend and a gold cumulative line showing the month's burn pace.</p></div></div>
      <div class="item"><span class="n">6</span><div><p class="ar">سجل الشهر مجمّعاً يوماً بيوم، مع مجموع كل يوم، ووسم «ثابت» يميّز المدفوعات الدورية، وحذف أي قيد بعلامة ✕.</p><p class="en">The month's log grouped day by day, with each day's subtotal, a “Fixed” tag marking recurring payments, and ✕ to delete any entry.</p></div></div>
    </div>
  </div>
</div>

<!-- ============ CH 7 : REPORT ============ -->
<div class="chapter">
  <div class="chap-head"><span class="chap-no">٧ · 07</span><h2>التقرير الشهري والأهداف الشهرية</h2><span class="en">Monthly report &amp; targets</span></div>
  <div class="chap-body">
    <p class="intro-ar">أسفل صفحة المصروفات يقيم تقرير نهاية الشهر: أين ذهب المال، وبأي نسبة، وهل التزمت بأهدافك؟</p>
    <p class="intro-en">Below the spending page lives the end-of-month report: where the money went, in what proportions, and whether you kept to your targets.</p>

    <div class="wf">
      <div class="wbox"><span class="badge">1</span><span class="wt">توزيع مصروفات الشهر</span> <span class="mini-pill" style="float:left">الشهر: 2026-07</span>
        <div class="mini-tiles" style="grid-template-columns:repeat(3,1fr)">
          <div class="mini-tile">الإجمالي<br><b>11,600</b></div><div class="mini-tile">ثابت / متغير<br><b>4,000/7,600</b></div><div class="mini-tile">أعلى فئة<br><b>🛒</b></div>
        </div></div>
      <div class="wbox"><span class="badge">2</span>🛒 تموينات · <b>31٪ من الإجمالي</b> — 3,600 / 3,000
        <div class="mini-track"><i class="over" style="width:100%"></i></div><span style="color:var(--bad);font-size:9.5px">تجاوز الهدف (+600)</span>
        <div style="margin-top:6px">🍽️ مطاعم · 24٪ — 2,800 / 3,500</div><div class="mini-track"><i style="width:80%"></i></div><span style="color:var(--good);font-size:9.5px">ضمن الهدف</span></div>
      <div class="wbox"><span class="badge">3</span><span class="wt">الأهداف الشهرية للفئات</span><div class="wrow"><div class="mini-field" style="flex:1"></div><div class="mini-field" style="flex:1"></div><div class="mini-field" style="flex:1"></div></div></div>
    </div>
    <p class="figcap">شكل ٧: التقرير الشهري · Figure 7: the monthly report</p>

    <div class="legend">
      <div class="item"><span class="n">1</span><div><p class="ar">ملخص الشهر: اختر أي شهر من المنتقي، وستجد الإجمالي، وتقسيم الثابت مقابل المتغير، ومتوسط الصرف اليومي، وأعلى فئة، ومجموع أهدافك مقابل ما صرفته فعلاً.</p><p class="en">The month summary: pick any month from the selector to see the total, fixed-vs-variable split, average daily spend, top category, and your targets total versus actual spend.</p></div></div>
      <div class="item"><span class="n">2</span><div><p class="ar">توزيع الفئات: لكل فئة نسبتها المئوية من الإجمالي، والفعلي مقابل الهدف، وشريط تقدّم أخضر ضمن الهدف، أحمر عند التجاوز (مع مقدار الزيادة)، وذهبي إن لم تحدّد هدفاً بعد.</p><p class="en">Category breakdown: each category's percentage of the total, actual versus target, and a bar — green within target, red when exceeded (with the overage), gold if no target is set yet.</p></div></div>
      <div class="item"><span class="n">3</span><div><p class="ar">محرر الأهداف الشهرية: ضع لكل فئة سقفاً شهرياً — وهو ما تقيس عليه الأشرطة أعلاه وأشرطة بطاقات الفئات.</p><p class="en">The monthly targets editor: set each category's monthly ceiling — this is what the bars above and the category tiles measure against.</p></div></div>
    </div>
  </div>
</div>

<!-- ============ CH 8 : LEARN ============ -->
<div class="chapter">
  <div class="chap-head"><span class="chap-no">٨ · 08</span><h2>المعرفة المالية</h2><span class="en">Money Basics</span></div>
  <div class="chap-body">
    <p class="intro-ar">مكتبة مصغّرة تشرح كيف يعمل المال: ١٥ تعريفاً و٨ ممارسات عائلية مجرّبة، بالعربية والإنجليزية.</p>
    <p class="intro-en">A mini-library on how money works: 15 definitions and 8 proven family practices, in Arabic and English.</p>

    <div class="wf">
      <div class="wbox" style="background:var(--goldsoft);border-color:#E4D6B8"><span class="badge">1</span><span class="wt">كيف يعمل المال؟ دليل العائلة</span></div>
      <div class="wbox"><span class="badge">2</span><span class="mini-field" style="display:inline-block;width:44%;border-radius:99px"></span> <span class="mini-pill on">الكل</span><span class="mini-pill">تعريفات</span><span class="mini-pill">ممارسات</span></div>
      <div class="wrow">
        <div class="wbox"><span class="badge">3</span>🛟 <span class="wt">صندوق الطوارئ</span> <span style="color:var(--oasis);font-size:9px;font-weight:700">تعريف</span> ›</div>
        <div class="wbox" style="border-color:var(--oasis);background:#F6FAF8">⏰ <span class="wt">ادفع لنفسك أولاً</span> <span style="color:var(--gold);font-size:9px;font-weight:700">ممارسة</span><br><span style="font-size:9.5px">حوّل الادخار تلقائياً يوم الراتب…</span></div>
      </div>
    </div>
    <p class="figcap">شكل ٨: صفحة المعرفة المالية · Figure 8: the Money Basics page</p>

    <div class="legend">
      <div class="item"><span class="n">1</span><div><p class="ar">مقدمة الصفحة ورسالتها التعليمية.</p><p class="en">The page's introduction and educational promise.</p></div></div>
      <div class="item"><span class="n">2</span><div><p class="ar">البحث والتصفية: ابحث بأي كلمة — بالعربية أو الإنجليزية — أو صفِّ المحتوى بين «تعريفات» و«ممارسات».</p><p class="en">Search and filters: search any word — Arabic or English — or filter between Definitions and Practices.</p></div></div>
      <div class="item"><span class="n">3</span><div><p class="ar">بطاقات المعرفة: وسم أخضر للتعريفات وذهبي للممارسات؛ اضغط أي بطاقة لتتوسع بالشرح، واضغطها ثانية لتنغلق. المحتوى مكتوب للسياق السعودي: الزكاة، والمرابحة والإجارة، والتأمينات ومكافأة نهاية الخدمة.</p><p class="en">Knowledge cards: a green tag for definitions, gold for practices; tap a card to expand, tap again to close. Content is written for the Saudi context: Zakat, murabaha &amp; ijara, GOSI and end-of-service.</p></div></div>
    </div>
  </div>
</div>

<!-- ============ CH 9 : COLORS & FAQ ============ -->
<div class="chapter">
  <div class="chap-head"><span class="chap-no">٩ · 09</span><h2>دلالات الألوان وأسئلة شائعة</h2><span class="en">Color meanings &amp; FAQ</span></div>
  <div class="chap-body">
    <div class="legend">
      <h3>لغة الألوان في قِوام · Qiwam's color language</h3>
      <div class="item"><span class="n" style="background:var(--good);color:#fff">●</span><div><p class="ar">أخضر: ضمن الهدف أو المدى الصحي — استمر.</p><p class="en">Green: within target or the healthy range — keep going.</p></div></div>
      <div class="item"><span class="n" style="background:#C08A2D;color:#fff">●</span><div><p class="ar">كهرماني: انتبه — يقترب من الحد أو يزاحم الفائض.</p><p class="en">Amber: attention — approaching the limit or crowding the surplus.</p></div></div>
      <div class="item"><span class="n" style="background:var(--bad);color:#fff">●</span><div><p class="ar">أحمر: تجاوزٌ أو تأخر يحتاج قراراً الآن.</p><p class="en">Red: an overage or overdue item that needs a decision now.</p></div></div>
      <div class="item"><span class="n" style="background:var(--gold);color:var(--pine)">●</span><div><p class="ar">ذهبي: عنصر مخصص منك، أو بند بلا هدف محدد بعد.</p><p class="en">Gold: something custom you created, or an item with no target set yet.</p></div></div>

      <h3>أسئلة شائعة · FAQ</h3>
      <div class="item"><span class="n">؟</span><div><p class="ar">هل أحتاج للضغط على «حفظ»؟ لا — كل شيء يُحفظ تلقائياً بعد لحظات من إدخاله. الزر موجود للاطمئنان فقط.</p><p class="en">Do I need to press “Save”? No — everything saves automatically moments after entry. The button exists only for reassurance.</p></div></div>
      <div class="item"><span class="n">؟</span><div><p class="ar">كيف أنقل بياناتي لجهاز آخر؟ افتح «نسخة احتياطية» من الرأس، انسخ الرمز، ثم في الجهاز الآخر اختر «استعادة نسخة احتياطية» في شاشة الدخول وألصقه.</p><p class="en">How do I move my data to another device? Open “Backup” in the header, copy the code, then on the other device choose “Restore a backup” on the sign-in screen and paste it.</p></div></div>
      <div class="item"><span class="n">؟</span><div><p class="ar">لماذا تختلف مصروفات الحاسبة عن صفحة المصروفات؟ الحاسبة تعتمد تقديراتك الشهرية للتخطيط طويل المدى، بينما تسجّل صفحة المصروفات الواقع اليومي — وقارن بينهما ليتحسّن تقديرك شهراً بعد شهر.</p><p class="en">Why do the calculator's expenses differ from the Spending page? The calculator uses your monthly estimates for long-term planning, while Spending records daily reality — compare them and your estimates improve month by month.</p></div></div>
      <div class="item"><span class="n">؟</span><div><p class="ar">هل نصائح قِوام استشارة مالية مرخّصة؟ لا — قِوام أداة تعليمية وتخطيطية، والنتائج تقديرية وفق افتراضاتك. للقرارات الكبرى استعن بمختص مرخّص.</p><p class="en">Is Qiwam's guidance licensed financial advice? No — Qiwam is an educational planning tool and results are estimates based on your assumptions. For major decisions, consult a licensed professional.</p></div></div>
    </div>
  </div>
</div>

<p class="meta" style="margin-top:32px">قِوام — المال باعتدال… والمستقبل باستقلال · Qiwam — Balanced money. Independent future.</p>
</div>
  `;

  return (
    <div className="manual-content">
      <style>{manualStyle}</style>
      <div dangerouslySetInnerHTML={{ __html: bodyHTML }} />
    </div>
  );
}
