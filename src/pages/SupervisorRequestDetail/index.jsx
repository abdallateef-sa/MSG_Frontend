import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS } from '@/constants/requestStatus';
import AppHeader from '@/components/shared/AppHeader';
import CompanyWarehouseSelect from '@/components/shared/CompanyWarehouseSelect';
import CourierApplicationInfo from '@/components/shared/CourierApplicationInfo';
import Icon from '@/components/ui/Icon';

export default function SupervisorRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const { requests, reviewHiringRequest } = useOnboarding();

  const request = requests.find((r) => r.id === id);

  const [companyId, setCompanyId] = useState(request?.companyId || '');
  const [warehouseId, setWarehouseId] = useState(request?.warehouseId || '');
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [error, setError] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (!request) {
    return (
      <div className="onboarding-page" dir={dir}>
        <AppHeader title={t.requestReview} />
        <main className="onboarding-main">
          <div className="courier-card">
            <h2>{t.noRequests}</h2>
            <button className="secondary-button" onClick={() => navigate(ROUTES.SUPERVISOR_REQUESTS)}>
              {t.requestReview}
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isPending = request.status === REQUEST_STATUS.PENDING_SUPERVISOR;

  const handleApprove = () => {
    if (!companyId || !warehouseId) {
      setError(isArMessage('يرجى اختيار الشركة والمخزن أولاً', 'Please select a company and warehouse first.'));
      return;
    }
    reviewHiringRequest(request.id, {
      decision: 'approve',
      companyId,
      warehouseId,
      supervisorName: user.name,
    });
    setFeedbackMsg(t.movedToHr);
    setError('');
  };

  function isArMessage(ar, en) {
    return dir === 'rtl' ? ar : en;
  }

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      setError(t.rejectReasonRequired);
      return;
    }
    reviewHiringRequest(request.id, { decision: 'reject', reason: rejectReason.trim() });
    setFeedbackMsg(t.rejectedSuccess);
    setShowReject(false);
    setError('');
  };

  return (
    <div className="onboarding-page" dir={dir}>
      <AppHeader title={t.requestReview} />

      <main
        className="onboarding-main"
        style={{ maxWidth: '750px', width: '100%', margin: '0 auto', padding: '24px 16px' }}
      >
        <button
          className="link-button"
          onClick={() => navigate(ROUTES.SUPERVISOR_REQUESTS)}
          style={{ marginBottom: '16px', display: 'inline-block' }}
        >
          ← {t.requestReview}
        </button>

        <div className="courier-card form-stack">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="eyebrow">{t.supervisorPortal}</span>
              <h2>{request.fullName}</h2>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {request.id}
              </span>
            </div>
            <span
              className={`status ${request.status === REQUEST_STATUS.CANCELLED ? 'danger' : 'info'}`}
            >
              {request.status}
            </span>
          </div>

          {feedbackMsg && (
            <div className="hr-feedback-banner">
              <Icon name="check" size={16} strokeWidth={2.4} />
              <span>{feedbackMsg}</span>
            </div>
          )}

          <CourierApplicationInfo request={request} />

          {/* Section: Assign Company & Warehouse */}
          <div style={{ marginTop: '20px' }}>
            <div className="section-title">
              <Icon name="building" size={18} />
              <h2>{t.assignedTo}</h2>
            </div>

            <CompanyWarehouseSelect
              selectedCompany={companyId}
              onSelectCompany={setCompanyId}
              selectedWarehouse={warehouseId}
              onSelectWarehouse={setWarehouseId}
              disabled={!isPending}
            />
          </div>

          {isPending ? (
            showReject ? (
              <div className="supervisor-reject-box" style={{ marginTop: '20px' }}>
                <label className="form-label" htmlFor="hiring-reject-reason">
                  {t.rejectReason}
                </label>
                <textarea
                  id="hiring-reject-reason"
                  className="form-textarea"
                  rows={3}
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
                      setShowReject(false);
                      setRejectReason('');
                      setError('');
                    }}
                  >
                    {t.cancelBtn}
                  </button>
                  <button className="btn-cancel supervisor-reject-confirm" type="button" onClick={confirmReject}>
                    {t.confirmReject}
                  </button>
                </div>
              </div>
            ) : (
              <div className="form-actions" style={{ marginTop: '24px' }}>
                {error && <p className="form-error">{error}</p>}
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    setShowReject(true);
                    setError('');
                  }}
                  style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                >
                  {t.rejectRequest}
                </button>
                <button
                  className="primary-button"
                  type="button"
                  onClick={handleApprove}
                  disabled={!companyId || !warehouseId}
                >
                  <Icon name="check" size={15} strokeWidth={2.4} />
                  {t.approveHiring}
                </button>
              </div>
            )
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '20px',
                padding: '12px',
                background: '#f3f4f6',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            >
              <Icon name="info" size={16} />
              <span>
                {t.requestReview}: <b>{request.status}</b>
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
