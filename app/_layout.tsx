import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function RootLayoutNav() {
  const auth = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (auth.isLoading) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'splash' || segments[0] === 'diagnostico';

    if (!auth.user && !inAuthGroup) {
      // User is not signed in and not in auth group, go to login
      router.replace('/login');
    } else if (auth.user && inAuthGroup) {
      // User is signed in and in auth group, go to home
      router.replace('/');

    }
  }, [auth.isLoading, auth.user, segments]);

  if (auth.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2d6a4f" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="login" />
      <Stack.Screen name="diagnostico" />
      <Stack.Screen name="(abas)" />
      <Stack.Screen name="book-details" />
      <Stack.Screen name="modal" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}