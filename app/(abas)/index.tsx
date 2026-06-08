import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Platform } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { API } from "../../constantes/api";

export default function Home() {
  const [livros, setLivros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const carregar = async () => {
    try {
      setLoading(true);
      console.log(`[HOME] Carregando livros de: ${API}/livros`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch(`${API}/livros`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      console.log(`[HOME] Status: ${res.status}`);
      
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }
      const data = await res.json();
      console.log(`[HOME] Livros carregados: ${data.length || 0}`);
      setLivros(data || []);
    } catch (error) {
      console.error("[HOME] Erro ao carregar:", error);
      const message = error instanceof Error ? error.message : 'Erro ao carregar livros';
      if (Platform.OS === 'web') {
        window.alert(`Erro: ${message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  const abrirDetalhes = (item: any) => {
    router.push({
      pathname: "/book-details",
      params: { book: JSON.stringify(item) },
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => abrirDetalhes(item)}
      style={{
        flex: 1,
        margin: 8,
        alignItems: "center",
      }}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: "100%",
          aspectRatio: 0.7,
          borderRadius: 12,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        {item.capa ? (
          <Image
            source={{ uri: item.capa }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#d0d0d0",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#999" }}>Sem capa</Text>
          </View>
        )}
      </View>

      <Text
        numberOfLines={2}
        style={{
          marginTop: 10,
          fontSize: 13,
          fontWeight: "600",
          color: "#1b4332",
          textAlign: "center",
        }}
      >
        {item.titulo}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: "#666",
          textAlign: "center",
          marginTop: 2,
        }}
      >
        {item.autor}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#e8f5e9",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#2d6a4f" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#e8f5e9" }}>
      <View style={{ paddingTop: 20, paddingHorizontal: 15 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: "#1b4332",
            marginBottom: 5,
          }}
        >
          Biblioteca
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#666",
            marginBottom: 15,
          }}
        >
          {livros.length} livros disponíveis
        </Text>
      </View>

      <FlatList
        data={livros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ paddingHorizontal: 8 }}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={{ fontSize: 16, color: "#999" }}>
              Nenhum livro cadastrado
            </Text>
            <Text style={{ fontSize: 14, color: "#ccc", marginTop: 10 }}>
              Vá para "Cadastrar" para adicionar um livro
            </Text>
          </View>
        }
      />
    </View>
  );
}