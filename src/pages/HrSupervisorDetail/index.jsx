import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useMasterData } from '@/context/MasterDataContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS } from '@/constants/requestStatus';
import PersonLink from '@/components/shared/PersonLink';
import Icon from '@/components/ui/Icon';

function buildForm(supervisor) {
  return {
    employeeId: supervisor?.employeeId || '',
    nameAr: supervisor?.nameAr || '',
    nameEn: supervisor?.nameEn || '',
    phone: supervisor?.phone || '',
    email: supervisor?.email || '',
    regionAr: supervisor?.regionAr || '',
    regionEn: supervisor?.regionEn || '',
  };
}

export default function HrSupervisorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { companies, cities, supervisors, updateSupervisor } = useMasterData();
  const { requests } = useOnboarding();
  const isAr = lang === 'ar';

  const supervisor = supervisors.find((item) => item.id === id);

  const [form, setForm] = useState(() => buildForm(supervisor));
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!supervisor) {
    return (
      <div>
        <div className="admin-page-header">
          <h1>{t.supervisorsTitle}</h1>
        </div>
        <div className="admin-card">
          <h2>{t.noSupervisors}</h2>
          <button className="secondary-button" onClick={() => navigate(ROUTES.HR_SUPERVISORS)}>
            {t.supervisorsTitle}
          </button>
        </div>
      </div>
    );
  }

  const warehouses = companies.flatMap((company) =>
    company.warehouses
      .filter((warehouse) => warehouse.supervisorId === id)
      .map((warehouse) => ({
        ...warehouse,
        companyName: isAr ? company.nameAr : company.nameEn,
        cityName: (() => {
          const city = cities.find((item) => item.id === warehouse.cityId);
          return city ? (isAr ? city.nameAr : city.nameEn) : '—';
        })(),
      })),
  );

  const couriers = requests.filter((request) => request.supervisorId === id);

  const handleField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFeedback('');
  };

  const startEditing = () => {
    setForm(buildForm(supervisor));
    setFeedback('');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setForm(buildForm(supervisor));
    setFeedback('');
    setIsEditing(false);
  };

  const handleSave = () => {
    updateSupervisor(supervisor.id, { ...form });
    setFeedback(t.changesSaved);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{supervisor.nameAr}</h1>
          <p>
            {t.supervisor} · {supervisor.employeeId}
          </p>
        </div>
      </div>

      <button
        className="link-button"
        type="button"
        style={{ marginBottom: '16px' }}
        onClick={() => navigate(ROUTES.HR_SUPERVISORS)}
      >
        ← {t.supervisorsTitle}
      </button>

      {feedback && (
        <div className="operations-success-banner" role="status" style={{ marginBottom: '16px' }}>
          <div className="success-icon-badge">
            <Icon name="check" size={18} strokeWidth={2.2} />
          </div>
          <span>{feedback}</span>
        </div>
      )}

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
              {t.fullName} ({t.nameArLabel})
              <input
                value={form.nameAr}
                onChange={(event) => handleField('nameAr', event.target.value)}
              />
            </label>
            <label>
              {t.fullName} ({t.nameEnLabel})
              <input
                dir="ltr"
                value={form.nameEn}
                onChange={(event) => handleField('nameEn', event.target.value)}
              />
            </label>
            <label>
              {t.employeeId}
              <input
                dir="ltr"
                value={form.employeeId}
                onChange={(event) => handleField('employeeId', event.target.value)}
              />
            </label>
            <label>
              {t.phone}
              <input
                dir="ltr"
                value={form.phone}
                onChange={(event) => handleField('phone', event.target.value)}
              />
            </label>
            <label>
              {t.email}
              <input
                dir="ltr"
                type="email"
                value={form.email}
                onChange={(event) => handleField('email', event.target.value)}
              />
            </label>
            <label>
              {t.region} ({t.nameArLabel})
              <input
                value={form.regionAr}
                onChange={(event) => handleField('regionAr', event.target.value)}
              />
            </label>
            <label>
              {t.region} ({t.nameEnLabel})
              <input
                dir="ltr"
                value={form.regionEn}
                onChange={(event) => handleField('regionEn', event.target.value)}
              />
            </label>
            <label>
              {t.roleLabel}
              <input value={t.roleSupervisor} disabled readOnly />
            </label>
          </div>
        </fieldset>
      </section>

      <section className="admin-card" style={{ marginTop: '20px' }}>
        <div className="section-header" style={{ marginBottom: '12px' }}>
          <h2>{t.supervisorWarehouses}</h2>
          <span className="op-history-badge">{warehouses.length}</span>
        </div>
        {warehouses.length === 0 ? (
          <div className="admin-empty">{t.noRequests}</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.warehouseCode}</th>
                  <th>{t.mdWarehouse}</th>
                  <th>{t.mdCompany}</th>
                  <th>{t.mdCity}</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map((warehouse) => (
                  <tr
                    key={warehouse.id}
                    onClick={() => navigate(`${ROUTES.HR_MASTER_DATA}?tab=warehouses`)}
                  >
                    <td dir="ltr">{warehouse.code}</td>
                    <td>{isAr ? warehouse.nameAr : warehouse.nameEn}</td>
                    <td>{warehouse.companyName}</td>
                    <td>{warehouse.cityName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-card" style={{ marginTop: '20px' }}>
        <div className="section-header" style={{ marginBottom: '12px' }}>
          <h2>{t.supervisorCouriers}</h2>
          <span className="op-history-badge">{couriers.length}</span>
        </div>
        {couriers.length === 0 ? (
          <div className="admin-empty">{t.noEmployees}</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.fullName}</th>
                  <th>{t.phone}</th>
                  <th>{t.mdCity}</th>
                  <th>{t.docStatus}</th>
                </tr>
              </thead>
              <tbody>
                {couriers.map((courier) => (
                  <tr key={courier.id}>
                    <td>
                      <PersonLink to={`${ROUTES.HR_EMPLOYEES}/${courier.id}`}>
                        {courier.fullName}
                      </PersonLink>
                    </td>
                    <td dir="ltr">{courier.phone}</td>
                    <td>{courier.city}</td>
                    <td>
                      <span
                        className={`admin-badge ${
                          courier.status === REQUEST_STATUS.ACTIVE
                            ? 'admin-badge--success'
                            : courier.status === REQUEST_STATUS.CANCELLED
                              ? 'admin-badge--danger'
                              : 'admin-badge--info'
                        }`}
                      >
                        {courier.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
