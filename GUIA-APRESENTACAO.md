# 🎤 GUIA DE APRESENTAÇÃO - SDD + PLAYWRIGHT + OWASP

**Público**: Professor e Colegas  
**Duração Sugerida**: 15-20 minutos  
**Formato**: Apresentação prática com demonstração ao vivo

---

## 📋 ESTRUTURA DA APRESENTAÇÃO (ROTEIRO)

### 🔴 SLIDE 1: INTRODUÇÃO (1 minuto)
**Título**: "Biblioteca Virtual - Security Driven Development"

**O que dizer**:
```
"Este projeto implementa a disciplina de SDD (Security Driven Development) 
que estudamos em sala. Desenvolvemos uma aplicação de Biblioteca Virtual 
com 21 casos de testes de segurança usando Playwright, mapeados aos 10 
itens OWASP Top 10 2021, e tudo está documentado no GitHub."
```

**Mostre**:
- Screenshot do repositório GitHub (URL)
- Badges de status do projeto

---

### 🔵 SLIDE 2: O QUE É SDD? (2 minutos)
**Título**: "Processo SDD - 5 Fases"

**O que dizer**:
```
"SDD é uma metodologia que coloca segurança no centro do 
desenvolvimento. Passamos por 5 fases:

1️⃣ THREAT MODELING - Identificamos quais são os dados 
   sensíveis (login, histórico, dados de usuário) e 
   pensamos em como alguém poderia atacar.

2️⃣ DESIGN SEGURO - Arquitetamos soluções de segurança 
   (criptografia, autenticação, controle de acesso).

3️⃣ IMPLEMENTAÇÃO - Codificamos com foco em segurança 
   (validação de entrada, prevenção de XSS, etc).

4️⃣ TESTES - Testamos automaticamente se as brechas 
   de segurança foram resolvidas usando Playwright.

5️⃣ REVISÃO - Fazemos code review e preparamos 
   para deployment seguro.
"
```

**Mostre**:
- Abra o arquivo: [docs/segurança/SECURITY.md](docs/segurança/SECURITY.md)
- Mostre a estrutura das 5 fases
- Aponte o diagrama de ameaças

**Print Sugerido**: Screenshot da seção "5 Fases SDD" do arquivo

---

### 🟠 SLIDE 3: OWASP TOP 10 - O QUE FOI TESTADO? (2 minutos)
**Título**: "10 Vulnerabilidades OWASP Analisadas"

**O que dizer**:
```
"OWASP (Open Web Application Security Project) é uma 
organização que identifica as TOP 10 vulnerabilidades 
mais perigosas em aplicações web. Analisamos todas elas:

A01 - Broken Access Control
     → Problema: Um usuário comum acessa /admin?
     → Solução: Implementamos controle de role (reader vs admin)
     → Teste: test-02 e test-04

A03 - Injection (XSS)
     → Problema: Alguém injeta código JavaScript na busca?
     → Solução: Escapamos a entrada do usuário
     → Teste: test-01 com payload XSS

A07 - Authentication Failures
     → Problema: Adivinha senhas com força bruta?
     → Solução: Limite de 5 tentativas, depois bloqueio
     → Teste: test-06 (tentativa 6 é bloqueada)

E 7 outras vulnerabilidades...
"
```

**Mostre**:
- Abra: [docs/segurança/OWASP-RELATORIO.md](docs/segurança/OWASP-RELATORIO.md)
- Mostre a tabela com os 10 itens
- Aponte os Status: ✅ RESOLVIDO

**Print Sugerido**: Screenshot da tabela de resumo OWASP

---

### 🟢 SLIDE 4: TESTES PLAYWRIGHT (4 minutos)
**Título**: "21 Casos de Teste com Evidências"

**O que dizer**:
```
"Implementamos 21 testes automatizados usando Playwright.
Cada teste verifica se a vulnerabilidade foi realmente 
resolvida. Todos têm evidências (screenshots e vídeos).

GRUPO A - TESTES DE NEGÓCIO (Biblioteca):
  Test 01: XSS Prevention
    - Simula um ataque: <script>alert('hack')</script>
    - Esperado: Script é escapado, não executa
    - Evidência: [screenshot-01.png]

  Test 02: Access Control - Limite de Empréstimos
    - Tenta emprestar 4º livro (máximo é 3)
    - Esperado: Erro 'Limite excedido'
    - Evidência: [screenshot-02.png]

  Test 03, 04, 05: (Outros testes de negócio)

GRUPO B - TESTES DE SEGURANÇA (Autenticação):
  Test 06: Brute Force Protection
    - Tenta fazer login 6 vezes com senha errada
    - Esperado: Bloqueado na 6ª tentativa
    - Evidência: [screenshot-06.png]

  Test 07: Password Validation
    - Testa senhas fracas vs senhas fortes
    - Esperado: Fraca rejeitada, forte aceita
    - Evidência: [screenshot-07.png]

  Test 08, 09, 10: (Session timeout, CSRF, Rate Limiting)
"
```

