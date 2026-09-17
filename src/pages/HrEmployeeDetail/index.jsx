import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useMasterData } from '@/context/MasterDataContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS } from '@/constants/requestStatus';
import CompanyWarehouseSelect from '@/components/shared/CompanyWarehouseSelect';
import CourierApplicationInfo from '@/components/shared/CourierApplicationInfo';
import Icon from '@/components/ui/Icon';

const CITIES = ['Riyadh', 'Jeddah', 'Dammam'];

function buildForm(request) {
  return {
    fullName: request?.fullName || '',
    phone: request?.phone || '',
    city: request?.city || '',
    supervisorId: request?.supervisorId || '',
    companyId: request?.companyId || '',
    warehouseId: request?.warehouseId || '',
    bankName: request?.bankName || '',
    iban: request?.iban || '',
  };
}

export default function HrEmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { supervisors, addSupervisor } = useMasterData();
  const { requests, updateRequest } = useOnboarding();
  const isAr = lang === 'ar';

  const request = requests.find((item) => item.id === id);

  const [form, setForm] = useState(() => buildForm(request));
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!request) {
    return (
      <div>
        <div className="admin-page-header">
          <h1>{t.employeesTitle}</h1>
        </div>
        <div className="admin-card">
          <h2>{t.noEmployees}</h2>
          <button className="secondary-button" onClick={() => navigate(ROUTES.HR_EMPLOYEES)}>
            {t.backToEmployees}
          </button>
        </div>
      </div>
    );
  }

  const accountStatus = request.accountStatus || 'active';
  const isSuspended = accountStatus === 'suspended';

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFeedback('');
  };

  const startEditing = () => {
    setForm(buildForm(request));
    setFeedback('');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setForm(buildForm(request));
    setFeedback('');
    setIsEditing(false);
  };

  const handleSave = () => {
    updateRequest(request.id, { ...form });
    setFeedback(t.changesSaved);
    setIsEditing(false);
  };

  const toggleAccount = () => {
    const message = isSuspended ? t.confirmActivate : t.confirmSuspend;
    if (window.confirm(message)) {
      updateRequest(request.id, { accountStatus: isSuspended ? 'active' : 'suspended' });
      setFeedback('');
    }
  };

  const canPromote = request.status === REQUEST_STATUS.ACTIVE && !request.isSupervisor;

  const promoteToSupervisor = () => {
    addSupervisor({
      employeeId: request.id,
      nameAr: request.fullName,
      nameEn: request.fullName,
      phone: request.phone ? `+966${request.phone}` : '',
      email: '',
      regionAr: request.city,
      regionEn: request.city,
    });
    updateRequest(request.id, { isSupervisor: true });
    navigate(ROUTES.HR_SUPERVISORS);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{request.fullName}</h1>
          <p>
            {t.employeeDetails} · {request.id}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className={`admin-badge ${isSuspended ? 'admin-badge--danger' : 'admin-badge--success'}`}>
            {isSuspended ? t.accountSuspended : t.accountActive}
          </span>
          {canPromote && (
            <button className="secondary-button" type="button" onClick={promoteToSupervisor}>
              <Icon name="supervisor" size={15} strokeWidth={2.2} />
              <span>{t.promoteCourier}</span>
            </button>
          )}
          <button className="secondary-button" type="button" onClick={toggleAccount}>
            <Icon name={isSuspended ? 'check' : 'close'} size={15} strokeWidth={2.2} />
            <span>{isSuspended ? t.activateAccount : t.suspendAccount}</span>
          </button>
        </div>
      </div>

      <button
        className="link-button"
        type="button"
        style={{ marginBottom: '16px' }}
        onClick={() => navigate(ROUTES.HR_EMPLOYEES)}
      >
        ← {t.backToEmployees}
      </button>

      {feedback && (
        <div className="operations-success-banner" role="status" style={{ marginBottom: '16px' }}>
          <div className="success-icon-badge">
            <Icon name="check" size={18} strokeWidth={2.2} />
          </div>
          <span>{feedback}</span>
        </div>
      )}

      <div className="admin-columns">
        <section className="admin-card">
          <div className="section-title">
            <Icon name="edit" size={18} />
            <h2>{t.editData}</h2>
            <div className="section-title__actions">
              {isEditing ? (
                <>
                  <button
                    className="secondary-button admin-btn-danger"
                    type="button"
                    onClick={cancelEditing}
                  >
                    <Icon name="close" size={15} strokeWidth={2.2} />
                    <span>{t.cancelBtn}</span>
                  </button>
                  <button className="primary-button" type="button" onClick={handleSave}>
                    <Icon name="check" size={15} strokeWidth={2.4} />
                    <span>{t.saveChanges}</span>
                  </button>
                </>
              ) : (
                <button className="primary-button" type="button" onClick={startEditing}>
                  <Icon name="edit" size={15} strokeWidth={2.2} />
                  <span>{t.editData}</span>
                </button>
              )}
            </div>
          </div>

          <fieldset className="admin-fieldset form-stack" disabled={!isEditing}>
            <div className="form-grid">
              <label>
                {t.fullName}
                <input
                  value={form.fullName}
                  onChange={(event) => handleChange('fullName', event.target.value)}
                />
              </label>
              <label>
                {t.phone}
                <input
                  dir="ltr"
                  value={form.phone}
                  onChange={(event) => handleChange('phone', event.target.value)}
                />
              </label>
              <label>
                {t.city}
                <select
                  value={form.city}
                  onChange={(event) => handleChange('city', event.target.value)}
                >
                  <option value="" disabled>
                    {t.chooseCity}
                  </option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t.preferredSupervisor}
                <select
                  value={form.supervisorId}
                  onChange={(event) => handleChange('supervisorId', event.target.value)}
                >
                  <option value="" disabled>
                    {t.chooseSupervisor}
                  </option>
                  {supervisors.map((item) => (
                    <option key={item.id} value={item.id}>
                      {isAr ? item.nameAr : item.nameEn}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="section-title" style={{ marginTop: '8px' }}>
              <Icon name="building" size={18} />
              <h2>{t.jobInfo}</h2>
            </div>
            <CompanyWarehouseSelect
              selectedCompany={form.companyId}
              onSelectCompany={(value) => handleChange('companyId', value)}
              selectedWarehouse={form.warehouseId}
              onSelectWarehouse={(value) => handleChange('warehouseId', value)}
              disabled={!isEditing}
            />

            <div className="section-title" style={{ marginTop: '8px' }}>
              <Icon name="financialAdvance" size={18} />
              <h2>{t.bankInfo}</h2>
            </div>
            <div className="form-grid">
              <label>
                {t.bank}
                <input
                  value={form.bankName}
                  onChange={(event) => handleChange('bankName', event.target.value)}
                />
              </label>
              <label>
                {t.iban}
                <input
                  dir="ltr"
                  value={form.iban}
                  onChange={(event) => handleChange('iban', event.target.value)}
                />
              </label>
            </div>
          </fieldset>
        </section>

        <section className="admin-card">
          <CourierApplicationInfo request={request} />
        </section>
      </div>
    </div>
  );
}
