import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import AppHeader from '@/components/shared/AppHeader';
import GreetingCard from '@/components/shared/GreetingCard';
import SupervisorCard from '@/components/shared/SupervisorCard';
import VehicleCard from '@/components/shared/VehicleCard';
import QuickActionsGrid from '@/components/shared/QuickActionsGrid';
import RequestListItem from '@/components/shared/RequestListItem';
import BottomNav from '@/components/shared/BottomNav';
import { mockDashboard } from '@/constants/mockDashboard';

export default function CourierDashboard() {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const { hasVehicle } = useOnboarding();

  // Use mock data (later replaced by API)
  const data = mockDashboard;

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
          <div className="requests-list">
            {data.recentRequests.map((req) => (
              <RequestListItem
                key={req.id}
                title={req.title}
                requestId={req.id}
                date={req.date}
                status={req.status}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab="dashboard" />
    </div>
  );
}
