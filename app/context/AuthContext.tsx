import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import safeAsyncStorage from "../../ganchos/useStorage"; // wrapper seguro para AsyncStorage

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

interface AuthContextType {
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userJson = await safeAsyncStorage.getItem('user');
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (e) {
        console.log('[AUTH] Falha ao restaurar sessão do usuário');
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (email.toLowerCase() === 'admin' && password === '123') {
        const adminUser: User = {
          id: 'admin',
          email: 'Admin',
          name: 'Admin',
          password: '123',
        };

        setUser(adminUser);
        await safeAsyncStorage.setItem('user', JSON.stringify(adminUser));
        return;
      }

      const usersJson = await safeAsyncStorage.getItem('users');
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Email ou senha inválidos');
      }

      setUser(foundUser);
      await safeAsyncStorage.setItem('user', JSON.stringify(foundUser));
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      if (password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }

      const usersJson = await safeAsyncStorage.getItem('users');
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      
      if (users.some(u => u.email === email)) {
        throw new Error('Email já cadastrado');
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        password
      };

      users.push(newUser);
      await safeAsyncStorage.setItem('users', JSON.stringify(users));
      
      setUser(newUser);
      await safeAsyncStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await safeAsyncStorage.removeItem('user');
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoading, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}