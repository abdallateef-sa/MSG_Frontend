import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants/routes';
import BrandLogo from '@/components/ui/BrandLogo';
import LanguageButton from '@/components/ui/LanguageButton';
import Icon from '@/components/ui/Icon';
import ProfileMenu from '@/components/shared/ProfileMenu';

/**
 * Shared top navigation bar.
 *
 * Props:
 *   title {string} - The centre label displayed between the logo and actions.
 *   variant {string} - 'onboarding' (default) | 'dashboard'
 *     - 'onboarding': logo button goes to login, shows logout
 *     - 'dashboard': logo button goes to dashboard, shows notification bell + avatar
 */
export default function AppHeader({ title, variant = 'onboarding' }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const isDashboard = variant === 'dashboard';

  return (
    <header className={`onboarding-top ${isDashboard ? 'dashboard-top' : ''}`}>
      <button
        className="topbar-brand"
        type="button"
        onClick={() => navigate(isDashboard ? ROUTES.COURIER_DASHBOARD : ROUTES.LOGIN)}
      >
        <BrandLogo compact />
      </button>
      <span>{title}</span>
      <div>
        {isDashboard ? (
          <>
            <button className="icon-button" type="button" aria-label={t.notifications}>
              <Icon name="bell" size={20} strokeWidth={1.8} />
            </button>
            <ProfileMenu />
          </>
        ) : (
          <>
            <LanguageButton />
            <button className="link-button" type="button" onClick={() => navigate(ROUTES.LOGIN)}>
              {t.logout}
            </button>
          </>
        )}
      </div>
    </header>
  );
}
