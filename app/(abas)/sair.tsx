import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function Sair() {
  const router = useRouter();
  const auth = useAuth();

  const logoutConfirmed = async () => {
    try {
      await auth.logout();
      router.replace('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Falha ao fazer logout';
      if (Platform.OS === 'web') {
        window.alert(`Erro: ${errorMessage}`);
      } else {
        Alert.alert('Erro', errorMessage);
      }
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Você tem certeza que deseja sair?');
      if (confirmed) {
        logoutConfirmed();
      }
    } else {
      Alert.alert(
        'Confirmar',
        'Você tem certeza que deseja sair?',
        [
          {
            text: 'Cancelar',
            onPress: () => {},
            style: 'cancel'
          },
          {
            text: 'Sair',
            onPress: logoutConfirmed,
            style: 'destructive'
          }
        ]
      );
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e8f5e9',
      paddingHorizontal: 20,
    }}>
      <View style={{
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        width: '100%',
        maxWidth: 350,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
      }}>
        <Text style={{
          fontSize: 24,
          fontWeight: '800',
          color: '#1b4332',
          marginBottom: 20,
          textAlign: 'center',
        }}>
          Olá!
        </Text>

        <Text style={{
          fontSize: 16,
          color: '#666',
          marginBottom: 30,
          textAlign: 'center',
          lineHeight: 24,
        }}>
          Você está logado no sistema da Biblioteca Virtual.
        </Text>

        <TouchableOpacity 
          onPress={handleLogout}
          style={{
            width: '100%',
            backgroundColor: '#d63031',
            borderRadius: 12,
            paddingVertical: 15,
            alignItems: 'center',
            marginBottom: 12,
            shadowColor: '#d63031',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          <Text style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: '700',
          }}>
            Sair da Conta
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push('/')}
          style={{
            width: '100%',
            borderWidth: 2,
            borderColor: '#2d6a4f',
            borderRadius: 12,
            paddingVertical: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{
            color: '#2d6a4f',
            fontSize: 15,
            fontWeight: '700',
          }}>
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}