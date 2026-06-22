import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect based on auth state is handled in _layout.tsx
    router.replace("/(abas)");
  }, []);

  return null;
}
