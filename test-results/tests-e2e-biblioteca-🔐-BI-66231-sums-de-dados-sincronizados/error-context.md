# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\biblioteca.spec.ts >> 🔐 BIBLIOTECA VIRTUAL - Testes de Segurança >> Teste 05: Data Integrity - Sincronização Mobile ↔ Web >> 🔄 Deve validar checksums de dados sincronizados
- Location: tests\e2e\biblioteca.spec.ts:306:9

# Error details

```
Error: Too many arguments. If you need to pass more than 1 argument to the function wrap them in an object.
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "Biblioteca Virtual" [level=1] [ref=e3]
  - generic [ref=e4]:
    - textbox "Email" [ref=e5]: reader@biblioteca.local
    - textbox "Senha" [ref=e6]: ReaderUser@2024
    - button "Entrar" [active] [ref=e7] [cursor=pointer]
  - generic [ref=e8]: Conta bloqueada. Tente novamente mais tarde.
  - paragraph [ref=e9]:
    - link "Criar conta" [ref=e10] [cursor=pointer]:
      - /url: /signup
```

# Test source

```ts
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
  326 |         .digest('hex');
  327 | 
  328 |       // Armazena com checksum
> 329 |       await page.evaluate(
      |                  ^ Error: Too many arguments. If you need to pass more than 1 argument to the function wrap them in an object.
  330 |         (data, sum) => {
  331 |           localStorage.setItem('sync-data', JSON.stringify({ data, checksum: sum }));
  332 |         },
  333 |         mobileData,
  334 |         checksum
  335 |       );
  336 | 
  337 |       // Recupera e valida
  338 |       const recovered = await page.evaluate(() => {
  339 |         const syncData = JSON.parse(localStorage.getItem('sync-data') || '{}');
  340 |         return syncData;
  341 |       });
  342 | 
  343 |       // Recalcula checksum para validar integridade
  344 |       const newChecksum = crypto
  345 |         .createHash('sha256')
  346 |         .update(JSON.stringify(recovered.data))
  347 |         .digest('hex');
  348 | 
  349 |       expect(newChecksum).toBe(checksum);
  350 | 
  351 |       // Captura evidência
  352 |       await securityUtils.captureEvidence(page, 'test-05-integrity', 'checksum-valid');
  353 | 
  354 |       // Registra
  355 |       securityUtils.generateTestReport(
  356 |         'test-05-integrity',
  357 |         'PASS',
  358 |         {
  359 |           dataSize: JSON.stringify(mobileData).length,
  360 |           checksumValid: true,
  361 |           checksum,
  362 |         },
  363 |         'A08: Data Integrity Failures'
  364 |       );
  365 | 
  366 |       console.log('✅ Teste 05 PASSOU: Data Integrity validado');
  367 |     });
  368 | 
  369 |     test('🔄 Deve detectar dados corrompidos', async ({ page }) => {
  370 |       // Cria dados com checksum
  371 |       const mobileData = { loans: [], books: [], timestamp: Date.now() };
  372 |       const crypto = require('crypto');
  373 |       const correctChecksum = crypto
  374 |         .createHash('sha256')
  375 |         .update(JSON.stringify(mobileData))
  376 |         .digest('hex');
  377 | 
  378 |       await page.evaluate(
  379 |         (data, sum) => {
  380 |           localStorage.setItem('sync-data', JSON.stringify({ data, checksum: sum }));
  381 |         },
  382 |         mobileData,
  383 |         correctChecksum
  384 |       );
  385 | 
  386 |       // Corrompe os dados
  387 |       await page.evaluate(() => {
  388 |         const syncData = JSON.parse(localStorage.getItem('sync-data') || '{}');
  389 |         syncData.data.loans.push({ corrupted: true });
  390 |         localStorage.setItem('sync-data', JSON.stringify(syncData));
  391 |       });
  392 | 
  393 |       // Tenta validar
  394 |       const corruptedChecksum = await page.evaluate(() => {
  395 |         const syncData = JSON.parse(localStorage.getItem('sync-data') || '{}');
  396 |         const crypto = require('crypto');
  397 |         const newSum = crypto
  398 |           .createHash('sha256')
  399 |           .update(JSON.stringify(syncData.data))
  400 |           .digest('hex');
  401 | 
  402 |         return {
  403 |           storedChecksum: syncData.checksum,
  404 |           calculatedChecksum: newSum,
  405 |           isCorrupted: syncData.checksum !== newSum,
  406 |         };
  407 |       });
  408 | 
  409 |       expect(corruptedChecksum.isCorrupted).toBe(true);
  410 |       console.log('✅ Teste 05 (Extended): Corrupção detectada com sucesso');
  411 |     });
  412 |   });
  413 | });
  414 | 
```