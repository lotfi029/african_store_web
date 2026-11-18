import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/**
 * W-00.12: blocks styled `content-visibility: auto` (off-screen cards, trust row, project panels) are not rendered until
 * they near the viewport, and axe cannot compute colours for unrendered content (false colour-contrast results). Before
 * a scan, every such block is rendered (`content-visibility: visible` inline), so axe checks the REAL colours of ALL
 * content — nothing is skipped or relaxed. Returns a function that restores the page.
 */
export async function renderAllForAxe(page: Page): Promise<() => Promise<void>> {
  await page.evaluate(() => {
    for (const el of document.querySelectorAll<HTMLElement>('*'))
      if (getComputedStyle(el).contentVisibility === 'auto') {
        el.dataset['axeCv'] = '1';
        el.style.contentVisibility = 'visible';
      }
  });
  return () =>
    page.evaluate(() => {
      for (const el of document.querySelectorAll<HTMLElement>('[data-axe-cv]')) {
        el.style.removeProperty('content-visibility');
        delete el.dataset['axeCv'];
      }
    });
}

/**
 * axe on the current page state, in the current theme AND the other one (plan §6: ar/en × light/dark, client states).
 * Serious/critical violations fail the test.
 */
export async function expectNoA11yViolations(page: Page, label = page.url()): Promise<void> {
  const restore = await renderAllForAxe(page);
  try {
    await scan(page, label);
  } finally {
    await restore();
  }
}

async function scan(page: Page, label: string): Promise<void> {
  for (const theme of ['light', 'dark'] as const) {
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    await page.waitForTimeout(250);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(
      blocking.map(
        (v) =>
          `${label} [${theme}] ${v.id}: ${v.help} — ${v.nodes
            .map((n) => n.target.join(' '))
            .slice(0, 3)
            .join(' | ')}`,
      ),
    ).toEqual([]);
  }
}

/** No horizontal scroll at the current viewport (plan §4.1: 320 px). */
export async function expectNoHorizontalScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, 'page scrolls horizontally').toBeLessThanOrEqual(0);
}
