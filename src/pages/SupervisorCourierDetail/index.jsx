import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { getAttendanceSummary } from '@/constants/mockAttendance';
import AppHeader from '@/components/shared/AppHeader';
import CourierApplicationInfo from '@/components/shared/CourierApplicationInfo';
import SupervisorBottomNav from '@/components/shared/SupervisorBottomNav';
import Icon from '@/components/ui/Icon';

const ABSENCE_REASON_LABELS = {
  sick: { ar: 'مرض', en: 'Sick leave' },
  leave: { ar: 'إجازة معتمدة', en: 'Approved leave' },
  emergency: { ar: 'ظرف طارئ', en: 'Emergency' },
};

export default function SupervisorCourierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang, dir } = useLanguage();
  const { user } = useAuth();
  const { requests } = useOnboarding();
  const isAr = lang === 'ar';

  const courier = requests.find((req) => req.id === id && req.supervisorId === user.id);

  if (!courier) {
    return (
      <div className="dashboard-page" dir={dir}>
        <AppHeader title={t.courierDetails} variant="supervisor" />
        <main className="dashboard-main">
          <div className="courier-card">
            <h2>{t.noCouriers}</h2>
            <button
              className="secondary-button"
              type="button"
              onClick={() => navigate(ROUTES.SUPERVISOR_COURIERS)}
            >
              {t.backToCouriers}
            </button>
          </div>
        </main>
        <SupervisorBottomNav />
      </div>
    );
  }

  const attendance = getAttendanceSummary(courier.id, lang);

  return (
    <div className="dashboard-page" dir={dir}>
      <AppHeader title={t.courierDetails} variant="supervisor" />

      <main className="dashboard-main">
        <button
          className="link-button"
          type="button"
          style={{ marginBottom: '16px' }}
          onClick={() => navigate(ROUTES.SUPERVISOR_COURIERS)}
        >
          ← {t.backToCouriers}
        </button>

        <div className="courier-card">
          <CourierApplicationInfo request={courier} />
        </div>

        <section className="courier-card" style={{ marginTop: '16px' }}>
          <div className="section-title">
            <Icon name="attendance" size={18} />
            <h2>{t.attendanceFor}</h2>
          </div>

          <div className="operations-stats-grid" style={{ marginTop: '12px' }}>
            <div className="op-stat-card success">
              <span className="op-stat-num">{attendance.present}</span>
              <span className="op-stat-title">{t.presentDays}</span>
            </div>
            <div className="op-stat-card danger">
              <span className="op-stat-num">{attendance.absent}</span>
              <span className="op-stat-title">{t.absentDays}</span>
            </div>
          </div>

          <div className="attendance-calendar" style={{ marginTop: '16px' }}>
            {attendance.history.map((day) => (
              <div className="attendance-day" key={day.date}>
                <span className="attendance-day-label">{day.weekday}</span>
                <span className={`attendance-day-number ${day.status}`}>{day.day}</span>
                <span className="attendance-day-status">
                  {day.status === 'present'
                    ? t.present
                    : day.reason
                      ? isAr
                        ? ABSENCE_REASON_LABELS[day.reason]?.ar
                        : ABSENCE_REASON_LABELS[day.reason]?.en
                      : t.absent}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SupervisorBottomNav />
    </div>
  );
}
