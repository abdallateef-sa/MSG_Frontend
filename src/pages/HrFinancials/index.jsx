import { useMemo, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOperations } from '@/context/OperationsContext';
import { OPERATION_STATUS } from '@/constants/requestStatus';
import OperationRequestDetailsModal from '@/components/shared/OperationRequestDetailsModal';
import Icon from '@/components/ui/Icon';

const STATUS_TONE = {
  [OPERATION_STATUS.APPROVED]: 'admin-badge--success',
  [OPERATION_STATUS.REJECTED]: 'admin-badge--danger',
  [OPERATION_STATUS.PENDING_HR]: 'admin-badge--warning',
  [OPERATION_STATUS.PENDING_SUPERVISOR]: 'admin-badge--muted',
};

function parseAmount(value) {
  const digits = String(value || '').replace(/[^\d.]/g, '');
  return Number(digits) || 0;
}

export default function HrFinancials() {
  const { t, lang } = useLanguage();
  const { requests, decideOperationRequest } = useOperations();
  const isAr = lang === 'ar';

  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState('approve');
  const [reason, setReason] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedback, setFeedback] = useState('');

  const financial = useMemo(() => {
    const weight = (request) => (request.status === OPERATION_STATUS.PENDING_HR ? 0 : 1);
    return requests
      .filter((request) => request.category === 'financial')
      .sort((a, b) => weight(a) - weight(b));
  }, [requests]);

  const filtered = useMemo(
    () =>
      financial.filter(
        (request) => statusFilter === 'all' || request.status === statusFilter,
      ),
    [financial, statusFilter],
  );

  const isPending = (request) => request.status === OPERATION_STATUS.PENDING_HR;

  const statusLabel = (status) => {
    if (status === OPERATION_STATUS.APPROVED) return t.approvedStatus;
    if (status === OPERATION_STATUS.REJECTED) return t.rejectedStatus;
    return t.inReview;
  };

  const pending = financial.filter(isPending);
  const totalAmount = financial.reduce((sum, request) => sum + parseAmount(request.amount), 0);
  const pendingAmount = pending.reduce((sum, request) => sum + parseAmount(request.amount), 0);

  const stats = [
    { key: 'totalRequests', value: financial.length, icon: 'financialAdvance', tone: 'default' },
    { key: 'financePending', value: pending.length, icon: 'clock', tone: 'warning' },
    { key: 'totalAmount', value: totalAmount.toLocaleString(), icon: 'financialAdvance', tone: 'default' },
    { key: 'pendingAmount', value: pendingAmount.toLocaleString(), icon: 'clock', tone: 'danger' },
  ];

  const openDecision = (request) => {
    setSelected(request);
    setDecision('approve');
    setReason('');
  };

  const submitDecision = () => {
    decideOperationRequest(selected.id, {
      decision,
      reason: reason.trim(),
      hrDecisionNote: reason.trim(),
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

        <label className="form-label" htmlFor="fin-reason">
          {t.decisionReason}
          <textarea
            id="fin-reason"
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
          <h1>{t.financialsTitle}</h1>
          <p>{t.financialsHint}</p>
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

      <section className="admin-stats">
        {stats.map((stat) => (
          <div className="admin-stat" key={stat.key}>
            <span className={`admin-stat__icon ${stat.tone}`}>
              <Icon name={stat.icon} size={22} strokeWidth={1.9} />
            </span>
            <div>
              <div className="admin-stat__value">{stat.value}</div>
              <div className="admin-stat__label">{t[stat.key]}</div>
            </div>
          </div>
        ))}
      </section>

      <div className="admin-card">
        <div className="admin-toolbar">
          <div className="admin-toolbar__filters">
            <select
              className="admin-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">{t.allStatuses}</option>
              <option value={OPERATION_STATUS.PENDING_HR}>{t.inReview}</option>
              <option value={OPERATION_STATUS.APPROVED}>{t.approvedStatus}</option>
              <option value={OPERATION_STATUS.REJECTED}>{t.rejectedStatus}</option>
            </select>
          </div>
          <span className="op-history-badge">{filtered.length}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty">
            <Icon name="financialAdvance" size={32} />
            <p>{t.noRequests}</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.requestType}</th>
                  <th>{t.requester}</th>
                  <th>{t.financeAmount}</th>
                  <th>{t.requestDate}</th>
                  <th>{t.docStatus}</th>
                  <th>{t.decision}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((request) => (
                  <tr key={request.id} onClick={() => openDecision(request)}>
                    <td>{isAr ? request.title : request.titleEn || request.title}</td>
                    <td>
                      {request.requesterRole === 'supervisor'
                        ? t.requesterSupervisor
                        : t.requesterCourier}
                    </td>
                    <td dir="ltr">{request.amount ? (isAr ? request.amount : request.amountEn || request.amount) : '—'}</td>
                    <td>{request.date}</td>
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
