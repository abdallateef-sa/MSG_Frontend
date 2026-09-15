import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants/routes';
import QuickActionButton from '@/components/ui/QuickActionButton';
import Icon from '@/components/ui/Icon';

const QUICK_ACTIONS = [
  {
    key: 'vehicleCompensation',
    icon: 'vehicleCompensation',
    target: { category: 'financial', type: 'vehicleAuthorization' },
  },
  {
    key: 'financialAdvance',
    icon: 'financialAdvance',
    target: { category: 'financial', type: 'financialAdvance' },
  },
  {
    key: 'accidentReport',
    icon: 'accidentReport',
    target: { category: 'vehicle', type: 'accidentReport' },
  },
  {
    key: 'cancelCompensation',
    icon: 'cancelCompensation',
    target: { category: 'financial', type: 'cancelVehicleAuthorization' },
  },
];

export default function QuickActionsGrid() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="quick-actions-grid">
      {QUICK_ACTIONS.map(({ key, icon, target }) => (
        <QuickActionButton
          key={key}
          icon={<Icon name={icon} size={26} strokeWidth={1.6} />}
          label={t[key]}
          onClick={() => navigate(ROUTES.OPERATIONS, { state: { openRequest: target } })}
        />
      ))}
    </div>
  );
}
