# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\biblioteca.spec.ts >> 🔐 BIBLIOTECA VIRTUAL - Testes de Segurança >> Teste 01: XSS Prevention em Busca >> ⚠️ Deve sanitizar múltiplos payloads XSS diferentes
- Location: tests\e2e\biblioteca.spec.ts:75:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="Buscar livros..."]')

```

# Page snapshot

```yaml
- generic [ref=e2]: Cannot GET /biblioteca/search
```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test';
  2   | import testData from '../fixtures/test-data.json';
  3   | import { securityUtils } from '../utils/security-checks';
  4   | 
  5   | /**
  6   |  * TESTES DE SEGURANÇA - BIBLIOTECA VIRTUAL
  7   |  * 5 casos principais focados em vulnerabilidades OWASP
  8   |  *
  9   |  * ✅ Teste 01: XSS Prevention em Busca
  10  |  * ✅ Teste 02: Access Control - Limite de Empréstimos
  11  |  * ✅ Teste 03: Review Restriction - Apenas Pós-Devolução
  12  |  * ✅ Teste 04: Admin Isolation - /admin Bloqueado
  13  |  * ✅ Teste 05: Data Integrity - Validação de Sincronização
  14  |  */
  15  | 
  16  | test.describe('🔐 BIBLIOTECA VIRTUAL - Testes de Segurança', () => {
  17  |   test.beforeEach(async ({ page }) => {
  18  |     // Faz login como reader antes de cada teste
  19  |     await page.goto('http://localhost:3000/login');
  20  |     await page.fill('input[name="email"]', testData.testUsers.reader.email);
  21  |     await page.fill('input[name="password"]', testData.testUsers.reader.password);
  22  |     await page.click('button:has-text("Entrar")');
  23  |     await page.waitForLoadState('networkidle');
  24  |   });
  25  | 
  26  |   test.describe('Teste 01: XSS Prevention em Busca', () => {
  27  |     test('⚠️ Deve rejeitar e escapar payload de XSS na busca', async ({
  28  |       page,
  29  |     }) => {
  30  |       // Navega para página de busca
  31  |       await page.goto('http://localhost:3000/biblioteca/search');
  32  |       await page.waitForLoadState('networkidle');
  33  | 
  34  |       // Tenta injetar XSS
  35  |       const xssPayload = testData.xssPayloads[0]; // "<script>alert('xss')</script>"
  36  |       await page.fill('input[placeholder="Buscar livros..."]', xssPayload);
  37  |       await page.press('input[placeholder="Buscar livros..."]', 'Enter');
  38  | 
  39  |       // Aguarda resultados
  40  |       await page.waitForLoadState('networkidle');
  41  | 
  42  |       // Valida que script NÃO foi executado
  43  |       const scriptExecuted = await page.evaluate(() => {
  44  |         return !!window.scriptExecuted;
  45  |       });
  46  | 
  47  |       expect(scriptExecuted).toBe(false);
  48  | 
  49  |       // Valida que o payload é escapado no resultado
  50  |       const resultContent = await page.locator('.search-results').innerText();
  51  |       const hasLiteralScript =
  52  |         resultContent.includes('&lt;script&gt;') ||
  53  |         resultContent.includes('&amp;lt;script&amp;gt;');
  54  | 
  55  |       expect(hasLiteralScript).toBeTruthy();
  56  | 
  57  |       // Captura evidência
  58  |       await securityUtils.captureEvidence(page, 'test-01-xss', 'safe-output');
  59  | 
  60  |       // Registra resultado
  61  |       securityUtils.generateTestReport(
  62  |         'test-01-xss',
  63  |         'PASS',
  64  |         {
  65  |           payload: xssPayload,
  66  |           scriptExecuted: false,
  67  |           properlyEscaped: true,
  68  |         },
  69  |         'A03: Injection'
  70  |       );
  71  | 
  72  |       console.log('✅ Teste 01 PASSOU: XSS Prevention validado');
  73  |     });
  74  | 
  75  |     test('⚠️ Deve sanitizar múltiplos payloads XSS diferentes', async ({
  76  |       page,
  77  |     }) => {
  78  |       for (const payload of testData.xssPayloads.slice(0, 3)) {
  79  |         await page.goto('http://localhost:3000/biblioteca/search');
> 80  |         await page.fill('input[placeholder="Buscar livros..."]', payload);
      |                    ^ Error: page.fill: Test timeout of 30000ms exceeded.
  81  |         await page.press('input[placeholder="Buscar livros..."]', 'Enter');
  82  |         await page.waitForLoadState('networkidle');
  83  | 
  84  |         // Valida que nenhum script foi executado
  85  |         const scriptCount = await page.locator('script[data-test="injected"]').count();
  86  |         expect(scriptCount).toBe(0);
  87  |       }
  88  | 
  89  |       console.log('✅ Teste 01 (Extended): Múltiplos payloads sanitizados');
  90  |     });
  91  |   });
  92  | 
  93  |   test.describe('Teste 02: Access Control - Limite de Empréstimos', () => {
  94  |     test('🔒 Deve bloquear empréstimo de 4º livro (máx 3)', async ({
  95  |       page,
  96  |     }) => {
  97  |       // Simula que usuário já tem 3 empréstimos ativos
  98  |       // (Usando API mock ou IndexedDB direto)
  99  |       const existingLoans = [
  100 |         { id: 'loan-1', bookId: 'book-001', status: 'active' },
  101 |         { id: 'loan-2', bookId: 'book-002', status: 'active' },
  102 |         { id: 'loan-3', bookId: 'book-003', status: 'active' },
  103 |       ];
  104 | 
  105 |       // Armazena no localStorage para simular estado
  106 |       await page.evaluate((loans) => {
  107 |         localStorage.setItem('userLoans', JSON.stringify(loans));
  108 |       }, existingLoans);
  109 | 
  110 |       // Tenta emprestar 4º livro
  111 |       await page.goto('http://localhost:3000/biblioteca');
  112 |       await page.click(`button:has-text("${testData.testBooks[3].title}")`);
  113 |       await page.click('button:has-text("Emprestar")');
  114 | 
  115 |       // Valida erro
  116 |       const errorMessage = await page.locator('.error-message').innerText();
  117 |       expect(errorMessage).toContain('limite de 3 empréstimos');
  118 | 
  119 |       // Captura evidência
  120 |       await securityUtils.captureEvidence(
  121 |         page,
  122 |         'test-02-access-control',
  123 |         'limit-exceeded'
  124 |       );
  125 | 
  126 |       // Registra
  127 |       securityUtils.generateTestReport(
  128 |         'test-02-access-control',
  129 |         'PASS',
  130 |         {
  131 |           currentLoans: 3,
  132 |           attemptedAction: 'borrow',
  133 |           blocked: true,
  134 |           errorMessage,
  135 |         },
  136 |         'A01: Broken Access Control'
  137 |       );
  138 | 
  139 |       console.log('✅ Teste 02 PASSOU: Access Control validado');
  140 |     });
  141 | 
  142 |     test('🔒 Deve permitir renovação de empréstimo sem contar limite', async ({
  143 |       page,
  144 |     }) => {
  145 |       // Setup: 3 empréstimos ativos
  146 |       const loans = [
  147 |         { id: 'loan-1', bookId: 'book-001', status: 'active' },
  148 |         { id: 'loan-2', bookId: 'book-002', status: 'active' },
  149 |         { id: 'loan-3', bookId: 'book-003', status: 'active' },
  150 |       ];
  151 | 
  152 |       await page.evaluate((loansData) => {
  153 |         localStorage.setItem('userLoans', JSON.stringify(loansData));
  154 |       }, loans);
  155 | 
  156 |       // Tenta renovar loan-1 (deve ser permitido)
  157 |       await page.goto('http://localhost:3000/biblioteca/meus-emprestimos');
  158 |       await page.click('button:has-text("Renovar")', { nth: 0 });
  159 | 
  160 |       // Valida sucesso
  161 |       const successMessage = await page.locator('.success-message').innerText();
  162 |       expect(successMessage).toContain('Renovado');
  163 | 
  164 |       console.log('✅ Teste 02 (Extended): Renovação permitida sem contar limite');
  165 |     });
  166 |   });
  167 | 
  168 |   test.describe('Teste 03: Review Restriction - Apenas Pós-Devolução', () => {
  169 |     test('📝 Deve bloquear review com livro emprestado', async ({ page }) => {
  170 |       // Busca um livro com empréstimo ativo
  171 |       const activeLoan = { bookId: 'book-001', status: 'active' };
  172 | 
  173 |       await page.goto('http://localhost:3000/biblioteca/details/book-001');
  174 |       await page.waitForLoadState('networkidle');
  175 | 
  176 |       // Tenta clicar em "Avaliar"
  177 |       const reviewButton = page.locator('button:has-text("Avaliar Livro")');
  178 |       const isEnabled = await reviewButton.isEnabled();
  179 | 
  180 |       expect(isEnabled).toBe(false);
```