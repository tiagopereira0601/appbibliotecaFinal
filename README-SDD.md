# 📚 Biblioteca Virtual - Security Driven Development (SDD)

![Biblioteca Virtual](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)
![Testes](https://img.shields.io/badge/Testes-10%2B-green?style=flat-square)
![OWASP](https://img.shields.io/badge/OWASP-Top%2010-red?style=flat-square)
![SDD](https://img.shields.io/badge/SDD-Completo-success?style=flat-square)

---

## 🎯 Sobre este Projeto

Este é um projeto de **Biblioteca Virtual** desenvolvido com **Security Driven Development (SDD)**, integrado ao app Expo existente. O projeto implementa:

✅ **Processo SDD Completo** - 5 fases de desenvolvimento seguro  
✅ **Análise OWASP Top 10** - Identificação e mitigação de vulnerabilidades  
✅ **10+ Testes Automatizados** - Playwright com evidências completas  
✅ **CI/CD Seguro** - GitHub Actions com validações de segurança  
✅ **Documentação Técnica** - Relatórios e guias detalhados  

---

## 📋 Conteúdo

### 🔐 Segurança

- **[SECURITY.md](docs/segurança/SECURITY.md)** - Processo SDD completo em 5 fases
- **[OWASP-RELATORIO.md](docs/segurança/OWASP-RELATORIO.md)** - Análise de todos os 10 itens OWASP
- **[SDD-SPEC.md](docs/segurança/SDD-SPEC.md)** - Especificação técnica completa

### 🧪 Testes

- **[tests/README.md](tests/README.md)** - Guia de execução dos testes
- **[tests/e2e/biblioteca.spec.ts](tests/e2e/biblioteca.spec.ts)** - Testes 01-05 (Biblioteca)
- **[tests/e2e/auth-security.spec.ts](tests/e2e/auth-security.spec.ts)** - Testes 06-10 (Autenticação)

### 🚀 CI/CD

- **[.github/workflows/security-tests.yml](.github/workflows/security-tests.yml)** - Workflow automatizado

---

## 🚀 Quick Start

### 1. Instalar Dependências
```bash
npm install
npx playwright install
```

### 2. Iniciar Servidor
```bash
npm run web
```

### 3. Executar Testes de Segurança
```bash
npm run test:security
```

### 4. Visualizar Relatório
```bash
npm run test:security:report
```

---

## 📊 Testes Implementados

### Biblioteca Virtual (5 testes)

| # | Teste | OWASP | Descrição |
|---|-------|-------|-----------|
| 01 | XSS Prevention | A03 | Injeta script na busca e valida escapamento |
| 02 | Access Control | A01 | Tenta emprestar >3 livros (deve bloquear) |
| 03 | Review Restriction | A01 | Review bloqueado com livro emprestado |
| 04 | Admin Isolation | A01 | /admin bloqueado para usuários comuns |
| 05 | Data Integrity | A08 | Valida checksums de sincronização |

### Autenticação & Sistema (5+ testes)

| # | Teste | OWASP | Descrição |
|---|-------|-------|-----------|
| 06 | Brute Force | A07 | Bloqueia após múltiplas tentativas |
| 07 | Password Validation | A04 | Rejeita senhas fracas |
| 08 | Session Timeout | A07 | Logout após 15 min inatividade |
| 09 | CSRF Protection | A04 | Valida token CSRF em POST |
| 10 | Rate Limiting | A04 | Bloqueia requisições excessivas |

---

## 📸 Evidências

Ao executar os testes, as seguintes evidências são capturadas automaticamente:

```
docs/segurança/evidencias/
├── screenshots/          ← Screenshots de cada teste
│   ├── test-01-xss-*.png
│   ├── test-02-access-*.png
│   ├── test-04-admin-*.png
│   ├── test-05-integrity-*.png
│   ├── test-06-brute-*.png
│   ├── test-08-session-*.png
│   ├── test-09-csrf-*.png
│   └── test-10-rate-limit-*.png
├── videos/              ← Gravações (opcional)
└── relatorios-playwright/
    ├── index.html       ← Relatório visual
    └── test-results.json
```

---

## 🔐 Cobertura OWASP

```
A01 - Broken Access Control      ✅ (Testes 02, 03, 04)
A02 - Cryptographic Failures     ⏳ (Futuro)
A03 - Injection (XSS)            ✅ (Teste 01)
A04 - Insecure Design            ✅ (Testes 07, 09, 10)
A05 - Security Misconfiguration  ⏳ (Futuro)
A06 - Vulnerable Components      ✅ (npm audit)
A07 - Authentication Failures    ✅ (Testes 06, 08)
A08 - Data Integrity Failures    ✅ (Teste 05)
A09 - Logging & Monitoring       🟡 (Parcial)
A10 - SSRF / XXE                 ✅ (N/A)

Cobertura: 70% (7/10 completos)
```

---

## 📝 Comandos Úteis

```bash
# Executar todos os testes
npm run test:security

# Teste específico
npm run test:security -- -g "XSS Prevention"

# Interface visual (UI Mode)
npm run test:security:ui

# Debug interativo
npm run test:security:debug

# Relatório HTML
npm run test:security:report

# Watch mode (re-executa ao salvar)
npm run test:security:watch

# Com vídeo
npm run test:security -- --headed --video on

# Apenas navegador específico
npm run test:security -- --project=chromium
```

---

## 📚 Estrutura de Pastas

```
appfinal/
├── .github/
│   └── workflows/
│       └── security-tests.yml        ← CI/CD Pipeline
├── docs/
│   └── segurança/
│       ├── SECURITY.md               ← Processo SDD
│       ├── OWASP-RELATORIO.md        ← Análise OWASP
│       ├── SDD-SPEC.md               ← Spec Técnica
│       └── evidencias/               ← Screenshots + Relatórios
├── tests/
│   ├── README.md
│   ├── playwright.config.ts
│   ├── e2e/
│   │   ├── biblioteca.spec.ts        ← Testes 01-05
│   │   └── auth-security.spec.ts     ← Testes 06-10
│   ├── fixtures/
│   │   └── test-data.json
│   └── utils/
│       └── security-checks.ts
└── package.json
```

---

## 🔄 Fluxo de Desenvolvimento SDD

### Fase 1: Threat Modeling ✅
- Identificação de ativos críticos
- Análise de ameaças (OWASP mapping)
- Documentação em `SECURITY.md`

### Fase 2: Secure Design ✅
- Arquitetura com camadas de proteção
- Princípios de segurança aplicados
- Design patterns documentados

### Fase 3: Secure Implementation ✅
- AuthContext estendido com roles
- BibliotecaContext com validações
- Input sanitization + output encoding

### Fase 4: Security Testing ✅
- 10+ testes Playwright
- Cobertura de OWASP items
- Evidências capturadas

### Fase 5: Audit & Documentation ✅
- Relatórios OWASP
- Documentação técnica
- CI/CD pipeline

---

## 🎓 Para Fins Acadêmicos

Este projeto demonstra implementação prática de:

📚 **Security Driven Development** - Metodologia completa  
📚 **OWASP Top 10** - Identificação e mitigação  
📚 **Testes Automatizados** - Playwright + TypeScript  
📚 **DevSecOps** - CI/CD com validações de segurança  
📚 **Documentação Técnica** - Relatórios profissionais  

Ideal para:
- Disciplinas de Segurança de Sistemas
- Desenvolvimento Seguro
- Testes de Segurança
- DevSecOps
- Conformidade e Compliance

---

## ⚙️ Requisitos

- **Node.js** 18+
- **npm** 9+
- **Navegador** Chrome/Firefox/Safari (simulado pelo Playwright)
- **Git** (para versionamento)

---

## 🔄 CI/CD Automático

Push para `main` ou `develop` ativa:

✅ Testes de segurança (Playwright)  
✅ Auditoria de dependências (npm audit)  
✅ Validação de qualidade de código  
✅ Captura de evidências  
✅ Geração de relatórios  

[Veja workflow](.github/workflows/security-tests.yml)

---

## 📈 Resultados Esperados

```
✓ 10 testes passando
✓ 70% cobertura OWASP
✓ 8+ screenshots de evidências
✓ Relatório HTML interativo
✓ 0 vulnerabilidades críticas
✓ CI/CD verde no GitHub
```

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| Testes timeout | Aumentar: `timeout: 60000` em `playwright.config.ts` |
| Screenshots vazias | Usar `--headed` para ver o que acontece |
| App não inicia | Verificar porta 3000 (mudar em `.env.test` se necessário) |
| Elemento não encontrado | Usar `--debug` para inspecionar DOM |

Mais detalhes em [tests/README.md](tests/README.md)

---

## 📞 Suporte

**Documentação Técnica**: Veja [docs/segurança/SECURITY.md](docs/segurança/SECURITY.md)  
**Como Executar**: Veja [tests/README.md](tests/README.md)  
**Detalhes OWASP**: Veja [docs/segurança/OWASP-RELATORIO.md](docs/segurança/OWASP-RELATORIO.md)

---

## 📄 Licença

Projeto educacional - Foco em segurança e boas práticas de desenvolvimento.

---

## 🎉 Status

| Item | Status |
|------|--------|
| Documentação SDD | ✅ |
| Análise OWASP | ✅ |
| 10+ Testes | ✅ |
| Evidências | ✅ |
| CI/CD | ✅ |
| Pronto para Produção | 🟡 (Teste primeiro) |

---

**Última Atualização**: 2026-06-22  
**Versão**: 1.0.0  
**Desenvolvido com**: 🔒 Security First + Playwright + OWASP
