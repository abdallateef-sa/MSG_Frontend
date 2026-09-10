import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { COMPANIES } from '@/constants/companies';
import { mockDashboard } from '@/constants/mockDashboard';
import AppHeader from '@/components/shared/AppHeader';
import BottomNav from '@/components/shared/BottomNav';
import Icon from '@/components/ui/Icon';

export default function UserProfile() {
  const { t, lang, dir, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const { personal, vehicleBank, hasVehicle, currentRequest } = useOnboarding();

  // Consolidate data from context with fallback to current mock request & dashboard
  const fullName =
    personal?.fullName ||
    currentRequest?.fullName ||
    mockDashboard.courierName ||
    'عبدالله محمد الغامدي';
  const nationalId = personal?.idNumber || currentRequest?.nationalId || '1098765432';
  const dob = personal?.dob || '1995-05-12';
  const nationality = personal?.nationality || (lang === 'ar' ? 'سعودي' : 'Saudi');
  const phone = personal?.phone || currentRequest?.phone || '501234567';
  const city = personal?.city || currentRequest?.city || 'Riyadh';

  const userHasVehicle = hasVehicle ?? currentRequest?.hasVehicle ?? true;
  const vehiclePlate =
    vehicleBank?.plate ||
    currentRequest?.vehiclePlate ||
    mockDashboard.vehicle?.plate ||
    'س م ر 4567';
  const vehicleType =
    vehicleBank?.type || currentRequest?.vehicleType || mockDashboard.vehicle?.model || 'Sedan';
  const fuelCard = mockDashboard.vehicle?.badge || 'PetroApp: 9021';

  const bankName = vehicleBank?.bank || currentRequest?.bankName || 'Al Rajhi Bank';
  const iban = vehicleBank?.iban || currentRequest?.iban || 'SA0000000000000000000000';

  // Work & Assignment Info
  const companyObj = COMPANIES.find((c) => c.id === currentRequest?.companyId) || COMPANIES[0];
  const companyName = lang === 'ar' ? companyObj.nameAr : companyObj.nameEn;

  const warehouseObj =
    companyObj.warehouses.find((w) => w.id === currentRequest?.warehouseId) ||
    companyObj.warehouses[0];
  const warehouseName = lang === 'ar' ? warehouseObj.nameAr : warehouseObj.nameEn;

  const supervisorName = mockDashboard.supervisor?.name || 'خالد عبدالله';
  const supervisorPhone = mockDashboard.supervisor?.phone || '+966500000000';
  const sanadNumber = currentRequest?.sanadNumber || 'SND-99881';
  const appId = currentRequest?.id || 'APP-2026-1043';

  const initialLetter = fullName.trim().charAt(0) || 'م';

  return (
    <div className="profile-page" dir={dir}>
      <AppHeader title={t.profile} variant="dashboard" />

      <main className="profile-main">
        {/* Profile Hero / Summary Banner */}
        <section className="profile-hero">
          <div className="profile-avatar-large" aria-hidden="true">
            {initialLetter}
          </div>
          <div className="profile-hero-info">
            <h1>{fullName}</h1>
            <div className="profile-hero-meta">
              <span className="status success" style={{ fontSize: '11px' }}>
                ✓ {t.accountStatusActive}
              </span>
              <span>
                {t.courierIdBadge}: <b>{appId}</b>
              </span>
              <span>📍 {city}</span>
              <span>📦 {mockDashboard.zone || '1Mile'}</span>
            </div>
          </div>
        </section>

        {/* Section 1: Personal Information */}
        <section className="profile-card">
          <div className="profile-card-header">
            <div className="profile-card-icon">
              <Icon name="profile" size={18} />
            </div>
            <h2>{t.personal}</h2>
          </div>
          <div className="profile-data-grid">
            <div className="profile-data-item">
              <span className="profile-data-label">{t.fullName}</span>
              <span className="profile-data-val">{fullName}</span>
            </div>
            <div className="profile-data-item">
              <span className="profile-data-label">{t.id}</span>
              <span className="profile-data-val" dir="ltr" style={{ textAlign: 'start' }}>
                {nationalId}
              </span>
            </div>
            <div className="profile-data-item">
              <span className="profile-data-label">{t.dob}</span>
              <span className="profile-data-val" dir="ltr" style={{ textAlign: 'start' }}>
                {dob}
              </span>
            </div>
            <div className="profile-data-item">
              <span className="profile-data-label">{t.nationality}</span>
              <span className="profile-data-val">{nationality}</span>
            </div>
            <div className="profile-data-item">
              <span className="profile-data-label">{t.phone}</span>
              <span className="profile-data-val" dir="ltr" style={{ textAlign: 'start' }}>
                +966 {phone}
              </span>
            </div>
            <div className="profile-data-item">
              <span className="profile-data-label">{t.city}</span>
              <span className="profile-data-val">{city}</span>
            </div>
          </div>
        </section>

        {/* Section 2: Work & Assignment Information */}
        <section className="profile-card">
          <div className="profile-card-header">
            <div className="profile-card-icon">
              <Icon name="operations" size={18} />
            </div>
            <h2>{t.employmentInfo}</h2>
          </div>
          <div className="profile-data-grid">
            <div className="profile-data-item">
              <span className="profile-data-label">{t.assignedCompany}</span>
              <span className="profile-data-val">{companyName}</span>
            </div>
            <div className="profile-data-item">
              <span className="profile-data-label">{t.assignedWarehouse}</span>
              <span className="profile-data-val">{warehouseName}</span>
            </div>
            <div className="profile-data-item">
              <span className="profile-data-label">{t.directSupervisor}</span>
              <span className="profile-data-val">
                {supervisorName}{' '}
                <a
                  href={`tel:${supervisorPhone}`}
                  dir="ltr"
                  style={{ color: '#139a43', textDecoration: 'none', fontSize: '12px' }}
                >
                  ({supervisorPhone})
                </a>
              </span>
            </div>
            <div className="profile-data-item">
              <span className="profile-data-label">{t.zoneArea}</span>
              <span className="profile-data-val">{mockDashboard.zone || '1Mile'}</span>
            </div>
            <div className="profile-data-item">
              <span className="profile-data-label">{t.sanadNumberLabel}</span>
              <span className="profile-data-val" dir="ltr" style={{ textAlign: 'start' }}>
                <code>{sanadNumber}</code>
              </span>
            </div>
            <div className="profile-data-item">
              <span className="profile-data-label">{t.contractStatus}</span>
              <span className="profile-data-val" style={{ color: '#139a43' }}>
                ✓ {t.contractActiveSigned}
              </span>
            </div>
          </div>
        </section>

        {/* Section 3: Vehicle Information */}
        <section className="profile-card">
          <div className="profile-card-header">
            <div className="profile-card-icon">
              <Icon name="vehicle" size={18} />
            </div>
            <h2>{t.vehicleInfo}</h2>
          </div>
          <div className="profile-data-grid">
            <div className="profile-data-item">
              <span className="profile-data-label">{t.vehicleOwnership}</span>
              <span className="profile-data-val">
                {userHasVehicle ? t.ownVehicle : t.companyVehicle}
              </span>
            </div>
            <div className="profile-data-item">
              <span className="profile-data-label">{t.plate}</span>
              <span className="profile-data-val">
                {userHasVehicle ? vehiclePlate : t.companyVehicle}
              </span>
            </div>
            <div className="profile-data-item">
              <span className="profile-data-label">{t.type}</span>
              <span className="profile-data-val">{vehicleType}</span>
            </div>
            <div className="profile-data-item">
              <span className="profile-data-label">{t.fuelCardBadge}</span>
              <span className="profile-data-val">
                <span className="vehicle-badge">{fuelCard}</span>
              </span>
            </div>
          </div>
        </section>

        {/* Section 4: Bank Information */}
        <section className="profile-card">
          <div className="profile-card-header">
            <div className="profile-card-icon">
              <Icon name="financialAdvance" size={18} />
            </div>
            <h2>{t.bankInfo}</h2>
          </div>
          <div className="profile-data-grid">
            <div className="profile-data-item">
              <span className="profile-data-label">{t.bank}</span>
              <span className="profile-data-val">{bankName}</span>
            </div>
            <div className="profile-data-item" style={{ gridColumn: '1 / -1' }}>
              <span className="profile-data-label">{t.iban}</span>
              <span
                className="profile-data-val"
                dir="ltr"
                style={{ textAlign: 'start', fontFamily: 'monospace' }}
              >
                {iban}
              </span>
            </div>
          </div>
        </section>

        {/* Section 5: Account Controls */}
        <section className="profile-card profile-actions-card">
          <button
            className="secondary-button"
            type="button"
            onClick={toggleLang}
            style={{
              flex: 1,
              minWidth: '160px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Icon name="globe" size={18} />
            <span>
              {t.changeLanguage} ({lang === 'ar' ? 'English' : 'العربية'})
            </span>
          </button>

          <button
            className="secondary-button"
            type="button"
            onClick={() => navigate(ROUTES.COURIER_DASHBOARD)}
            style={{
              flex: 1,
              minWidth: '160px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Icon name="dashboard" size={18} />
            <span>{t.dashboard}</span>
          </button>

          <button
            className="secondary-button"
            type="button"
            onClick={() => navigate(ROUTES.LOGIN)}
            style={{
              flex: 1,
              minWidth: '160px',
              color: '#dc2626',
              borderColor: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Icon name="logout" size={18} />
            <span>{t.logout}</span>
          </button>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab="profile" />
    </div>
  );
}
