import { createContext, useContext, useState } from 'react';
// ⚠️ MOCK DATA — delete when the backend is connected.
import { MOCK_OPERATION_REQUESTS } from '@/constants/mockData';
import { OPERATION_STATUS } from '@/constants/requestStatus';

const OperationsContext = createContext(null);

export function OperationsProvider({ children }) {
  const [requests, setRequests] = useState(MOCK_OPERATION_REQUESTS);

  const addRequest = (request) => setRequests((current) => [request, ...current]);

  const updateRequest = (id, updates) => {
    setRequests((current) =>
      current.map((request) => (request.id === id ? { ...request, ...updates } : request)),
    );
  };

  // Supervisor review for an operational request (approve -> HR, reject -> cancelled).
  const reviewOperationRequest = (id, { decision, reason }) => {
    if (decision === 'approve') {
      updateRequest(id, {
        status: OPERATION_STATUS.PENDING_HR,
        supervisorDecision: 'approved',
        supervisorRejectReason: '',
        supervisorDecisionAt: new Date().toISOString(),
      });
      return;
    }
    updateRequest(id, {
      status: OPERATION_STATUS.REJECTED,
      supervisorDecision: 'rejected',
      supervisorRejectReason: reason || '',
      supervisorDecisionAt: new Date().toISOString(),
    });
  };

  // HR final decision for an operational request.
  const decideOperationRequest = (id, { decision, reason }) => {
    updateRequest(id, {
      status: decision === 'approve' ? OPERATION_STATUS.APPROVED : OPERATION_STATUS.REJECTED,
      hrDecision: decision,
      hrRejectReason: decision === 'approve' ? '' : reason || '',
      hrDecisionAt: new Date().toISOString(),
    });
  };

  return (
    <OperationsContext.Provider
      value={{ requests, addRequest, updateRequest, reviewOperationRequest, decideOperationRequest }}
    >
      {children}
    </OperationsContext.Provider>
  );
}

export function useOperations() {
  const context = useContext(OperationsContext);
  if (!context) {
    throw new Error('useOperations must be used within an OperationsProvider');
  }
  return context;
}

export default OperationsContext;
