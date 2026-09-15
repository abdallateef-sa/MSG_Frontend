import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import BrandLogo from '@/components/ui/BrandLogo';
import LanguageButton from '@/components/ui/LanguageButton';
import Icon from '@/components/ui/Icon';
import CourierProfileMenu from '@/components/shared/CourierProfileMenu';
import SupervisorProfileMenu from '@/components/shared/SupervisorProfileMenu';

/**
 * Shared top navigation bar.
 *
 * Props:
 *   title {string} - The centre label displayed between the logo and actions.
 *   variant {string} - 'onboarding' (default) | 'dashboard' | 'supervisor'
 *     - 'onboarding': logo button goes to login, shows logout
 *     - 'dashboard': courier dashboard header (bell + courier account menu)
 *     - 'supervisor': supervisor header (bell + supervisor account menu)
 */
export default function AppHeader({ title, variant = 'onboarding' }) {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const isCourier = variant === 'dashboard';
  const isSupervisor = variant === 'supervisor';
  const isPortal = isCourier || isSupervisor;

  return (
    <header className={`onboarding-top ${isPortal ? 'dashboard-top' : ''}`}>
      <button
        className="topbar-brand"
        type="button"
        onClick={() => navigate(isPortal ? (isSupervisor ? ROUTES.SUPERVISOR_DASHBOARD : ROUTES.COURIER_DASHBOARD) : ROUTES.LOGIN)}
      >
        <BrandLogo compact />
      </button>
      <span>{title}</span>
      <div>
        {isPortal ? (
          <>
            <button className="icon-button" type="button" aria-label={t.notifications}>
              <Icon name="bell" size={20} strokeWidth={1.8} />
            </button>
            {isSupervisor ? <SupervisorProfileMenu /> : <CourierProfileMenu />}
          </>
        ) : (
          <>
            <LanguageButton />
            <button
              className="link-button"
              type="button"
              onClick={() => {
                logout();
                navigate(ROUTES.LOGIN);
              }}
            >
              {t.logout}
            </button>
          </>
        )}
      </div>
    </header>
  );
}
