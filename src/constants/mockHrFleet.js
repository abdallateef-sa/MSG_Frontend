/* ============================================================================
 * ⚠️  MOCK DATA — TEMPORARY
 * أسطول المركبات (واجهة فقط). يُحذف عند ربط API الأسطول.
 * الملفات الوهمية الأخرى: src/constants/mockData.js
 * ========================================================================== */

const EXPIRY_OFFSETS = [-12, 4, 18, 45, 90, 210, 400];

function hash(value = '') {
  return [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Builds a deterministic fleet from the employees list: employees with a
 * private vehicle keep their plate/type, others get a company vehicle.
 */
export function buildFleet(requests) {
  return requests.map((employee) => {
    const seed = hash(employee.id);
    const own = Boolean(employee.hasVehicle);
    return {
      id: `VEH-${employee.id}`,
      employeeId: employee.id,
      employeeName: employee.fullName,
      plate: own ? employee.vehiclePlate || '—' : `${1000 + (seed % 8999)}`,
      type: own ? employee.vehicleType || 'Sedan' : 'Cargo van',
      ownership: own ? 'own' : 'company',
      insuranceExpiry: addDays(EXPIRY_OFFSETS[seed % EXPIRY_OFFSETS.length]),
      registrationExpiry: addDays(EXPIRY_OFFSETS[(seed + 3) % EXPIRY_OFFSETS.length]),
      status: seed % 5 === 0 ? 'maintenance' : 'active',
    };
  });
}
