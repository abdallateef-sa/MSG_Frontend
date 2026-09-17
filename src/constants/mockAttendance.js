/* ============================================================================
 * ⚠️  MOCK DATA — TEMPORARY
 * حضور وهمي للمناديب (للعرض فقط في بوابة المشرف و HR).
 * يُحذف عند ربط API الحضور. الملفات الوهمية الأخرى: src/constants/mockData.js
 * ========================================================================== */
const PATTERN = ['present', 'present', 'absent', 'present', 'present', 'absent', 'present'];

const ABSENCE_REASONS = ['sick', 'leave', 'emergency'];

const MONTHLY_DAYS = 30;

function localDateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function hashId(id = '') {
  return [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

/**
 * Deterministic attendance history for the last `days` days (ending today).
 */
export function getCourierAttendanceRange(courierId, days = 7, lang = 'ar') {
  const seed = hashId(courierId);
  const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));
    const status = PATTERN[(index + seed) % PATTERN.length];
    return {
      date: localDateKey(date),
      weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date),
      day: date.getDate(),
      status,
      reason: status === 'absent' ? ABSENCE_REASONS[(seed + index) % ABSENCE_REASONS.length] : '',
    };
  });
}

export function getCourierAttendance(courierId, lang = 'ar') {
  return getCourierAttendanceRange(courierId, 7, lang);
}

export function getAttendanceSummary(courierId, lang = 'ar') {
  const history = getCourierAttendance(courierId, lang);
  return {
    present: history.filter((item) => item.status === 'present').length,
    absent: history.filter((item) => item.status === 'absent').length,
    history,
  };
}

/**
 * Monthly (last 30 days) attendance summary with an attendance rate.
 */
export function getMonthlyAttendanceSummary(courierId, lang = 'ar') {
  const history = getCourierAttendanceRange(courierId, MONTHLY_DAYS, lang);
  const present = history.filter((item) => item.status === 'present').length;
  const absent = history.filter((item) => item.status === 'absent').length;
  return {
    present,
    absent,
    total: MONTHLY_DAYS,
    rate: Math.round((present / MONTHLY_DAYS) * 100),
    history,
  };
}

export { MONTHLY_DAYS };
