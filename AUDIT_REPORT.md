# Security & Architecture Audit

Audit date: 2026-09-10  
Scope: the tracked working tree and the currently present source files. No application source, CSS, copy, or layout was changed. `src/constants/routes.js` was already modified in the worktree before this audit and was deliberately not overwritten.

## Executive Summary

| Severity | Count |
| -------- | ----: |
| Critical |     0 |
| Medium   |     5 |
| Low      |     7 |

The build succeeds and React escapes the reviewed dynamic content correctly. There is no active `dangerouslySetInnerHTML`, `eval`, dynamic code execution, or committed `.env` file. The highest-priority work before connecting a backend is restoring the missing `OPERATIONS` route constant, replacing mock authentication/authorization and mutable in-memory request state, validating the user-provided Sanad URL, and revoking the API key retained in Git history.

## Security Issues Found

| Severity | File                                                                                                                                                                  | Description                                                                                                                                                                                                                                                           | Fixed?                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Medium   | `.vscode/mcp.json` in commit `f0c0005`                                                                                                                                | A Google API key is retained in Git history. The current file is removed and `.vscode/` is ignored, but removing a file does not revoke its credential.                                                                                                               | No — requires key revocation/rotation in Google Cloud and, if required, a history rewrite coordinated with repository owners. |
| Medium   | `src/pages/HrRequestDetail/index.jsx:47-50, 222-232`                                                                                                                  | `sanadUrl` is user-controlled and later assigned to `href`. `type="url"` does not impose an HTTP(S) allow-list; a `javascript:` URL could execute if clicked.                                                                                                         | No — validate with `new URL`, permit only `https:` (or an explicitly approved allow-list), and validate again on the server.  |
| Medium   | `src/App.jsx:33-42`; `src/pages/Login/index.jsx:32-38`                                                                                                                | Supervisor, HR, dashboard, and profile routes are directly reachable. The login page chooses a role from a form value and has no session, token, or authorization check. This is not an effective client-side gate and must never be relied on once real data exists. | No — requires backend authentication/authorization and route guards.                                                          |
| Medium   | `src/pages/Documents/index.jsx:14-18, 42`; `src/context/OnboardingContext.jsx:108-133`                                                                                | Document upload records only a boolean; it does not require required files, verify MIME/size/content, or upload them. The application can be submitted with no document data.                                                                                         | No — requires product decision on required documents and real upload API validation.                                          |
| Low      | `src/pages/PersonalInfo/index.jsx:33-43`; `src/pages/VehicleBank/index.jsx:103-112`; `src/pages/Attendance/index.jsx:54-80`; `src/pages/Operations/index.jsx:123-161` | Client validation is limited to HTML `required`, password matching, and a few conditional checks. IDs, phone numbers, IBAN, request amount, absence details, and text lengths/formats are not constrained.                                                            | No — add shared client validation while mirroring all rules server-side.                                                      |

Notes: `fillTemplate` is rendered as React text in `ContractViewer`, so user input is escaped. No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, or current-tree secret was found. `.gitignore` correctly ignores `.env`, `.env.*`, and permits only `.env.example`; no `.env*` file is currently tracked or present.

## Bugs Found

