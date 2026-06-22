import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "../context/AuthContext";

export default function TabLayout() {
  const { logout, user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        headerShown: true,
        headerRight: () => (
          <MaterialIcons
            name="logout"
            size={24}
            color="#007AFF"
            onPress={logout}
            style={{ marginRight: 16 }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "iBook",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Buscar",
          tabBarLabel: "Buscar",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
