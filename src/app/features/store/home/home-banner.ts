import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Category, ProjectCard } from '../../../core/api/api.types';
import { I18nService } from '../../../core/i18n/i18n';
import { SHOWCASE } from '../../../core/showcase/showcase';
import { Icon } from '../../../shared/ui/icon/icon';

/**
 * The cards the banner shows (Option C §2, §3 row 4): every `urgent` featured card, else the first featured card,
 * else none (no banner). Featured come from `GET /v1/catalog/home` in the API's order.
 */
export function bannerSlides(featured: readonly ProjectCard[]): ProjectCard[] {
  const urgent = featured.filter((c) => c.badge === 'urgent');
  if (urgent.length) return urgent;
  return featured.length ? [featured[0]] : [];
}

/**
 * Campaign banner (Dar Africa prototype, W-00): ink panel with decorative ring art, a sand pill («حملة عاجلة» for an
 * urgent card, else the category), the title — the page's single `<h1>` —, summary, the sand «تبرع الآن» CTA and the
 * «التفاصيل» ghost link → `/p/{slug}`. Several urgent cards: labelled previous/next buttons and dots (`aria-pressed`),
 * NO auto-rotate; the change is announced in a polite live region. No cover image and no progress bar (A-10).
 */
@Component({
  selector: 'ta-home-banner',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (slide(); as s) {
      <section class="banner" [attr.aria-label]="regionLabel">
        <!-- Decorative ring art (Dar Africa prototype), never announced. -->
        <svg class="rings" viewBox="0 0 420 420" aria-hidden="true" focusable="false">
          <circle cx="210" cy="210" r="205" />
          <circle cx="210" cy="210" r="150" />
          <circle cx="210" cy="210" r="95" />
          <path d="M5 210h410M210 5v410" />
        </svg>
        <div class="txt">
          @if (s.badge === 'urgent') {
            <span class="pill" i18n="@@store.home.banner-urgent">حملة عاجلة</span>
          } @else if (categoryName(s); as cat) {
            <span class="pill">{{ cat }}</span>
          }
          <h1 class="t">{{ title(s) }}</h1>
          @if (summary(s); as sum) {
            <p class="sum">{{ sum }}</p>
          }
          <div class="row">
            <a class="cta" [routerLink]="['/p', s.slug]"
              ><ta-icon name="heart" [size]="18" />@if (showcase) {
                <span i18n="@@store.home.banner-cta-showcase">تعرّف على المشروع</span>
              } @else {
                <span i18n="@@store.home.banner-cta">تبرع الآن</span>
              }<span class="visually-hidden">: {{ title(s) }}</span></a
            >
            @if (!showcase) {
              <a class="ghost" [routerLink]="['/p', s.slug]"
                ><span i18n="@@store.home.banner-details">التفاصيل</span
                ><span class="visually-hidden">: {{ title(s) }}</span></a
              >
            }
            @if (slides().length > 1) {
              <div class="ctrl">
                <button
                  type="button"
                  class="nav prev"
                  (click)="go(index() - 1)"
                  aria-label="الحملة السابقة"
                  i18n-aria-label="@@store.home.banner-prev"
                >
                  <ta-icon name="chevron" [size]="18" />
                </button>
                <div class="dots">
                  @for (d of slides(); track d.id; let i = $index) {
                    <button
                      type="button"
                      class="dot"
                      [attr.aria-pressed]="i === index() ? 'true' : 'false'"
                      [attr.aria-label]="dotLabel(i)"
                      (click)="go(i)"
                    >
                      <span class="pip" aria-hidden="true"></span>
                    </button>
                  }
                </div>
                <button
                  type="button"
                  class="nav next"
                  (click)="go(index() + 1)"
                  aria-label="الحملة التالية"
                  i18n-aria-label="@@store.home.banner-next"
                >
                  <ta-icon name="chevron" [size]="18" />
                </button>
              </div>
            }
          </div>
          <p class="visually-hidden" aria-live="polite">{{ announce() }}</p>
        </div>
      </section>
    }
  `,
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
    }
    .banner {
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      block-size: 100%;
      min-block-size: 360px;
      padding: var(--space-8);
      border-radius: var(--r-lg);
      background: var(--c-surface-dark);
      color: var(--c-on-brand);
    }
    .rings {
      position: absolute;
      inset-block-start: -70px;
      inset-inline-end: -70px;
      inline-size: 420px;
      block-size: 420px;
      fill: none;
      stroke: var(--c-highlight);
      stroke-width: 1.5;
      opacity: 0.28;
      pointer-events: none;
    }
    @media (width < 600px) {
      .banner {
        padding: var(--space-5);
        min-block-size: 300px;
      }
      .rings {
        inline-size: 300px;
        block-size: 300px;
      }
    }
    .txt {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      min-inline-size: 0;
    }
    .pill {
      align-self: flex-start;
      padding: 3px 14px;
      border-radius: var(--rp);
      background: var(--c-gold);
      color: var(--c-on-gold);
      font-size: 0.82rem;
      font-weight: 700;
    }
    .t {
      margin: 0;
      font-size: clamp(1.6rem, 3.2vw, 2.4rem);
      line-height: 1.35;
      font-weight: 700;
      color: var(--c-on-brand);
      max-inline-size: 30ch;
    }
    .sum {
      margin: 0;
      color: var(--c-on-dark);
      font-size: 1.05rem;
      max-inline-size: 56ch;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-3);
      margin-block-start: var(--space-3);
    }
    .cta,
    .ghost {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      min-block-size: 48px;
      padding-inline: var(--space-6);
      border-radius: var(--rb);
      font-weight: 700;
      text-decoration: none;
    }
    .cta {
      background: var(--c-gold);
      color: var(--c-on-gold);
    }
    .cta:hover {
      box-shadow: var(--shadow-gold);
    }
    .ghost {
      border: 1px solid var(--c-border-on-dark-strong);
      color: var(--c-on-brand);
      font-weight: 500;
    }
    .ghost:hover {
      background: var(--c-on-dark-hover);
    }
    .cta:focus-visible,
    .ghost:focus-visible,
    .nav:focus-visible,
    .dot:focus-visible {
      outline: 2px solid var(--c-on-brand);
      outline-offset: 2px;
    }
    .ctrl {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      margin-inline-start: auto;
    }
    .nav {
      display: grid;
      place-items: center;
      inline-size: 44px;
      block-size: 44px;
      border-radius: 50%;
      border: 1px solid var(--c-border-on-dark-strong);
      background: none;
      color: var(--c-on-brand);
      cursor: pointer;
    }
    .nav:hover {
      background: var(--c-on-dark-hover);
    }
    /* chevron points to the reading end; "previous" turns it around. */
    .prev ta-icon {
      transform: scaleX(-1);
    }
    .dots {
      display: flex;
    }
    .dot {
      display: grid;
      place-items: center;
      inline-size: 32px;
      block-size: 44px;
      border: 0;
      background: none;
      cursor: pointer;
    }
    /* Decoration only: aria-pressed carries the state; the wide sand pip mirrors it. */
    .pip {
      inline-size: 10px;
      block-size: 10px;
      border-radius: var(--rp);
      background: var(--c-on-dark-dot);
      transition: inline-size var(--dur-1);
    }
    .dot[aria-pressed='true'] .pip {
      inline-size: 28px;
      background: var(--c-highlight);
    }
    @media (prefers-reduced-motion: reduce) {
      .pip {
        transition: none;
      }
    }
  `,
})
export class HomeBanner {
  private readonly i18n = inject(I18nService);
  /** Showcase mode (SW-2): the slide's link says "about the project", not "donate now". */
  protected readonly showcase = inject(SHOWCASE);
  readonly featured = input.required<readonly ProjectCard[]>();
  readonly categories = input<readonly Category[]>([]);

