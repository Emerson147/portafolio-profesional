import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS } from '../../../core/data/icons.data';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer id="contact" class="bg-stone-900 text-white py-24 px-6 relative overflow-hidden">
      <!-- Blueprint Grid Pattern - Minimalist -->
      <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none"
        style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px;"
      ></div>

      <div class="max-w-5xl mx-auto text-center relative z-10">
        <h2 class="text-5xl md:text-7xl font-bold mb-8 tracking-tighter gs-reveal">
          Vamos a crear algo <br /><span class="text-emerald-500">sólido.</span>
        </h2>
        <p class="text-stone-400 text-lg mb-12 max-w-2xl mx-auto gs-reveal">
          ¿Buscas un desarrollador que entienda tanto la lógica del backend como la experiencia del
          frontend? Estoy listo para unirme a tu equipo.
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

        <!-- CTA Buttons -->
        <div class="mb-12 flex flex-wrap justify-center gap-4 gs-reveal">
          <a
            href="mailto:emersontec147@gmail.com"
            class="group inline-flex items-center gap-3 px-8 py-4 border-2 border-emerald-500 text-emerald-400 font-mono text-sm rounded-lg hover:bg-emerald-500 hover:text-stone-900 transition-all duration-300"
          >
            <span class="w-5 h-5" [innerHTML]="getIcon('mail')"></span>
            <span>ENVIAR MENSAJE</span>
            <span class="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>

          <a
            href="assets/cv-migattedev.pdf"
            download
            class="group inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-stone-300 font-mono text-sm rounded-lg hover:border-emerald-500 hover:text-emerald-400 transition-all duration-300"
          >
            <span>DESCARGAR CV</span>
            <span
              class="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300"
              [innerHTML]="getIcon('arrowUpRight')"
            ></span>
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
          <div class="flex gap-4 mt-4 md:mt-0">
            <a
              href="https://linkedin.com/in/tuusuario"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-stone-400 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300"
              [innerHTML]="getIcon('linkedin')"
            ></a>
            <a
              href="https://github.com/tuusuario"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-stone-400 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300"
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

  getIcon(iconName: keyof typeof ICONS): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[iconName] || '');
  }
}
