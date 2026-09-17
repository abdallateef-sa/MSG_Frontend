import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useMasterData } from '@/context/MasterDataContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS } from '@/constants/requestStatus';
import { getAttendanceSummary } from '@/constants/mockAttendance';
import { resolveAssignment } from '@/utils/assignment';
import AppHeader from '@/components/shared/AppHeader';
import SupervisorBottomNav from '@/components/shared/SupervisorBottomNav';
import Icon from '@/components/ui/Icon';

const STATUS_CLASS = {
  [REQUEST_STATUS.CANCELLED]: 'danger',
  [REQUEST_STATUS.ACTIVE]: 'success',
};

export default function SupervisorCouriers() {
  const { t, lang, dir } = useLanguage();
  const { user } = useAuth();
  const { companies } = useMasterData();
  const { requests } = useOnboarding();
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  const myCouriers = requests.filter((req) => req.supervisorId === user.id);

  return (
    <div className="dashboard-page" dir={dir}>
      <AppHeader title={t.myCouriers} variant="supervisor" />

      <main className="dashboard-main">
        <div className="section-header">
          <h2>{t.myCouriers}</h2>
          <span className="op-history-badge">{myCouriers.length}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {myCouriers.length === 0 && (
            <div className="op-no-results">
              <Icon name="supervisor" size={36} />
              <p>{t.noCouriers}</p>
            </div>
          )}

          {myCouriers.map((courier) => {
            const assignment = resolveAssignment(courier, isAr, companies);
            const history = getAttendanceSummary(courier.id).history;
            const today = history[history.length - 1];
            return (
              <div key={courier.id} className="courier-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '15px' }}>{courier.fullName}</strong>
                      <code style={{ fontSize: '11px', color: '#6b7280' }}>{courier.id}</code>
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#4b5563',
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap',
                        marginBottom: '8px',
                      }}
                    >
                      <span className="req-meta-item">
                        <Icon name="location" size={13} />
                        {courier.city}
                      </span>
                      <span className="req-meta-item">
                        <Icon name="phone" size={13} />
                        {courier.phone}
                      </span>
                      <span className="req-meta-item">
                        <Icon name={courier.hasVehicle ? 'vehicle' : 'building'} size={13} />
                        {courier.hasVehicle ? t.ownVehicle : t.companyVehicle}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#4b5563', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span className="req-meta-item">
                        <Icon name="building" size={13} />
                        {assignment ? `${assignment.company} · ${assignment.warehouse}` : t.notAssigned}
                      </span>
                      <span className="req-meta-item">
                        <Icon name="attendance" size={13} />
                        {today?.status === 'present' ? t.present : today?.status === 'absent' ? t.absent : t.notRecorded}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <span className={`status ${STATUS_CLASS[courier.status] || 'info'}`} style={{ fontSize: '11px' }}>
                      {courier.status}
                    </span>
                    <button
                      className="primary-button"
                      type="button"
                      style={{ padding: '8px 14px', fontSize: '12px' }}
                      onClick={() => navigate(`${ROUTES.SUPERVISOR_COURIERS}/${courier.id}`)}
                    >
                      {t.viewCourier}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <SupervisorBottomNav />
    </div>
  );
}
