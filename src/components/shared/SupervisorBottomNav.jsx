import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants/routes';
import Icon from '@/components/ui/Icon';

const TABS = [
  { key: 'attendance', labelKey: 'attendance', route: ROUTES.SUPERVISOR_MY_ATTENDANCE, icon: 'attendance' },
  { key: 'operations', labelKey: 'operations', route: ROUTES.SUPERVISOR_OPERATIONS, icon: 'operations' },
  { key: 'requests', labelKey: 'reviewShort', route: ROUTES.SUPERVISOR_REQUESTS, icon: 'badgeCheck' },
  { key: 'couriers', labelKey: 'myCouriers', route: ROUTES.SUPERVISOR_COURIERS, icon: 'supervisor' },
  { key: 'dashboard', labelKey: 'dashboard', route: ROUTES.SUPERVISOR_DASHBOARD, icon: 'dashboard' },
];

export default function SupervisorBottomNav({ activeTab }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav" role="navigation" aria-label={t.supervisorDashboard}>
      {TABS.map(({ key, labelKey, route, icon }) => {
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
            <span className="bottom-nav-label">{t[labelKey]}</span>
          </button>
        );
      })}
    </nav>
  );
}
