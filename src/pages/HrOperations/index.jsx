import { useMemo, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOperations } from '@/context/OperationsContext';
import { OPERATION_STATUS } from '@/constants/requestStatus';
import { getOperationTypes } from '@/constants/operationTypes';
import OperationRequestDetailsModal from '@/components/shared/OperationRequestDetailsModal';
import Icon from '@/components/ui/Icon';

const STATUS_TONE = {
  [OPERATION_STATUS.APPROVED]: 'admin-badge--success',
  [OPERATION_STATUS.REJECTED]: 'admin-badge--danger',
  [OPERATION_STATUS.PENDING_HR]: 'admin-badge--warning',
  [OPERATION_STATUS.PENDING_SUPERVISOR]: 'admin-badge--muted',
};

export default function HrOperations() {
  const { t, lang } = useLanguage();
  const { requests, decideOperationRequest } = useOperations();
  const isAr = lang === 'ar';

  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState('approve');
  const [reason, setReason] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');
  const [feedback, setFeedback] = useState('');

  const typeOptions = useMemo(() => getOperationTypes(isAr), [isAr]);

  // Financial requests are handled in the Financials screen, not here.
  const sorted = useMemo(() => {
    const weight = (request) => (request.status === OPERATION_STATUS.PENDING_HR ? 0 : 1);
    return requests
      .filter((request) => request.category !== 'financial')
      .sort((a, b) => weight(a) - weight(b));
  }, [requests]);

  const isPending = (request) => request.status === OPERATION_STATUS.PENDING_HR;

  const selectedType = selected?.typeKey
    ? typeOptions[selected.category]?.find((type) => type.key === selected.typeKey)
    : null;
  const hasAmountField = Boolean(selectedType?.fields.some((field) => field.key === 'amount'));

  const statusLabel = (status) => {
    if (status === OPERATION_STATUS.APPROVED) return t.approvedStatus;
    if (status === OPERATION_STATUS.REJECTED) return t.rejectedStatus;
    return t.inReview;
  };

  const openDecision = (request) => {
    setSelected(request);
    setDecision('approve');
    setReason('');
    setApprovedAmount(request.amount ? String(request.amount).replace(/[^\d.]/g, '') : '');
  };

  const submitDecision = () => {
    decideOperationRequest(selected.id, {
      decision,
      reason: reason.trim(),
      hrDecisionNote: reason.trim(),
      ...(decision === 'approve' && hasAmountField && approvedAmount ? { approvedAmount } : {}),
    });
    setFeedback(decision === 'approve' ? t.requestApproved : t.requestRejected);
    setSelected(null);
  };

  const decisionFooter =
    selected && isPending(selected) ? (
      <>
        <div className="admin-decision__tabs">
          <button
            type="button"
            className={`op-tab-btn ${decision === 'approve' ? 'active' : ''}`}
            onClick={() => setDecision('approve')}
          >
            {t.approveRequest}
          </button>
          <button
            type="button"
            className={`op-tab-btn ${decision === 'reject' ? 'active' : ''}`}
            onClick={() => setDecision('reject')}
          >
            {t.rejectRequest}
          </button>
        </div>

        {decision === 'approve' && hasAmountField && (
          <label className="form-label" htmlFor="hr-approved-amount">
            {t.approvedAmount}
            <input
              id="hr-approved-amount"
              className="admin-input"
              type="number"
              min="0"
              dir="ltr"
              value={approvedAmount}
              onChange={(event) => setApprovedAmount(event.target.value)}
            />
          </label>
        )}

        <label className="form-label" htmlFor="hr-op-reason">
          {t.decisionReason}
          <textarea
            id="hr-op-reason"
            className="form-textarea"
            rows={2}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </label>

        <div className="supervisor-review-actions">
          <button className="btn-cancel" type="button" onClick={() => setSelected(null)}>
            {t.cancelBtn}
          </button>
          <button className="primary-button" type="button" onClick={submitDecision}>
            <Icon name="check" size={15} strokeWidth={2.4} />
            <span>{decision === 'approve' ? t.approveRequest : t.confirmReject}</span>
          </button>
        </div>
      </>
    ) : null;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{t.operationsTitle}</h1>
          <p>{t.operationsHint}</p>
        </div>
      </div>

      {feedback && (
        <div className="operations-success-banner" role="status" style={{ marginBottom: '16px' }}>
          <div className="success-icon-badge">
            <Icon name="check" size={18} strokeWidth={2.2} />
          </div>
          <span>{feedback}</span>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-toolbar">
          <div className="admin-toolbar__filters" />
          <span className="op-history-badge">{sorted.length}</span>
        </div>

        {sorted.length === 0 ? (
          <div className="admin-empty">
            <Icon name="operations" size={32} />
            <p>{t.noOperations}</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.requestType}</th>
                  <th>{t.requester}</th>
                  <th>{t.requestDate}</th>
                  <th>{t.requestAmount}</th>
                  <th>{t.docStatus}</th>
                  <th>{t.decision}</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((request) => (
                  <tr key={request.id} onClick={() => openDecision(request)}>
                    <td>{isAr ? request.title : request.titleEn || request.title}</td>
                    <td>
                      {request.requesterRole === 'supervisor'
                        ? t.requesterSupervisor
                        : t.requesterCourier}
                    </td>
                    <td>{request.date}</td>
                    <td>{request.amount ? (isAr ? request.amount : request.amountEn || request.amount) : '—'}</td>
                    <td>
                      <span className={`admin-badge ${STATUS_TONE[request.status] || 'admin-badge--muted'}`}>
                        {statusLabel(request.status)}
                      </span>
                    </td>
                    <td>
                      {isPending(request) ? (
                        <button
                          className="primary-button"
                          type="button"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={(event) => {
                            event.stopPropagation();
                            openDecision(request);
                          }}
                        >
                          {t.decide}
                        </button>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <OperationRequestDetailsModal
          request={selected}
          onClose={() => setSelected(null)}
          footer={decisionFooter}
        />
      )}
    </div>
  );
}
