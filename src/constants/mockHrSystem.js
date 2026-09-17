/* ============================================================================
 * ⚠️  MOCK DATA — TEMPORARY
 * سجل التدقيق (واجهة فقط). يُحذف عند ربط API سجل التدقيق.
 * ========================================================================== */

export const AUDIT_ACTION = {
  APPROVED_OPERATION: 'approvedOperation',
  REJECTED_OPERATION: 'rejectedOperation',
  ACTIVATED_EMPLOYEE: 'activatedEmployee',
  SUSPENDED_EMPLOYEE: 'suspendedEmployee',
  UPDATED_EMPLOYEE: 'updatedEmployee',
  ISSUED_SANAD: 'issuedSanad',
  SIGNED_CONTRACT: 'signedContract',
};

export const MOCK_AUDIT_LOG = [
  {
    id: 'AUD-2026-0091',
    actor: 'فهد العتيبي',
    action: AUDIT_ACTION.ISSUED_SANAD,
    entity: 'APP-2026-1044',
    at: '2026-09-14T09:20:00',
  },
  {
    id: 'AUD-2026-0090',
    actor: 'نورة القحطاني',
    action: AUDIT_ACTION.APPROVED_OPERATION,
    entity: 'REQ-085',
    at: '2026-09-13T14:05:00',
  },
  {
    id: 'AUD-2026-0089',
    actor: 'خالد عبدالله',
    action: AUDIT_ACTION.UPDATED_EMPLOYEE,
    entity: 'APP-2026-1039',
    at: '2026-09-13T11:40:00',
  },
  {
    id: 'AUD-2026-0088',
    actor: 'فهد العتيبي',
    action: AUDIT_ACTION.SUSPENDED_EMPLOYEE,
    entity: 'APP-2026-1033',
    at: '2026-09-12T16:15:00',
  },
  {
    id: 'AUD-2026-0087',
    actor: 'نورة القحطاني',
    action: AUDIT_ACTION.REJECTED_OPERATION,
    entity: 'REQ-061',
    at: '2026-09-12T10:30:00',
  },
  {
    id: 'AUD-2026-0086',
    actor: 'عبدالله الغامدي',
    action: AUDIT_ACTION.SIGNED_CONTRACT,
    entity: 'APP-2026-1040',
    at: '2026-09-11T19:00:00',
  },
  {
    id: 'AUD-2026-0085',
    actor: 'فهد العتيبي',
    action: AUDIT_ACTION.ACTIVATED_EMPLOYEE,
    entity: 'APP-2026-1042',
    at: '2026-09-10T08:45:00',
  },
];
