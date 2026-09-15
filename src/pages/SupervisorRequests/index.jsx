import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { useOperations } from '@/context/OperationsContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS, OPERATION_STATUS } from '@/constants/requestStatus';
import AppHeader from '@/components/shared/AppHeader';
import SupervisorBottomNav from '@/components/shared/SupervisorBottomNav';
import OperationRequestDetailsModal from '@/components/shared/OperationRequestDetailsModal';
import Icon from '@/components/ui/Icon';

export default function SupervisorRequests() {
  const { t, lang, dir } = useLanguage();
  const { user } = useAuth();
  const { requests } = useOnboarding();
  const { requests: operations, reviewOperationRequest } = useOperations();
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  const [tab, setTab] = useState('hiring');
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedOperation, setSelectedOperation] = useState(null);

  const pendingHiring = requests.filter(
    (req) => req.supervisorId === user.id && req.status === REQUEST_STATUS.PENDING_SUPERVISOR,
  );
  const pendingOperations = operations.filter(
    (req) =>
      req.supervisorId === user.id &&
      req.requesterRole !== 'supervisor' &&
      req.status === OPERATION_STATUS.PENDING_SUPERVISOR,
  );

  const handleApproveOperation = (request) => {
    reviewOperationRequest(request.id, { decision: 'approve' });
    setFeedback(t.movedToHr);
    setRejectingId(null);
  };

  const confirmReject = (request) => {
    if (!rejectReason.trim()) {
      setError(t.rejectReasonRequired);
      return;
    }
    reviewOperationRequest(request.id, { decision: 'reject', reason: rejectReason.trim() });
    setFeedback(t.rejectedSuccess);
    setRejectingId(null);
    setRejectReason('');
    setError('');
  };

  return (
    <div className="dashboard-page" dir={dir}>
      <AppHeader title={t.requestReview} variant="supervisor" />

      <main className="dashboard-main">
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
            {t.hiringRequests} ({pendingHiring.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'operations'}
            className={`op-tab-btn ${tab === 'operations' ? 'active' : ''}`}
            onClick={() => setTab('operations')}
          >
            {t.operationsRequests} ({pendingOperations.length})
          </button>
        </div>

        {tab === 'hiring' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingHiring.length === 0 && (
              <div className="op-no-results">
                <Icon name="supervisor" size={36} />
                <p>{t.noRequests}</p>
              </div>
            )}
            {pendingHiring.map((req) => (
              <div key={req.id} className="courier-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '15px' }}>{req.fullName}</strong>
                      <code style={{ fontSize: '11px', color: '#6b7280' }}>{req.id}</code>
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
                  <button
                    className="primary-button"
                    type="button"
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                    onClick={() => navigate(`${ROUTES.SUPERVISOR_REQUESTS}/${req.id}`)}
                  >
                    {t.requestReview}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'operations' && (
          <div className="op-requests-list">
            {pendingOperations.length === 0 && (
              <div className="op-no-results">
                <Icon name="operations" size={36} />
                <p>{t.noRequests}</p>
              </div>
            )}

            {pendingOperations.map((request) => (
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
                      <span className={`op-req-status-badge ${request.status}`}>{t.inReview}</span>
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
                    </div>
                    {request.notes && (
                      <p className="op-req-notes">
                        {isAr ? request.notes : request.notesEn || request.notes}
                      </p>
                    )}
                  </div>
                </button>

                {rejectingId === request.id ? (
                  <div className="supervisor-reject-box">
                    <label className="form-label" htmlFor={`reason-${request.id}`}>
                      {t.rejectReason}
                    </label>
                    <textarea
                      id={`reason-${request.id}`}
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
                      onClick={() => handleApproveOperation(request)}
                    >
                      <Icon name="check" size={15} strokeWidth={2.4} />
                      {t.approveOperation}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedOperation && (
        <OperationRequestDetailsModal
          request={selectedOperation}
          onClose={() => setSelectedOperation(null)}
        />
      )}

      <SupervisorBottomNav />
    </div>
  );
}
