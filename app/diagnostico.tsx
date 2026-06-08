import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { API } from "../constantes/api";
import safeAsyncStorage from "../ganchos/useStorage";

export default function Diagnostico() {
  const [diagnostic, setDiagnostic] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    runDiagnostics();
  }, []);

  const addLog = (message: string) => {
    setDiagnostic(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    console.log(`[DIAGNOSTIC] ${message}`);
  };

  const runDiagnostics = async () => {
    addLog("=== INICIANDO DIAGNÓSTICO ===");
    
    // 1. Informações da plataforma
    addLog(`Plataforma: ${Platform.OS}`);
    addLog(`URL da API: ${API}`);
    
    // 2. Testar AsyncStorage
    addLog("Testando AsyncStorage...");
    try {
      await safeAsyncStorage.setItem("test_key", "test_value");
      const value = await safeAsyncStorage.getItem("test_key");
      if (value === "test_value") {
        addLog("✓ AsyncStorage funcionando");
        await safeAsyncStorage.removeItem("test_key");
      } else {
        addLog("✗ AsyncStorage retornou valor inválido");
      }
    } catch (error) {
      addLog(`✗ Erro no AsyncStorage: ${error}`);
    }

    // 3. Testar conectividade com API
    addLog("Testando conexão com API...");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API}/livros`, {
        method: "GET",
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      addLog(`✓ API respondeu com status ${response.status}`);
      
      const data = await response.json();
      addLog(`✓ Dados recebidos: ${Array.isArray(data) ? `${data.length} livros` : "resposta válida"}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addLog(`✗ Erro ao conectar com API: ${message}`);
    }

    // 4. Testar POST na API
    addLog("Testando POST na API (sem salvar)...");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API}/livros`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          titulo: "TESTE_DIAGNOSTIC",
          autor: "Bot",
          sinopse: "Este é um teste de diagnóstico",
          capa: "",
          emprestado: false
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      addLog(`✓ POST respondeu com status ${response.status}`);
      
      if (response.ok) {
        addLog("✓ POST funcionando corretamente");
      } else {
        const errorData = await response.json();
        addLog(`✗ POST retornou erro: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addLog(`✗ Erro ao fazer POST: ${message}`);
    }

    addLog("=== DIAGNÓSTICO FINALIZADO ===");
  };

  const clearLog = () => {
    setDiagnostic([]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={{ backgroundColor: "#2c3e50", paddingTop: 20, paddingBottom: 15 }}>
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", marginLeft: 20 }}>
          🔍 Diagnóstico
        </Text>
        <Text style={{ color: "#aaa", fontSize: 12, marginLeft: 20, marginTop: 4 }}>
          {Platform.OS === "web" ? "Web" : Platform.OS === "android" ? "Android" : "iOS"}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, padding: 15 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {diagnostic.map((log, index) => (
          <View
            key={index}
            style={{
              backgroundColor: log.includes("✓") ? "#d4edda" : log.includes("✗") ? "#f8d7da" : "#e7f3ff",
              borderLeftColor: log.includes("✓") ? "#28a745" : log.includes("✗") ? "#dc3545" : "#0056b3",
              borderLeftWidth: 4,
              padding: 10,
              marginBottom: 8,
              borderRadius: 4,
            }}
          >
            <Text style={{ fontSize: 11, fontFamily: "monospace", color: "#333" }}>
              {log}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ padding: 15, gap: 10, borderTopWidth: 1, borderTopColor: "#ddd" }}>
        <TouchableOpacity
          onPress={runDiagnostics}
          style={{ backgroundColor: "#007bff", padding: 12, borderRadius: 8, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>🔄 Rodar Diagnóstico Novamente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={clearLog}
          style={{ backgroundColor: "#6c757d", padding: 12, borderRadius: 8, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>🗑️ Limpar Log</Text>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: "#28a745", padding: 12, borderRadius: 8, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>← Voltar</Text>
        </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
}
