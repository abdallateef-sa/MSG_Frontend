import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants/routes';
import BrandLogo from '@/components/ui/BrandLogo';
import LanguageButton from '@/components/ui/LanguageButton';

/**
 * Shared top navigation bar used in OnboardingLayout and CourierStatus.
 *
 * Props:
 *   title {string} - The centre label displayed between the logo and actions.
 */
export default function AppHeader({ title }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="onboarding-top">
      <button className="topbar-brand" type="button" onClick={() => navigate(ROUTES.LOGIN)}>
        <BrandLogo compact />
      </button>
      <span>{title}</span>
      <div>
        <LanguageButton />
        <button className="link-button" type="button" onClick={() => navigate(ROUTES.LOGIN)}>
          {t.logout}
        </button>
      </div>
    </header>
  );
}
