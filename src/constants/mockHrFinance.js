/* ============================================================================
 * ⚠️  MOCK DATA — TEMPORARY
 * بيانات الرواتب (واجهة فقط). تُحذف عند ربط API الرواتب.
 * الطلبات المالية تأتي من العمليات (category: 'financial') وليست هنا.
 * الملفات الوهمية الأخرى: src/constants/mockData.js
 * ========================================================================== */

export const PAYROLL_MODEL = {
  FIXED: 'fixed',
  TARGET: 'target',
  SLIDING: 'sliding',
};

export const PAYROLL_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
};

function hash(value = '') {
  return [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

const MODELS = [PAYROLL_MODEL.FIXED, PAYROLL_MODEL.TARGET, PAYROLL_MODEL.SLIDING];

/**
 * Builds a deterministic payroll run for the given employees and period.
 */
export function buildPayrollRun(employees, period) {
  return employees.map((employee) => {
    const seed = hash(employee.id + period);
    const ppd = 40 + (seed % 60);
    const cod = 20 + (seed % 40);
    const pickup = 5 + (seed % 15);
    const gross = 3500 + (seed % 2500);
    const deductions = seed % 400;
    return {
      id: `${employee.id}-${period}`,
      employeeId: employee.id,
      employeeName: employee.fullName,
      model: MODELS[seed % MODELS.length],
      ppd,
      cod,
      pickup,
      gross,
      deductions,
      net: gross - deductions,
      status: seed % 3 === 0 ? PAYROLL_STATUS.PENDING : PAYROLL_STATUS.PAID,
    };
  });
}
