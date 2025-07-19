
import { useState, createContext, useContext, ReactNode, ReactElement, useEffect } from 'react';
import { login as apiLogin, getMe } from './api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  token: string | null;
  user: any | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): ReactElement {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 👈 ban đầu loading


  useEffect(() => {
    const storedToken = localStorage.getItem('auth-token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);

      getMe(storedToken)
        .then((res) => {
          if (res.code === 0) setUser(res.data);
        })
        .catch(() => logout())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false); // 👈 kết thúc load
    }
  }, []);

  const login = async (username: string, password: string) => {
    const result = await apiLogin(username, password);

    if (result.code === 0) {
      setIsAuthenticated(true);
      setToken(result.data.accessToken);
      localStorage.setItem('auth-token', result.data.accessToken);

      // 👇 Call /me
      getMe(result.data.accessToken)
        .then((res) => {
          if (res.code === 0) setUser(res.data);
        })
        .catch(() => logout());

      
    }

    return result;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('auth-token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 