import { useMemo, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { REQUEST_STATUS } from '@/constants/requestStatus';
import { getMonthlyAttendanceSummary } from '@/constants/mockAttendance';
import { ROUTES } from '@/constants/routes';
import PersonLink from '@/components/shared/PersonLink';
import Icon from '@/components/ui/Icon';

export default function HrAttendance() {
  const { t, lang } = useLanguage();
  const { requests } = useOnboarding();

  const [query, setQuery] = useState('');
  const [todayFilter, setTodayFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const rows = useMemo(() => {
    return requests
      .filter((req) => req.status === REQUEST_STATUS.ACTIVE)
      .map((employee) => {
        const month = getMonthlyAttendanceSummary(employee.id, lang);
        const today = month.history[month.history.length - 1];
        return { employee, month, todayStatus: today?.status || 'absent' };
      });
  }, [requests, lang]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery = !q || row.employee.fullName.toLowerCase().includes(q);
      const matchesToday = todayFilter === 'all' || row.todayStatus === todayFilter;
      return matchesQuery && matchesToday;
    });
  }, [rows, query, todayFilter]);

  const presentToday = rows.filter((row) => row.todayStatus === 'present').length;
  const absentToday = rows.filter((row) => row.todayStatus === 'absent').length;
  const avgRate = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.month.rate, 0) / rows.length)
    : 0;

  const stats = [
    { key: 'totalEmployees', value: rows.length, icon: 'supervisor', tone: 'default' },
    { key: 'presentToday', value: presentToday, icon: 'check', tone: 'default' },
    { key: 'absentToday', value: absentToday, icon: 'close', tone: 'danger' },
    { key: 'avgAttendanceRate', value: `${avgRate}%`, icon: 'attendance', tone: 'info' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{t.attendance}</h1>
          <p>{t.monthlyAttendance}</p>
        </div>
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
              value={todayFilter}
              onChange={(event) => setTodayFilter(event.target.value)}
            >
              <option value="all">{t.allStatuses}</option>
              <option value="present">{t.presentToday}</option>
              <option value="absent">{t.absentToday}</option>
            </select>
          </div>
          <span className="op-history-badge">{filtered.length}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty">
            <Icon name="attendance" size={32} />
            <p>{t.noEmployees}</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.courierDetails}</th>
                  <th>{t.today}</th>
                  <th>{t.presentDays}</th>
                  <th>{t.absentDays}</th>
                  <th>{t.attendanceRate}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(({ employee, month, todayStatus }) => (
                  <tr
                    key={employee.id}
                    onClick={() => setSelectedEmployee({ employee, month, todayStatus })}
                  >
                    <td>
                      <PersonLink to={`${ROUTES.HR_EMPLOYEES}/${employee.id}`}>
                        {employee.fullName}
                      </PersonLink>
                    </td>
                    <td>
                      <span
                        className={`admin-badge ${
                          todayStatus === 'present' ? 'admin-badge--success' : 'admin-badge--danger'
                        }`}
                      >
                        {todayStatus === 'present' ? t.present : t.absent}
                      </span>
                    </td>
                    <td>{month.present}</td>
                    <td>{month.absent}</td>
                    <td>
                      <div className="admin-rate">
                        <span className="admin-rate__bar">
                          <span className="admin-rate__fill" style={{ width: `${month.rate}%` }} />
                        </span>
                        <span className="admin-rate__value">{month.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedEmployee && (
        <div className="op-modal-backdrop" onClick={() => setSelectedEmployee(null)}>
          <div
            className="op-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-attendance-title"
          >
            <div className="op-modal-header">
              <div className="op-modal-title-group">
                <div className="op-modal-icon-badge">
                  <Icon name="attendance" size={18} />
                </div>
                <div>
                  <h3 id="employee-attendance-title">{selectedEmployee.employee.fullName}</h3>
                  <p className="op-modal-subtitle">{t.monthlyAttendance}</p>
                </div>
              </div>
              <button
                type="button"
                className="op-modal-close"
                onClick={() => setSelectedEmployee(null)}
                aria-label={t.closeDetails}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-stats" style={{ marginBottom: '16px' }}>
                <div className="admin-stat">
                  <span className="admin-stat__icon">
                    <Icon name="check" size={22} strokeWidth={1.9} />
                  </span>
                  <div>
                    <div className="admin-stat__value">{selectedEmployee.month.present}</div>
                    <div className="admin-stat__label">{t.presentDays}</div>
                  </div>
                </div>
                <div className="admin-stat">
                  <span className="admin-stat__icon danger">
                    <Icon name="close" size={22} strokeWidth={1.9} />
                  </span>
                  <div>
                    <div className="admin-stat__value">{selectedEmployee.month.absent}</div>
                    <div className="admin-stat__label">{t.absentDays}</div>
                  </div>
                </div>
                <div className="admin-stat">
                  <span className="admin-stat__icon info">
                    <Icon name="attendance" size={22} strokeWidth={1.9} />
                  </span>
                  <div>
                    <div className="admin-stat__value">{selectedEmployee.month.rate}%</div>
                    <div className="admin-stat__label">{t.attendanceRate}</div>
                  </div>
                </div>
              </div>

              <div className="admin-month-grid">
                {selectedEmployee.month.history.map((day) => (
                  <div className="admin-month-cell" key={day.date}>
                    <span className="admin-month-cell__label">{day.weekday}</span>
                    <span className={`attendance-day-number ${day.status}`}>{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
