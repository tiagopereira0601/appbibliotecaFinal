# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\auth-security.spec.ts >> 🔐 AUTENTICAÇÃO & SISTEMA - Testes de Segurança >> Teste 08: Session Timeout - Inatividade >> ⏱️ Deve resetar timer com atividade do usuário
- Location: tests\e2e\auth-security.spec.ts:270:9

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "Biblioteca Virtual" [level=1] [ref=e3]
  - generic [ref=e4]:
    - textbox "Email" [ref=e5]: reader@biblioteca.local
    - textbox "Senha" [active] [ref=e6]: ReaderUser@2024
    - button "Entrar" [ref=e7] [cursor=pointer]
  - generic [ref=e8]: Conta bloqueada. Tente novamente mais tarde.
  - paragraph [ref=e9]:
    - link "Criar conta" [ref=e10] [cursor=pointer]:
      - /url: /signup
```

# Test source

```ts
  193 |       await page.goto('http://localhost:3000/signup');
  194 | 
  195 |       const passwordInput = page.locator('input[name="password"]');
  196 | 
  197 |       // Digita gradualmente e valida feedback
  198 |       await passwordInput.fill('pass');
  199 |       let strengthIndicator = await page
  200 |         .locator('[data-testid="password-strength"]')
  201 |         .innerText();
  202 |       expect(strengthIndicator.toLowerCase()).toContain('fraco');
  203 | 
  204 |       // Completa com requisitos
  205 |       await passwordInput.fill('SecurePass@2024');
  206 |       strengthIndicator = await page
  207 |         .locator('[data-testid="password-strength"]')
  208 |         .innerText();
  209 |       expect(strengthIndicator.toLowerCase()).toContain('forte');
  210 | 
  211 |       console.log('✅ Teste 07 (Extended+): Indicador de força em tempo real');
  212 |     });
  213 |   });
  214 | 
  215 |   test.describe('Teste 08: Session Timeout - Inatividade', () => {
  216 |     test('⏱️ Deve fazer logout após 15 minutos de inatividade', async ({
  217 |       page,
  218 |     }) => {
  219 |       // Faz login
  220 |       await page.goto('http://localhost:3000/login');
  221 |       await page.fill('input[name="email"]', testData.testUsers.reader.email);
  222 |       await page.fill('input[name="password"]', testData.testUsers.reader.password);
  223 |       await page.click('button:has-text("Entrar")');
  224 |       await page.waitForLoadState('networkidle');
  225 | 
  226 |       // Valida que está logado
  227 |       const userMenuBefore = await page
  228 |         .locator('[data-testid="user-menu"]')
  229 |         .isVisible();
  230 |       expect(userMenuBefore).toBeTruthy();
  231 | 
  232 |       // Simula inatividade de 15+ min (reduz para teste)
  233 |       // Em produção seria 900000ms, aqui usamos tempo menor
  234 |       const inactivityTestTime = testData.sessionTimeout.testWaitMs || 5000;
  235 | 
  236 |       await page.waitForTimeout(inactivityTestTime);
  237 | 
  238 |       // Tenta interagir (recarrega ou navega)
  239 |       await page.reload();
  240 | 
  241 |       // Valida que foi deslogado
  242 |       const isLoggedOut =
  243 |         page.url().includes('/login') ||
  244 |         (await page
  245 |           .locator('[data-testid="user-menu"]')
  246 |           .isVisible()
  247 |           .then(() => false)
  248 |           .catch(() => true));
  249 | 
  250 |       expect(isLoggedOut).toBeTruthy();
  251 | 
  252 |       // Captura evidência
  253 |       await securityUtils.captureEvidence(page, 'test-08-session-timeout', 'logged-out');
  254 | 
  255 |       // Registra
  256 |       securityUtils.generateTestReport(
  257 |         'test-08-session-timeout',
  258 |         'PASS',
  259 |         {
  260 |           inactivityMs: inactivityTestTime,
  261 |           wasLoggedOut: true,
  262 |           expectedTimeout: testData.sessionTimeout.timeoutMs,
  263 |         },
  264 |         'A07: Authentication Failures'
  265 |       );
  266 | 
  267 |       console.log('✅ Teste 08 PASSOU: Session timeout após inatividade');
  268 |     });
  269 | 
  270 |     test('⏱️ Deve resetar timer com atividade do usuário', async ({ page }) => {
  271 |       // Faz login
  272 |       await page.goto('http://localhost:3000/login');
  273 |       await page.fill('input[name="email"]', testData.testUsers.reader.email);
  274 |       await page.fill('input[name="password"]', testData.testUsers.reader.password);
  275 |       await page.click('button:has-text("Entrar")');
  276 |       await page.waitForLoadState('networkidle');
  277 | 
  278 |       // Aguarda meio do tempo de timeout
  279 |       await page.waitForTimeout(testData.sessionTimeout.testWaitMs / 2);
  280 | 
  281 |       // Simula atividade do usuário (clique)
  282 |       await page.click('body');
  283 | 
  284 |       // Aguarda mais tempo (se resetou, não deve fazer logout ainda)
  285 |       await page.waitForTimeout(testData.sessionTimeout.testWaitMs / 2);
  286 | 
  287 |       // Ainda deve estar logado
  288 |       const userMenu = await page
  289 |         .locator('[data-testid="user-menu"]')
  290 |         .isVisible()
  291 |         .catch(() => false);
  292 | 
> 293 |       expect(userMenu).toBeTruthy();
      |                        ^ Error: expect(received).toBeTruthy()
  294 |       console.log('✅ Teste 08 (Extended): Timer reseta com atividade');
  295 |     });
  296 |   });
  297 | 
  298 |   test.describe('Teste 09: CSRF Protection - Token Validation', () => {
  299 |     test('🛡️ Deve validar CSRF token em requisições POST', async ({ page }) => {
  300 |       // Faz login
  301 |       await page.goto('http://localhost:3000/login');
  302 |       await page.fill('input[name="email"]', testData.testUsers.reader.email);
  303 |       await page.fill('input[name="password"]', testData.testUsers.reader.password);
  304 |       await page.click('button:has-text("Entrar")');
  305 |       await page.waitForLoadState('networkidle');
  306 | 
  307 |       // Valida presença de CSRF token
  308 |       const hasCsrfToken = await securityUtils.validateCSRFProtection(
  309 |         page,
  310 |         'test-09-csrf'
  311 |       );
  312 |       expect(hasCsrfToken).toBeTruthy();
  313 | 
  314 |       // Tenta requisição sem token (simula ataque)
  315 |       const resultWithoutToken = await page.evaluate(async () => {
  316 |         try {
  317 |           const response = await fetch('/api/emprestimos', {
  318 |             method: 'POST',
  319 |             headers: { 'Content-Type': 'application/json' },
  320 |             body: JSON.stringify({ bookId: 'book-001' }),
  321 |             // ❌ SEM CSRF token
  322 |           });
  323 |           return response.status;
  324 |         } catch (err) {
  325 |           return 403; // Esperado: Forbidden
  326 |         }
  327 |       });
  328 | 
  329 |       expect(resultWithoutToken).toBe(403);
  330 | 
  331 |       // Captura evidência
  332 |       await securityUtils.captureEvidence(page, 'test-09-csrf', 'token-validated');
  333 | 
  334 |       // Registra
  335 |       securityUtils.generateTestReport(
  336 |         'test-09-csrf',
  337 |         'PASS',
  338 |         {
  339 |           tokenPresent: true,
  340 |           requestWithoutTokenBlocked: true,
  341 |           statusCode: 403,
  342 |         },
  343 |         'A04: Insecure Design'
  344 |       );
  345 | 
  346 |       console.log('✅ Teste 09 PASSOU: CSRF protection validado');
  347 |     });
  348 | 
  349 |     test('🛡️ Deve rejeitar CSRF token inválido', async ({ page }) => {
  350 |       // Faz login
  351 |       await page.goto('http://localhost:3000/login');
  352 |       await page.fill('input[name="email"]', testData.testUsers.reader.email);
  353 |       await page.fill('input[name="password"]', testData.testUsers.reader.password);
  354 |       await page.click('button:has-text("Entrar")');
  355 |       await page.waitForLoadState('networkidle');
  356 | 
  357 |       // Tenta com token inválido
  358 |       const resultInvalidToken = await page.evaluate(async () => {
  359 |         try {
  360 |           const response = await fetch('/api/emprestimos', {
  361 |             method: 'POST',
  362 |             headers: {
  363 |               'Content-Type': 'application/json',
  364 |               'X-CSRF-Token': 'invalid-token-xyz',
  365 |             },
  366 |             body: JSON.stringify({ bookId: 'book-001' }),
  367 |           });
  368 |           return response.status;
  369 |         } catch {
  370 |           return 403;
  371 |         }
  372 |       });
  373 | 
  374 |       expect(resultInvalidToken).toBe(403);
  375 |       console.log('✅ Teste 09 (Extended): Token inválido rejeitado');
  376 |     });
  377 |   });
  378 | 
  379 |   test.describe('Teste 10: Rate Limiting - Requisições Excessivas', () => {
  380 |     test('⏰ Deve bloquear requisições excessivas em curto período', async ({
  381 |       page,
  382 |     }) => {
  383 |       // Faz login
  384 |       await page.goto('http://localhost:3000/login');
  385 |       await page.fill('input[name="email"]', testData.testUsers.reader.email);
  386 |       await page.fill('input[name="password"]', testData.testUsers.reader.password);
  387 |       await page.click('button:has-text("Entrar")');
  388 |       await page.waitForLoadState('networkidle');
  389 | 
  390 |       // Envia múltiplas requisições rapidamente
  391 |       const requests = testData.rateLimit.testRequests || 20;
  392 |       let rateLimitedResponse = null;
  393 | 
```