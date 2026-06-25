import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Wrapper seguro para AsyncStorage que funciona
 * mesmo se o módulo nativo não estiver disponível
 */
const safeAsyncStorage = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn(`[STORAGE] Erro ao ler ${key}:`, error);
      return null;
    }
  },
  
  setItem: async (key: string, value: string) => {
    try {
      return await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.warn(`[STORAGE] Erro ao salvar ${key}:`, error);
      return null;
    }
  },
  
  removeItem: async (key: string) => {
    try {
      return await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn(`[STORAGE] Erro ao remover ${key}:`, error);
      return null;
    }
  },
  
  multiGet: async (keys: string[]) => {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.warn(`[STORAGE] Erro ao ler múltiplas chaves:`, error);
      return keys.map(k => [k, null]);
    }
  },
  removeItem: async (key: string) => {
    try {
      return await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn(`[STORAGE] Erro ao remover ${key}:`, error);
      return null;
    }
  },
  clear: async () => {
    try {
      return await AsyncStorage.clear();
    } catch (error) {
      console.warn('[STORAGE] Erro ao limpar AsyncStorage:', error);
      return null;
    }
  },
};

export default safeAsyncStorage;
