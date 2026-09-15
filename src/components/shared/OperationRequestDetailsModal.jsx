import { useMemo } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { getOperationTypes } from '@/constants/operationTypes';
import { OPERATION_STATUS } from '@/constants/requestStatus';
import Icon from '@/components/ui/Icon';

/**
 * Full details of an operational request. Shared by the courier, supervisor,
 * and HR portals. Displays the request metadata, notes, submitted form data,
 * and attachments.
 */
export default function OperationRequestDetailsModal({ request, onClose }) {
  const { t, lang, dir } = useLanguage();
  const isAr = lang === 'ar';
  const typeOptions = useMemo(() => getOperationTypes(isAr), [isAr]);

  const selectedType = request.typeKey
    ? typeOptions[request.category]?.find((type) => type.key === request.typeKey)
    : null;

  const detailFields = request.details
    ? Object.entries(request.details).filter(([, value]) => value !== '' && value != null)
    : [];

  const getDetailLabel = (key) => selectedType?.fields.find((field) => field.key === key)?.label || key;

  const getDetailValue = (key, value) => {
    const field = selectedType?.fields.find((item) => item.key === key);
    if (Array.isArray(value)) return value.join(' · ');
    const optionValue = field?.options?.find((optionItem) => optionItem.value === value);
    return optionValue ? (isAr ? optionValue.ar : optionValue.en) : String(value);
  };

  const statusLabel =
    request.status === OPERATION_STATUS.APPROVED
      ? t.approvedStatus
      : request.status === OPERATION_STATUS.REJECTED
        ? t.rejectedStatus
        : t.inReview;

  const hasAttachments = Object.values(request.attachments || {}).some(
    (files) => files?.length,
  );

  return (
    <div className="op-modal-backdrop" onClick={onClose}>
      <div
        className="op-modal op-request-details-modal"
        dir={dir}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-details-title"
      >
        <div className="op-modal-header">
          <div className="op-modal-title-group">
            <div className="op-modal-icon-badge">
              <Icon name="operations" size={18} />
            </div>
            <div>
              <h3 id="request-details-title">{t.requestDetails}</h3>
              <p className="op-modal-subtitle">
                {request.id} · {isAr ? request.title : request.titleEn || request.title}
              </p>
            </div>
          </div>
          <button type="button" className="op-modal-close" onClick={onClose} aria-label={t.closeDetails}>
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="op-request-details-content">
          <div className="op-request-details-grid">
            <div className="op-detail-card">
              <span className="op-detail-label">{t.requestStatusLabel}</span>
              <span className={`op-req-status-badge ${request.status}`}>{statusLabel}</span>
            </div>
            <div className="op-detail-card">
              <span className="op-detail-label">{t.requestDate}</span>
              <strong>{request.date}</strong>
            </div>
            <div className="op-detail-card">
              <span className="op-detail-label">{t.requestCategory}</span>
              <strong>{isAr ? request.categoryLabelAr : request.categoryLabelEn}</strong>
            </div>
            {request.amount && (
              <div className="op-detail-card">
                <span className="op-detail-label">{t.requestAmount}</span>
                <strong className="op-req-amount">
                  {isAr ? request.amount : request.amountEn || request.amount}
                </strong>
              </div>
            )}
          </div>

          {request.notes && (
            <section className="op-details-section">
              <h4>{t.requestNotes}</h4>
              <p>{isAr ? request.notes : request.notesEn || request.notes}</p>
            </section>
          )}

          {detailFields.length > 0 && (
            <section className="op-details-section">
              <h4>{t.requestData}</h4>
              <div className="op-request-detail-list">
                {detailFields.map(([key, value]) => (
                  <div className="op-request-detail-row" key={key}>
                    <span>{getDetailLabel(key)}</span>
                    <strong>{getDetailValue(key, value)}</strong>
                  </div>
                ))}
              </div>
            </section>
          )}

          {hasAttachments && (
            <section className="op-details-section">
              <h4>{t.requestAttachments}</h4>
              <div className="op-request-detail-list">
                {Object.entries(request.attachments).map(
                  ([key, files]) =>
                    files?.length > 0 && (
                      <div className="op-request-detail-row" key={key}>
                        <span>{getDetailLabel(key)}</span>
                        <strong>{files.join(' · ')}</strong>
                      </div>
                    ),
                )}
              </div>
            </section>
          )}

          {(request.supervisorRejectReason || request.hrRejectReason) && (
            <section className="op-details-section">
              <h4>{t.rejectReason}</h4>
              <p>{request.supervisorRejectReason || request.hrRejectReason}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
