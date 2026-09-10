import { useLanguage } from '@/i18n/LanguageContext';

export default function GreetingCard({ name, status, zone }) {
  const { t } = useLanguage();

  return (
    <section className="greeting-card">
      <div className="greeting-content">
        <h1>
          {t.greeting}، {name}
        </h1>
        <div className="greeting-badges">
          {zone && <span className="zone-badge">{zone}</span>}
          <span className="status-badge status-badge--success">
            <span className="status-dot" />
            {status}
          </span>
        </div>
      </div>
    </section>
  );
}
