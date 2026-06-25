# 📚 TUTORIAL INTERATIVO - DOCUMENTAÇÃO

**Componente**: `componentes/tutorial.tsx`  
**Status**: ✅ Implementado  
**Integrado em**: Login + Home (Biblioteca)

---

## 📊 Visão Geral

O Tutorial é um componente interativo com **11 slides** que apresenta todas as funcionalidades do app de forma visual e didática.

```
┌─────────────────────────────────────┐
│      TUTORIAL (Modal Fullscreen)    │
├─────────────────────────────────────┤
│                                     │
│  [Ícone Grande]                     │
│                                     │
│  SLIDE TITLE                        │
│  Descrição do slide                 │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ • Detalhe 1                 │    │
│  │ • Detalhe 2                 │    │
│  │ • Detalhe 3                 │    │
│  └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│  ← Anterior  [●][●][●]  Próximo →  │
└─────────────────────────────────────┘
```

---

## 🎨 Estrutura de Slides

### Slide 1: Bem-vindo ao IBOOK
```typescript
{
  title: 'Bem-vindo ao IBOOK',
  description: 'Sistema de Biblioteca Virtual com Google Sign-In',
  icon: 'book-open-variant',
  color: '#6366f1',  // Índigo
  details: [
    '✅ Autenticação com Email/Senha',
    '✅ Google Sign-In integrado',
    '✅ Gerenciamento de empréstimos',
    '✅ Sistema de avaliações',
    '✅ Segurança OWASP',
  ]
}
```

### Slide 2: Como Fazer Cadastro
```typescript
{
  title: '🔐 Como Fazer Cadastro',
  color: '#ec4899',  // Rosa
  details: [
    '1. Clique em "Criar uma conta"',
    '2. Preencha Email, Nome e Senha',
    '3. Senha mínimo 6 caracteres',
    '4. Clique em "Registrar"',
    '5. Pronto! Você está logado'
  ]
}
```

### Slide 3: Como Fazer Login
```typescript
{
  title: '🔑 Como Fazer Login',
  color: '#f59e0b',  // Âmbar
  details: [
    '1. Digite seu Email',
    '2. Digite sua Senha',
    '3. Clique em "Entrar"',
    'OU',
    '4. Use "Entrar com Google"'
  ]
}
```

### Slide 4: Como Emprestar Livros
```typescript
{
  title: '📚 Como Emprestar Livros',
  color: '#10b981',  // Verde
  details: [
    '1. Vá para aba "HOME"',
    '2. Veja lista de livros',
    '3. Clique no livro desejado',
    '4. Clique "Emprestar Livro"',
    '5. Livro adicionado aos seus empréstimos'
  ]
}
```

### Slide 5: Meus Empréstimos
```typescript
{
  title: '🔄 Meus Empréstimos',
  color: '#0ea5e9',  // Azul Ciano
  details: [
    '1. Vá para aba "EMPRÉSTIMOS"',
    '2. Veja todos seus empréstimos ativos',
    '3. Limite: máximo 3 livros',
    '4. Clique no livro para Devolver',
    '5. Deixe uma avaliação (1-5 estrelas)'
  ]
}
```

### Slide 6: Deixar Comentários
```typescript
{
  title: '⭐ Deixar Comentários',
  color: '#f97316',  // Laranja
  details: [
    '1. Vá para aba "FEED"',
    '2. Veja comentários de outros',
    '3. Ao devolver um livro',
    '4. Deixe sua avaliação (1-5)',
    '5. Escreva um comentário'
  ]
}
```

### Slide 7: Gerenciar Livros (Admin)
```typescript
{
  title: '📋 Gerenciar Livros (Admin)',
  color: '#8b5cf6',  // Roxo
  details: [
    '1. Vá para aba "GERENCIAR"',
    '2. Adicione novos livros',
    '3. Edite livros existentes',
    '4. Delete livros',
    '⚠️ Apenas usuários ADMIN'
  ]
}
```

### Slide 8: Segurança OWASP
```typescript
{
  title: '🔒 Segurança OWASP',
  color: '#ef4444',  // Vermelho
  details: [
    '✅ Proteção contra Injection (XSS)',
    '✅ Validação de senhas forte',
    '✅ Isolamento de dados por usuário',
    '✅ Limite de empréstimos (Access Control)',
    '✅ Testes automatizados com Playwright'
  ]
}
```

### Slide 9: Testes Playwright
```typescript
{
  title: '🧪 Testes Playwright',
  color: '#06b6d4',  // Ciano
  details: [
    '✅ Teste 01: Injection (XSS)',
    '✅ Teste 02: Access Control',
    '✅ Teste 04: Weak Password',
    '✅ Teste 06: Brute Force',
    '✅ ...e 6+ mais testes'
  ]
}
```

