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

interface Service {
  title: string;
  description: string;
  icon: string; // Material Symbols Outlined ligature
  features: string[];
}

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      id="services"
      #sectionEl
      class="py-24 md:py-32 relative bg-transparent overflow-hidden"
    >
      <!-- Global grid and lighting now handled by MainLayoutComponent -->

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <!-- Header -->
        <div class="mb-16 md:mb-24 service-reveal">
          <span
            class="text-emerald-600 dark:text-emerald-500 font-mono font-bold text-[10px] tracking-widest uppercase mb-4 block"
          >
            // Servicios
          </span>
          <h2
            class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 flex items-center gap-4 tracking-tighter"
          >
            Soluciones <span class="text-emerald-600 dark:text-emerald-500">Tecnológicas</span>
            <span class="hidden md:block flex-1 h-px bg-stone-200 dark:bg-stone-800"></span>
          </h2>
          <p class="text-stone-600 dark:text-stone-400 max-w-2xl mt-4 leading-relaxed font-light">
            Arquitectura de software a medida. Desde el backend hasta el despliegue, construyo
            sistemas robustos y escalables para necesidades empresariales.
          </p>
        </div>

        <!-- Services Grid (3×2) -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (service of services; track service.title; let i = $index) {
            <div
              class="service-card group p-8 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xs border border-stone-200/50 dark:border-white/5 rounded-2xl hover:bg-white dark:hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-500 cursor-default"
              [style.transition-delay.ms]="i * 70"
            >
              <!-- Icon -->
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center mb-8 bg-stone-100 dark:bg-[#0a0a0a] border border-stone-200 dark:border-stone-800 group-hover:border-emerald-500/50 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/30 transition-all duration-500"
              >
                <span
                  class="material-symbols-outlined text-xl leading-none select-none text-stone-400 dark:text-stone-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500"
                  style="font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;"
                  >{{ service.icon }}</span
                >
              </div>

              <!-- Title -->
              <h3
                class="text-xl font-bold text-stone-900 dark:text-stone-50 mb-3 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300"
              >
                {{ service.title }}
              </h3>

              <!-- Description -->
              <p class="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-8 font-light group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors duration-300">
                {{ service.description }}
              </p>

              <!-- Feature pills -->
              <div class="flex flex-wrap gap-2 mt-auto">
                @for (feature of service.features; track feature) {
                  <span
                    class="px-3 py-1 text-[10px] uppercase font-mono tracking-wider rounded border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#0a0a0a] text-stone-500 dark:text-stone-400 group-hover:border-emerald-500/30 group-hover:bg-emerald-50/50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all duration-300"
                  >
                    {{ feature }}
                  </span>
                }
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

      /* Google Material Symbols font class */
      .material-symbols-outlined {
        font-family: 'Material Symbols Outlined';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        -webkit-font-smoothing: antialiased;
      }

      /* Scroll-triggered reveal */
      .service-reveal {
        opacity: 0;
        transform: translateY(20px);
        transition:
          opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .service-reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .service-card {
        opacity: 0;
        transform: translateY(24px);
        transition:
          opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
          border-color 0.4s ease,
          background-color 0.4s ease,
          box-shadow 0.4s ease;
      }
      .service-card.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .service-card:hover {
        box-shadow: 0 12px 40px rgba(16, 185, 129, 0.05);
      }
    `,
  ],
})
export class ServicesSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sectionEl') sectionRef!: ElementRef<HTMLElement>;

  private platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;
  private cardObserver: IntersectionObserver | null = null;

  services: Service[] = [
    {
      title: 'Backend APIs',
      description:
        'APIs RESTful robustas con Java y Spring Boot. Autenticación JWT, validaciones, manejo de errores y documentación OpenAPI.',
      icon: 'dns',
      features: ['Spring Boot 3', 'REST / JSON', 'JWT Auth', 'OpenAPI'],
    },
    {
      title: 'Frontend Angular',
      description:
        'Aplicaciones SPA modernas con Angular 17+. Componentes standalone, signals, lazy loading y animaciones GSAP.',
      icon: 'web',
      features: ['Angular 17+', 'Tailwind CSS', 'GSAP', 'PrimeNG'],
    },
    {
      title: 'Arquitectura Full Stack',
      description:
        'Diseño e implementación de sistemas end-to-end usando Clean Architecture, separación de capas y patrones SOLID.',
      icon: 'hub',
      features: ['Clean Arch', 'Microservicios', 'SOLID', 'DDD'],
    },
    {
      title: 'Base de Datos',
      description:
        'Diseño de esquemas, optimización de queries y migraciones con PostgreSQL y SQL Server. Estrategias de indexación y rendimiento.',
      icon: 'database',
      features: ['PostgreSQL', 'SQL Server', 'JPA / Hibernate', 'Migrations'],
    },
    {
      title: 'DevOps & Despliegue',
      description:
        'Contenedores Docker, pipelines CI/CD y despliegue en AWS. Automatización desde el commit hasta producción.',
      icon: 'rocket_launch',
      features: ['Docker', 'GitHub Actions', 'AWS EC2/S3', 'CI/CD'],
    },
    {
      title: 'Consultoría Técnica',
      description:
        'Revisión de arquitectura, refactor de código legado y mejoras de rendimiento. Análisis técnico orientado a resultados.',
      icon: 'engineering',
      features: ['Code Review', 'Refactoring', 'Performance', 'Tech Debt'],
    },
  ];

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.setupObservers();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.cardObserver?.disconnect();
  }

  private setupObservers() {
    // Header reveal
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          this.observer?.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );

    // Card stagger reveal
    this.cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          this.cardObserver?.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    requestAnimationFrame(() => {
      document.querySelectorAll('#services .service-reveal').forEach((el) => {
        this.observer?.observe(el);
      });
      document.querySelectorAll('#services .service-card').forEach((el) => {
        this.cardObserver?.observe(el);
      });
    });
  }
}
