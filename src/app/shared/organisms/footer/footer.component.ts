import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
      class="bg-stone-900 dark:bg-stone-950 text-white pb-24 pt-12 px-6 relative overflow-hidden transition-colors duration-500"
    >
      <!-- Blueprint Grid Pattern - Minimalist -->
      <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none"
        style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px;"
      ></div>

      <div class="max-w-5xl mx-auto text-center relative z-10">
        <h2 class="text-5xl md:text-7xl font-bold mb-8 tracking-tighter gs-reveal">
          {{ i18n.t().footer.headline1 }} <br /><span class="text-emerald-500">{{
            i18n.t().footer.headline2
          }}</span>
        </h2>
        <p class="text-stone-400 text-lg mb-12 max-w-2xl mx-auto gs-reveal">
          {{ i18n.t().footer.subtitle }}
        </p>

        <!-- Contact Info - Blueprint Grid -->
        <div class="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto text-left gs-reveal">
          <!-- Email -->
          <div
            class="p-6 border border-white/10 rounded-lg hover:border-emerald-500/50 transition-colors group bg-stone-900/50"
          >
            <span class="text-xs font-mono text-emerald-500 block mb-3">// EMAIL</span>
            <a
              href="mailto:emersontec147@gmail.com"
              class="text-lg text-stone-300 group-hover:text-white transition-colors break-all"
            >
              emersontec147&#64;gmail.com
            </a>
          </div>

          <!-- Location -->
          <div
            class="p-6 border border-white/10 rounded-lg hover:border-emerald-500/50 transition-colors group bg-stone-900/50"
          >
            <span class="text-xs font-mono text-emerald-500 block mb-3">// LOCATION</span>
            <p class="text-lg text-stone-300 group-hover:text-white transition-colors">
              Huancayo, Perú
            </p>
          </div>

          <!-- Status -->
          <div
            class="p-6 border border-white/10 rounded-lg hover:border-emerald-500/50 transition-colors group bg-stone-900/50"
          >
            <span class="text-xs font-mono text-emerald-500 block mb-3">// STATUS</span>
            <div class="flex items-center gap-3">
              <span class="relative flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                ></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p class="text-lg text-stone-300 group-hover:text-white transition-colors">
                Disponible
              </p>
            </div>
          </div>
        </div>

        <div class="mb-12 flex flex-wrap justify-center gap-4 gs-reveal">
          <!-- Ver CV Online -->
          <a
            href="https://minimalist-portfolio-eta.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            class="group inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-sm rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/20"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span>VER CV ONLINE</span>
          </a>
          <!-- Descargar PDF -->
          <a
            href="assets/cv-migattedev.pdf"
            download
            class="group inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-stone-300 font-mono text-sm rounded-lg hover:border-emerald-500 hover:text-emerald-400 transition-all duration-300"
          >
            <svg
              class="w-4 h-4 group-hover:translate-y-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>DESCARGAR PDF</span>
          </a>
        </div>

        <div
          class="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-stone-500"
        >
          <div class="flex flex-col md:flex-row gap-4 items-center">
            <p>
              <span class="text-stone-600">©</span> 2026 MigatteDev
              <span class="text-stone-600 mx-2">•</span>
              <span class="text-stone-600">v1.0.0</span>
            </p>
            <p class="hidden md:block text-stone-700">|</p>
            <p class="text-stone-600">
              Built with Angular 17 <span class="mx-2">•</span> Deployed on Vercel
            </p>
          </div>

          <!-- Social Links - Icon Buttons -->
          <div class="flex gap-4 mt-4 md:mt-0" role="list" aria-label="Redes sociales">
            <a
              href="https://linkedin.com/in/emerson-quijada-rafael"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver perfil de LinkedIn de Emerson Quijada Rafael (abre en nueva pestaña)"
              class="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-stone-400 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
              [innerHTML]="getIcon('linkedin')"
            ></a>
            <a
              href="https://github.com/Emerson147"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver perfil de GitHub de Emerson147 (abre en nueva pestaña)"
              class="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-stone-400 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
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
    `,
  ],
})
export class FooterComponent {
  private sanitizer = inject(DomSanitizer);
  i18n = inject(TranslateService);

  getIcon(iconName: keyof typeof ICONS): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[iconName] || '');
  }
}
