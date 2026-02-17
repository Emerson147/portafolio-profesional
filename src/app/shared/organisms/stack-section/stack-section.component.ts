import { Component, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GsapService } from '../../../core/services/gsap.service';
import { ICONS } from '../../../core/data/icons.data';

interface TechItem {
  name: string;
  level: 'Avanzado' | 'Intermedio' | 'Aprendiendo';
  years?: number;
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
        <div class="mb-14 gs-reveal">
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

        <!-- Grid 2x2 Layout -->
        <div class="grid md:grid-cols-2 gap-5">
          @for (category of categories; track category.title; let i = $index) {
            <div
              class="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 gs-reveal"
              [style.animation-delay.ms]="i * 100"
            >
              <!-- Header with Icon -->
              <div class="flex items-center gap-3 mb-5">
                <!-- Category Icon -->
                <div
                  class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors"
                >
                  <span
                    class="w-5 h-5 text-emerald-400"
                    [innerHTML]="getSafeIcon(category.icon)"
                  ></span>
                </div>
                <div>
                  <h3
                    class="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors"
                  >
                    {{ category.title }}
                  </h3>
                  <span class="text-xs text-slate-500 font-mono">{{ category.subtitle }}</span>
                </div>
              </div>

              <!-- Tech Items with Level Bars -->
              <div class="space-y-3">
                @for (item of category.items; track item.name) {
                  <div class="group/item relative">
                    <div class="flex items-center justify-between mb-1.5">
                      <div class="flex items-center gap-2">
                        <span
                          class="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover/item:animate-pulse"
                        ></span>
                        <span
                          class="text-sm text-slate-300 group-hover/item:text-white transition-colors"
                          >{{ item.name }}</span
                        >
                      </div>
                      <!-- Level tooltip on hover with years -->
                      <span
                        class="text-xs px-2 py-0.5 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                        [class]="getLevelClass(item.level)"
                      >
                        {{ item.level
                        }}{{
                          item.years
                            ? ' • ' + item.years + (item.years === 1 ? ' año' : ' años')
                            : ''
                        }}
                      </span>
                    </div>
                    <!-- Progress bar -->
                    <div class="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-emerald-500/50 rounded-full transition-all duration-700 group-hover/item:bg-emerald-500"
                        [style.width]="getLevelWidth(item.level)"
                      ></div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Featured Tags - Animated -->
        <div
          class="flex flex-wrap justify-center gap-3 mt-12 pt-8 border-t border-white/10 gs-reveal"
        >
          <span class="text-slate-500 text-sm mr-4">Destacados:</span>
          @for (tech of featuredTechs; track tech; let i = $index) {
            <span
              class="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:scale-105 transition-all duration-300 cursor-default"
              [style.animation-delay.ms]="i * 50"
            >
              {{ tech }}
            </span>
          }
        </div>

        <!-- Stats Row -->
        <div class="grid grid-cols-3 gap-8 mt-12 pt-10 border-t border-white/10">
          @for (stat of animatedStats(); track stat.label) {
            <div class="text-center gs-reveal group cursor-default">
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

      .gs-reveal {
        opacity: 0;
        transform: translateY(20px);
        animation: revealUp 0.6s ease forwards;
      }

      @keyframes revealUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class StackSectionComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private gsap = inject(GsapService);
  private sanitizer = inject(DomSanitizer);

  categories: TechCategory[] = [
    {
      title: 'Backend Core',
      subtitle: '// server-side',
      icon: 'database',
      items: [
        { name: 'Java 17/21', level: 'Avanzado', years: 4 },
        { name: 'Spring Boot 3', level: 'Avanzado', years: 3 },
        { name: 'PostgreSQL', level: 'Avanzado', years: 3 },
        { name: 'Docker', level: 'Intermedio', years: 2 },
      ],
    },
    {
      title: 'Frontend',
      subtitle: '// client-side',
      icon: 'layers',
      items: [
        { name: 'Angular 17+', level: 'Avanzado', years: 3 },
        { name: 'Tailwind CSS', level: 'Avanzado', years: 2 },
        { name: 'PrimeNG', level: 'Intermedio', years: 2 },
        { name: 'Astro', level: 'Aprendiendo', years: 1 },
      ],
    },
    {
      title: 'Cloud & DevOps',
      subtitle: '// infrastructure',
      icon: 'cloud',
      items: [
        { name: 'AWS', level: 'Intermedio', years: 2 },
        { name: 'CI/CD', level: 'Intermedio', years: 2 },
        { name: 'Git/GitHub', level: 'Avanzado', years: 4 },
        { name: 'Linux', level: 'Intermedio', years: 3 },
      ],
    },
    {
      title: 'Metodologías',
      subtitle: '// workflow',
      icon: 'gitBranch',
      items: [
        { name: 'Scrum', level: 'Avanzado', years: 3 },
        { name: 'Clean Arch', level: 'Intermedio', years: 2 },
        { name: 'REST APIs', level: 'Avanzado', years: 4 },
        { name: 'Git Flow', level: 'Avanzado', years: 4 },
      ],
    },
  ];

  featuredTechs = ['Spring Boot', 'Angular', 'Docker', 'PostgreSQL', 'AWS'];

  animatedStats = signal([
    { value: '4+', label: 'Años Dev', isNumber: true, currentValue: 0, target: 4, suffix: '+' },
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

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.animateCounters(), 2000);
    }
  }

  private animateCounters() {
    const stats = this.animatedStats();
    const duration = 1500;
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

  getSafeIcon(iconName: keyof typeof ICONS): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[iconName] || '');
  }

  getLevelWidth(level: string): string {
    switch (level) {
      case 'Avanzado':
        return '90%';
      case 'Intermedio':
        return '65%';
      case 'Aprendiendo':
        return '35%';
      default:
        return '50%';
    }
  }

  getLevelClass(level: string): string {
    switch (level) {
      case 'Avanzado':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'Intermedio':
        return 'bg-teal-500/20 text-teal-400';
      case 'Aprendiendo':
        return 'bg-amber-500/20 text-amber-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  }
}
