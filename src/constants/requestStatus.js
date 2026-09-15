/**
 * Dynamic request statuses and cancellation reasons for the courier lifecycle.
 */
export const REQUEST_STATUS = {
  PENDING_SUPERVISOR: 'pending_supervisor',
  PENDING_HR: 'pending_hr',
  PENDING_ABSHER: 'pending_absher',
  PENDING_CONTRACT: 'pending_contract',
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
};

export const CANCEL_REASON = {
  SUPERVISOR_REJECTED: 'supervisor_rejected',
  ABSHER_REJECTED: 'absher_rejected',
};

/**
 * Operational request statuses (financial / vehicle / administrative requests).
 * Couriers' operations are reviewed by their supervisor first, then by HR.
 * Supervisors' own operations skip the supervisor step and go straight to HR.
 */
export const OPERATION_STATUS = {
  PENDING_SUPERVISOR: 'pending_supervisor',
  PENDING_HR: 'pending_hr',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export function isOperationPending(status) {
  return status === OPERATION_STATUS.PENDING_SUPERVISOR || status === OPERATION_STATUS.PENDING_HR;
}
