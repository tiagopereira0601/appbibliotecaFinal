import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../../constantes/apiClient";
import safeAsyncStorage from "../../ganchos/useStorage";

interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role?: string;
  createdAt?: string;
}

const LOCAL_USERS_KEY = 'local_users';

const getLocalUsers = async (): Promise<User[]> => {
  try {
    const stored = await safeAsyncStorage.getItem(LOCAL_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('[AUTH] Falha ao ler usuários locais:', error);
    return [];
  }
};

const saveLocalUsers = async (users: User[]) => {
  try {
    await safeAsyncStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.warn('[AUTH] Falha ao salvar usuários locais:', error);
  }
};

interface AuthContextType {
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: (googleUser: any) => Promise<void>;
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
      // Fixed local accounts for admin and visitante
      if ((email === 'admin' && password === 'admin123') || (email === 'admin@local' && password === 'admin123')) {
        const adminUser: User = { id: 'admin', email: 'admin', name: 'Admin', role: 'admin', createdAt: new Date().toISOString() };
        setUser(adminUser);
        await safeAsyncStorage.setItem('user', JSON.stringify(adminUser));
        console.log('[AUTH] Login efetuado com conta fixa: admin');
        return;
      }

      if ((email === 'visitante' && password === 'visitante123') || (email === 'visitante@local' && password === 'visitante123')) {
        const visitanteUser: User = { id: 'visitante', email: 'visitante', name: 'Visitante', role: 'visitor', createdAt: new Date().toISOString() };
        setUser(visitanteUser);
        await safeAsyncStorage.setItem('user', JSON.stringify(visitanteUser));
        console.log('[AUTH] Login efetuado com conta fixa: visitante');
        return;
      }

      let users: User[] = [];
      let backendError: Error | null = null;

      try {
        const response = await api.get('/users');
        users = response.data;
      } catch (error: any) {
        backendError = error;
        console.warn('[AUTH] Backend indisponível, usando usuários locais se houver:', error.message || error);
        users = await getLocalUsers();
      }

      const foundUser = users.find(u => u.email === email && u.password === password);

      if (!foundUser) {
        if (backendError && users.length === 0) {
          throw new Error('Servidor indisponível e nenhuma conta local encontrada');
        }
        throw new Error('Email ou senha inválidos');
      }

      const userToStore = { ...foundUser };
      delete userToStore.password;

      setUser(userToStore);
      await safeAsyncStorage.setItem('user', JSON.stringify(userToStore));
      console.log(`[AUTH] Login bem-sucedido para ${email}`);
    } catch (error: any) {
      console.error('[AUTH] Erro no login:', error?.message || error);
      throw error;
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      console.log(`[AUTH] Tentando registrar usuário: ${email}`);

      if (password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }

      let users: User[] = [];
      let backendError: Error | null = null;
      let backendAvailable = true;

      try {
        const response = await api.get('/users');
        users = response.data;
      } catch (error: any) {
        backendError = error;
        backendAvailable = false;
        console.warn('[AUTH] Backend indisponível ao registrar, usando usuários locais:', error.message || error);
        users = await getLocalUsers();
      }
      
      if (users.some(u => u.email === email)) {
        throw new Error('Email já cadastrado');
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        password,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      let savedUser = newUser;
      if (backendAvailable) {
        try {
          const createResponse = await api.post('/users', newUser);
          savedUser = createResponse.data;
        } catch (error: any) {
          console.warn('[AUTH] Falha ao criar usuário no backend, salvando localmente:', error?.message || error);
          users.push(newUser);
          await saveLocalUsers(users);
        }
      } else {
        users.push(newUser);
        await saveLocalUsers(users);
      }

      const userToStore = { ...savedUser };
      delete userToStore.password;

      setUser(userToStore);
      await safeAsyncStorage.setItem('user', JSON.stringify(userToStore));
      console.log(`[AUTH] Usuário registrado com sucesso: ${email}`);
    } catch (error: any) {
      console.error('[AUTH] Erro no registro:', error?.message || error);
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

  const googleSignIn = async (googleUser: any) => {
    try {
      console.log(`[AUTH] Tentando Google Sign-In para: ${googleUser.email}`);

      let users: User[] = [];
      let backendAvailable = true;

      try {
        const response = await api.get('/users');
        users = response.data;
      } catch (error: any) {
        backendAvailable = false;
        console.warn('[AUTH] Backend indisponível no Google Sign-In, usando usuários locais:', error.message || error);
        users = await getLocalUsers();
      }
      
      let foundUser = users.find(u => u.email === googleUser.email);

      if (!foundUser) {
        const newUser: User = {
          id: googleUser.id || Date.now().toString(),
          email: googleUser.email,
          name: googleUser.name || googleUser.givenName || 'Google User',
          role: 'user',
          createdAt: new Date().toISOString(),
        };

        if (backendAvailable) {
          try {
            const createResponse = await api.post('/users', newUser);
            foundUser = createResponse.data;
            console.log(`[AUTH] Novo usuário criado via Google no backend: ${googleUser.email}`);
          } catch (error: any) {
            console.warn('[AUTH] Falha ao criar usuário via Google no backend, salvando localmente:', error.message || error);
            users.push(newUser);
            await saveLocalUsers(users);
            foundUser = newUser;
          }
        } else {
          users.push(newUser);
          await saveLocalUsers(users);
          foundUser = newUser;
          console.log(`[AUTH] Novo usuário criado localmente via Google: ${googleUser.email}`);
        }
      } else {
        console.log(`[AUTH] Usuário existente encontrado via Google: ${googleUser.email}`);
      }

      const userToStore = { ...foundUser };
      delete userToStore.password;

      setUser(userToStore);
      await safeAsyncStorage.setItem('user', JSON.stringify(userToStore));
      console.log(`[AUTH] Google Sign-In bem-sucedido para ${googleUser.email}`);
    } catch (error: any) {
      console.error('[AUTH] Erro no Google Sign-In:', error?.message || error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoading, user, login, register, logout, googleSignIn }}>
      {children}
    </AuthContext.Provider>
  );
}