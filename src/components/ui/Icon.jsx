/**
 * Central SVG icon set (outline style, 24x24 viewBox).
 *
 * Every icon inherits `currentColor` so colour is controlled by CSS.
 * Add new icons to PATHS and they become available via <Icon name="..." />.
 *
 * Props:
 *   name {string}   - key from PATHS
 *   size {number}   - rendered width/height in px (default 24)
 *   strokeWidth {number} - outline thickness (default 1.8)
 */

const PATHS = {
  // Bottom navigation
  profile: (
    <>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </>
  ),
  attendance: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  operations: (
    <>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-2.9l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 10 4.6V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.5l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 21 10h.1a2 2 0 0 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),

  // Quick actions
  vehicleCompensation: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 12.5l2 2 4-4.5" />
    </>
  ),
  financialAdvance: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M6 9.5v5M18 9.5v5" />
    </>
  ),
  accidentReport: (
    <>
      <path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
  cancelCompensation: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="m3 3 18 18" />
    </>
  ),

  // Cards
  supervisor: (
    <>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </>
  ),
  vehicle: (
    <>
      <path d="M3 17V9a2 2 0 0 1 2-2h9l4 4h1a2 2 0 0 1 2 2v4" />
      <path d="M3 17h2M19 17h2" />
      <path d="M7.5 19.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM16.5 19.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </>
  ),
  phone: (
    <>
      <path d="M15.7 21a15.9 15.9 0 0 1-12.7-12.7 2 2 0 0 1 2-2.3h2.7a1.4 1.4 0 0 1 1.4 1.2c.1.9.3 1.7.6 2.5a1.4 1.4 0 0 1-.3 1.5l-1.1 1.1a12.6 12.6 0 0 0 4.9 4.9l1.1-1.1a1.4 1.4 0 0 1 1.5-.3c.8.3 1.6.5 2.5.6a1.4 1.4 0 0 1 1.2 1.4V19a2 2 0 0 1-2.3 2Z" />
    </>
  ),
  chat: (
    <>
      <path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.3-4.3A8 8 0 1 1 21 12Z" />
    </>
  ),

  // Header
  bell: (
    <>
      <path d="M18 8a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7" />
      <path d="M10.3 20a2 2 0 0 0 3.4 0" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </>
  ),
  check: <path d="m4 12.5 5 5L20 6.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="m18 6-12 12M6 6l12 12" />,
  maintenance: (
    <>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </>
  ),
  leave: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  fuelCard: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 15h10M3 10h18" />
    </>
  ),
  zone: (
    <>
      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  uniform: (
    <>
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </>
  ),

  package: (
    <>
      <path d="M21 8v8a2 2 0 0 1-1 1.7l-7 3.9a2 2 0 0 1-2 0l-7-3.9A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.7l7-3.9a2 2 0 0 1 2 0l7 3.9A2 2 0 0 1 21 8Z" />
      <path d="m3.3 7 8.7 4.9L20.7 7M12 21.5V12" />
    </>
  ),

  // Status & actions
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 9l5-5 5 5M12 4v12" />
    </>
  ),
  location: (
    <>
      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),

  building: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </>
  ),

  // Review & approval
  badgeCheck: (
    <>
      <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),

  // Documents
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
    </>
  ),
  idCard: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8" cy="11" r="2" />
      <path d="M5 16.5a3.5 3.5 0 0 1 6 0M15 10h4M15 14h4" />
    </>
  ),
  passport: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="10" r="3.2" />
      <path d="M9 17h6" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </>
  ),
};

export default function Icon({ name, size = 24, strokeWidth = 1.8, ...rest }) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {path}
    </svg>
  );
}
