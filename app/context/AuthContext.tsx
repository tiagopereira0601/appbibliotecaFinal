import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import safeAsyncStorage from "../../ganchos/useStorage";
import { api } from "../../constantes/apiClient";

interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role?: string;
  createdAt?: string;
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
        // Try to restore session from local storage first
        const userJson = await safeAsyncStorage.getItem('user');
        if (userJson) {
          setUser(JSON.parse(userJson));
          console.log('[AUTH] Sessão restaurada do armazenamento local');
        }
      } catch (e) {
        console.error('[AUTH] Erro ao restaurar sessão:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log(`[AUTH] Tentando login com email: ${email}`);
      
      // Fetch users from backend
      const response = await api.get('/users');
      const users: User[] = response.data;
      
      // Find user by email and password
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Email ou senha inválidos');
      }

      // Remove password from user object before storing locally
      const userToStore = { ...foundUser };
      delete userToStore.password;

      setUser(userToStore);
      await safeAsyncStorage.setItem('user', JSON.stringify(userToStore));
      console.log(`[AUTH] Login bem-sucedido para ${email}`);
    } catch (error: any) {
      console.error('[AUTH] Erro no login:', error.message);
      throw error;
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      console.log(`[AUTH] Tentando registrar usuário: ${email}`);

      if (password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }

      // Fetch existing users
      const response = await api.get('/users');
      const users: User[] = response.data;
      
      if (users.some(u => u.email === email)) {
        throw new Error('Email já cadastrado');
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        password,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      // Save to backend
      const createResponse = await api.post('/users', newUser);
      const savedUser = createResponse.data;

      // Remove password before storing locally
      const userToStore = { ...savedUser };
      delete userToStore.password;

      setUser(userToStore);
      await safeAsyncStorage.setItem('user', JSON.stringify(userToStore));
      console.log(`[AUTH] Usuário registrado com sucesso: ${email}`);
    } catch (error: any) {
      console.error('[AUTH] Erro no registro:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await safeAsyncStorage.removeItem('user');
      console.log('[AUTH] Logout bem-sucedido');
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