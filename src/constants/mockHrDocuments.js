/* ============================================================================
 * ⚠️  MOCK DATA — TEMPORARY
 * توليد مستندات الموظفين وتواريخ انتهائها لعرض شاشة HR.
 * يُحذف عند ربط API المستندات. الملفات الوهمية الأخرى: src/constants/mockData.js
 * ========================================================================== */

const EXPIRY_OFFSETS = [-75, -20, -4, 6, 14, 28, 60, 150, 320, 540];

const EXPIRING_WINDOW_DAYS = 30;

function hash(value = '') {
  return [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function localDateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function requiredDocumentTypes(request) {
  const types = ['identity', 'license'];
  if (request.hasVehicle) types.push('vehicle');
  if (request.nationality && !['سعودي', 'Saudi'].includes(request.nationality)) {
    types.push('passport');
  }
  return types;
}

function documentNumber(request, type) {
  switch (type) {
    case 'identity':
      return request.nationalId || '';
    case 'passport':
      return request.passportNumber || '';
    case 'license':
      return `LIC-${String(hash(request.id) % 9000 + 1000)}`;
    case 'vehicle':
      return request.vehiclePlate || '';
    default:
      return '';
  }
}

/**
 * Derives a deterministic list of documents (with expiry status) from the
 * employees/requests list. Temporary stand-in for the documents API.
 */
export function buildEmployeeDocuments(requests) {
  const today = new Date();
  const documents = [];

  requests.forEach((request) => {
    const uploadedTypes = Object.entries(request.documents || {})
      .filter(([, value]) => Boolean(value))
      .map(([key]) => key);
    const types = Array.from(new Set([...requiredDocumentTypes(request), ...uploadedTypes]));

    types.forEach((type, index) => {
      const uploaded = uploadedTypes.includes(type);
      const offset = EXPIRY_OFFSETS[(hash(request.id + type) + index) % EXPIRY_OFFSETS.length];

      const expiry = new Date(today);
      expiry.setDate(expiry.getDate() + offset);

      let status = 'valid';
      if (!uploaded) status = 'missing';
      else if (offset < 0) status = 'expired';
      else if (offset <= EXPIRING_WINDOW_DAYS) status = 'expiring';

      const stored = request.documents?.[type];
      documents.push({
        id: `${request.id}-${type}`,
        employeeId: request.id,
        employeeName: request.fullName,
        type,
        number: documentNumber(request, type),
        expiryDate: uploaded ? localDateKey(expiry) : '',
        status,
        fileUrl: typeof stored === 'string' ? stored : null,
      });
    });
  });

  return documents;
}

export { EXPIRING_WINDOW_DAYS };
