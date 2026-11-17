import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { I18nService } from '../../core/i18n/i18n';
import { SHOWCASE } from '../../core/showcase/showcase';
import { QuickDonate } from '../../core/ui/quick-donate.service';
import { Icon } from '../../shared/ui/icon/icon';

/**
 * Store footer (Dar Africa prototype `#foot`, W-00): the quote band with «تبرع للصندوق العام» (opens the quick-donate
 * dialog — hidden in showcase), about, association links on the main site (about, library, contact), store links,
 * payment marks as text pills (hidden in showcase) and the copyright. No licence number, e-mail or policy links until
 * they exist (the API does not expose them yet; no placeholder legal text is ever published — ta3lom W-02).
 */
@Component({
  selector: 'ta-footer',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly main = environment.mainSiteUrl;
  private readonly locale = inject(I18nService).locale;
  /** Showcase mode (SW-2): no donations link, no payment marks. */
  protected readonly showcase = inject(SHOWCASE);
  protected readonly quick = inject(QuickDonate);
  protected readonly year = new Date().getFullYear();

  /** A page of the association's main site in the current locale (`https://darafrica.org/ar/about`). */
  protected mainPath(page: string): string {
    return `${this.main}/${this.locale}/${page}`;
  }
}
