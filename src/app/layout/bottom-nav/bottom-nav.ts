import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injector, afterNextRender, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { StoreAuth } from '../../core/auth/store-auth';
import { SHOWCASE } from '../../core/showcase/showcase';
import { Icon } from '../../shared/ui/icon/icon';

export type BottomNavItem = 'home' | 'cart' | 'account' | null;

/** Which item is the current page for a router URL (`aria-current`). */
export function currentItem(url: string): BottomNavItem {
  const path = url.split(/[?#]/)[0];
  if (path === '/' || path === '') return 'home';
  if (path.startsWith('/cart') || path.startsWith('/checkout')) return 'cart';
  if (path.startsWith('/account') || path.startsWith('/login')) return 'account';
  return null;
}

/**
 * Phone bottom bar (africadawah prototype, W-00 plan §4 Phase 4), shown ≤ 760 px: الرئيسية · الأقسام · البحث · السلة ·
 * حسابي. «الأقسام» scrolls to and focuses the category tab bar (`#cats`, on the home page — from another page it goes
 * home first); «البحث» focuses the header search (`#hdr-q`). Showcase mode hides السلة and حسابي (no cart or account).
 * The public layout pads its bottom by `--bnav-h` while the bar shows (base.css), so it never covers content.
 */
@Component({
  selector: 'ta-bottom-nav',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="bnav" aria-label="التنقل السفلي" i18n-aria-label="@@store.layout.bottom-nav-label">
      <a class="it" routerLink="/" [attr.aria-current]="current() === 'home' ? 'page' : null">
        <ta-icon name="home" [size]="22" /><span i18n="@@store.layout.nav-home">الرئيسية</span>
      </a>
      <button type="button" class="it" (click)="sections()">
        <ta-icon name="grid" [size]="22" /><span i18n="@@store.layout.bottom-sections">الأقسام</span>
      </button>
      <button type="button" class="it" (click)="searchFocus()">
        <ta-icon name="search" [size]="22" /><span i18n="@@store.layout.bottom-search">البحث</span>
      </button>
      @if (!showcase) {
        <a class="it" routerLink="/cart" [attr.aria-current]="current() === 'cart' ? 'page' : null">
          <ta-icon name="cart" [size]="22" /><span i18n="@@store.layout.nav-cart">السلة</span>
        </a>
        <a
          class="it"
          [routerLink]="auth.isSignedIn() ? '/account/donations' : '/login'"
          [attr.aria-current]="current() === 'account' ? 'page' : null"
        >
          <ta-icon name="user" [size]="22" /><span i18n="@@store.layout.account">حسابي</span>
        </a>
      }
    </nav>
  `,
  styles: `
    :host {
      display: none;
    }
    @media (width <= 760px) {
      :host {
        display: block;
        position: fixed;
        inset-inline: 0;
        inset-block-end: 0;
        z-index: 46;
        background: var(--c-surface);
        border-block-start: 1px solid var(--c-border);
        box-shadow: 0 -8px 24px var(--c-header-shadow);
        padding-block-end: env(safe-area-inset-bottom, 0px);
      }
    }
    .bnav {
      display: flex;
      justify-content: space-around;
    }
    .it {
      flex: 1 1 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      min-block-size: 60px;
      min-inline-size: 44px;
      padding: 6px 2px;
      border: 0;
      background: none;
      color: var(--c-muted);
      font: inherit;
      font-size: 0.72rem;
      line-height: 1.3;
      text-decoration: none;
      cursor: pointer;
    }
    .it[aria-current='page'] {
      color: var(--c-link);
      font-weight: 700;
    }
    .it:focus-visible {
      outline-offset: -3px;
    }
  `,
})
export class BottomNav {
  protected readonly showcase = inject(SHOWCASE);
  protected readonly auth = inject(StoreAuth);
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  protected readonly current = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => currentItem(this.router.url)),
    ),
    { initialValue: currentItem(this.router.url) },
  );

  /** «الأقسام»: the category tab bar, focused on its current tab (going home first when it is not on the page). */
  protected async sections(): Promise<void> {
    let bar = this.doc.getElementById('cats');
    if (!bar) {
      await this.router.navigateByUrl('/');
      // Zoneless: the home page's template (and its tab bar) renders after the navigation resolves.
      for (let i = 0; !bar && i < 5; i++) {
        await new Promise<void>((r) => afterNextRender(() => r(), { injector: this.injector }));
        bar = this.doc.getElementById('cats');
      }
    }
    if (!bar) return;
    const reduce = this.doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    bar.scrollIntoView?.({ behavior: reduce ? 'instant' : 'smooth', block: 'start' });
    const tab = bar.querySelector<HTMLElement>('[aria-current="page"]') ?? bar.querySelector<HTMLElement>('a');
    tab?.focus({ preventScroll: true });
  }

  /** «البحث»: the header search field (the header comes back on focus — header.ts `away`). */
  protected searchFocus(): void {
    const q = this.doc.getElementById('hdr-q') as HTMLInputElement | null;
    q?.focus();
    q?.scrollIntoView?.({ block: 'nearest' });
  }
}
