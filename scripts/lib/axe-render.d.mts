import type { Page } from '@playwright/test';

export function renderAllForAxe(page: Page): Promise<() => Promise<void>>;
