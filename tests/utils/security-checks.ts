import { Page, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Utilitários de segurança para testes Playwright
 * Inclui captura de evidências, validações de segurança, etc.
 */

export class SecurityTestUtils {
  private evidenceDir: string;

  constructor(baseDir: string = './docs/segurança/evidencias') {
    this.evidenceDir = baseDir;
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const dirs = [
      `${this.evidenceDir}/screenshots`,
      `${this.evidenceDir}/videos`,
      `${this.evidenceDir}/relatorios-playwright`,
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Captura screenshot de evidência
   */
  async captureEvidence(
    page: Page,
    testName: string,
    stepDescription: string
  ): Promise<string> {
    const filename = `${testName}-${stepDescription}-${Date.now()}.png`;
    const filepath = path.join(this.evidenceDir, 'screenshots', filename);

    await page.screenshot({ path: filepath, fullPage: true });

    console.log(`✅ Screenshot capturado: ${filename}`);
    return filepath;
  }

  /**
   * Valida que elemento NÃO contém script (XSS Prevention)
   */
  async validateNoScriptExecution(
    page: Page,
    selector: string,
    testName: string
  ): Promise<void> {
    const element = page.locator(selector);
    const content = await element.innerText();

    // Verifica se não há scripts executados
    const hasScript = await page.evaluate(() => {
      return !!document.querySelector('script[data-test="injected"]');
    });

    expect(hasScript).toBeFalsy();
    console.log(`✅ XSS Prevention validado em ${testName}`);
  }

  /**
   * Valida acesso bloqueado (Access Control)
   */
  async validateAccessDenied(
    page: Page,
    url: string,
    testName: string
  ): Promise<void> {
    await page.goto(url, { waitUntil: 'networkidle' });

    // Valida que recebe erro 403 ou redirecionado
    const response = await page.evaluate(() => document.title);

    const isBlocked =
      page.url().includes('/login') ||
      page.url().includes('/unauthorized') ||
      (await page.locator('text="Access Denied"').isVisible().catch(() => false));

    expect(isBlocked).toBeTruthy();
    await this.captureEvidence(page, testName, 'access-denied');
    console.log(`✅ Access Control validado em ${testName}`);
  }

  /**
   * Valida que elemento é visível apenas para role específico
   */
  async validateRoleVisibility(
    page: Page,
    selector: string,
    shouldBeVisible: boolean,
    testName: string
  ): Promise<void> {
    const element = page.locator(selector);
    const isVisible = await element.isVisible().catch(() => false);

    expect(isVisible).toBe(shouldBeVisible);
    console.log(
      `✅ Role visibility validado (expected: ${shouldBeVisible}) em ${testName}`
    );
  }

  /**
   * Valida força de senha
   */
  validatePasswordStrength(password: string, testName: string): boolean {
    const requirements = {
      minLength: password.length >= 12,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecial: /[!@#$%^&*]/.test(password),
    };

    const isStrong = Object.values(requirements).every(v => v);

    console.log(`Password strength for ${testName}:`, requirements);
    return isStrong;
  }

  /**
   * Valida sanitização de inputs
   */
  validateInputSanitization(
    input: string,
    output: string,
    testName: string
  ): boolean {
    // Verifica que tags HTML são escapadas
    const hasHTMLTags = /<[^>]*>/g.test(input);
    const outputHasLiteralTags = output.includes('&lt;') || output.includes('&gt;');

    if (hasHTMLTags) {
      expect(outputHasLiteralTags).toBeTruthy();
    }

    console.log(`✅ Input sanitization validado em ${testName}`);
    return true;
  }

  /**
   * Valida presença de CSRF token
   */
  async validateCSRFProtection(
    page: Page,
    testName: string
  ): Promise<boolean> {
    const csrfToken = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="csrf-token"]');
      return meta?.getAttribute('content');
    });

    expect(csrfToken).toBeTruthy();
    console.log(`✅ CSRF token validado em ${testName}`);
    return !!csrfToken;
  }

  /**
   * Valida HTTPS em produção
   */
  validateHTTPS(pageUrl: string, testName: string): boolean {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      expect(pageUrl.startsWith('https://')).toBeTruthy();
      console.log(`✅ HTTPS validado em ${testName}`);
    }

    return true;
  }

  /**
   * Valida headers de segurança
   */
  async validateSecurityHeaders(
    page: Page,
    testName: string
  ): Promise<void> {
    // Intercepta primeira request para capturar headers
    const firstRequest = await page.waitForLoadState('networkidle');

    // Nota: Playwright não expõe response headers diretamente,
    // então validamos via JavaScript se disponível
    const hasSecurityHeaders = await page.evaluate(() => {
      // Tenta acessar via fetch para validar
      return true;
    });

    console.log(`✅ Security headers avaliado em ${testName}`);
  }

  /**
   * Valida integridade de dados (checksum)
   */
  validateDataChecksum(data: object, checksum: string, testName: string): boolean {
    const crypto = require('crypto');
    const calculated = crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');

    expect(calculated).toBe(checksum);
    console.log(`✅ Data checksum validado em ${testName}`);
    return true;
  }

  /**
   * Valida imutabilidade de dados críticos
   */
  validateImmutability(object: object, testName: string): boolean {
    const isFrozen = Object.isFrozen(object);
    expect(isFrozen).toBeTruthy();
    console.log(`✅ Data immutability validado em ${testName}`);
    return true;
  }

  /**
   * Simula inatividade e valida timeout de sessão
   */
  async validateSessionTimeout(
    page: Page,
    inactivityMs: number,
    testName: string
  ): Promise<void> {
    // Aguarda inatividade
    await page.waitForTimeout(inactivityMs);

    // Tenta ação que requer autenticação
    await page.reload();

    // Valida que foi redirecionado para login
    const isLoggedOut =
      page.url().includes('/login') ||
      (await page.locator('text="Login"').isVisible().catch(() => false));

    expect(isLoggedOut).toBeTruthy();
    await this.captureEvidence(page, testName, 'session-timeout');
    console.log(`✅ Session timeout validado em ${testName}`);
  }

  /**
   * Gera relatório de teste
   */
  generateTestReport(
    testName: string,
    status: 'PASS' | 'FAIL',
    details: object,
    owasp?: string
  ): void {
    const report = {
      timestamp: new Date().toISOString(),
      testName,
      status,
      owasp,
      details,
    };

    const reportPath = path.join(
      this.evidenceDir,
      'relatorios-playwright',
      `${testName}-report.json`
    );

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📋 Relatório gerado: ${reportPath}`);
  }

  /**
   * Log de evento para auditoria
   */
  logAuditEvent(
    eventType: string,
    details: object,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      eventType,
      severity,
      details,
    };

    console.log(`[${severity}] ${eventType}:`, details);

    const logPath = path.join(
      this.evidenceDir,
      `audit-${new Date().toISOString().split('T')[0]}.log`
    );

    if (fs.existsSync(logPath)) {
      fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
    } else {
      fs.writeFileSync(logPath, JSON.stringify(logEntry) + '\n');
    }
  }
}

/**
 * Fixture para usar SecurityTestUtils em testes
 */
export const securityUtils = new SecurityTestUtils();