| File                                                                                         | Description                                                                                                                                                                                             | Fixed?                                                                                  |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `src/constants/routes.js:25-32`, `src/App.jsx:50`, `src/pages/CourierDashboard/index.jsx:57` | `ROUTES.OPERATIONS` was removed in the pre-existing uncommitted change, but consumers still use it. The App route and dashboard navigation receive `undefined`, so Operations is not reliably routable. | No — pre-existing user change; restore the constant after confirming the intended path. |
| `src/pages/Login/index.jsx:17-40`                                                            | Typing a username containing `supervisor` or `hr` changes `role`, but later editing the username to remove that text never resets it to courier. A submit can therefore navigate to the wrong portal.   | No.                                                                                     |
| `src/pages/Login/index.jsx:32-40`                                                            | The mock-login timer has no cleanup. Navigating away before 350 ms can cause an unexpected later navigation.                                                                                            | No.                                                                                     |
| `src/pages/Operations/index.jsx:158-160`                                                     | The success-message timer is not cleared on unmount or before a subsequent timer is scheduled, risking a state update after unmount.                                                                    | No.                                                                                     |
| `src/components/shared/ContractViewer.jsx:29-34`                                             | Its fallback navigation timer is not cleaned up if the component unmounts before it fires.                                                                                                              | No.                                                                                     |
| `src/pages/Attendance/index.jsx:16-18, 84-95`                                                | Dates are derived with `toISOString()` (UTC), while the UI is local-time. Around midnight in Saudi Arabia/Egypt, the saved attendance day and displayed local day can differ.                           | No.                                                                                     |
| `src/pages/Attendance/index.jsx:20-35`                                                       | Attendance history is read from `localStorage` twice during initial render. This is small but unnecessary work; a single lazy initializer can derive both values.                                       | No.                                                                                     |

`ProfileMenu` correctly removes its `pointerdown` listener. No `useEffect` dependency or subscription cleanup defect was found elsewhere.

## Architecture Improvements Applied

None. No files were moved or reorganized: making structural changes would either overlap the existing uncommitted route edit or risk the approved visual/behavior contract.

Architecture/documentation drift to resolve deliberately:

- `ARCHITECTURE.md` describes the earlier five-page onboarding-only tree. It omits the present dashboard, profile, attendance, operations, supervisor/HR pages, `dashboard.css`, six shared dashboard components, `Icon`, contracts, request-status constants, companies, and mock dashboard data.
- `ARCHITECTURE.md` and `IMPLEMENTATION_PLAN.md` describe a separate `RequestsContext`, `mockRequests.js`, `RoleGate`, `RequestsTable`, `StatusBadge`, and `ConfirmDialog`. None exists. Request state instead lives in `OnboardingContext`, so unrelated onboarding and admin consumers share one broad provider.
- `README.md` accurately says the service layer is empty, but it describes state as having localStorage persistence. Onboarding requests are currently in memory only; only language and attendance use localStorage.
- `App.jsx` has no duplicate routes. Its onboarding children are correctly wrapped by `OnboardingLayout`; other routes have no authorization layout/guard. The `OPERATIONS` route currently has the broken missing constant noted above.
- `src/pages/SupervisorRequests/index.jsx:107` and `src/pages/HrRequests/index.jsx:123` hard-code parameterized route strings, contrary to the documented route rule. Add route builders (for example, `supervisorRequestDetail(id)`) when safely refactoring.
- `components/shared/CompanyWarehouseSelect.jsx:26-55`, supervisor/HR pages, `PlaceholderPage.jsx:8-14`, `Attendance.jsx:9-14`, `Operations.jsx:7-64`, and `UserProfile.jsx:16-53` contain user-visible hard-coded/fallback copy. Translation keys are not complete in practice: `t.supervisorRequests` is referenced but absent in `copy.js`, which is masked by Arabic fallbacks. Do not change copy in this audit.
- PropTypes are absent from prop-taking JSX components (`AppHeader`, `BottomNav`, `CompanyWarehouseSelect`, `ContractViewer`, cards, `FormActions`, `QuickActionButton`, and `BrandLogo`). ESLint explicitly disables `react/prop-types`; decide whether to enable runtime validation or migrate to TypeScript.
- `OnboardingContext` recreates its value and action functions on each provider render. Split courier onboarding, request workflow, and auth into focused providers/services, then memoize provider values/actions where profiling justifies it.

## Lint & Dependency Audit Results

