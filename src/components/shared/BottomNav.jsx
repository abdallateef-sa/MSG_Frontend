import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants/routes';
import Icon from '@/components/ui/Icon';

const TABS = [
  { key: 'profile', route: ROUTES.PROFILE, icon: 'profile' },
  { key: 'attendance', route: ROUTES.ATTENDANCE, icon: 'attendance' },
  { key: 'operations', route: ROUTES.OPERATIONS, icon: 'operations' },
  { key: 'dashboard', route: ROUTES.COURIER_DASHBOARD, icon: 'dashboard' },
];

export default function BottomNav({ activeTab = 'dashboard' }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav" role="navigation" aria-label={t.dashboard}>
      {TABS.map(({ key, route, icon }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            className={`bottom-nav-item${isActive ? ' active' : ''}`}
            type="button"
            onClick={() => navigate(route)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="bottom-nav-icon-wrap">
              <Icon name={icon} size={22} strokeWidth={isActive ? 2.2 : 1.8} />
            </span>
            <span className="bottom-nav-label">{t[key]}</span>
          </button>
        );
      })}
    </nav>
  );
}
