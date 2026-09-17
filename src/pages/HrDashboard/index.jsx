import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useMasterData } from '@/context/MasterDataContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { useOperations } from '@/context/OperationsContext';
import { ROUTES } from '@/constants/routes';
import { REQUEST_STATUS, OPERATION_STATUS } from '@/constants/requestStatus';
import { buildEmployeeDocuments } from '@/constants/mockHrDocuments';
import { getMonthlyAttendanceSummary } from '@/constants/mockAttendance';
import { buildFleet } from '@/constants/mockHrFleet';
import PersonLink from '@/components/shared/PersonLink';
import Icon from '@/components/ui/Icon';

export default function HrDashboard() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { companies, regions, cities } = useMasterData();
  const { requests } = useOnboarding();
  const { requests: operations } = useOperations();
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    [lang],
  );

  const data = useMemo(() => {
    const activeEmployees = requests.filter((req) => req.status === REQUEST_STATUS.ACTIVE);
    const pendingHiring = requests.filter((req) => req.status === REQUEST_STATUS.PENDING_HR);
    const opsPending = operations.filter(
      (req) => req.status === OPERATION_STATUS.PENDING_HR && req.category !== 'financial',
    );
    const finPending = operations.filter(
      (req) => req.status === OPERATION_STATUS.PENDING_HR && req.category === 'financial',
    );

    const attendance = activeEmployees.map((employee) =>
      getMonthlyAttendanceSummary(employee.id, lang),
    );
    const presentToday = attendance.filter(
      (summary) => summary.history[summary.history.length - 1]?.status === 'present',
    ).length;
    const avgRate = attendance.length
      ? Math.round(attendance.reduce((sum, summary) => sum + summary.rate, 0) / attendance.length)
      : 0;

    const documents = buildEmployeeDocuments(activeEmployees);
    const expiredDocs = documents.filter((doc) => doc.status === 'expired').length;
    const expiringDocs = documents.filter((doc) => doc.status === 'expiring').length;
    const validDocs = documents.filter((doc) => doc.status === 'valid').length;
    const missingDocs = documents.filter((doc) => doc.status === 'missing').length;

    const fleet = buildFleet(activeEmployees);
    const maintenance = fleet.filter((vehicle) => vehicle.status === 'maintenance').length;
    const fleetOwn = fleet.filter((vehicle) => vehicle.ownership === 'own').length;
    const fleetCompany = fleet.filter((vehicle) => vehicle.ownership === 'company').length;
    const suspended = activeEmployees.filter(
      (employee) => (employee.accountStatus || 'active') === 'suspended',
    ).length;

    return {
      activeEmployees,
      pendingHiring,
      opsPending,
      finPending,
      presentToday,
      absentToday: activeEmployees.length - presentToday,
      avgRate,
      expiredDocs,
      expiringDocs,
      validDocs,
      missingDocs,
      maintenance,
      fleetOwn,
      fleetCompany,
      suspended,
      clients: companies.map((company) => {
        const region = regions.find((item) => item.id === company.regionId);
        const city = cities.find((item) => item.id === company.cityId);
        return {
          id: company.id,
          name: isAr ? company.nameAr : company.nameEn,
          region: region ? (isAr ? region.nameAr : region.nameEn) : '—',
          city: city ? (isAr ? city.nameAr : city.nameEn) : '—',
          warehouses: company.warehouses.length,
          employees: activeEmployees.filter((employee) => employee.companyId === company.id).length,
          status: company.status,
        };
      }),
      totalWarehouses: companies.reduce((sum, company) => sum + company.warehouses.length, 0),
    };
  }, [requests, operations, lang, isAr, companies, regions, cities]);

  const kpis = [
    { key: 'activeEmployees', value: data.activeEmployees.length, icon: 'supervisor', tone: 'default', route: ROUTES.HR_EMPLOYEES },
    { key: 'totalClients', value: data.clients.length, icon: 'building', tone: 'info', route: ROUTES.HR_MASTER_DATA },
    { key: 'warehousesCount', value: data.totalWarehouses, icon: 'operations', tone: 'default', route: ROUTES.HR_MASTER_DATA },
    { key: 'newApplications', value: data.pendingHiring.length, icon: 'badgeCheck', tone: 'warning', route: ROUTES.HR_REQUESTS },
    { key: 'pendingOperations', value: data.opsPending.length, icon: 'operations', tone: 'info', route: ROUTES.HR_OPERATIONS },
    { key: 'financePending', value: data.finPending.length, icon: 'financialAdvance', tone: 'danger', route: ROUTES.HR_FINANCIALS },
  ];

  const pendingActions = [
    ...data.pendingHiring.map((request) => ({
      id: `hire-${request.id}`,
      title: request.fullName,
      kind: t.navRecruitment,
      route: `${ROUTES.HR_REQUESTS}/${request.id}`,
    })),
    ...data.opsPending.map((request) => ({
      id: `op-${request.id}`,
      title: isAr ? request.title : request.titleEn || request.title,
      kind: t.operationsTitle,
      route: ROUTES.HR_OPERATIONS,
    })),
    ...data.finPending.map((request) => ({
      id: `fin-${request.id}`,
      title: isAr ? request.title : request.titleEn || request.title,
      kind: t.financialsTitle,
      route: ROUTES.HR_FINANCIALS,
    })),
  ].slice(0, 6);

  const alerts = [
    data.expiredDocs > 0 && {
      key: 'expiredDocs',
      count: data.expiredDocs,
      icon: 'file',
      tone: 'danger',
      route: ROUTES.HR_DOCUMENTS,
    },
    data.expiringDocs > 0 && {
      key: 'expiringDocs',
      count: data.expiringDocs,
      icon: 'clock',
      tone: 'warning',
      route: ROUTES.HR_DOCUMENTS,
    },
    data.maintenance > 0 && {
      key: 'maintenanceVehicles',
      count: data.maintenance,
      icon: 'maintenance',
      tone: 'warning',
      route: ROUTES.HR_FLEET,
    },
    data.suspended > 0 && {
      key: 'accountSuspended',
      count: data.suspended,
      icon: 'supervisor',
      tone: 'warning',
      route: ROUTES.HR_EMPLOYEES,
    },
  ].filter(Boolean);

  const latestHiring = [...requests]
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 5);

  const latestOperations = [...operations]
    .sort(
      (a, b) =>
        (a.status === OPERATION_STATUS.PENDING_HR ? 0 : 1) -
        (b.status === OPERATION_STATUS.PENDING_HR ? 0 : 1),
    )
    .slice(0, 5);

  const docSummary = [
    { key: 'validDocs', count: data.validDocs, color: '#16a34a' },
    { key: 'expiringDocs', count: data.expiringDocs, color: '#f59e0b' },
    { key: 'expiredDocs', count: data.expiredDocs, color: '#dc2626' },
    { key: 'missingDocuments', count: data.missingDocs, color: '#9ca3af' },
  ];
  const docTotal = docSummary.reduce((sum, item) => sum + item.count, 0);

  const fleetSummary = [
    { key: 'ownVehicles', count: data.fleetOwn, color: '#139a43' },
    { key: 'companyVehicles', count: data.fleetCompany, color: '#0284c7' },
    { key: 'maintenanceVehicles', count: data.maintenance, color: '#f59e0b' },
  ];
  const fleetTotal = fleetSummary.reduce((sum, item) => sum + item.count, 0);

  const statusLabel = (status) => {
    if (status === REQUEST_STATUS.ACTIVE) return t.statusActive;
    if (status === REQUEST_STATUS.CANCELLED) return t.statusCancelled;
    return t.inReview;
  };

  return (
    <div className="admin-dashboard">
      <section className="admin-hero">
        <div>
          <p className="eyebrow">{t.hrPortal}</p>
          <h1>
            {t.greeting}، {user?.name}
          </h1>
          <p>{todayLabel}</p>
        </div>
        <button
          className="secondary-button"
          type="button"
          onClick={() => navigate(ROUTES.HR_REQUESTS)}
          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}
        >
          <Icon name="badgeCheck" size={16} strokeWidth={2} />
          <span>{t.navRecruitment}</span>
        </button>
      </section>

      <section className="kpi-grid">
        {kpis.map((kpi) => (
          <button
            key={kpi.key}
            type="button"
            className={`kpi-card ${kpi.tone}`}
            onClick={() => navigate(kpi.route)}
          >
            <span className="kpi-card__icon">
              <Icon name={kpi.icon} size={22} strokeWidth={1.9} />
            </span>
            <div>
              <div className="kpi-card__value">{kpi.value}</div>
              <div className="kpi-card__label">{t[kpi.key]}</div>
            </div>
          </button>
        ))}
      </section>

      <div className="admin-split">
        <section className="admin-card">
          <div className="section-header" style={{ marginBottom: '12px' }}>
            <h2>{t.pendingActions}</h2>
            <span className="op-history-badge">{pendingActions.length}</span>
          </div>
          {pendingActions.length === 0 ? (
            <div className="admin-empty">{t.noRequests}</div>
          ) : (
            <div className="admin-activity">
              {pendingActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className="admin-activity__row"
                  onClick={() => navigate(action.route)}
                >
                  <div>
                    <div className="admin-activity__name">{action.title}</div>
                    <div className="admin-activity__meta">{action.kind}</div>
                  </div>
                  <span className="admin-badge admin-badge--warning">{t.decide}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="admin-stack">
          <section className="admin-card">
            <div className="section-header" style={{ marginBottom: '16px' }}>
              <h2>{t.attendanceToday}</h2>
              <button className="link-button" type="button" onClick={() => navigate(ROUTES.HR_ATTENDANCE)}>
                {t.viewAll}
              </button>
            </div>
            <div className="ring" style={{ '--p': String(data.avgRate) }}>
              <div className="ring__inner">
                <div style={{ textAlign: 'center' }}>
                  <div className="ring__value">{data.avgRate}%</div>
                  <div className="admin-stat__label">{t.avgAttendanceRate}</div>
                </div>
              </div>
            </div>
            <div className="admin-stats" style={{ margin: '18px 0 0', gridTemplateColumns: '1fr 1fr' }}>
              <div className="admin-stat">
                <span className="admin-stat__icon">
                  <Icon name="check" size={20} strokeWidth={1.9} />
                </span>
                <div>
                  <div className="admin-stat__value">{data.presentToday}</div>
                  <div className="admin-stat__label">{t.presentToday}</div>
                </div>
              </div>
              <div className="admin-stat">
                <span className="admin-stat__icon danger">
                  <Icon name="close" size={20} strokeWidth={1.9} />
                </span>
                <div>
                  <div className="admin-stat__value">{data.absentToday}</div>
                  <div className="admin-stat__label">{t.absentToday}</div>
                </div>
              </div>
            </div>
          </section>

          <section className="admin-card">
            <div className="section-header" style={{ marginBottom: '12px' }}>
              <h2>{t.alerts}</h2>
              <span className="op-history-badge">{alerts.length}</span>
            </div>
            {alerts.length === 0 ? (
              <div className="admin-empty">{t.noNotifications}</div>
            ) : (
              <div>
                {alerts.map((alert) => (
                  <button
                    key={alert.key}
                    type="button"
                    className="alert-item"
                    onClick={() => navigate(alert.route)}
                  >
                    <span className={`alert-item__icon ${alert.tone === 'danger' ? 'danger' : ''}`}>
                      <Icon name={alert.icon} size={18} strokeWidth={1.9} />
                    </span>
                    <span className="alert-item__body">
                      <span className="alert-item__title">{t[alert.key]}</span>
                      <span className="alert-item__meta">{t.viewSection}</span>
                    </span>
                    <span className={`admin-badge ${alert.tone === 'danger' ? 'admin-badge--danger' : 'admin-badge--warning'}`}>
                      {alert.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="admin-split">
        <section className="admin-card admin-summary">
          <div className="section-header" style={{ marginBottom: '8px' }}>
            <h2>{t.documentsSummary}</h2>
            <span className="op-history-badge">{docTotal}</span>
          </div>
          <div className="pipeline">
            {docSummary.map((item) => (
              <span
                key={item.key}
                className="pipeline__seg"
                style={{
                  width: docTotal ? `${(item.count / docTotal) * 100}%` : '0%',
                  background: item.color,
                }}
              />
            ))}
          </div>
          <div className="pipeline-legend">
            {docSummary.map((item) => (
              <span key={item.key}>
                <i style={{ background: item.color }} />
                {t[item.key]} · {item.count}
              </span>
            ))}
          </div>
        </section>

        <section className="admin-card admin-summary">
          <div className="section-header" style={{ marginBottom: '8px' }}>
            <h2>{t.fleetSummary}</h2>
            <span className="op-history-badge">{fleetTotal}</span>
          </div>
          <div className="pipeline">
            {fleetSummary.map((item) => (
              <span
                key={item.key}
                className="pipeline__seg"
                style={{
                  width: fleetTotal ? `${(item.count / fleetTotal) * 100}%` : '0%',
                  background: item.color,
                }}
              />
            ))}
          </div>
          <div className="pipeline-legend">
            {fleetSummary.map((item) => (
              <span key={item.key}>
                <i style={{ background: item.color }} />
                {t[item.key]} · {item.count}
              </span>
            ))}
          </div>
        </section>
      </div>

      <div className="admin-split">
        <section className="admin-card">
        <div className="section-header" style={{ marginBottom: '12px' }}>
          <h2>{t.latestHiring}</h2>
          <button className="link-button" type="button" onClick={() => navigate(ROUTES.HR_REQUESTS)}>
            {t.viewAll}
          </button>
        </div>

        {latestHiring.length === 0 ? (
          <div className="admin-empty">{t.noActivity}</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.fullName}</th>
                  <th>{t.city}</th>
                  <th>{t.requestDate}</th>
                  <th>{t.docStatus}</th>
                </tr>
              </thead>
              <tbody>
                {latestHiring.map((request) => (
                  <tr
                    key={request.id}
                    onClick={() => navigate(`${ROUTES.HR_REQUESTS}/${request.id}`)}
                  >
                    <td>
                      <PersonLink to={`${ROUTES.HR_REQUESTS}/${request.id}`}>
                        {request.fullName}
                      </PersonLink>
                    </td>
                    <td>{request.city}</td>
                    <td dir="ltr">{request.createdAt}</td>
                    <td>
                      <span className="admin-badge admin-badge--info">{statusLabel(request.status)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

        <section className="admin-card">
        <div className="section-header" style={{ marginBottom: '12px' }}>
          <h2>{t.latestOperations}</h2>
          <button className="link-button" type="button" onClick={() => navigate(ROUTES.HR_OPERATIONS)}>
            {t.viewAll}
          </button>
        </div>
        {latestOperations.length === 0 ? (
          <div className="admin-empty">{t.noOperations}</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.requestType}</th>
                  <th>{t.requester}</th>
                  <th>{t.requestDate}</th>
                  <th>{t.docStatus}</th>
                </tr>
              </thead>
              <tbody>
                {latestOperations.map((request) => (
                  <tr key={request.id} onClick={() => navigate(ROUTES.HR_OPERATIONS)}>
                    <td>{isAr ? request.title : request.titleEn || request.title}</td>
                    <td>
                      {request.requesterRole === 'supervisor'
                        ? t.requesterSupervisor
                        : t.requesterCourier}
                    </td>
                    <td>{request.date}</td>
                    <td>
                      <span
                        className={`admin-badge ${
                          request.status === OPERATION_STATUS.APPROVED
                            ? 'admin-badge--success'
                            : request.status === OPERATION_STATUS.REJECTED
                              ? 'admin-badge--danger'
                              : 'admin-badge--warning'
                        }`}
                      >
                        {request.status === OPERATION_STATUS.APPROVED
                          ? t.approvedStatus
                          : request.status === OPERATION_STATUS.REJECTED
                            ? t.rejectedStatus
                            : t.inReview}
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
    </div>
  );
}
