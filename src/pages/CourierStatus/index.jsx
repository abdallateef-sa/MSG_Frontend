import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants/routes';
import AppHeader from '@/components/shared/AppHeader';

const MOCK_APP_NUMBER = 'APP-2026-1043';

export default function CourierStatus() {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();

  const stages = [
    [t.received, t.receivedHint, true],
    [t.review, t.reviewHint, true],
    [t.docsReview, t.docsReviewHint, true],
    [t.contract, t.contractHint, false],
  ];

  return (
    <div className="onboarding-page" dir={dir}>
      <AppHeader title={t.status} />

      <main className="onboarding-main courier-status">
        <div className="eyebrow">{t.msgLogistics}</div>
        <h1>{t.status}</h1>
        <p className="muted">{t.statusHint}</p>

        <section className="status-card">
          <div className="application-number">
            <span>{t.application}</span>
            <b>{MOCK_APP_NUMBER}</b>
            <span className="status info">{t.processing}</span>
          </div>
          <div className="vertical-stepper">
            {stages.map(([title, description, active], index) => (
              <div className={`vertical-step ${active ? 'active' : ''}`} key={title}>
                <span className="step-dot">{index < 2 ? '✓' : index === 2 ? '◷' : '4'}</span>
                <div>
                  <b>{title}</b>
                  <small>{description}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="notice-card">
          <span>!</span>
          <div>
            <b>{t.notify}</b>
            <p>{t.notifyHint}</p>
          </div>
        </section>

        <section className="contract-preview">
          <div>
            <span className="eyebrow">{t.nextStage}</span>
            <h2>{t.contractTitle}</h2>
            <p className="muted">{t.contractHint2}</p>
          </div>
          <button className="secondary-button" type="button" disabled>
            {t.waiting}
          </button>
        </section>

        <button className="link-button" type="button" onClick={() => navigate(ROUTES.LOGIN)}>
          {t.backLogin}
        </button>
      </main>
    </div>
  );
}
