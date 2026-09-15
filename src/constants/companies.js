/* ============================================================================
 * ⚠️  MOCK DATA — TEMPORARY
 * الشركات والمخازن (وهمية). تُحذف عند ربط (GET /companies).
 * ========================================================================== */
export const COMPANIES = [
  {
    id: 'comp-1',
    nameAr: 'شركة أفق للخدمات اللوجستية',
    nameEn: 'Ofuq Logistics Co.',
    warehouses: [
      { id: 'wh-1', nameAr: 'مستودع السلي - الرياض', nameEn: 'Al Sulay Warehouse - Riyadh' },
      { id: 'wh-2', nameAr: 'مستودع الخالدية - جدة', nameEn: 'Al Khalidiyah Warehouse - Jeddah' },
    ],
  },
  {
    id: 'comp-2',
    nameAr: 'شركة المسار السريع للنقل',
    nameEn: 'Fast Track Transport Co.',
    warehouses: [
      { id: 'wh-3', nameAr: 'مستودع الميناء - الدمام', nameEn: 'Port Warehouse - Dammam' },
      { id: 'wh-4', nameAr: 'مستودع الرمال - الرياض', nameEn: 'Al Rimal Warehouse - Riyadh' },
    ],
  },
];
