import { ROUTES } from '@/constants/routes';
import AccountMenu from '@/components/shared/AccountMenu';

export default function CourierProfileMenu() {
  return <AccountMenu profileRoute={ROUTES.PROFILE} />;
}
