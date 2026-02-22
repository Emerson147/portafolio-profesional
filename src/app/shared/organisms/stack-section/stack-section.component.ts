import {
  Component,
  inject,
  signal,
  OnDestroy,
  PLATFORM_ID,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS, TECH_ICONS } from '../../../core/data/icons.data';

interface TechItem {
  name: string;
  level: 'Avanzado' | 'Intermedio' | 'Aprendiendo';
  years?: number;
  iconKey?: keyof typeof TECH_ICONS;
}

interface TechCategory {
  title: string;
  subtitle: string;
  icon: keyof typeof ICONS;
  accentColor: string; // unique color per category
  items: TechItem[];
}

@Component({
  selector: 'app-stack-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      id="stack"
      #sectionEl
      class="py-24 md:py-32 px-6 bg-slate-900 text-white relative overflow-hidden"
    >
      <!-- Top accent line -->
      <div
        class="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-emerald-500 to-transparent opacity-50"
      ></div>

      <!-- Subtle background pattern -->
      <div
        class="absolute inset-0 opacity-[0.02] pointer-events-none"
        style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 40px 40px;"
      ></div>

      <div class="max-w-6xl mx-auto relative z-10">
        <!-- Header -->
        <div class="mb-14 stack-reveal">
          <span
            class="text-emerald-400 font-mono font-bold text-xs tracking-widest uppercase mb-3 block"
          >
            // Stack Tecnológico
          </span>
          <h2 class="text-3xl md:text-4xl font-bold flex items-center gap-4">
            Herramientas de precisión
            <span class="hidden md:block flex-1 h-px bg-white/10"></span>
          </h2>
          <p class="text-slate-400 max-w-2xl mt-4 leading-relaxed">
            Mi flujo de trabajo combina la solidez empresarial de
            <span class="text-emerald-400 font-medium">Java</span> con la agilidad moderna de
            <span class="text-emerald-400 font-medium">Angular</span>. Contenedores para que todo
            funcione en producción.
          </p>
        </div>

        <!-- Grid 2x2 -->
        <div class="grid md:grid-cols-2 gap-5">
          @for (category of categories; track category.title; let i = $index) {
            <div
              class="stack-card group border border-white/10 rounded-xl p-6 transition-all duration-300"
              [style.--accent]="category.accentColor"
              style="background: rgba(255,255,255,0.04); will-change: transform;"
              [style.animation-delay.ms]="i * 80"
              (mousemove)="onCardTilt($event)"
              (mouseleave)="onCardReset($event)"
            >
              <!-- Category header -->
              <div class="flex items-center gap-3 mb-5">
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300"
                  [style.background]="category.accentColor + '18'"
                >
                  <span
                    class="w-5 h-5"
                    [style.color]="category.accentColor"
                    [innerHTML]="getSafeIcon(category.icon)"
                  ></span>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white transition-colors duration-200">
                    {{ category.title }}
                  </h3>
                  <span class="text-xs text-slate-500 font-mono">{{ category.subtitle }}</span>
                </div>
              </div>

              <!-- Tech items -->
              <div class="space-y-4">
                @for (item of category.items; track item.name) {
                  <div class="tech-item">
                    <!-- Row: icon + name + dots -->
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <!-- ② Tech logo icon -->
                        @if (item.iconKey) {
                          <span
                            class="w-4 h-4 shrink-0"
                            [style.color]="category.accentColor"
                            [innerHTML]="getSafeTechIcon(item.iconKey)"
                          ></span>
                        } @else {
                          <span
                            class="w-1.5 h-1.5 rounded-full shrink-0"
                            [style.background]="category.accentColor"
                          ></span>
                        }
                        <span
                          class="text-sm text-slate-300 group-hover:text-white transition-colors"
                        >
                          {{ item.name }}
                        </span>
                        @if (item.years) {
                          <span class="text-xs text-slate-600 font-mono"> {{ item.years }}y </span>
                        }
                      </div>

                      <!-- ③ Level dot indicators (always visible) -->
                      <div class="flex items-center gap-1" [title]="item.level">
                        @for (dot of [1, 2, 3]; track dot) {
                          <span
                            class="w-1.5 h-1.5 rounded-full transition-all duration-300"
                            [style.background]="
                              dot <= getLevelDots(item.level)
                                ? category.accentColor
                                : 'rgba(255,255,255,0.12)'
                            "
                          ></span>
                        }
                      </div>
                    </div>

                    <!-- ① Progress bar (animated on intersection) -->
                    <div class="h-px bg-white/5 rounded-full overflow-hidden">
                      <div
                        class="progress-bar h-full rounded-full"
                        [style.background]="category.accentColor + '80'"
                        [style.--target-width]="getLevelWidth(item.level)"
                        style="width: 0%; transition: width 0.9s cubic-bezier(0.4,0,0.2,1);"
                      ></div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Featured Tags with micro icons -->
        <div
          class="flex flex-wrap justify-center gap-3 mt-12 pt-8 border-t border-white/10 stack-reveal"
        >
          <span class="text-slate-500 text-sm self-center">Destacados:</span>
          @for (tech of featuredTechs; track tech; let i = $index) {
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/8 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-mono hover:bg-emerald-500/15 hover:border-emerald-500/40 hover:scale-105 transition-all duration-200 cursor-default"
            >
              @if (getFeaturedIcon(tech)) {
                <span
                  class="w-3.5 h-3.5 opacity-75"
                  [innerHTML]="getSafeTechIcon(getFeaturedIcon(tech)!)"
                ></span>
              }
              {{ tech }}
            </span>
          }
        </div>

        <!-- Stats Row -->
        <div class="grid grid-cols-3 gap-8 mt-12 pt-10 border-t border-white/10">
          @for (stat of animatedStats(); track stat.label) {
            <div class="text-center stack-reveal group cursor-default">
              <div
                class="text-2xl md:text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors"
              >
                @if (stat.isNumber) {
                  <span class="tabular-nums">{{ stat.currentValue }}</span
                  >{{ stat.suffix }}
                } @else {
                  {{ stat.value }}
                }
              </div>
              <div
                class="text-xs text-slate-500 uppercase tracking-wider mt-1 group-hover:text-slate-400 transition-colors"
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

      /* ① Scroll-triggered reveal */
      .stack-reveal {
        opacity: 0;
        transform: translateY(20px);
        transition:
          opacity 0.6s ease,
          transform 0.6s ease;
      }
      .stack-reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .stack-card {
        opacity: 0;
        transform: translateY(16px);
        transition:
          opacity 0.5s ease,
          transform 0.5s ease,
          border-color 0.3s ease,
          box-shadow 0.3s ease;
      }
      .stack-card.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .stack-card:hover {
        border-color: color-mix(in srgb, var(--accent) 40%, transparent);
        box-shadow: 0 8px 32px color-mix(in srgb, var(--accent) 8%, transparent);
      }
    `,
  ],
})
export class StackSectionComponent implements OnDestroy, AfterViewInit {
  @ViewChild('sectionEl') sectionRef!: ElementRef<HTMLElement>;

  private platformId = inject(PLATFORM_ID);
  private sanitizer = inject(DomSanitizer);

  private observer: IntersectionObserver | null = null;

  // ─── Categories with per-category accent color & tech logos ─────────────────
  categories: TechCategory[] = [
    {
      title: 'Backend Core',
      subtitle: '// server-side',
      icon: 'database',
      accentColor: '#f97316', // Java orange
      items: [
        { name: 'Java 17/21', level: 'Avanzado', years: 2, iconKey: 'Java' },
        { name: 'Spring Boot 3', level: 'Avanzado', years: 2, iconKey: 'Spring Boot' },
        { name: 'PostgreSQL', level: 'Avanzado', years: 2, iconKey: 'PostgreSQL' },
        { name: 'Docker', level: 'Intermedio', years: 2, iconKey: 'Docker' },
      ],
    },
    {
      title: 'Frontend',
      subtitle: '// client-side',
      icon: 'layers',
      accentColor: '#dd0031', // Angular red
      items: [
        { name: 'Angular 17+', level: 'Avanzado', years: 2, iconKey: 'Angular' },
        { name: 'Tailwind CSS', level: 'Avanzado', years: 2, iconKey: 'Tailwind' },
        { name: 'PrimeNG', level: 'Intermedio', years: 2, iconKey: 'PrimeNG' },
        { name: 'Astro', level: 'Aprendiendo', years: 1, iconKey: 'Astro' },
      ],
    },
    {
      title: 'Cloud & DevOps',
      subtitle: '// infrastructure',
      icon: 'cloud',
      accentColor: '#38bdf8', // AWS/cloud blue
      items: [
        { name: 'AWS', level: 'Intermedio', years: 2, iconKey: 'AWS' },
        { name: 'CI/CD', level: 'Intermedio', years: 2, iconKey: 'Git' },
        { name: 'Git/GitHub', level: 'Avanzado', years: 2, iconKey: 'Git' },
        { name: 'Linux', level: 'Intermedio', years: 2, iconKey: 'Linux' },
      ],
    },
    {
      title: 'Metodologías',
      subtitle: '// workflow',
      icon: 'gitBranch',
      accentColor: '#a78bfa', // purple
      items: [
        { name: 'Scrum', level: 'Avanzado', years: 2, iconKey: 'Scrum' },
        { name: 'Clean Arch', level: 'Intermedio', years: 2, iconKey: 'Clean Arch' },
        { name: 'REST APIs', level: 'Avanzado', years: 2, iconKey: 'REST APIs' },
        { name: 'Git Flow', level: 'Avanzado', years: 2, iconKey: 'Git Flow' },
      ],
    },
  ];

  featuredTechs = ['Spring Boot', 'Angular', 'Docker', 'PostgreSQL', 'AWS'];

  // Map featured tag label → TECH_ICONS key
  private featuredIconMap: Partial<Record<string, keyof typeof TECH_ICONS>> = {
    'Spring Boot': 'Spring Boot',
    Angular: 'Angular',
    Docker: 'Docker',
    PostgreSQL: 'PostgreSQL',
  };

  getFeaturedIcon(tech: string): keyof typeof TECH_ICONS | null {
    return this.featuredIconMap[tech] ?? null;
  }

  animatedStats = signal([
    { value: '2+', label: 'Años Dev', isNumber: true, currentValue: 0, target: 2, suffix: '+' },
    {
      value: '15+',
      label: 'Tecnologías',
      isNumber: true,
      currentValue: 0,
      target: 15,
      suffix: '+',
    },
    {
      value: 'Full Stack',
      label: 'Enfoque',
      isNumber: false,
      currentValue: 0,
      target: 0,
      suffix: '',
    },
  ]);

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  // ① IntersectionObserver: triggers reveals & bar animations
  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target as HTMLElement;

          // Section-level reveals
          if (el.classList.contains('stack-reveal') || el.classList.contains('stack-card')) {
            el.classList.add('visible');
            this.observer?.unobserve(el);
          }

          // When the section itself enters view: animate all bars + counters
          if (el === this.sectionRef?.nativeElement) {
            setTimeout(() => this.animateBars(), 300);
            setTimeout(() => this.animateCounters(), 600);
            this.observer?.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    );

    // Observe section root (for bars + counters)
    if (this.sectionRef?.nativeElement) {
      this.observer.observe(this.sectionRef.nativeElement);
    }

    // Observe individual reveal elements
    requestAnimationFrame(() => {
      document.querySelectorAll('.stack-reveal, .stack-card').forEach((el) => {
        this.observer?.observe(el);
      });
    });
  }

  // ① Animate progress bars to their target width
  private animateBars() {
    const bars = document.querySelectorAll<HTMLElement>('.progress-bar');
    bars.forEach((bar, i) => {
      setTimeout(() => {
        const target = bar.style.getPropertyValue('--target-width') || '0%';
        bar.style.width = target;
      }, i * 60);
    });
  }

  // Counter animation
  private animateCounters() {
    const stats = this.animatedStats();
    const duration = 1400;
    const steps = 30;
    const interval = duration / steps;

    stats.forEach((stat, index) => {
      if (!stat.isNumber) return;
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
    });
  }

  // ③ Level → number of filled dots (max 3)
  getLevelDots(level: string): number {
    return level === 'Avanzado' ? 3 : level === 'Intermedio' ? 2 : 1;
  }

  getLevelWidth(level: string): string {
    return level === 'Avanzado' ? '90%' : level === 'Intermedio' ? '62%' : '35%';
  }

  getSafeIcon(iconName: keyof typeof ICONS): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[iconName] || '');
  }

  getSafeTechIcon(iconName: keyof typeof TECH_ICONS): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(TECH_ICONS[iconName] || '');
  }

  // ④ Subtle 3D tilt — max ±6° rotation, disabled on coarse pointer (mobile)
  onCardTilt(event: MouseEvent) {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5; // -0.5 → 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const tiltX = y * -6; // tilt up when cursor at top
    const tiltY = x * 6;
    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(4px)`;
    card.style.transition = 'transform 0.08s ease';
  }

  onCardReset(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    card.style.transition = 'transform 0.4s ease';
  }
}
