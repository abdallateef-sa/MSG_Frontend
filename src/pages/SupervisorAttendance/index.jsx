import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS } from '@/constants/requestStatus';
import { getCourierAttendance, getAttendanceSummary } from '@/constants/mockAttendance';
import AppHeader from '@/components/shared/AppHeader';
import SupervisorBottomNav from '@/components/shared/SupervisorBottomNav';
import Icon from '@/components/ui/Icon';

export default function SupervisorAttendance() {
  const { t, lang, dir } = useLanguage();
  const { user } = useAuth();
  const { requests } = useOnboarding();
  const navigate = useNavigate();

  const myCouriers = requests.filter(
    (req) => req.supervisorId === user.id && req.status === REQUEST_STATUS.ACTIVE,
  );

  const weekdays = getCourierAttendance(myCouriers[0]?.id || 'seed', lang).map((day) => day.weekday);

  return (
    <div className="dashboard-page" dir={dir}>
      <AppHeader title={t.attendance} variant="supervisor" />

      <main className="dashboard-main">
        <div className="section-header">
          <h2>{t.attendanceSummary}</h2>
          <span className="op-history-badge">{myCouriers.length}</span>
        </div>

        {myCouriers.length === 0 ? (
          <div className="op-no-results">
            <Icon name="attendance" size={36} />
            <p>{t.noCouriers}</p>
          </div>
        ) : (
          <div className="courier-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="supervisor-attendance-grid supervisor-attendance-grid--head">
              <span>{t.courierDetails}</span>
              {weekdays.map((label, index) => (
                <span key={`${label}-${index}`}>{label}</span>
              ))}
              <span>{t.presentToday}</span>
            </div>

            {myCouriers.map((courier) => {
              const summary = getAttendanceSummary(courier.id, lang);
              return (
                <button
                  key={courier.id}
                  type="button"
                  className="supervisor-attendance-grid supervisor-attendance-grid--row"
                  onClick={() => navigate(`${ROUTES.SUPERVISOR_COURIERS}/${courier.id}`)}
                >
                  <span className="supervisor-attendance-name">{courier.fullName}</span>
                  {summary.history.map((day) => (
                    <span
                      key={day.date}
                      className={`attendance-day-number ${day.status}`}
                      title={day.status === 'present' ? t.present : t.absent}
                    >
                      {day.day}
                    </span>
                  ))}
                  <span className="supervisor-attendance-total">{summary.present}</span>
                </button>
              );
            })}
          </div>
        )}
      </main>

      <SupervisorBottomNav />
    </div>
  );
}
