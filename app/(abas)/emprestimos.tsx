import { View, Text, FlatList, TouchableOpacity, Modal, Alert, Image, ActivityIndicator, Platform } from "react-native";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { API } from "../../constantes/api";

export default function Emprestimos() {
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalRating, setModalRating] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState<any>(null);
  const [rating, setRating] = useState(0);

  const carregar = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/emprestimos`);
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }
      const data = await res.json();
      setLista(data || []);
    } catch (error) {
      console.log("Erro ao carregar empréstimos:", error);
      const message = error instanceof Error ? error.message : 'Erro ao carregar empréstimos';
      if (Platform.OS === 'web') {
        window.alert(`Erro: ${message}`);
      } else {
        Alert.alert("Erro", message);
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

  const iniciarDevolucao = (item: any) => {
    setLivroSelecionado(item);
    setRating(0);
    setModalRating(true);
  };

  const confirmarDevolucao = async () => {
    if (rating === 0) {
      const errorMsg = "Por favor, selecione uma nota de 1 a 5.";
      if (Platform.OS === 'web') {
        window.alert(`Erro: ${errorMsg}`);
      } else {
        Alert.alert("Erro", errorMsg);
      }
      return;
    }

    try {
      const updateBookRes = await fetch(`${API}/livros/${livroSelecionado.livroId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emprestado: false })
      });

      if (!updateBookRes.ok) {
        throw new Error('Erro ao atualizar livro');
      }

      const updateLoanRes = await fetch(`${API}/emprestimos/${livroSelecionado.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "devolvido", rating })
      });

      if (!updateLoanRes.ok) {
        throw new Error('Erro ao atualizar empréstimo');
      }

      const successMsg = "Livro devolvido com sucesso!";
      if (Platform.OS === 'web') {
        window.alert(successMsg);
      } else {
        Alert.alert("Sucesso", successMsg);
      }
      setModalRating(false);
      setLivroSelecionado(null);
      setRating(0);
      carregar();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao devolver livro';
      console.log("Erro ao devolver:", error);
      if (Platform.OS === 'web') {
        window.alert(`Erro: ${message}`);
      } else {
        Alert.alert("Erro", message);
      }
    }
  };

  if (loading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator size="large" color="#2d6a4f" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#e8f5e9" }}>
      <View style={{ paddingTop: 20, paddingHorizontal: 20, paddingBottom: 10 }}>
        <Text style={{
          fontSize: 28,
          fontWeight: '800',
          color: '#1b4332',
          marginBottom: 5,
        }}>
          Meus Empréstimos
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginBottom: 10,
        }}>
          {lista.filter(l => l.status === 'emprestado').length} livros emprestados
        </Text>
      </View>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: "#fff",
            marginHorizontal: 15,
            marginBottom: 12,
            borderRadius: 12,
            overflow: 'hidden',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <View style={{ flexDirection: 'row', padding: 15 }}>
              {item.capa && (
                <Image
                  source={{ uri: item.capa }}
                  style={{
                    width: 70,
                    height: 110,
                    borderRadius: 8,
                    marginRight: 15,
                  }}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5, color: '#1b4332' }}>
                  {item.titulo}
                </Text>
                <Text style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
                  {item.autor}
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 6,
                    backgroundColor: item.status === "emprestado" ? '#fff3cd' : '#d4edda',
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: item.status === "emprestado" ? '#856404' : '#155724'
                    }}>
                      {item.status === "emprestado" ? '📖 Emprestado' : '✓ Devolvido'}
                    </Text>
                  </View>
                </View>
                {item.rating && (
                  <Text style={{ fontSize: 12, color: '#f39c12' }}>
                    ⭐ {item.rating}/5 estrelas
                  </Text>
                )}
              </View>
            </View>

            {item.status === "emprestado" && (
              <TouchableOpacity
                onPress={() => iniciarDevolucao(item)}
                style={{
                  backgroundColor: "#2d6a4f",
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: '600' }}>
                  Devolver Livro
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 80 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: "#1b4332", marginBottom: 10 }}>
              📚 Nenhum livro emprestado
            </Text>
            <Text style={{ fontSize: 14, color: "#999" }}>
              Você não possui livros emprestados no momento
            </Text>
          </View>
        }
      />

      <Modal visible={modalRating} animationType="fade" transparent>
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)"
        }}>
          <View style={{
            backgroundColor: "#fff",
            padding: 25,
            borderRadius: 16,
            width: "85%",
            maxWidth: 380,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: "800",
              marginBottom: 12,
              color: '#1b4332',
              textAlign: 'center',
            }}>
              Avalie o Livro
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
              marginBottom: 20,
              textAlign: 'center',
            }}>
              {livroSelecionado?.titulo}
            </Text>

            <View style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 25,
              gap: 12,
            }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ fontSize: 36 }}>
                    {star <= rating ? "⭐" : "☆"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  setModalRating(false);
                  setLivroSelecionado(null);
                }}
                style={{
                  flex: 1,
                  backgroundColor: "#f0f0f0",
                  paddingVertical: 12,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{
                  color: "#333",
                  fontWeight: "700",
                  fontSize: 15,
                }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmarDevolucao}
                disabled={rating === 0}
                style={{
                  flex: 1,
                  backgroundColor: rating === 0 ? "#ccc" : "#2d6a4f",
                  paddingVertical: 12,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: 15,
                }}>
                  Confirmar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}