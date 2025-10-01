import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/menu';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const credentials = {
  admin: { username: 'admin', password: 'admin123', role: 'admin' as const },
  cashier: { username: 'cashier', password: 'cashier123', role: 'cashier' as const },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('tablepay_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const cred = Object.values(credentials).find(
      (c) => c.username === username && c.password === password
    );

    if (cred) {
      const userData = { username: cred.username, role: cred.role };
      setUser(userData);
      localStorage.setItem('tablepay_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tablepay_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
