import { Component, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GsapService } from '../../../core/services/gsap.service';
import { TranslateService } from '../../../core/services/translate.service';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      id="about"
      class="py-24 md:py-32 px-6 bg-white dark:bg-stone-950 relative overflow-hidden transition-colors duration-500"
    >
      <!-- Subtle Pattern -->
      <div
        class="absolute inset-0 opacity-[0.015] pointer-events-none"
        style="background-image: radial-gradient(circle at 1px 1px, #000 1px, transparent 0); background-size: 40px 40px;"
      ></div>

      <div class="max-w-6xl mx-auto relative z-10">
        <!-- Section Header - LEFT ALIGNED -->
        <div class="mb-14 gs-reveal">
          <span
            class="text-emerald-600 font-mono font-bold text-xs tracking-widest uppercase mb-3 block"
          >
            // {{ i18n.t().about.label }}
          </span>
          <h2
            class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 flex items-center gap-4"
          >
            {{ i18n.t().about.title }}
            <span class="hidden md:block flex-1 h-px bg-stone-200 dark:bg-stone-700"></span>
          </h2>
        </div>

        <div class="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          <!-- Photo (2 cols) - ENHANCED HOVER -->
          <div class="lg:col-span-2 gs-reveal">
            <div class="relative group max-w-xs mx-auto lg:mx-0">
              <div class="relative aspect-square">
                <!-- Animated decorative frames -->
                <div
                  class="absolute -inset-3 bg-emerald-500/10 rounded-2xl transform rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500"
                ></div>
                <div
                  class="absolute -inset-3 border border-emerald-500/20 rounded-2xl transform -rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500"
                ></div>

                <!-- Photo with zoom effect -->
                <div
                  class="relative bg-stone-100 rounded-xl overflow-hidden aspect-square shadow-lg group-hover:shadow-2xl group-hover:shadow-emerald-500/20 transition-all duration-500"
                >
                  <img
                    src="images/profile.jpeg"
                    alt="Emerson Quijada Rafael"
                    class="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <!-- Overlay on hover -->
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  ></div>
                </div>

                <!-- Available Badge - Animated -->
                <div
                  class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 group-hover:bg-emerald-600 transition-colors duration-300"
                >
                  <span class="relative flex h-2 w-2">
                    <span
                      class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                    ></span>
                    <span
                      class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 group-hover:bg-white transition-colors"
                    ></span>
                  </span>
                  <span class="text-xs font-medium">Disponible</span>
                </div>
              </div>

              <!-- Location -->
              <div class="flex items-center gap-2 mt-8 text-stone-500 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <span>Huancayo, Perú</span>
              </div>
            </div>
          </div>

          <!-- Content (3 cols) -->
          <div class="lg:col-span-3 space-y-5">
            <!-- Name & Title -->
            <div class="gs-reveal">
              <h3 class="text-xl md:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-1">
                {{ i18n.t().about.name }}
              </h3>
              <p class="text-emerald-600 font-mono text-sm">
                {{ i18n.t().about.subtitle }}
              </p>
            </div>

            <!-- Full Bio -->
            <div class="text-stone-600 dark:text-stone-400 leading-relaxed space-y-4 gs-reveal">
              <p>
                <strong class="text-stone-800 dark:text-stone-200"
                  >Técnico Titulado en Computación y Soluciones Informáticas</strong
                >
                y estudiante de Ingeniería de Sistemas. Desarrollador con experiencia en
                <span class="text-emerald-700 dark:text-emerald-400 font-medium"
                  >backend (Java, Spring Boot, SQL Server)</span
                >
                y
                <span class="text-teal-700 dark:text-teal-400 font-medium"
                  >frontend (Angular, Astro)</span
                >.
              </p>
              <p>
                Especializado en la creación de
                <strong class="text-stone-800 dark:text-stone-200"
                  >aplicaciones web escalables</strong
                >
                mediante arquitecturas de microservicios y tecnologías cloud-native
                <span
                  class="font-mono text-xs bg-stone-100 dark:bg-stone-800 dark:text-stone-300 px-2 py-0.5 rounded"
                  >(AWS, Docker)</span
                >. Apasionado por integrar prácticas
                <strong class="text-stone-800 dark:text-stone-200"
                  >DevOps (CI/CD, automatización)</strong
                >
                para optimizar el ciclo de desarrollo.
              </p>
              <p
                class="text-stone-500 dark:text-stone-400 text-sm border-l-2 border-emerald-500 pl-4 italic"
              >
                "Busco oportunidades como Desarrollador Junior donde pueda aportar soluciones
                técnicas innovadoras y seguir creciendo profesionalmente."
              </p>
            </div>

            <!-- Tech Cards - INTERACTIVE -->
            <div class="grid grid-cols-2 gap-4 pt-2 gs-reveal">
              <div
                class="group/card bg-stone-50 dark:bg-stone-900 p-4 rounded-lg border border-stone-100 dark:border-stone-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 cursor-default active:scale-[0.98]"
              >
                <div class="text-emerald-600 font-bold text-sm mb-2 flex items-center gap-2">
                  <span
                    class="w-2 h-2 bg-emerald-500 rounded-full group-hover/card:animate-pulse"
                  ></span>
                  Backend
                </div>
                <div
                  class="text-stone-600 dark:text-stone-400 text-xs space-y-1 group-hover/card:text-stone-800 dark:group-hover/card:text-stone-200 transition-colors"
                >
                  <div>• Java · Spring Boot</div>
                  <div>• SQL Server · PostgreSQL</div>
                  <div>• Docker · AWS</div>
                </div>
              </div>
              <div
                class="group/card bg-stone-50 dark:bg-stone-900 p-4 rounded-lg border border-stone-100 dark:border-stone-800 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/30 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 cursor-default active:scale-[0.98]"
              >
                <div class="text-teal-600 font-bold text-sm mb-2 flex items-center gap-2">
                  <span
                    class="w-2 h-2 bg-teal-500 rounded-full group-hover/card:animate-pulse"
                  ></span>
                  Frontend
                </div>
                <div
                  class="text-stone-600 dark:text-stone-400 text-xs space-y-1 group-hover/card:text-stone-800 dark:group-hover/card:text-stone-200 transition-colors"
                >
                  <div>• Angular · Astro</div>
                  <div>• Tailwind CSS · PrimeNG</div>
                  <div>• HTML5 · CSS3 · JS</div>
                </div>
              </div>
            </div>

            <!-- CTA -->
            <div class="flex flex-wrap gap-3 pt-3 gs-reveal">
              <a
                href="#contact"
                (click)="scrollToContact($event)"
                class="group inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 cursor-pointer active:scale-95"
              >
                <svg
                  class="w-4 h-4 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {{ i18n.t().about.cta_contact }}
              </a>
              <a
                href="https://minimalist-portfolio-eta.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                class="group inline-flex items-center gap-2 px-5 py-2.5 border-2 border-stone-200 text-stone-600 text-sm font-bold rounded-lg hover:border-emerald-500 hover:text-emerald-700 transition-all active:scale-95"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                {{ i18n.t().about.cta_cv_online }}
              </a>
              <a
                href="cv/CV_Emerson_Quijada_Rafael.pdf"
                download="CV_Emerson_Quijada_Rafael.pdf"
                class="group inline-flex items-center gap-2 px-5 py-2.5 border-2 border-stone-200 text-stone-600 text-sm font-bold rounded-lg hover:border-emerald-500 hover:text-emerald-700 transition-all active:scale-95"
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
                {{ i18n.t().about.cta_cv_download }}
              </a>
            </div>
          </div>
        </div>

        <!-- Stats - ANIMATED COUNTERS -->
        <div
          class="grid grid-cols-3 gap-8 mt-14 pt-10 border-t border-stone-100 dark:border-stone-800"
        >
          @for (stat of animatedStats(); track stat.label; let i = $index) {
            <div class="text-center gs-reveal group cursor-default">
              <div
                class="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-200 group-hover:text-emerald-600 transition-colors"
              >
                @if (stat.isNumber) {
                  <span class="tabular-nums">{{ stat.currentValue }}</span
                  >{{ stat.suffix }}
                } @else {
                  {{ stat.value }}
                }
              </div>
              <div
                class="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-wider mt-1 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors"
              >
                {{ stat.label }}
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AboutSectionComponent implements OnInit {
  private gsap = inject(GsapService);
  private platformId = inject(PLATFORM_ID);
  i18n = inject(TranslateService);

  animatedStats = signal([
    { value: '2+', label: 'Años Dev', isNumber: true, currentValue: 0, target: 2, suffix: '+' },
    { value: '10+', label: 'Proyectos', isNumber: true, currentValue: 0, target: 10, suffix: '+' },
    {
      value: 'Full Stack',
      label: 'Enfoque',
      isNumber: false,
      currentValue: 0,
      target: 0,
      suffix: '',
    },
  ]);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Start counter animation after a delay
      setTimeout(() => this.animateCounters(), 2000);
    }
  }

  private animateCounters() {
    const stats = this.animatedStats();
    const duration = 1500; // 1.5 seconds
    const steps = 30;
    const interval = duration / steps;

    stats.forEach((stat, index) => {
      if (stat.isNumber) {
        let current = 0;
        const increment = stat.target / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.target) {
            current = stat.target;
            clearInterval(timer);
          }

          this.animatedStats.update((s) => {
            const updated = [...s];
            updated[index] = { ...updated[index], currentValue: Math.floor(current) };
            return updated;
          });
        }, interval);
      }
    });
  }

  scrollToContact(event: Event) {
    event.preventDefault();
    this.gsap.scrollTo('#contact', 80);
  }
}
