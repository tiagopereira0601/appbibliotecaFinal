# 🔐 Guia de Execução - Testes de Segurança Playwright

**Última Atualização**: 2026-06-22  
**Status**: 10+ testes implementados com SDD + OWASP

---

## 📋 Sumário dos Testes

### Biblioteca Virtual (5 testes)
| # | Nome | OWASP | Arquivo |
|---|------|-------|---------|
| 01 | XSS Prevention em Busca | A03 | `biblioteca.spec.ts` |
| 02 | Access Control - Limite Empréstimos | A01 | `biblioteca.spec.ts` |
| 03 | Review Restriction - Pós-Devolução | A01 | `biblioteca.spec.ts` |
| 04 | Admin Isolation - /admin Bloqueado | A01 | `biblioteca.spec.ts` |
| 05 | Data Integrity - Sincronização | A08 | `biblioteca.spec.ts` |

### Autenticação & Sistema (5+ testes)
| # | Nome | OWASP | Arquivo |
|---|------|-------|---------|
| 06 | Brute Force Protection | A07 | `auth-security.spec.ts` |
| 07 | Password Validation | A04 | `auth-security.spec.ts` |
| 08 | Session Timeout | A07 | `auth-security.spec.ts` |
| 09 | CSRF Protection | A04 | `auth-security.spec.ts` |
| 10 | Rate Limiting | A04 | `auth-security.spec.ts` |

---

## 🚀 Como Executar

### 1. Instalação de Dependências

```bash
# Instalar Playwright
npm install --save-dev @playwright/test

# Instalar navegadores
npx playwright install

# Outras dependências
npm install --save-dev @types/node
```

### 2. Setup do Projeto

```bash
# Estrutura esperada
mkdir -p tests/{e2e,fixtures,utils}
mkdir -p docs/segurança/evidencias/{screenshots,videos,relatorios-playwright}
```

### 3. Configurar Variáveis de Ambiente

```bash
# .env.test
BASE_URL=http://localhost:3000
NODE_ENV=test
```

### 4. Executar Testes

#### **Todos os testes**
```bash
npx playwright test
```

#### **Apenas testes de biblioteca**
```bash
npx playwright test tests/e2e/biblioteca.spec.ts
```

#### **Apenas testes de autenticação**
```bash
npx playwright test tests/e2e/auth-security.spec.ts
```

#### **Teste específico**
```bash
# Teste 01: XSS Prevention
npx playwright test -g "Deve rejeitar e escapar payload de XSS"

# Teste 02: Access Control
npx playwright test -g "Deve bloquear empréstimo de 4º livro"
```

#### **Com relatório HTML**
```bash
npx playwright test && npx playwright show-report
```

#### **Em modo debug**
```bash
npx playwright test --debug
```

#### **Com gravação de vídeo**
```bash
npx playwright test --headed --video on
```

---

## 📊 Visualizar Resultados

### Relatório HTML
```bash
npx playwright show-report
# Abre: test-results/html/index.html
```

### Evidências Capturadas
```
docs/segurança/evidencias/
├── screenshots/
│   ├── test-01-xss-safe-output-*.png
│   ├── test-02-access-control-limit-exceeded-*.png
│   ├── test-04-admin-isolation-access-blocked-*.png
│   ├── test-05-integrity-checksum-valid-*.png
│   ├── test-06-brute-force-lockout-triggered-*.png
│   ├── test-08-session-timeout-logged-out-*.png
│   ├── test-09-csrf-token-validated-*.png
│   └── test-10-rate-limit-blocked-*.png
├── videos/
│   └── *.mp4 (se --video on)
└── relatorios-playwright/
    ├── index.html (relatório visual)
    ├── test-results.json (dados JSON)
    └── *.log (logs de auditoria)
```

---

## 🔍 Analisando Resultados

### 1. Via Terminal
```bash
# Mostra resumo dos testes
npx playwright test --reporter=list
```

**Exemplo de Output:**
```
✓ Teste 01: XSS Prevention [chromium] (5.2s)
✓ Teste 02: Access Control - Limite de Empréstimos [chromium] (3.8s)
✓ Teste 03: Review Restriction [chromium] (2.5s)
✓ Teste 04: Admin Isolation [chromium] (2.1s)
✓ Teste 05: Data Integrity [chromium] (4.3s)
✓ Teste 06: Brute Force Protection [chromium] (8.5s)
✓ Teste 07: Password Validation [chromium] (3.2s)
✓ Teste 08: Session Timeout [chromium] (18.5s)
✓ Teste 09: CSRF Protection [chromium] (2.8s)
✓ Teste 10: Rate Limiting [chromium] (10.2s)

10 passed (60.1s)
```

### 2. Via Relatório HTML
```bash
npx playwright show-report

# Mostra:
# - Histórico de execuções
# - Screenshots de falhas
# - Vídeos (se capturados)
# - Timings por teste
# - Logs de erro
```

### 3. Via JSON
```bash
cat test-results/results.json | jq '.[].title'

# Output:
# "Deve rejeitar e escapar payload de XSS na busca"
# "Deve bloquear empréstimo de 4º livro (máx 3)"
# ...
```