**Demonstração Ao Vivo (Melhor Opção)**:
```bash
# Abra terminal e execute:
npm run test:security

# Mostra os testes rodando com Chromium, Firefox, WebKit
# Ao final, execute:
npm run test:security:report

# Abre HTML report com todos os resultados
```

**Se não puder rodar ao vivo, mostre**:
- Screenshots de [docs/segurança/evidencias/screenshots/](docs/segurança/evidencias/screenshots/)
- Vídeos de [docs/segurança/evidencias/videos/](docs/segurança/evidencias/videos/)
- HTML report de [docs/segurança/evidencias/relatorios-playwright/](docs/segurança/evidencias/relatorios-playwright/)

**Prints Sugeridos**: 
- screenshot-01.png (XSS)
- screenshot-02.png (Access Control)
- screenshot-06.png (Brute Force)

---

### 💻 SLIDE 5: DEMONSTRAÇÃO - COMO EXECUTAR (3 minutos)
**Título**: "Rodando os Testes Localmente"

**O que dizer**:
```
"Qualquer pessoa consegue rodar estes testes. É bem simples:

Passo 1 - Clone o repositório
  $ git clone https://github.com/tiagopereira0601/appbibliotecaFinal.git

Passo 2 - Instale as dependências
  $ npm install
  $ npx playwright install

Passo 3 - Rode os testes
  $ npm run test:security

Pronto! Os testes rodam em 3 navegadores diferentes:
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)

Isso garante compatibilidade total.
"
```

**Mostre Ao Vivo**:
1. Abra terminal PowerShell
2. Digite cada comando
3. Deixe rodar (5-10 minutos)
4. Quando terminar, abra o relatório HTML

---

### 📁 SLIDE 6: ESTRUTURA DO PROJETO (2 minutos)
**Título**: "Arquivo do Projeto - Organização"

**O que dizer**:
```
"Todo o trabalho está bem organizado e documentado:

📂 /tests/e2e/
   └─ biblioteca.spec.ts ............ 5 testes de negócio
   └─ auth-security.spec.ts ......... 5+ testes de segurança

📂 /docs/segurança/
   ├─ SECURITY.md .................. Documento SDD (5 fases)
   ├─ OWASP-RELATORIO.md ........... Análise dos 10 itens OWASP
   ├─ SDD-SPEC.md .................. Especificação técnica
   └─ /evidencias/
      ├─ /screenshots/ ............. 10+ imagens de testes
      ├─ /videos/ .................. Gravações dos testes
      └─ /relatorios-playwright/ ... Relatórios HTML

📄 Documentação Raiz:
   ├─ README-SDD.md ................ Overview (começar aqui!)
   ├─ RELATORIO-FINAL-SDD.md ....... Resumo executivo
   └─ CHECKLIST-FINAL-ENTREGA.md ... Este checklist (21 testes)
"
```

**Mostre**:
- Abra VS Code
- Expanda as pastas em Explorer
- Mostre alguns dos arquivos

---

### 🎯 SLIDE 7: RESULTADOS E EVIDÊNCIAS (2 minutos)
**Título**: "Evidências Coletadas"

**O que dizer**:
```
"Cada teste gerou evidência visual:

✅ 10 Screenshots
   - Um para cada um dos principais testes
   - Nomeadas screenshot-01.png até screenshot-10.png
   - Mostram a tela da aplicação durante o teste

✅ Vídeos
   - Gravações completas dos testes rodando
   - Mostram o Playwright executando passo-a-passo

✅ Relatórios Playwright HTML
   - Relatório interativo com todos os resultados
   - Timeline de cada teste
   - Logs detalhados de falhas (se houve)

Tudo está em /docs/segurança/evidencias/
"
```

**Mostre**:
- Navegue até a pasta de evidências
- Clique em alguns screenshots
- Se tiver tempo, abra um relatório HTML

---

### 📊 SLIDE 8: RESUMO FINAL (1 minuto)
**Título**: "Checklist de Entrega"

**O que dizer**:
```
"Entregamos tudo conforme solicitado:

✅ Processo SDD - Documentado em 5 fases
✅ 21 Testes Playwright - Com 10+ evidências
✅ OWASP Top 10 - Analisados (10/10 itens)
✅ GitHub - Código e relatórios
✅ Documentação Completa - 8 documentos

ESTATÍSTICAS:
- 21 cenários de teste
- 10 itens OWASP mapeados
- 10+ screenshots e vídeos
- 15+ commits no Git
- 5 fases de SDD documentadas

Status: ✅ COMPLETO E PRONTO PARA PRODUÇÃO
"
```

**Mostre**:
- Arquivo: CHECKLIST-FINAL-ENTREGA.md
- Seção "📊 Estatísticas da Entrega"

---

### ❓ SLIDE 9: PERGUNTAS FREQUENTES (1 minuto)
**Título**: "Q&A"

**Prepare respostas para**:

❓ **"Por que SDD?"**
```
Resposta: SDD coloca segurança desde o início, não como 
"add-on" no final. É mais barato corrigir vulnerabilidades 
no design do que depois que o código está pronto.
```

❓ **"Como você mapeou para OWASP?"**
```
Resposta: Cada teste está nomeado com o item OWASP que 
cobre. Test-01 = A03 (Injection). Test-02 = A01 (Access Control).
Isso garante que cobrimos os riscos mais críticos.
```

