# 🔧 COMANDOS ESSENCIAIS

## 📥 INSTALAÇÃO INICIAL

```bash
# Instalar todas as dependências
npm install

# Instalar navegadores Playwright
npx playwright install
```

---

## 🚀 EXECUTAR TESTES

### Opção 1: Teste Simples
```bash
# Terminal 1: Servidor
node tests/mock-server.js

# Terminal 2: Todos os testes
npm run test:security
```

### Opção 2: Modo UI (Visual)
```bash
# Terminal 1
node tests/mock-server.js

# Terminal 2
npm run test:security:ui
```

### Opção 3: Modo Debug
```bash
# Terminal 1
node tests/mock-server.js

# Terminal 2
npm run test:security:debug
```

### Opção 4: Watch Mode (Monitora mudanças)
```bash
# Terminal 1
node tests/mock-server.js

# Terminal 2
npm run test:security:watch
```

---

## 📊 VISUALIZAR RESULTADOS

```bash
# Abrir relatório HTML no navegador
npm run test:security:report

# Ou manualmente
cd test-results/html
# Abra index.html no navegador
```

---

## 📁 ARQUIVOS IMPORTANTES

```bash
# Leia primeiro
cat RELATORIO-FINAL-SDD.md

# Metodologia
cat docs/segurança/SECURITY.md

# OWASP Analysis
cat docs/segurança/OWASP-RELATORIO.md

# Como rodar testes
cat tests/README.md
```

---

## 🔍 VERIFICAR ESTRUTURA

```bash
# Ver testes implementados
ls -la tests/e2e/

# Ver documentação
ls -la docs/segurança/

# Ver configuração Playwright
cat tests/playwright.config.ts
```

---

## 🌐 SERVIDOR MOCK

```bash
# Iniciar servidor (porta 3000)
node tests/mock-server.js

# Testar conectividade
curl http://localhost:3000/login

# Em PowerShell
Invoke-WebRequest http://localhost:3000/login
```

---

## 🐛 TROUBLESHOOTING

### Se testes não encontram servidor
```bash
# Verifique se mock-server está rodando em outro terminal
node tests/mock-server.js

# Veja se está na porta correta
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### Se Playwright não está instalado
```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Se tem erro de timeout
```bash
# Aumentar timeout nos testes
# Editar: tests/playwright.config.ts
# Linha: timeout: 30000  (aumentar para 60000)
```

---

## 📈 GERAR RELATÓRIOS

```bash
# Relatório HTML (visual)
npm run test:security:report

# Resultado JSON (processável)
cat test-results/results.json

# Relatório JUnit (CI/CD)
cat test-results/junit.xml
```

---

## 🔄 LIMPAR E REINICIAR

```bash
# Limpar cache de testes
rm -rf test-results

# Limpar node_modules
rm -rf node_modules
npm install

# Limpar Playwright cache
rm -rf ~/.ms-playwright
npx playwright install
```

---

## 🎯 FLUXO COMPLETO

```bash
# 1. Setup (fazer uma vez)
npm install
npx playwright install

# 2. Executar (sempre assim)
# Terminal 1:
node tests/mock-server.js

# Terminal 2:
npm run test:security

# 3. Ver resultados
npm run test:security:report
```

---

## 📱 MOBILE TESTING

```bash
# Rodar apenas testes mobile
npx playwright test --grep "Mobile"

# Ou editar playwright.config.ts para selecionar browsers
```

---

## 🔐 VERIFICAR SEGURANÇA

```bash
# Ver configuração de segurança
cat docs/segurança/SECURITY.md

# Ver mapeamento OWASP
cat docs/segurança/OWASP-RELATORIO.md

# Ver requisitos de senha
grep -n "12+" docs/segurança/SECURITY.md
```

---

## 🤖 GITHUB ACTIONS (CI/CD)

```bash
# Ver status do workflow
# Acesse: https://github.com/seu-usuario/sua-repo/actions

# Rodar localmente igual ao GitHub Actions
act -j security-tests

# Ou fazer push
git add .
git commit -m "feat: SDD tests"
git push
```

---

## 📊 ESTATÍSTICAS

```bash
# Contar linhas de código
find tests -name "*.ts" -o -name "*.js" | xargs wc -l

# Contar testes
grep -r "test('" tests/e2e/

# Contar documentação
find docs -name "*.md" | xargs wc -l
```

---

## 💾 BACKUP E ENTREGA

```bash
# Criar arquivo comprimido para entrega
zip -r biblioteca-sdd-testes.zip tests/ docs/ package.json

# Ou tar (Linux/Mac)
tar -czf biblioteca-sdd-testes.tar.gz tests/ docs/ package.json

# Para GitHub
git add -A
git commit -m "feat: Implementação completa SDD + 21 testes Playwright"
git push origin main
```

---

## ✅ CHECKLIST PRÉ-ENTREGA

```bash
# Verificar testes compilam
npm run test:security -- --list

# Verificar documentação existe
ls docs/segurança/SECURITY.md
ls docs/segurança/OWASP-RELATORIO.md

# Verificar servidor funciona
node tests/mock-server.js &
sleep 2
curl http://localhost:3000/login
kill $!

# Verificar npm scripts
npm run | grep test:security
```

---

## 🎓 APRESENTAÇÃO

```bash
# Preparar para apresentação:

# 1. Abrir terminal e iniciar servidor
node tests/mock-server.js

# 2. Abrir outro terminal
npm run test:security:ui

# 3. Mostrar documentação
# - RELATORIO-FINAL-SDD.md
# - OWASP-RELATORIO.md
# - Teste 06 passando

# 4. Demonstrar relatório
npm run test:security:report
# Abre HTML visual
```

---

## 📝 DOCUMENTOS PARA LER

```bash
# Por ordem de importância:
1. README-RAPIDO.md (2 min) ← Comece aqui
2. RELATORIO-FINAL-SDD.md (10 min)
3. docs/segurança/SECURITY.md (15 min)
4. docs/segurança/OWASP-RELATORIO.md (10 min)
5. tests/README.md (5 min)
```

---

## 🎯 RESUMO

| Ação | Comando |
|------|---------|
| Setup | `npm install && npx playwright install` |
| Rodar | `node tests/mock-server.js` + `npm run test:security` |
| Visualizar | `npm run test:security:report` |
| Debugar | `npm run test:security:debug` |
| CI/CD | `git push` (GitHub Actions automático) |

---

**Tudo pronto! Execute: `npm run test:security` agora!**
