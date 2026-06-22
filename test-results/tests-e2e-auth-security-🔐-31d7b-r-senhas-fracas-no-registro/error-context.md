# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\auth-security.spec.ts >> 🔐 AUTENTICAÇÃO & SISTEMA - Testes de Segurança >> Teste 07: Password Validation - Força de Senha >> 🔐 Deve rejeitar senhas fracas no registro
- Location: tests\e2e\auth-security.spec.ts:114:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="confirmPassword"]')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "Criar Conta" [level=1] [ref=e3]
  - generic [ref=e4]:
    - textbox "Email" [ref=e5]: newuser@test.com
    - textbox "Senha" [active] [ref=e6]: "123456"
    - generic [ref=e7]:
      - generic [ref=e8]: ✗ Mínimo 12 caracteres
      - generic [ref=e9]: ✗ Letra maiúscula
      - generic [ref=e10]: ✗ Letra minúscula
      - generic [ref=e11]: ✓ Número
      - generic [ref=e12]: ✗ Caractere especial (!@#$%^&*)
    - button "Registrar" [ref=e13] [cursor=pointer]
  - paragraph [ref=e14]:
    - link "Voltar para login" [ref=e15] [cursor=pointer]:
      - /url: /login
```

# Test source

```ts
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
  108 |       expect(stillLockedOut).toBeTruthy();
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
> 121 |       await page.fill('input[name="confirmPassword"]', weakPassword);
      |                  ^ Error: page.fill: Test timeout of 30000ms exceeded.
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
```