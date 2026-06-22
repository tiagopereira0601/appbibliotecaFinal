# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\auth-security.spec.ts >> 🔐 AUTENTICAÇÃO & SISTEMA - Testes de Segurança >> Teste 07: Password Validation - Força de Senha >> 🔐 Deve mostrar requisitos de força em tempo real
- Location: tests\e2e\auth-security.spec.ts:190:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.innerText: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="password-strength"]')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "Criar Conta" [level=1] [ref=e3]
  - generic [ref=e4]:
    - textbox "Email" [ref=e5]
    - textbox "Senha" [active] [ref=e6]: pass
    - generic [ref=e7]:
      - generic [ref=e8]: ✗ Mínimo 12 caracteres
      - generic [ref=e9]: ✗ Letra maiúscula
      - generic [ref=e10]: ✓ Letra minúscula
      - generic [ref=e11]: ✗ Número
      - generic [ref=e12]: ✗ Caractere especial (!@#$%^&*)
    - button "Registrar" [ref=e13] [cursor=pointer]
  - paragraph [ref=e14]:
    - link "Voltar para login" [ref=e15] [cursor=pointer]:
      - /url: /login
```

# Test source

```ts
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
> 201 |         .innerText();
      |          ^ Error: locator.innerText: Test timeout of 30000ms exceeded.
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
  293 |       expect(userMenu).toBeTruthy();
  294 |       console.log('✅ Teste 08 (Extended): Timer reseta com atividade');
  295 |     });
  296 |   });
  297 | 
  298 |   test.describe('Teste 09: CSRF Protection - Token Validation', () => {
  299 |     test('🛡️ Deve validar CSRF token em requisições POST', async ({ page }) => {
  300 |       // Faz login
  301 |       await page.goto('http://localhost:3000/login');
```