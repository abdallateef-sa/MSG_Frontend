import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useMasterData } from '@/context/MasterDataContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS } from '@/constants/requestStatus';
import Icon from '@/components/ui/Icon';

export default function HrSupervisors() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { companies, supervisors, addSupervisor } = useMasterData();
  const { requests, updateRequest } = useOnboarding();

  const [isPromoteOpen, setIsPromoteOpen] = useState(false);
  const [courierId, setCourierId] = useState('');
  const [feedback, setFeedback] = useState('');

  const rows = useMemo(
    () =>
      supervisors.map((supervisor) => ({
        supervisor,
        warehouses: companies.reduce(
          (count, company) =>
            count + company.warehouses.filter((w) => w.supervisorId === supervisor.id).length,
          0,
        ),
        couriers: requests.filter((request) => request.supervisorId === supervisor.id).length,
      })),
    [supervisors, companies, requests],
  );

  const candidates = useMemo(
    () =>
      requests.filter(
        (request) => request.status === REQUEST_STATUS.ACTIVE && !request.isSupervisor,
      ),
    [requests],
  );

  const openPromote = () => {
    setCourierId(candidates[0]?.id || '');
    setFeedback('');
    setIsPromoteOpen(true);
  };

  const handlePromote = (event) => {
    event.preventDefault();
    const courier = candidates.find((item) => item.id === courierId);
    if (!courier) return;

    addSupervisor({
      employeeId: courier.id,
      nameAr: courier.fullName,
      nameEn: courier.fullName,
      phone: courier.phone ? `+966${courier.phone}` : '',
      email: '',
      regionAr: courier.city,
      regionEn: courier.city,
    });
    updateRequest(courier.id, { isSupervisor: true });
    setFeedback(t.supervisorPromoted);
    setIsPromoteOpen(false);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{t.supervisorsTitle}</h1>
          <p>{t.supervisorsHint}</p>
        </div>
        <button className="primary-button" type="button" onClick={openPromote}>
          <Icon name="plus" size={16} strokeWidth={2.4} />
          <span>{t.promoteCourier}</span>
        </button>
      </div>

      {feedback && (
        <div className="operations-success-banner" role="status" style={{ marginBottom: '16px' }}>
          <div className="success-icon-badge">
            <Icon name="check" size={18} strokeWidth={2.2} />
          </div>
          <span>{feedback}</span>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-toolbar">
          <div className="admin-toolbar__filters" />
          <span className="op-history-badge">{rows.length}</span>
        </div>

        {rows.length === 0 ? (
          <div className="admin-empty">
            <Icon name="supervisor" size={32} />
            <p>{t.noSupervisors}</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.employeeId}</th>
                  <th>{t.fullName}</th>
                  <th>{t.phone}</th>
                  <th>{t.email}</th>
                  <th>{t.region}</th>
                  <th>{t.warehousesCount}</th>
                  <th>{t.couriersCount}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ supervisor, warehouses, couriers }) => (
                  <tr
                    key={supervisor.id}
                    onClick={() =>
                      navigate(ROUTES.HR_SUPERVISOR_DETAIL.replace(':id', supervisor.id))
                    }
                  >
                    <td dir="ltr">{supervisor.employeeId || '—'}</td>
                    <td>{supervisor.nameAr}</td>
                    <td dir="ltr">{supervisor.phone || '—'}</td>
                    <td dir="ltr">{supervisor.email || '—'}</td>
                    <td>{supervisor.regionAr || '—'}</td>
                    <td>{warehouses}</td>
                    <td>{couriers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isPromoteOpen && (
        <div className="op-modal-backdrop" onClick={() => setIsPromoteOpen(false)}>
          <div
            className="op-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="promote-courier-title"
          >
            <div className="op-modal-header">
              <div className="op-modal-title-group">
                <div className="op-modal-icon-badge">
                  <Icon name="supervisor" size={18} />
                </div>
                <div>
                  <h3 id="promote-courier-title">{t.promoteCourier}</h3>
                  <p className="op-modal-subtitle">{t.supervisorsHint}</p>
                </div>
              </div>
              <button
                type="button"
                className="op-modal-close"
                onClick={() => setIsPromoteOpen(false)}
                aria-label={t.cancelBtn}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form className="admin-modal-body form-stack" onSubmit={handlePromote}>
              {candidates.length === 0 ? (
                <div className="admin-empty">{t.noCouriersToPromote}</div>
              ) : (
                <div className="form-grid">
                  <label>
                    {t.chooseCourier}
                    <select
                      required
                      value={courierId}
                      onChange={(event) => setCourierId(event.target.value)}
                    >
                      {candidates.map((courier) => (
                        <option key={courier.id} value={courier.id}>
                          {courier.fullName} · {courier.id}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              <div className="supervisor-review-actions">
                <button className="btn-cancel" type="button" onClick={() => setIsPromoteOpen(false)}>
                  {t.cancelBtn}
                </button>
                <button
                  className="primary-button"
                  type="submit"
                  disabled={candidates.length === 0}
                >
                  <Icon name="check" size={16} strokeWidth={2.4} />
                  <span>{t.promoteConfirm}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
