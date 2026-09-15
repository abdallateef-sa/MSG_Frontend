import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/shared/AppHeader';
import PortalBottomNav from '@/components/shared/PortalBottomNav';
import ShipmentTracker from '@/components/shared/ShipmentTracker';

export default function Shipments() {
  const { t, dir } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="dashboard-page" dir={dir}>
      <AppHeader
        title={t.shipments}
        variant={user.role === 'supervisor' ? 'supervisor' : 'dashboard'}
      />

      <main className="dashboard-main">
        <ShipmentTracker />
      </main>

      <PortalBottomNav activeTab="shipments" />
    </div>
  );
}
