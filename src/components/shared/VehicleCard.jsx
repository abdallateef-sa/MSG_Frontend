import { useLanguage } from '@/i18n/LanguageContext';
import Icon from '@/components/ui/Icon';

export default function VehicleCard({ plate, model, badge }) {
  const { t } = useLanguage();

  return (
    <section className="vehicle-card">
      <div className="vehicle-icon">
        <Icon name="vehicle" size={30} strokeWidth={1.5} />
      </div>
      <div className="vehicle-info">
        <h3>{t.vehicle}</h3>
        <p>
          {plate}
          <span className="vehicle-model"> — {model}</span>
        </p>
        {badge && <span className="vehicle-badge">{badge}</span>}
      </div>
    </section>
  );
}
