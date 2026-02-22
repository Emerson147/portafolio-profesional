import {
  Component,
  inject,
  signal,
  computed,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  ICONS,
  PROJECT_VISUALS,
  ProjectVisualType,
  TECH_ICONS,
} from '../../../core/data/icons.data';
import { PROJECTS, Project } from '../../../core/data/projects.data';
import { ProjectDetailModalComponent } from '../project-detail-modal/project-detail-modal.component';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule, ProjectDetailModalComponent],
  template: `
    <section
      id="projects"
      class="py-24 md:py-32 px-6 bg-stone-100 dark:bg-stone-900 relative overflow-hidden transition-colors duration-500"
    >
      <!-- Dot grid light -->
      <div
        class="absolute inset-0 opacity-[0.04] dark:opacity-0 pointer-events-none"
        style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"
      ></div>
      <!-- Dot grid dark -->
      <div
        class="absolute inset-0 opacity-0 dark:opacity-[0.06] pointer-events-none"
        style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px;"
      ></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <!-- Header — consistent with other sections -->
        <div class="mb-14 project-reveal">
          <span
            class="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs tracking-widest uppercase mb-3 block"
          >
            // Portafolio
          </span>
          <h2
            class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 flex items-center gap-4 tracking-tight"
          >
            Proyectos <span class="text-emerald-600 dark:text-emerald-400">Destacados</span>
            <span class="hidden md:block flex-1 h-px bg-stone-300 dark:bg-stone-700"></span>
          </h2>
          <p class="text-stone-600 dark:text-stone-400 max-w-2xl mt-4 leading-relaxed">
            Sistemas reales construidos con Spring Boot, Angular y Docker. Del diseño de
            arquitectura al despliegue en producción.
          </p>
        </div>

        <!-- Filter Pills -->
        <div class="flex flex-wrap gap-2 mb-10 project-reveal">
          <button
            (click)="filterBy('all')"
            class="px-4 py-1.5 text-xs font-mono border rounded-full transition-all duration-200"
            [class]="
              activeFilter() === 'all'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30'
                : 'border-stone-300 dark:border-stone-600 text-stone-500 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-500'
            "
          >
            Todos ({{ getProjectCount('all') }})
          </button>
          @for (tech of uniqueTechs(); track tech) {
            <button
              (click)="filterBy(tech)"
              class="px-4 py-1.5 text-xs font-mono border rounded-full transition-all duration-200"
              [class]="
                activeFilter() === tech
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30'
                  : 'border-stone-300 dark:border-stone-600 text-stone-500 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-500'
              "
            >
              {{ tech }} ({{ getProjectCount(tech) }})
            </button>
          }
        </div>

        <!-- Project Cards Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (project of filteredProjects(); track project.title; let i = $index) {
            <div
              class="project-card group relative bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 overflow-hidden rounded-xl shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 dark:hover:shadow-emerald-900/30 hover:-translate-y-1 transition-all duration-500 ease-out"
              [class.lg:col-span-2]="i === 0"
              [style.transition-delay.ms]="i * 100"
              style="min-height: 420px;"
              (click)="project.slug && openModal(project)"
            >
              <!-- Blueprint background (light → dark on hover) -->
              <div
                class="absolute inset-0 bg-stone-50 dark:bg-stone-800/80 group-hover:bg-stone-900 dark:group-hover:bg-stone-950 transition-colors duration-500"
              >
                <!-- Grid lines -->
                <div
                  class="absolute inset-0 opacity-100 group-hover:opacity-10 transition-opacity duration-300"
                  style="background-image: linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px); background-size: 40px 100%;"
                ></div>
              </div>

              <!-- Status badge -->
              <div
                class="absolute top-4 left-4 text-xs font-mono border px-2 py-0.5 rounded z-10 transition-colors duration-300"
                [class]="getStatusClass(project.status)"
              >
                {{ project.status }}
              </div>

              <!-- REF tag -->
              <div
                class="absolute top-4 right-4 text-xs font-mono text-stone-400 dark:text-stone-500 group-hover:text-stone-500 border border-stone-200 dark:border-stone-600 group-hover:border-stone-700 px-2 py-0.5 z-10 transition-colors duration-300"
              >
                PRJ-0{{ i + 1 }}
              </div>

              <!-- Abstract SVG visual -->
              <div
                class="absolute inset-0 flex items-center justify-center p-16 z-10 pointer-events-none"
              >
                <div
                  class="w-full h-full text-stone-200 dark:text-stone-600 group-hover:text-emerald-500/30 transition-colors duration-500"
                  [innerHTML]="getProjectVisual(project.type)"
                ></div>
              </div>

              <!-- Real image overlay (on hover) -->
              @if (project.image) {
                <div
                  class="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                >
                  <img
                    [src]="project.image"
                    [alt]="project.title"
                    class="w-full h-full object-cover"
                  />
                  <div
                    class="absolute inset-0 bg-linear-to-t from-stone-900/90 via-stone-900/50 to-transparent"
                  ></div>
                </div>
              }

              <!-- Content overlay -->
              <div
                class="relative z-20 h-full flex flex-col justify-between p-7 text-stone-900 dark:text-stone-100 group-hover:text-white transition-colors duration-300"
              >
                <div>
                  <!-- Index + links row -->
                  <div class="flex justify-between items-start mt-8">
                    <span
                      class="font-mono text-xs border border-stone-300 dark:border-stone-600 text-stone-500 dark:text-stone-400 group-hover:border-emerald-500 group-hover:text-emerald-400 px-3 py-0.5 rounded-full transition-colors duration-200"
                    >
                      // 0{{ i + 1 }}
                    </span>
                    <div class="flex gap-2">
                      @if (project.github) {
                        <a
                          [href]="project.github"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-9 h-9 border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-full flex items-center justify-center hover:border-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-200"
                          [innerHTML]="getIcon('github')"
                          (click)="$event.stopPropagation()"
                        ></a>
                      }
                      @if (project.demo) {
                        <a
                          [href]="project.demo"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-9 h-9 border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-full flex items-center justify-center hover:border-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-200"
                          [innerHTML]="getIcon('externalLink')"
                          (click)="$event.stopPropagation()"
                        ></a>
                      }
                    </div>
                  </div>
                </div>

                <!-- Bottom: title + meta + tags + metrics -->
                <div class="mt-auto">
                  <h3
                    class="text-xl md:text-2xl font-bold mb-1 text-stone-900 dark:text-stone-50 group-hover:text-white transition-colors duration-200"
                  >
                    {{ project.title }}
                  </h3>

                  <!-- Meta -->
                  <div
                    class="flex flex-wrap gap-x-3 gap-y-0.5 mb-3 text-xs font-mono text-stone-400 dark:text-stone-500 group-hover:text-stone-400 transition-colors duration-200"
                  >
                    <span>ROLE: {{ project.role }}</span>
                    @if (project.duration) {
                      <span>• {{ project.duration }}</span>
                    }
                    <span>• {{ project.date }}</span>
                  </div>

                  <p
                    class="text-stone-500 dark:text-stone-400 group-hover:text-stone-300 text-sm leading-relaxed mb-4 transition-colors duration-200"
                  >
                    {{ project.desc }}
                  </p>

                  <!-- Tech tags -->
                  <div class="flex flex-wrap gap-1.5">
                    @for (tag of project.tags; track tag) {
                      <span
                        class="flex items-center gap-1.5 text-xs font-mono border border-stone-300 dark:border-stone-600 text-stone-500 dark:text-stone-400 group-hover:border-emerald-500/60 group-hover:text-emerald-400 px-2.5 py-0.5 rounded transition-colors duration-200"
                      >
                        <span class="w-3.5 h-3.5 shrink-0" [innerHTML]="getTechIcon(tag)"></span>
                        {{ tag }}
                      </span>
                    }
                  </div>

                  <!-- Impact metrics (hover reveal) -->
                  @if (project.metrics) {
                    <div
                      class="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 group-hover:border-stone-700 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <div
                        class="flex flex-wrap gap-x-4 gap-y-0.5 text-xs font-mono text-stone-400"
                      >
                        @if (project.metrics.users) {
                          <span>USERS: {{ project.metrics.users }}</span>
                        }
                        @if (project.metrics.uptime) {
                          <span>• UPTIME: {{ project.metrics.uptime }}</span>
                        }
                        @if (project.metrics.performance) {
                          <span>• PERF: {{ project.metrics.performance }}</span>
                        }
                      </div>
                    </div>
                  }

                  <!-- Ver detalle (hover reveal) -->
                  @if (project.slug) {
                    <div
                      class="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <button
                        (click)="openModal(project); $event.stopPropagation()"
                        class="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        VER DETALLE
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Project Detail Modal -->
    <app-project-detail-modal
      [project]="selectedProject()"
      [visible]="modalVisible()"
      (close)="closeModal()"
    />
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* Scroll-triggered reveal */
      .project-reveal {
        opacity: 0;
        transform: translateY(16px);
        transition:
          opacity 0.6s ease,
          transform 0.6s ease;
      }
      .project-reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* Card stagger reveal */
      .project-card {
        opacity: 0;
        transform: translateY(20px);
        transition:
          opacity 0.55s ease-out,
          transform 0.55s ease-out,
          box-shadow 0.3s ease,
          border-color 0.3s ease;
      }
      .project-card.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `,
  ],
})
export class ProjectsSectionComponent implements AfterViewInit, OnDestroy {
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);

  private revealObserver: IntersectionObserver | null = null;
  private cardObserver: IntersectionObserver | null = null;

  // ── State ────────────────────────────────────────────────
  activeFilter = signal<string>('all');
  selectedProject = signal<Project | null>(null);
  modalVisible = signal<boolean>(false);

  // ── Data ─────────────────────────────────────────────────
  projects: Project[] = PROJECTS;

  filteredProjects = computed(() => {
    const filter = this.activeFilter();
    return filter === 'all' ? this.projects : this.projects.filter((p) => p.tags.includes(filter));
  });

  uniqueTechs = computed(() => {
    const all = this.projects.flatMap((p) => p.tags);
    return Array.from(new Set(all)).sort();
  });

  // ── Lifecycle ────────────────────────────────────────────
  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.setupObservers();
  }

  ngOnDestroy() {
    this.revealObserver?.disconnect();
    this.cardObserver?.disconnect();
  }

  private setupObservers() {
    // Header + filter reveals
    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          this.revealObserver?.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );

    // Card stagger — fires on scroll
    this.cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          this.cardObserver?.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' },
    );

    requestAnimationFrame(() => {
      document.querySelectorAll('#projects .project-reveal').forEach((el) => {
        this.revealObserver?.observe(el);
      });
      document.querySelectorAll('#projects .project-card').forEach((el) => {
        this.cardObserver?.observe(el);
      });
    });
  }

  // ── Actions ──────────────────────────────────────────────
  filterBy(tech: string) {
    this.activeFilter.set(tech);
  }

  openModal(project: Project) {
    this.selectedProject.set(project);
    setTimeout(() => this.modalVisible.set(true), 10);
  }

  closeModal() {
    this.modalVisible.set(false);
    setTimeout(() => this.selectedProject.set(null), 500);
  }

  // ── Helpers ──────────────────────────────────────────────
  getProjectCount(tech: string): number {
    if (tech === 'all') return this.projects.length;
    return this.projects.filter((p) => p.tags.includes(tech)).length;
  }

  getProjectVisual(type: ProjectVisualType): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      PROJECT_VISUALS[type] ?? PROJECT_VISUALS.PLATFORM,
    );
  }

  getIcon(name: keyof typeof ICONS): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[name] ?? '');
  }

  getTechIcon(tech: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      TECH_ICONS[tech as keyof typeof TECH_ICONS] ?? '',
    );
  }

  getStatusClass(status: Project['status']): string {
    switch (status) {
      case 'Completado':
        return 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30';
      case 'En Progreso':
        return 'border-amber-400   text-amber-600   dark:text-amber-400   bg-amber-50   dark:bg-amber-900/20';
      case 'Mantenimiento':
        return 'border-teal-400    text-teal-600    dark:text-teal-400    bg-teal-50    dark:bg-teal-900/20';
      default:
        return 'border-stone-400   text-stone-600   dark:text-stone-400   bg-stone-50   dark:bg-stone-800';
    }
  }
}
