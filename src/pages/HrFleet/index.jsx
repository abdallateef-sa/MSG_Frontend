import { useMemo, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { useFleet } from '@/context/FleetContext';
import { REQUEST_STATUS } from '@/constants/requestStatus';
import { ROUTES } from '@/constants/routes';
import { buildFleet } from '@/constants/mockHrFleet';
import PersonLink from '@/components/shared/PersonLink';
import Icon from '@/components/ui/Icon';

const VEHICLE_TYPES = ['Sedan', 'Cargo van'];

function expiryTone(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  if (!dateStr || Number.isNaN(diff)) return 'admin-badge--muted';
  if (diff < 0) return 'admin-badge--danger';
  if (diff <= 30) return 'admin-badge--warning';
  return 'admin-badge--success';
}

function emptyForm() {
  return {
    ownership: 'company',
    employeeId: '',
    plate: '',
    type: 'Cargo van',
    insuranceExpiry: '',
    registrationExpiry: '',
    status: 'active',
  };
}

function formFromVehicle(vehicle) {
  return {
    ownership: vehicle.ownership,
    employeeId: vehicle.employeeId || '',
    plate: vehicle.plate === '—' ? '' : vehicle.plate,
    type: vehicle.type,
    insuranceExpiry: vehicle.insuranceExpiry || '',
    registrationExpiry: vehicle.registrationExpiry || '',
    status: vehicle.status,
  };
}

export default function HrFleet() {
  const { t } = useLanguage();
  const { requests } = useOnboarding();
  const { addedVehicles, overrides, removedIds, addVehicle, updateVehicle, removeVehicle } =
    useFleet();

  const [query, setQuery] = useState('');
  const [ownershipFilter, setOwnershipFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [feedback, setFeedback] = useState('');

  const employees = useMemo(
    () => requests.filter((request) => request.status === REQUEST_STATUS.ACTIVE),
    [requests],
  );

  const fleet = useMemo(() => {
    const derived = buildFleet(employees).map((vehicle) => ({
      ...vehicle,
      ...(overrides[vehicle.id] || {}),
    }));
    return [...addedVehicles, ...derived].filter((vehicle) => !removedIds.includes(vehicle.id));
  }, [addedVehicles, employees, overrides, removedIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fleet.filter((vehicle) => {
      const matchesQuery =
        !q ||
        vehicle.employeeName.toLowerCase().includes(q) ||
        vehicle.plate.toLowerCase().includes(q);
      const matchesOwnership = ownershipFilter === 'all' || vehicle.ownership === ownershipFilter;
      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
      return matchesQuery && matchesOwnership && matchesStatus;
    });
  }, [fleet, query, ownershipFilter, statusFilter]);

  const ownershipLabel = (ownership) => (ownership === 'own' ? t.ownVehicle : t.companyVehicle);
  const statusLabel = (status) =>
    status === 'maintenance' ? t.vehicleStatusMaintenance : t.vehicleStatusActive;

  const stats = [
    { key: 'totalVehicles', value: fleet.length, icon: 'vehicle', tone: 'default' },
    { key: 'companyVehicles', value: fleet.filter((v) => v.ownership === 'company').length, icon: 'building', tone: 'info' },
    { key: 'ownVehicles', value: fleet.filter((v) => v.ownership === 'own').length, icon: 'vehicle', tone: 'default' },
    { key: 'vehicleStatusMaintenance', value: fleet.filter((v) => v.status === 'maintenance').length, icon: 'maintenance', tone: 'danger' },
  ];

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setFeedback('');
    setIsFormOpen(true);
  };

  const openEdit = (vehicle) => {
    setEditingId(vehicle.id);
    setForm(formFromVehicle(vehicle));
    setSelected(null);
    setIsFormOpen(true);
  };

  const handleDelete = (vehicle) => {
    if (window.confirm(t.confirmDeleteVehicle)) {
      removeVehicle(vehicle.id);
      setSelected(null);
    }
  };

  const handleField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const employee = employees.find((item) => item.id === form.employeeId);
    const payload = {
      employeeId: form.employeeId,
      employeeName: employee?.fullName || t.notAssigned,
      plate: form.plate,
      type: form.type,
      ownership: form.ownership,
      insuranceExpiry: form.insuranceExpiry,
      registrationExpiry: form.registrationExpiry,
      status: form.status,
    };

    if (editingId) {
      updateVehicle(editingId, payload);
      setFeedback(t.vehicleUpdated);
    } else {
      addVehicle({ id: `VEH-M-${Date.now()}`, ...payload });
      setFeedback(t.vehicleAdded);
    }
    setIsFormOpen(false);
  };

  const typeOptions = VEHICLE_TYPES.includes(form.type)
    ? VEHICLE_TYPES
    : [form.type, ...VEHICLE_TYPES];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{t.fleetTitle}</h1>
          <p>{t.fleetHint}</p>
        </div>
        <button className="primary-button" type="button" onClick={openAdd}>
          <Icon name="plus" size={16} strokeWidth={2.4} />
          <span>{t.addVehicle}</span>
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

      <section className="admin-stats">
        {stats.map((stat) => (
          <div className="admin-stat" key={stat.key}>
            <span className={`admin-stat__icon ${stat.tone}`}>
              <Icon name={stat.icon} size={22} strokeWidth={1.9} />
            </span>
            <div>
              <div className="admin-stat__value">{stat.value}</div>
              <div className="admin-stat__label">{t[stat.key]}</div>
            </div>
          </div>
        ))}
      </section>

      <div className="admin-card">
        <div className="admin-toolbar">
          <div className="admin-toolbar__filters">
            <input
              className="admin-input"
              type="search"
              placeholder={t.searchEmployees}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              className="admin-select"
              value={ownershipFilter}
              onChange={(event) => setOwnershipFilter(event.target.value)}
            >
              <option value="all">{t.fleetAllOwnership}</option>
              <option value="own">{t.ownVehicle}</option>
              <option value="company">{t.companyVehicle}</option>
            </select>
            <select
              className="admin-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">{t.allStatuses}</option>
              <option value="active">{t.vehicleStatusActive}</option>
              <option value="maintenance">{t.vehicleStatusMaintenance}</option>
            </select>
          </div>
          <span className="op-history-badge">{filtered.length}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty">
            <Icon name="vehicle" size={32} />
            <p>{t.noVehicles}</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.plate}</th>
                  <th>{t.type}</th>
                  <th>{t.fullName}</th>
                  <th>{t.vehicleOwnership}</th>
                  <th>{t.insuranceExpiry}</th>
                  <th>{t.registrationExpiry}</th>
                  <th>{t.docStatus}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((vehicle) => (
                  <tr key={vehicle.id} onClick={() => setSelected(vehicle)}>
                    <td>{vehicle.plate}</td>
                    <td>{vehicle.type}</td>
                    <td>
                      <PersonLink
                        to={vehicle.employeeId ? `${ROUTES.HR_EMPLOYEES}/${vehicle.employeeId}` : null}
                      >
                        {vehicle.employeeName}
                      </PersonLink>
                    </td>
                    <td>{ownershipLabel(vehicle.ownership)}</td>
                    <td>
                      <span className={`admin-badge ${expiryTone(vehicle.insuranceExpiry)}`}>
                        {vehicle.insuranceExpiry || '—'}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${expiryTone(vehicle.registrationExpiry)}`}>
                        {vehicle.registrationExpiry || '—'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-badge ${
                          vehicle.status === 'maintenance'
                            ? 'admin-badge--warning'
                            : 'admin-badge--success'
                        }`}
                      >
                        {statusLabel(vehicle.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="op-modal-backdrop" onClick={() => setSelected(null)}>
          <div
            className="op-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vehicle-details-title"
          >
            <div className="op-modal-header">
              <div className="op-modal-title-group">
                <div className="op-modal-icon-badge">
                  <Icon name="vehicle" size={18} />
                </div>
                <div>
                  <h3 id="vehicle-details-title">{t.vehicleDetails}</h3>
                  <p className="op-modal-subtitle">
                    <PersonLink
                      to={selected.employeeId ? `${ROUTES.HR_EMPLOYEES}/${selected.employeeId}` : null}
                    >
                      {selected.employeeName}
                    </PersonLink>
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="op-modal-close"
                onClick={() => setSelected(null)}
                aria-label={t.closeDetails}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-info-grid">
                <div className="op-detail-card">
                  <span className="op-detail-label">{t.plate}</span>
                  <strong>{selected.plate}</strong>
                </div>
                <div className="op-detail-card">
                  <span className="op-detail-label">{t.type}</span>
                  <strong>{selected.type}</strong>
                </div>
                <div className="op-detail-card">
                  <span className="op-detail-label">{t.vehicleOwnership}</span>
                  <strong>{ownershipLabel(selected.ownership)}</strong>
                </div>
                <div className="op-detail-card">
                  <span className="op-detail-label">{t.docStatus}</span>
                  <span
                    className={`admin-badge ${
                      selected.status === 'maintenance'
                        ? 'admin-badge--warning'
                        : 'admin-badge--success'
                    }`}
                  >
                    {statusLabel(selected.status)}
                  </span>
                </div>
                <div className="op-detail-card">
                  <span className="op-detail-label">{t.insuranceExpiry}</span>
                  <strong dir="ltr">{selected.insuranceExpiry || '—'}</strong>
                </div>
                <div className="op-detail-card">
                  <span className="op-detail-label">{t.registrationExpiry}</span>
                  <strong dir="ltr">{selected.registrationExpiry || '—'}</strong>
                </div>
              </div>

              <div className="supervisor-review-actions" style={{ marginTop: '16px' }}>
                <button
                  className="secondary-button admin-btn-danger"
                  type="button"
                  onClick={() => handleDelete(selected)}
                >
                  <Icon name="close" size={16} strokeWidth={2.2} />
                  <span>{t.deleteVehicle}</span>
                </button>
                <button className="primary-button" type="button" onClick={() => openEdit(selected)}>
                  <Icon name="edit" size={16} strokeWidth={2.2} />
                  <span>{t.editVehicle}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="op-modal-backdrop" onClick={() => setIsFormOpen(false)}>
          <div
            className="op-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vehicle-form-title"
          >
            <div className="op-modal-header">
              <div className="op-modal-title-group">
                <div className="op-modal-icon-badge">
                  <Icon name={editingId ? 'edit' : 'plus'} size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <h3 id="vehicle-form-title">{editingId ? t.editVehicle : t.addVehicle}</h3>
                  <p className="op-modal-subtitle">{t.fleetHint}</p>
                </div>
              </div>
              <button
                type="button"
                className="op-modal-close"
                onClick={() => setIsFormOpen(false)}
                aria-label={t.cancelBtn}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form className="admin-modal-body form-stack" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  {t.vehicleOwnership}
                  <select
                    value={form.ownership}
                    onChange={(event) => handleField('ownership', event.target.value)}
                  >
                    <option value="company">{t.companyVehicle}</option>
                    <option value="own">{t.ownVehicle}</option>
                  </select>
                </label>
                <label>
                  {t.assignEmployee}
                  <select
                    value={form.employeeId}
                    onChange={(event) => handleField('employeeId', event.target.value)}
                  >
                    <option value="">{t.notAssigned}</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.fullName}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {t.plate}
                  <input
                    required
                    value={form.plate}
                    onChange={(event) => handleField('plate', event.target.value)}
                  />
                </label>
                <label>
                  {t.type}
                  <select
                    value={form.type}
                    onChange={(event) => handleField('type', event.target.value)}
                  >
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {t.insuranceExpiry}
                  <input
                    required
                    type="date"
                    value={form.insuranceExpiry}
                    onChange={(event) => handleField('insuranceExpiry', event.target.value)}
                  />
                </label>
                <label>
                  {t.registrationExpiry}
                  <input
                    required
                    type="date"
                    value={form.registrationExpiry}
                    onChange={(event) => handleField('registrationExpiry', event.target.value)}
                  />
                </label>
                <label>
                  {t.docStatus}
                  <select
                    value={form.status}
                    onChange={(event) => handleField('status', event.target.value)}
                  >
                    <option value="active">{t.vehicleStatusActive}</option>
                    <option value="maintenance">{t.vehicleStatusMaintenance}</option>
                  </select>
                </label>
              </div>

              <div className="supervisor-review-actions">
                <button className="btn-cancel" type="button" onClick={() => setIsFormOpen(false)}>
                  {t.cancelBtn}
                </button>
                <button className="primary-button" type="submit">
                  <Icon name="check" size={16} strokeWidth={2.4} />
                  <span>{editingId ? t.saveChanges : t.addVehicle}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