- `npm run build`: passed (80 modules transformed).
- `npm run lint`: 0 errors, 2 warnings. `OnboardingContext.jsx:156` and `LanguageContext.jsx:31` trigger `react-refresh/only-export-components` because each context file exports a provider and hook. These are non-blocking; move hooks/constants to companion files or explicitly document/scope the rule if clean lint output is required.
- `npx prettier --check .`: failed for `src/pages/Attendance/index.jsx` and `src/styles/dashboard.css`. Formatting was not written because that would modify approved source/CSS.
- `npm audit --json`: 0 vulnerabilities (0 critical, high, moderate, low, or info) across 327 installed dependencies. No package with a known CVE was identified by the audit.
- No unused declared package was found by static review: runtime packages are imported by the application; Vite/React plugin and every ESLint/Prettier package are referenced by tooling configuration/scripts.
- Alias usage is consistent for cross-module source imports. The only relative imports are legitimate same-directory entry imports in `main.jsx` and `LanguageContext.jsx`; no `../../../` import was found.

## Issues Requiring Developer Decision (Not Applied)

1. Revoke and rotate the historical Google API key before any further exposure. Decide whether Git history must be rewritten after rotation.
2. Restore `ROUTES.OPERATIONS` using the intended URL. The worktree modification that removed it predates this audit.
3. Decide the authentication model: HttpOnly-cookie session is preferable to browser token storage where the backend supports it; define refresh, logout, 401 behavior, and RBAC claims with the backend team.
4. Define the approved Sanad host(s) and whether all links must be HTTPS, then implement client and server allow-list validation.
5. Confirm document requirements, allowed file formats, maximum sizes, malware scanning, retention, and whether draft uploads are permitted.
6. Confirm full validation rules for national ID, phone, IBAN, passwords, dates, attendance, and operational-request amounts. Client rules improve UX only; the backend must be authoritative.
7. Approve the i18n migration for currently hard-coded Arabic/English text and native `alert`/`confirm` dialogs. It changes no intended wording but needs a coordinated translation/copy review.
8. Decide whether to add PropTypes now or migrate the project to TypeScript before backend integration.

## Backend Integration TODO

### Mock/hard-coded data to replace

| Location                                                                  | Current data/state                                                                                    | Backend replacement                                                                                                     |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `src/context/OnboardingContext.jsx:7-65`                                  | Three `INITIAL_MOCK_REQUESTS` including PII, bank data, status, Sanad data, and assignments.          | Fetch requests by authenticated role; never ship applicant/bank mock PII in production.                                 |
| `src/context/OnboardingContext.jsx:69-150`                                | Local personal, vehicle/bank, documents, requests, and current request state; local status mutations. | Use resource-specific API services plus a focused cache/context; backend owns status transitions.                       |
| `src/constants/companies.js:4-23` and `CompanyWarehouseSelect.jsx:14-20`  | Companies and warehouses.                                                                             | `GET /companies` and `GET /companies/:companyId/warehouses` (or a scoped assignments endpoint).                         |
| `src/constants/mockDashboard.js:6-23`, `CourierDashboard/index.jsx:19-20` | Courier profile, supervisor, vehicle, zone, and recent requests.                                      | `GET /courier/dashboard` or composed profile/request endpoints.                                                         |
| `src/pages/UserProfile/index.jsx:16-53`                                   | Profile/assignment/vehicle/bank/Sanad fallbacks.                                                      | `GET /courier/profile`; do not expose bank and assignment data without authenticated ownership authorization.           |
| `src/pages/Operations/index.jsx:7-64, 70-161`                             | In-memory request history and submissions.                                                            | Paginated `GET /courier/operations-requests` and `POST /courier/operations-requests`.                                   |
| `src/pages/Attendance/index.jsx:7-80`                                     | Browser-local attendance history and submission.                                                      | `GET /courier/attendance?from=&to=` and `POST /courier/attendance`. The backend determines the business date/time zone. |
| `src/pages/Login/index.jsx:17-40`                                         | Username keyword role detection and simulated success.                                                | Real authentication endpoint and server-issued identity/role.                                                           |
| `src/pages/Documents/index.jsx:12-32, 42`                                 | Boolean upload indicators and local document submission.                                              | Document metadata and upload endpoints; server validates type, size, ownership, and malware scan state.                 |
| `src/constants/contracts/*.js`, `ContractViewer.jsx:14-35`                | Client contract template and client-side signature/status mutation.                                   | Server-provided, legally approved contract/version; `POST` signature acceptance with audit evidence.                    |

