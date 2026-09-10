import { useLanguage } from '@/i18n/LanguageContext';

export default function RequestListItem({ title, requestId, date, status }) {
  const { t } = useLanguage();

  const statusClass = status === 'approved' ? 'status-badge--success' : 'status-badge--warning';
  const statusText = status === 'approved' ? t.approved : t.pendingReview;

  return (
    <article className="request-item">
      <div className="request-info">
        <h4>{title}</h4>
        <div className="request-meta">
          <span>{requestId}</span>
          <span>{date}</span>
        </div>
      </div>
      <span className={`status-badge ${statusClass}`}>{statusText}</span>
    </article>
  );
}
