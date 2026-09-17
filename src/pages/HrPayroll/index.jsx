import { useMemo, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { REQUEST_STATUS } from '@/constants/requestStatus';
import { buildPayrollRun, PAYROLL_MODEL, PAYROLL_STATUS } from '@/constants/mockHrFinance';
import Icon from '@/components/ui/Icon';

const MODEL_LABEL_KEY = {
  [PAYROLL_MODEL.FIXED]: 'modelFixed',
  [PAYROLL_MODEL.TARGET]: 'modelTarget',
  [PAYROLL_MODEL.SLIDING]: 'modelSliding',
};

function currentPeriod() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export default function HrPayroll() {
  const { t } = useLanguage();
  const { requests } = useOnboarding();
  const [period, setPeriod] = useState(currentPeriod);

  const employees = useMemo(
    () => requests.filter((request) => request.status === REQUEST_STATUS.ACTIVE),
    [requests],
  );

  const baseRun = useMemo(() => buildPayrollRun(employees, period), [employees, period]);
  const [edits, setEdits] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [grossInput, setGrossInput] = useState('');
  const [deductionInput, setDeductionInput] = useState('');

  const run = useMemo(
    () =>
      baseRun.map((row) => {
        const edit = edits[row.id];
        if (!edit) return row;
        return { ...row, gross: edit.gross, deductions: edit.deductions, net: edit.gross - edit.deductions };
      }),
    [baseRun, edits],
  );

  const totals = run.reduce(
    (acc, row) => ({
      gross: acc.gross + row.gross,
      deductions: acc.deductions + row.deductions,
      net: acc.net + row.net,
    }),
    { gross: 0, deductions: 0, net: 0 },
  );

  const stats = [
    { key: 'totalEmployees', value: employees.length, icon: 'supervisor', tone: 'default' },
    { key: 'grossAmount', value: totals.gross.toLocaleString(), icon: 'financialAdvance', tone: 'default' },
    { key: 'deductions', value: totals.deductions.toLocaleString(), icon: 'close', tone: 'danger' },
    { key: 'netAmount', value: totals.net.toLocaleString(), icon: 'check', tone: 'info' },
  ];

  const statusLabel = (status) =>
    status === PAYROLL_STATUS.PAID ? t.payrollPaid : t.payrollPending;

  const startEdit = (row) => {
    setEditingId(row.id);
    setGrossInput(String(row.gross));
    setDeductionInput(String(row.deductions));
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (row) => {
    const gross = Number(grossInput) || 0;
    const deductions = Number(deductionInput) || 0;
    setEdits((current) => ({ ...current, [row.id]: { gross, deductions } }));
    setEditingId(null);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{t.payrollTitle}</h1>
          <p>{t.payrollHint}</p>
        </div>
        <label className="admin-toolbar__filters" htmlFor="payroll-period">
          <span className="admin-stat__label">{t.payrollPeriod}</span>
          <input
            id="payroll-period"
            className="admin-select"
            type="month"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          />
        </label>
      </div>

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
        {run.length === 0 ? (
          <div className="admin-empty">
            <Icon name="package" size={32} />
            <p>{t.noEmployees}</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.fullName}</th>
                  <th>{t.salaryModel}</th>
                  <th>{t.shipmentPpd}</th>
                  <th>{t.shipmentCod}</th>
                  <th>{t.shipmentPickup}</th>
                  <th>{t.grossAmount}</th>
                  <th>{t.deductions}</th>
                  <th>{t.netAmount}</th>
                  <th>{t.docStatus}</th>
                  <th>{t.decision}</th>
                </tr>
              </thead>
              <tbody>
                {run.map((row) => {
                  const isEditing = editingId === row.id;
                  const liveGross = isEditing ? Number(grossInput) || 0 : row.gross;
                  const liveDeductions = isEditing ? Number(deductionInput) || 0 : row.deductions;
                  return (
                    <tr key={row.id}>
                      <td>{row.employeeName}</td>
                      <td>{t[MODEL_LABEL_KEY[row.model]] || row.model}</td>
                      <td>{row.ppd}</td>
                      <td>{row.cod}</td>
                      <td>{row.pickup}</td>
                      <td dir="ltr">
                        {isEditing ? (
                          <input
                            className="admin-input admin-input--cell"
                            type="number"
                            min="0"
                            dir="ltr"
                            value={grossInput}
                            onChange={(event) => setGrossInput(event.target.value)}
                          />
                        ) : (
                          row.gross.toLocaleString()
                        )}
                      </td>
                      <td dir="ltr">
                        {isEditing ? (
                          <input
                            className="admin-input admin-input--cell"
                            type="number"
                            min="0"
                            dir="ltr"
                            value={deductionInput}
                            onChange={(event) => setDeductionInput(event.target.value)}
                          />
                        ) : (
                          row.deductions.toLocaleString()
                        )}
                      </td>
                      <td dir="ltr">{(liveGross - liveDeductions).toLocaleString()}</td>
                      <td>
                        <span
                          className={`admin-badge ${
                            row.status === PAYROLL_STATUS.PAID
                              ? 'admin-badge--success'
                              : 'admin-badge--warning'
                          }`}
                        >
                          {statusLabel(row.status)}
                        </span>
                      </td>
                      <td>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="secondary-button"
                              type="button"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={cancelEdit}
                            >
                              {t.cancelBtn}
                            </button>
                            <button
                              className="primary-button"
                              type="button"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => saveEdit(row)}
                            >
                              {t.saveChanges}
                            </button>
                          </div>
                        ) : (
                          <button
                            className="secondary-button"
                            type="button"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => startEdit(row)}
                          >
                            {t.editData}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
