import {
  Component,
  OnDestroy,
  AfterViewInit,
  PLATFORM_ID,
  inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface ProcessStep {
  num: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-process-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      id="process"
      #sectionEl
      class="py-24 md:py-32 relative overflow-hidden bg-transparent"
    >
      <!-- Global grid and lighting now handled by MainLayoutComponent -->

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <!-- ── Header ─────────────────────────────────── -->
        <div class="mb-16 md:mb-24 process-reveal">
          <span
            class="text-emerald-600 dark:text-emerald-500 font-mono font-bold text-[10px] tracking-widest uppercase mb-4 block"
          >
            // Metodología
          </span>
          <h2
            class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 flex items-center gap-4 tracking-tighter"
          >
            Ingeniería <span class="text-emerald-600 dark:text-emerald-500">Consciente</span>
            <span class="hidden md:block flex-1 h-px bg-stone-200 dark:bg-stone-800"></span>
          </h2>
          <p class="text-stone-600 dark:text-stone-400 max-w-2xl mt-4 leading-relaxed font-light">
            Un enfoque donde la precisión se encuentra con la excelencia técnica.
            Cuatro etapas para transformar lo abstracto en software resiliente.
          </p>
        </div>

        <!-- ── Steps ─────────────────────────────────── -->
        <div class="relative">
          <!-- ① Desktop central line (grows on scroll) -->
          <div
            class="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 overflow-hidden"
          >
            <div
              #timelineLine
              class="w-full bg-linear-to-b from-transparent via-emerald-500/50 to-transparent dark:from-transparent dark:via-emerald-500/30 dark:to-transparent"
              style="height: 0%; transition: height 1.6s cubic-bezier(0.4,0,0.2,1);"
            ></div>
            <!-- Thin guide line behind the animated line -->
            <div class="absolute inset-0 w-full h-full bg-stone-200/50 dark:bg-white/5 -z-10"></div>
          </div>

          <!-- Mobile: left-border timeline -->
          <div
            class="md:hidden absolute left-[23px] top-0 bottom-0 w-px bg-stone-200 dark:bg-stone-800"
          ></div>

          <div class="space-y-16 md:space-y-0">
            @for (step of steps; track step.num; let i = $index) {
              <!-- ② Desktop zigzag -->
              <div
                class="process-step hidden md:grid md:grid-cols-[1fr_56px_1fr] md:gap-0 md:items-center group cursor-default"
                [style.transition-delay.ms]="i * 130"
              >
                <!-- LEFT column: content on even steps, empty on odd -->
                <div class="flex justify-end pr-12">
                  @if (i % 2 === 0) {
                    <div class="relative max-w-md w-full text-right p-6 rounded-2xl transition-all duration-500 hover:bg-stone-50 dark:hover:bg-white/[0.02]">
                      <!-- Content -->
                      <div class="mb-4">
                        <h3 class="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {{ step.title }}
                        </h3>
                      </div>
                      <p
                        class="text-stone-500 dark:text-stone-400 leading-relaxed text-sm font-light group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors"
                      >
                        {{ step.description }}
                      </p>
                    </div>
                  }
                </div>

                <!-- CENTER: connector dot on the timeline -->
                <div class="flex flex-col items-center">
                  <div
                    class="relative w-12 h-12 rounded-full flex items-center justify-center border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#050505] z-10 timeline-dot group-hover:border-emerald-500/50 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/30 transition-all duration-500 shadow-sm"
                  >
                    <!-- Pulse effect on hover -->
                    <div class="absolute inset-0 rounded-full bg-emerald-500/20 scale-0 group-hover:scale-[1.5] opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"></div>
                    
                    <span class="font-mono font-bold text-[10px] text-stone-400 dark:text-stone-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors relative z-10">
                      {{ step.num }}
                    </span>
                  </div>
                </div>

                <!-- RIGHT column: empty on even steps, content on odd -->
                <div class="flex justify-start pl-12">
                  @if (i % 2 !== 0) {
                    <div class="relative max-w-md w-full p-6 rounded-2xl transition-all duration-500 hover:bg-stone-50 dark:hover:bg-white/[0.02]">
                      <!-- Content -->
                      <div class="mb-4">
                        <h3 class="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {{ step.title }}
                        </h3>
                      </div>
                      <p
                        class="text-stone-500 dark:text-stone-400 leading-relaxed text-sm font-light group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors"
                      >
                        {{ step.description }}
                      </p>
                    </div>
                  }
                </div>
              </div>

              <!-- ③ Mobile: left-border timeline style -->
              <div
                class="process-step md:hidden relative pl-16 pb-2 group"
                [style.transition-delay.ms]="i * 100"
              >
                <!-- Dot on left border -->
                <div
                  class="absolute left-2 top-0 w-8 h-8 rounded-full flex items-center justify-center z-10 border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#050505] transition-colors duration-500 group-hover:border-emerald-500/50 group-hover:bg-emerald-950/30"
                >
                  <span class="font-mono font-bold text-[10px] text-stone-400 dark:text-stone-500 group-hover:text-emerald-400 transition-colors">
                    {{ step.num }}
                  </span>
                </div>
                <!-- Content -->
                <div class="bg-stone-50/50 dark:bg-[#0a0a0a] border border-stone-200/50 dark:border-white/5 p-6 rounded-2xl transition-all duration-500 group-hover:border-emerald-500/30">
                  <div class="mb-3">
                    <h3 class="text-lg font-bold text-stone-900 dark:text-stone-50 tracking-tight group-hover:text-emerald-400 transition-colors">
                      {{ step.title }}
                    </h3>
                  </div>
                  <p class="text-stone-500 dark:text-stone-400 leading-relaxed text-sm font-light">
                    {{ step.description }}
                  </p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .process-reveal {
        opacity: 0;
        transform: translateY(20px);
        transition:
          opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .process-reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .process-step {
        opacity: 0;
        transform: translateY(24px);
        transition:
          opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .process-step.visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* Give space between desktop rows */
      .md\\:grid {
        margin-bottom: 2rem;
      }
      .md\\:grid:last-child {
        margin-bottom: 0;
      }
    `,
  ],
})
export class ProcessSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sectionEl') sectionRef!: ElementRef<HTMLElement>;
  @ViewChild('timelineLine') timelineRef!: ElementRef<HTMLElement>;

  private platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;
  private stepObserver: IntersectionObserver | null = null;

  steps: ProcessStep[] = [
    {
      num: '01',
      title: 'Inspiración y Necesidad',
      description:
        'Todo comienza con una chispa. Analizamos tu visión, el mercado y las necesidades reales del usuario. Entendemos lo que tu negocio necesita para prosperar.',
    },
    {
      num: '02',
      title: 'Arquitectura y Prototipado',
      description:
        'Definimos la base técnica antes de escribir una línea de código. Diseñamos modelos de datos relacionales, APIs robustas y wireframes de interfaces eficientes.',
    },
    {
      num: '03',
      title: 'Desarrollo Zen',
      description:
        'Código limpio, escalable y mantenible. Arquitectura sólida con Angular y Spring Boot, sin deuda técnica. Solo soluciones empresariales de alta disponibilidad.',
    },
    {
      num: '04',
      title: 'Despliegue y Escala',
      description:
        'El código en producción es solo el comienzo. Containerizamos con Docker, desplegamos en la nube y preparamos tu plataforma para crecer de forma sostenida.',
    },
  ];

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.setupObservers();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.stepObserver?.disconnect();
  }

  private setupObservers() {
    // Section observer — grows the timeline line
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;

          if (el.classList.contains('process-reveal')) {
            el.classList.add('visible');
          }
          if (el === this.sectionRef?.nativeElement) {
            setTimeout(() => {
              if (this.timelineRef?.nativeElement) {
                this.timelineRef.nativeElement.style.height = '100%';
              }
            }, 350);
            this.observer?.unobserve(el);
          }
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -40px 0px' },
    );

    if (this.sectionRef?.nativeElement) {
      this.observer.observe(this.sectionRef.nativeElement);
    }

    // Step observer — staggered reveal per step
    this.stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          this.stepObserver?.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' },
    );

    requestAnimationFrame(() => {
      document
        .querySelectorAll('#process .process-reveal, #process .process-step')
        .forEach((el) => {
          this.stepObserver?.observe(el);
          if (el.classList.contains('process-reveal')) {
            this.observer?.observe(el);
          }
        });
    });
  }
}
