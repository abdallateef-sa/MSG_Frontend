/* ============================================================================
 * ⚠️  MOCK DATA — TEMPORARY
 * بيانات داشبورد المندوب (وهمية). تُحذف عند ربط (GET /courier/profile).
 * الملفات الوهمية الأخرى: src/constants/mockData.js
 * ========================================================================== */

export const mockDashboard = {
  courierName: 'أحمد',
  zone: '1Mile',
  supervisor: {
    name: 'خالد عبدالله',
    phone: '+966500000000',
  },
  vehicle: {
    plate: 'س م ر 4567',
    model: 'Toyota Hiace 2023',
    badge: 'PetroApp: 9021',
  },
};

export default mockDashboard;
