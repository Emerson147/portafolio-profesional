import { Component, inject, AfterViewInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS } from '../../../core/data/icons.data';
import { TranslateService } from '../../../core/services/translate.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer
      id="site-footer"
      class="bg-transparent pb-12 pt-24 px-6 relative overflow-hidden transition-colors duration-500"
    >
      <div class="max-w-5xl mx-auto relative z-10">
        <!-- Headline -->
        <div class="text-center mb-24 footer-reveal">
          <h2 class="text-3xl md:text-5xl font-bold mb-4 tracking-tighter text-stone-900 dark:text-stone-50">
            {{ i18n.t().footer.headline1 }}<br />
            <span class="text-emerald-600 dark:text-emerald-500">{{ i18n.t().footer.headline2 }}</span>
          </h2>
          <p class="text-stone-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light">
            {{ i18n.t().footer.subtitle }}
          </p>
        </div>

        <!-- Bottom bar -->
        <div
          class="pt-8 border-t border-stone-200 dark:border-stone-800/50 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono tracking-widest text-stone-400 dark:text-stone-500 uppercase gap-6 footer-reveal"
        >
          <div class="flex flex-col md:flex-row gap-2 items-center text-center md:text-left">
            <p>
              <span class="text-emerald-600 dark:text-emerald-500">©</span> 2026 MigatteDev
              <span class="hidden md:inline mx-2 opacity-30">•</span>
            </p>
            <p>
              Built with Angular 18 <span class="mx-2 opacity-30">•</span> Deployed on Vercel
            </p>
          </div>

          <!-- Social links -->
          <div class="flex gap-4" role="list" aria-label="Redes sociales">
            <a
              href="https://www.linkedin.com/in/migattedev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              class="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300"
              [innerHTML]="getIcon('linkedin')"
            ></a>
            <a
              href="https://github.com/Emerson147"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              class="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300"
              [innerHTML]="getIcon('github')"
            ></a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .footer-reveal {
        opacity: 0;
        transform: translateY(16px);
        transition:
          opacity 0.6s ease,
          transform 0.6s ease;
      }
      .footer-reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `,
  ],
})
export class FooterComponent implements AfterViewInit, OnDestroy {
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);
  i18n = inject(TranslateService);

  private observer: IntersectionObserver | null = null;

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.setupObserver();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private setupObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          this.observer?.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    requestAnimationFrame(() => {
      document.querySelectorAll('#site-footer .footer-reveal').forEach((el, i) => {
        (el as HTMLElement).style.transitionDelay = `${i * 130}ms`;
        this.observer?.observe(el);
      });
    });
  }

  getIcon(name: keyof typeof ICONS): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[name] ?? '');
  }
}
