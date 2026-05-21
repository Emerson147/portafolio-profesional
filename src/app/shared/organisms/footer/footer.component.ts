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
      id="contact"
      class="bg-stone-900 dark:bg-stone-950 text-white pb-20 pt-16 px-6 relative overflow-hidden transition-colors duration-500"
    >
      <!-- Dot grid -->
      <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none"
        style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px;"
      ></div>

      <div class="max-w-5xl mx-auto relative z-10">
        <!-- Headline + CTA section -->
        <div class="text-center mb-16 footer-reveal">
          <h2 class="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
            {{ i18n.t().footer.headline1 }}<br />
            <span class="text-emerald-400">{{ i18n.t().footer.headline2 }}</span>
          </h2>
          <p class="text-stone-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            {{ i18n.t().footer.subtitle }}
          </p>

       
        </div>

        <!-- Bottom bar -->
        <div
          class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-stone-500 gap-4 footer-reveal"
        >
          <div class="flex flex-col md:flex-row gap-3 items-center">
            <p>
              <span class="text-stone-600">©</span> 2026 MigatteDev
              <span class="text-stone-600 mx-1">•</span>
              <span class="text-stone-600">v1.0.0</span>
            </p>
            <span class="hidden md:inline text-stone-700">|</span>
            <p class="text-stone-600">
              Built with Angular 17 <span class="mx-1">•</span> Deployed on Vercel
            </p>
          </div>

          <!-- Social links -->
          <div class="flex gap-3" role="list" aria-label="Redes sociales">
            <a
              href="https://www.linkedin.com/in/migattedev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              class="w-9 h-9 border border-white/15 rounded-full flex items-center justify-center text-stone-400 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
              [innerHTML]="getIcon('linkedin')"
            ></a>
            <a
              href="https://github.com/Emerson147"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              class="w-9 h-9 border border-white/15 rounded-full flex items-center justify-center text-stone-400 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
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
      document.querySelectorAll('#contact .footer-reveal').forEach((el, i) => {
        (el as HTMLElement).style.transitionDelay = `${i * 130}ms`;
        this.observer?.observe(el);
      });
    });
  }

  getIcon(name: keyof typeof ICONS): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[name] ?? '');
  }
}
