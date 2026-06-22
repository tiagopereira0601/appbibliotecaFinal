import { Tabs } from "expo-router";
import { View, Text } from "react-native";

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#e8f5e9" }}>
      {/* Header com título */}
      <View style={{
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: "#1b4332",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <Text style={{
          fontSize: 22,
          fontWeight: "800",
          color: "#fff",
          letterSpacing: 2,
        }}>
          iBook 📚
        </Text>
      </View>

      {/* Navigation Tabs */}
      <Tabs screenOptions={{
        headerShown: false,
        tabBarPosition: 'top',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderBottomColor: '#e0e0e0',
          borderBottomWidth: 1,
          height: 60,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarActiveTintColor: '#2d6a4f',
        tabBarInactiveTintColor: '#999',
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Início",
            tabBarLabel: "Início",
          }}
        />
        <Tabs.Screen
          name="feed"
          options={{
            title: "Feed",
            tabBarLabel: "Feed",
          }}
        />
        <Tabs.Screen
          name="cadastro"
          options={{
            title: "Cadastrar",
            tabBarLabel: "Cadastrar",
          }}
        />
        <Tabs.Screen
          name="gerenciar"
          options={{
            title: "Gerenciar",
            tabBarLabel: "Gerenciar",
          }}
        />
        <Tabs.Screen
          name="emprestimos"
          options={{
            title: "Empréstimos",
            tabBarLabel: "Empréstimos",
          }}
        />
        <Tabs.Screen
          name="sair"
          options={{
            title: "Sair",
            tabBarLabel: "Sair",
          }}
        />
      </Tabs>
    </View>
  );
}