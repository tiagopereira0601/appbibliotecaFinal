import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, Platform, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import safeAsyncStorage from "../../ganchos/useStorage"; // wrapper seguro para AsyncStorage

interface Post {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'noticia' | 'encontro';
  data: string;
  likes: number;
  curtido: boolean;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<'noticia' | 'encontro'>('noticia');
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    try {
      setLoading(true);
      const postsJson = await safeAsyncStorage.getItem('sebaPostos');
      if (postsJson) {
        setPosts(JSON.parse(postsJson));
      } else {
        // Posts padrão
        const postsDefault: Post[] = [
          {
            id: '1',
            titulo: 'Bem-vindo ao iBook 📚',
            descricao: 'Aqui você pode emprestar livros, cadastrar novos títulos e acompanhar suas leituras!',
            tipo: 'noticia',
            data: new Date().toISOString(),
            likes: 5,
            curtido: false
          },
          {
            id: '2',
            titulo: 'Encontro de Leitores',
            descricao: 'Junte-se a nós no próximo encontro para discutir os livros que você está lendo. Será um momento especial!',
            tipo: 'encontro',
            data: new Date(Date.now() - 86400000).toISOString(),
            likes: 3,
            curtido: false
          }
        ];
        setPosts(postsDefault);
        await safeAsyncStorage.setItem('sebaPostos', JSON.stringify(postsDefault));
      }
    } catch (error) {
      console.log("Erro ao carregar posts:", error);
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

  const postar = async () => {
    if (!titulo.trim()) {
      const msg = "Por favor, adicione um título";
      if (Platform.OS === 'web') {
        window.alert(`Erro: ${msg}`);
      } else {
        Alert.alert("Erro", msg);
      }
      return;
    }

    setSalvando(true);
    try {
      const novoPost: Post = {
        id: Date.now().toString(),
        titulo,
        descricao,
        tipo,
        data: new Date().toISOString(),
        likes: 0,
        curtido: false
      };

      const novosPosts = [novoPost, ...posts];
      setPosts(novosPosts);
      await safeAsyncStorage.setItem('sebaPostos', JSON.stringify(novosPosts));

      setTitulo("");
      setDescricao("");
      setTipo('noticia');
      setModalVisivel(false);

      const msg = "Post publicado com sucesso!";
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert("Sucesso", msg);
      }
    } catch (error) {
      const msg = "Erro ao publicar post";
      console.log(msg, error);
      if (Platform.OS === 'web') {
        window.alert(`Erro: ${msg}`);
      } else {
        Alert.alert("Erro", msg);
      }
    } finally {
      setSalvando(false);
    }
  };

