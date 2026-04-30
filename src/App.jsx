import { useMemo, useState } from 'react'
import './App.css'

const doctorProfile = {
  name: 'د. عبدالله علي',
  specialty: 'أخصائي أطفال',
  location: 'الرياض، المملكة العربية السعودية',
  dob: '17.07.98',
  bloodType: '+A',
  workHours: '9:00 ص – 5:00 م',
}

const screens = [
  { id: 'dashboard', label: 'الطبيب', note: 'ملف الطبيب والمؤشرات' },
  { id: 'alerts', label: 'غرفة التنبيهات', note: 'أولوية الحالات الحرجة' },
  { id: 'caseDetails', label: 'المرضى', note: 'قائمة المرضى والملف السريري' },
  { id: 'triage', label: 'إدارة الفرز', note: 'تدفق الطوارئ' },
  { id: 'vitals', label: 'مؤشرات حيوية', note: 'تحليل أنماط لحظي' },
  { id: 'differential', label: 'ترجيح التشخيص', note: 'مقارنة احتمالات' },
  { id: 'optimization', label: 'كفاءة الموارد', note: 'استغلال الأسرّة' },
  { id: 'report', label: 'الملخص التنفيذي', note: 'مخرجات العرض' },
]

const kpis = [
  { title: 'إجمالي الحالات النشطة', value: '184', delta: '+9.3%', tone: 'up' },
  { title: 'تنبيهات عالية الخطورة', value: '31', delta: '+2.1%', tone: 'warn' },
  { title: 'متوسط زمن التدخل', value: '06:20', delta: '-14.8%', tone: 'good' },
  { title: 'إشغال الأسرة الفعلي', value: '78%', delta: '-6.4%', tone: 'good' },
]

const timeline = [36, 48, 54, 52, 67, 72, 69, 81, 77, 74, 84, 88]
const alerts = [
  { id: 'ER-1172', type: 'اشتباه نزيف داخلي', score: 0.93, room: 'غرفة 4', status: 'فوري' },
  { id: 'ER-1136', type: 'مؤشر جلطة مرتفع', score: 0.87, room: 'غرفة 2', status: 'مرتفع' },
  { id: 'ER-1094', type: 'تدهور أكسجين سريع', score: 0.81, room: 'غرفة 7', status: 'مرتفع' },
  { id: 'ER-1089', type: 'خطر صدمة إنتانية', score: 0.78, room: 'عزل 1', status: 'متوسط' },
]

const triageRows = [
  { lane: 'أحمر', laneKey: 'red', count: 28, wait: '4 د', next: 'إدخال مباشر' },
  { lane: 'برتقالي', laneKey: 'orange', count: 44, wait: '11 د', next: 'فحص سريع' },
  { lane: 'أصفر', laneKey: 'yellow', count: 59, wait: '23 د', next: 'تحويل منظم' },
  { lane: 'أخضر', laneKey: 'green', count: 70, wait: '36 د', next: 'رعاية عاجلة' },
]

const triageActiveTotal = triageRows.reduce((sum, row) => sum + row.count, 0)

/** شريط أسبوع واحد (نموذج تقويمي) */
const calendarWeekStrip = [
  { key: '26', dow: 'أحد', num: 26, monthHint: 'أبريل' },
  { key: '27', dow: 'إثنين', num: 27, monthHint: 'أبريل' },
  { key: '28', dow: 'ثلاثاء', num: 28, monthHint: 'أبريل' },
  { key: '29', dow: 'أربعاء', num: 29, monthHint: 'أبريل' },
  { key: '30', dow: 'خميس', num: 30, monthHint: 'أبريل' },
  { key: '1', dow: 'جمعة', num: 1, monthHint: 'مايو' },
  { key: '2', dow: 'سبت', num: 2, monthHint: 'مايو' },
]

const doctorQuickActions = [
  { label: 'سجل الوصفات', icon: '💊' },
  { label: 'طلب تحليل', icon: '🧪' },
  { label: 'إحالة طبية', icon: '🏥' },
  { label: 'تقرير طبي', icon: '📄' },
  { label: 'مكالمة مريض', icon: '📞' },
  { label: 'متابعة مهام', icon: '✅' },
]

const doctorPendingTasks = [
  { id: 't1', text: 'اعتماد 3 وصفات قبل نهاية الدوام', due: 'اليوم' },
  { id: 't2', text: 'مراجعة نتيجة تحليل عاجل — PT-1043', due: 'خلال ساعة' },
  { id: 't3', text: 'توقيع تقرير خروج — غرفة 7', due: 'غدًا' },
]