### Proposed service contract (derive/confirm with backend)

| Frontend operation            | Proposed method/path                                                                                                              | Request                                           | Response                                                                         |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------- |
| Login                         | `POST /auth/login`                                                                                                                | `{ username, password }`                          | authenticated user `{ id, role, ... }`; use secure session cookie where possible |
| Logout / refresh              | `POST /auth/logout`, `POST /auth/refresh`                                                                                         | session credentials                               | session cleared / refreshed identity                                             |
| Save onboarding draft         | `PATCH /courier/onboarding-draft`                                                                                                 | personal, vehicle/bank fields                     | normalized draft and validation errors                                           |
| Submit application            | `POST /courier/applications`                                                                                                      | personal, vehicle/bank, document IDs              | `{ id, status, createdAt }`                                                      |
| Upload document               | `POST /courier/applications/:id/documents`                                                                                        | multipart file + document type                    | `{ id, type, status, url? }`                                                     |
| Courier status / contract     | `GET /courier/applications/current`; `POST /courier/applications/:id/contract-acceptance`                                         | acceptance/version evidence                       | current application / updated status                                             |
| Supervisor list/detail/action | `GET /supervisor/applications`; `GET /supervisor/applications/:id`; `POST /supervisor/applications/:id/decision`                  | `{ decision, companyId, warehouseId }`            | updated application/status                                                       |
| HR list/detail/Sanad/decision | `GET /hr/applications`; `GET /hr/applications/:id`; `PUT /hr/applications/:id/sanad`; `POST /hr/applications/:id/absher-decision` | Sanad `{ number, url? }`; decision `{ decision }` | updated application/status                                                       |
| Dashboard/profile             | `GET /courier/dashboard`; `GET /courier/profile`                                                                                  | none                                              | only authenticated courier data                                                  |
| Operations request            | `GET /courier/operations-requests`; `POST /courier/operations-requests`                                                           | category, type, subject, amount?, notes           | paginated list / created request                                                 |
| Attendance                    | `GET /courier/attendance`; `POST /courier/attendance`                                                                             | date/status/reason/details                        | history / recorded attendance                                                    |

These are proposed paths, not existing endpoints. The request/status state machine and all authorization must be enforced on the server, including stale-state/concurrent-update handling.

### Environment and client infrastructure

- Create `.env.example` at the project root (allowed by `.gitignore`) with `VITE_API_BASE_URL=` and only public, build-time configuration. Never place secrets in `VITE_*`, because Vite exposes them to the client bundle.
- Add a single `src/services/http.js` wrapper for base URL, JSON parsing, timeout/abort handling, normalized API errors, and credentials policy; place resource calls under `src/services/auth.js`, `courier.js`, `applications.js`, `supervisor.js`, `hr.js`, `attendance.js`, and `operations.js`.
- Add loading, empty, retry, and error UI states for every current instantaneous operation listed above, particularly login, dashboard/profile, requests, documents, supervisor/HR actions, attendance, operations, contract acceptance, and company/warehouse selection.
- Add an auth provider and protected route guard. Handle initial session restoration, refresh/session expiry, logout, a single 401 recovery attempt, then clear state and redirect to login. The backend remains the authorization boundary.
- Split `OnboardingContext` data that must synchronize with the API: onboarding draft, documents, current application/status, and admin application lists/actions. Keep only ephemeral UI state (open modal, local input before save) locally.
- Preserve client validation for usability, but duplicate and strengthen it server-side for every form. Treat all browser-provided IDs, status values, company/warehouse IDs, URLs, files, and role values as untrusted.
