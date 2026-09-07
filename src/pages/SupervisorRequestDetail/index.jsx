import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS, CANCEL_REASON } from '@/constants/requestStatus';
import AppHeader from '@/components/shared/AppHeader';
import CompanyWarehouseSelect from '@/components/shared/CompanyWarehouseSelect';

export default function SupervisorRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const { requests, updateRequest } = useOnboarding();

  const request = requests.find((r) => r.id === id);

  const [companyId, setCompanyId] = useState(request?.companyId || '');
  const [warehouseId, setWarehouseId] = useState(request?.warehouseId || '');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (!request) {
    return (
      <div className="onboarding-page" dir={dir}>
        <AppHeader title={t.supervisorRequests || 'المشرف'} />
        <main className="onboarding-main">
          <div className="courier-card">
            <h2>الطلب غير موجود</h2>
            <button
              className="secondary-button"
              onClick={() => navigate(ROUTES.SUPERVISOR_REQUESTS)}
            >
              العودة لقائمة الطلبات
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isPending = request.status === REQUEST_STATUS.PENDING_SUPERVISOR;

  const handleApprove = () => {
    if (!companyId || !warehouseId) {
      alert('يرجى اختيار الشركة والمخزن أولاً');
      return;
    }

    updateRequest(request.id, {
      companyId,
      warehouseId,
      status: REQUEST_STATUS.PENDING_HR,
    });
    setFeedbackMsg('تم اعتماد الطلب بنجاح وتحويله إلى قسم الموارد البشرية (HR)');
  };

  const handleReject = () => {
    if (window.confirm('هل أنت متأكد من رفض هذا الطلب؟')) {
      updateRequest(request.id, {
        status: REQUEST_STATUS.CANCELLED,
        cancelReason: CANCEL_REASON.SUPERVISOR_REJECTED,
      });
      setFeedbackMsg('تم رفض الطلب بنجاح.');
    }
  };

  return (
    <div className="onboarding-page" dir={dir}>
      <AppHeader title={t.supervisorRequests || 'تفاصيل طلب المندوب'} />

      <main
        className="onboarding-main"
        style={{ maxWidth: '750px', width: '100%', margin: '0 auto', padding: '24px 16px' }}
      >
        <button
          className="link-button"
          onClick={() => navigate(ROUTES.SUPERVISOR_REQUESTS)}
          style={{ marginBottom: '16px', display: 'inline-block' }}
        >
          ← العودة لقائمة طلبات المشرف
        </button>

        <div className="courier-card form-stack">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="eyebrow">بيانات المندوب</span>
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

          {/* Applicant info grid */}
          <div
            className="form-grid"
            style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}
          >
            <div>
              <small className="muted">الهوية / الإقامة:</small>
              <div>
                <b>{request.nationalId}</b>
              </div>
            </div>
            <div>
              <small className="muted">رقم الجوال:</small>
              <div dir="ltr" style={{ textAlign: 'start' }}>
                <b>+966 {request.phone}</b>
              </div>
            </div>
            <div>
              <small className="muted">المدينة المستهدفة:</small>
              <div>
                <b>{request.city}</b>
              </div>
            </div>
            <div>
              <small className="muted">حالة المركبة:</small>
              <div>
                <b>{request.hasVehicle ? 'يمتلك سيارة خاصة' : 'يحتاج سيارة من الشركة'}</b>
              </div>
            </div>
            {request.hasVehicle && (
              <>
                <div>
                  <small className="muted">رقم اللوحة:</small>
                  <div>
                    <b>{request.vehiclePlate || '---'}</b>
                  </div>
                </div>
                <div>
                  <small className="muted">نوع المركبة:</small>
                  <div>
                    <b>{request.vehicleType || '---'}</b>
                  </div>
                </div>
              </>
            )}
            <div>
              <small className="muted">البنك والآيبان:</small>
              <div style={{ fontSize: '11px', wordBreak: 'break-all' }}>
                <b>{request.bankName}</b> - {request.iban}
              </div>
            </div>
          </div>

          {/* Section: Assign Company & Warehouse */}
          <div style={{ marginTop: '20px' }}>
            <div className="section-title">
              <span>🏢</span>
              <h2>تحديد الشركة والمخزن</h2>
            </div>
            <p className="muted" style={{ margin: '4px 0 16px' }}>
              المشرف مسؤول عن توجيه المندوب إلى الشركة المشغلة والمستودع المناسب.
            </p>

            <CompanyWarehouseSelect
              selectedCompany={companyId}
              onSelectCompany={setCompanyId}
              selectedWarehouse={warehouseId}
              onSelectWarehouse={setWarehouseId}
              disabled={!isPending}
            />
          </div>

          {/* Actions */}
          {isPending ? (
            <div className="form-actions" style={{ marginTop: '24px' }}>
              <button
                className="secondary-button"
                type="button"
                onClick={handleReject}
                style={{ color: '#dc2626', borderColor: '#fca5a5' }}
              >
                رفض الطلب
              </button>
              <button
                className="primary-button"
                type="button"
                onClick={handleApprove}
                disabled={!companyId || !warehouseId}
              >
                موافقة واعتماد الطلب (تحويل للـ HR)
              </button>
            </div>
          ) : (
            <div
              style={{
                marginTop: '20px',
                padding: '12px',
                background: '#f3f4f6',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            >
              ℹ️ تم اتخاذ الإجراء على هذا الطلب مسبقاً (الحالة الحالية: <b>{request.status}</b>)
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