  const curtir = async (postId: string) => {
    try {
      const postsAtualizados = posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            curtido: !p.curtido,
            likes: p.curtido ? p.likes - 1 : p.likes + 1
          };
        }
        return p;
      });
      setPosts(postsAtualizados);
      await safeAsyncStorage.setItem('sebaPostos', JSON.stringify(postsAtualizados));
    } catch (error) {
      console.log("Erro ao curtir:", error);
    }
  };

  const deletarPost = (postId: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Tem certeza que deseja deletar este post?");
      if (confirmed) {
        deletarConfirmado(postId);
      }
    } else {
      Alert.alert(
        "Deletar Post",
        "Tem certeza que deseja deletar este post?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Deletar",
            style: "destructive",
            onPress: () => deletarConfirmado(postId)
          }
        ]
      );
    }
  };

  const deletarConfirmado = async (postId: string) => {
    try {
      const postsAtualizados = posts.filter(p => p.id !== postId);
      setPosts(postsAtualizados);
      await safeAsyncStorage.setItem('sebaPostos', JSON.stringify(postsAtualizados));

      const msg = "Post deletado com sucesso!";
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert("Sucesso", msg);
      }
    } catch (error) {
      console.log("Erro ao deletar:", error);
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    const agora = new Date();
    const diferenca = agora.getTime() - data.getTime();
    const minutos = Math.floor(diferenca / 60000);
    const horas = Math.floor(diferenca / 3600000);
    const dias = Math.floor(diferenca / 86400000);

    if (minutos < 1) return "agora";
    if (minutos < 60) return `${minutos}m atrás`;
    if (horas < 24) return `${horas}h atrás`;
    if (dias < 7) return `${dias}d atrás`;
    return data.toLocaleDateString('pt-BR');
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
      {/* Header com botão novo post */}
      <View style={{
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{
            fontSize: 24,
            fontWeight: '800',
            color: '#1b4332',
          }}>
            Feed do Sebo
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisivel(true)}
            style={{
              backgroundColor: '#2d6a4f',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text style={{
              color: '#fff',
              fontWeight: '600',
              fontSize: 13,
            }}>
              + Novo
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de Posts */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: "#fff",
            marginHorizontal: 12,
            marginVertical: 8,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: '#e0e0e0',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
            elevation: 2
          }}>
            {/* Header do post */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 4,
                  gap: 8
                }}>
                  <View style={{
                    backgroundColor: item.tipo === 'noticia' ? '#e3f2fd' : '#f3e5f5',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}>
                    <Text style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: item.tipo === 'noticia' ? '#1976d2' : '#7b1fa2'
                    }}>
                      {item.tipo === 'noticia' ? 'NOTÍCIA' : 'ENCONTRO'}
                    </Text>
                  </View>
                  <Text style={{
                    fontSize: 12,
                    color: '#999',
                  }}>
                    {formatarData(item.data)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => deletarPost(item.id)}
                style={{
                  padding: 8,
                }}
              >
                <Text style={{
                  fontSize: 18,
                  color: '#d63031',
                }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {/* Título e descrição */}
            <Text style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#1b4332',
              marginBottom: 8,
            }}>
              {item.titulo}
            </Text>

            {item.descricao && (
              <Text style={{
                fontSize: 14,
                color: '#555',
                lineHeight: 20,
                marginBottom: 12,
              }}>
                {item.descricao}
              </Text>
            )}

            {/* Footer com like */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: '#f0f0f0',
            }}>
              <TouchableOpacity
                onPress={() => curtir(item.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                }}
              >
                <Text style={{
                  fontSize: 16,
                }}>
                  {item.curtido ? '❤️' : '🤍'}
                </Text>
                <Text style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: item.curtido ? '#d63031' : '#999',
                }}>
                  {item.likes}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={{ fontSize: 16, color: "#999", marginBottom: 10 }}>
              Nenhum post ainda
            </Text>
            <Text style={{ fontSize: 14, color: "#ccc" }}>
              Seja o primeiro a postar notícias!
            </Text>
          </View>
        }
      />

      {/* Modal para novo post */}
      <Modal visible={modalVisivel} animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#e8f5e9' }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 20 }}>
            {/* Header Modal */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 25,
            }}>
              <Text style={{
                fontSize: 22,
                fontWeight: '800',
                color: '#1b4332',
              }}>
                Novo Post
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisivel(false);
                  setTitulo("");
                  setDescricao("");
                  setTipo('noticia');
                }}
              >
                <Text style={{
                  fontSize: 24,
                  color: '#d63031',
                  fontWeight: 'bold',
                }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {/* Seleção de tipo */}
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#1b4332',
              marginBottom: 12,
            }}>
              Tipo de Post
            </Text>
            <View style={{
              flexDirection: 'row',
              gap: 10,
              marginBottom: 25,
            }}>
              <TouchableOpacity
                onPress={() => setTipo('noticia')}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  backgroundColor: tipo === 'noticia' ? '#2d6a4f' : '#fff',
                  borderWidth: 2,
                  borderColor: tipo === 'noticia' ? '#2d6a4f' : '#e0e0e0',
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontWeight: '600',
                  color: tipo === 'noticia' ? '#fff' : '#666',
                }}>
                  📰 Notícia
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTipo('encontro')}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  backgroundColor: tipo === 'encontro' ? '#2d6a4f' : '#fff',
                  borderWidth: 2,
                  borderColor: tipo === 'encontro' ? '#2d6a4f' : '#e0e0e0',
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontWeight: '600',
                  color: tipo === 'encontro' ? '#fff' : '#666',
                }}>
                  👥 Encontro
                </Text>
              </TouchableOpacity>
            </View>

            {/* Campo de título */}
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#1b4332',
              marginBottom: 8,
            }}>
              Título
            </Text>
            <TextInput
              placeholder="Título do post"
              value={titulo}
              onChangeText={setTitulo}
              editable={!salvando}
              maxLength={100}
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                paddingHorizontal: 15,
                paddingVertical: 12,
                fontSize: 15,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                marginBottom: 20,
              }}
            />

            {/* Campo de descrição */}
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#1b4332',
              marginBottom: 8,
            }}>
              Descrição (opcional)
            </Text>
            <TextInput
              placeholder="Descreva sua notícia ou encontro"
              value={descricao}
              onChangeText={setDescricao}
              editable={!salvando}
              multiline
              numberOfLines={6}
              maxLength={500}
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                paddingHorizontal: 15,
                paddingVertical: 12,
                fontSize: 15,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                marginBottom: 25,
                textAlignVertical: 'top',
              }}
            />

            {/* Botão publicar */}
            <TouchableOpacity
              onPress={postar}
              disabled={salvando}
              style={{
                backgroundColor: salvando ? '#999' : '#2d6a4f',
                paddingVertical: 14,
                borderRadius: 10,
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              {salvando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: '700',
                }}>
                  Publicar Post
                </Text>
              )}
            </TouchableOpacity>

            {/* Botão cancelar */}
            <TouchableOpacity
              onPress={() => {
                setModalVisivel(false);
                setTitulo("");
                setDescricao("");
                setTipo('noticia');
              }}
              disabled={salvando}
              style={{
                backgroundColor: '#f0f0f0',
                paddingVertical: 14,
                borderRadius: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{
                color: '#666',
                fontSize: 16,
                fontWeight: '700',
              }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
