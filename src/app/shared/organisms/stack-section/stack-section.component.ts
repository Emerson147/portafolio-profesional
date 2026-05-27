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
  years?: number;
  iconKey?: keyof typeof TECH_ICONS;
}

interface TechCategory {
  title: string;
  subtitle: string;
  icon: keyof typeof ICONS;
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
      class="py-24 md:py-32 px-6 bg-transparent relative overflow-hidden"
    >
      <!-- Top accent line (Section separator) -->
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl h-px bg-linear-to-r from-transparent via-stone-200 dark:via-stone-800 to-transparent"
      ></div>

      <!-- Global grid and lighting now handled by MainLayoutComponent -->

      <div class="max-w-6xl mx-auto relative z-10">
        <!-- Header -->
        <div class="mb-16 md:mb-24 stack-reveal">
          <span
            class="text-emerald-600 dark:text-emerald-500 font-mono font-bold text-[10px] tracking-widest uppercase mb-4 block"
          >
            // Stack Tecnológico
          </span>
          <h2 class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 flex items-center gap-4 tracking-tighter">
            Arquitectura de <span class="text-emerald-600 dark:text-emerald-500">Precisión</span>
            <span class="hidden md:block flex-1 h-px bg-stone-200 dark:bg-stone-800"></span>
          </h2>
          <p class="text-stone-600 dark:text-stone-400 max-w-2xl mt-4 leading-relaxed font-light">
            Sistemas robustos construidos sobre bases sólidas. Combinando la madurez empresarial de Java con la reactividad y escalabilidad de frameworks modernos.
          </p>
        </div>

