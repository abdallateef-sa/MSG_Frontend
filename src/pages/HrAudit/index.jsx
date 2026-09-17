import { useMemo } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { MOCK_AUDIT_LOG } from '@/constants/mockHrSystem';
import Icon from '@/components/ui/Icon';

export default function HrAudit() {
  const { t, lang } = useLanguage();

  const rows = useMemo(
    () => [...MOCK_AUDIT_LOG].sort((a, b) => b.at.localeCompare(a.at)),
    [],
  );

  const formatTime = (iso) =>
    new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{t.auditTitle}</h1>
          <p>{t.auditHint}</p>
        </div>
        <span className="op-history-badge">{rows.length}</span>
      </div>

      <div className="admin-card">
        {rows.length === 0 ? (
          <div className="admin-empty">
            <Icon name="file" size={32} />
            <p>{t.noAudit}</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.auditActor}</th>
                  <th>{t.auditAction}</th>
                  <th>{t.auditEntity}</th>
                  <th>{t.auditTime}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.actor}</td>
                    <td>{t[entry.action] || entry.action}</td>
                    <td dir="ltr">{entry.entity}</td>
                    <td dir="ltr">{formatTime(entry.at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
