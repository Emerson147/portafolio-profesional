import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { es } from '../i18n/es';
import { en } from '../i18n/en';
import { Translations } from '../i18n/es';

export type Lang = 'es' | 'en';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private platformId = inject(PLATFORM_ID);

  lang = signal<Lang>('es');

  // The full translations object for the current language
  t = computed<Translations>(() => (this.lang() === 'es' ? es : en));

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('zen-lang') as Lang | null;
      if (stored === 'es' || stored === 'en') {
        this.lang.set(stored);
      } else {
        // Auto-detect from browser language
        const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';
        this.lang.set(browserLang);
      }
    }
  }

  toggle() {
    const next: Lang = this.lang() === 'es' ? 'en' : 'es';
    this.lang.set(next);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('zen-lang', next);
      // Update html lang attribute for accessibility/SEO
      document.documentElement.lang = next;
    }
  }

  setLang(lang: Lang) {
    this.lang.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('zen-lang', lang);
      document.documentElement.lang = lang;
    }
  }
}
