import { useMemo, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { REQUEST_STATUS } from '@/constants/requestStatus';
import { contractWithVehicle } from '@/constants/contracts/withVehicle';
import { contractWithoutVehicle } from '@/constants/contracts/withoutVehicle';
import { fillTemplate } from '@/utils/fillTemplate';
import { ROUTES } from '@/constants/routes';
import PersonLink from '@/components/shared/PersonLink';
import Icon from '@/components/ui/Icon';

function hasContract(request) {
  return (
    Boolean(request.sanadNumber) ||
    request.status === REQUEST_STATUS.PENDING_CONTRACT ||
    request.status === REQUEST_STATUS.ACTIVE
  );
}

export default function HrContracts() {
  const { t } = useLanguage();
  const { requests } = useOnboarding();
  const [selected, setSelected] = useState(null);

  const contracts = useMemo(() => requests.filter(hasContract), [requests]);

  const statusLabel = (status) => {
    if (status === REQUEST_STATUS.ACTIVE) return t.statusActive;
    if (status === REQUEST_STATUS.PENDING_CONTRACT) return t.statusPendingContract;
    if (status === REQUEST_STATUS.CANCELLED) return t.statusCancelled;
    return t.inReview;
  };

  const statusTone = (status) => {
    if (status === REQUEST_STATUS.ACTIVE) return 'admin-badge--success';
    if (status === REQUEST_STATUS.CANCELLED) return 'admin-badge--danger';
    if (status === REQUEST_STATUS.PENDING_CONTRACT) return 'admin-badge--warning';
    return 'admin-badge--muted';
  };

  const renderContract = (request) => {
    const template = request.hasVehicle ? contractWithVehicle : contractWithoutVehicle;
    return fillTemplate(template, {
      fullName: request.fullName || '---',
      nationalId: request.nationalId || '---',
      phone: request.phone || '---',
      city: request.city || '---',
      iban: request.iban || '---',
      sanadNumber: request.sanadNumber || '---',
      sanadDate: request.sanadDate || '---',
      sanadAmount: request.sanadAmount ? `${request.sanadAmount} ${t.currencySar}` : '---',
      vehiclePlate: request.vehiclePlate || '---',
      vehicleType: request.vehicleType || '---',
    });
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{t.contractsTitle}</h1>
          <p>{t.contractsHint}</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <div className="admin-toolbar__filters" />
          <span className="op-history-badge">{contracts.length}</span>
        </div>

        {contracts.length === 0 ? (
          <div className="admin-empty">
            <Icon name="file" size={32} />
            <p>{t.noContracts}</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.fullName}</th>
                  <th>{t.sanadNumberLabel}</th>
                  <th>{t.sanadDateLabel}</th>
                  <th>{t.sanadAmountLabel}</th>
                  <th>{t.contractStatus}</th>
                  <th>{t.decision}</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((request) => (
                  <tr key={request.id} onClick={() => setSelected(request)}>
                    <td>
                      <PersonLink to={`${ROUTES.HR_EMPLOYEES}/${request.id}`}>
                        {request.fullName}
                      </PersonLink>
                    </td>
                    <td dir="ltr">{request.sanadNumber || '—'}</td>
                    <td dir="ltr">{request.sanadDate || '—'}</td>
                    <td dir="ltr">{request.sanadAmount || '—'}</td>
                    <td>
                      <span className={`admin-badge ${statusTone(request.status)}`}>
                        {statusLabel(request.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="secondary-button"
                        type="button"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelected(request);
                        }}
                      >
                        {t.viewContract}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="op-modal-backdrop" onClick={() => setSelected(null)}>
          <div
            className="op-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contract-preview-title"
          >
            <div className="op-modal-header">
              <div className="op-modal-title-group">
                <div className="op-modal-icon-badge">
                  <Icon name="file" size={18} />
                </div>
                <div>
                  <h3 id="contract-preview-title">{t.contractPreview}</h3>
                  <p className="op-modal-subtitle">{selected.fullName}</p>
                </div>
              </div>
              <button
                type="button"
                className="op-modal-close"
                onClick={() => setSelected(null)}
                aria-label={t.closeDetails}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <h4 className="section-title" style={{ border: 0, padding: 0, marginBottom: '10px' }}>
                {t.sanadInfo}
              </h4>
              <div className="admin-info-grid">
                <div className="op-detail-card">
                  <span className="op-detail-label">{t.sanadNumberLabel}</span>
                  <strong dir="ltr">{selected.sanadNumber || '—'}</strong>
                </div>
                <div className="op-detail-card">
                  <span className="op-detail-label">{t.sanadDateLabel}</span>
                  <strong dir="ltr">{selected.sanadDate || '—'}</strong>
                </div>
                <div className="op-detail-card">
                  <span className="op-detail-label">{t.sanadAmountLabel}</span>
                  <strong dir="ltr">{selected.sanadAmount || '—'}</strong>
                </div>
                <div className="op-detail-card">
                  <span className="op-detail-label">{t.contractStatus}</span>
                  <span className={`admin-badge ${statusTone(selected.status)}`}>
                    {statusLabel(selected.status)}
                  </span>
                </div>
              </div>

              <h4 className="section-title" style={{ border: 0, padding: 0, margin: '18px 0 0' }}>
                {t.contractPreview}
              </h4>
              <div className="admin-contract">{renderContract(selected)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