  protected readonly slides = computed(() => bannerSlides(this.featured()));
  /** Resets to the first slide whenever the slide list changes, so a dot's aria-current always matches a slide (L-11). */
  protected readonly index = linkedSignal({
    source: () => this.slides().map((s) => s.id).join('|'),
    computation: () => 0,
  });
  protected readonly slide = computed(() => this.slides()[this.index()] ?? null);
  protected readonly announce = signal('');
  protected readonly regionLabel = $localize`:@@store.home.banner-label:حملات التبرع`;

  protected go(i: number): void {
    const n = this.slides().length;
    if (n < 2) return;
    const next = (i + n) % n;
    this.index.set(next);
    const s = this.slides()[next];
    this.announce.set(
      $localize`:@@store.home.banner-announce:الحملة ${next + 1}:n: من ${n}:total:: ${this.title(s)}:title:`,
    );
  }

  protected title(c: ProjectCard): string {
    return this.i18n.pick(c.titleAr, c.titleEn);
  }

  protected summary(c: ProjectCard): string {
    return this.i18n.pick(c.summaryAr ?? '', c.summaryEn);
  }

  protected categoryName(c: ProjectCard): string {
    const cat = this.categories().find((x) => x.slug === c.categorySlug);
    return cat ? this.i18n.pick(cat.nameAr, cat.nameEn) : '';
  }

  protected dotLabel(i: number): string {
    const n = i + 1;
    return $localize`:@@store.home.banner-dot:الحملة ${n}:n:`;
  }
}
