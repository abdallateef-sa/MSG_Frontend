import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { useOperations } from '@/context/OperationsContext';
import { REQUEST_STATUS, OPERATION_STATUS } from '@/constants/requestStatus';
import { buildEmployeeDocuments } from '@/constants/mockHrDocuments';
import { ROUTES } from '@/constants/routes';
import Icon from '@/components/ui/Icon';

export default function HrNotifications() {
  const { t } = useLanguage();
  const { requests } = useOnboarding();
  const { requests: operations } = useOperations();
  const navigate = useNavigate();

  const notifications = useMemo(() => {
    const activeEmployees = requests.filter((request) => request.status === REQUEST_STATUS.ACTIVE);
    const pendingHiring = requests.filter(
      (request) => request.status === REQUEST_STATUS.PENDING_HR,
    ).length;
    const pendingOperations = operations.filter(
      (request) =>
        request.status === OPERATION_STATUS.PENDING_HR && request.category !== 'financial',
    ).length;
    const pendingFinancials = operations.filter(
      (request) =>
        request.status === OPERATION_STATUS.PENDING_HR && request.category === 'financial',
    ).length;
    const expiringDocs = buildEmployeeDocuments(activeEmployees).filter(
      (doc) => doc.status === 'expiring' || doc.status === 'expired',
    ).length;

    return [
      { key: 'notifPendingHiring', value: pendingHiring, icon: 'badgeCheck', route: ROUTES.HR_REQUESTS },
      { key: 'notifPendingOperations', value: pendingOperations, icon: 'operations', route: ROUTES.HR_OPERATIONS },
      { key: 'notifPendingFinancials', value: pendingFinancials, icon: 'financialAdvance', route: ROUTES.HR_FINANCIALS },
      { key: 'notifExpiringDocs', value: expiringDocs, icon: 'file', route: ROUTES.HR_DOCUMENTS },
    ].filter((item) => item.value > 0);
  }, [requests, operations]);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{t.notificationsTitle}</h1>
          <p>{t.notificationsHint}</p>
        </div>
      </div>

      <div className="admin-card">
        {notifications.length === 0 ? (
          <div className="admin-empty">
            <Icon name="bell" size={32} />
            <p>{t.noNotifications}</p>
          </div>
        ) : (
          <div className="admin-activity">
            {notifications.map((item) => (
              <button
                key={item.key}
                type="button"
                className="admin-activity__row"
                onClick={() => navigate(item.route)}
              >
                <div className="req-meta-item">
                  <Icon name={item.icon} size={16} strokeWidth={1.9} />
                  <span className="admin-activity__name">{t[item.key]}</span>
                </div>
                <span className="admin-badge admin-badge--warning">{item.value}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
