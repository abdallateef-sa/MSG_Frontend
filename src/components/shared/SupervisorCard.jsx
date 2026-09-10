import { useLanguage } from '@/i18n/LanguageContext';
import Icon from '@/components/ui/Icon';

export default function SupervisorCard({ name, phone }) {
  const { t } = useLanguage();

  return (
    <section className="supervisor-card">
      <div className="supervisor-avatar">
        <Icon name="supervisor" size={30} strokeWidth={1.5} />
      </div>
      <div className="supervisor-info">
        <h3>{t.supervisor}</h3>
        <p>{name}</p>
        <div className="supervisor-actions">
          <a href={`tel:${phone}`} className="icon-button" aria-label={`اتصل بـ ${name}`}>
            <Icon name="phone" size={16} strokeWidth={1.8} />
          </a>
          <a href="mailto:" className="icon-button" aria-label={`راسل ${name}`}>
            <Icon name="chat" size={16} strokeWidth={1.8} />
          </a>
        </div>
      </div>
    </section>
  );
}
