# 📚 iBook - Plataforma de Empréstimo de Livros

![iBook](https://img.shields.io/badge/iBook-1.0.0-blue)
![Expo](https://img.shields.io/badge/Expo-54.0-success)
![Backend](https://img.shields.io/badge/Backend-JSON%20Server-yellow)
![Security](https://img.shields.io/badge/Security-SDD-red)

Uma aplicação de **empréstimo e aluguel de livros** desenvolvida com **Expo**, **React Native**, **TypeScript** e **JSON Server**, com implementação de **Security Driven Development (SDD)**.

---

## 🎯 Funcionalidades

✅ **Autenticação e Registro** - Login seguro com persistência de dados  
✅ **Catálogo de Livros** - Navegação e busca de livros  
✅ **Empréstimos** - Emprestar livros com limite de quantidade  
✅ **Sistema de Reviews** - Avaliar livros lidos  
✅ **Backend com JSON Server** - API fake com dados persistentes  
✅ **Multiplataforma** - Funciona em Web, Android e iOS  
✅ **Segurança** - Implementação de SDD com 21 testes de segurança

---

## 🚀 Quick Start

### 1. Instalar Dependências

```bash
npm install
npx playwright install
```

### 2. Rodar Backend + Aplicação

**Opção A - Desenvolvimento (Web + Backend):**
```bash
npm run dev
```

**Opção B - Android:**
```bash
npm run backend  # Terminal 1
npm run android  # Terminal 2
```

**Opção C - iOS:**
```bash
npm run backend  # Terminal 1
npm run ios      # Terminal 2
```

### 3. Login

Use as credenciais de teste:
- **Email:** `admin`
- **Senha:** `123`

---

## 📱 Rodar em Celular

### Android (Device Físico)

1. **Configurar IP Local** (`constantes/apiClient.ts`):
   ```typescript
   const LAN_IP = "192.168.0.100"; // Coloque seu IP aqui
   ```

2. **Executar:**
   ```bash
   npm run backend
   npm run android
   ```

### iOS (Device Físico)

1. **Configurar IP Local** (mesmo que Android)

2. **Executar:**
   ```bash
   npm run backend
   npm run ios
   ```

[Veja guia completo: BACKEND-SETUP.md](BACKEND-SETUP.md)

---

## 🗂️ Estrutura do Projeto

```
ibook-app/
├── app/                          # Código fonte (Expo Router)
│   ├── (abas)/                  # Telas com tabs (navegação)
│   ├── context/                 # AuthContext, ThemeContext
│   ├── login.tsx                # Tela de login/registro
│   ├── _layout.tsx              # Layout principal
│   └── book-details.tsx         # Detalhes do livro
│
├── constantes/
│   ├── apiClient.ts             # Configuração da API (novo!)
│   ├── api.ts                   # URLs da API
│   └── theme.ts                 # Temas de cor
│
├── componentes/                 # Componentes reutilizáveis
├── ganchos/                     # Hooks customizados
├── docs/segurança/              # Documentação SDD + OWASP
├── tests/                       # Testes Playwright (21 casos)
│
├── db.json                      # Banco de dados (JSON Server)
├── app.json                     # Configuração Expo
├── package.json                 # Dependências
├── BACKEND-SETUP.md             # Guia de setup backend
└── README.md                    # Este arquivo
```

---

## 🔐 Backend (JSON Server)

### Dados Disponíveis

```
GET /users              # Usuários cadastrados
GET /books              # Catálogo de livros
GET /loans              # Empréstimos ativos
GET /reviews            # Avaliações de livros
```

### Iniciar Backend

```bash
npm run backend
```

Backend roda em `http://localhost:3001`

### Ver Dados no Navegador

Enquanto backend está rodando:
```
http://localhost:3001/users
http://localhost:3001/books
http://localhost:3001/loans
```

---

## 🧪 Testes de Segurança

O projeto inclui **21 testes automatizados** com **Playwright**, mapeados aos **10 itens OWASP Top 10**:

### Executar Testes

```bash
npm run test:security
```

### Gerar Relatório

```bash
npm run test:security:report
```

### Ver Documentação

- [SDD Process](docs/segurança/SECURITY.md)
- [OWASP Analysis](docs/segurança/OWASP-RELATORIO.md)
- [Testing Checklist](CHECKLIST-FINAL-ENTREGA.md)

---

## 👥 Usuários de Teste (db.json)

| Email | Senha | Role |
|-------|-------|------|
| admin | 123 | admin |
| joao@example.com | 123456 | user |
| maria@example.com | 654321 | user |

---

## 📚 Tecnologias

- **Frontend:** React Native, TypeScript, Expo
- **Backend:** JSON Server (API Fake)
- **Armazenamento:** AsyncStorage + JSON Server
- **Testes:** Playwright (21 casos de segurança)
- **CI/CD:** GitHub Actions
- **Segurança:** SDD + OWASP Top 10

---

## 🔧 Scripts Disponíveis

```bash
npm start                    # Iniciar Expo
npm run android             # Rodar no Android
npm run ios                 # Rodar no iOS
npm run web                 # Rodar na Web
npm run backend             # Rodar JSON Server
npm run dev                 # Backend + Web (simultâneo)
npm run test:security       # Rodar testes
npm run test:security:report # Ver relatório
npm run lint                # Verificar código
npm run reset-project       # Reset para novo projeto
```

---

## 🐛 Troubleshooting

### Backend não conecta
```bash
# Certifique-se que o backend está rodando
npm run backend

# Verifique a URL em constantes/apiClient.ts
```

### Erro no Android emulator
```
Use o IP especial: 10.0.2.2 (já configurado)
```

### Erro: "port 3001 is already in use"
```bash
# Windows
Get-NetTCPConnection -LocalPort 3001 | Stop-Process
```

[Veja guia completo de troubleshooting](BACKEND-SETUP.md#-troubleshooting)

---

## 📖 Documentação Completa

- [Backend Setup](BACKEND-SETUP.md) - Guia de configuração e deployment
- [Segurança (SDD)](docs/segurança/SECURITY.md) - Processo de desenvolvimento seguro
- [OWASP Analysis](docs/segurança/OWASP-RELATORIO.md) - Análise de vulnerabilidades
- [Guia de Apresentação](GUIA-APRESENTACAO.md) - Script para apresentar o projeto
- [Checklist Final](CHECKLIST-FINAL-ENTREGA.md) - Verificação de completude

---

## 🚀 Deploy em Produção

Para fazer deploy:

1. **Backend Real** - Substitua JSON Server por backend real (Node.js, Python, etc)
2. **Autenticação** - Implemente JWT ou OAuth
3. **Banco de Dados** - Use PostgreSQL, MongoDB, etc
4. **HTTPS** - Certifique-se de usar HTTPS em produção
5. **Build** - Use `expo build` ou Expo EAS

---

## 📄 Licença

MIT

---

## 👨‍💻 Autor

Desenvolvido como projeto acadêmico com foco em **Security Driven Development**.

---

## 🤝 Contribuições

Contribuições são bem-vindas! Abra uma issue ou pull request.

---

**Pronto para usar! Boa sorte! 🎉**
