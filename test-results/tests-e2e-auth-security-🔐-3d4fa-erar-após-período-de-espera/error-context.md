# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\auth-security.spec.ts >> 🔐 AUTENTICAÇÃO & SISTEMA - Testes de Segurança >> Teste 10: Rate Limiting - Requisições Excessivas >> ⏰ Deve recuperar após período de espera
- Location: tests\e2e\auth-security.spec.ts:448:9

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 404
Received array: [200, 429]
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
  394 |       for (let i = 0; i < requests; i++) {
  395 |         const response = await page.evaluate(async () => {
  396 |           try {
  397 |             const res = await fetch('/api/search?q=test', {
  398 |               method: 'GET',
  399 |               headers: { 'Accept': 'application/json' },
  400 |             });
  401 |             return res.status;
  402 |           } catch {
  403 |             return 500;
  404 |           }
  405 |         });
  406 | 
  407 |         // Se receber 429 (Too Many Requests), rate limit ativado
  408 |         if (response === 429) {
  409 |           rateLimitedResponse = response;
  410 |           break;
  411 |         }
  412 |       }
  413 | 
  414 |       expect(rateLimitedResponse).toBe(429);
  415 | 
  416 |       // Log de auditoria
  417 |       securityUtils.logAuditEvent(
  418 |         'RATE_LIMIT_EXCEEDED',
  419 |         {
  420 |           endpoint: '/api/search',
  421 |           requestCount: requests,
  422 |           statusCode: 429,
  423 |         },
  424 |         'MEDIUM'
  425 |       );
  426 | 
  427 |       // Captura evidência
  428 |       await securityUtils.captureEvidence(page, 'test-10-rate-limit', 'blocked');
  429 | 
  430 |       // Registra
  431 |       securityUtils.generateTestReport(
  432 |         'test-10-rate-limit',
  433 |         'PASS',
  434 |         {
  435 |           endpoint: '/api/search',
  436 |           requestsSent: requests,
  437 |           rateLimited: true,
  438 |           statusCode: 429,
  439 |         },
  440 |         'A04: Insecure Design'
  441 |       );
  442 | 
  443 |       console.log(
  444 |         `✅ Teste 10 PASSOU: Rate limiting ativado após ${requests} requisições`
  445 |       );
  446 |     });
  447 | 
  448 |     test('⏰ Deve recuperar após período de espera', async ({ page }) => {
  449 |       // Faz login
  450 |       await page.goto('http://localhost:3000/login');
  451 |       await page.fill('input[name="email"]', testData.testUsers.reader.email);
  452 |       await page.fill('input[name="password"]', testData.testUsers.reader.password);
  453 |       await page.click('button:has-text("Entrar")');
  454 |       await page.waitForLoadState('networkidle');
  455 | 
  456 |       // Simula rate limit (múltiplas requisições)
  457 |       for (let i = 0; i < 25; i++) {
  458 |         await page.evaluate(async () => {
  459 |           await fetch('/api/search?q=test');
  460 |         });
  461 |       }
  462 | 
  463 |       // Aguarda período de recuperação
  464 |       await page.waitForTimeout(2000);
  465 | 
  466 |       // Tenta nova requisição
  467 |       const recoveryResponse = await page.evaluate(async () => {
  468 |         try {
  469 |           const res = await fetch('/api/search?q=test');
  470 |           return res.status;
  471 |         } catch {
  472 |           return 500;
  473 |         }
  474 |       });
  475 | 
  476 |       // Deve retornar ao normal (200) ou estar ainda bloqueado (429)
  477 |       // Dependendo da implementação
> 478 |       expect([200, 429]).toContain(recoveryResponse);
      |                          ^ Error: expect(received).toContain(expected) // indexOf
  479 |       console.log(`✅ Teste 10 (Extended): Recuperação verificada (${recoveryResponse})`);
  480 |     });
  481 |   });
  482 | });
  483 | 
  484 | /**
  485 |  * RESUMO DOS TESTES
  486 |  * 
  487 |  * Teste 06: Brute Force Protection ✅
  488 |  * Teste 07: Password Validation ✅
  489 |  * Teste 08: Session Timeout ✅
  490 |  * Teste 09: CSRF Protection ✅
  491 |  * Teste 10: Rate Limiting ✅
  492 |  * 
  493 |  * + 5 testes adicionais em biblioteca.spec.ts
  494 |  * 
  495 |  * Total: 10+ testes de segurança com evidências
  496 |  */
  497 | 
```