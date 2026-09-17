/* ============================================================================
 * ⚠️  MOCK DATA — TEMPORARY
 * البيانات الأساسية (الشركات=العملاء، المناطق، المدن، المخازن).
 * تُحذف عند ربط API. الملفات الوهمية الأخرى: src/constants/mockData.js
 * ========================================================================== */

export const MOCK_REGIONS = [
  { id: 'region-riyadh', nameAr: 'منطقة الرياض', nameEn: 'Riyadh Region' },
  { id: 'region-makkah', nameAr: 'منطقة مكة المكرمة', nameEn: 'Makkah Region' },
  { id: 'region-eastern', nameAr: 'المنطقة الشرقية', nameEn: 'Eastern Region' },
];

export const MOCK_CITIES = [
  { id: 'city-riyadh', regionId: 'region-riyadh', nameAr: 'الرياض', nameEn: 'Riyadh' },
  { id: 'city-jeddah', regionId: 'region-makkah', nameAr: 'جدة', nameEn: 'Jeddah' },
  { id: 'city-dammam', regionId: 'region-eastern', nameAr: 'الدمام', nameEn: 'Dammam' },
];

export const MOCK_COMPANIES = [
  {
    id: 'comp-1',
    code: 'CMP-001',
    nameAr: 'شركة أفق للخدمات اللوجستية',
    nameEn: 'Ofuq Logistics Co.',
    phone: '+966112345678',
    email: 'ops@ofuq-logistics.sa',
    addressAr: 'الرياض - طريق الملك فهد - مبنى 12',
    addressEn: 'Riyadh - King Fahd Road - Building 12',
    regionId: 'region-riyadh',
    cityId: 'city-riyadh',
    status: 'active',
    createdAt: '2026-01-12',
    warehouses: [
      {
        id: 'wh-1',
        code: 'WH-001',
        nameAr: 'مستودع السلي - الرياض',
        nameEn: 'Al Sulay Warehouse - Riyadh',
        cityId: 'city-riyadh',
        supervisorId: 'sup-khaled',
        status: 'active',
      },
      {
        id: 'wh-2',
        code: 'WH-002',
        nameAr: 'مستودع الخالدية - جدة',
        nameEn: 'Al Khalidiyah Warehouse - Jeddah',
        cityId: 'city-jeddah',
        supervisorId: 'sup-fahad',
        status: 'active',
      },
    ],
  },
  {
    id: 'comp-2',
    code: 'CMP-002',
    nameAr: 'شركة المسار السريع للنقل',
    nameEn: 'Fast Track Transport Co.',
    phone: '+966133334444',
    email: 'dispatch@fasttrack.sa',
    addressAr: 'الدمام - طريق الملك سعود - مبنى 5',
    addressEn: 'Dammam - King Saud Road - Building 5',
    regionId: 'region-eastern',
    cityId: 'city-dammam',
    status: 'active',
    createdAt: '2026-02-03',
    warehouses: [
      {
        id: 'wh-3',
        code: 'WH-003',
        nameAr: 'مستودع الميناء - الدمام',
        nameEn: 'Port Warehouse - Dammam',
        cityId: 'city-dammam',
        supervisorId: 'sup-noura',
        status: 'active',
      },
      {
        id: 'wh-4',
        code: 'WH-004',
        nameAr: 'مستودع الرمال - الرياض',
        nameEn: 'Al Rimal Warehouse - Riyadh',
        cityId: 'city-riyadh',
        supervisorId: 'sup-khaled',
        status: 'active',
      },
    ],
  },
];
