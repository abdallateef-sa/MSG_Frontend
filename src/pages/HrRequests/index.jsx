import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { useOperations } from '@/context/OperationsContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS, OPERATION_STATUS } from '@/constants/requestStatus';
import AppHeader from '@/components/shared/AppHeader';
import OperationRequestDetailsModal from '@/components/shared/OperationRequestDetailsModal';
import Icon from '@/components/ui/Icon';

const OPERATION_STATUS_CLASS = {
  [OPERATION_STATUS.APPROVED]: 'approved',
  [OPERATION_STATUS.REJECTED]: 'rejected',
};

export default function HrRequests() {
  const { t, lang, dir } = useLanguage();
  const { requests } = useOnboarding();
  const { requests: operations, decideOperationRequest } = useOperations();
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  const [tab, setTab] = useState('hiring');
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedOperation, setSelectedOperation] = useState(null);

  const hiringRequests = requests.filter((req) => req.status !== REQUEST_STATUS.PENDING_SUPERVISOR);
  const operationRequests = operations.filter(
    (req) => req.status === OPERATION_STATUS.PENDING_HR || req.requesterRole === 'supervisor',
  );

  const approveOperation = (request) => {
    decideOperationRequest(request.id, { decision: 'approve' });
    setFeedback(t.requestApproved);
    setRejectingId(null);
  };

  const confirmReject = (request) => {
    if (!rejectReason.trim()) {
      setError(t.rejectReasonRequired);
      return;
    }
    decideOperationRequest(request.id, { decision: 'reject', reason: rejectReason.trim() });
    setFeedback(t.requestRejected);
    setRejectingId(null);
    setRejectReason('');
    setError('');
  };

  return (
    <div className="onboarding-page" dir={dir}>
      <AppHeader title={t.hrPortal} />

      <main className="dashboard-main">
        <div className="section-header" style={{ marginBottom: '16px' }}>
          <div>
            <div className="eyebrow">{t.msgLogistics}</div>
            <h2>{t.requestReview}</h2>
          </div>
        </div>

        {feedback && (
          <div className="operations-success-banner" role="status">
            <div className="success-icon-badge">
              <Icon name="check" size={18} strokeWidth={2.2} />
            </div>
            <span>{feedback}</span>
          </div>
        )}

        <div className="op-status-tabs supervisor-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'hiring'}
            className={`op-tab-btn ${tab === 'hiring' ? 'active' : ''}`}
            onClick={() => setTab('hiring')}
          >
            {t.hiringRequests} ({hiringRequests.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'operations'}
            className={`op-tab-btn ${tab === 'operations' ? 'active' : ''}`}
            onClick={() => setTab('operations')}
          >
            {t.hrOperations} ({operationRequests.length})
          </button>
        </div>

        {tab === 'hiring' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {hiringRequests.map((req) => {
              const isHrActionNeeded =
                req.status === REQUEST_STATUS.PENDING_HR ||
                req.status === REQUEST_STATUS.PENDING_ABSHER ||
                req.status === REQUEST_STATUS.PENDING_CONTRACT;
              return (
                <div
                  key={req.id}
                  className="courier-card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderLeft: isHrActionNeeded ? '4px solid #139a43' : '4px solid #dce8e1',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '15px' }}>{req.fullName}</strong>
                      <code style={{ fontSize: '11px', color: '#6b7280' }}>{req.id}</code>
                      {req.sanadNumber && (
                        <span style={{ fontSize: '11px', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>
                          {req.sanadNumber}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#4b5563', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span className="req-meta-item">
                        <Icon name="location" size={13} />
                        {req.city}
                      </span>
                      <span className="req-meta-item">
                        <Icon name="phone" size={13} />
                        {req.phone}
                      </span>
                      <span className="req-meta-item">
                        <Icon name={req.hasVehicle ? 'vehicle' : 'building'} size={13} />
                        {req.hasVehicle ? t.ownVehicle : t.companyVehicle}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      className={`status ${
                        req.status === REQUEST_STATUS.ACTIVE
                          ? 'success'
                          : req.status === REQUEST_STATUS.CANCELLED
                            ? 'danger'
                            : 'info'
                      }`}
                      style={{ fontSize: '11px' }}
                    >
                      {req.status}
                    </span>
                    <button
                      className="primary-button"
                      type="button"
                      style={{ padding: '8px 14px', fontSize: '12px' }}
                      onClick={() => navigate(`${ROUTES.HR_REQUESTS}/${req.id}`)}
                    >
                      {t.requestReview}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'operations' && (
          <div className="op-requests-list">
            {operationRequests.length === 0 && (
              <div className="op-no-results">
                <Icon name="operations" size={36} />
                <p>{t.noRequests}</p>
              </div>
            )}
            {operationRequests.map((request) => {
              const isHrPending = request.status === OPERATION_STATUS.PENDING_HR;
              return (
                <div key={request.id} className="op-request-item supervisor-review-item">
                  <button
                    type="button"
                    className="supervisor-review-open"
                    onClick={() => setSelectedOperation(request)}
                    aria-label={`${t.viewRequestDetails}: ${request.id}`}
                  >
                  <div className="op-req-main-info">
                    <div className="op-req-top-line">
                      <h4 className="op-req-title">
                        {isAr ? request.title : request.titleEn || request.title}
                      </h4>
                      <span className={`op-req-status-badge ${OPERATION_STATUS_CLASS[request.status] || request.status}`}>
                        {request.status === OPERATION_STATUS.APPROVED
                          ? t.approvedStatus
                          : request.status === OPERATION_STATUS.REJECTED
                            ? t.rejectedStatus
                            : t.inReview}
                      </span>
                    </div>
                    <div className="op-req-meta-line">
                      <span className="op-req-id">{request.id}</span>
                      <span className="meta-separator">•</span>
                      <span className="op-req-date">{request.date}</span>
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

                  {isHrPending &&
                    (rejectingId === request.id ? (
                      <div className="supervisor-reject-box">
                        <label className="form-label" htmlFor={`hr-reason-${request.id}`}>
                          {t.rejectReason}
                        </label>
                        <textarea
                          id={`hr-reason-${request.id}`}
                          className="form-textarea"
                          rows={2}
                          value={rejectReason}
                          onChange={(event) => {
                            setRejectReason(event.target.value);
                            setError('');
                          }}
                        />
                        {error && <p className="form-error">{error}</p>}
                        <div className="supervisor-review-actions">
                          <button
                            className="btn-cancel"
                            type="button"
                            onClick={() => {
                              setRejectingId(null);
                              setRejectReason('');
                              setError('');
                            }}
                          >
                            {t.cancelBtn}
                          </button>
                          <button
                            className="btn-cancel supervisor-reject-confirm"
                            type="button"
                            onClick={() => confirmReject(request)}
                          >
                            {t.confirmReject}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="supervisor-review-actions">
                        <button
                          className="secondary-button"
                          type="button"
                          style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                          onClick={() => {
                            setRejectingId(request.id);
                            setRejectReason('');
                            setError('');
                          }}
                        >
                          {t.rejectRequest}
                        </button>
                        <button
                          className="primary-button"
                          type="button"
                          onClick={() => approveOperation(request)}
                        >
                          <Icon name="check" size={15} strokeWidth={2.4} />
                          {t.hrApprove}
                        </button>
                      </div>
                    ))}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedOperation && (
        <OperationRequestDetailsModal
          request={selectedOperation}
          onClose={() => setSelectedOperation(null)}
        />
      )}
    </div>
  );
}