### Slide 10: SDD Completo
```typescript
{
  title: '📊 SDD Completo',
  color: '#6b7280',  // Cinza
  details: [
    '✅ Fase 1: Planejamento',
    '✅ Fase 2: Análise',
    '✅ Fase 3: Design',
    '✅ Fase 4: Implementação',
    '✅ Fase 5: Validação'
  ]
}
```

### Slide 11: Pronto para Começar!
```typescript
{
  title: 'Pronto para Começar!',
  color: '#10b981',  // Verde
  details: [
    '🎉 Você aprendeu o básico',
    '📚 Explore o app',
    '❓ Dúvidas?',
    '📖 Leia GUIA-ENTREGA-FINAL.md',
    '🚀 Divirta-se!'
  ]
}
```

---

## 🎯 Features do Tutorial

### 1. Navegação Fluida

```typescript
// Próximo slide
const handleNext = () => {
  if (currentSlide < SLIDES.length - 1) {
    setCurrentSlide(currentSlide + 1);
  }
};

// Slide anterior
const handlePrev = () => {
  if (currentSlide > 0) {
    setCurrentSlide(currentSlide - 1);
  }
};

// Ir direto para um slide
<TouchableOpacity onPress={() => setCurrentSlide(index)}>
  {/* Dot indicador */}
</TouchableOpacity>
```

### 2. Indicadores Visuais

```
[● ] [● ] [● ] [● ] [● ] ...
 ↑
Slide atual (cor dinamica baseada no slide.color)
```

### 3. Header com Progresso

```
┌────────────────────────────────┐
│ TUTORIAL                    X  │
│ 3 de 11                        │
└────────────────────────────────┘
```

### 4. Ícones Dinâmicos

```typescript
<MaterialCommunityIcons
  name={slide.icon}  // Muda por slide
  size={60}
  color={slide.color}  // Cor do tema do slide
/>
```

### 5. Botão Final

No último slide (11), mostra botão verde:
```
✅ Começar a Usar
```

---

## 🔗 Integração no App

### Login Page (`app/login.tsx`)

```typescript
import { Tutorial } from '../componentes/tutorial';

export default function Login() {
  const [tutorialVisible, setTutorialVisible] = useState(false);

  return (
    <ScrollView>
      {/* ... form ... */}
      
      <TouchableOpacity onPress={() => setTutorialVisible(true)}>
        <Text>📚 TUTORIAL</Text>
      </TouchableOpacity>

      <Tutorial visible={tutorialVisible} onClose={() => setTutorialVisible(false)} />
    </ScrollView>
  );
}
```

### Home Page (`app/(abas)/index.tsx`)

```typescript
import { Tutorial } from '../../componentes/tutorial';

export default function Home() {
  const [tutorialVisible, setTutorialVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setTutorialVisible(true)}>
        <Text>📚</Text>
      </TouchableOpacity>

      <Tutorial visible={tutorialVisible} onClose={() => setTutorialVisible(false)} />
    </View>
  );
}
```

---

## 🎨 Cores Utilizadas

| Slide | Cor | Nome |
|-------|-----|------|
| 1 | #6366f1 | Índigo |
| 2 | #ec4899 | Rosa |
| 3 | #f59e0b | Âmbar |
| 4 | #10b981 | Verde |
| 5 | #0ea5e9 | Azul Ciano |
| 6 | #f97316 | Laranja |
| 7 | #8b5cf6 | Roxo |
| 8 | #ef4444 | Vermelho |
| 9 | #06b6d4 | Ciano |
| 10 | #6b7280 | Cinza |
| 11 | #10b981 | Verde |

---

## 📱 Responsividade

O tutorial é 100% responsivo:

```typescript
const { width, height } = Dimensions.get('window');

// Funciona em:
// - Web (Expo Web)
// - iOS
// - Android
```

---

## 🧪 Como Testar

```bash
# 1. Iniciar app
npm run web

# 2. Ir para login
# 3. Clique em "📚 TUTORIAL"
# 4. Navegue pelos slides
# 5. Teste na tela HOME também
```

---

## 📝 Pontos para Apresentação

Quando mostrar para o professor:

1. **Na Tela de Login**
   - Clique em "📚 TUTORIAL"
   - Mostre os 11 slides
   - Navegue entre slides
   - Explique cada funcionalidade

2. **Depois de Fazer Login**
   - Na aba HOME
   - Clique no botão roxo no canto superior direito
   - Tutorial fica disponível sempre

3. **Destaques**
   - 11 slides bem estruturados
   - Cores diferentes para cada funcionalidade
   - Ícones descritivos
   - Fácil navegação
   - Responsivo (web, iOS, Android)

---

## 🚀 Próximas Melhorias (Opcional)

- [ ] Adicionar vídeos em alguns slides
- [ ] Incluir animações
- [ ] Suporte a múltiplos idiomas (EN, PT)
- [ ] Marcar tutorial como "não mostrar novamente"
- [ ] Adicionar tutorial de welcome na primeira login

---

**Arquivo**: `componentes/tutorial.tsx`  
**Linhas**: ~350  
**Data**: 2026-06-22

