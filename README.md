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
│   ├── shared/      # Components used across multiple pages (e.g., AppHeader, FormActions)
│   └── ui/          # Small, dumb/pure components (e.g., BrandLogo, LanguageButton)
├── constants/       # Fixed values and configuration (e.g., routes.js for paths)
├── hooks/           # Custom React hooks (e.g., useAuth, useForm)
├── i18n/            # Translations (copy.js) and the LanguageContext
├── layouts/         # Layout wrappers that contain sub-routes (e.g., OnboardingLayout)
├── pages/           # Page-level components, grouped by folder (e.g., pages/Login/index.jsx)
├── services/        # API calls grouped by resource (e.g., api/auth.js, api/courier.js)
├── styles/          # Global CSS, CSS variables, and layout-specific styles
├── utils/           # Pure helper functions (e.g., rtl.js, formatting, validation)
├── App.jsx          # Main routing and entry component
└── main.jsx         # React DOM mount point
```

## 🛠️ Rules for Adding New Features

1. **New Page:** Create a new folder inside `src/pages/` (e.g., `src/pages/Dashboard/`) and place the main logic inside `index.jsx`. Local sub-components that are only used in this page can go in the same folder.
2. **New Reusable UI:** If it's a generic UI element (like a custom Input or Card), put it in `src/components/ui/`.
3. **New Shared Component:** If it's a larger component used by 2 or more distinct pages, put it in `src/components/shared/`.
4. **New API Call:** Do not use `fetch` or `axios` inline inside components. Create a service file in `src/services/` and import the function from there.
5. **New Route:** Always add the route path string to `src/constants/routes.js`. Never hardcode `navigate('/path')` inside components. Use `navigate(ROUTES.PATH)` instead.

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

## 📋 Known TODOs / Technical Debt

The following strings are currently hardcoded in the components and should be moved to `i18n/copy.js` in a future cleanup pass:

- `"Step ${n} of 3"` / `"الخطوة ${n} من 3"` (in `OnboardingLayout`)
- `"© 2026 MSG Logistics · All rights reserved"` (in `Login`)
- `"PDF or image"` (in `Documents`)
- `"MSG LOGISTICS"` (in `CourierStatus`)
- `APP-2026-1043` (Mock application number in `CourierStatus`)
