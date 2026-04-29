import { useMemo, useState } from 'react'
import './App.css'

const screens = [
  { id: 'dashboard', label: 'لوحة القيادة', challenge: 'متابعة الطوارئ لحظيًا' },
  { id: 'alerts', label: 'مركز التنبيهات', challenge: 'إنذار مبكر للتدهور' },
  { id: 'caseDetails', label: 'تفاصيل الحالة', challenge: 'دعم القرار السريري' },
  { id: 'triage', label: 'الفرز الذكي', challenge: 'تقليل ضغط الطوارئ' },
  { id: 'vitals', label: 'أنماط العلامات', challenge: 'اكتشاف الأنماط الخفية' },
  { id: 'differential', label: 'التشخيصات المحتملة', challenge: 'اقتراح أقرب 3 تشخيصات' },
  { id: 'optimization', label: 'تحسين الموارد', challenge: 'تقليل الهدر الصحي' },
  { id: 'report', label: 'عرض الأثر', challenge: 'قصة تأثير واضحة للجنة' },
]

const kpiCards = [
  { title: 'حالات الطوارئ النشطة', value: '148', trend: '+12%' },
  { title: 'تنبيهات حرجة اليوم', value: '27', trend: '+4%' },
  { title: 'زمن الاستجابة المبكر', value: '6.5 د', trend: '-18%' },
  { title: 'تحويلات الرعاية العاجلة', value: '63', trend: '+22%' },
]

const alerts = [
  { patient: 'مريض #A-204', type: 'اشتباه نزيف دماغي', severity: 'حرج', eta: 'خلال 3 دقائق' },
  { patient: 'مريض #C-112', type: 'خطر جلطة حاد', severity: 'مرتفع', eta: 'خلال 7 دقائق' },
  { patient: 'مريض #B-009', type: 'تدهور أكسجين متسارع', severity: 'متوسط', eta: 'خلال 12 دقيقة' },
]

function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard')

  const currentScreen = useMemo(
    () => screens.find((screen) => screen.id === activeScreen) ?? screens[0],
    [activeScreen]
  )

  return (
    <div className="demo-shell" dir="rtl">
      <aside className="side-nav">
        <h1>Enayah AI</h1>
        <p className="subtitle">منصة تجريبية للتقنيات الصحية المدعومة بالذكاء الاصطناعي</p>
        <nav>
          {screens.map((screen) => (
            <button
              key={screen.id}
              type="button"
              className={`nav-item ${activeScreen === screen.id ? 'active' : ''}`}
              onClick={() => setActiveScreen(screen.id)}
            >
              <span>{screen.label}</span>
              <small>{screen.challenge}</small>
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="top-bar">
          <div>
            <h2>{currentScreen.label}</h2>
            <p>نسخة عرض توضيحية فقط - بيانات وهمية غير طبية</p>
          </div>
        </header>

        {activeScreen === 'dashboard' && (
          <section className="screen-grid">
            {kpiCards.map((card) => (
              <article key={card.title} className="card kpi-card">
                <h3>{card.title}</h3>
                <strong>{card.value}</strong>
                <span>{card.trend}</span>
              </article>
            ))}
          </section>
        )}

        {activeScreen === 'alerts' && (
          <section className="card list-card">
            <h3>تنبيهات Red Flag</h3>
            {alerts.map((alert) => (
              <div key={alert.patient} className="list-row">
                <div>
                  <strong>{alert.patient}</strong>
                  <p>{alert.type}</p>
                </div>
                <div className={`badge ${alert.severity}`}>
                  {alert.severity} - {alert.eta}
                </div>
              </div>
            ))}
          </section>
        )}

        {activeScreen === 'caseDetails' && (
          <section className="screen-grid two-col">
            <article className="card">
              <h3>معلومات الحالة</h3>
              <p>العمر: 57 سنة - ضغط: 150/95 - نبض: 118</p>
              <p>عرض رئيسي: صداع حاد مع ضعف مفاجئ بالجانب الأيسر.</p>
            </article>
            <article className="card">
              <h3>مراجعة الأشعة (Placeholder)</h3>
              <div className="placeholder">صورة أشعة تجريبية</div>
              <p>التنبيه: احتمال نزيف داخلي - يلزم تقييم فوري.</p>
            </article>
          </section>
        )}

        {activeScreen === 'triage' && (
          <section className="screen-grid three-col">
            <article className="card">
              <h3>حالات ساخنة</h3>
              <p>29 حالة - أولوية قصوى</p>
            </article>
            <article className="card">
              <h3>حالات متوسطة</h3>
              <p>47 حالة - مراقبة دقيقة</p>
            </article>
            <article className="card">
              <h3>حالات باردة</h3>
              <p>72 حالة - تحويل للرعاية العاجلة</p>
            </article>
          </section>
        )}

        {activeScreen === 'vitals' && (
          <section className="card list-card">
            <h3>أنماط حيوية خفية (Dummy)</h3>
            <div className="list-row">
              <strong>نمط 1</strong>
              <p>ارتفاع نبض + هبوط أكسجين + تسارع تنفس = خطر تدهور مبكر.</p>
            </div>
            <div className="list-row">
              <strong>نمط 2</strong>
              <p>تذبذب ضغط متكرر مع صداع مفاجئ = احتمال جلطة مرتفع.</p>
            </div>
            <div className="list-row">
              <strong>نمط 3</strong>
              <p>مؤشرات مستقرة لكن حرارة مرتفعة = مسار متابعة غير إسعافي.</p>
            </div>
          </section>
        )}

        {activeScreen === 'differential' && (
          <section className="screen-grid three-col">
            <article className="card">
              <h3>1) نزيف دماغي</h3>
              <strong>81%</strong>
            </article>
            <article className="card">
              <h3>2) جلطة إقفارية</h3>
              <strong>66%</strong>
            </article>
            <article className="card">
              <h3>3) أزمة ضغط حادة</h3>
              <strong>43%</strong>
            </article>
          </section>
        )}

        {activeScreen === 'optimization' && (
          <section className="screen-grid two-col">
            <article className="card">
              <h3>أثر تشغيلي متوقع</h3>
              <p>تقليل إشغال الأسرة غير الضروري بنسبة 31%.</p>
              <p>خفض زمن الانتظار للحالات الحرجة بنسبة 24%.</p>
            </article>
            <article className="card">
              <h3>توجيه الحالات البسيطة</h3>
              <p>تحويل آلي مقترح إلى مراكز الرعاية العاجلة أو العيادات الممتدة.</p>
            </article>
          </section>
        )}

        {activeScreen === 'report' && (
          <section className="card presentation-card">
            <h3>رسالة العرض</h3>
            <p>
              هذا النموذج يوضح كيف يمكن للذكاء الاصطناعي رفع سرعة الاستجابة، دعم الطبيب، وتقليل
              الهدر المالي والتشغيلي في الطوارئ.
            </p>
            <ul>
              <li>إنذار مبكر للحالات الحرجة قبل التقرير النهائي.</li>
              <li>اقتراح تشخيصات أولية لتسريع القرار السريري.</li>
              <li>فرز ذكي يضمن توجيه كل مريض للمسار الأنسب.</li>
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
