import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, View, TouchableOpacity, Alert, Text, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [senhaVisivel, setSenhaVisivel] = useState(true);
  const [email, setEmail] = useState('Admin');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('123');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const auth = useAuth();

  const validarEmail = (email: string) => {
    if (email.toLowerCase() === 'admin') {
      return true;
    }

    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const showError = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const showSuccess = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      showError('Erro', 'Preencha todos os campos');
      return;
    }

    if (!validarEmail(email)) {
      showError('Erro', 'Email inválido');
      return;
    }

    setLoading(true);
    try {
      await auth.login(email, senha);
      router.replace('/');
    } catch (error: any) {
      showError('Erro', error.message || 'Falha ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !nome || !senha || !confirmaSenha) {
      showError('Erro', 'Preencha todos os campos');
      return;
    }

    if (!validarEmail(email)) {
      showError('Erro', 'Email inválido');
      return;
    }

    if (senha !== confirmaSenha) {
      showError('Erro', 'As senhas não conferem');
      return;
    }

    if (senha.length < 6) {
      showError('Erro', 'Senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await auth.register(email, nome, senha);
      showSuccess('Sucesso', 'Conta criada com sucesso!');
      setIsLogin(true);
      setEmail('');
      setNome('');
      setSenha('');
      setConfirmaSenha('');
    } catch (error: any) {
      showError('Erro', error.message || 'Falha ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>BIBLIOTECA</Text>
        <Text style={styles.subtitle}>VIRTUAL</Text>
      </View>

      <View style={styles.formContainer}>
        {isLogin ? (
          <>
            <Text style={styles.formTitle}>Bem-vindo de volta!</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.senhaContainer}>
                <TextInput
                  placeholder="••••••••"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={senhaVisivel}
                  style={styles.inputSenha}
                  editable={!loading}
                />
                <TouchableOpacity 
                  onPress={() => setSenhaVisivel(!senhaVisivel)}
                  disabled={loading}
                >
                  <Text style={styles.iconoOlho}>{senhaVisivel ? "👁️" : "🙈"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.botao, loading && styles.botaoDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.botaoTexto}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity 
              style={styles.botaoSecundario}
              onPress={() => {
                setIsLogin(false);
                setEmail('');
                setSenha('');
              }}
              disabled={loading}
            >
              <Text style={styles.botaoSecundarioTexto}>Criar uma conta</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.formTitle}>Criar nova conta</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                placeholder="Seu nome"
                value={nome}
                onChangeText={setNome}
                style={styles.input}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.senhaContainer}>
                <TextInput
                  placeholder="••••••••"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={senhaVisivel}
                  style={styles.inputSenha}
                  editable={!loading}
                />
                <TouchableOpacity 
                  onPress={() => setSenhaVisivel(!senhaVisivel)}
                  disabled={loading}
                >
                  <Text style={styles.iconoOlho}>{senhaVisivel ? "👁️" : "🙈"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <View style={styles.senhaContainer}>
                <TextInput
                  placeholder="••••••••"
                  value={confirmaSenha}
                  onChangeText={setConfirmaSenha}
                  secureTextEntry={senhaVisivel}
                  style={styles.inputSenha}
                  editable={!loading}
                />
                <TouchableOpacity 
                  onPress={() => setSenhaVisivel(!senhaVisivel)}
                  disabled={loading}
                >
                  <Text style={styles.iconoOlho}>{senhaVisivel ? "👁️" : "🙈"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.botao, loading && styles.botaoDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.botaoTexto}>Criar Conta</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.botaoSecundario}
              onPress={() => {
                setIsLogin(true);
                setEmail('');
                setSenha('');
                setNome('');
                setConfirmaSenha('');
              }}
              disabled={loading}
            >
              <Text style={styles.botaoSecundarioTexto}>Já tenho uma conta</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity
        style={{
          marginTop: 20,
          marginHorizontal: 20,
          padding: 12,
          backgroundColor: "#555",
          borderRadius: 10,
          alignItems: "center"
        }}
        onPress={() => router.push('/diagnostico')}
      >
        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
          🔍 Diagnóstico de Conexão
        </Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1b4332',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#a7c957',
    letterSpacing: 3,
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1b4332',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1b4332',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 15,
    color: '#1b4332',
  },
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingRight: 12,
  },
  inputSenha: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#1b4332',
  },
  iconoOlho: {
    fontSize: 18,
  },
  botao: {
    width: '100%',
    backgroundColor: '#2d6a4f',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2d6a4f',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  botaoDisabled: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 14,
  },
  botaoSecundario: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#2d6a4f',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botaoSecundarioTexto: {
    color: '#2d6a4f',
    fontSize: 15,
    fontWeight: '700',
  },
});
