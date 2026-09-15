import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { SUPERVISORS } from '@/constants/supervisors';
import AppHeader from '@/components/shared/AppHeader';
import SupervisorBottomNav from '@/components/shared/SupervisorBottomNav';
import Icon from '@/components/ui/Icon';

function DataItem({ label, value, ltr = false }) {
  return (
    <div className="profile-data-item">
      <span className="profile-data-label">{label}</span>
      <span className="profile-data-val" dir={ltr ? 'ltr' : undefined}>
        {value}
      </span>
    </div>
  );
}

export default function SupervisorProfile() {
  const { t, lang, dir, toggleLang } = useLanguage();
  const { user, logout } = useAuth();
  const { requests } = useOnboarding();
  const navigate = useNavigate();

  const supervisor = SUPERVISORS.find((item) => item.id === user.id);
  const isAr = lang === 'ar';
  const name = (isAr ? supervisor?.nameAr : supervisor?.nameEn) || user.name;
  const phone = supervisor?.phone || '—';
  const email = supervisor?.email || '—';
  const region = (isAr ? supervisor?.regionAr : supervisor?.regionEn) || '—';
  const employeeId = supervisor?.employeeId || '—';
  const teamSize = requests.filter((req) => req.supervisorId === user.id).length;
  const initial = name.trim().charAt(0) || 'م';

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="profile-page" dir={dir}>
      <AppHeader title={t.profile} variant="supervisor" />

      <main className="profile-main">
        <section className="profile-hero">
          <div className="profile-avatar-large" aria-hidden="true">
            {initial}
          </div>
          <div className="profile-hero-info">
            <h1>{name}</h1>
            <div className="profile-hero-meta">
              <span className="status success profile-status-inline" style={{ fontSize: '11px' }}>
                <Icon name="supervisor" size={13} strokeWidth={2.2} />
                {t.roleSupervisor}
              </span>
              <span className="req-meta-item">
                <Icon name="phone" size={13} />
                <span dir="ltr">{phone}</span>
              </span>
              <span className="req-meta-item">
                <Icon name="supervisor" size={13} />
                {t.teamSize}: <b>{teamSize}</b>
              </span>
            </div>
          </div>
        </section>

        <section className="profile-card">
          <div className="profile-card-header">
            <div className="profile-card-icon">
              <Icon name="profile" size={18} />
            </div>
            <h2>{t.userInformation}</h2>
          </div>
          <div className="profile-data-grid">
            <DataItem label={t.fullName} value={name} />
            <DataItem label={t.employeeId} value={employeeId} ltr />
            <DataItem label={t.phone} value={phone} ltr />
            <DataItem label={t.email} value={email} ltr />
            <DataItem label={t.region} value={region} />
            <DataItem label={t.roleLabel} value={t.roleSupervisor} />
            <DataItem label={t.teamSize} value={teamSize} />
            <DataItem label={t.directSupervisor} value={name} />
          </div>
        </section>

        <section className="profile-card profile-actions-card">
          <button
            className="secondary-button"
            type="button"
            onClick={toggleLang}
            style={{ flex: 1, minWidth: '160px' }}
          >
            <Icon name="globe" size={18} />
            <span>
              {t.changeLanguage} ({isAr ? 'English' : 'العربية'})
            </span>
          </button>

          <button
            className="secondary-button"
            type="button"
            onClick={() => navigate(ROUTES.SUPERVISOR_DASHBOARD)}
            style={{ flex: 1, minWidth: '160px' }}
          >
            <Icon name="dashboard" size={18} />
            <span>{t.dashboard}</span>
          </button>

          <button
            className="secondary-button"
            type="button"
            onClick={handleLogout}
            style={{ flex: 1, minWidth: '160px', color: '#dc2626', borderColor: '#fca5a5' }}
          >
            <Icon name="logout" size={18} />
            <span>{t.logout}</span>
          </button>
        </section>
      </main>

      <SupervisorBottomNav />
    </div>
  );
}
