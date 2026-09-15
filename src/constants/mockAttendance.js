/* ============================================================================
 * ⚠️  MOCK DATA — TEMPORARY
 * حضور وهمي للمناديب (للعرض فقط في بوابة المشرف).
 * يُحذف عند ربط API الحضور. الملفات الوهمية الأخرى: src/constants/mockData.js
 * ========================================================================== */
const PATTERN = ['present', 'present', 'absent', 'present', 'present', 'absent', 'present'];

const ABSENCE_REASONS = ['sick', 'leave', 'emergency'];

function localDateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function hashId(id = '') {
  return [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function getCourierAttendance(courierId, lang = 'ar') {
  const seed = hashId(courierId);
  const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
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

export function getAttendanceSummary(courierId, lang = 'ar') {
  const history = getCourierAttendance(courierId, lang);
  return {
    present: history.filter((item) => item.status === 'present').length,
    absent: history.filter((item) => item.status === 'absent').length,
    history,
  };
}