const doctorRecentPatients = [
  { id: 'PT-2201', name: 'نورة الغامدي', last: 'متابعة جلد', when: 'أمس' },
  { id: 'PT-2194', name: 'سعد المطيري', last: 'وصفة مرتدة', when: 'أمس' },
  { id: 'PT-2190', name: 'لينا العتيبي', last: 'استشارة', when: 'قبل يومين' },
]

/** المرضى — قائمة + هوية وطنية (تجريبي) */
const caseFilePatients = [
  {
    fileId: 'PT-1042',
    nationalId: '1087654321',
    name: 'عبدالله الشهري',
    age: 58,
    bp: '138/88',
    spo2: '96%',
    pulse: '82',
    arrival: '08:30 ص',
    scanLabel: 'CT — عرض أولي',
    recommendation: 'متابعة ضغط دورية؛ لا مؤشرات حرجة فورية في الصورة الأولية.',
  },
  {
    fileId: 'PT-1043',
    nationalId: '2098765432',
    name: 'نوف العنزي',
    age: 34,
    bp: '152/98',
    spo2: '89%',
    pulse: '124',
    arrival: '08:16 ص',
    scanLabel: 'CT Preview Placeholder',
    recommendation: 'يوصى بتفعيل بروتوكول التدخل المبكر ورفع الحالة للمسار الحرج.',
  },
  {
    fileId: 'PT-1044',
    nationalId: '3123456789',
    name: 'محمد الحربي',
    age: 46,
    bp: '128/82',
    spo2: '94%',
    pulse: '91',
    arrival: '09:05 ص',
    scanLabel: 'MRI — مقطعي',
    recommendation: 'مراقبة سكر الدم؛ إعادة تقييم خلال ٤ ساعات.',
  },
  {
    fileId: 'PT-1045',
    nationalId: '4234567890',
    name: 'سارة القحطاني',
    age: 29,
    bp: '118/76',
    spo2: '99%',
    pulse: '72',
    arrival: '09:40 ص',
    scanLabel: 'أشعة سينية',
    recommendation: 'حالة مستقرة؛ متابعة عيادات خارجية.',
  },
]

const calendarAppointments = {
  '29': [
    { time: '2:00 م', title: 'اجتماع مع الطبيب المقيم د. وليامز', tone: 'pink' },
    { time: '2:30 م', title: 'استشارة مع السيد وايت', tone: 'violet' },
    { time: '3:15 م', title: 'استشارة مع السيدة ميسي', tone: 'mint' },
    { time: '4:00 م', title: 'فحص نمش السيدة لي', tone: 'teal' },
    { time: '5:00 م', title: 'اجتماع مع أخصائي الجهاز الهضمي د. أليس', tone: 'sky' },
  ],
  '27': [
    { time: '10:00 ص', title: 'مراجعة مخطط العلاج', tone: 'teal' },
    { time: '11:30 ص', title: 'متابعة نتائج تحاليل', tone: 'violet' },
  ],
  '30': [{ time: '9:00 ص', title: 'جولة عيادات صباحية', tone: 'mint' }],
}

