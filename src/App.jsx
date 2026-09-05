import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import Login from '@/pages/Login';
import OnboardingLayout from '@/layouts/OnboardingLayout';
import PersonalInfo from '@/pages/PersonalInfo';
import VehicleBank from '@/pages/VehicleBank';
import Documents from '@/pages/Documents';
import CourierStatus from '@/pages/CourierStatus';

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
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
