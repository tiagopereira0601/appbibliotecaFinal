import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { API } from "../../constantes/api";

export default function Gerenciar() {
  const [livros, setLivros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [livroEmEdicao, setLivroEmEdicao] = useState<any>(null);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [capa, setCapa] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/books`);
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }
      const data = await res.json();
      setLivros(data || []);
    } catch (error) {
      console.log("Erro ao carregar:", error);
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

  const escolherImagem = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 1
      });

      if (!result.canceled) {
        setCapa(result.assets[0].uri);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao selecionar imagem';
      if (Platform.OS === 'web') {
        window.alert(`Erro: ${message}`);
      } else {
        Alert.alert("Erro", message);
      }
    }
  };

  const abrirEdicao = (item: any) => {
    setLivroEmEdicao(item);
    setTitulo(item.titulo);
    setAutor(item.autor);
    setSinopse(item.sinopse);
    setCapa(item.capa);
    setModalVisivel(true);
  };

  const salvarEdicao = async () => {
    if (!titulo || !autor || !sinopse) {
      const errorMsg = "Preencha todos os campos";
      if (Platform.OS === 'web') {
        window.alert(`Erro: ${errorMsg}`);
      } else {
        Alert.alert("Erro", errorMsg);
      }
      return;
    }

    setSalvando(true);
    try {
      const response = await fetch(`${API}/books/${livroEmEdicao.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          autor,
          sinopse,
          capa
        })
      });

      if (response.ok) {
        const successMsg = "Livro atualizado com sucesso!";
        if (Platform.OS === 'web') {
          window.alert(successMsg);
        } else {
          Alert.alert("Sucesso", successMsg);
        }
        setModalVisivel(false);
        setLivroEmEdicao(null);
        setTitulo("");
        setAutor("");
        setSinopse("");
        setCapa("");
        carregar();
      } else {
        let errorMessage = 'Falha ao atualizar livro';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao atualizar livro';
      console.log("Erro ao salvar:", error);
      if (Platform.OS === 'web') {
        window.alert(`Erro: ${message}`);
      } else {
        Alert.alert("Erro", message);
      }
    } finally {
      setSalvando(false);
    }
  };

  const remover = async (id: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Tem certeza que deseja remover este livro?");
      if (confirmed) {
        removerConfirmado(id);
      }
    } else {
      Alert.alert(
        "Remover Livro",
        "Tem certeza que deseja remover este livro?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Remover",
            style: "destructive",
            onPress: () => removerConfirmado(id)
          }
        ]
      );
    }
  };

  const removerConfirmado = async (id: string) => {
    try {
      const response = await fetch(`${API}/books/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error('Falha ao remover livro');
      }
      const successMsg = "Livro removido com sucesso!";
      if (Platform.OS === 'web') {
        window.alert(successMsg);
      } else {
        Alert.alert("Sucesso", successMsg);
      }
      carregar();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao remover livro';
      console.log("Erro ao remover:", error);
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
          Gerenciar Livros
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginBottom: 10,
        }}>
          {livros.length} livros cadastrados
        </Text>
      </View>

      <FlatList
        data={livros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: "#fff",
            padding: 15,
            marginHorizontal: 15,
            marginBottom: 12,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <View style={{ flexDirection: 'row', gap: 15, marginBottom: 12 }}>
              {item.capa && (
                <Image
                  source={{ uri: item.capa }}
                  style={{
                    width: 60,
                    height: 90,
                    borderRadius: 6,
                  }}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 3, color: '#1b4332' }}>
                  {item.titulo}
                </Text>
                <Text style={{ fontSize: 13, color: "#666", marginBottom: 5 }}>
                  {item.autor}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: item.emprestado ? '#d63031' : '#27ae60',
                  fontWeight: '600'
                }}>
                  {item.emprestado ? 'Emprestado' : 'Disponível'}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity 
                onPress={() => abrirEdicao(item)}
                style={{
                  backgroundColor: "#2d6a4f",
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderRadius: 8,
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: '600' }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => remover(item.id)}
                style={{
                  backgroundColor: "#d63031",
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderRadius: 8,
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: '600' }}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={{ fontSize: 16, color: "#999" }}>Nenhum livro cadastrado</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal visible={modalVisivel} animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#e8f5e9' }}>
          <View style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 }}>
            <TouchableOpacity
              onPress={() => {
                setModalVisivel(false);
                setLivroEmEdicao(null);
              }}
            >
              <Text style={{ fontSize: 18, color: "#2d6a4f", fontWeight: '600' }}>← Voltar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={{
              fontSize: 24,
              fontWeight: '800',
              color: '#1b4332',
              marginBottom: 25,
            }}>
              Editar Livro
            </Text>

            {capa && (
              <View style={{ marginBottom: 20, alignItems: 'center' }}>
                <Image
                  source={{ uri: capa }}
                  style={{
                    width: 120,
                    height: 180,
                    borderRadius: 10,
                  }}
                />
              </View>
            )}

            <TouchableOpacity
              onPress={escolherImagem}
              style={{
                backgroundColor: '#2d6a4f',
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 10,
                marginBottom: 20,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Mudar Capa</Text>
            </TouchableOpacity>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1b4332', marginBottom: 8 }}>
                Título
              </Text>
              <TextInput
                value={titulo}
                onChangeText={setTitulo}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  paddingVertical: 12,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
                }}
                editable={!salvando}
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1b4332', marginBottom: 8 }}>
                Autor
              </Text>
              <TextInput
                value={autor}
                onChangeText={setAutor}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  paddingVertical: 12,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
                }}
                editable={!salvando}
              />
            </View>

            <View style={{ marginBottom: 25 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1b4332', marginBottom: 8 }}>
                Sinopse
              </Text>
              <TextInput
                value={sinopse}
                onChangeText={setSinopse}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  paddingVertical: 12,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
                  minHeight: 120,
                  textAlignVertical: 'top',
                }}
                multiline
                numberOfLines={5}
                editable={!salvando}
              />
            </View>

            <TouchableOpacity
              onPress={salvarEdicao}
              disabled={salvando}
              style={{
                backgroundColor: '#2d6a4f',
                paddingVertical: 15,
                borderRadius: 10,
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              {salvando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                  Salvar Alterações
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setModalVisivel(false);
                setLivroEmEdicao(null);
              }}
              disabled={salvando}
              style={{
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: '#2d6a4f',
                paddingVertical: 12,
                borderRadius: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#2d6a4f', fontSize: 15, fontWeight: '700' }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}