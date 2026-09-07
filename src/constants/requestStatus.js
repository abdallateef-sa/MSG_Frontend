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
