import React, { createContext, useContext, useMemo, useState } from 'react';

type AdminAuthContextType = {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'admin_auth';
const DEFAULT_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const value = useMemo<AdminAuthContextType>(() => ({
    isAuthenticated,
    login: (password: string) => {
      const ok = password === String(DEFAULT_PASSWORD);
      if (ok) {
        localStorage.setItem(STORAGE_KEY, '1');
        setIsAuthenticated(true);
      }
      return ok;
    },
    logout: () => {
      localStorage.removeItem(STORAGE_KEY);
      setIsAuthenticated(false);
    }
  }), [isAuthenticated]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};

