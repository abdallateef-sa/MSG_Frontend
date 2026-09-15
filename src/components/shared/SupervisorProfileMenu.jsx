import { ROUTES } from '@/constants/routes';
import AccountMenu from '@/components/shared/AccountMenu';

export default function SupervisorProfileMenu() {
  return <AccountMenu profileRoute={ROUTES.SUPERVISOR_PROFILE} />;
}
