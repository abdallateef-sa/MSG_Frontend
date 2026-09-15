# MSG Frontend

This is a React (JSX) + Vite frontend project. The internal folder structure has been modularized and organized to ensure maintainability and scalability.

## 🚀 Getting Started

To install dependencies and start the development server:

```bash
npm install
npm run dev
```

## 📁 Folder Structure

Here is a quick overview of what belongs where:

```text
src/
├── assets/          # (If any) Images, SVGs, and static assets
├── components/      # Reusable UI elements
│   ├── shared/      # Components used across multiple pages (e.g., AppHeader, FormActions, StatusBadge, ContractViewer)
│   └── ui/          # Small, dumb/pure components (e.g., BrandLogo, LanguageButton, ConfirmDialog)
├── constants/       # Fixed values and configuration
│   ├── routes.js    # Route path constants
│   ├── requestStatus.js  # Request status enums and cancel reasons
│   ├── companies.js      # Mock company/warehouse data
│   └── contracts/        # Contract templates (with/without vehicle)
├── context/         # React Context providers
│   ├── LanguageContext.jsx  # i18n + RTL
│   └── OnboardingContext.jsx # Courier registration flow state
├── hooks/           # Custom React hooks (e.g., useAuth, useForm)
├── i18n/            # Translations (copy.js) and the LanguageContext
├── layouts/         # Layout wrappers that contain sub-routes (e.g., OnboardingLayout)
├── pages/           # Page-level components, grouped by folder
│   ├── Login/
│   ├── PersonalInfo/
│   ├── VehicleBank/
│   ├── Documents/
│   ├── CourierStatus/
│   ├── SupervisorRequests/
│   ├── SupervisorRequestDetail/
│   ├── HrRequests/
│   └── HrRequestDetail/
├── services/        # API calls grouped by resource (e.g., api/auth.js, api/courier.js)
├── styles/          # Global CSS, CSS variables, and layout-specific styles
├── utils/           # Pure helper functions (e.g., rtl.js, fillTemplate)
├── App.jsx          # Main routing and entry component
└── main.jsx         # React DOM mount point
```

## 🛠️ Rules for Adding New Features

1. **New Page:** Create a new folder inside `src/pages/` (e.g., `src/pages/Dashboard/`) and place the main logic inside `index.jsx`. Local sub-components that are only used in this page can go in the same folder.
2. **New Reusable UI:** If it's a generic UI element (like a custom Input or Card), put it in `src/components/ui/`.
3. **New Shared Component:** If it's a larger component used by 2 or more distinct pages, put it in `src/components/shared/`.
4. **New API Call:** Do not use `fetch` or `axios` inline inside components. Create a service file in `src/services/` and import the function from there.
5. **New Route:** Always add the route path string to `src/constants/routes.js`. Never hardcode `navigate('/path')` inside components. Use `navigate(ROUTES.PATH)` instead.
6. **New Translation:** All user-facing text must be added to `src/i18n/copy.js` (both `ar` and `en`). Do not hardcode strings inside components.
7. **New Context:** If state needs to be shared across multiple pages/portals, create a context in `src/context/`.

## 🌍 Language & RTL

- **Translations:** All user-facing text must be added to `src/i18n/copy.js`. Do not hardcode strings inside components.
- **RTL Logic:** Any direction-aware UI (like arrows pointing left/right) should use the utilities provided in `src/utils/rtl.js` (e.g., `getArrow(lang)`). Avoid writing inline direction checks in JSX.

## ⚙️ Aliases

This project uses the `@/` alias to refer to the `src/` directory. For example:

```jsx
import { ROUTES } from '@/constants/routes';
```

This is configured in both `vite.config.js` (for the bundler) and `jsconfig.json` (for editor IntelliSense).

## 🔐 Environment Variables

_(No environment variables are required currently. Future variables like API base URLs should be documented here and placed in a `.env` file.)_

## 🧪 Available Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR   |
| `npm run build`   | Production build to `dist/`      |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run ESLint on `src/`             |
| `npm run format`  | Format code with Prettier        |

## 🧩 Architecture Overview

- **Courier Flow:** Login → Personal Info → Vehicle/Bank → Documents → Status → Contract → Dashboard
- **Courier Dashboard:** Operations, Attendance, Shipments (PPD/COD/Pickup), Profile
- **Supervisor Portal:** Dashboard → My Couriers / Request Review / Team Attendance + Operations / Attendance / Shipments (own)
- **HR Portal:** Hiring requests (Sanad → Absher → Contract) + Operations approvals
- **State Management:** React Context (`AuthContext`, `OnboardingContext`, `OperationsContext`, `LanguageContext`) + `localStorage` for language/role
- **Routing:** React Router DOM v7 with centralized route constants and role-based guards (`RequireRole`)

## 📚 Documentation

All project docs live in [`docs/`](./docs):

| File                        | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| `docs/BACKEND_ENDPOINTS.md` | All backend endpoints required by the current UI         |
| `docs/PROJECT_REVIEW.md`    | Comprehensive project review                             |
| `docs/AUDIT_REPORT.md`      | Security & architecture audit                            |
| `docs/ARCHITECTURE.md`      | Legacy architecture reference (partly outdated)          |
| `docs/IMPLEMENTATION_PLAN.md` / `docs/IMPLEMENTATION_DASHBOARD.md` | Original implementation plans |
| `docs/FRONTEND_PLAN.md`     | Original frontend plan                                   |

## 📋 Known TODOs / Technical Debt

- [ ] **Authentication:** Current login is a mock — no real auth, tokens, or session management. Routes are guarded client-side by role (`RequireRole`), but the backend must remain the authorization boundary.
- [ ] **API Layer:** `src/services/` is empty — no actual API calls. All data is mock/in-memory.
- [ ] **Form Validation:** Only HTML5 validation (`required`, `type`, `inputMode`). No schema validation (Zod/Yup) or server-side error handling.
- [ ] **File Uploads:** Document uploads only track state locally — no actual file upload to server.
- [ ] **Tests:** No test runner configured (Vitest/Jest/Playwright).
- [ ] **Contract Templates:** Current templates use placeholder Arabic text — needs legal review.
- [ ] **XSS Safety:** `fillTemplate` uses regex replacement — ensure it's never used with `dangerouslySetInnerHTML`.
- [ ] **localStorage Persistence:** Onboarding draft state is in-memory only (lost on refresh). Consider `sessionStorage`.
- [ ] **Audit Trail:** Supervisor/HR actions have no audit log in frontend (backend responsibility per `BACKEND_SANAD_ABSHER.md`).