        <!-- Grid 2x2 -->
        <div class="grid md:grid-cols-2 gap-6">
          @for (category of categories; track category.title; let i = $index) {
            <div
              class="stack-card group border border-stone-200/50 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xs rounded-2xl p-8 transition-all duration-500 hover:bg-white dark:hover:bg-white/[0.04] hover:border-emerald-500/30"
              [style.animation-delay.ms]="i * 80"
              (mousemove)="onCardTilt($event)"
              (mouseleave)="onCardReset($event)"
              style="will-change: transform;"
            >
              <!-- Category header -->
              <div class="flex items-center gap-4 mb-8 border-b border-stone-100 dark:border-stone-800/50 pb-6">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center bg-stone-100 dark:bg-[#0a0a0a] border border-stone-200 dark:border-stone-800 group-hover:border-emerald-500/50 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/30 transition-all duration-500"
                >
                  <span
                    class="w-5 h-5 text-stone-400 dark:text-stone-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                    [innerHTML]="getSafeIcon(category.icon)"
                  ></span>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-stone-900 dark:text-stone-50 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {{ category.title }}
                  </h3>
                  <span class="text-[10px] text-stone-400 dark:text-stone-500 font-mono tracking-widest uppercase">{{ category.subtitle }}</span>
                </div>
              </div>

              <!-- Tech items -->
              <div class="grid grid-cols-1 gap-3">
                @for (item of category.items; track item.name) {
                  <div class="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 dark:hover:bg-[#0a0a0a] transition-colors duration-300">
                    <div class="flex items-center gap-3">
                      @if (item.iconKey) {
                        <span
                          class="w-4 h-4 shrink-0 text-stone-400 dark:text-stone-500 group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors"
                          [innerHTML]="getSafeTechIcon(item.iconKey)"
                        ></span>
                      } @else {
                        <span
                          class="w-1.5 h-1.5 rounded-full shrink-0 bg-stone-300 dark:bg-stone-700"
                        ></span>
                      }
                      <span
                        class="text-sm font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors"
                      >
                        {{ item.name }}
                      </span>
                    </div>
                    @if (item.years) {
                      <span class="text-[10px] text-stone-400 dark:text-stone-600 font-mono uppercase tracking-wider">
                        {{ item.years }} AÑOS
                      </span>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Featured Tags -->
        <div
          class="flex flex-wrap justify-center items-center gap-3 mt-20 pt-10 border-t border-stone-200 dark:border-stone-800/50 stack-reveal"
        >
          <span class="text-stone-400 dark:text-stone-500 text-[10px] font-mono tracking-widest uppercase mr-4">Stack Principal</span>
          @for (tech of featuredTechs; track tech; let i = $index) {
            <span
              class="inline-flex items-center gap-2 px-4 py-2 bg-stone-50 dark:bg-[#0a0a0a] border border-stone-200 dark:border-stone-800 rounded-full text-stone-600 dark:text-stone-300 text-xs font-mono tracking-wide hover:border-emerald-500/50 hover:bg-white dark:hover:bg-[#0f0f0f] hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 cursor-default"
            >
              @if (getFeaturedIcon(tech)) {
                <span
                  class="w-3.5 h-3.5"
                  [innerHTML]="getSafeTechIcon(getFeaturedIcon(tech)!)"
                ></span>
              }
              {{ tech }}
            </span>
          }
        </div>

        <!-- Stats Row -->
        <div class="grid grid-cols-3 gap-8 mt-12 pt-10 border-t border-stone-200 dark:border-stone-800/50">
          @for (stat of animatedStats(); track stat.label) {
            <div class="text-center stack-reveal group cursor-default">
              <div
                class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors tracking-tighter"
              >
                @if (stat.isNumber) {
                  <span class="tabular-nums">{{ stat.currentValue }}</span
                  >{{ stat.suffix }}
                } @else {
                  {{ stat.value }}
                }
              </div>
              <div
                class="text-[10px] text-stone-400 dark:text-stone-500 font-mono uppercase tracking-widest mt-2 group-hover:text-stone-600 dark:group-hover:text-stone-400 transition-colors"
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

      .stack-reveal {
        opacity: 0;
        transform: translateY(20px);
        transition:
          opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .stack-reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .stack-card {
        opacity: 0;
        transform: translateY(24px);
        transition:
          opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
          border-color 0.4s ease,
          background-color 0.4s ease,
          box-shadow 0.4s ease;
      }
      .stack-card.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .stack-card:hover {
        box-shadow: 0 12px 40px rgba(16, 185, 129, 0.05);
      }
    `,
  ],
})
export class StackSectionComponent implements OnDestroy, AfterViewInit {
  @ViewChild('sectionEl') sectionRef!: ElementRef<HTMLElement>;

  private platformId = inject(PLATFORM_ID);
  private sanitizer = inject(DomSanitizer);

  private observer: IntersectionObserver | null = null;

  // ─── Categories (Cleaned up, no custom accent colors) ─────────────────
  categories: TechCategory[] = [
    {
      title: 'Backend Core',
      subtitle: '// server-side',
      icon: 'database',
      items: [
        { name: 'Java 17/21', years: 2, iconKey: 'Java' },
        { name: 'Spring Boot 3', years: 2, iconKey: 'Spring Boot' },
        { name: 'PostgreSQL', years: 2, iconKey: 'PostgreSQL' },
        { name: 'JWT Security', years: 2, iconKey: 'Docker' },
      ],
    },
    {
      title: 'Frontend',
      subtitle: '// client-side',
      icon: 'layers',
      items: [
        { name: 'Angular 17+', years: 2, iconKey: 'Angular' },
        { name: 'Tailwind CSS', years: 2, iconKey: 'Tailwind' },
        { name: 'PrimeNG', years: 2, iconKey: 'PrimeNG' },
        { name: 'Astro', years: 1, iconKey: 'Astro' },
      ],
    },
    {
      title: 'Infraestructura',
      subtitle: '// devops & tools',
      icon: 'cloud',
      items: [
        { name: 'Git/GitHub', years: 2, iconKey: 'Git' },
        { name: 'Linux', years: 2, iconKey: 'Linux' },
        { name: 'Postman', years: 2, iconKey: 'AWS' }, // Fallback to AWS icon as a placeholder
        { name: 'Docker', years: 1, iconKey: 'Docker' },
      ],
    },
    {
      title: 'Metodologías',
      subtitle: '// workflow',
      icon: 'gitBranch',
      items: [
        { name: 'Scrum / Agile', years: 2, iconKey: 'Scrum' },
        { name: 'Arquitectura Limpia', years: 2, iconKey: 'Clean Arch' },
        { name: 'Diseño REST', years: 2, iconKey: 'REST APIs' },
        { name: 'Git Flow', years: 2, iconKey: 'Git Flow' },
      ],
    },
  ];

  featuredTechs = ['Spring Boot', 'Angular', 'Docker', 'PostgreSQL'];

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

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target as HTMLElement;

          if (el.classList.contains('stack-reveal') || el.classList.contains('stack-card')) {
            el.classList.add('visible');
            this.observer?.unobserve(el);
          }

          if (el === this.sectionRef?.nativeElement) {
            setTimeout(() => this.animateCounters(), 300);
            this.observer?.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    );

    if (this.sectionRef?.nativeElement) {
      this.observer.observe(this.sectionRef.nativeElement);
    }

    requestAnimationFrame(() => {
      document.querySelectorAll('.stack-reveal, .stack-card').forEach((el) => {
        this.observer?.observe(el);
      });
    });
  }

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

  getSafeIcon(iconName: keyof typeof ICONS): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[iconName] || '');
  }

  getSafeTechIcon(iconName: keyof typeof TECH_ICONS): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(TECH_ICONS[iconName] || '');
  }

  onCardTilt(event: MouseEvent) {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5; // -0.5 → 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const tiltX = y * -4; // Subtle tilt up
    const tiltY = x * 4;
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(2px)`;
    card.style.transition = 'transform 0.1s ease-out';
  }

  onCardReset(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    card.style.transition = 'transform 0.5s ease-out';
  }
}
