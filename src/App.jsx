import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/context/AuthContext';
import RequireRole from '@/components/shared/RequireRole';
import Login from '@/pages/Login';
import OnboardingLayout from '@/layouts/OnboardingLayout';
import PersonalInfo from '@/pages/PersonalInfo';
import VehicleBank from '@/pages/VehicleBank';
import Documents from '@/pages/Documents';
import CourierStatus from '@/pages/CourierStatus';
import SupervisorDashboard from '@/pages/SupervisorDashboard';
import SupervisorProfile from '@/pages/SupervisorProfile';
import SupervisorCouriers from '@/pages/SupervisorCouriers';
import SupervisorCourierDetail from '@/pages/SupervisorCourierDetail';
import SupervisorAttendance from '@/pages/SupervisorAttendance';
import SupervisorRequests from '@/pages/SupervisorRequests';
import SupervisorRequestDetail from '@/pages/SupervisorRequestDetail';
import HrRequests from '@/pages/HrRequests';
import HrRequestDetail from '@/pages/HrRequestDetail';
import CourierDashboard from '@/pages/CourierDashboard';
import UserProfile from '@/pages/UserProfile';
import Operations from '@/pages/Operations';
import Shipments from '@/pages/Shipments';
import PlaceholderPage from '@/pages/PlaceholderPage';
import Attendance from '@/pages/Attendance';

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<OnboardingLayout />}>
        <Route index element={<Navigate to={ROUTES.REGISTER_PERSONAL} replace />} />
        <Route path="personal" element={<PersonalInfo />} />
        <Route path="vehicle-bank" element={<VehicleBank />} />
        <Route path="documents" element={<Documents />} />
      </Route>
      <Route path={ROUTES.STATUS} element={<CourierStatus />} />

      {/* Courier Portal */}
      <Route element={<RequireRole role={ROLES.COURIER} />}>
        <Route path={ROUTES.COURIER_DASHBOARD} element={<CourierDashboard />} />
        <Route path={ROUTES.PROFILE} element={<UserProfile />} />
        <Route path={ROUTES.SHIPMENTS} element={<Shipments />} />
        <Route path={ROUTES.OPERATIONS} element={<Operations />} />
        <Route path={ROUTES.ATTENDANCE} element={<Attendance />} />
        <Route path={ROUTES.VEHICLE_COMPENSATION} element={<PlaceholderPage />} />
        <Route path={ROUTES.FINANCIAL_ADVANCE} element={<PlaceholderPage />} />
        <Route path={ROUTES.ACCIDENT_REPORT} element={<PlaceholderPage />} />
        <Route path={ROUTES.CANCEL_COMPENSATION} element={<PlaceholderPage />} />
      </Route>

      {/* Supervisor Portal */}
      <Route element={<RequireRole role={ROLES.SUPERVISOR} />}>
        <Route path={ROUTES.SUPERVISOR_DASHBOARD} element={<SupervisorDashboard />} />
        <Route path={ROUTES.SUPERVISOR_PROFILE} element={<SupervisorProfile />} />
        <Route path={ROUTES.SUPERVISOR_COURIERS} element={<SupervisorCouriers />} />
        <Route path={ROUTES.SUPERVISOR_COURIER_DETAIL} element={<SupervisorCourierDetail />} />
        <Route path={ROUTES.SUPERVISOR_ATTENDANCE} element={<SupervisorAttendance />} />
        <Route path={ROUTES.SUPERVISOR_REQUESTS} element={<SupervisorRequests />} />
        <Route path={ROUTES.SUPERVISOR_REQUEST_DETAIL} element={<SupervisorRequestDetail />} />
        <Route path={ROUTES.SUPERVISOR_OPERATIONS} element={<Operations />} />
        <Route path={ROUTES.SUPERVISOR_SHIPMENTS} element={<Shipments />} />
        <Route path={ROUTES.SUPERVISOR_MY_ATTENDANCE} element={<Attendance />} />
      </Route>

      {/* HR Portal */}
      <Route element={<RequireRole role={ROLES.HR} />}>
        <Route path={ROUTES.HR_REQUESTS} element={<HrRequests />} />
        <Route path={ROUTES.HR_REQUEST_DETAIL} element={<HrRequestDetail />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
