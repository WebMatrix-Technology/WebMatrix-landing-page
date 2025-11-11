import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createClient, User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export type AdminAuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isEmailAllowed: (email: string) => boolean;
  getAccessToken: () => Promise<string | null>;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const allowed = useMemo(() => {
    const raw = (import.meta.env.VITE_ADMIN_ALLOWLIST || '').trim();
    return raw ? raw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean) : [];
  }, []);

  // Sync Supabase auth state to React state
  useEffect(() => {
    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      if (u && allowed.length > 0 && !allowed.includes((u.email || '').toLowerCase())) {
        // Not allowed → sign out immediately
        supabase.auth.signOut();
        setUser(null);
        setIsAuthenticated(false);
      } else {
        setUser(u);
        setIsAuthenticated(!!u);
      }
    });
    // Subscribe to changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      if (u && allowed.length > 0 && !allowed.includes((u.email || '').toLowerCase())) {
        supabase.auth.signOut();
        setUser(null);
        setIsAuthenticated(false);
      } else {
        setUser(u);
        setIsAuthenticated(!!u);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [allowed]);

  const login = async (email: string, password: string) => {
    if (allowed.length > 0 && !allowed.includes(email.toLowerCase())) {
      return { error: 'This email is not allowed to access admin.' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (!data?.user) return { error: 'Invalid login.' };
    setUser(data.user);
    setIsAuthenticated(true);
    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      logout,
      isEmailAllowed: (email: string) => (allowed.length === 0 ? true : allowed.includes(email.toLowerCase())),
      getAccessToken: async () => {
        const { data } = await supabase.auth.getSession();
        return data.session?.access_token ?? null;
      },
    }),
    [isAuthenticated, user, allowed]
  );

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

