import { useAuth, ROLES } from '@/context/AuthContext';
import CourierBottomNav from '@/components/shared/CourierBottomNav';
import SupervisorBottomNav from '@/components/shared/SupervisorBottomNav';

/**
 * Bottom navigation for pages shared between the courier and supervisor portals
 * (operations, attendance, shipments). Renders the navigation that matches the
 * active role. Dashboards use their own dedicated nav components directly.
 */
export default function PortalBottomNav({ activeTab }) {
  const { user } = useAuth();
  return user.role === ROLES.SUPERVISOR ? (
    <SupervisorBottomNav activeTab={activeTab} />
  ) : (
    <CourierBottomNav activeTab={activeTab} />
  );
}