function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard')
  const [calendarDayKey, setCalendarDayKey] = useState('29')
  const [calendarMonth, setCalendarMonth] = useState('2026-04')
  const [caseFilePatientId, setCaseFilePatientId] = useState(caseFilePatients[0].fileId)
  const [caseFileSearch, setCaseFileSearch] = useState('')

  const current = useMemo(
    () => screens.find((item) => item.id === activeScreen) ?? screens[0],
    [activeScreen]
  )

  const selectedDayMeta = useMemo(
    () => calendarWeekStrip.find((d) => d.key === calendarDayKey) ?? calendarWeekStrip[3],
    [calendarDayKey]
  )

  const daySlots = calendarAppointments[calendarDayKey] ?? []

  const caseFileVisible = useMemo(() => {
    const q = caseFileSearch.trim()
    if (!q) return caseFilePatients
    const lower = q.toLowerCase()
    return caseFilePatients.filter(
      (p) =>
        p.nationalId.includes(q) ||
        p.fileId.toLowerCase().includes(lower) ||
        p.name.includes(q)
    )
  }, [caseFileSearch])

  const selectedCasePatient = useMemo(() => {
    const hit = caseFileVisible.find((p) => p.fileId === caseFilePatientId)
    if (hit) return hit
    return caseFileVisible[0] ?? null
  }, [caseFileVisible, caseFilePatientId])

  return (
    <div className="app" dir="rtl">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo-frame">
            <div className="brand-logo-inner">
              <img
                className="brand-logo"
                src="/logo.png"
                alt="شعار مُنجِد"
                width={112}
                height={112}
                decoding="async"
              />
            </div>
          </div>
          <h1>مُنجِد</h1>
          <p>منصة ذكاء طبي</p>
        </div>
        <nav className="menu">
          {screens.map((screen) => (
            <button
              key={screen.id}
              type="button"
              className={`menu-item ${activeScreen === screen.id ? 'active' : ''}`}
              onClick={() => setActiveScreen(screen.id)}
            >
              <strong>{screen.label}</strong>
              <small>{screen.note}</small>
            </button>
          ))}
        </nav>
      </aside>

      <main className="workspace">
        <header className="header">
          <div>
            <h2>{current.label}</h2>
            <p>
              {activeScreen === 'dashboard'
                ? 'مهام، إجراءات سريعة، وتقويمك في مكان واحد'
                : activeScreen === 'alerts'
                  ? 'محدّث من أنظمة المراقبة — جاهزية الفريق للاستجابة (11:42 ص)'
                  : activeScreen === 'triage'
                    ? 'عرض حي لمسارات الأولوية — مزامنة مع طوابق الطوارئ (11:42 ص)'
                    : activeScreen === 'caseDetails'
                      ? 'استعرض المرضى، ابحث بالهوية أو رقم الملف، وافتح الملف السريري'
                      : 'آخر تحديث تشغيلي: 11:42 AM - نموذج عرض ببيانات تجريبية'}
            </p>
          </div>
          <div className="header-meta">
            <span className="pill">
              {activeScreen === 'dashboard' ||
              activeScreen === 'alerts' ||
              activeScreen === 'caseDetails' ||
              activeScreen === 'triage'
                ? 'التشغيل مستقر'
                : 'System Stable'}
            </span>
            <button type="button">+ إضافة مريض</button>
          </div>
        </header>

        {activeScreen === 'dashboard' && (
          <section className="grid doctor-layout">
            <div className="doctor-sidebar-col">
              <article className="card doctor-profile-card">
                <div className="doctor-profile-head">
                  <span>ملفي الشخصي</span>
                  <button type="button" className="doctor-profile-edit" aria-label="تعديل الملف">
                    ✎
                  </button>
                </div>
                <div className="doctor-profile-body">
                  <div className="doctor-avatar" aria-hidden="true">
                    👨‍⚕️
                  </div>
                  <div className="doctor-profile-text">
                    <h3 className="doctor-name">{doctorProfile.name}</h3>
                    <p className="doctor-specialty">{doctorProfile.specialty}</p>
                    <p className="doctor-location">📍 {doctorProfile.location}</p>
                  </div>
                </div>
                <div className="doctor-profile-stats">
                  <div className="doctor-stat-cell">
                    <span className="doctor-stat-label">تاريخ الميلاد</span>
                    <strong>{doctorProfile.dob}</strong>
                  </div>
                  <div className="doctor-stat-cell">
                    <span className="doctor-stat-label">ساعات العمل</span>
                    <strong>{doctorProfile.workHours}</strong>
                  </div>
                  <div className="doctor-stat-cell">
                    <span className="doctor-stat-label">فصيلة الدم</span>
                    <strong>{doctorProfile.bloodType}</strong>
                  </div>
                </div>
              </article>

              <article className="card my-calendar-card">
                <div className="my-calendar-head">
                  <span className="my-calendar-title">تقويمي</span>
                  <select
                    className="my-calendar-month"
                    aria-label="اختيار الشهر"
                    value={calendarMonth}
                    onChange={(e) => setCalendarMonth(e.target.value)}
                  >
                    <option value="2026-04">أبريل 2026</option>
                    <option value="2026-05">مايو 2026</option>
                  </select>
                </div>
                <div className="my-calendar-week" role="tablist" aria-label="أيام الأسبوع">
                  {calendarWeekStrip.map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      role="tab"
                      aria-selected={calendarDayKey === d.key}
                      className={`my-calendar-day ${calendarDayKey === d.key ? 'is-selected' : ''}`}
                      onClick={() => setCalendarDayKey(d.key)}
                    >
                      <span className="my-calendar-dow">{d.dow}</span>
                      <span className="my-calendar-dom">{d.num}</span>
                    </button>
                  ))}
                </div>
                <div className="my-calendar-body">
                  <div className="my-calendar-day-header">
                    <span className="my-calendar-day-label">
                      {selectedDayMeta.monthHint} {selectedDayMeta.num}
                    </span>
                    <button type="button" className="my-calendar-more" aria-label="خيارات إضافية">
                      ⋯
                    </button>
                  </div>
                  <ul className="my-calendar-slots">
                    {daySlots.length === 0 ? (
                      <li className="my-calendar-empty">لا مواعيد مسجلة لهذا اليوم</li>
                    ) : (
                      daySlots.map((slot, i) => (
                        <li key={`${slot.time}-${i}`} className="my-calendar-slot">
                          <span className="my-calendar-slot-time">{slot.time}</span>
                          <span className={`my-calendar-dot my-calendar-dot--${slot.tone}`} aria-hidden />
                          <span className="my-calendar-slot-title">{slot.title}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </article>
            </div>

            <div className="doctor-main-stack doctor-main-surface">
              <article className="card doctor-welcome">
                <div className="doctor-welcome-pattern" aria-hidden="true" />
                <div className="doctor-welcome-inner">
                  <div className="doctor-welcome-copy">
                    <p className="doctor-welcome-date">
                      <span className="doctor-welcome-date-icon" aria-hidden="true">
                        📅
                      </span>
                      29 أبريل 2026 — 11:42 ص
                    </p>
                    <h3 className="doctor-welcome-title">يوم سعيد، {doctorProfile.name}!</h3>
                    <p className="doctor-welcome-sub">نظرة سريعة على يومك التشغيلي — أتمنى لك يومًا هادئًا.</p>
                  </div>
                  <div className="doctor-welcome-visual" aria-hidden="true">
                    <div className="doctor-welcome-orbit">
                      <span className="doctor-welcome-float doctor-welcome-float--1">💊</span>
                      <span className="doctor-welcome-float doctor-welcome-float--2">🌡️</span>
                      <span className="doctor-welcome-float doctor-welcome-float--3">🧪</span>
                      <span className="doctor-welcome-float doctor-welcome-float--4">📋</span>
                      <span className="doctor-welcome-float doctor-welcome-float--5">🩹</span>
                    </div>
                    <span className="doctor-welcome-figure">👨‍⚕️</span>
                  </div>
                </div>
              </article>

              <section className="doctor-kpi-row" aria-label="مؤشرات سريعة">
                {kpis.map((kpi) => (
                  <article key={kpi.title} className="card kpi doctor-kpi-card">
                    <p>{kpi.title}</p>
                    <strong>{kpi.value}</strong>
                    <span className={kpi.tone}>{kpi.delta}</span>
                  </article>
                ))}
              </section>

              <section className="doctor-charts" aria-label="رسوم بيانية">
                <article className="card doctor-chart-card doctor-chart-card--wide">
                  <h3>منحنى تدفق الحالات</h3>
                  <div className="doctor-chart-body">
                    <div className="sparkline doctor-sparkline">
                      {timeline.map((point, index) => (
                        <span key={point + index} style={{ height: `${point}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="row muted doctor-chart-foot">
                    <span>ذروة اليوم: 88 حالة</span>
                    <span>متوسط أسبوعي: 65</span>
                  </div>
                </article>
                <article className="card doctor-chart-card doctor-chart-card--donut">
                  <h3>مزيج شدة الحالات</h3>
                  <div className="doctor-donut-row">
                    <div className="donut doctor-donut" />
                    <div className="legend doctor-legend">
                      <p><i className="dot critical" /> حرج 24%</p>
                      <p><i className="dot medium" /> متوسط 41%</p>
                      <p><i className="dot mild" /> منخفض 35%</p>
                    </div>
                  </div>
                </article>
              </section>

              <section className="doctor-quick-section" aria-label="إجراءات سريعة">
                <div className="doctor-section-head">
                  <h3 className="doctor-section-title">إجراءات سريعة</h3>
                  <span className="doctor-section-hint">اختصارات للمهام اليومية</span>
                </div>
                <div className="doctor-quick-grid">
                  {doctorQuickActions.map((action) => (
                    <button key={action.label} type="button" className="doctor-quick-btn">
                      <span className="doctor-quick-btn-icon" aria-hidden="true">
                        {action.icon}
                      </span>
                      <span className="doctor-quick-btn-label">{action.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="doctor-split-panels" aria-label="مهام ومرضى">
                <article className="card doctor-panel">
                  <div className="doctor-panel-head">
                    <h3>مهام تحتاج اتخاذ إجراء</h3>
                    <span className="doctor-panel-badge">{doctorPendingTasks.length}</span>
                  </div>
                  <ul className="doctor-task-list">
                    {doctorPendingTasks.map((task) => (
                      <li key={task.id} className="doctor-task-item">
                        <button type="button" className="doctor-task-check" aria-label="تم">
                          ○
                        </button>
                        <div className="doctor-task-body">
                          <p className="doctor-task-text">{task.text}</p>
                          <span className="doctor-task-due">{task.due}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
                <article className="card doctor-panel">
                  <div className="doctor-panel-head">
                    <h3>آخر المرضى</h3>
                    <button type="button" className="doctor-panel-link">
                      عرض الكل
                    </button>
                  </div>
                  <div className="doctor-mini-table">
                    <div className="doctor-mini-head">
                      <span>الملف</span>
                      <span>المريض</span>
                      <span>آخر زيارة</span>
                      <span>الوقت</span>
                    </div>
                    {doctorRecentPatients.map((row) => (
                      <div key={row.id} className="doctor-mini-row">
                        <span className="doctor-mini-id">{row.id}</span>
                        <span>{row.name}</span>
                        <span className="muted doctor-mini-muted">{row.last}</span>
                        <span className="doctor-mini-when">{row.when}</span>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            </div>
          </section>
        )}

        {activeScreen === 'alerts' && (
          <div className="alerts-page doctor-main-surface">
            <section className="card alerts-card">
              <div className="alerts-card-head">
                <div>
                  <h3 className="alerts-card-title">سجل التنبيهات الحرجة</h3>
                  <p className="alerts-card-sub">
                    عرض مرتب حسب الأولوية — الحالات الظاهرة تحتاج مراجعة فورية
                  </p>
                </div>
                <span className="alerts-count-pill">{alerts.length} تنبيهات</span>
              </div>
              <div className="alerts-scroll">
                <div className="alerts-thead">
                  <span>رقم الحالة</span>
                  <span>نوع التنبيه</span>
                  <span>مستوى الثقة</span>
                  <span>الموقع</span>
                  <span>الاستجابة</span>
                </div>
                {alerts.map((item) => (
                  <div key={item.id} className="alerts-trow">
                    <span className="alerts-cell alerts-cell-id">{item.id}</span>
                    <span className="alerts-cell alerts-cell-type">{item.type}</span>
                    <span className="alerts-cell alerts-cell-score">
                      {Math.round(item.score * 100)}%
                    </span>
                    <span className="alerts-cell alerts-cell-room">{item.room}</span>
                    <span className={`tag alerts-tag ${item.status}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeScreen === 'caseDetails' && (
          <div className="patients-page doctor-main-surface">
            <aside className="card patients-sidebar">
              <div className="patients-sidebar-top">
                <h3 className="patients-sidebar-title">قائمة المرضى</h3>
                <span className="patients-sidebar-count">{caseFileVisible.length}</span>
              </div>
              <div className="patients-search">
                <label className="doctor-sr-only" htmlFor="patients-search-input">
                  بحث بهوية المريض أو رقم الملف
                </label>
                <div className="patients-search-inner">
                  <span className="patients-search-icon" aria-hidden="true">
                    🔍
                  </span>
                  <input
                    id="patients-search-input"
                    type="search"
                    className="patients-search-input"
                    placeholder="هوية، رقم ملف، أو اسم…"
                    value={caseFileSearch}
                    onChange={(e) => setCaseFileSearch(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>
              {caseFileVisible.length === 0 ? (
                <p className="patients-empty">لا توجد نتائج مطابقة للبحث</p>
              ) : (
                <ul className="patients-list">
                  {caseFileVisible.map((p) => (
                    <li key={p.fileId}>
                      <button
                        type="button"
                        className={`patients-row ${
                          selectedCasePatient?.fileId === p.fileId ? 'is-active' : ''
                        }`}
                        onClick={() => setCaseFilePatientId(p.fileId)}
                      >
                        <span className="patients-row-avatar" aria-hidden="true">
                          {p.name.charAt(0)}
                        </span>
                        <span className="patients-row-body">
                          <span className="patients-row-name">{p.name}</span>
                          <span className="patients-row-meta">
                            <span className="patients-row-file">{p.fileId}</span>
                            <span className="patients-row-nid">هوية {p.nationalId}</span>
                          </span>
                        </span>
                        <span className="patients-row-age">{p.age} سنة</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </aside>

            <div className="patients-main">
              {selectedCasePatient ? (
                <>
                  <header className="card patients-hero">
                    <span className="patients-hero-avatar" aria-hidden="true">
                      {selectedCasePatient.name.charAt(0)}
                    </span>
                    <div className="patients-hero-text">
                      <h3 className="patients-hero-name">{selectedCasePatient.name}</h3>
                      <div className="patients-hero-chips">
                        <span className="patients-chip">{selectedCasePatient.fileId}</span>
                        <span className="patients-chip patients-chip-muted">
                          هوية {selectedCasePatient.nationalId}
                        </span>
                      </div>
                    </div>
                  </header>
                  <section className="grid two patients-detail-grid">
                    <article className="card patients-panel">
                      <div className="patients-panel-head">
                        <h3>البيانات السريرية</h3>
                      </div>
                      <div className="patients-vitals-grid">
                        <div className="patients-vital-cell">
                          <span className="patients-vital-label">العمر</span>
                          <span className="patients-vital-value">
                            {selectedCasePatient.age} سنة
                          </span>
                        </div>
                        <div className="patients-vital-cell">
                          <span className="patients-vital-label">ضغط الدم</span>
                          <span className="patients-vital-value">{selectedCasePatient.bp}</span>
                        </div>
                        <div className="patients-vital-cell">
                          <span className="patients-vital-label">تشبع الأكسجين</span>
                          <span className="patients-vital-value">{selectedCasePatient.spo2}</span>
                        </div>
                        <div className="patients-vital-cell">
                          <span className="patients-vital-label">معدل النبض</span>
                          <span className="patients-vital-value">{selectedCasePatient.pulse}</span>
                        </div>
                        <div className="patients-vital-cell">
                          <span className="patients-vital-label">زمن الوصول</span>
                          <span className="patients-vital-value">
                            {selectedCasePatient.arrival}
                          </span>
                        </div>
                        <div className="patients-vital-cell patients-vital-cell-wide">
                          <span className="patients-vital-label">الهوية الوطنية</span>
                          <span className="patients-vital-value">
                            {selectedCasePatient.nationalId}
                          </span>
                        </div>
                      </div>
                    </article>
                    <article className="card patients-panel">
                      <div className="patients-panel-head">
                        <h3>نتيجة الفحص الأولي</h3>
                      </div>
                      <div className="scan patients-scan">{selectedCasePatient.scanLabel}</div>
                      <p className="muted patients-rec">{selectedCasePatient.recommendation}</p>
                    </article>
                  </section>
                </>
              ) : (
                <article className="card patients-empty-main">
                  <h3>لا يوجد مريض للعرض</h3>
                  <p className="muted">جرّب تعديل نص البحث أو مسح الحقل لعرض القائمة كاملة.</p>
                </article>
              )}
            </div>
          </div>
        )}

        {activeScreen === 'triage' && (
          <div className="triage-page doctor-main-surface">
            <section className="card triage-card">
              <div className="triage-card-head">
                <div>
                  <h3 className="triage-card-title">لوحة مسارات الفرز</h3>
                  <p className="triage-card-sub">
                    توزيع الحالات حسب مستوى الأولوية السريرية — ألوان المسار تساعد الفريق على التوجيه السريع
                  </p>
                </div>
                <span className="triage-count-pill">{triageActiveTotal} حالة في المسارات</span>
              </div>
              <div className="triage-scroll">
                <div className="triage-thead">
                  <span>المسار</span>
                  <span>عدد الحالات</span>
                  <span>زمن الانتظار</span>
                  <span>الإجراء المقترح</span>
                </div>
                {triageRows.map((row) => (
                  <div key={row.lane} className="triage-trow">
                    <span className="triage-cell triage-cell-lane">
                      <span
                        className={`triage-lane-dot triage-lane-dot--${row.laneKey}`}
                        aria-hidden
                      />
                      <span className="triage-lane-name">{row.lane}</span>
                    </span>
                    <span className="triage-cell triage-cell-count">{row.count}</span>
                    <span className="triage-cell triage-cell-wait">{row.wait}</span>
                    <span className="triage-cell triage-cell-action">
                      <span className={`triage-action-pill triage-action-pill--${row.laneKey}`}>
                        {row.next}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeScreen === 'vitals' && (
          <div className="vitals-page doctor-main-surface">
            <section className="vitals-grid">
              <article className="card vitals-card vitals-chart-card">
                <div className="vitals-card-head">
                  <h3>اتجاه العلامات الحيوية</h3>
                  <span className="vitals-head-pill">آخر 12 قراءة</span>
                </div>
                <div className="bars vitals-bars">
                  {timeline.map((point, index) => (
                    <span key={point + index} style={{ height: `${point}%` }} />
                  ))}
                </div>
              </article>
              <article className="card vitals-card">
                <div className="vitals-card-head">
                  <h3>ملاحظات تحليلية</h3>
                  <span className="vitals-head-pill vitals-head-pill--soft">مقروء آليًا</span>
                </div>
                <ul className="list vitals-list">
                  <li>تذبذب ضغط مستمر خلال آخر 20 دقيقة.</li>
                  <li>ارتفاع حمل التنفس مع انخفاض تشبع الأكسجين.</li>
                  <li>ارتباط النمط الحالي بمؤشر خطورة مرتفع.</li>
                </ul>
              </article>
            </section>
          </div>
        )}

        {activeScreen === 'differential' && (
          <div className="differential-page doctor-main-surface">
            <section className="card differential-card">
              <div className="differential-card-head">
                <div>
                  <h3 className="differential-title">ترجيح التشخيص</h3>
                  <p className="differential-sub">مقارنة الاحتمالات بناءً على أنماط المؤشرات الحيوية</p>
                </div>
                <span className="differential-pill">3 احتمالات رئيسية</span>
              </div>
              <div className="differential-grid">
                {[
                  ['نزيف دماغي', 82],
                  ['جلطة إقفارية', 67],
                  ['أزمة ضغط حادة', 49],
                ].map(([name, score]) => (
                  <article key={name} className="differential-item">
                    <h3>{name}</h3>
                    <strong className="score differential-score">{score}%</strong>
                    <div className="meter differential-meter">
                      <span style={{ width: `${score}%` }} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeScreen === 'optimization' && (
          <div className="optimization-page doctor-main-surface">
            <section className="optimization-grid">
              <article className="card optimization-card">
                <div className="optimization-card-head">
                  <h3>مؤشرات الكفاءة</h3>
                  <span className="optimization-pill">نتائج الأداء</span>
                </div>
                <ul className="list optimization-list">
                  <li>خفض إشغال الأسرة غير الضروري: 29%</li>
                  <li>رفع سرعة التوجيه السريري: 21%</li>
                  <li>تقليل زمن انتظار المسار الحرج: 17%</li>
                </ul>
              </article>
              <article className="card optimization-card">
                <div className="optimization-card-head">
                  <h3>اقتراحات تشغيلية</h3>
                  <span className="optimization-pill optimization-pill--soft">أولوية التنفيذ</span>
                </div>
                <ul className="list optimization-list">
                  <li>تحويل الحالات الخضراء إلى مركز الرعاية العاجلة.</li>
                  <li>تفعيل مسار تقييم سريع للحالات البرتقالية.</li>
                  <li>إعادة توزيع الطواقم في ساعات الذروة.</li>
                </ul>
              </article>
            </section>
          </div>
        )}

        {activeScreen === 'report' && (
          <div className="report-page doctor-main-surface">
            <section className="card report-card">
              <div className="report-card-head">
                <div>
                  <h3 className="report-title">الملخص التنفيذي</h3>
                  <p className="report-sub">
                    منصة العرض توضح الأثر المتوقع لنموذج الفرز الذكي عبر تقليل التأخير، رفع جودة
                    التوجيه، وتحسين كفاءة التشغيل في أقسام الطوارئ.
                  </p>
                </div>
                <span className="report-pill">ملخص يومي</span>
              </div>
              <div className="grid three compact report-metrics">
                <article className="mini report-mini">انخفاض وقت القرار الأولي: 18%</article>
                <article className="mini report-mini">تحسن سرعة التدخل: 22%</article>
                <article className="mini report-mini">تقليل الهدر التشغيلي: 27%</article>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
