 # 🔐 Security Driven Development (SDD) - Biblioteca Virtual

**Data**: 2026-06-22  
**Disciplina**: Segurança de Sistemas & Desenvolvimento Seguro  
**Status**: Em Implementação  

---

## 📌 Visão Geral

Este documento apresenta o **Processo de Security Driven Development (SDD)** aplicado ao projeto de Biblioteca Virtual integrado no Expo. O SDD é uma metodologia que coloca **segurança no centro** do desenvolvimento, não como uma camada adicional.

### Princípios do SDD
```
1. Threat Modeling (Análise de Ameaças)
2. Secure Design (Design Seguro)
3. Secure Implementation (Implementação Segura)
4. Security Testing (Testes de Segurança)
5. Audit & Documentation (Auditoria & Documentação)
```

---

## 🎯 Fase 1: Identificação de Ameaças (Threat Modeling)

### Ativos Críticos do Sistema
| Ativo | Confidencialidade | Integridade | Disponibilidade | Nível |
|-------|-------------------|-------------|-----------------|-------|
| Dados do Usuário (email, nome) | CRÍTICA | CRÍTICA | ALTA | P0 |
| Hash de Senhas | CRÍTICA | CRÍTICA | MÉDIA | P0 |
| Histórico de Empréstimos | ALTA | CRÍTICA | ALTA | P1 |
| Catálogo de Livros | MÉDIA | ALTA | ALTA | P2 |
| Permissões Admin | CRÍTICA | CRÍTICA | ALTA | P0 |
| Avaliações/Reviews | MÉDIA | ALTA | MÉDIA | P2 |

### Ameaças por Categoria (OWASP Top 10 2021)

#### **A01: Broken Access Control** 🔴 CRÍTICO
- **Cenário**: Usuário comum acessa `/admin` diretamente
- **Impacto**: Exfiltração de dados sensíveis
- **Mitigação**: 
  - ✅ Validação de `role` em AuthContext
  - ✅ Route guards no RN/Web
  - ✅ Backend verification (futuro)

#### **A02: Cryptographic Failures** 🔴 CRÍTICO
- **Cenário**: Senhas armazenadas em plain text
- **Impacto**: Comprometimento de contas em caso de breach
- **Mitigação**:
  - ✅ Hash com bcrypt (salt 10+)
  - ✅ Nunca armazenar plain text
  - ✅ SecureStorage no Expo (android keystore/iOS keychain)

#### **A03: Injection (XSS/SQLi)** 🟠 ALTO
- **Cenário**: `<script>alert('xss')</script>` em campo de busca
- **Impacto**: Roubo de sessão, dados sensíveis
- **Mitigação**:
  - ✅ Input sanitization (DOMPurify / React escaping)
  - ✅ Output encoding
  - ✅ Content Security Policy (CSP)

#### **A04: Insecure Design** 🟠 ALTO
- **Cenário**: Sem limite de tentativas de login (brute force)
- **Impacto**: Comprometimento de contas
- **Mitigação**:
  - ✅ Rate limiting (futuro com backend)
  - ✅ Temporização de bloqueio progressivo
  - ⏳ CAPTCHA (fase 2)

#### **A05: Security Misconfiguration** 🟡 MÉDIO
- **Cenário**: Credenciais expostas em .env ou código
- **Impacto**: Comprometimento da aplicação
- **Mitigação**:
  - ✅ .env não commitado
  - ✅ Variáveis de ambiente seguros
  - ✅ Audit de segredos via git hooks

#### **A07: Identification & Authentication Failures** 🔴 CRÍTICO
- **Cenário**: Sessão não expira, tokens sem validade
- **Impacto**: Account takeover
- **Mitigação**:
  - ✅ Session timeout (15 min inatividade)
  - ✅ Re-autenticação para operações sensíveis
  - ✅ JWT com expiração

#### **A08: Data Integrity Failures** 🟠 ALTO
- **Cenário**: Histórico de empréstimos corrompido
- **Impacto**: Inconsistência de dados
- **Mitigação**:
  - ✅ Imutabilidade de histórico
  - ✅ Checksum/Hash de integridade
  - ✅ Backup automático

#### **A09: Logging & Monitoring Failures** 🟡 MÉDIO
- **Cenário**: Ataques não detectados
- **Impacto**: Descoberta tardia de breaches
- **Mitigação**:
  - ✅ Logs de acesso crítico (login, admin actions)
  - ✅ Alertas de falhas múltiplas
  - ⏳ SIEM integration (futuro)

#### **A10: SSRF / Vulnerable Components** 🟡 MÉDIO
- **Cenário**: Biblioteca desatualizada com CVE
- **Impacto**: Execução de código arbitrário
- **Mitigação**:
  - ✅ npm audit regular
  - ✅ Renovabot/Dependabot
  - ✅ Vulnerabilidade disclosure policy

---

## 🛡️ Fase 2: Design Seguro

### Arquitetura de Segurança

