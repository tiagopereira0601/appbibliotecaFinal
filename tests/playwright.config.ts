import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Configuração do Playwright para testes de segurança
 * - 10+ casos de teste da Biblioteca Virtual
 * - Testes de autenticação
 * - Testes OWASP
 */

export default defineConfig({
  testDir: path.join(__dirname, 'e2e'),
  testMatch: '**/*.spec.ts',

  /* Configuração de relatórios */
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],

  /* Timeout global */
  timeout: 30000,
  expect: { timeout: 5000 },

  /* Configuração de paralelização */
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,

  /* Configuração de reprodução de falhas */
  retries: process.env.CI ? 2 : 0,

  /* Configuração de screenshot em caso de falha */
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    baseURL: 'http://localhost:3000',
  },

  /* Configuração de navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:3000' },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], baseURL: 'http://localhost:3000' },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], baseURL: 'http://localhost:3000' },
    },

    /* Testes em mobile (simulado) */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'], baseURL: 'http://localhost:3000' },
    },
  ],

  /* Configuração de output */
  outputDir: 'test-results/attachments',
});
