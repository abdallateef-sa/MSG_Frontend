import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useMasterData } from '@/context/MasterDataContext';
import { ROUTES } from '@/constants/routes';
import PersonLink from '@/components/shared/PersonLink';
import Icon from '@/components/ui/Icon';

export default function HrMasterData() {
  const { t, lang } = useLanguage();
  const {
    companies,
    regions,
    cities,
    supervisors,
    addCompany,
    updateCompany,
    toggleCompany,
    addWarehouse,
    updateWarehouse,
    toggleWarehouse,
    addRegion,
    addCity,
  } = useMasterData();
  const isAr = lang === 'ar';

  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'companies');
  const [form, setForm] = useState(null);
  const [feedback, setFeedback] = useState('');

  const regionName = (id) => {
    const region = regions.find((item) => item.id === id);
    return region ? (isAr ? region.nameAr : region.nameEn) : '—';
  };
  const cityName = (id) => {
    const city = cities.find((item) => item.id === id);
    return city ? (isAr ? city.nameAr : city.nameEn) : '—';
  };
  const supervisorName = (id) => {
    const supervisor = supervisors.find((item) => item.id === id);
    return supervisor ? (isAr ? supervisor.nameAr : supervisor.nameEn) : '—';
  };

  const warehouses = useMemo(
    () =>
      companies.flatMap((company) =>
        company.warehouses.map((warehouse) => ({
          ...warehouse,
          companyId: company.id,
          companyName: isAr ? company.nameAr : company.nameEn,
        })),
      ),
    [companies, isAr],
  );

  const statusLabel = (status) => (status === 'active' ? t.accountActive : t.inactiveStatus);
  const statusTone = (status) =>
    status === 'active' ? 'admin-badge--success' : 'admin-badge--muted';

  const openCompany = (company) => {
    setFeedback('');
    setForm({
      kind: 'company',
      id: company?.id || null,
      nameAr: company?.nameAr || '',
      nameEn: company?.nameEn || '',
      phone: company?.phone || '',
      email: company?.email || '',
      addressAr: company?.addressAr || '',
      addressEn: company?.addressEn || '',
      regionId: company?.regionId || regions[0]?.id || '',
      cityId: company?.cityId || cities[0]?.id || '',
    });
  };

  const openWarehouse = (warehouse, companyId) => {
    setFeedback('');
    setForm({
      kind: 'warehouse',
      id: warehouse?.id || null,
      companyId: warehouse?.companyId || companyId || companies[0]?.id || '',
      nameAr: warehouse?.nameAr || '',
      nameEn: warehouse?.nameEn || '',
      cityId: warehouse?.cityId || cities[0]?.id || '',
      supervisorId: warehouse?.supervisorId || supervisors[0]?.id || '',
    });
  };

  const openRegion = () => setForm({ kind: 'region', nameAr: '', nameEn: '' });
  const openCity = () => setForm({ kind: 'city', regionId: regions[0]?.id || '', nameAr: '', nameEn: '' });

  const handleField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (form.kind === 'company') {
      const payload = {
        nameAr: form.nameAr,
        nameEn: form.nameEn,
        phone: form.phone,
        email: form.email,
        addressAr: form.addressAr,
        addressEn: form.addressEn,
        regionId: form.regionId,
        cityId: form.cityId,
      };
      if (form.id) updateCompany(form.id, payload);
      else addCompany(payload);
      setFeedback(t.companySaved);
    } else if (form.kind === 'warehouse') {
      const payload = {
        nameAr: form.nameAr,
        nameEn: form.nameEn,
        cityId: form.cityId,
        supervisorId: form.supervisorId,
      };
      if (form.id) updateWarehouse(form.companyId, form.id, payload);
      else addWarehouse(form.companyId, payload);
      setFeedback(t.warehouseSaved);
    } else if (form.kind === 'region') {
      addRegion({ nameAr: form.nameAr, nameEn: form.nameEn });
    } else if (form.kind === 'city') {
      addCity({ regionId: form.regionId, nameAr: form.nameAr, nameEn: form.nameEn });
    }
    setForm(null);
  };

  const formTitle = () => {
    if (form.kind === 'company') return form.id ? t.editCompany : t.addCompany;
    if (form.kind === 'warehouse') return form.id ? t.editWarehouse : t.addWarehouse;
    return form.kind === 'region' ? t.addRegion : t.addCity;
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{t.masterDataTitle}</h1>
          <p>{t.masterDataHint}</p>
        </div>
      </div>

      {feedback && (
        <div className="operations-success-banner" role="status" style={{ marginBottom: '16px' }}>
          <div className="success-icon-badge">
            <Icon name="check" size={18} strokeWidth={2.2} />
          </div>
          <span>{feedback}</span>
        </div>
      )}

      <div className="op-status-tabs supervisor-tabs" role="tablist">
        {[
          ['companies', t.tabCompanies],
          ['warehouses', t.tabWarehouses],
          ['regions', t.tabRegions],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={`op-tab-btn ${tab === key ? 'active' : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'companies' && (
        <div className="admin-card">
          <div className="admin-toolbar">
            <h2>{t.tabCompanies}</h2>
            <div className="admin-toolbar__filters">
              <span className="op-history-badge">{companies.length}</span>
              <button className="primary-button" type="button" onClick={() => openCompany(null)}>
                <Icon name="plus" size={16} strokeWidth={2.4} />
                <span>{t.addCompany}</span>
              </button>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.companyCode}</th>
                  <th>{t.mdCompany}</th>
                  <th>{t.phone}</th>
                  <th>{t.email}</th>
                  <th>{t.mdRegion}</th>
                  <th>{t.mdCity}</th>
                  <th>{t.warehousesCount}</th>
                  <th>{t.docStatus}</th>
                  <th>{t.decision}</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td dir="ltr">{company.code}</td>
                    <td>{isAr ? company.nameAr : company.nameEn}</td>
                    <td dir="ltr">{company.phone || '—'}</td>
                    <td dir="ltr">{company.email || '—'}</td>
                    <td>{regionName(company.regionId)}</td>
                    <td>{cityName(company.cityId)}</td>
                    <td>{company.warehouses.length}</td>
                    <td>
                      <span className={`admin-badge ${statusTone(company.status)}`}>
                        {statusLabel(company.status)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="secondary-button"
                          type="button"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => openCompany(company)}
                        >
                          {t.editData}
                        </button>
                        <button
                          className="secondary-button"
                          type="button"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => toggleCompany(company.id)}
                        >
                          {company.status === 'active' ? t.suspendAccount : t.activateAccount}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'warehouses' && (
        <div className="admin-card">
          <div className="admin-toolbar">
            <h2>{t.tabWarehouses}</h2>
            <div className="admin-toolbar__filters">
              <span className="op-history-badge">{warehouses.length}</span>
              <button className="primary-button" type="button" onClick={() => openWarehouse(null)}>
                <Icon name="plus" size={16} strokeWidth={2.4} />
                <span>{t.addWarehouse}</span>
              </button>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.warehouseCode}</th>
                  <th>{t.mdWarehouse}</th>
                  <th>{t.mdCompany}</th>
                  <th>{t.mdCity}</th>
                  <th>{t.supervisorResponsible}</th>
                  <th>{t.docStatus}</th>
                  <th>{t.decision}</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map((warehouse) => (
                  <tr key={warehouse.id}>
                    <td dir="ltr">{warehouse.code}</td>
                    <td>{isAr ? warehouse.nameAr : warehouse.nameEn}</td>
                    <td>{warehouse.companyName}</td>
                    <td>{cityName(warehouse.cityId)}</td>
                    <td>
                      <PersonLink
                        to={
                          warehouse.supervisorId
                            ? `${ROUTES.HR_SUPERVISOR_DETAIL.replace(':id', warehouse.supervisorId)}`
                            : null
                        }
                      >
                        {supervisorName(warehouse.supervisorId)}
                      </PersonLink>
                    </td>
                    <td>
                      <span className={`admin-badge ${statusTone(warehouse.status)}`}>
                        {statusLabel(warehouse.status)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="secondary-button"
                          type="button"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => openWarehouse(warehouse, warehouse.companyId)}
                        >
                          {t.editData}
                        </button>
                        <button
                          className="secondary-button"
                          type="button"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => toggleWarehouse(warehouse.companyId, warehouse.id)}
                        >
                          {warehouse.status === 'active' ? t.suspendAccount : t.activateAccount}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'regions' && (
        <div className="admin-columns">
          <div className="admin-card">
            <div className="admin-toolbar">
              <h2>{t.mdRegion}</h2>
              <button className="secondary-button" type="button" onClick={openRegion}>
                <Icon name="plus" size={15} strokeWidth={2.4} />
                <span>{t.addRegion}</span>
              </button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t.mdRegion}</th>
                    <th>{t.mdCity}</th>
                  </tr>
                </thead>
                <tbody>
                  {regions.map((region) => (
                    <tr key={region.id}>
                      <td>{isAr ? region.nameAr : region.nameEn}</td>
                      <td>
                        {cities.filter((city) => city.regionId === region.id).length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-toolbar">
              <h2>{t.mdCity}</h2>
              <button className="secondary-button" type="button" onClick={openCity}>
                <Icon name="plus" size={15} strokeWidth={2.4} />
                <span>{t.addCity}</span>
              </button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t.mdCity}</th>
                    <th>{t.mdRegion}</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city) => (
                    <tr key={city.id}>
                      <td>{isAr ? city.nameAr : city.nameEn}</td>
                      <td>{regionName(city.regionId)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {form && (
        <div className="op-modal-backdrop" onClick={() => setForm(null)}>
          <div
            className="op-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="master-data-form-title"
          >
            <div className="op-modal-header">
              <div className="op-modal-title-group">
                <div className="op-modal-icon-badge">
                  <Icon name="building" size={18} />
                </div>
                <div>
                  <h3 id="master-data-form-title">{formTitle()}</h3>
                  <p className="op-modal-subtitle">{t.masterDataHint}</p>
                </div>
              </div>
              <button
                type="button"
                className="op-modal-close"
                onClick={() => setForm(null)}
                aria-label={t.cancelBtn}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form className="admin-modal-body form-stack" onSubmit={handleSubmit}>
              {form.kind === 'warehouse' && (
                <div className="form-grid">
                  <label>
                    {t.mdCompany}
                    <select
                      required
                      value={form.companyId}
                      onChange={(event) => handleField('companyId', event.target.value)}
                    >
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {isAr ? company.nameAr : company.nameEn}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              {form.kind === 'city' && (
                <div className="form-grid">
                  <label>
                    {t.mdRegion}
                    <select
                      required
                      value={form.regionId}
                      onChange={(event) => handleField('regionId', event.target.value)}
                    >
                      <option value="" disabled>
                        {t.chooseRegion}
                      </option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {isAr ? region.nameAr : region.nameEn}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              <div className="form-grid">
                <label>
                  {t.nameArLabel}
                  <input
                    required
                    value={form.nameAr}
                    onChange={(event) => handleField('nameAr', event.target.value)}
                  />
                </label>
                <label>
                  {t.nameEnLabel}
                  <input
                    required
                    value={form.nameEn}
                    onChange={(event) => handleField('nameEn', event.target.value)}
                  />
                </label>

                {form.kind === 'company' && (
                  <>
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
                      {t.addressAr}
                      <input
                        value={form.addressAr}
                        onChange={(event) => handleField('addressAr', event.target.value)}
                      />
                    </label>
                    <label>
                      {t.addressEn}
                      <input
                        dir="ltr"
                        value={form.addressEn}
                        onChange={(event) => handleField('addressEn', event.target.value)}
                      />
                    </label>
                    <label>
                      {t.mdRegion}
                      <select
                        required
                        value={form.regionId}
                        onChange={(event) => handleField('regionId', event.target.value)}
                      >
                        <option value="" disabled>
                          {t.chooseRegion}
                        </option>
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {isAr ? region.nameAr : region.nameEn}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {t.mdCity}
                      <select
                        required
                        value={form.cityId}
                        onChange={(event) => handleField('cityId', event.target.value)}
                      >
                        {cities
                          .filter((city) => !form.regionId || city.regionId === form.regionId)
                          .map((city) => (
                            <option key={city.id} value={city.id}>
                              {isAr ? city.nameAr : city.nameEn}
                            </option>
                          ))}
                      </select>
                    </label>
                  </>
                )}

                {form.kind === 'warehouse' && (
                  <>
                    <label>
                      {t.mdCity}
                      <select
                        required
                        value={form.cityId}
                        onChange={(event) => handleField('cityId', event.target.value)}
                      >
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {isAr ? city.nameAr : city.nameEn}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {t.supervisorResponsible}
                      <select
                        required
                        value={form.supervisorId}
                        onChange={(event) => handleField('supervisorId', event.target.value)}
                      >
                        {supervisors.map((supervisor) => (
                          <option key={supervisor.id} value={supervisor.id}>
                            {isAr ? supervisor.nameAr : supervisor.nameEn}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
                )}
              </div>

              <div className="supervisor-review-actions">
                <button className="btn-cancel" type="button" onClick={() => setForm(null)}>
                  {t.cancelBtn}
                </button>
                <button className="primary-button" type="submit">
                  <Icon name="check" size={16} strokeWidth={2.4} />
                  <span>{t.saveChanges}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