❓ **"Todos os testes passam?"**
```
Resposta: Sim! [Mostre o relatório HTML]. 
Se houvesse falha, significaria que a vulnerabilidade 
NÃO foi resolvida, e teríamos que corrigir.
```

❓ **"Quanto tempo levou para fazer?"**
```
Resposta: Aproximadamente [X horas/dias]. 
Porque tivemos que estudar SDD, OWASP, e Playwright, 
depois implementar os testes e coletar evidências.
```

---

## 🎬 ROTEIRO DE DEMONSTRAÇÃO AO VIVO (Melhor Impacto)

### **Tempo Total: 5-10 minutos**

**Passo 1: Mostrar o Repositório GitHub (1 min)**
```
- Abra https://github.com/tiagopereira0601/appbibliotecaFinal
- Aponte a pasta /docs/segurança/
- Aponte a pasta /tests/
- Mostre os commits com mensagens descritivas
```

**Passo 2: Rodar um Teste Específico (3-5 min)**
```bash
# Execute apenas um teste de forma rápida
npx playwright test tests/e2e/biblioteca.spec.ts -g "XSS"

# Ou execute todos com:
npm run test:security

# Enquanto roda, explique o que vê na tela
```

**Passo 3: Abrir o Relatório HTML (1-2 min)**
```bash
npm run test:security:report
```

**Passo 4: Mostrar Screenshots (1 min)**
- Navegue até [docs/segurança/evidencias/screenshots/](docs/segurança/evidencias/screenshots/)
- Mostre 3-4 screenshots principais

---

## 💡 DICAS DE APRESENTAÇÃO

### ✅ O QUE FAZER:

1. **Começar pelo "Por Quê"**
   - Antes de falar em testes, explique POR QUE segurança importa
   - Exemplo: "Um ataque XSS pode roubar senhas dos usuários"

2. **Usar Analogias**
   - "SDD é como construir uma casa: você já coloca alarme enquanto constrói, 
     não espera ficar pronta e roubarem"
   - "Testes são como exercícios de segurança: praticamos os cenários ruins 
     para saber como defendê-los"

3. **Demonstração > Slides**
   - Se conseguir rodar os testes ao vivo, FAÇA ISSO
   - Ver o Playwright rodando é muito mais impactante que screenshots

4. **Destacar o Mínimo Cumprido**
   - Projeto pediu 10+ testes? Você fez 21 ✅
   - Documentação SDD? Documentou 5 fases ✅
   - GitHub? Tudo lá com commits ✅

5. **Preparar Respostas Técnicas**
   - Por que Playwright?
   - Por que esses 10 testes OWASP específicos?
   - Como sabe que o XSS foi realmente evitado?

### ❌ O QUE EVITAR:

1. **Não ler slides palavra por palavra**
   - Use os slides como guia, converse naturalmente

2. **Não entrar em detalhes demais de código**
   - Foco é em "segurança funcionou", não em implementação detalhada

3. **Não deixar silêncio incômodo**
   - Se algo rodar por 30 segundos, use para explicar outras partes

4. **Não esquecer que é apresentação de SDD**
   - Testes são EVIDÊNCIA do SDD, não o foco principal

---

## 📝 SCRIPT DE ABERTURA (MEMORIZE ISTO)

```
"Professor, colegas, boa tarde!

Desenvolvemos a Biblioteca Virtual utilizando 
Security Driven Development, uma metodologia 
que estudamos em sala de aula.

Isso significa que:
1. Pensamos em segurança DESDE O INÍCIO, não no final
2. Identificamos possíveis ataques (Threat Modeling)
3. Projetamos defesas (Design Seguro)
4. Implementamos com validações
5. Testamos automaticamente se funciona
6. Documentamos tudo

Como prova, desenvolvemos 21 testes automatizados 
usando Playwright, cada um mapeado a um dos 10 
riscos mais críticos identificados pelo OWASP.

Vou mostrar rapidamente como funciona e rodar 
um teste ao vivo para vocês verem.
"
```

---

## 🎯 SLIDE DE ENCERRAMENTO

**Título**: "Obrigado! Perguntas?"

**Deixe claro**:
- Código completo no GitHub
- Todos os testes passando
- Documentação acessível
- Pronto para deploy

---

## 📌 ARQUIVOS PARA TER ABERTOS DURANTE APRESENTAÇÃO

1. GitHub: https://github.com/tiagopereira0601/appbibliotecaFinal
2. VS Code: `/docs/segurança/SECURITY.md`
3. VS Code: `/docs/segurança/OWASP-RELATORIO.md`
4. Pasta: `/docs/segurança/evidencias/screenshots/`
5. Terminal: Pronto para rodar `npm run test:security`

---

## ⏱️ TIMING TOTAL

- Intro: 1 min
- SDD Explicado: 2 min
- OWASP: 2 min
- Testes (com demo): 5 min
- Estrutura: 2 min
- Evidências: 2 min
- Resumo: 1 min
- Q&A: 2 min
- **TOTAL: 17 minutos** ✅

