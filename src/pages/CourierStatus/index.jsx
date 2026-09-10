import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS, CANCEL_REASON } from '@/constants/requestStatus';
import AppHeader from '@/components/shared/AppHeader';
import ContractViewer from '@/components/shared/ContractViewer';

export default function CourierStatus() {
  const { t, dir } = useLanguage();
  const { currentRequest, updateRequest, requests, setCurrentRequestId } = useOnboarding();
  const navigate = useNavigate();

  const status = currentRequest?.status || REQUEST_STATUS.PENDING_SUPERVISOR;
  const isCancelled = status === REQUEST_STATUS.CANCELLED;

  // Stages ordering for the stepper
  const STAGE_KEYS = [
    REQUEST_STATUS.PENDING_SUPERVISOR,
    REQUEST_STATUS.PENDING_HR,
    REQUEST_STATUS.PENDING_ABSHER,
    REQUEST_STATUS.PENDING_CONTRACT,
    REQUEST_STATUS.ACTIVE,
  ];

  const currentStageIndex = isCancelled ? -1 : STAGE_KEYS.indexOf(status);

  const stageDefinitions = [
    {
      key: REQUEST_STATUS.PENDING_SUPERVISOR,
      title: t.statusPendingSupervisor,
      description: t.statusPendingSupervisorHint,
    },
    {
      key: REQUEST_STATUS.PENDING_HR,
      title: t.statusPendingHr,
      description: t.statusPendingHrHint,
    },
    {
      key: REQUEST_STATUS.PENDING_ABSHER,
      title: t.statusPendingAbsher,
      description: t.statusPendingAbsherHint,
    },
    {
      key: REQUEST_STATUS.PENDING_CONTRACT,
      title: t.statusPendingContract,
      description: t.statusPendingContractHint,
    },
  ];

  const handleContractSigned = () => {
    updateRequest(currentRequest.id, { status: REQUEST_STATUS.ACTIVE });
  };

  return (
    <div className="onboarding-page" dir={dir}>
      <AppHeader title={t.status} />

      <main className="onboarding-main courier-status">
        <div className="eyebrow">{t.msgLogistics}</div>
        <h1>{t.status}</h1>
        <p className="muted">{t.statusHint}</p>

        {/* Mock Application Selector for Testing */}
        {requests.length > 1 && (
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <small className="muted">طلب التجربة:</small>
            <select
              value={currentRequest?.id}
              onChange={(e) => setCurrentRequestId(e.target.value)}
              style={{ padding: '4px 8px', fontSize: '12px' }}
            >
              {requests.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} ({r.fullName} - {r.status})
                </option>
              ))}
            </select>
          </div>
        )}

        <section className="status-card">
          <div className="application-number">
            <span>{t.application}</span>
            <b>{currentRequest?.id || 'APP-2026-1043'}</b>
            <span
              className={`status ${
                isCancelled ? 'danger' : status === REQUEST_STATUS.ACTIVE ? 'success' : 'info'
              }`}
            >
              {isCancelled
                ? t.statusCancelled
                : status === REQUEST_STATUS.ACTIVE
                  ? t.statusActive
                  : t.processing}
            </span>
          </div>

          {isCancelled ? (
            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#991b1b',
              }}
            >
              <b>{t.statusCancelled}</b>
              <p style={{ margin: '8px 0 0', fontSize: '13px' }}>
                {currentRequest?.cancelReason === CANCEL_REASON.SUPERVISOR_REJECTED
                  ? t.cancelledBySupervisor
                  : currentRequest?.cancelReason === CANCEL_REASON.ABSHER_REJECTED
                    ? t.cancelledByAbsher
                    : t.statusCancelled}
              </p>
            </div>
          ) : (
            <div className="vertical-stepper">
              {stageDefinitions.map((stage, index) => {
                const isDone = currentStageIndex > index;
                const isCurrent = currentStageIndex === index;

                return (
                  <div
                    className={`vertical-step ${isDone || isCurrent ? 'active' : ''}`}
                    key={stage.key}
                  >
                    <span className="step-dot">{isDone ? '✓' : isCurrent ? '◷' : index + 1}</span>
                    <div>
                      <b>{stage.title}</b>
                      <small>{stage.description}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Absher Read-only Notification when PENDING_ABSHER */}
        {status === REQUEST_STATUS.PENDING_ABSHER && (
          <section
            className="notice-card"
            style={{ borderColor: '#2563eb', background: '#eff6ff' }}
          >
            <span style={{ color: '#2563eb' }}>◷</span>
            <div>
              <b style={{ color: '#1e40af' }}>{t.statusPendingAbsher}</b>
              <p style={{ color: '#1e3a8a' }}>{t.statusPendingAbsherHint}</p>
              {currentRequest?.sanadNumber && (
                <div style={{ marginTop: '8px', fontSize: '12px' }}>
                  <strong>رقم السند: </strong> <code>{currentRequest.sanadNumber}</code>
                </div>
              )}
            </div>
          </section>
        )}

        {/* General status info card when not in contract or absher */}
        {status !== REQUEST_STATUS.PENDING_ABSHER &&
          status !== REQUEST_STATUS.PENDING_CONTRACT &&
          status !== REQUEST_STATUS.ACTIVE &&
          !isCancelled && (
            <section className="notice-card">
              <span>!</span>
              <div>
                <b>{t.notify}</b>
                <p>{t.notifyHint}</p>
              </div>
            </section>
          )}

        {/* Contract Section */}
        {(status === REQUEST_STATUS.PENDING_CONTRACT || status === REQUEST_STATUS.ACTIVE) && (
          <ContractViewer
            request={currentRequest}
            onSign={handleContractSigned}
            isSigned={status === REQUEST_STATUS.ACTIVE}
            onNavigate={() => navigate(ROUTES.COURIER_DASHBOARD)}
          />
        )}

        <button className="link-button" type="button" onClick={() => navigate(ROUTES.LOGIN)}>
          {t.backLogin}
        </button>
      </main>
    </div>
  );
}
