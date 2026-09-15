import { createContext, useContext, useState } from 'react';
import { REQUEST_STATUS, CANCEL_REASON } from '@/constants/requestStatus';
import { SUPERVISORS } from '@/constants/supervisors';
// ⚠️ MOCK DATA — delete when the backend is connected.
import { MOCK_HIRING_REQUESTS } from '@/constants/mockData';

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  // Current registration flow state (Courier side)
  const [personal, setPersonal] = useState({
    fullName: '',
    idNumber: '',
    passportNumber: '',
    dob: '',
    nationality: '',
    phone: '',
    city: '',
    supervisorId: '',
    password: '',
  });

  const [hasVehicle, setHasVehicle] = useState(null); // true | false | null

  const [vehicleBank, setVehicleBank] = useState({
    plate: '',
    type: '',
    bank: '',
    iban: '',
  });

  const [documents, setDocuments] = useState({});

  // Central mock requests state (Shared between Courier, Supervisor, and HR)
  const [requests, setRequests] = useState(MOCK_HIRING_REQUESTS);

  // Active courier's current request ID
  const [currentRequestId, setCurrentRequestId] = useState('APP-2026-1043');

  const updatePersonal = (data) => setPersonal((prev) => ({ ...prev, ...data }));
  const updateVehicleBank = (data) => setVehicleBank((prev) => ({ ...prev, ...data }));
  const updateDocuments = (name, val = true) => setDocuments((prev) => ({ ...prev, [name]: val }));

  // Helper to get active request
  const currentRequest = requests.find((r) => r.id === currentRequestId) || requests[0];

  // Helper to update a request by ID
  const updateRequest = (id, updates) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, ...updates } : req)));
  };

  // Supervisor review for a hiring application.
  // Approve -> assign company/warehouse and move to HR; Reject -> cancel with a mandatory reason.
  const reviewHiringRequest = (id, { decision, companyId, warehouseId, reason, supervisorName }) => {
    const now = new Date().toISOString();
    if (decision === 'approve') {
      updateRequest(id, {
        status: REQUEST_STATUS.PENDING_HR,
        companyId: companyId || null,
        warehouseId: warehouseId || null,
        supervisorDecision: 'approved',
        supervisorDecisionAt: now,
        supervisorRejectReason: '',
        supervisorName: supervisorName || undefined,
      });
      return;
    }
    updateRequest(id, {
      status: REQUEST_STATUS.CANCELLED,
      cancelReason: CANCEL_REASON.SUPERVISOR_REJECTED,
      supervisorDecision: 'rejected',
      supervisorDecisionAt: now,
      supervisorRejectReason: reason || '',
    });
  };

  // Submit current registration as a new application
  const submitCourierApplication = () => {
    const newId = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedSupervisor = SUPERVISORS.find(
      (supervisor) => supervisor.id === personal.supervisorId,
    );
    const newApplication = {
      id: newId,
      fullName: personal.fullName || 'مندوب جديد',
      nationalId: personal.idNumber || '10XXXXXXXX',
      nationality: personal.nationality || '',
      passportNumber: personal.passportNumber || '',
      dateOfBirth: personal.dob || '',
      phone: personal.phone || '5XXXXXXXX',
      city: personal.city || 'Riyadh',
      supervisorId: selectedSupervisor?.id || '',
      supervisorName: selectedSupervisor?.nameAr || '',
      supervisorPhone: selectedSupervisor?.phone || '',
      hasVehicle: hasVehicle ?? false,
      vehiclePlate: hasVehicle ? vehicleBank.plate : '',
      vehicleType: hasVehicle ? vehicleBank.type : '',
      bankName: vehicleBank.bank || 'Al Rajhi Bank',
      iban: vehicleBank.iban || '',
      documents: { ...documents },
      status: REQUEST_STATUS.PENDING_SUPERVISOR,
      companyId: null,
      warehouseId: null,
      sanadNumber: '',
      sanadDate: '',
      sanadAmount: '',
      cancelReason: null,
      supervisorDecision: null,
      supervisorRejectReason: '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setRequests((prev) => [newApplication, ...prev]);
    setCurrentRequestId(newId);
    return newId;
  };

  const value = {
    personal,
    updatePersonal,
    hasVehicle,
    setHasVehicle,
    vehicleBank,
    updateVehicleBank,
    documents,
    updateDocuments,
    requests,
    currentRequestId,
    setCurrentRequestId,
    currentRequest,
    updateRequest,
    reviewHiringRequest,
    submitCourierApplication,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

export default OnboardingContext;