```
┌─────────────────────────────────────────┐
│         Mobile (Expo) + Web (HTML/JS)   │
│  ┌─────────────────────────────────┐    │
│  │  AuthContext (com role/perms)   │    │
│  │  • Login/Logout                 │    │
│  │  • Session Management           │    │
│  │  • Token Validation             │    │
│  └─────────────────────────────────┘    │
│                    ↓                     │
│  ┌─────────────────────────────────┐    │
│  │  BibliotecaContext (State Mgmt) │    │
│  │  • Empréstimos (com rules)      │    │
│  │  • Reviews (post-devolução)     │    │
│  │  • Admin Operations (guarded)   │    │
│  └─────────────────────────────────┘    │
│                    ↓                     │
│  ┌─────────────────────────────────┐    │
│  │  LocalStorage/IndexedDB         │    │
│  │  • Dados encriptados (futuro)   │    │
│  │  • Sem dados sensíveis          │    │
│  │  • Audit trail imutável         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Princípios Aplicados

| Princípio | Implementação |
|-----------|---------------|
| **Least Privilege** | Roles: admin, reader; perms granulares |
| **Defense in Depth** | Auth → Route Guard → Data Validation → Output Encoding |
| **Fail Securely** | Nega por padrão; whitelist de perms |
| **Secure by Default** | LocalStorage privado; HTTPS obrigatório |
| **Separation of Concerns** | AuthContext ≠ BibliotecaContext |
| **Input Validation** | Sanitização na entrada; escapar saída |

---

## 🔨 Fase 3: Implementação Segura

### Componentes de Segurança

#### **1. AuthContext Estendido**
```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'reader';
    permissions: Permission[];
    sessionExpiry: number;
  };
  login(email, password): Promise<void>;
  logout(): Promise<void>;
  hasPermission(action): boolean;
  isSessionValid(): boolean;
  refreshSession(): Promise<void>;
}
```

#### **2. BibliotecaContext com Validações**
```typescript
// contexts/BibliotecaContext.tsx
interface BibliotecaContextType {
  emprestar(usuarioId, livroId): Promise<Result>;
  // Valida: maxEmprestimos (3), permissão user, livro disponível
  
  devolverLivro(emprestimoId): Promise<Result>;
  // Auditoria: registra devolução com timestamp
  
  escreverReview(usuarioId, livroId, rating): Promise<Result>;
  // Valida: livro já devolvido, user tem acesso
}
```

#### **3. Route Guards**
```typescript
// app/(abas)/_layout.tsx - verificar role
// app/admin/_layout.tsx - requireAdmin guard
// Rejeita com erro se sem permissão
```

#### **4. Validação de Inputs**
```typescript
// Exemplos:
- Busca: DOMPurify.sanitize() antes de querySQL
- Reviews: máx 500 chars, sem tags HTML
- Email: validação regex + normalization
```

#### **5. Data Privacy**
```typescript
// Histórico de empréstimos
- Usuário vê apenas seu próprio
- Admin vê todos (auditado)
- Imutável após criação
```

---

## ✅ Fase 4: Testes de Segurança (Playwright)

### Cobertura de Testes

#### **Biblioteca Virtual (5 testes)**
1. **XSS Prevention** - Injeta script em busca
2. **Access Control** - Tenta emprestar >3 livros
3. **Review Restriction** - Review pré-devolução blocked
4. **Admin Isolation** - /admin bloqueado para readers
5. **Data Integrity** - Mobile ↔ Web sync validation

#### **Autenticação & Sistema (5+ testes)**
6. **Brute Force** - Login com múltiplas tentativas
7. **Password Validation** - Senhas fracas rejeitadas
8. **Session Timeout** - Logout após 15 min inatividade
9. **CSRF Protection** - Token validation
10. **Rate Limiting** - Bloqueio de requisições excessivas

**Evidências**: Screenshots + HTML Reports em `/docs/segurança/evidencias/`

---

## 📋 Fase 5: Auditoria & Documentação

### Checklist de Segurança

- [ ] AuthContext com role/permissions
- [ ] BibliotecaContext com validações de regra de negócio
- [ ] Route guards em todas as páginas sensíveis
- [ ] Sanitização de inputs (busca, reviews)
- [ ] Encoding de outputs (React escaping)
- [ ] Session management com timeout
- [ ] Histórico imutável
- [ ] 10+ testes Playwright com evidências
- [ ] Relatório OWASP completo
- [ ] GitHub Actions CI/CD com security tests
- [ ] .env seguro (não comitado)
- [ ] npm audit sem vulnerabilidades
- [ ] SECURITY.md documentado
- [ ] Logs de operações críticas

### Responsabilidades

| Papel | Responsabilidade |
|------|-----------------|
| Desenvolvedor | ✅ Seguir guidelines SDD |
| Code Reviewer | ✅ Validar padrões de segurança |
| QA/Security | ✅ Executar testes de segurança |
| DevOps | ✅ Manter CI/CD seguro |

---

## 📚 Referências

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP Secure Coding Practices](https://owasp.org/www-pdf-archive/OWASP_SCP_Quick_Reference_Guide_v2.pdf)
- [NIST Secure Software Development Framework](https://csrc.nist.gov/publications/detail/sp/800-218/final)
- [CWE Top 25](https://cwe.mitre.org/top25/)

---

## 🚀 Próximos Passos

1. ✅ Estender AuthContext com roles
2. ✅ Implementar route guards
3. ✅ Criar BibliotecaContext com validações
4. ✅ Setup Playwright + 10 testes
5. ✅ Gerar evidências (screenshots + reports)
6. ✅ Criar OWASP-RELATORIO.md
7. ✅ Setup GitHub Actions

**Status Atual**: Fase 1 ✅ | Fase 2 🔄 | Fase 3 🔄 | Fase 4 ⏳ | Fase 5 ⏳

---

*Última Atualização: 2026-06-22*
*Desenvolvedor: [Seu Nome]*
