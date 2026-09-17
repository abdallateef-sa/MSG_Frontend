import { useMemo, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { REQUEST_STATUS } from '@/constants/requestStatus';
import { buildEmployeeDocuments } from '@/constants/mockHrDocuments';
import { ROUTES } from '@/constants/routes';
import PersonLink from '@/components/shared/PersonLink';
import Icon from '@/components/ui/Icon';

const STATUS_ORDER = { expired: 0, expiring: 1, missing: 2, valid: 3 };

const STATUS_TONE = {
  valid: 'admin-badge--success',
  expiring: 'admin-badge--warning',
  expired: 'admin-badge--danger',
  missing: 'admin-badge--muted',
};

const TYPE_LABEL_KEY = {
  identity: 'identityDoc',
  passport: 'passportDoc',
  license: 'license',
  vehicle: 'vehicleDoc',
  photo: 'personalPhoto',
};

export default function HrDocuments() {
  const { t } = useLanguage();
  const { requests } = useOnboarding();

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const employees = useMemo(
    () => requests.filter((req) => req.status === REQUEST_STATUS.ACTIVE),
    [requests],
  );

  const documents = useMemo(() => buildEmployeeDocuments(employees), [employees]);

  const stats = useMemo(
    () => ({
      valid: documents.filter((doc) => doc.status === 'valid').length,
      expiring: documents.filter((doc) => doc.status === 'expiring').length,
      expired: documents.filter((doc) => doc.status === 'expired').length,
      missing: documents.filter((doc) => doc.status === 'missing').length,
    }),
    [documents],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents
      .filter((doc) => {
        const matchesQuery = !q || doc.employeeName.toLowerCase().includes(q);
        const matchesType = typeFilter === 'all' || doc.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
        return matchesQuery && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
        if (byStatus !== 0) return byStatus;
        return (a.expiryDate || '9999').localeCompare(b.expiryDate || '9999');
      });
  }, [documents, query, typeFilter, statusFilter]);

  const statusLabel = (status) => {
    if (status === 'expired') return t.docExpired;
    if (status === 'expiring') return t.docExpiring;
    if (status === 'missing') return t.docMissing;
    return t.docValid;
  };

  const statCards = [
    { key: 'validDocs', value: stats.valid, tone: 'default', icon: 'check' },
    { key: 'expiringDocs', value: stats.expiring, tone: 'warning', icon: 'clock' },
    { key: 'expiredDocs', value: stats.expired, tone: 'danger', icon: 'close' },
    { key: 'missingDocuments', value: stats.missing, tone: 'info', icon: 'file' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{t.documentsTitle}</h1>
          <p>{t.documentsHint}</p>
        </div>
      </div>

      <section className="admin-stats">
        {statCards.map((stat) => (
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
              placeholder={t.searchDocuments}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              className="admin-select"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="all">{t.allTypes}</option>
              {Object.entries(TYPE_LABEL_KEY).map(([value, labelKey]) => (
                <option key={value} value={value}>
                  {t[labelKey]}
                </option>
              ))}
            </select>
            <select
              className="admin-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">{t.allStatuses}</option>
              <option value="valid">{t.docValid}</option>
              <option value="expiring">{t.docExpiring}</option>
              <option value="expired">{t.docExpired}</option>
              <option value="missing">{t.docMissing}</option>
            </select>
          </div>
          <span className="op-history-badge">{filtered.length}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty">
            <Icon name="file" size={32} />
            <p>{t.noRequestsFound}</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.fullName}</th>
                  <th>{t.docType}</th>
                  <th>{t.docNumber}</th>
                  <th>{t.docExpiry}</th>
                  <th>{t.docStatus}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc.id} onClick={() => setSelectedDoc(doc)}>
                    <td>
                      <PersonLink to={`${ROUTES.HR_EMPLOYEES}/${doc.employeeId}`}>
                        {doc.employeeName}
                      </PersonLink>
                    </td>
                    <td>{t[TYPE_LABEL_KEY[doc.type]] || doc.type}</td>
                    <td dir="ltr">{doc.number || '—'}</td>
                    <td dir="ltr">{doc.expiryDate || '—'}</td>
                    <td>
                      <span className={`admin-badge ${STATUS_TONE[doc.status]}`}>
                        {statusLabel(doc.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedDoc && (
        <div className="op-modal-backdrop" onClick={() => setSelectedDoc(null)}>
          <div
            className="op-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="doc-preview-title"
          >
            <div className="op-modal-header">
              <div className="op-modal-title-group">
                <div className="op-modal-icon-badge">
                  <Icon name="file" size={18} />
                </div>
                <div>
                  <h3 id="doc-preview-title">{t.preview}</h3>
                  <p className="op-modal-subtitle">
                    {t[TYPE_LABEL_KEY[selectedDoc.type]] || selectedDoc.type} ·{' '}
                    {selectedDoc.employeeName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="op-modal-close"
                onClick={() => setSelectedDoc(null)}
                aria-label={t.closeDetails}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-info-grid">
                <div className="op-detail-card">
                  <span className="op-detail-label">{t.fullName}</span>
                  <strong>{selectedDoc.employeeName}</strong>
                </div>
                <div className="op-detail-card">
                  <span className="op-detail-label">{t.docNumber}</span>
                  <strong dir="ltr">{selectedDoc.number || '—'}</strong>
                </div>
                <div className="op-detail-card">
                  <span className="op-detail-label">{t.docExpiry}</span>
                  <strong dir="ltr">{selectedDoc.expiryDate || '—'}</strong>
                </div>
                <div className="op-detail-card">
                  <span className="op-detail-label">{t.docStatus}</span>
                  <span className={`admin-badge ${STATUS_TONE[selectedDoc.status]}`}>
                    {statusLabel(selectedDoc.status)}
                  </span>
                </div>
              </div>

              <div className="admin-preview">
                {selectedDoc.fileUrl &&
                (selectedDoc.fileUrl.startsWith('data:image') ||
                  /\.(png|jpe?g|gif|webp)$/i.test(selectedDoc.fileUrl)) ? (
                  <img src={selectedDoc.fileUrl} alt={selectedDoc.employeeName} />
                ) : selectedDoc.fileUrl ? (
                  <a
                    className="primary-button"
                    href={selectedDoc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="search" size={16} strokeWidth={2.2} />
                    <span>{t.preview}</span>
                  </a>
                ) : (
                  <div className="admin-preview__empty">
                    <Icon name="file" size={32} />
                    <span>{t.previewUnavailable}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
