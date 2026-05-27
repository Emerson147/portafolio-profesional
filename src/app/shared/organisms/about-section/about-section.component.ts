import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
  AfterViewInit,
  PLATFORM_ID,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GsapService } from '../../../core/services/gsap.service';
import { TranslateService } from '../../../core/services/translate.service';
import { TECH_ICONS } from '../../../core/data/icons.data';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <section
      id="about"
      #sectionEl
      class="py-24 md:py-32 px-6 bg-transparent relative overflow-hidden"
    >
      <!-- Global grid and lighting now handled by MainLayoutComponent -->

      <div class="max-w-6xl mx-auto relative z-10">
        <!-- Section Header -->
        <div class="mb-14 about-reveal">
          <span
            class="text-emerald-600 dark:text-emerald-500 font-mono font-bold text-[10px] tracking-widest uppercase mb-4 block"
          >
            // {{ i18n.t().about.label }}
          </span>
          <h2
            class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 tracking-tighter flex items-center gap-4"
          >
            {{ i18n.t().about.title }}
            <span class="hidden md:block flex-1 h-px bg-stone-200 dark:bg-stone-800"></span>
          </h2>
        </div>

        <div class="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          <!-- Photo (2 cols) - Minimalist Zen Frame -->
          <div class="lg:col-span-2 about-reveal">
            <div class="relative group max-w-xs mx-auto lg:mx-0">
              <div class="relative aspect-square">
                <!-- Precision borders (No rotations, pure architecture) -->
                <div
                  class="absolute -inset-2 border border-stone-200 dark:border-white/10 rounded-2xl group-hover:border-emerald-500/30 transition-colors duration-700 pointer-events-none"
                ></div>

                <!-- Photo -->
                <div
                  class="relative bg-stone-100 dark:bg-stone-900 rounded-xl overflow-hidden aspect-square border border-stone-200/50 dark:border-white/5 transition-all duration-700"
                >
                  <img
                    src="images/profile.jpeg"
                    alt="Emerson Quijada Rafael"
                    class="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-1000 ease-out filter grayscale-[20%] group-hover:grayscale-0"
                  />
                  <!-- Subtle Inner Shadow/Gradient -->
                  <div
                    class="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-80"
                  ></div>
                </div>

                <!-- Status Badge -->
                <div
                  class="absolute -bottom-3 right-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 px-4 py-1.5 rounded-full shadow-sm flex items-center gap-2 group-hover:border-emerald-500/50 transition-colors duration-500"
                >
                  <span class="relative flex h-2 w-2">
                    <span
                      class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                    ></span>
                    <span
                      class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
                    ></span>
                  </span>
                  <span class="text-[10px] tracking-widest font-mono uppercase">Disponible</span>
                </div>
              </div>

              <!-- Location -->
              <div class="flex items-center gap-2 mt-8 text-stone-400 font-mono text-[10px] tracking-wider uppercase">
                <svg class="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <span>Huancayo, Perú</span>
              </div>
            </div>
          </div>

          <!-- Content (3 cols) -->
          <div class="lg:col-span-3 space-y-6">
            <!-- Name & Title -->
            <div class="about-reveal">
              <h3 class="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-50 mb-2 tracking-tight">
                {{ i18n.t().about.name }}
              </h3>
              <p class="text-emerald-600 dark:text-emerald-500 font-mono text-xs tracking-widest uppercase">
                {{ i18n.t().about.subtitle }}
              </p>
            </div>

            <!-- Bio -->
            <div class="text-stone-600 dark:text-stone-400 leading-relaxed space-y-4 about-reveal font-light">
              <p>
                <strong class="text-stone-900 dark:text-stone-200 font-medium"
                  >{{ i18n.t().about.bio1 }}</strong
                >          
                <span class="text-emerald-700 dark:text-emerald-400 font-medium"
                  >{{ i18n.t().about.bio1_backend }}</span
                >
                {{ i18n.t().about.bio1_and }}
                <span class="text-stone-800 dark:text-stone-300 font-medium"
                  >{{ i18n.t().about.bio1_frontend }}</span
                >.
              </p>
              <p>
                {{ i18n.t().about.bio2 }}
                <strong class="text-stone-900 dark:text-stone-200 font-medium"
                  >{{ i18n.t().about.bio2_bold }}</strong
                >
                  {{ i18n.t().about.bio2_mid }}
                <span
                  class="font-mono text-[10px] uppercase tracking-wider border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 dark:text-stone-300 px-2 py-0.5 rounded"
                  >{{ i18n.t().about.bio2_devops }}</span
                >  {{ i18n.t().about.bio2_end }}
              </p>
              <p
                class="text-stone-500 dark:text-stone-500 text-sm border-l border-emerald-500/50 pl-4 italic"
              >
                {{ i18n.t().about.quote }}
              </p>
            </div>

            <!-- Tech Cards with icons (Monochrome Zen Style) -->
            <div class="grid grid-cols-2 gap-4 pt-4 about-reveal">
              <!-- Backend -->
              <div
                class="group/card bg-stone-50 dark:bg-[#0a0a0a] p-5 rounded-xl border border-stone-200/60 dark:border-white/5 hover:border-emerald-500/30 transition-colors duration-500 cursor-default"
              >
                <div
                  class="text-stone-900 dark:text-stone-100 font-mono text-xs tracking-widest uppercase mb-4 flex items-center gap-2"
                >
                  <span
                    class="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover/card:animate-pulse"
                  ></span>
                  Backend
                </div>
                <div
                  class="text-stone-500 dark:text-stone-400 text-xs space-y-2.5 font-light"
                >
                  @for (item of backendItemsSafe(); track item.label) {
                    <div class="flex items-center gap-2 group-hover/card:text-stone-800 dark:group-hover/card:text-stone-300 transition-colors">
                      <span
                        class="w-3.5 h-3.5 shrink-0 opacity-70"
                        [innerHTML]="item.safeIcon"
                      ></span>
                      <span>{{ item.label }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Frontend -->
              <div
                class="group/card bg-stone-50 dark:bg-[#0a0a0a] p-5 rounded-xl border border-stone-200/60 dark:border-white/5 hover:border-emerald-500/30 transition-colors duration-500 cursor-default"
              >
                <div
                  class="text-stone-900 dark:text-stone-100 font-mono text-xs tracking-widest uppercase mb-4 flex items-center gap-2"
                >
                  <span
                    class="w-1.5 h-1.5 bg-stone-400 dark:bg-stone-600 rounded-full group-hover/card:bg-emerald-500 transition-colors"
                  ></span>
                  Frontend
                </div>
                <div
                  class="text-stone-500 dark:text-stone-400 text-xs space-y-2.5 font-light"
                >
                  @for (item of frontendItemsSafe(); track item.label) {
                    <div class="flex items-center gap-2 group-hover/card:text-stone-800 dark:group-hover/card:text-stone-300 transition-colors">
                      <span
                        class="w-3.5 h-3.5 shrink-0 opacity-70"
                        [innerHTML]="item.safeIcon"
                      ></span>
                      <span>{{ item.label }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- CTAs -->
            <div class="flex flex-wrap gap-3 pt-6 about-reveal">
              <app-button
                variant="primary"
                href="#contact"
                (click)="scrollToContact($event)"
              >
                {{ i18n.t().about.cta_contact }}
              </app-button>
              <app-button
                variant="secondary"
                href="https://minimalist-portfolio-eta.vercel.app/"
                target="_blank"
              >
                {{ i18n.t().about.cta_cv_online }}
              </app-button>
              <app-button
                variant="secondary"
                href="cv/CV_Emerson_Quijada_Rafael.pdf"
                download="CV_Emerson_Quijada_Rafael.pdf"
              >
                {{ i18n.t().about.cta_cv_download }}
              </app-button>
            </div>
          </div>
        </div>

        <!-- Stats — animated on intersection -->
        <div
          class="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-stone-200 dark:border-white/5"
        >
          @for (stat of animatedStats(); track stat.label) {
            <div class="text-center about-reveal group cursor-default">
              <div
                class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors tracking-tighter"
              >
                @if (stat.isNumber) {
                  <span class="tabular-nums">{{ stat.currentValue }}</span
                  >{{ stat.suffix }}
                } @else {
                  {{ stat.value }}
                }
              </div>
              <div
                class="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest mt-2 font-mono group-hover:text-stone-600 dark:group-hover:text-stone-400 transition-colors"
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

      .about-reveal {
        opacity: 0;
        transform: translateY(20px);
        transition:
          opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .about-reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `,
  ],
})
export class AboutSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sectionEl') sectionRef!: ElementRef<HTMLElement>;

  private gsap = inject(GsapService);
  private platformId = inject(PLATFORM_ID);
  private sanitizer = inject(DomSanitizer);
  i18n = inject(TranslateService);

  private observer: IntersectionObserver | null = null;

  // Tech card items with minimal SVGs from icons.data.ts
  backendItems = [
    { label: 'Java · Spring Boot', icon: 'Java' as keyof typeof TECH_ICONS },
    { label: 'PostgreSQL · SQL Server', icon: 'PostgreSQL' as keyof typeof TECH_ICONS },
    { label: 'Docker · AWS', icon: 'Docker' as keyof typeof TECH_ICONS },
  ];

  frontendItems = [
    { label: 'Angular · TypeScript', icon: 'Angular' as keyof typeof TECH_ICONS },
    { label: 'Tailwind CSS', icon: 'Tailwind' as keyof typeof TECH_ICONS },
    { label: 'HTML5 · JS', icon: 'Terminal' as keyof typeof TECH_ICONS }, // Using Terminal icon as a clean fallback if HTML/JS don't exist
  ];

  backendItemsSafe = computed(() => {
    return this.backendItems.map((item) => ({
      label: item.label,
      safeIcon: this.sanitizer.bypassSecurityTrustHtml(TECH_ICONS[item.icon] || TECH_ICONS['Java']),
    }));
  });

  frontendItemsSafe = computed(() => {
    return this.frontendItems.map((item) => ({
      label: item.label,
      safeIcon: this.sanitizer.bypassSecurityTrustHtml(TECH_ICONS[item.icon] || TECH_ICONS['Angular']),
    }));
  });

  animatedStats = signal([
    { value: '2+', label: 'Años Dev', isNumber: true, currentValue: 0, target: 2, suffix: '+' },
    { value: '4+', label: 'Proyectos', isNumber: true, currentValue: 0, target: 4, suffix: '+' },
    {
      value: 'Full Stack',
      label: 'Enfoque',
      isNumber: false,
      currentValue: 0,
      target: 0,
      suffix: '',
    },
  ]);

  ngOnInit() {}

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

          if (el.classList.contains('about-reveal')) {
            el.classList.add('visible');
            this.observer?.unobserve(el);
          }

          if (el === this.sectionRef?.nativeElement) {
            setTimeout(() => this.animateCounters(), 400);
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
      document.querySelectorAll('#about .about-reveal').forEach((el) => {
        this.observer?.observe(el);
      });
    });
  }

  private animateCounters() {
    if (!isPlatformBrowser(this.platformId) || !this.gsap.gsap) return;

    const stats = this.animatedStats();
    stats.forEach((stat, index) => {
      if (!stat.isNumber) return;

      const obj = { val: 0 };
      this.gsap.gsap.to(obj, {
        val: stat.target,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: () => {
          this.animatedStats.update((s) => {
            const u = [...s];
            u[index] = { ...u[index], currentValue: Math.floor(obj.val) };
            return u;
          });
        },
      });
    });
  }

  scrollToContact(event: Event) {
    event.preventDefault();
    this.gsap.scrollTo('#contact', 80);
  }
}
