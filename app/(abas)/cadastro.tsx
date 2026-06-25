import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { API } from "../../constantes/api";

export default function Cadastro() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [capa, setCapa] = useState("");
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  const escolherImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1
    });

    if (!result.canceled) {
      setCapa(result.assets[0].uri);
    }
  };

  const goToHome = () => {
    setTitulo("");
    setAutor("");
    setSinopse("");
    setCapa("");
    router.replace("/");
  };

  const salvar = async () => {
    // validação
    if (!titulo || !autor || !sinopse) {
      if (Platform.OS === 'web') {
        window.alert("Erro: Preencha título, autor e sinopse");
      } else {
        Alert.alert("Erro", "Preencha todos os campos");
      }
      return;
    }

    setCarregando(true);

    try {
      const payload = { titulo, autor, sinopse, capa, emprestado: false };

      const tryPost = async (path: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        try {
          console.log(`[CADASTRO] POST ${API}/${path}`);
          const res = await fetch(`${API}/${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });
          return res;
        } finally {
          clearTimeout(timeoutId);
        }
      };

      let res = null as Response | null;
      try {
        res = await tryPost('books');
      } catch (err) {
        console.warn('[CADASTRO] Falha ao postar em /books, tentando /livros', err);
        try {
          res = await tryPost('livros');
        } catch (err2) {
          console.error('[CADASTRO] Falha em ambos endpoints:', err2);
          throw new Error('Servidor indisponível (books/livros)');
        }
      }

      if (!res) throw new Error('Resposta inválida do servidor');

      console.log(`[CADASTRO] Status: ${res.status}`);
      if (!res.ok) {
        let errorMessage = 'Erro ao salvar o livro';
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || JSON.stringify(errorData) || errorMessage;
        } catch (e) {
          try {
            const txt = await res.text();
            errorMessage = txt || errorMessage;
          } catch {
            // ignore
          }
        }
        throw new Error(errorMessage);
      }

      console.log('[CADASTRO] Livro salvo com sucesso!');
      if (Platform.OS === 'web') {
        window.alert('Cadastrado com sucesso\nO livro foi adicionado à sua biblioteca!');
        goToHome();
      } else {
        Alert.alert('Cadastrado com sucesso', 'O livro foi adicionado à sua biblioteca!', [{ text: 'OK', onPress: goToHome }]);
      }
    } catch (error) {
      console.error('[CADASTRO] Erro:', error);
      const message = error instanceof Error ? error.message : 'Falha ao salvar o livro';
      if (Platform.OS === 'web') {
        window.alert(`Erro: ${message}`);
      } else {
        Alert.alert('Erro', message);
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: "#e8f5e9" }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{
        fontSize: 28,
        fontWeight: '800',
        color: '#1b4332',
        marginBottom: 25,
      }}>
        Novo Livro
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: '#1b4332',
          marginBottom: 8,
        }}>
          Título
        </Text>
        <TextInput
          placeholder="Digite o título do livro"
          value={titulo}
          onChangeText={setTitulo}
          editable={!carregando}
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingHorizontal: 15,
            paddingVertical: 12,
            fontSize: 15,
            borderWidth: 1,
            borderColor: '#e0e0e0',
          }}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: '#1b4332',
          marginBottom: 8,
        }}>
          Autor
        </Text>
        <TextInput
          placeholder="Digite o nome do autor"
          value={autor}
          onChangeText={setAutor}
          editable={!carregando}
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingHorizontal: 15,
            paddingVertical: 12,
            fontSize: 15,
            borderWidth: 1,
            borderColor: '#e0e0e0',
          }}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: '#1b4332',
          marginBottom: 8,
        }}>
          Sinopse
        </Text>
        <TextInput
          placeholder="Digite a sinopse do livro"
          value={sinopse}
          onChangeText={setSinopse}
          multiline
          numberOfLines={5}
          editable={!carregando}
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingHorizontal: 15,
            paddingVertical: 12,
            fontSize: 15,
            borderWidth: 1,
            borderColor: '#e0e0e0',
            textAlignVertical: "top",
          }}
        />
      </View>

      <View style={{ marginBottom: 25 }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: '#1b4332',
          marginBottom: 12,
        }}>
          Capa do Livro (opcional)
        </Text>

        <TouchableOpacity
          onPress={escolherImagem}
          disabled={carregando}
          style={{
            backgroundColor: "#2d6a4f",
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 10,
            marginBottom: 15,
            alignItems: 'center',
          }}
        >
          <Text style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: '600',
            fontSize: 15,
          }}>
            {capa ? "Mudar Capa" : "Escolher Capa (opcional)"}
          </Text>
        </TouchableOpacity>

        {capa !== "" && (
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 15,
            alignItems: 'center',
            marginBottom: 15,
            borderWidth: 1,
            borderColor: '#e0e0e0',
          }}>
            <Image
              source={{ uri: capa }}
              style={{
                width: 120,
                height: 180,
                borderRadius: 8,
              }}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={salvar}
        disabled={carregando}
        style={{
          backgroundColor: carregando ? "#999" : "#27ae60",
          paddingVertical: 16,
          marginBottom: 12,
          borderRadius: 10,
          alignItems: 'center',
          shadowColor: carregando ? '#999' : '#27ae60',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "700",
            fontSize: 16,
          }}>
            ✓ Cadastrar Livro
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/")}
        disabled={carregando}
        style={{
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: '#2d6a4f',
          paddingVertical: 13,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{
          color: '#2d6a4f',
          textAlign: "center",
          fontWeight: "700",
          fontSize: 15,
        }}>
          Cancelar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}