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
  accent: string; // hex for hover
  bgAccent: string; // icon bg
}

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      id="services"
      #sectionEl
      class="py-24 relative bg-stone-50 dark:bg-stone-900 transition-colors duration-500 overflow-hidden"
    >
      <!-- Ambient glow -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/4 rounded-full blur-3xl -z-10 pointer-events-none"
      ></div>

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <!-- Header -->
        <div class="mb-14 service-reveal">
          <span
            class="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs tracking-widest uppercase mb-3 block"
          >
            // Servicios
          </span>
          <h2
            class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 flex items-center gap-4 tracking-tight"
          >
            Soluciones <span class="text-emerald-600 dark:text-emerald-400">Tecnológicas</span>
            <span class="hidden md:block flex-1 h-px bg-stone-200 dark:bg-stone-700"></span>
          </h2>
          <p class="text-stone-600 dark:text-stone-400 max-w-2xl mt-4 leading-relaxed">
            Arquitectura de software a medida. Desde el backend hasta el despliegue, construyo
            soluciones robustas y escalables.
          </p>
        </div>

        <!-- Services Grid (3×2) -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (service of services; track service.title; let i = $index) {
            <div
              class="service-card group p-7 bg-white dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/50 rounded-2xl hover:border-opacity-60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default"
              [style.transition-delay.ms]="i * 70"
              [style.--card-accent]="service.accent"
            >
              <!-- Icon -->
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                [style.background]="service.bgAccent"
              >
                <span
                  class="material-symbols-outlined text-xl leading-none select-none"
                  [style.color]="service.accent"
                  style="font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;"
                  >{{ service.icon }}</span
                >
              </div>

              <!-- Title -->
              <h3
                class="text-lg font-bold text-stone-900 dark:text-stone-50 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200"
              >
                {{ service.title }}
              </h3>

              <!-- Description -->
              <p class="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-5">
                {{ service.description }}
              </p>

              <!-- Feature pills -->
              <div class="flex flex-wrap gap-1.5">
                @for (feature of service.features; track feature) {
                  <span
                    class="px-2 py-0.5 text-[11px] font-mono rounded-full bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-200"
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
        transform: translateY(18px);
        transition:
          opacity 0.6s ease,
          transform 0.6s ease;
      }
      .service-reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .service-card {
        opacity: 0;
        transform: translateY(16px);
        transition:
          opacity 0.5s ease,
          transform 0.5s ease,
          border-color 0.3s ease,
          box-shadow 0.3s ease,
          translate 0.3s ease;
      }
      .service-card.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .service-card:hover {
        border-color: color-mix(in srgb, var(--card-accent) 30%, transparent);
        box-shadow: 0 12px 40px color-mix(in srgb, var(--card-accent) 8%, transparent);
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
      accent: '#f97316',
      bgAccent: 'rgba(249,115,22,0.08)',
      features: ['Spring Boot 3', 'REST / JSON', 'JWT Auth', 'OpenAPI'],
    },
    {
      title: 'Frontend Angular',
      description:
        'Aplicaciones SPA modernas con Angular 17+. Componentes standalone, signals, lazy loading y animaciones GSAP.',
      icon: 'web',
      accent: '#dd0031',
      bgAccent: 'rgba(221,0,49,0.08)',
      features: ['Angular 17+', 'Tailwind CSS', 'GSAP', 'PrimeNG'],
    },
    {
      title: 'Arquitectura Full Stack',
      description:
        'Diseño e implementación de sistemas end-to-end usando Clean Architecture, separación de capas y patrones SOLID.',
      icon: 'hub',
      accent: '#10b981',
      bgAccent: 'rgba(16,185,129,0.08)',
      features: ['Clean Arch', 'Microservicios', 'SOLID', 'DDD'],
    },
    {
      title: 'Base de Datos',
      description:
        'Diseño de esquemas, optimización de queries y migraciones con PostgreSQL y SQL Server. Estrategias de indexación y rendimiento.',
      icon: 'database',
      accent: '#38bdf8',
      bgAccent: 'rgba(56,189,248,0.08)',
      features: ['PostgreSQL', 'SQL Server', 'JPA / Hibernate', 'Migrations'],
    },
    {
      title: 'DevOps & Despliegue',
      description:
        'Contenedores Docker, pipelines CI/CD y despliegue en AWS. Automatización desde el commit hasta producción.',
      icon: 'rocket_launch',
      accent: '#a78bfa',
      bgAccent: 'rgba(167,139,250,0.08)',
      features: ['Docker', 'GitHub Actions', 'AWS EC2/S3', 'CI/CD'],
    },
    {
      title: 'Consultoría Técnica',
      description:
        'Revisión de arquitectura, refactor de código legado y mejoras de rendimiento. Análisis técnico orientado a resultados.',
      icon: 'engineering',
      accent: '#14b8a6',
      bgAccent: 'rgba(20,184,166,0.08)',
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
