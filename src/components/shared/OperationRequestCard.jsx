import { useLanguage } from '@/i18n/LanguageContext';

/**
 * Shared operational-request card.
 *
 * Used by the Operations history list and the courier dashboard's
 * "recent requests" section so both render identically.
 */
export default function OperationRequestCard({ request, onClick }) {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';

  const statusLabel =
    request.status === 'approved'
      ? t.approvedStatus
      : request.status === 'rejected'
        ? t.rejectedStatus
        : t.inReview;

  return (
    <button
      type="button"
      className="op-request-item"
      onClick={onClick}
      aria-label={`${t.viewRequestDetails}: ${request.id}`}
    >
      <div className="op-req-main-info">
        <div className="op-req-top-line">
          <h4 className="op-req-title">{isAr ? request.title : request.titleEn || request.title}</h4>
          <span className={`op-req-status-badge ${request.status}`}>{statusLabel}</span>
        </div>
        <div className="op-req-meta-line">
          <span className="op-req-id">{request.id}</span>
          <span className="meta-separator">•</span>
          <span className="op-req-date">{request.date}</span>
          {request.amount && (
            <>
              <span className="meta-separator">•</span>
              <span className="op-req-amount">
                {isAr ? request.amount : request.amountEn || request.amount}
              </span>
            </>
          )}
          <span className="meta-separator">•</span>
          <span className={`op-req-cat-tag ${request.category}`}>
            {isAr ? request.categoryLabelAr : request.categoryLabelEn}
          </span>
        </div>
        {request.notes && (
          <p className="op-req-notes">{isAr ? request.notes : request.notesEn || request.notes}</p>
        )}
      </div>
    </button>
  );
}
