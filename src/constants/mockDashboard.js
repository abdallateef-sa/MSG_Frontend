/**
 * Mock dashboard data for Courier Dashboard.
 * Replace with API call (GET /courier/profile) when backend is ready.
 */

export const mockDashboard = {
  courierName: 'أحمد',
  status: 'active',
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
  recentRequests: [
    { id: 'REQ-092', title: 'تعويض مركبة', date: '24 أكتوبر', status: 'approved' },
    { id: 'REQ-085', title: 'سلفة مالية', date: 'اليوم', status: 'pending' },
  ],
};

export default mockDashboard;