---

## 📸 Evidências Esperadas

Cada teste deve capturar evidências automaticamente em:

### Teste 01 - XSS Prevention
```
✅ Screenshot: test-01-xss-safe-output-*.png
   - Mostra output escapado sem script executado
✅ Log: "Script NÃO foi executado"
```

### Teste 02 - Access Control
```
✅ Screenshot: test-02-access-control-limit-exceeded-*.png
   - Mostra mensagem de erro "limite de 3 empréstimos"
✅ Log: "Access Control validado"
```

### Teste 04 - Admin Isolation
```
✅ Screenshot: test-04-admin-isolation-access-blocked-*.png
   - Mostra redireção para login ou "Não autorizado"
✅ Auditoria: UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT registrado
```

### Teste 06 - Brute Force
```
✅ Screenshot: test-06-brute-force-lockout-triggered-*.png
   - Mostra "Muitas tentativas"
✅ Log: Brute force bloqueado após 5 tentativas
✅ Auditoria: BRUTE_FORCE_LOCKOUT registrado
```

### Teste 08 - Session Timeout
```
✅ Screenshot: test-08-session-timeout-logged-out-*.png
   - Mostra redireção para login
✅ Log: "Session timeout após inatividade"
```

---

## 🔧 Troubleshooting

### Problema: Tests falhando com timeout

```bash
# Aumentar timeout global
npx playwright test --timeout=60000

# Ou em playwright.config.ts
timeout: 60000
```

### Problema: Screenshot não capturado

```bash
# Usar --headed para ver o que está acontecendo
npx playwright test --headed

# Verificar se diretórios existem
ls docs/segurança/evidencias/screenshots/
```

### Problema: Testes não encontram elementos

```bash
# Verificar seletores em debug mode
npx playwright test --debug

# Usar inspector do Playwright
npx playwright codegen http://localhost:3000
```

### Problema: App não inicia

```bash
# Começar servidor manualmente
npm run dev

# Em outro terminal
npx playwright test --webServer-none
```

---

## 📝 Integrando com CI/CD

### GitHub Actions

Criar `.github/workflows/security-tests.yml`:

```yaml
name: Security Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run security tests
        run: npm run test:security
      
      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: test-results/
```

Adicionar script em `package.json`:

```json
{
  "scripts": {
    "test:security": "playwright test",
    "test:security:ui": "playwright test --ui",
    "test:security:debug": "playwright test --debug",
    "test:security:report": "playwright show-report"
  }
}
```

---

## ✅ Checklist de Entrega

Antes de fazer commit:

- [ ] ✅ Todos os 10+ testes passando
- [ ] ✅ Screenshots capturados em `/docs/segurança/evidencias/screenshots/`
- [ ] ✅ Relatório HTML gerado
- [ ] ✅ SECURITY.md documentado
- [ ] ✅ OWASP-RELATORIO.md atualizado
- [ ] ✅ Arquivo `playwright.config.ts` configurado
- [ ] ✅ Utilitários em `/tests/utils/`
- [ ] ✅ Fixtures de dados em `/tests/fixtures/`
- [ ] ✅ GitHub Actions workflow configurado
- [ ] ✅ README com instruções (este arquivo)

---

## 📚 Estrutura Final do Projeto

```
appfinal/
├── .github/
│   └── workflows/
│       └── security-tests.yml
├── docs/
│   └── segurança/
│       ├── SECURITY.md
│       ├── OWASP-RELATORIO.md
│       └── evidencias/
│           ├── screenshots/
│           │   ├── test-01-xss-safe-output-*.png
│           │   ├── test-02-access-control-*.png
│           │   ├── test-04-admin-isolation-*.png
│           │   ├── test-05-integrity-*.png
│           │   ├── test-06-brute-force-*.png
│           │   ├── test-08-session-timeout-*.png
│           │   ├── test-09-csrf-*.png
│           │   └── test-10-rate-limit-*.png
│           ├── videos/
│           ├── relatorios-playwright/
│           │   ├── index.html
│           │   ├── test-results.json
│           │   └── *.log
├── tests/
│   ├── playwright.config.ts
│   ├── e2e/
│   │   ├── biblioteca.spec.ts (Testes 01-05)
│   │   └── auth-security.spec.ts (Testes 06-10)
│   ├── fixtures/
│   │   └── test-data.json
│   └── utils/
│       └── security-checks.ts
└── package.json
```

---

## 🎯 Próximas Etapas

1. **Executar todos os testes**: `npm run test:security`
2. **Gerar relatório**: `npm run test:security:report`
3. **Revisar evidências**: Verificar screenshots em `/docs/segurança/evidencias/`
4. **Fazer commit**: Commitar todos os arquivos ao Git
5. **Push para GitHub**: Enviar com mensagem estruturada

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consultar [documentação do Playwright](https://playwright.dev)
2. Verificar logs em `test-results/`
3. Usar `--debug` para análise interativa
4. Consultar SECURITY.md para detalhes de segurança

---

**Desenvolvido com**: Playwright + TypeScript + Security Driven Development  
**Data**: 2026-06-22  
**Status**: ✅ Pronto para Produção
