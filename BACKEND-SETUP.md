# 🚀 iBook - Backend Setup e Execução

**App**: iBook - Plataforma de Empréstimo de Livros  
**Backend**: JSON Server (API Fake)  
**Plataformas**: Web, Android, iOS

---

## 📋 Pré-requisitos

- Node.js v18+ instalado
- npm ou yarn
- Para rodar no celular: IP local da sua máquina (WiFi)

---

## 🔧 Setup Inicial (Primeira Vez)

### 1. Instalar Dependências

```bash
cd c:\Users\feres\Downloads\biblioteca\appfinal
npm install
```

### 2. Instalar Playwright (para testes)

```bash
npx playwright install
```

### 3. Configurar IP Local (Para dispositivos físicos)

Se vai rodar em **celular (Android/iOS)**, configure seu IP local:

```bash
# No Windows PowerShell (obter IP)
ipconfig

# Procure por "IPv4 Address" na rede WiFi (ex: 192.168.0.100)
```

Depois, abra o arquivo `constantes/apiClient.ts` e altere:

```typescript
const LAN_IP = "192.168.0.100"; // Substitua pelo seu IP
```

Ou defina variável de ambiente:

```bash
# Windows PowerShell
$env:EXPO_PUBLIC_LAN_IP="192.168.0.100"
```

---

## 🎯 Executar a Aplicação

### ✅ Opção 1: Rodar Backend + Web (Dev)

```bash
npm run dev
```

Isso vai abrir:
- **Backend**: http://localhost:3001 (JSON Server)
- **App**: http://localhost:8081 (Expo Web)

### ✅ Opção 2: Rodar Apenas o Backend

```bash
npm run backend
```

Depois, em outro terminal:

```bash
npm run web
```

### ✅ Opção 3: Rodar Backend + Android

Terminal 1 (Backend):
```bash
npm run backend
```

Terminal 2 (Android):
```bash
npm run android
```

### ✅ Opção 4: Rodar Backend + iOS

Terminal 1 (Backend):
```bash
npm run backend
```

Terminal 2 (iOS):
```bash
npm run ios
```

---

## 🧪 Testar o Backend

### Ver dados no navegador

Enquanto o backend está rodando, acesse:

```
http://localhost:3001/users          # Todos os usuários
http://localhost:3001/books          # Todos os livros
http://localhost:3001/loans          # Todos os empréstimos
http://localhost:3001/reviews        # Todos os reviews
```

### Testar API com cURL

```bash
# Listar usuários
curl http://localhost:3001/users

# Login (buscar usuário)
curl http://localhost:3001/users?email=admin

# Criar novo livro
curl -X POST http://localhost:3001/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Novo Livro","author":"Autor","isbn":"123","category":"Fiction","description":"Descrição","available":true}'
```

---

## 📱 Rodar no Celular (Android/iOS)

### Android (Device Físico)

1. **Conectar celular ao PC via USB ou WiFi**

2. **Configurar IP Local**
   ```bash
   # Obter IP da máquina
   ipconfig
   # Ex: 192.168.0.100
   
   # Editar constantes/apiClient.ts
   const LAN_IP = "192.168.0.100";
   ```

3. **Executar**
   ```bash
   npm run backend  # Terminal 1
   npm run android  # Terminal 2
   ```

### iOS (Device Físico)

1. **Conectar iPhone ao PC (ou usar Xcode)**

2. **Certificar que está na mesma rede WiFi**

3. **Configurar IP Local (mesmo que Android)**
   ```bash
   const LAN_IP = "192.168.0.100";
   ```

4. **Executar**
   ```bash
   npm run backend  # Terminal 1
   npm run ios      # Terminal 2
   ```

---

## 💾 Base de Dados (db.json)

O arquivo `db.json` contém dados fake:

```json
{
  "users": [...],      // Usuários registrados
  "books": [...],      // Catálogo de livros
  "loans": [...],      // Empréstimos ativos
  "reviews": [...]     // Avaliações
}
```

### Resetar dados

Para volta aos dados originais:

1. Delete `db.json`
2. Crie novo `db.json` com conteúdo do arquivo de backup
3. Reinicie o backend

---

## 🔐 Usuários de Teste

No arquivo `db.json`, existem usuários pré-configurados:

| Email | Senha | Role |
|-------|-------|------|
| admin | 123 | admin |
| joao@example.com | 123456 | user |
| maria@example.com | 654321 | user |

---

## 🐛 Troubleshooting

### ❌ Erro: "Cannot connect to backend"

**Solução 1**: Certifique-se que o backend está rodando
```bash
npm run backend
```

**Solução 2**: Verifique se a porta 3001 não está sendo usada
```bash
# Windows PowerShell
Get-NetTCPConnection -LocalPort 3001
```

**Solução 3**: Verifique a URL da API em `constantes/apiClient.ts`

### ❌ Erro: "IP não funciona no celular"

- Certifique-se de estar na **mesma rede WiFi**
- Desabilite firewall temporariamente
- Use IP correto do `ipconfig`
- No Expo Go, escolha "LAN" ao conectar

### ❌ Erro: "Android emulator não conecta"

Use IP especial do Android emulator: `10.0.2.2` (já configurado)

### ❌ Erro: "json-server: not found"

Reinstale dependências:
```bash
npm install
```

---

## 📊 Estrutura da API

### Users Endpoint

```bash
GET    /users              # Listar todos
GET    /users/:id          # Buscar por ID
GET    /users?email=...    # Buscar por email
POST   /users              # Criar novo usuário
PUT    /users/:id          # Atualizar
DELETE /users/:id          # Deletar
```

### Books Endpoint

```bash
GET    /books              # Listar catálogo
GET    /books/:id          # Detalhes do livro
POST   /books              # Adicionar novo livro
PUT    /books/:id          # Atualizar disponibilidade
```

### Loans Endpoint

```bash
GET    /loans              # Empréstimos ativos
POST   /loans              # Criar empréstimo
PUT    /loans/:id          # Atualizar status
DELETE /loans/:id          # Cancelar empréstimo
```

---

## 🚀 Deploy em Produção

Para usar um backend real (não JSON Server):

1. Mude a URL em `constantes/apiClient.ts`:
   ```typescript
   const API_URL = "https://seu-backend.com/api";
   ```

2. Implemente autenticação real (JWT, etc)

3. Use banco de dados persistente (PostgreSQL, MongoDB, etc)

---

## 📝 Scripts Disponíveis

```bash
npm start                    # Iniciar Expo
npm run android             # Rodar no Android
npm run ios                 # Rodar no iOS
npm run web                 # Rodar na Web
npm run backend             # Rodar JSON Server
npm run dev                 # Backend + Web (simultâneo)
npm run test:security       # Rodar testes Playwright
npm run test:security:report # Ver relatório de testes
npm run lint                # Verificar código
```

---

## ✅ Verificação de Setup

Para garantir que tudo está funcionando:

```bash
# 1. Instalar dependências
npm install

# 2. Rodar backend
npm run backend

# 3. Em outro terminal, rodar web
npm run web

# 4. Abrir http://localhost:8081 no navegador

# 5. Fazer login com:
#    Email: admin
#    Senha: 123

# 6. Se conseguir fazer login, tudo está funcionando! ✅
```

---

## 📚 Documentação Adicional

- [Expo Docs](https://docs.expo.dev)
- [JSON Server Docs](https://github.com/typicode/json-server)
- [React Native Docs](https://reactnative.dev)
- [Axios Docs](https://axios-http.com)

---

**Pronto! Você agora tem iBook com backend funcionando em Web, Android e iOS! 🎉**

