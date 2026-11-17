import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { signIn, staffSignIn } from '../e2e/support/auth';
import { payOnHostedPage } from '../e2e/support/payment';

/**
 * W-00 screenshot set (plan Phase 7 step 3) → docs/screens/w-00/: home, project, cart, checkout, order (paid), 404 and
 * the admin dashboard, ar and en × light and dark × 1440 and 390 px. Runs on `npm run build` (local) against the REAL
 * local API (`npm run api:up && npm run api:seed`): `npx playwright test --config scripts/playwright.screenshots.config.ts
 * screenshots-w00`. JPEG quality 60, first 2400 px of the page (the footer is in the home shot's 390 px variant).
 */
const OUT = join(process.cwd(), 'docs', 'screens', 'w-00');
const SLUG = 'c-preacher-nigeria';
const THEMES = ['light', 'dark'] as const;
const WIDTHS = [1440, 390] as const;

test.beforeAll(() => mkdirSync(OUT, { recursive: true }));

async function setTheme(ctx: BrowserContext, theme: (typeof THEMES)[number]) {
  await ctx.addInitScript((t) => {
    try {
      localStorage.setItem('ta-theme', t);
    } catch {
      /* ignore */
    }
  }, theme);
}

/** Shoots the page as it is (no navigation) at both widths — for /checkout, which is only reached from the cart. */
async function shootHere(page: Page, file: string) {
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(600);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.screenshot({
      path: join(OUT, `${file}-${w}.jpg`),
      type: 'jpeg',
      quality: 60,
      fullPage: true,
      clip: { x: 0, y: 0, width: w, height: Math.min(h, w === 390 ? 3200 : 2400) },
    });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
}

async function shoot(page: Page, file: string, path: string, settle: 'networkidle' | 'load' = 'networkidle') {
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(path, { waitUntil: settle });
    await page.waitForTimeout(settle === 'load' ? 2500 : 500);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.screenshot({
      path: join(OUT, `${file}-${w}.jpg`),
      type: 'jpeg',
      quality: 60,
      fullPage: true,
      clip: { x: 0, y: 0, width: w, height: Math.min(h, w === 390 ? 3200 : 2400) },
    });
  }
}

for (const locale of ['ar', 'en'] as const)
  for (const theme of THEMES)
    test(`w-00 ${locale} ${theme}`, async ({ browser }) => {
      test.setTimeout(300_000);
      const ctx = await browser.newContext({
        colorScheme: theme,
        reducedMotion: 'reduce',
        locale: locale === 'ar' ? 'ar-SA' : 'en-GB',
      });
      await setTheme(ctx, theme);
      const page = await ctx.newPage();
      const p = (s: string) => `${locale}-${theme}-${s}`;
      await shoot(page, p('1-home'), `/${locale}/`);
      await shoot(page, p('2-project'), `/${locale}/p/${SLUG}`);
      await shoot(page, p('7-404'), `/${locale}/no-such-page`);

      // A donor: sign in, one line in the cart, checkout, pay on the API's fake gateway, the paid order page.
      await page.setViewportSize({ width: 1440, height: 900 });
      await signIn(page, locale, undefined, `/p/${SLUG}`);
      await page.waitForLoadState('networkidle');
      const box = page.locator('.buybox');
      await box.locator('.chip').first().click();
      await box.locator('button.add').click();
      await expect(page.locator('a.cartbtn')).toHaveAttribute('data-lines', '1');
      // In-app navigation, not a reload: a second token refresh within 20 s is refused by the API (auth.refresh_race).
      await page.locator('a.cartbtn').click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/cart$`));
      await expect(page.locator('ta-cart-line')).toHaveCount(1);
      await shootHere(page, p('3-cart'));
      await page.locator('.cartsec a.cta, a.cta[href$="/checkout"]').first().click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/checkout$`));
      await expect(page.locator('button.pay-btn')).toBeVisible();
      await shootHere(page, p('4-checkout'));
      const name = page.locator('#co-name');
      if (await name.isVisible()) await name.fill(locale === 'ar' ? 'متبرع' : 'Donor');
      await page.locator('#co-email').fill(`donor-${Date.now()}@example.com`);
      await page.locator('button.pay-btn').click();
      const ref = await payOnHostedPage(page, 'pay');
      // The order page polls the API, so the network never goes idle there.
      await expect(page.locator('.osec .card h2')).toBeVisible();
      await shoot(page, p('5-order-paid'), `/${locale}/orders/${ref}`, 'load');
      await ctx.close();

      // Staff: the admin dashboard.
      const actx = await browser.newContext({ colorScheme: theme, reducedMotion: 'reduce' });
      await setTheme(actx, theme);
      const apage = await actx.newPage();
      await apage.setViewportSize({ width: 1440, height: 900 });
      await staffSignIn(apage, locale, 'admin');
      await shoot(apage, p('6-admin'), `/${locale}/admin`, 'load');
      await actx.close();
    });
