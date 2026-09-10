import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants/routes';
import QuickActionButton from '@/components/ui/QuickActionButton';
import Icon from '@/components/ui/Icon';

const QUICK_ACTIONS = [
  { key: 'vehicleCompensation', route: ROUTES.VEHICLE_COMPENSATION, icon: 'vehicleCompensation' },
  { key: 'financialAdvance', route: ROUTES.FINANCIAL_ADVANCE, icon: 'financialAdvance' },
  { key: 'accidentReport', route: ROUTES.ACCIDENT_REPORT, icon: 'accidentReport' },
  { key: 'cancelCompensation', route: ROUTES.CANCEL_COMPENSATION, icon: 'cancelCompensation' },
];

export default function QuickActionsGrid() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="quick-actions-grid">
      {QUICK_ACTIONS.map(({ key, route, icon }) => (
        <QuickActionButton
          key={key}
          icon={<Icon name={icon} size={26} strokeWidth={1.6} />}
          label={t[key]}
          onClick={() => navigate(route)}
        />
      ))}
    </div>
  );
}
