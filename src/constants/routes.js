/**
 * Central route path constants.
 *
 * Usage:
 *   import { ROUTES } from '@/constants/routes';
 *   navigate(ROUTES.LOGIN);
 *
 * Rule: all navigation paths in the app must reference this file.
 * Never hard-code a route string directly in a component.
 */
export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_PERSONAL: '/register/personal',
  REGISTER_VEHICLE_BANK: '/register/vehicle-bank',
  REGISTER_DOCUMENTS: '/register/documents',
  STATUS: '/status',
  SUPERVISOR_DASHBOARD: '/supervisor/dashboard',
  SUPERVISOR_PROFILE: '/supervisor/profile',
  SUPERVISOR_COURIERS: '/supervisor/couriers',
  SUPERVISOR_COURIER_DETAIL: '/supervisor/couriers/:id',
  SUPERVISOR_REQUESTS: '/supervisor/requests',
  SUPERVISOR_REQUEST_DETAIL: '/supervisor/requests/:id',
  SUPERVISOR_ATTENDANCE: '/supervisor/attendance',
  SUPERVISOR_OPERATIONS: '/supervisor/operations',
  SUPERVISOR_SHIPMENTS: '/supervisor/shipments',
  SUPERVISOR_MY_ATTENDANCE: '/supervisor/my-attendance',
  HR_REQUESTS: '/hr/requests',
  HR_REQUEST_DETAIL: '/hr/requests/:id',
  COURIER_DASHBOARD: '/courier/dashboard',
  PROFILE: '/courier/profile',
  OPERATIONS: '/courier/operations',
  SHIPMENTS: '/courier/shipments',
  ATTENDANCE: '/courier/attendance',
  // Placeholder routes (all use PlaceholderPage with title from route)
  VEHICLE_COMPENSATION: '/placeholder/vehicle-compensation',
  FINANCIAL_ADVANCE: '/placeholder/financial-advance',
  ACCIDENT_REPORT: '/placeholder/accident-report',
  CANCEL_COMPENSATION: '/placeholder/cancel-compensation',
};
