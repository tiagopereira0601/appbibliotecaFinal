# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\auth-security.spec.ts >> 🔐 AUTENTICAÇÃO & SISTEMA - Testes de Segurança >> Teste 09: CSRF Protection - Token Validation >> 🛡️ Deve validar CSRF token em requisições POST
- Location: tests\e2e\auth-security.spec.ts:299:9

# Error details

```
Error: expect(received).toBeTruthy()

Received: undefined
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
  60  |     // Verifica se não há scripts executados
  61  |     const hasScript = await page.evaluate(() => {
  62  |       return !!document.querySelector('script[data-test="injected"]');
  63  |     });
  64  | 
  65  |     expect(hasScript).toBeFalsy();
  66  |     console.log(`✅ XSS Prevention validado em ${testName}`);
  67  |   }
  68  | 
  69  |   /**
  70  |    * Valida acesso bloqueado (Access Control)
  71  |    */
  72  |   async validateAccessDenied(
  73  |     page: Page,
  74  |     url: string,
  75  |     testName: string
  76  |   ): Promise<void> {
  77  |     await page.goto(url, { waitUntil: 'networkidle' });
  78  | 
  79  |     // Valida que recebe erro 403 ou redirecionado
  80  |     const response = await page.evaluate(() => document.title);
  81  | 
  82  |     const isBlocked =
  83  |       page.url().includes('/login') ||
  84  |       page.url().includes('/unauthorized') ||
  85  |       (await page.locator('text="Access Denied"').isVisible().catch(() => false));
  86  | 
  87  |     expect(isBlocked).toBeTruthy();
  88  |     await this.captureEvidence(page, testName, 'access-denied');
  89  |     console.log(`✅ Access Control validado em ${testName}`);
  90  |   }
  91  | 
  92  |   /**
  93  |    * Valida que elemento é visível apenas para role específico
  94  |    */
  95  |   async validateRoleVisibility(
  96  |     page: Page,
  97  |     selector: string,
  98  |     shouldBeVisible: boolean,
  99  |     testName: string
  100 |   ): Promise<void> {
  101 |     const element = page.locator(selector);
  102 |     const isVisible = await element.isVisible().catch(() => false);
  103 | 
  104 |     expect(isVisible).toBe(shouldBeVisible);
  105 |     console.log(
  106 |       `✅ Role visibility validado (expected: ${shouldBeVisible}) em ${testName}`
  107 |     );
  108 |   }
  109 | 
  110 |   /**
  111 |    * Valida força de senha
  112 |    */
  113 |   validatePasswordStrength(password: string, testName: string): boolean {
  114 |     const requirements = {
  115 |       minLength: password.length >= 12,
  116 |       hasUppercase: /[A-Z]/.test(password),
  117 |       hasLowercase: /[a-z]/.test(password),
  118 |       hasNumbers: /\d/.test(password),
  119 |       hasSpecial: /[!@#$%^&*]/.test(password),
  120 |     };
  121 | 
  122 |     const isStrong = Object.values(requirements).every(v => v);
  123 | 
  124 |     console.log(`Password strength for ${testName}:`, requirements);
  125 |     return isStrong;
  126 |   }
  127 | 
  128 |   /**
  129 |    * Valida sanitização de inputs
  130 |    */
  131 |   validateInputSanitization(
  132 |     input: string,
  133 |     output: string,
  134 |     testName: string
  135 |   ): boolean {
  136 |     // Verifica que tags HTML são escapadas
  137 |     const hasHTMLTags = /<[^>]*>/g.test(input);
  138 |     const outputHasLiteralTags = output.includes('&lt;') || output.includes('&gt;');
  139 | 
  140 |     if (hasHTMLTags) {
  141 |       expect(outputHasLiteralTags).toBeTruthy();
  142 |     }
  143 | 
  144 |     console.log(`✅ Input sanitization validado em ${testName}`);
  145 |     return true;
  146 |   }
  147 | 
  148 |   /**
  149 |    * Valida presença de CSRF token
  150 |    */
  151 |   async validateCSRFProtection(
  152 |     page: Page,
  153 |     testName: string
  154 |   ): Promise<boolean> {
  155 |     const csrfToken = await page.evaluate(() => {
  156 |       const meta = document.querySelector('meta[name="csrf-token"]');
  157 |       return meta?.getAttribute('content');
  158 |     });
  159 | 
> 160 |     expect(csrfToken).toBeTruthy();
      |                       ^ Error: expect(received).toBeTruthy()
  161 |     console.log(`✅ CSRF token validado em ${testName}`);
  162 |     return !!csrfToken;
  163 |   }
  164 | 
  165 |   /**
  166 |    * Valida HTTPS em produção
  167 |    */
  168 |   validateHTTPS(pageUrl: string, testName: string): boolean {
  169 |     const isProduction = process.env.NODE_ENV === 'production';
  170 | 
  171 |     if (isProduction) {
  172 |       expect(pageUrl.startsWith('https://')).toBeTruthy();
  173 |       console.log(`✅ HTTPS validado em ${testName}`);
  174 |     }
  175 | 
  176 |     return true;
  177 |   }
  178 | 
  179 |   /**
  180 |    * Valida headers de segurança
  181 |    */
  182 |   async validateSecurityHeaders(
  183 |     page: Page,
  184 |     testName: string
  185 |   ): Promise<void> {
  186 |     // Intercepta primeira request para capturar headers
  187 |     const firstRequest = await page.waitForLoadState('networkidle');
  188 | 
  189 |     // Nota: Playwright não expõe response headers diretamente,
  190 |     // então validamos via JavaScript se disponível
  191 |     const hasSecurityHeaders = await page.evaluate(() => {
  192 |       // Tenta acessar via fetch para validar
  193 |       return true;
  194 |     });
  195 | 
  196 |     console.log(`✅ Security headers avaliado em ${testName}`);
  197 |   }
  198 | 
  199 |   /**
  200 |    * Valida integridade de dados (checksum)
  201 |    */
  202 |   validateDataChecksum(data: object, checksum: string, testName: string): boolean {
  203 |     const crypto = require('crypto');
  204 |     const calculated = crypto
  205 |       .createHash('sha256')
  206 |       .update(JSON.stringify(data))
  207 |       .digest('hex');
  208 | 
  209 |     expect(calculated).toBe(checksum);
  210 |     console.log(`✅ Data checksum validado em ${testName}`);
  211 |     return true;
  212 |   }
  213 | 
  214 |   /**
  215 |    * Valida imutabilidade de dados críticos
  216 |    */
  217 |   validateImmutability(object: object, testName: string): boolean {
  218 |     const isFrozen = Object.isFrozen(object);
  219 |     expect(isFrozen).toBeTruthy();
  220 |     console.log(`✅ Data immutability validado em ${testName}`);
  221 |     return true;
  222 |   }
  223 | 
  224 |   /**
  225 |    * Simula inatividade e valida timeout de sessão
  226 |    */
  227 |   async validateSessionTimeout(
  228 |     page: Page,
  229 |     inactivityMs: number,
  230 |     testName: string
  231 |   ): Promise<void> {
  232 |     // Aguarda inatividade
  233 |     await page.waitForTimeout(inactivityMs);
  234 | 
  235 |     // Tenta ação que requer autenticação
  236 |     await page.reload();
  237 | 
  238 |     // Valida que foi redirecionado para login
  239 |     const isLoggedOut =
  240 |       page.url().includes('/login') ||
  241 |       (await page.locator('text="Login"').isVisible().catch(() => false));
  242 | 
  243 |     expect(isLoggedOut).toBeTruthy();
  244 |     await this.captureEvidence(page, testName, 'session-timeout');
  245 |     console.log(`✅ Session timeout validado em ${testName}`);
  246 |   }
  247 | 
  248 |   /**
  249 |    * Gera relatório de teste
  250 |    */
  251 |   generateTestReport(
  252 |     testName: string,
  253 |     status: 'PASS' | 'FAIL',
  254 |     details: object,
  255 |     owasp?: string
  256 |   ): void {
  257 |     const report = {
  258 |       timestamp: new Date().toISOString(),
  259 |       testName,
  260 |       status,
```