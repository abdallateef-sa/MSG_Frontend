/* ============================================================================
 * ⚠️  MOCK DATA — TEMPORARY (DEMO_USERS)
 * هويات وهمية للأدوار الثلاثة. تُحذف عند ربط المصادقة الحقيقية بالباك إند.
 * ========================================================================== */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'msg-role';

export const ROLES = {
  COURIER: 'courier',
  SUPERVISOR: 'supervisor',
  HR: 'hr',
};

// ⚠️ MOCK DATA — delete when the backend is connected.
const DEMO_USERS = {
  [ROLES.COURIER]: {
    id: 'courier',
    role: ROLES.COURIER,
    name: 'المندوب',
    supervisorId: 'sup-khaled',
  },
  [ROLES.SUPERVISOR]: {
    id: 'sup-khaled',
    role: ROLES.SUPERVISOR,
    name: 'خالد عبدالله',
    supervisorId: 'sup-khaled',
  },
  [ROLES.HR]: {
    id: 'hr',
    role: ROLES.HR,
    name: 'موارد بشرية',
    supervisorId: null,
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return DEMO_USERS[saved] || DEMO_USERS[ROLES.COURIER];
  });

  const login = (role) => {
    localStorage.setItem(STORAGE_KEY, role);
    setUser(DEMO_USERS[role] || DEMO_USERS[ROLES.COURIER]);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
