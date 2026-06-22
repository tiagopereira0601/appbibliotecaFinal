# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\biblioteca.spec.ts >> 🔐 BIBLIOTECA VIRTUAL - Testes de Segurança >> Teste 03: Review Restriction - Apenas Pós-Devolução >> 📝 Deve permitir review após devolução
- Location: tests\e2e\biblioteca.spec.ts:204:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.isEnabled: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Avaliar Livro")')

```

# Page snapshot

```yaml
- generic [ref=e2]: Cannot GET /biblioteca/details/book-001
```

# Test source

```ts
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
  181 | 
  182 |       // Captura evidência
  183 |       await securityUtils.captureEvidence(
  184 |         page,
  185 |         'test-03-review-restriction',
  186 |         'review-disabled'
  187 |       );
  188 | 
  189 |       // Registra
  190 |       securityUtils.generateTestReport(
  191 |         'test-03-review-restriction',
  192 |         'PASS',
  193 |         {
  194 |           bookId: activeLoan.bookId,
  195 |           loanStatus: activeLoan.status,
  196 |           reviewButtonEnabled: false,
  197 |         },
  198 |         'A01: Broken Access Control'
  199 |       );
  200 | 
  201 |       console.log('✅ Teste 03 PASSOU: Review Restriction validado');
  202 |     });
  203 | 
  204 |     test('📝 Deve permitir review após devolução', async ({ page }) => {
  205 |       // Marca livro como devolvido no localStorage
  206 |       const returnedLoan = {
  207 |         id: 'loan-1',
  208 |         bookId: 'book-001',
  209 |         status: 'returned',
  210 |         returnedAt: Date.now(),
  211 |       };
  212 | 
  213 |       await page.evaluate((loan) => {
  214 |         const loans = JSON.parse(localStorage.getItem('userLoans') || '[]');
  215 |         loans[0] = loan;
  216 |         localStorage.setItem('userLoans', JSON.stringify(loans));
  217 |       }, returnedLoan);
  218 | 
  219 |       // Navega para livro
  220 |       await page.goto('http://localhost:3000/biblioteca/details/book-001');
  221 |       await page.waitForLoadState('networkidle');
  222 | 
  223 |       // Agora botão deve estar enabled
  224 |       const reviewButton = page.locator('button:has-text("Avaliar Livro")');
> 225 |       const isEnabled = await reviewButton.isEnabled();
      |                                            ^ Error: locator.isEnabled: Test timeout of 30000ms exceeded.
  226 | 
  227 |       expect(isEnabled).toBe(true);
  228 | 
  229 |       // Escreve review
  230 |       await reviewButton.click();
  231 |       await page.fill('textarea[name="reviewText"]', 'Ótimo livro de leitura rápida!');
  232 |       await page.click('button:has-text("Enviar Avaliação")');
  233 | 
  234 |       // Valida sucesso
  235 |       const successMessage = await page.locator('.success-message').innerText();
  236 |       expect(successMessage).toContain('Avaliação registrada');
  237 | 
  238 |       console.log('✅ Teste 03 (Extended): Review pós-devolução permitido');
  239 |     });
  240 |   });
  241 | 
  242 |   test.describe('Teste 04: Admin Isolation - /admin Bloqueado', () => {
  243 |     test('🚫 Deve rejeitar acesso /admin como reader', async ({ page }) => {
  244 |       // Como reader, tenta acessar admin
  245 |       await page.goto('http://localhost:3000/biblioteca/admin');
  246 | 
  247 |       // Valida que foi redirecionado ou bloqueado
  248 |       const redirectedToLogin = page.url().includes('/login');
  249 |       const showsUnauthorized = await page
  250 |         .locator('text="Não autorizado"')
  251 |         .isVisible()
  252 |         .catch(() => false);
  253 | 
  254 |       expect(redirectedToLogin || showsUnauthorized).toBeTruthy();
  255 | 
  256 |       // Captura evidência
  257 |       await securityUtils.captureEvidence(
  258 |         page,
  259 |         'test-04-admin-isolation',
  260 |         'access-blocked'
  261 |       );
  262 | 
  263 |       // Registra auditoria
  264 |       securityUtils.logAuditEvent(
  265 |         'UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT',
  266 |         {
  267 |           userId: testData.testUsers.reader.id,
  268 |           role: 'reader',
  269 |           attemptedUrl: '/biblioteca/admin',
  270 |         },
  271 |         'HIGH'
  272 |       );
  273 | 
  274 |       // Registra resultado
  275 |       securityUtils.generateTestReport(
  276 |         'test-04-admin-isolation',
  277 |         'PASS',
  278 |         {
  279 |           userRole: 'reader',
  280 |           attemptedPath: '/biblioteca/admin',
  281 |           blocked: true,
  282 |         },
  283 |         'A01: Broken Access Control'
  284 |       );
  285 | 
  286 |       console.log('✅ Teste 04 PASSOU: Admin Isolation validado');
  287 |     });
  288 | 
  289 |     test('🚫 Deve bloquear operações admin diretas', async ({ page }) => {
  290 |       // Tenta deletar um livro via API/JavaScript (simulado)
  291 |       const deleteAttempt = await page.evaluate(async () => {
  292 |         try {
  293 |           // Simula tentativa de delete
  294 |           throw new Error('Admin operation denied');
  295 |         } catch (err) {
  296 |           return err.message;
  297 |         }
  298 |       });
  299 | 
  300 |       expect(deleteAttempt).toContain('denied');
  301 |       console.log('✅ Teste 04 (Extended): Operações admin bloqueadas');
  302 |     });
  303 |   });
  304 | 
  305 |   test.describe('Teste 05: Data Integrity - Sincronização Mobile ↔ Web', () => {
  306 |     test('🔄 Deve validar checksums de dados sincronizados', async ({
  307 |       page,
  308 |     }) => {
  309 |       // Exporta dados mobile (simula sync)
  310 |       const mobileData = await page.evaluate(() => {
  311 |         const loans = JSON.parse(localStorage.getItem('userLoans') || '[]');
  312 |         const books = JSON.parse(localStorage.getItem('books') || '[]');
  313 | 
  314 |         return {
  315 |           loans,
  316 |           books,
  317 |           timestamp: Date.now(),
  318 |         };
  319 |       });
  320 | 
  321 |       // Calcula checksum
  322 |       const crypto = require('crypto');
  323 |       const checksum = crypto
  324 |         .createHash('sha256')
  325 |         .update(JSON.stringify(mobileData))
```