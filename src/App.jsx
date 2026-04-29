import { useMemo, useState } from 'react'
import './App.css'

const screens = [
  { id: 'dashboard', label: 'اللوحة التنفيذية', note: 'نظرة تشغيلية فورية' },
  { id: 'alerts', label: 'غرفة التنبيهات', note: 'أولوية الحالات الحرجة' },
  { id: 'caseDetails', label: 'ملف الحالة', note: 'عرض سريري تفصيلي' },
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
  { lane: 'أحمر', count: 28, wait: '4 د', next: 'إدخال مباشر' },
  { lane: 'برتقالي', count: 44, wait: '11 د', next: 'فحص سريع' },
  { lane: 'أصفر', count: 59, wait: '23 د', next: 'تحويل منظم' },
  { lane: 'أخضر', count: 70, wait: '36 د', next: 'رعاية عاجلة' },
]

function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard')

  const current = useMemo(
    () => screens.find((item) => item.id === activeScreen) ?? screens[0],
    [activeScreen]
  )

  return (
    <div className="app" dir="rtl">
      <aside className="sidebar">
        <div className="brand">
          <h1>Enayah Operations</h1>
          <p>Medical Intelligence Demo</p>
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
            <p>آخر تحديث تشغيلي: 11:42 AM - نموذج عرض ببيانات تجريبية</p>
          </div>
          <div className="header-meta">
            <span className="pill">System Stable</span>
            <button type="button">وضع العرض التنفيذي</button>
          </div>
        </header>

        {activeScreen === 'dashboard' && (
          <>
            <section className="grid four">
              {kpis.map((kpi) => (
                <article key={kpi.title} className="card kpi">
                  <p>{kpi.title}</p>
                  <strong>{kpi.value}</strong>
                  <span className={kpi.tone}>{kpi.delta}</span>
                </article>
              ))}
            </section>
            <section className="grid two">
              <article className="card">
                <h3>منحنى تدفق الحالات</h3>
                <div className="sparkline">
                  {timeline.map((point, index) => (
                    <span key={point + index} style={{ height: `${point}%` }} />
                  ))}
                </div>
                <div className="row muted">
                  <span>ذروة اليوم: 88 حالة</span>
                  <span>متوسط أسبوعي: 65</span>
                </div>
              </article>
              <article className="card">
                <h3>مزيج شدة الحالات</h3>
                <div className="donut" />
                <div className="legend">
                  <p><i className="dot critical" /> حرج 24%</p>
                  <p><i className="dot medium" /> متوسط 41%</p>
                  <p><i className="dot mild" /> منخفض 35%</p>
                </div>
              </article>
            </section>
          </>
        )}

        {activeScreen === 'alerts' && (
          <section className="card table">
            <h3>سجل التنبيهات الحرجة</h3>
            <div className="table-head">
              <span>رقم الحالة</span>
              <span>نوع التنبيه</span>
              <span>مستوى الثقة</span>
              <span>الموقع</span>
              <span>الاستجابة</span>
            </div>
            {alerts.map((item) => (
              <div key={item.id} className="table-row">
                <span>{item.id}</span>
                <span>{item.type}</span>
                <span>{Math.round(item.score * 100)}%</span>
                <span>{item.room}</span>
                <span className={`tag ${item.status}`}>{item.status}</span>
              </div>
            ))}
          </section>
        )}

        {activeScreen === 'caseDetails' && (
          <section className="grid two">
            <article className="card">
              <h3>البيانات السريرية</h3>
              <ul className="list">
                <li>العمر: 63 سنة</li>
                <li>ضغط الدم: 160/100</li>
                <li>تشبع الأكسجين: 89%</li>
                <li>معدل النبض: 124</li>
                <li>زمن الوصول: 08:16 AM</li>
              </ul>
            </article>
            <article className="card">
              <h3>نتيجة الفحص الأولي</h3>
              <div className="scan">CT Preview Placeholder</div>
              <p className="muted">
                يوصى بتفعيل بروتوكول التدخل المبكر ورفع الحالة للمسار الحرج.
              </p>
            </article>
          </section>
        )}

        {activeScreen === 'triage' && (
          <section className="card table">
            <h3>لوحة مسارات الفرز</h3>
            <div className="table-head four-cols">
              <span>المسار</span>
              <span>عدد الحالات</span>
              <span>زمن الانتظار</span>
              <span>الإجراء المقترح</span>
            </div>
            {triageRows.map((row) => (
              <div key={row.lane} className="table-row four-cols">
                <span>{row.lane}</span>
                <span>{row.count}</span>
                <span>{row.wait}</span>
                <span>{row.next}</span>
              </div>
            ))}
          </section>
        )}

        {activeScreen === 'vitals' && (
          <section className="grid two">
            <article className="card">
              <h3>اتجاه العلامات الحيوية</h3>
              <div className="bars">
                {timeline.map((point, index) => (
                  <span key={point + index} style={{ height: `${point}%` }} />
                ))}
              </div>
            </article>
            <article className="card">
              <h3>ملاحظات تحليلية</h3>
              <ul className="list">
                <li>تذبذب ضغط مستمر خلال آخر 20 دقيقة.</li>
                <li>ارتفاع حمل التنفس مع انخفاض تشبع الأكسجين.</li>
                <li>ارتباط النمط الحالي بمؤشر خطورة مرتفع.</li>
              </ul>
            </article>
          </section>
        )}

        {activeScreen === 'differential' && (
          <section className="grid three">
            {[
              ['نزيف دماغي', 82],
              ['جلطة إقفارية', 67],
              ['أزمة ضغط حادة', 49],
            ].map(([name, score]) => (
              <article key={name} className="card">
                <h3>{name}</h3>
                <strong className="score">{score}%</strong>
                <div className="meter">
                  <span style={{ width: `${score}%` }} />
                </div>
              </article>
            ))}
          </section>
        )}

        {activeScreen === 'optimization' && (
          <section className="grid two">
            <article className="card">
              <h3>مؤشرات الكفاءة</h3>
              <ul className="list">
                <li>خفض إشغال الأسرة غير الضروري: 29%</li>
                <li>رفع سرعة التوجيه السريري: 21%</li>
                <li>تقليل زمن انتظار المسار الحرج: 17%</li>
              </ul>
            </article>
            <article className="card">
              <h3>اقتراحات تشغيلية</h3>
              <ul className="list">
                <li>تحويل الحالات الخضراء إلى مركز الرعاية العاجلة.</li>
                <li>تفعيل مسار تقييم سريع للحالات البرتقالية.</li>
                <li>إعادة توزيع الطواقم في ساعات الذروة.</li>
              </ul>
            </article>
          </section>
        )}

        {activeScreen === 'report' && (
          <section className="card">
            <h3>ملخص الإدارة التنفيذية</h3>
            <p className="muted">
              منصة العرض توضح الأثر المتوقع لنموذج الفرز الذكي عبر تقليل التأخير، رفع جودة
              التوجيه، وتحسين كفاءة التشغيل في أقسام الطوارئ.
            </p>
            <div className="grid three compact">
              <article className="mini">انخفاض وقت القرار الأولي: 18%</article>
              <article className="mini">تحسن سرعة التدخل: 22%</article>
              <article className="mini">تقليل الهدر التشغيلي: 27%</article>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
