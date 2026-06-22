# 🔐 Google Sign-In - Configuração

## Implementação

O iBook agora suporta **Google Sign-In** para login rápido.

### Como Funciona

1. Usuário clica em "Entrar com Google"
2. É redirecionado para autenticação Google
3. Se for primeira vez, conta é criada automaticamente
4. Se já existe, faz login direto
5. Dados são salvos no backend (db.json)

---

## 🚀 Configuração (Importante!)

### Android

1. **Obter Google Client ID:**
   - Acesse: https://console.cloud.google.com
   - Crie um projeto novo
   - Vá em "Credenciais"
   - Crie uma chave OAuth 2.0 para Android
   - Copie o `Web Client ID`

2. **Configurar no projeto:**
   ```typescript
   // constantes/googleConfig.ts
   export const GOOGLE_WEB_CLIENT_ID = "seu-client-id-aqui.apps.googleusercontent.com";
   ```

3. **Atualizar GoogleSignIn.tsx:**
   ```typescript
   GoogleSignin.configure({
     webClientId: GOOGLE_WEB_CLIENT_ID,
   });
   ```

### iOS

1. **Mesmos passos do Android**

2. **Adicionar pods do CocoaPods:**
   ```bash
   npx expo prebuild --clean
   ```

### Web

Google Sign-In **não funciona em Web** no componente atual (por limitações do React Native). Use email/senha na web.

---

## 📝 Estrutura de Dados

Quando usuário faz login com Google:

```json
{
  "id": "google_user_id_ou_timestamp",
  "email": "user@gmail.com",
  "name": "Nome do Usuário",
  "role": "user",
  "createdAt": "2026-06-22T..."
}
```

**Obs**: Password é `undefined` para usuários do Google

---

## 🧪 Teste Local

```bash
# Com emulador Android
npm run backend
npm run android

# Clique em "Entrar com Google"
# Selecione conta Google
# Deve fazer login!
```

---

## ⚠️ Troubleshooting

### "Google Sign-In não aparece"
- Certifique-se que está rodando em Android/iOS (não web)
- Verifique se `GoogleSigninButton` foi importado

### "Erro: Play Services não disponível"
- Use emulador com Google Play Services instalado
- Ou teste em device físico com Play Store

### "Erro de Client ID"
- Configure o Web Client ID correto
- Regenere a credencial se necessário

---

## 📚 Documentação

- [@react-native-google-signin](https://github.com/react-native-google-signin/google-signin)
- [Google Cloud Console](https://console.cloud.google.com)

