import { defineConfig } from '@playwright/test';
import base from '../playwright.config';

/** `npm run screenshots` — the W-00 set (scripts/screenshots-w00.spec.ts → docs/screens/w-00/) and the home-c / showcase sets, not part of the e2e suite. */
export default defineConfig({
  ...base,
  testDir: '.',
  testMatch: /screenshots-(home-c|showcase|w00)\.spec\.ts/,
  reporter: 'line',
  // The web server command is relative to the repo root (this config lives in scripts/).
  webServer: { ...(base.webServer as object), cwd: process.cwd() } as typeof base.webServer,
});
