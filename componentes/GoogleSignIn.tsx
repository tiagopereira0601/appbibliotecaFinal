import { useRouter } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../app/context/AuthContext';

// For native: React Native Google Sign-In
let GoogleSignin: any = null;
let statusCodes: any = null;

if (Platform.OS !== 'web') {
  try {
    const googleSignInModule = require('@react-native-google-signin/google-signin');
    GoogleSignin = googleSignInModule.GoogleSignin;
    statusCodes = googleSignInModule.statusCodes;
    
    // Configure Google Sign-In for native platforms
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '123456789-abcdefgh.apps.googleusercontent.com',
      offlineAccess: true,
      scopes: ['profile', 'email'],
    });
  } catch (e) {
    console.log('[GOOGLE] GoogleSignin not available');
  }
}

export default function GoogleSignInButton() {
  const { googleSignIn } = useAuth();
  const router = useRouter();

  const handleGoogleSignInNative = async () => {
    try {
      if (!GoogleSignin) throw new Error('Google Sign-In not available');
      
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      await googleSignIn(userInfo.user);
      router.replace('/');
    } catch (error: any) {
      if (error.code === statusCodes?.SIGN_IN_CANCELLED) {
        console.log('[GOOGLE] Sign-in cancelado pelo usuário');
      } else if (error.code === statusCodes?.IN_PROGRESS) {
        console.log('[GOOGLE] Sign-in já em progresso');
      } else if (error.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('[GOOGLE] Play Services não disponível');
      } else {
        console.error('[GOOGLE] Erro:', error.message);
      }
    }
  };

  // For Web: Use Google OAuth window
  if (Platform.OS === 'web') {
    const handleGoogleSignInWeb = async () => {
      try {
        // On web, open Google OAuth in a new window
        const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        const scope = 'profile email';
        const responseType = 'code';
        
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${clientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `response_type=${responseType}&` +
          `scope=${encodeURIComponent(scope)}`;
        
        // Open in new window
        window.open(googleAuthUrl, 'Google Sign-In', 'width=500,height=600');
        console.log('[GOOGLE] Opened Google Sign-In window');
      } catch (error: any) {
        console.error('[GOOGLE] Erro no web sign-in:', error.message);
      }
    };

    // Fallback for development / demo: prompt for an email and name and sign in locally
    const handleGoogleSignInWebFallback = async () => {
      try {
        const useFallback = window.confirm('Usar login de teste (prompt) em vez do OAuth?');
        if (!useFallback) return handleGoogleSignInWeb();

        const email = window.prompt('Email de teste (ex: aluno@exemplo.com)') || '';
        const name = window.prompt('Nome (ex: Aluno Teste)') || '';
        if (!email) {
          window.alert('Email é obrigatório para login de teste');
          return;
        }

        await googleSignIn({ email, name, id: email });
        router.replace('/');
      } catch (error: any) {
        console.error('[GOOGLE] Erro no fallback web sign-in:', error.message);
      }
    };

    return (
      <TouchableOpacity 
        style={styles.googleButton}
        onPress={handleGoogleSignInWebFallback}
        activeOpacity={0.7}
      >
        <Text style={styles.googleButtonText}>Entrar com Google</Text>
      </TouchableOpacity>
    );
  }

  // For Native: Use React Native button
  return (
    <TouchableOpacity 
      style={styles.googleButton}
      onPress={handleGoogleSignInNative}
      activeOpacity={0.7}
    >
      <Text style={styles.googleButtonEmoji}>Google</Text>
      <Text style={styles.googleButtonText}>Entrar com Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dadce0',
  },
  googleButtonEmoji: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3c4043',
    marginRight: 10,
    letterSpacing: 0.25,
  },
  googleButtonText: {
    color: '#3c4043',
    fontSize: 16,
    fontWeight: '500',
  },
});
