import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import BrandLogo from '@/components/ui/BrandLogo';
import LanguageButton from '@/components/ui/LanguageButton';
import Icon from '@/components/ui/Icon';

const NAV_GROUPS = [
  {
    groupKey: 'hrNavGeneral',
    items: [{ key: 'dashboard', labelKey: 'navDashboard', route: ROUTES.HR_DASHBOARD, icon: 'dashboard' }],
  },
  {
    groupKey: 'hrNavRecruitment',
    items: [
      { key: 'recruitment', labelKey: 'navRecruitment', route: ROUTES.HR_REQUESTS, icon: 'badgeCheck' },
    ],
  },
  {
    groupKey: 'hrNavPeople',
    items: [
      { key: 'employees', labelKey: 'navEmployees', route: ROUTES.HR_EMPLOYEES, icon: 'profile' },
      { key: 'supervisors', labelKey: 'navSupervisors', route: ROUTES.HR_SUPERVISORS, icon: 'userShield' },
      { key: 'documents', labelKey: 'navDocuments', route: ROUTES.HR_DOCUMENTS, icon: 'file' },
      { key: 'attendance', labelKey: 'navAttendance', route: ROUTES.HR_ATTENDANCE, icon: 'attendance' },
    ],
  },
  {
    groupKey: 'hrNavBusiness',
    items: [
      { key: 'operations', labelKey: 'navOperations', route: ROUTES.HR_OPERATIONS, icon: 'operations' },
      { key: 'contracts', labelKey: 'navContracts', route: ROUTES.HR_CONTRACTS, icon: 'file' },
      { key: 'fleet', labelKey: 'navFleet', route: ROUTES.HR_FLEET, icon: 'vehicle' },
    ],
  },
  {
    groupKey: 'hrNavFinance',
    items: [
      { key: 'financials', labelKey: 'navFinancials', route: ROUTES.HR_FINANCIALS, icon: 'financialAdvance' },
      { key: 'payroll', labelKey: 'navPayroll', route: ROUTES.HR_PAYROLL, icon: 'package' },
    ],
  },
  {
    groupKey: 'hrNavData',
    items: [
      { key: 'masterData', labelKey: 'masterDataTitle', route: ROUTES.HR_MASTER_DATA, icon: 'building' },
    ],
  },
  {
    groupKey: 'hrNavSystem',
    items: [
      { key: 'reports', labelKey: 'navReports', route: ROUTES.HR_REPORTS, icon: 'search' },
      { key: 'notifications', labelKey: 'navNotifications', route: ROUTES.HR_NOTIFICATIONS, icon: 'bell' },
      { key: 'audit', labelKey: 'navAudit', route: ROUTES.HR_AUDIT, icon: 'file' },
    ],
  },
];

function isItemActive(item, pathname) {
  if (item.soon) return false;
  return pathname === item.route || pathname.startsWith(`${item.route}/`);
}

export default function HrLayout() {
  const { t, dir } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('msg-hr-sidebar') === 'collapsed',
  );

  useEffect(() => {
    localStorage.setItem('msg-hr-sidebar', collapsed ? 'collapsed' : 'open');
  }, [collapsed]);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className={`admin-shell${collapsed ? ' is-collapsed' : ''}`} dir={dir}>
      <aside className="admin-sidebar">
        <button
          className="admin-sidebar__brand"
          type="button"
          onClick={() => navigate(ROUTES.HR_DASHBOARD)}
        >
          <BrandLogo compact />
        </button>

        <nav className="admin-nav">
          {NAV_GROUPS.map((group) => (
            <div className="admin-nav__group" key={group.groupKey}>
              <div className="admin-nav__title">{t[group.groupKey]}</div>
              {group.items.map((item) => {
                const active = isItemActive(item, location.pathname);
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={`admin-nav__item${active ? ' active' : ''}`}
                    disabled={item.soon}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => {
                      if (!item.soon) navigate(item.route);
                    }}
                  >
                    <Icon name={item.icon} size={18} strokeWidth={1.9} />
                    <span>{t[item.labelKey]}</span>
                    {item.soon && <span className="admin-nav__soon">{t.soon}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__start">
            <button
              className="icon-button"
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              aria-label={t.navDashboard}
              aria-expanded={!collapsed}
            >
              <Icon name="menu" size={20} strokeWidth={1.9} />
            </button>
            <span className="admin-topbar__title">{t.hrPortal}</span>
          </div>
          <div className="admin-topbar__actions">
            <LanguageButton />
            <button className="icon-button" type="button" aria-label={t.navNotifications}>
              <Icon name="bell" size={20} strokeWidth={1.8} />
            </button>
            <button className="secondary-button" type="button" onClick={handleLogout}>
              <Icon name="logout" size={16} strokeWidth={2} />
              <span>{t.logout}</span>
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
