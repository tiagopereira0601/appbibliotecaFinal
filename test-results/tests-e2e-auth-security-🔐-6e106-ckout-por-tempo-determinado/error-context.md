# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\auth-security.spec.ts >> 🔐 AUTENTICAÇÃO & SISTEMA - Testes de Segurança >> Teste 06: Brute Force Protection - Login >> 🚫 Deve manter lockout por tempo determinado
- Location: tests\e2e\auth-security.spec.ts:84:9

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
    - textbox "Senha" [ref=e6]: ReaderUser@2024
    - button "Entrar" [active] [ref=e7] [cursor=pointer]
  - generic [ref=e8]: Conta bloqueada. Tente novamente mais tarde.
  - paragraph [ref=e9]:
    - link "Criar conta" [ref=e10] [cursor=pointer]:
      - /url: /signup
```

# Test source

```ts
  8   |  *
  9   |  * ✅ Teste 06: Brute Force Protection - Login
  10  |  * ✅ Teste 07: Password Validation - Força de Senha
  11  |  * ✅ Teste 08: Session Timeout - Inatividade
  12  |  * ✅ Teste 09: CSRF Protection - Token Validation
  13  |  * ✅ Teste 10: Rate Limiting - Requisições Excessivas
  14  |  */
  15  | 
  16  | test.describe('🔐 AUTENTICAÇÃO & SISTEMA - Testes de Segurança', () => {
  17  |   test.describe('Teste 06: Brute Force Protection - Login', () => {
  18  |     test('🚫 Deve bloquear após múltiplas tentativas falhadas', async ({
  19  |       page,
  20  |     }) => {
  21  |       const email = testData.bruteForceTests.email;
  22  |       const invalidPasswords = testData.bruteForceTests.invalidPasswords;
  23  |       let lastAttempt = 0;
  24  | 
  25  |       for (let i = 0; i < invalidPasswords.length; i++) {
  26  |         await page.goto('http://localhost:3000/login');
  27  |         await page.fill('input[name="email"]', email);
  28  |         await page.fill('input[name="password"]', invalidPasswords[i]);
  29  |         await page.click('button:has-text("Entrar")');
  30  | 
  31  |         // Aguarda resposta
  32  |         await page.waitForTimeout(500);
  33  | 
  34  |         // Após 5 tentativas, deve mostrar bloqueio
  35  |         if (i >= testData.bruteForceTests.lockoutThreshold - 1) {
  36  |           const lockedOutMessage = await page
  37  |             .locator('text="Muitas tentativas"')
  38  |             .isVisible()
  39  |             .catch(() => false);
  40  | 
  41  |           if (lockedOutMessage) {
  42  |             lastAttempt = i;
  43  |             expect(lockedOutMessage).toBeTruthy();
  44  | 
  45  |             // Captura evidência
  46  |             await securityUtils.captureEvidence(
  47  |               page,
  48  |               'test-06-brute-force',
  49  |               'lockout-triggered'
  50  |             );
  51  | 
  52  |             // Log de auditoria
  53  |             securityUtils.logAuditEvent(
  54  |               'BRUTE_FORCE_LOCKOUT',
  55  |               {
  56  |                 email,
  57  |                 attempts: i + 1,
  58  |                 lockoutDuration: testData.bruteForceTests.lockoutDuration,
  59  |               },
  60  |               'HIGH'
  61  |             );
  62  | 
  63  |             break;
  64  |           }
  65  |         }
  66  |       }
  67  | 
  68  |       // Registra resultado
  69  |       securityUtils.generateTestReport(
  70  |         'test-06-brute-force',
  71  |         'PASS',
  72  |         {
  73  |           email,
  74  |           failedAttempts: lastAttempt + 1,
  75  |           lockedOut: true,
  76  |           threshold: testData.bruteForceTests.lockoutThreshold,
  77  |         },
  78  |         'A07: Authentication Failures'
  79  |       );
  80  | 
  81  |       console.log(`✅ Teste 06 PASSOU: Brute force bloqueado após ${lastAttempt + 1} tentativas`);
  82  |     });
  83  | 
  84  |     test('🚫 Deve manter lockout por tempo determinado', async ({ page }) => {
  85  |       const email = testData.bruteForceTests.email;
  86  | 
  87  |       // Simula múltiplas tentativas e bloqueio
  88  |       for (let i = 0; i < 6; i++) {
  89  |         await page.goto('http://localhost:3000/login');
  90  |         await page.fill('input[name="email"]', email);
  91  |         await page.fill('input[name="password"]', 'wrongpassword');
  92  |         await page.click('button:has-text("Entrar")');
  93  |         await page.waitForTimeout(300);
  94  |       }
  95  | 
  96  |       // Tenta com senha correta enquanto bloqueado
  97  |       await page.goto('http://localhost:3000/login');
  98  |       await page.fill('input[name="email"]', email);
  99  |       await page.fill('input[name="password"]', testData.bruteForceTests.correctPassword);
  100 |       await page.click('button:has-text("Entrar")');
  101 | 
  102 |       // Ainda deve estar bloqueado
  103 |       const stillLockedOut = await page
  104 |         .locator('text="Muitas tentativas"')
  105 |         .isVisible()
  106 |         .catch(() => false);
  107 | 
> 108 |       expect(stillLockedOut).toBeTruthy();
      |                              ^ Error: expect(received).toBeTruthy()
  109 |       console.log('✅ Teste 06 (Extended): Lockout mantém durante período de espera');
  110 |     });
  111 |   });
  112 | 
  113 |   test.describe('Teste 07: Password Validation - Força de Senha', () => {
  114 |     test('🔐 Deve rejeitar senhas fracas no registro', async ({ page }) => {
  115 |       await page.goto('http://localhost:3000/signup');
  116 | 
  117 |       // Tenta registrar com senha fraca
  118 |       const weakPassword = '123456';
  119 |       await page.fill('input[name="email"]', 'newuser@test.com');
  120 |       await page.fill('input[name="password"]', weakPassword);
  121 |       await page.fill('input[name="confirmPassword"]', weakPassword);
  122 |       await page.click('button:has-text("Registrar")');
  123 | 
  124 |       // Valida erro
  125 |       const errorMessage = await page.locator('.error-message').innerText();
  126 |       expect(errorMessage).toContain('mínimo 12 caracteres');
  127 | 
  128 |       // Valida que password strength is checked
  129 |       const isStrongPassword = securityUtils.validatePasswordStrength(
  130 |         weakPassword,
  131 |         'test-07-weak'
  132 |       );
  133 |       expect(isStrongPassword).toBe(false);
  134 | 
  135 |       // Captura evidência
  136 |       await securityUtils.captureEvidence(
  137 |         page,
  138 |         'test-07-password-strength',
  139 |         'weak-rejected'
  140 |       );
  141 | 
  142 |       // Registra
  143 |       securityUtils.generateTestReport(
  144 |         'test-07-password-strength',
  145 |         'PASS',
  146 |         {
  147 |           password: '***',
  148 |           strength: 'WEAK',
  149 |           requirements: {
  150 |             minLength: weakPassword.length >= 12,
  151 |             hasUppercase: /[A-Z]/.test(weakPassword),
  152 |             hasLowercase: /[a-z]/.test(weakPassword),
  153 |             hasNumbers: /\d/.test(weakPassword),
  154 |             hasSpecial: /[!@#$%^&*]/.test(weakPassword),
  155 |           },
  156 |           rejected: true,
  157 |         },
  158 |         'A04: Insecure Design'
  159 |       );
  160 | 
  161 |       console.log('✅ Teste 07 PASSOU: Senha fraca rejeitada');
  162 |     });
  163 | 
  164 |     test('🔐 Deve aceitar senhas fortes', async ({ page }) => {
  165 |       await page.goto('http://localhost:3000/signup');
  166 | 
  167 |       // Tenta com senha forte
  168 |       const strongPassword = 'SecurePassword@2024';
  169 |       await page.fill('input[name="email"]', 'newuser2@test.com');
  170 |       await page.fill('input[name="password"]', strongPassword);
  171 |       await page.fill('input[name="confirmPassword"]', strongPassword);
  172 |       await page.click('button:has-text("Registrar")');
  173 | 
  174 |       // Aguarda sucesso (redirect ou mensagem)
  175 |       await page.waitForLoadState('networkidle');
  176 | 
  177 |       const isStrongPassword = securityUtils.validatePasswordStrength(
  178 |         strongPassword,
  179 |         'test-07-strong'
  180 |       );
  181 |       expect(isStrongPassword).toBe(true);
  182 | 
  183 |       // Valida que foi registrado
  184 |       const successOrRedirect = page.url().includes('/login') || page.url().includes('/dashboard');
  185 |       expect(successOrRedirect).toBeTruthy();
  186 | 
  187 |       console.log('✅ Teste 07 (Extended): Senha forte aceita');
  188 |     });
  189 | 
  190 |     test('🔐 Deve mostrar requisitos de força em tempo real', async ({
  191 |       page,
  192 |     }) => {
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
```