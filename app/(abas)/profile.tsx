import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{user?.name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Tipo de Conta</Text>
        <Text style={styles.value}>{user?.role || "user"}</Text>
      </View>

      {user?.createdAt && (
        <View style={styles.card}>
          <Text style={styles.label}>Membro desde</Text>
          <Text style={styles.value}>
            {new Date(user.createdAt).toLocaleDateString("pt-BR")}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
