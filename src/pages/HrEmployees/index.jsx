import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useMasterData } from '@/context/MasterDataContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS } from '@/constants/requestStatus';
import { resolveAssignment } from '@/utils/assignment';
import PersonLink from '@/components/shared/PersonLink';
import Icon from '@/components/ui/Icon';

export default function HrEmployees() {
  const { t, lang } = useLanguage();
  const { companies } = useMasterData();
  const { requests } = useOnboarding();
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const employees = useMemo(
    () => requests.filter((req) => req.status === REQUEST_STATUS.ACTIVE && !req.isSupervisor),
    [requests],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((req) => {
      const accountStatus = req.accountStatus || 'active';
      const matchesStatus = statusFilter === 'all' || accountStatus === statusFilter;
      const matchesQuery =
        !q ||
        (req.fullName || '').toLowerCase().includes(q) ||
        (req.nationalId || '').toLowerCase().includes(q) ||
        (req.phone || '').toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [employees, query, statusFilter]);

  const accountLabel = (status) => (status === 'suspended' ? t.accountSuspended : t.accountActive);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{t.employeesTitle}</h1>
          <p>{t.employeesHint}</p>
        </div>
      </div>

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
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">{t.allStatuses}</option>
              <option value="active">{t.accountActive}</option>
              <option value="suspended">{t.accountSuspended}</option>
            </select>
          </div>
          <span className="op-history-badge">{filtered.length}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty">
            <Icon name="supervisor" size={32} />
            <p>{t.noEmployees}</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.fullName}</th>
                  <th>{t.id}</th>
                  <th>{t.phone}</th>
                  <th>{t.city}</th>
                  <th>{t.assignedCompany}</th>
                  <th>{t.directSupervisor}</th>
                  <th>{t.accountStatusLabel}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((employee) => {
                  const assignment = resolveAssignment(employee, isAr, companies);
                  const accountStatus = employee.accountStatus || 'active';
                  return (
                    <tr
                      key={employee.id}
                      onClick={() => navigate(`${ROUTES.HR_EMPLOYEES}/${employee.id}`)}
                    >
                      <td>
                        <PersonLink to={`${ROUTES.HR_EMPLOYEES}/${employee.id}`}>
                          {employee.fullName}
                        </PersonLink>
                      </td>
                      <td dir="ltr">{employee.nationalId}</td>
                      <td dir="ltr">{employee.phone}</td>
                      <td>{employee.city}</td>
                      <td>{assignment ? assignment.company : t.notAssigned}</td>
                      <td>{employee.supervisorName || t.notAssigned}</td>
                      <td>
                        <span
                          className={`admin-badge ${
                            accountStatus === 'suspended' ? 'admin-badge--danger' : 'admin-badge--success'
                          }`}
                        >
                          {accountLabel(accountStatus)}
                        </span>
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
