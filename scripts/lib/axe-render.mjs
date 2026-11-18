/**
 * W-00.12: blocks styled `content-visibility: auto` (off-screen cards, trust row, project panels) are not rendered until
 * they near the viewport, and axe cannot compute colours for unrendered content (false colour-contrast results). Before
 * a scan, every such block is rendered (`content-visibility: visible` inline), so axe checks the REAL colours of ALL
 * content — nothing is skipped or relaxed. Shared by scripts/a11y.mjs and e2e/support/a11y.ts.
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<() => Promise<void>>} restores the page
 */
export async function renderAllForAxe(page) {
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('*'))
      if (el instanceof HTMLElement && getComputedStyle(el).contentVisibility === 'auto') {
        el.dataset['axeCv'] = '1';
        el.style.contentVisibility = 'visible';
      }
  });
  return () =>
    page.evaluate(() => {
      for (const el of document.querySelectorAll('[data-axe-cv]')) {
        if (!(el instanceof HTMLElement)) continue;
        el.style.removeProperty('content-visibility');
        delete el.dataset['axeCv'];
      }
    });
}
