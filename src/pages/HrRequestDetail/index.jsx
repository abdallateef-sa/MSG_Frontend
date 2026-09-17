import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS, CANCEL_REASON } from '@/constants/requestStatus';
import CourierApplicationInfo from '@/components/shared/CourierApplicationInfo';
import Icon from '@/components/ui/Icon';

export default function HrRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { requests, updateRequest } = useOnboarding();

  const request = requests.find((r) => r.id === id);

  const [sanadNumber, setSanadNumber] = useState(request?.sanadNumber || '');
  const [sanadDate, setSanadDate] = useState(request?.sanadDate || '');
  const [sanadAmount, setSanadAmount] = useState(request?.sanadAmount || '');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (!request) {
    return (
      <div>
        <div className="admin-page-header">
          <h1>{t.navRecruitment}</h1>
        </div>
        <div className="admin-card">
          <h2>{t.noRequests}</h2>
          <button className="secondary-button" onClick={() => navigate(ROUTES.HR_REQUESTS)}>
            {t.navRecruitment}
          </button>
        </div>
      </div>
    );
  }

  const isPendingHr = request.status === REQUEST_STATUS.PENDING_HR;
  const isPendingAbsher = request.status === REQUEST_STATUS.PENDING_ABSHER;

  const handleSendToAbsher = (e) => {
    e.preventDefault();
    if (!sanadNumber.trim() || !sanadDate || !sanadAmount) {
      alert('يجب إدخال رقم السند وتاريخه ومبلغه قبل إرساله لأبشر');
      return;
    }

    updateRequest(request.id, {
      sanadNumber,
      sanadDate,
      sanadAmount,
      status: REQUEST_STATUS.PENDING_ABSHER,
    });
    setFeedbackMsg('تم حفظ بيانات السند وتحديث الحالة إلى: بانتظار قرار المندوب في أبشر');
  };

  const handleAbsherApprove = () => {
    updateRequest(request.id, {
      status: REQUEST_STATUS.PENDING_CONTRACT,
    });
    setFeedbackMsg('تم تسجيل موافقة المندوب في أبشر، والطلب الآن في مرحلة: توقيع العقد');
  };

  const handleAbsherReject = () => {
    if (window.confirm('هل أنت متأكد من تسجيل رفض السند من قِبل المندوب في منصة أبشر؟')) {
      updateRequest(request.id, {
        status: REQUEST_STATUS.CANCELLED,
        cancelReason: CANCEL_REASON.ABSHER_REJECTED,
      });
      setFeedbackMsg('تم إلغاء الطلب بناءً على رفض المندوب في أبشر.');
    }
  };

  return (
    <div>
      <button
        className="link-button"
        onClick={() => navigate(ROUTES.HR_REQUESTS)}
        style={{ marginBottom: '16px', display: 'inline-block' }}
      >
        ← العودة لقائمة طلبات HR
      </button>

      <div className="admin-card form-stack">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="eyebrow">إدارة السند وموافقة أبشر</span>
              <h2>{request.fullName}</h2>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>رقم الطلب: {request.id}</span>
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

          {/* STEP 1: When PENDING_HR - Enter Sanad Details */}
          {isPendingHr && (
            <form onSubmit={handleSendToAbsher} style={{ marginTop: '20px' }}>
              <div className="section-title">
                <Icon name="edit" size={18} />
                <h2>تسجيل بيانات السند الإلكتروني</h2>
              </div>
              <p className="muted" style={{ margin: '4px 0 16px' }}>
                يقوم مسؤول الـ HR بإدخال بيانات المندوب في منصة نافذ/سند يدوياً ثم إدخال رقم السند
                وتاريخه ومبلغه هنا لإشعار المندوب.
              </p>

              <div className="form-grid">
                <label>
                  رقم السند في منصة نافذ
                  <input
                    required
                    placeholder="مثال: SND-89761"
                    value={sanadNumber}
                    onChange={(e) => setSanadNumber(e.target.value)}
                  />
                </label>

                <label>
                  تاريخ السند
                  <input
                    required
                    type="date"
                    value={sanadDate}
                    onChange={(e) => setSanadDate(e.target.value)}
                  />
                </label>

                <label>
                  مبلغ السند (ر.س)
                  <input
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="مثال: 5000"
                    value={sanadAmount}
                    onChange={(e) => setSanadAmount(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-actions" style={{ marginTop: '20px' }}>
                <button
                  className="primary-button"
                  type="submit"
                  disabled={!sanadNumber.trim() || !sanadDate || !sanadAmount}
                  style={{ width: '100%' }}
                >
                  تم الإرسال لأبشر (نقل الطلب لانتظار قرار المندوب)
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: When PENDING_ABSHER - Read Sanad & Register Absher Decision */}
          {isPendingAbsher && (
            <div style={{ marginTop: '20px' }}>
              <div className="section-title">
                <Icon name="clock" size={18} />
                <h2>مرحلة قرار المندوب في منصة أبشر</h2>
              </div>

              <section
                className="notice-card"
                style={{ borderColor: '#139a43', background: '#ecfdf5', margin: '12px 0' }}
              >
                <Icon name="info" size={18} style={{ color: '#139a43' }} />
                <div>
                  <b style={{ color: '#065f46' }}>بانتظار قرار المندوب على تطبيق أبشر</b>
                  <p style={{ color: '#065f46', margin: '4px 0' }}>
                    تم إرسال السند بنجاح. المندوب الآن يراجع السند من داخل حسابه الشخصي في أبشر
                    ويوافق أو يرفض هناك.
                  </p>
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '13px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <span>
                      <strong>رقم السند:</strong> <code>{request.sanadNumber}</code>
                    </span>
                    {request.sanadDate && (
                      <span>
                        <strong>تاريخ السند:</strong> {request.sanadDate}
                      </span>
                    )}
                    {request.sanadAmount && (
                      <span>
                        <strong>مبلغ السند:</strong> {request.sanadAmount} ر.س
                      </span>
                    )}
                  </div>
                </div>
              </section>

              <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '16px 0 8px' }}>
                تسجيل قرار المندوب المستلم من منصة أبشر:
              </p>

              <div className="form-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={handleAbsherReject}
                  style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                >
                  المندوب رفض السند في أبشر
                </button>

                <button className="primary-button" type="button" onClick={handleAbsherApprove}>
                  <Icon name="check" size={16} strokeWidth={2.4} />
                  <span>المندوب وافق في أبشر (إصدار العقد)</span>
                </button>
              </div>
            </div>
          )}

          {/* When Request is already past Absher (e.g. Contract, Active, Cancelled) */}
          {!isPendingHr && !isPendingAbsher && (
            <div
              style={{
                marginTop: '20px',
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '8px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}
              >
                <strong>حالة السند وأبشر:</strong>
                <span className="status">{request.status}</span>
              </div>
              {request.sanadNumber && (
                <div style={{ fontSize: '13px' }}>
                  <span>
                    رقم السند: <b>{request.sanadNumber}</b>
                  </span>
                </div>
              )}
              {request.sanadDate && (
                <div style={{ fontSize: '13px' }}>
                  <span>
                    تاريخ السند: <b>{request.sanadDate}</b>
                  </span>
                </div>
              )}
              {request.sanadAmount && (
                <div style={{ fontSize: '13px' }}>
                  <span>
                    مبلغ السند: <b>{request.sanadAmount} ر.س</b>
                  </span>
                </div>
              )}
              {request.cancelReason && (
                <div style={{ marginTop: '8px', color: '#dc2626', fontSize: '13px' }}>
                  سبب الإلغاء: <b>{request.cancelReason}</b>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
