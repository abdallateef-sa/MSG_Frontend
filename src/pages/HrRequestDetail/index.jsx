import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS, CANCEL_REASON } from '@/constants/requestStatus';
import AppHeader from '@/components/shared/AppHeader';
import CourierApplicationInfo from '@/components/shared/CourierApplicationInfo';

export default function HrRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dir } = useLanguage();
  const { requests, updateRequest } = useOnboarding();

  const request = requests.find((r) => r.id === id);

  const [sanadUrl, setSanadUrl] = useState(request?.sanadUrl || '');
  const [sanadNumber, setSanadNumber] = useState(request?.sanadNumber || '');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (!request) {
    return (
      <div className="onboarding-page" dir={dir}>
        <AppHeader title="الموارد البشرية (HR)" />
        <main className="onboarding-main">
          <div className="courier-card">
            <h2>الطلب غير موجود</h2>
            <button className="secondary-button" onClick={() => navigate(ROUTES.HR_REQUESTS)}>
              العودة لقائمة طلبات HR
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isPendingHr = request.status === REQUEST_STATUS.PENDING_HR;
  const isPendingAbsher = request.status === REQUEST_STATUS.PENDING_ABSHER;

  const handleSendToAbsher = (e) => {
    e.preventDefault();
    if (!sanadNumber.trim()) {
      alert('يجب إدخال رقم السند أولاً قبل إرساله لأبشر');
      return;
    }

    updateRequest(request.id, {
      sanadUrl,
      sanadNumber,
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
    <div className="onboarding-page" dir={dir}>
      <AppHeader title="مراجعة السند وقرار أبشر (HR)" />

      <main
        className="onboarding-main"
        style={{ maxWidth: '750px', width: '100%', margin: '0 auto', padding: '24px 16px' }}
      >
        <button
          className="link-button"
          onClick={() => navigate(ROUTES.HR_REQUESTS)}
          style={{ marginBottom: '16px', display: 'inline-block' }}
        >
          ← العودة لقائمة طلبات HR
        </button>

        <div className="courier-card form-stack">
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
            <div
              style={{
                padding: '12px 16px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                color: '#065f46',
                fontWeight: '500',
              }}
            >
              ✓ {feedbackMsg}
            </div>
          )}

          <CourierApplicationInfo request={request} />

          {/* STEP 1: When PENDING_HR - Enter Sanad Details */}
          {isPendingHr && (
            <form onSubmit={handleSendToAbsher} style={{ marginTop: '20px' }}>
              <div className="section-title">
                <span>📝</span>
                <h2>تسجيل بيانات السند الإلكتروني</h2>
              </div>
              <p className="muted" style={{ margin: '4px 0 16px' }}>
                يقوم مسؤول الـ HR بإدخال بيانات المندوب في منصة نافذ/سند يدوياً ثم إدخال رابط ورقم
                السند هنا لإشعار المندوب.
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
                  رابط السند (اختياري)
                  <input
                    type="url"
                    placeholder="https://sanad.sa/verify/..."
                    value={sanadUrl}
                    onChange={(e) => setSanadUrl(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-actions" style={{ marginTop: '20px' }}>
                <button
                  className="primary-button"
                  type="submit"
                  disabled={!sanadNumber.trim()}
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
                <span>⏳</span>
                <h2>مرحلة قرار المندوب في منصة أبشر</h2>
              </div>

              <section
                className="notice-card"
                style={{ borderColor: '#2563eb', background: '#eff6ff', margin: '12px 0' }}
              >
                <span style={{ color: '#2563eb' }}>ℹ</span>
                <div>
                  <b style={{ color: '#1e40af' }}>بانتظار قرار المندوب على تطبيق أبشر</b>
                  <p style={{ color: '#1e3a8a', margin: '4px 0' }}>
                    تم إرسال السند بنجاح. المندوب الآن يراجع السند من داخل حسابه الشخصي في أبشر
                    ويوافق أو يرفض هناك.
                  </p>
                  <div style={{ marginTop: '8px', fontSize: '13px' }}>
                    <strong>رقم السند:</strong> <code>{request.sanadNumber}</code>
                    {request.sanadUrl && (
                      <span style={{ margin: '0 12px' }}>
                        |{' '}
                        <a
                          href={request.sanadUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#2563eb' }}
                        >
                          رابط المعاينة ↗
                        </a>
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
                  ✓ المندوب وافق في أبشر (إصدار العقد)
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
              {request.cancelReason && (
                <div style={{ marginTop: '8px', color: '#dc2626', fontSize: '13px' }}>
                  سبب الإلغاء: <b>{request.cancelReason}</b>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
