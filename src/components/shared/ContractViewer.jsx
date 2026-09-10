import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { fillTemplate } from '@/utils/fillTemplate';
import { contractWithVehicle } from '@/constants/contracts/withVehicle';
import { contractWithoutVehicle } from '@/constants/contracts/withoutVehicle';
import { ROUTES } from '@/constants/routes';

export default function ContractViewer({ request, onSign, isSigned = false, onNavigate }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(isSigned);

  const rawTemplate = request?.hasVehicle ? contractWithVehicle : contractWithoutVehicle;
  const renderedContract = fillTemplate(rawTemplate, {
    fullName: request?.fullName || '---',
    nationalId: request?.nationalId || '---',
    phone: request?.phone || '---',
    city: request?.city || '---',
    iban: request?.iban || '---',
    sanadNumber: request?.sanadNumber || 'SND-PENDING',
    vehiclePlate: request?.vehiclePlate || '---',
    vehicleType: request?.vehicleType || '---',
  });

  const handleSign = () => {
    setAgreed(true);
    if (onSign) onSign();
    // Navigate to dashboard after a brief delay for UX
    if (onNavigate) {
      onNavigate();
    } else {
      window.setTimeout(() => navigate(ROUTES.COURIER_DASHBOARD), 500);
    }
  };

  return (
    <div className="contract-preview" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={{ marginBottom: '16px' }}>
        <span className="eyebrow">{t.nextStage}</span>
        <h2>{t.contractTitle}</h2>
        <p className="muted">{t.statusPendingContractHint}</p>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #dce8e1',
          borderRadius: '8px',
          padding: '16px',
          maxHeight: '260px',
          overflowY: 'auto',
          fontSize: '13px',
          lineHeight: '1.8',
          whiteSpace: 'pre-wrap',
          marginBottom: '16px',
        }}
      >
        {renderedContract}
      </div>

      {isSigned || agreed ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#139a43',
            fontWeight: 'bold',
            padding: '12px',
            background: '#ecfdf5',
            borderRadius: '8px',
            border: '1px solid #a7f3d0',
          }}
        >
          <span>✓</span>
          <span>{t.contractSignedBadge}</span>
        </div>
      ) : (
        <button
          className="primary-button"
          type="button"
          onClick={handleSign}
          style={{ width: '100%' }}
        >
          {t.signContractAction}
        </button>
      )}
    </div>
  );
}
