import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../app/context/AuthContext';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '123456789-abcdefgh.apps.googleusercontent.com', // Placeholder - use seu próprio
  offlineAccess: true,
  scopes: ['profile', 'email'],
});

export default function GoogleSignInButton() {
  const { googleSignIn } = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      await googleSignIn(userInfo.user);
      router.replace('/');
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('[GOOGLE] Sign-in cancelado pelo usuário');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('[GOOGLE] Sign-in já em progresso');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('[GOOGLE] Play Services não disponível');
      } else {
        console.error('[GOOGLE] Erro:', error.message);
      }
    }
  };

  // Only show on native platforms (Android/iOS)
  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <TouchableOpacity 
      style={styles.googleButton}
      onPress={handleGoogleSignIn}
      activeOpacity={0.7}
    >
      <MaterialIcons name="logo-google" size={20} color="#fff" />
      <Text style={styles.googleButtonText}>Entrar com Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DB4437',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
