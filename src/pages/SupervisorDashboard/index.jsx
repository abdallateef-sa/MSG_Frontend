import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { useOperations } from '@/context/OperationsContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS, OPERATION_STATUS } from '@/constants/requestStatus';
import { getAttendanceSummary } from '@/constants/mockAttendance';
import AppHeader from '@/components/shared/AppHeader';
import GreetingCard from '@/components/shared/GreetingCard';
import OperationRequestCard from '@/components/shared/OperationRequestCard';
import SupervisorBottomNav from '@/components/shared/SupervisorBottomNav';
import Icon from '@/components/ui/Icon';

export default function SupervisorDashboard() {
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const { requests } = useOnboarding();
  const { requests: operations } = useOperations();
  const navigate = useNavigate();

  const myCouriers = requests.filter((req) => req.supervisorId === user.id);
  const activeCouriers = myCouriers.filter((req) => req.status === REQUEST_STATUS.ACTIVE);

  const attendance = activeCouriers.map((courier) => {
    const history = getAttendanceSummary(courier.id).history;
    return history[history.length - 1]?.status;
  });
  const present = attendance.filter((status) => status === 'present').length;
  const absent = attendance.filter((status) => status === 'absent').length;

  // Requests raised by the supervisor's couriers (reviewed by the supervisor).
  const teamOperations = operations.filter(
    (req) => req.supervisorId === user.id && req.requesterRole !== 'supervisor',
  );
  // Requests raised by the supervisor himself (go straight to HR).
  const myOperations = operations.filter(
    (req) => req.supervisorId === user.id && req.requesterRole === 'supervisor',
  );

  const pendingHiring = myCouriers.filter(
    (req) => req.status === REQUEST_STATUS.PENDING_SUPERVISOR,
  ).length;
  const pendingOperations = teamOperations.filter(
    (req) => req.status === OPERATION_STATUS.PENDING_SUPERVISOR,
  ).length;
  const pendingTotal = pendingHiring + pendingOperations;

  const recentTeamOperations = teamOperations.slice(0, 3);
  const recentMyOperations = myOperations.slice(0, 3);

  return (
    <div className="dashboard-page" dir={dir}>
      <AppHeader title={t.supervisorDashboard} variant="supervisor" />

      <main className="dashboard-main">
        <GreetingCard name={user.name} status={t.supervisorPortal} zone={t.myCouriers} />

        <section className="operations-stats-grid">
          <button
            className="op-stat-card"
            type="button"
            onClick={() => navigate(ROUTES.SUPERVISOR_COURIERS)}
          >
            <span className="op-stat-num">{myCouriers.length}</span>
            <span className="op-stat-title">{t.totalCouriers}</span>
          </button>
          <div className="op-stat-card success">
            <span className="op-stat-num">{present}</span>
            <span className="op-stat-title">{t.presentToday}</span>
          </div>
          <div className="op-stat-card danger">
            <span className="op-stat-num">{absent}</span>
            <span className="op-stat-title">{t.absentToday}</span>
          </div>
          <button
            className="op-stat-card warning"
            type="button"
            onClick={() => navigate(ROUTES.SUPERVISOR_REQUESTS)}
          >
            <span className="op-stat-num">{pendingTotal}</span>
            <span className="op-stat-title">{t.pendingRequests}</span>
          </button>
        </section>

        <section className="quick-actions-section">
          <div className="section-header">
            <h2>{t.supervisorPortal}</h2>
          </div>
          <div className="quick-actions-grid">
            <button
              className="quick-action-btn"
              type="button"
              onClick={() => navigate(ROUTES.SUPERVISOR_REQUESTS)}
            >
              <span className="quick-action-icon">
                <Icon name="operations" size={26} strokeWidth={1.6} />
              </span>
              <span className="quick-action-label">{t.requestReview}</span>
            </button>
            <button
              className="quick-action-btn"
              type="button"
              onClick={() => navigate(ROUTES.SUPERVISOR_COURIERS)}
            >
              <span className="quick-action-icon">
                <Icon name="supervisor" size={26} strokeWidth={1.6} />
              </span>
              <span className="quick-action-label">{t.myCouriers}</span>
            </button>
            <button
              className="quick-action-btn"
              type="button"
              onClick={() => navigate(ROUTES.SUPERVISOR_ATTENDANCE)}
            >
              <span className="quick-action-icon">
                <Icon name="attendance" size={26} strokeWidth={1.6} />
              </span>
              <span className="quick-action-label">{t.teamAttendance}</span>
            </button>
            <button
              className="quick-action-btn"
              type="button"
              onClick={() => navigate(ROUTES.SUPERVISOR_SHIPMENTS)}
            >
              <span className="quick-action-icon">
                <Icon name="package" size={26} strokeWidth={1.6} />
              </span>
              <span className="quick-action-label">{t.shipments}</span>
            </button>
          </div>
        </section>

        {/* Team requests (raised by the supervisor's couriers) */}
        <section className="requests-section">
          <div className="section-header">
            <h2>{t.teamRequests}</h2>
            <button
              className="link-button"
              type="button"
              onClick={() => navigate(ROUTES.SUPERVISOR_REQUESTS)}
            >
              {t.viewAll}
            </button>
          </div>
          <div className="op-requests-list">
            {recentTeamOperations.length ? (
              recentTeamOperations.map((request) => (
                <OperationRequestCard
                  key={request.id}
                  request={request}
                  onClick={() => navigate(ROUTES.SUPERVISOR_REQUESTS)}
                />
              ))
            ) : (
              <div className="op-no-results">
                <Icon name="operations" size={36} />
                <p>{t.noRequests}</p>
              </div>
            )}
          </div>
        </section>

        {/* Supervisor's own requests (go straight to HR) */}
        <section className="requests-section">
          <div className="section-header">
            <h2>{t.myRequests}</h2>
            <button
              className="link-button"
              type="button"
              onClick={() => navigate(ROUTES.SUPERVISOR_OPERATIONS)}
            >
              {t.viewAll}
            </button>
          </div>
          <div className="op-requests-list">
            {recentMyOperations.length ? (
              recentMyOperations.map((request) => (
                <OperationRequestCard
                  key={request.id}
                  request={request}
                  onClick={() =>
                    navigate(ROUTES.SUPERVISOR_OPERATIONS, { state: { openRequestId: request.id } })
                  }
                />
              ))
            ) : (
              <div className="op-no-results">
                <Icon name="operations" size={36} />
                <p>{t.noRequests}</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <SupervisorBottomNav activeTab="dashboard" />
    </div>
  );
}
