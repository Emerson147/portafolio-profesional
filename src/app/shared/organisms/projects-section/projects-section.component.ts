import { Component, inject, signal, computed, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  ICONS,
  PROJECT_VISUALS,
  ProjectVisualType,
  TECH_ICONS,
} from '../../../core/data/icons.data';
import { GsapService } from '../../../core/services/gsap.service';
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
      <!-- Zen Pattern Background -->
      <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none"
        style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"
      ></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="flex flex-col md:flex-row justify-between items-end mb-20">
          <div class="gs-reveal">
            <span class="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-2 block"
              >// Portafolio</span
            >
            <h2 class="text-4xl md:text-5xl font-bold text-stone-900">Proyectos Destacados</h2>
          </div>
          <div class="hidden md:block w-40 h-px bg-stone-300 relative gs-reveal">
            <div class="absolute right-0 -top-1 w-2 h-2 bg-stone-900 rounded-full"></div>
          </div>
        </div>

        <!-- Filter Pills - Minimalist -->
        <div class="flex flex-wrap gap-2 mb-8">
          <button
            (click)="filterBy('all')"
            [class]="
              activeFilter() === 'all'
                ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                : 'border-stone-300 text-stone-600 hover:border-stone-400'
            "
            class="px-4 py-2 text-xs font-mono border-2 rounded-full transition-all duration-300"
          >
            Todos ({{ getProjectCount('all') }})
          </button>
          @for (tech of uniqueTechs(); track tech) {
            <button
              (click)="filterBy(tech)"
              [class]="
                activeFilter() === tech
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                  : 'border-stone-300 text-stone-600 hover:border-stone-400'
              "
              class="px-4 py-2 text-xs font-mono border-2 rounded-full transition-all duration-300"
            >
              {{ tech }} ({{ getProjectCount(tech) }})
            </button>
          }
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (project of filteredProjects(); track project.title; let i = $index) {
            <div
              class="project-card group relative bg-white border-2 border-stone-300 overflow-hidden rounded-lg shadow-lg hover:shadow-2xl hover:shadow-emerald-900/20 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 ease-out"
              [class.lg:col-span-2]="i === 0"
              style="min-height: 450px;"
            >
              <!-- 1. Background State (Default Blueprint) -->
              <div
                class="absolute inset-0 bg-stone-50 group-hover:bg-stone-900 transition-colors duration-500"
              >
                <!-- Status Badge (Top Left) -->
                <div
                  class="absolute top-4 left-4 text-xs font-mono border px-2 py-1 rounded transition-colors"
                  [class]="getStatusClass(project.status)"
                >
                  {{ project.status }}
                </div>
                <div
                  class="absolute top-4 right-4 text-xs font-mono text-stone-500 border border-stone-300 px-2 py-1"
                >
                  REF: PRJ-0{{ i + 1 }}
                </div>
                <div class="absolute bottom-4 left-4 text-xs font-mono text-stone-500">
                  ARCH: {{ project.type }}
                </div>
                <!-- Grid Lines (Fades out on hover) -->
                <div
                  class="absolute inset-0 transition-opacity duration-300 group-hover:opacity-10"
                  style="background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px); background-size: 40px 100%;"
                ></div>
              </div>

              <!-- 2. Abstract Visual Representation (SVG) - Fades In -->
              <div
                class="absolute inset-0 flex items-center justify-center p-16 z-10 pointer-events-none"
              >
                <div
                  class="w-full h-full text-stone-200 group-hover:text-emerald-500/30 transition-colors duration-500"
                  [innerHTML]="getProjectVisual(project.type)"
                ></div>
              </div>

              <!-- 2.5. Real Image Overlay - Reveals on Hover -->
              @if (project.image) {
                <div
                  class="absolute inset-0 z-15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                >
                  <img
                    [src]="project.image"
                    [alt]="project.title"
                    class="w-full h-full object-cover"
                  />
                  <!-- Gradient overlay for legibility -->
                  <div
                    class="absolute inset-0 bg-linear-to-t from-stone-900/90 via-stone-900/50 to-transparent"
                  ></div>
                </div>
              }

              <!-- 3. Content Overlay -->
              <div
                class="relative z-20 h-full flex flex-col justify-between p-8 text-stone-900 group-hover:text-white transition-colors duration-300"
              >
                <!-- Top Row: Status and REF only -->
                <div class="space-y-8">
                  <!-- Empty div for spacing - increased -->
                  <div class="h-8"></div>

                  <!-- Second Row: Project ID and Functional Links -->
                  <div class="flex justify-between items-start">
                    <span
                      class="font-mono text-xs border border-stone-400 text-stone-600 group-hover:border-emerald-500 group-hover:text-emerald-400 px-3 py-1 rounded-full transition-colors"
                    >
                      // 0{{ i + 1 }}
                    </span>
                    <!-- Functional Links -->
                    <div class="flex gap-2">
                      @if (project.github) {
                        <a
                          [href]="project.github"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-10 h-10 border border-stone-300 bg-white text-stone-700 rounded-full flex items-center justify-center hover:border-emerald-500 hover:bg-emerald-500 hover:text-white transition-all group/link"
                          [innerHTML]="getIcon('github')"
                          (click)="$event.stopPropagation()"
                        ></a>
                      }
                      @if (project.demo) {
                        <a
                          [href]="project.demo"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-10 h-10 border border-stone-300 bg-white text-stone-700 rounded-full flex items-center justify-center hover:border-teal-500 hover:bg-teal-500 hover:text-white transition-all group/link"
                          [innerHTML]="getIcon('externalLink')"
                          (click)="$event.stopPropagation()"
                        ></a>
                      }
                    </div>
                  </div>
                </div>

                <div class="mt-auto">
                  <h3
                    class="text-2xl md:text-3xl font-bold mb-2 text-stone-900 group-hover:text-white transition-colors"
                  >
                    {{ project.title }}
                  </h3>
                  <!-- Architectural Metadata -->
                  <div
                    class="flex flex-wrap gap-x-3 gap-y-1 mb-3 text-xs font-mono text-stone-500 group-hover:text-stone-400 transition-colors"
                  >
                    <span>ROLE: {{ project.role }}</span>
                    @if (project.duration) {
                      <span>• DURATION: {{ project.duration }}</span>
                    }
                    <span>• {{ project.date }}</span>
                  </div>
                  <p
                    class="text-stone-600 group-hover:text-stone-300 text-sm leading-relaxed mb-4 transition-colors"
                  >
                    {{ project.desc }}
                  </p>
                  <div class="flex flex-wrap gap-2">
                    @for (tag of project.tags; track tag) {
                      <span
                        class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide border border-stone-400 text-stone-600 group-hover:border-emerald-500/50 group-hover:text-emerald-400 px-3 py-1 rounded transition-colors"
                      >
                        <span class="w-4 h-4" [innerHTML]="getTechIcon(tag)"></span>
                        {{ tag }}
                      </span>
                    }
                  </div>
                  <!-- Impact Metrics - Blueprint Style (Hover) -->
                  @if (project.metrics) {
                    <div
                      class="mt-3 pt-3 border-t border-stone-300 group-hover:border-stone-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <div
                        class="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-stone-500 group-hover:text-stone-400"
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
                </div>
                <!-- Ver Detalle Link -->
                @if (project.slug) {
                  <div
                    class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
    `,
  ],
})
export class ProjectsSectionComponent implements AfterViewInit {
  private sanitizer = inject(DomSanitizer);
  private gsap = inject(GsapService);
  private platformId = inject(PLATFORM_ID);

  // Filtering state
  activeFilter = signal<string>('all');
  // Modal state
  selectedProject = signal<Project | null>(null);
  modalVisible = signal<boolean>(false);

  openModal(project: Project) {
    this.selectedProject.set(project);
    // Small delay so the element is in DOM before animating
    setTimeout(() => this.modalVisible.set(true), 10);
  }

  closeModal() {
    this.modalVisible.set(false);
    setTimeout(() => this.selectedProject.set(null), 500);
  }

  projects: Project[] = PROJECTS;

  // Computed: filtered projects
  filteredProjects = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'all') return this.projects;
    return this.projects.filter((p) => p.tags.includes(filter));
  });

  // Computed: unique technologies
  uniqueTechs = computed(() => {
    const allTechs = this.projects.flatMap((p) => p.tags);
    return Array.from(new Set(allTechs)).sort();
  });

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.animateProjects(), 100);
    }
  }

  private animateProjects() {
    const cards = document.querySelectorAll('.project-card');
    if (cards.length === 0) return;

    // GSAP staggered reveal animation
    cards.forEach((card) => {
      (card as HTMLElement).style.opacity = '0';
      (card as HTMLElement).style.transform = 'translateY(30px)';
    });

    setTimeout(() => {
      cards.forEach((card, index) => {
        setTimeout(() => {
          (card as HTMLElement).style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          (card as HTMLElement).style.opacity = '1';
          (card as HTMLElement).style.transform = 'translateY(0)';
        }, index * 150);
      });
    }, 50);
  }

  filterBy(tech: string) {
    this.activeFilter.set(tech);
  }

  getProjectCount(tech: string): number {
    if (tech === 'all') return this.projects.length;
    return this.projects.filter((p) => p.tags.includes(tech)).length;
  }

  getProjectVisual(type: ProjectVisualType): SafeHtml {
    const svg = PROJECT_VISUALS[type] || PROJECT_VISUALS.PLATFORM;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getIcon(iconName: keyof typeof ICONS): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[iconName] || '');
  }

  getStatusClass(status: Project['status']): string {
    switch (status) {
      case 'Completado':
        return 'border-emerald-500 text-emerald-600 bg-emerald-50';
      case 'En Progreso':
        return 'border-amber-500 text-amber-600 bg-amber-50';
      case 'Mantenimiento':
        return 'border-teal-500 text-teal-600 bg-teal-50';
      default:
        return 'border-stone-400 text-stone-600 bg-stone-50';
    }
  }

  getTechIcon(techName: string): SafeHtml {
    const icon = TECH_ICONS[techName as keyof typeof TECH_ICONS];
    return this.sanitizer.bypassSecurityTrustHtml(icon || '');
  }
}
