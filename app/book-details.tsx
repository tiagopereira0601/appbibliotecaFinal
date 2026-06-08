import { View, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from "react-native"; // importa componentes visuais e utilitários do React Native
import { useLocalSearchParams, useRouter } from "expo-router"; // importa hooks de navegação do Expo Router
import { API } from '../constantes/api'; // importa a URL base da API do backend na pasta constantes
import { useState } from "react"; // importa hook de estado do React

export default function BookDetails() { // componente de detalhes de livro
  const { book } = useLocalSearchParams(); // lê o parâmetro enviado pela rota
  const router = useRouter(); // inicializa o roteador para navegação
  const item = book ? (typeof book === 'string' ? JSON.parse(book) : book) : null; // converte o parâmetro em objeto se for string
  const [loading, setLoading] = useState(false); // controla o estado de loading do botão

  const emprestar = async () => { // função assíncrona que faz o empréstimo do livro
    setLoading(true); // mostra indicador de carregamento
    try {
      const loanRes = await fetch(`${API}/emprestimos`, { // cria um novo empréstimo no backend
        method: "POST",
        headers: { "Content-Type": "application/json" }, // envia JSON
        body: JSON.stringify({
          livroId: item.id, // id do livro
          titulo: item.titulo, // título do livro
          autor: item.autor, // autor do livro
          capa: item.capa, // url da capa do livro
          status: "emprestado" // define o status do empréstimo
        })
      });

      if (!loanRes.ok) { // verifica se a requisição falhou
        throw new Error('Erro ao criar empréstimo');
      }

      const bookRes = await fetch(`${API}/livros/${item.id}`, { // marca o livro como emprestado
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emprestado: true })
      });

      if (!bookRes.ok) { // verifica se a atualização do livro falhou
        throw new Error('Erro ao atualizar livro');
      }

      if (Platform.OS === 'web') { // web usa alerta de navegador
        window.alert("Livro emprestado com sucesso!");
        router.replace("/emprestimos");
      } else { // mobile usa alerta nativo
        Alert.alert("Sucesso", "Livro emprestado com sucesso!", [
          {
            text: "OK",
            onPress: () => router.replace("/emprestimos")
          }
        ]);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao emprestar o livro'; // mensagem de erro
      console.log("Erro ao emprestar:", error); // log para debug
      if (Platform.OS === 'web') {
        window.alert(`Erro: ${message}`); // alerta web
      } else {
        Alert.alert("Erro", message); // alerta mobile
      }
    } finally {
      setLoading(false); // remove indicador de carregamento
    }
  };

  if (!item) { // se não houver item válido, mostra mensagem de erro
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 16, color: '#333', textAlign: 'center' }}>
          Erro: dados do livro não estão disponíveis.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#e8f5e9" }}>
      <View style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 18, color: "#2d6a4f", fontWeight: '700' }}>← Voltar</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {item.capa && (
          <View style={{
            alignItems: "center",
            marginBottom: 30,
          }}>
            <Image
              source={{ uri: item.capa }}
              style={{
                width: 180,
                height: 260,
                borderRadius: 12,
              }}
            />
          </View>
        )}

        <Text style={{
          fontSize: 28,
          fontWeight: "800",
          textAlign: "center",
          marginBottom: 10,
          color: '#1b4332',
        }}>
          {item.titulo}
        </Text>

        <Text style={{
          fontSize: 18,
          color: "#666",
          textAlign: "center",
          marginBottom: 25,
          fontWeight: '500',
        }}>
          por {item.autor}
        </Text>

        <View style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 20,
          marginBottom: 25,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{
            fontSize: 16,
            lineHeight: 26,
            color: '#333',
          }}>
            {item.sinopse}
          </Text>
        </View>

        {!item.emprestado && (
          <TouchableOpacity 
            onPress={emprestar}
            disabled={loading}
            style={{
              backgroundColor: "#27ae60",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              shadowColor: '#27ae60',
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 18,
                fontWeight: '700',
              }}>
                📚 Emprestar Livro
              </Text>
            )}
          </TouchableOpacity>
        )}

        {item.emprestado && (
          <View style={{
            backgroundColor: "#f8d7da",
            borderWidth: 2,
            borderColor: '#f5c6cb',
            borderRadius: 12,
            padding: 16,
            alignItems: "center"
          }}>
            <Text style={{
              color: "#721c24",
              fontWeight: "700",
              fontSize: 16,
            }}>
              ❌ Livro Indisponível
            </Text>
            <Text style={{
              color: "#721c24",
              fontSize: 13,
              marginTop: 5,
            }}>
              Este livro já foi emprestado
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}