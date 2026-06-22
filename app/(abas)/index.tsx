import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao iBook! 📚</Text>
      <Text style={styles.subtitle}>Olá, {user?.name}!</Text>
      <Text style={styles.description}>
        Aqui você pode emprestar e avaliar livros
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#666",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#999",
  },
});
