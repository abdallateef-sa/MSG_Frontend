import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS } from '@/constants/requestStatus';
import Icon from '@/components/ui/Icon';

export default function HrRequests() {
  const { t } = useLanguage();
  const { requests } = useOnboarding();
  const navigate = useNavigate();

  const hiringRequests = requests.filter(
    (request) => request.status !== REQUEST_STATUS.PENDING_SUPERVISOR,
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{t.navRecruitment}</h1>
          <p>{t.hrOverviewHint}</p>
        </div>
        <span className="op-history-badge">{hiringRequests.length}</span>
      </div>

      {hiringRequests.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <Icon name="supervisor" size={32} />
            <p>{t.noRequests}</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {hiringRequests.map((request) => {
            const isActionNeeded =
              request.status === REQUEST_STATUS.PENDING_HR ||
              request.status === REQUEST_STATUS.PENDING_ABSHER ||
              request.status === REQUEST_STATUS.PENDING_CONTRACT;
            return (
              <div
                key={request.id}
                className="courier-card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderLeft: isActionNeeded ? '4px solid #139a43' : '4px solid #dce8e1',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '15px' }}>{request.fullName}</strong>
                    <code style={{ fontSize: '11px', color: '#6b7280' }}>{request.id}</code>
                    {request.sanadNumber && (
                      <span style={{ fontSize: '11px', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>
                        {request.sanadNumber}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#4b5563', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span className="req-meta-item">
                      <Icon name="location" size={13} />
                      {request.city}
                    </span>
                    <span className="req-meta-item">
                      <Icon name="phone" size={13} />
                      {request.phone}
                    </span>
                    <span className="req-meta-item">
                      <Icon name={request.hasVehicle ? 'vehicle' : 'building'} size={13} />
                      {request.hasVehicle ? t.ownVehicle : t.companyVehicle}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    className={`status ${
                      request.status === REQUEST_STATUS.ACTIVE
                        ? 'success'
                        : request.status === REQUEST_STATUS.CANCELLED
                          ? 'danger'
                          : 'info'
                    }`}
                    style={{ fontSize: '11px' }}
                  >
                    {request.status}
                  </span>
                  <button
                    className="primary-button"
                    type="button"
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                    onClick={() => navigate(`${ROUTES.HR_REQUESTS}/${request.id}`)}
                  >
                    {t.requestReview}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
