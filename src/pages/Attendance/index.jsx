import { useMemo, useState } from 'react';
import AppHeader from '@/components/shared/AppHeader';
import PortalBottomNav from '@/components/shared/PortalBottomNav';
import Icon from '@/components/ui/Icon';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';

const STORAGE_KEY = 'msg-courier-attendance';

const ABSENCE_REASONS = [
  { key: 'sick', ar: 'مرض', en: 'Sick leave' },
  { key: 'leave', ar: 'إجازة معتمدة', en: 'Approved leave' },
  { key: 'emergency', ar: 'ظرف طارئ', en: 'Emergency' },
  { key: 'other', ar: 'سبب آخر', en: 'Other reason' },
];

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readAttendanceHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(saved)) return saved;
    return saved?.date ? [saved] : [];
  } catch {
    return [];
  }
}

export default function Attendance() {
  const { t, lang, dir } = useLanguage();
  const { user } = useAuth();
  const todayKey = getTodayKey();
  const [history, setHistory] = useState(readAttendanceHistory);
  const [attendance, setAttendance] = useState(() => {
    return readAttendanceHistory().find((item) => item.date === todayKey) || null;
  });
  const [status, setStatus] = useState(attendance?.status || '');
  const [reason, setReason] = useState(attendance?.reason || '');
  const [details, setDetails] = useState(attendance?.details || '');
  const [error, setError] = useState('');
  const attendanceLocked = Boolean(attendance);

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    [lang],
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (attendanceLocked) return;
    if (!status) {
      setError(t.attendanceStatusRequired);
      return;
    }
    if (status === 'absent' && !reason) {
      setError(t.absenceReasonRequired);
      return;
    }

    const nextAttendance = {
      date: todayKey,
      status,
      reason: status === 'absent' ? reason : '',
      details: status === 'absent' && reason === 'other' ? details.trim() : '',
      submittedAt: new Date().toISOString(),
    };
    const nextHistory = [...history.filter((item) => item.date !== todayKey), nextAttendance].sort((a, b) =>
      b.date.localeCompare(a.date),
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
    setHistory(nextHistory);
    setAttendance(nextAttendance);
    setError('');
  };

  const isAbsent = status === 'absent';
  const savedReason = ABSENCE_REASONS.find((item) => item.key === attendance?.reason);
  const previousDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      label: new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'short' }).format(date),
      number: date.getDate(),
      record: history.find((item) => item.date === key),
      isToday: key === todayKey,
    };
  });

  return (
    <div className="attendance-page" dir={dir}>
      <AppHeader
        title={t.attendance}
        variant={user.role === 'supervisor' ? 'supervisor' : 'dashboard'}
      />

      <main className="attendance-main">
        <section className="attendance-hero">
          <div className="attendance-hero-icon">
            <Icon name="attendance" size={26} strokeWidth={1.8} />
          </div>
          <div>
            <p className="eyebrow">{t.dailyAttendance}</p>
            <h1>{t.recordAttendance}</h1>
            <p>{t.attendanceSubtitle}</p>
          </div>
        </section>

        <section className="attendance-card">
          <div className="attendance-date">
            <Icon name="calendar" size={19} strokeWidth={1.8} />
            <span>{todayLabel}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <fieldset className="attendance-fieldset">
              <legend>{t.attendanceStatus}</legend>
              <div className="attendance-options">
                <label className={`attendance-option${status === 'present' ? ' selected present' : ''}`}>
                  <input
                    type="radio"
                    name="attendance-status"
                    value="present"
                    checked={status === 'present'}
                    disabled={attendanceLocked}
                    onChange={() => {
                      setStatus('present');
                      setError('');
                    }}
                  />
                  <span className="attendance-option-mark">
                    <Icon name="check" size={18} strokeWidth={2.3} />
                  </span>
                  <span>
                    <strong>{t.present}</strong>
                    <small>{t.presentHint}</small>
                  </span>
                </label>
                <label className={`attendance-option${isAbsent ? ' selected absent' : ''}`}>
                  <input
                    type="radio"
                    name="attendance-status"
                    value="absent"
                    checked={isAbsent}
                    disabled={attendanceLocked}
                    onChange={() => {
                      setStatus('absent');
                      setError('');
                    }}
                  />
                  <span className="attendance-option-mark">
                    <Icon name="close" size={17} strokeWidth={2.1} />
                  </span>
                  <span>
                    <strong>{t.absent}</strong>
                    <small>{t.absentHint}</small>
                  </span>
                </label>
              </div>
            </fieldset>

            {isAbsent && (
              <div className="absence-details">
                <label className="attendance-label" htmlFor="absence-reason">
                  {t.absenceReason}
                </label>
                <select
                  id="absence-reason"
                  className="attendance-select"
                  value={reason}
                  disabled={attendanceLocked}
                  onChange={(event) => {
                    setReason(event.target.value);
                    setError('');
                  }}
                  required
                >
                  <option value="">{t.chooseAbsenceReason}</option>
                  {ABSENCE_REASONS.map((item) => (
                    <option key={item.key} value={item.key}>
                      {lang === 'ar' ? item.ar : item.en}
                    </option>
                  ))}
                </select>

                {reason === 'other' && (
                  <textarea
                    className="attendance-textarea"
                    value={details}
                    disabled={attendanceLocked}
                    onChange={(event) => setDetails(event.target.value)}
                    placeholder={t.absenceDetailsPlaceholder}
                    rows={3}
                    required
                  />
                )}
              </div>
            )}

            {error && <p className="attendance-error" role="alert">{error}</p>}

            {attendanceLocked && (
              <p className="attendance-locked">
                {attendance.status === 'absent' ? t.absenceLocked : t.attendanceLocked}
              </p>
            )}

            <button className="primary-button attendance-submit" type="submit" disabled={attendanceLocked}>
              <Icon name="check" size={17} strokeWidth={2.3} />
              <span>
                {attendanceLocked
                  ? attendance.status === 'absent'
                    ? t.absenceRecorded
                    : t.attendanceRecorded
                  : t.saveAttendance}
              </span>
            </button>
          </form>
        </section>

        {attendance && (
          <div className={`attendance-success ${attendance.status}`}>
            <Icon name="check" size={18} strokeWidth={2.2} />
            <span>
              {attendance.status === 'present'
                ? t.attendanceSavedPresent
                : `${t.attendanceSavedAbsent} ${savedReason ? (lang === 'ar' ? savedReason.ar : savedReason.en) : ''}`}
            </span>
          </div>
        )}

        <section className="attendance-calendar-card">
          <div className="attendance-calendar-header">
            <div>
              <h2>{t.attendanceHistory}</h2>
              <p>{t.attendanceHistorySubtitle}</p>
            </div>
            <Icon name="calendar" size={21} strokeWidth={1.8} />
          </div>
          <div className="attendance-calendar" aria-label={t.attendanceHistory}>
            {previousDays.map((day) => (
              <div className={`attendance-day${day.isToday ? ' today' : ''}`} key={day.key}>
                <span className="attendance-day-label">{day.label}</span>
                <span className={`attendance-day-number ${day.record?.status || 'empty'}`}>
                  {day.number}
                </span>
                <span className="attendance-day-status">
                  {day.record?.status === 'present'
                    ? t.present
                    : day.record?.status === 'absent'
                      ? t.absent
                      : t.notRecorded}
                </span>
              </div>
            ))}
          </div>
          <div className="attendance-calendar-legend">
            <span><i className="present-dot" />{t.present}</span>
            <span><i className="absent-dot" />{t.absent}</span>
            <span><i className="empty-dot" />{t.notRecorded}</span>
          </div>
        </section>
      </main>

      <PortalBottomNav activeTab="attendance" />
    </div>
  );
}
