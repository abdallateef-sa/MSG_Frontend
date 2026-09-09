import { createContext, useContext, useState } from 'react';
import { REQUEST_STATUS } from '@/constants/requestStatus';

const OnboardingContext = createContext(null);

// Initial mock requests to test Supervisor and HR portals out-of-the-box
const INITIAL_MOCK_REQUESTS = [
  {
    id: 'APP-2026-1043',
    fullName: 'عبدالله محمد الغامدي',
    nationalId: '1098765432',
    phone: '501234567',
    city: 'Riyadh',
    hasVehicle: true,
    vehiclePlate: 'أ ب ج ١٢٣٤',
    vehicleType: 'Sedan',
    bankName: 'Al Rajhi Bank',
    iban: 'SA0000000000000000000000',
    status: REQUEST_STATUS.PENDING_SUPERVISOR,
    companyId: null,
    warehouseId: null,
    sanadUrl: '',
    sanadNumber: '',
    cancelReason: null,
    createdAt: '2026-09-06',
  },
  {
    id: 'APP-2026-1044',
    fullName: 'سعيد فهد القحطاني',
    nationalId: '1087654321',
    phone: '559876543',
    city: 'Jeddah',
    hasVehicle: false,
    vehiclePlate: '',
    vehicleType: '',
    bankName: 'Riyad Bank',
    iban: 'SA1111111111111111111111',
    status: REQUEST_STATUS.PENDING_HR,
    companyId: 'comp-1',
    warehouseId: 'wh-1',
    sanadUrl: '',
    sanadNumber: '',
    cancelReason: null,
    createdAt: '2026-09-05',
  },
  {
    id: 'APP-2026-1045',
    fullName: 'خالد عمر الدوسري',
    nationalId: '1076543210',
    phone: '541122334',
    city: 'Dammam',
    hasVehicle: true,
    vehiclePlate: 'س ص ع ٥٦٧٨',
    vehicleType: 'Cargo van',
    bankName: 'Al Rajhi Bank',
    iban: 'SA2222222222222222222222',
    status: REQUEST_STATUS.PENDING_ABSHER,
    companyId: 'comp-2',
    warehouseId: 'wh-3',
    sanadUrl: 'https://sanad.sa/verify/99881',
    sanadNumber: 'SND-99881',
    cancelReason: null,
    createdAt: '2026-09-04',
  },
];

export function OnboardingProvider({ children }) {
  // Current registration flow state (Courier side)
  const [personal, setPersonal] = useState({
    fullName: '',
    idNumber: '',
    dob: '',
    nationality: '',
    phone: '',
    city: '',
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
  const [requests, setRequests] = useState(INITIAL_MOCK_REQUESTS);

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

  // Submit current registration as a new application
  const submitCourierApplication = () => {
    const newId = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApplication = {
      id: newId,
      fullName: personal.fullName || 'مندوب جديد',
      nationalId: personal.idNumber || '10XXXXXXXX',
      phone: personal.phone || '5XXXXXXXX',
      city: personal.city || 'Riyadh',
      hasVehicle: hasVehicle ?? false,
      vehiclePlate: hasVehicle ? vehicleBank.plate : '',
      vehicleType: hasVehicle ? vehicleBank.type : '',
      bankName: vehicleBank.bank || 'Al Rajhi Bank',
      iban: vehicleBank.iban || '',
      status: REQUEST_STATUS.PENDING_SUPERVISOR,
      companyId: null,
      warehouseId: null,
      sanadUrl: '',
      sanadNumber: '',
      cancelReason: null,
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
