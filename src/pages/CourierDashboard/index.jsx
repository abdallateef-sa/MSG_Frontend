import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { useOperations } from '@/context/OperationsContext';
import { ROUTES } from '@/constants/routes';
import AppHeader from '@/components/shared/AppHeader';
import GreetingCard from '@/components/shared/GreetingCard';
import SupervisorCard from '@/components/shared/SupervisorCard';
import VehicleCard from '@/components/shared/VehicleCard';
import QuickActionsGrid from '@/components/shared/QuickActionsGrid';
import OperationRequestCard from '@/components/shared/OperationRequestCard';
import CourierBottomNav from '@/components/shared/CourierBottomNav';
import { mockDashboard } from '@/constants/mockDashboard';

const RECENT_REQUESTS_LIMIT = 3;

export default function CourierDashboard() {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const { hasVehicle } = useOnboarding();
  const { requests } = useOperations();

  // Use mock data (later replaced by API)
  const data = mockDashboard;
  const recentRequests = requests.slice(0, RECENT_REQUESTS_LIMIT);

  return (
    <div className="dashboard-page" dir={dir}>
      <AppHeader title={t.logisticsHub} variant="dashboard" />

      <main className="dashboard-main">
        {/* Greeting + zone/status badges */}
        <GreetingCard name={data.courierName} status={t.activeOnDuty} zone={data.zone} />

        {/* Vehicle + Supervisor side by side */}
        <div className="info-cards-row">
          {hasVehicle && data.vehicle && (
            <VehicleCard
              plate={data.vehicle.plate}
              model={data.vehicle.model}
              badge={data.vehicle.badge}
            />
          )}
          <SupervisorCard name={data.supervisor.name} phone={data.supervisor.phone} />
        </div>

        {/* Operations Center */}
        <section className="quick-actions-section">
          <div className="section-header">
            <h2>{t.operationsCenter}</h2>
            <button
              className="link-button"
              type="button"
              onClick={() => navigate(ROUTES.OPERATIONS)}
            >
              {t.viewAll}
            </button>
          </div>
          <QuickActionsGrid />
        </section>

        {/* Recent Requests */}
        <section className="requests-section">
          <div className="section-header">
            <h2>{t.recentRequests}</h2>
            <button
              className="link-button"
              type="button"
              onClick={() => navigate(ROUTES.OPERATIONS)}
            >
              {t.viewAll}
            </button>
          </div>
          <div className="op-requests-list">
            {recentRequests.map((request) => (
              <OperationRequestCard
                key={request.id}
                request={request}
                onClick={() =>
                  navigate(ROUTES.OPERATIONS, { state: { openRequestId: request.id } })
                }
              />
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <CourierBottomNav activeTab="dashboard" />
    </div>
  );
}
