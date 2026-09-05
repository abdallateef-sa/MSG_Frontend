import { Outlet, useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants/routes';
import AppHeader from '@/components/shared/AppHeader';

const STEP_PATHS = [
  ROUTES.REGISTER_PERSONAL,
  ROUTES.REGISTER_VEHICLE_BANK,
  ROUTES.REGISTER_DOCUMENTS,
];

export default function OnboardingLayout() {
  const { t, dir } = useLanguage();
  const location = useLocation();

  const current = Math.max(0, STEP_PATHS.indexOf(location.pathname));
  const steps = [t.personal, t.vehicleBank, t.documents];
  const hints = [t.personalHint, t.vehicleHint, t.docsHint];

  return (
    <div className="onboarding-page" dir={dir}>
      <AppHeader title={t.registration} />

      <main className="onboarding-main courier-flow">
        <div className="progress-steps">
          {steps.map((item, i) => (
            <div className={`progress-step ${i <= current ? 'done' : ''}`} key={item}>
              <span>{i < current ? '✓' : i + 1}</span>
              <small>{item}</small>
            </div>
          ))}
        </div>

        <div className="courier-intro">
          <div>
            <div className="eyebrow">{t.registration}</div>
            <h1>{steps[current]}</h1>
            <p className="muted">{hints[current]}</p>
          </div>
          <span className="step-counter">
            {t.stepPrefix} {current + 1} {t.stepSuffix} 3
          </span>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
