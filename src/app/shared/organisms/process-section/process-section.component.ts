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
  accent: string; // hex color for icon/badge/dot
  bgLight: string; // hover glow – light mode
  bgDark: string; // hover glow – dark mode
  icon: string; // inline SVG path
}

@Component({
  selector: 'app-process-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      id="process"
      #sectionEl
      class="py-24 relative overflow-hidden bg-white dark:bg-stone-950 transition-colors duration-500"
    >
      <!-- Subtle dot grid -->
      <div
        class="absolute inset-0 pointer-events-none"
        style="
          background-image: radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px);
          background-size: 36px 36px;
        "
      ></div>
      <!-- Dark-mode dot grid overlay -->
      <div
        class="absolute inset-0 pointer-events-none hidden dark:block"
        style="
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 36px 36px;
        "
      ></div>

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <!-- ── Header ─────────────────────────────────── -->
        <div class="mb-16 md:mb-24 process-reveal">
          <span
            class="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs tracking-widest uppercase mb-3 block"
          >
            // Metodología
          </span>
          <h2
            class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 flex items-center gap-4 tracking-tight"
          >
            Metodología <span class="text-emerald-600 dark:text-emerald-400">Zen</span>
            <span class="hidden md:block flex-1 h-px bg-stone-200 dark:bg-stone-700"></span>
          </h2>
          <p class="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mt-4 leading-relaxed">
            Un enfoque consciente donde la inspiración se encuentra con la excelencia técnica.
            Cuatro etapas para transformar lo abstracto en tangible.
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
              class="w-full bg-linear-to-b from-stone-200 via-emerald-400 to-stone-200 dark:from-stone-700 dark:via-emerald-500 dark:to-stone-700"
              style="height: 0%; transition: height 1.6s cubic-bezier(0.4,0,0.2,1);"
            ></div>
          </div>

          <!-- Mobile: left-border timeline -->
          <div
            class="md:hidden absolute left-4 top-0 bottom-0 w-px bg-stone-200 dark:bg-stone-800"
          ></div>

          <div class="space-y-12 md:space-y-0">
            @for (step of steps; track step.num; let i = $index) {
              <!-- ② Desktop zigzag — NO dynamic responsive classes -->
              <div
                class="process-step hidden md:grid md:grid-cols-[1fr_56px_1fr] md:gap-0 md:items-center"
                [style.transition-delay.ms]="i * 130"
              >
                <!-- LEFT column: content on even steps, empty on odd -->
                <div class="flex justify-end pr-10">
                  @if (i % 2 === 0) {
                    <div class="relative group max-w-md w-full text-right">
                      <!-- Hover glow -->
                      <div
                        class="absolute -inset-5 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:hidden"
                        [style.background]="step.bgLight"
                      ></div>
                      <div
                        class="absolute -inset-5 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block"
                        [style.background]="step.bgDark"
                      ></div>
                      <!-- Content -->
                      <div class="mb-4 flex items-center justify-end gap-3">
                        <h3 class="text-xl font-bold text-stone-900 dark:text-stone-50">
                          {{ step.title }}
                        </h3>
                        <span
                          class="w-4 h-4 shrink-0 opacity-70"
                          [style.color]="step.accent"
                          [innerHTML]="step.icon"
                        ></span>
                      </div>
                      <p
                        class="text-stone-600 dark:text-stone-400 leading-relaxed text-sm md:text-base pr-13"
                      >
                        {{ step.description }}
                      </p>
                    </div>
                  }
                </div>

                <!-- CENTER: connector dot on the timeline -->
                <div class="flex flex-col items-center">
                  <div
                    class="relative w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-stone-950 z-10 timeline-dot"
                    [style.background]="step.bgLight"
                    [style.border-color-inset]="step.accent"
                  >
                    <span class="font-mono font-bold text-xs" [style.color]="step.accent">{{
                      step.num
                    }}</span>
                  </div>
                </div>

                <!-- RIGHT column: empty on even steps, content on odd -->
                <div class="flex justify-start pl-10">
                  @if (i % 2 !== 0) {
                    <div class="relative group max-w-md w-full">
                      <!-- Hover glow -->
                      <div
                        class="absolute -inset-5 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:hidden"
                        [style.background]="step.bgLight"
                      ></div>
                      <div
                        class="absolute -inset-5 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block"
                        [style.background]="step.bgDark"
                      ></div>
                      <!-- Content -->
                      <div class="mb-4 flex items-center gap-3">
                        <span
                          class="w-4 h-4 shrink-0 opacity-70"
                          [style.color]="step.accent"
                          [innerHTML]="step.icon"
                        ></span>
                        <h3 class="text-xl font-bold text-stone-900 dark:text-stone-50">
                          {{ step.title }}
                        </h3>
                      </div>
                      <p
                        class="text-stone-600 dark:text-stone-400 leading-relaxed text-sm md:text-base pl-13"
                      >
                        {{ step.description }}
                      </p>
                    </div>
                  }
                </div>
              </div>

              <!-- ③ Mobile: left-border timeline style -->
              <div
                class="process-step md:hidden relative pl-12 pb-10"
                [style.transition-delay.ms]="i * 100"
              >
                <!-- Dot on left border -->
                <div
                  class="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center z-10 shadow-sm border-2 border-white dark:border-stone-950"
                  [style.background]="step.bgLight"
                >
                  <span class="font-mono font-bold text-[10px]" [style.color]="step.accent">{{
                    step.num
                  }}</span>
                </div>
                <!-- Icon badge -->
                <div class="flex items-center gap-3 mb-3">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center"
                    [style.background]="step.bgLight"
                  >
                    <span
                      class="w-4 h-4"
                      [style.color]="step.accent"
                      [innerHTML]="step.icon"
                    ></span>
                  </div>
                  <h3 class="text-lg font-bold text-stone-900 dark:text-stone-50">
                    {{ step.title }}
                  </h3>
                </div>
                <p class="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                  {{ step.description }}
                </p>
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
        transform: translateY(18px);
        transition:
          opacity 0.6s ease,
          transform 0.6s ease;
      }
      .process-reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .process-step {
        opacity: 0;
        transform: translateY(22px);
        transition:
          opacity 0.55s ease,
          transform 0.55s ease;
      }
      .process-step.visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* Give space between desktop rows */
      .md\\:grid {
        margin-bottom: 3.5rem;
      }
      .md\\:grid:last-child {
        margin-bottom: 0;
      }

      .timeline-dot {
        transition:
          transform 0.3s ease,
          box-shadow 0.3s ease;
      }
      .timeline-dot:hover {
        transform: scale(1.15);
        box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
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
      accent: '#10b981',
      bgLight: 'rgba(16,185,129,0.08)',
      bgDark: 'rgba(16,185,129,0.12)',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg>`,
    },
    {
      num: '02',
      title: 'Diseño y Prototipado',
      description:
        'Transformamos conceptos en bocetos tangibles. Diseñamos interfaces intuitivas (UI/UX) que se sienten naturales y eficientes, no solo bonitas.',
      accent: '#14b8a6',
      bgLight: 'rgba(20,184,166,0.08)',
      bgDark: 'rgba(20,184,166,0.12)',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/></svg>`,
    },
    {
      num: '03',
      title: 'Desarrollo Zen',
      description:
        'Código limpio, escalable y mantenible. Arquitectura sólida con Angular y Spring Boot, sin deuda técnica. Solo soluciones robustas listas para producción.',
      accent: '#06b6d4',
      bgLight: 'rgba(6,182,212,0.08)',
      bgDark: 'rgba(6,182,212,0.12)',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/></svg>`,
    },
    {
      num: '04',
      title: 'Lanzamiento y Escala',
      description:
        'El despliegue es solo el comienzo. Optimizamos para SEO, velocidad y conversión. Tu plataforma lista para crecer y evolucionar con CI/CD y monitoreo.',
      accent: '#818cf8',
      bgLight: 'rgba(129,140,248,0.08)',
      bgDark: 'rgba(129,140,248,0.12)',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/></svg>`,
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
