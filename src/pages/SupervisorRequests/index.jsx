import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS } from '@/constants/requestStatus';
import AppHeader from '@/components/shared/AppHeader';

export default function SupervisorRequests() {
  const { t, dir } = useLanguage();
  const { requests } = useOnboarding();
  const navigate = useNavigate();

  return (
    <div className="onboarding-page" dir={dir}>
      <AppHeader title={t.supervisorRequests || 'طلبات المشرف'} />

      <main
        className="onboarding-main"
        style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '24px 16px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div>
            <div className="eyebrow">{t.msgLogistics}</div>
            <h1 style={{ margin: '4px 0' }}>{t.supervisorRequests || 'طلبات المناديب الجدد'}</h1>
            <p className="muted">
              {t.supervisorRequestsHint ||
                'مراجعة وتدقيق بيانات المناديب الجدد وتحديد الشركة والمخزن.'}
            </p>
          </div>
          <button
            className="secondary-button"
            onClick={() => navigate(ROUTES.HR_REQUESTS)}
            style={{ fontSize: '11px', padding: '6px 12px' }}
          >
            الانتقال لبوابة HR →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {requests.map((req) => {
            const isPending = req.status === REQUEST_STATUS.PENDING_SUPERVISOR;
            return (
              <div
                key={req.id}
                className="courier-card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderLeft: isPending ? '4px solid #139a43' : '4px solid #dce8e1',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                    }}
                  >
                    <strong style={{ fontSize: '15px' }}>{req.fullName}</strong>
                    <code style={{ fontSize: '11px', color: '#6b7280' }}>{req.id}</code>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#4b5563',
                      display: 'flex',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span>📍 {req.city}</span>
                    <span>📞 {req.phone}</span>
                    <span>{req.hasVehicle ? '🚗 يمتلك سيارة' : '🏢 بدون سيارة'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    className={`status ${
                      req.status === REQUEST_STATUS.CANCELLED
                        ? 'danger'
                        : req.status === REQUEST_STATUS.ACTIVE
                          ? 'success'
                          : isPending
                            ? 'info'
                            : ''
                    }`}
                    style={{ fontSize: '11px' }}
                  >
                    {req.status}
                  </span>
                  <button
                    className="primary-button"
                    type="button"
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                    onClick={() => navigate(`/supervisor/requests/${req.id}`)}
                  >
                    {t.viewDetails || 'مراجعة الطلب'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
