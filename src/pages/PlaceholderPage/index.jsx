import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants/routes';
import { getArrow } from '@/utils/rtl';
import BrandLogo from '@/components/ui/BrandLogo';
import LanguageButton from '@/components/ui/LanguageButton';

const PLACEHOLDER_TITLES = {
  [ROUTES.VEHICLE_COMPENSATION]: { ar: 'تعويض مركبة', en: 'Vehicle Compensation' },
  [ROUTES.FINANCIAL_ADVANCE]: { ar: 'سلفة مالية', en: 'Financial Advance' },
  [ROUTES.ACCIDENT_REPORT]: { ar: 'بلاغ حادث', en: 'Accident Report' },
  [ROUTES.CANCEL_COMPENSATION]: { ar: 'إلغاء تعويض', en: 'Cancel Compensation' },
};

export default function PlaceholderPage() {
  const { t, lang, dir } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  const titles = PLACEHOLDER_TITLES[path] || { ar: 'قريباً', en: 'Coming Soon' };
  const title = lang === 'ar' ? titles.ar : titles.en;

  return (
    <div className="placeholder-page" dir={dir}>
      <header className="placeholder-header">
        <button
          className="topbar-brand"
          type="button"
          onClick={() => navigate(ROUTES.COURIER_DASHBOARD)}
        >
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

      <main className="placeholder-main">
        <div className="placeholder-content">
          <div className="placeholder-icon">🚧</div>
          <h1>{title}</h1>
          <p className="placeholder-text">{t.comingSoon}</p>
          <button
            className="primary-button"
            type="button"
            onClick={() => navigate(ROUTES.COURIER_DASHBOARD)}
          >
            {t.dashboard} <span>{getArrow(lang)}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
