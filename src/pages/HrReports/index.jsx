import { useMemo } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useMasterData } from '@/context/MasterDataContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { useOperations } from '@/context/OperationsContext';
import { REQUEST_STATUS } from '@/constants/requestStatus';
import { buildEmployeeDocuments } from '@/constants/mockHrDocuments';
import { getMonthlyAttendanceSummary } from '@/constants/mockAttendance';
import { resolveAssignment } from '@/utils/assignment';
import { downloadCsv } from '@/utils/csv';
import Icon from '@/components/ui/Icon';

const DOC_TYPE_LABEL_KEY = {
  identity: 'identityDoc',
  passport: 'passportDoc',
  license: 'license',
  vehicle: 'vehicleDoc',
  photo: 'personalPhoto',
};

export default function HrReports() {
  const { t, lang } = useLanguage();
  const { companies } = useMasterData();
  const { requests } = useOnboarding();
  const { requests: operations } = useOperations();
  const isAr = lang === 'ar';

  const employees = useMemo(
    () => requests.filter((request) => request.status === REQUEST_STATUS.ACTIVE),
    [requests],
  );

  const reports = useMemo(() => {
    const employeeRows = employees.map((employee) => {
      const assignment = resolveAssignment(employee, isAr, companies);
      return {
        id: employee.id,
        name: employee.fullName,
        phone: employee.phone,
        city: employee.city,
        company: assignment ? assignment.company : '',
        warehouse: assignment ? assignment.warehouse : '',
        supervisor: employee.supervisorName || '',
      };
    });

    const documentRows = buildEmployeeDocuments(employees).map((doc) => ({
      employee: doc.employeeName,
      type: t[DOC_TYPE_LABEL_KEY[doc.type]] || doc.type,
      number: doc.number,
      expiry: doc.expiryDate,
      status: doc.status,
    }));

    const attendanceRows = employees.map((employee) => {
      const month = getMonthlyAttendanceSummary(employee.id, lang);
      return {
        employee: employee.fullName,
        present: month.present,
        absent: month.absent,
        rate: `${month.rate}%`,
      };
    });

    const operationRows = operations.map((request) => ({
      id: request.id,
      title: isAr ? request.title : request.titleEn || request.title,
      category: request.category,
      status: request.status,
      date: request.date,
    }));

    return [
      { key: 'reportEmployees', icon: 'supervisor', filename: 'employees.csv', rows: employeeRows },
      { key: 'reportDocuments', icon: 'file', filename: 'documents.csv', rows: documentRows },
      { key: 'reportAttendance', icon: 'attendance', filename: 'attendance.csv', rows: attendanceRows },
      { key: 'reportOperations', icon: 'operations', filename: 'operations.csv', rows: operationRows },
    ];
  }, [employees, operations, companies, isAr, lang, t]);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{t.reportsTitle}</h1>
          <p>{t.reportsHint}</p>
        </div>
      </div>

      <div className="admin-stats">
        {reports.map((report) => (
          <div className="admin-stat" key={report.key}>
            <span className="admin-stat__icon">
              <Icon name={report.icon} size={22} strokeWidth={1.9} />
            </span>
            <div style={{ flex: 1 }}>
              <div className="admin-stat__value">{report.rows.length}</div>
              <div className="admin-stat__label">{t[report.key]}</div>
            </div>
            <button
              className="secondary-button"
              type="button"
              style={{ padding: '6px 12px', fontSize: '12px' }}
              onClick={() => downloadCsv(report.filename, report.rows)}
            >
              <Icon name="file" size={14} strokeWidth={2} />
              <span>{t.exportCsv}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
