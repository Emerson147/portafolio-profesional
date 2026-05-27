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
  PROJECT_VISUALS,
  ProjectVisualType,
  TECH_ICONS,
} from '../../../core/data/icons.data';
import { PROJECTS, Project } from '../../../core/data/projects.data';
import { ProjectDetailModalComponent } from '../project-detail-modal/project-detail-modal.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule, ProjectDetailModalComponent, IconComponent],
  template: `
    <section
      id="projects"
      class="py-24 md:py-32 px-6 bg-transparent relative overflow-hidden"
    >
      <!-- Global grid and lighting now handled by MainLayoutComponent -->

      <div class="max-w-7xl mx-auto relative z-10">
        <!-- Header -->
        <div class="mb-14 project-reveal">
          <span
            class="text-emerald-600 dark:text-emerald-500 font-mono font-bold text-[10px] tracking-widest uppercase mb-4 block"
          >
            // Portafolio
          </span>
          <h2
            class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 flex items-center gap-4 tracking-tighter"
          >
            Proyectos <span class="text-emerald-600 dark:text-emerald-500">Destacados</span>
            <span class="hidden md:block flex-1 h-px bg-stone-200 dark:bg-stone-800"></span>
          </h2>
          <p class="text-stone-600 dark:text-stone-400 max-w-2xl mt-4 leading-relaxed font-light">
            Sistemas construidos con arquitectura empresarial. Del diseño de datos relacional
            al despliegue automatizado en producción.
          </p>
        </div>

        <!-- Filter Pills (Zen Monochrome) -->
        <div class="flex flex-wrap gap-2 mb-12 project-reveal">
          <button
            (click)="filterBy('all')"
            class="px-5 py-2 text-[10px] font-mono tracking-widest uppercase border rounded-full transition-all duration-300"
            [class]="
              activeFilter() === 'all'
                ? 'border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 bg-white/50 dark:bg-[#0a0a0a]/50 hover:border-emerald-500/30'
            "
          >
            Todos ({{ getProjectCount('all') }})
          </button>
          @for (tech of uniqueTechs(); track tech) {
            <button
              (click)="filterBy(tech)"
              class="px-5 py-2 text-[10px] font-mono tracking-widest uppercase border rounded-full transition-all duration-300"
              [class]="
                activeFilter() === tech
                  ? 'border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 bg-white/50 dark:bg-[#0a0a0a]/50 hover:border-emerald-500/30'
              "
            >
              {{ tech }} ({{ getProjectCount(tech) }})
            </button>
          }
        </div>

        <!-- Bento Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (project of filteredProjectsSafe(); track project.title; let i = $index) {
            <div
              #cardEl
              class="project-card group relative bg-stone-50/50 dark:bg-[#0a0a0a]/50 backdrop-blur-xs border border-stone-200/50 dark:border-white/5 overflow-hidden rounded-2xl transition-all duration-700 ease-out cursor-pointer hover:border-emerald-500/30"
              [class.lg:col-span-2]="i === 0"
              [class.md:col-span-2]="i === 0"
              [style.transition-delay.ms]="i * 100"
              style="min-height: 480px;"
              (click)="project.slug && openModal(project)"
            >
              <!-- ── 1. Blueprint State (Base) ── -->
              <div
                class="absolute inset-0 flex items-center justify-center p-16 z-0 group-hover:opacity-0 transition-opacity duration-700"
              >
                <!-- Subtle Grid lines -->
                <div
                  class="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style="background-image: linear-gradient(rgba(0, 0, 0, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 1) 1px, transparent 1px); background-size: 32px 32px;"
                ></div>
                <!-- Abstract SVG -->
                <div
                  class="w-full h-full max-w-sm text-stone-300 dark:text-stone-800 transition-colors duration-500"
                  [innerHTML]="project.visualHtml"
                ></div>
              </div>

              <!-- ── 2. Real Image State / Dark Overlay (Hover) ── -->
              <div
                class="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden bg-stone-900 dark:bg-[#050505]"
              >
                @if (project.image) {
                  <img
                    [src]="project.image"
                    [alt]="project.title"
                    class="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-60"
                  />
                }
                <!-- Dark overlay for text readability -->
                <div
                  class="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/80 to-transparent opacity-90"
                ></div>
              </div>

              <!-- ── 3. UI Layer (Always on top) ── -->
              <div
                class="relative z-20 h-full flex flex-col justify-between p-8 text-stone-900 dark:text-stone-100 transition-colors duration-500"
                [class.group-hover:text-white]="true"
              >
                <!-- Top Row: Status & Links -->
                <div class="flex justify-between items-start">
                  <div class="flex gap-3 items-center">
                    <span
                      class="font-mono text-[10px] tracking-widest border px-3 py-1 rounded-full transition-colors duration-500 group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white backdrop-blur-md"
                      [class]="getStatusBaseClass(project.status)"
                    >
                      {{ project.status }}
                    </span>
                    <span
                      class="font-mono text-[10px] text-stone-400 group-hover:text-white/60 transition-colors duration-500"
                    >
                      PRJ-0{{ i + 1 }}
                    </span>
                  </div>

                  <!-- Links -->
                  <div class="flex gap-2">
                    @if (project.github) {
                      <a
                        [href]="project.github"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="w-10 h-10 border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0a0a0a] text-stone-500 rounded-full flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white group-hover:hover:text-emerald-400 group-hover:hover:border-emerald-400 transition-all duration-300 backdrop-blur-md"
                        (click)="$event.stopPropagation()"
                      >
                        <app-icon name="github" [size]="18" />
                      </a>
                    }
                    @if (project.demo) {
                      <a
                        [href]="project.demo"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="w-10 h-10 border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0a0a0a] text-stone-500 rounded-full flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white group-hover:hover:text-emerald-400 group-hover:hover:border-emerald-400 transition-all duration-300 backdrop-blur-md"
                        (click)="$event.stopPropagation()"
                      >
                        <app-icon name="externalLink" [size]="18" />
                      </a>
                    }
                  </div>
                </div>

                <!-- Bottom Row: Content -->
                <div class="mt-auto pt-12">
                  <h3
                    class="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-stone-900 dark:text-stone-50 group-hover:text-white transition-colors duration-500"
                  >
                    {{ project.title }}
                  </h3>

                  <!-- Meta -->
                  <div
                    class="flex flex-wrap gap-x-3 gap-y-1 mb-4 text-[10px] font-mono tracking-widest uppercase text-stone-400 group-hover:text-white/60 transition-colors duration-500"
                  >
                    <span>ROLE: {{ project.role }}</span>
                    @if (project.duration) {
                      <span>• {{ project.duration }}</span>
                    }
                  </div>

                  <p
                    class="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-6 font-light group-hover:text-white/80 transition-colors duration-500 max-w-2xl"
                  >
                    {{ project.desc }}
                  </p>

                  <!-- Tech tags -->
                  <div class="flex flex-wrap gap-2">
                    @for (tag of project.tagsSafe; track tag.name) {
                      <span
                        class="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest border border-stone-200 dark:border-stone-800 text-stone-500 bg-white/50 dark:bg-[#0a0a0a]/50 px-3 py-1.5 rounded-full group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white backdrop-blur-md transition-all duration-500"
                      >
                        <span class="w-3 h-3 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" [innerHTML]="tag.iconHtml"></span>
                        {{ tag.name }}
                      </span>
                    }
                  </div>
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

      .project-reveal {
        opacity: 0;
        transform: translateY(20px);
        transition:
          opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .project-reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .project-card {
        opacity: 0;
        transform: translateY(24px);
        transition:
          opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
          border-color 0.4s ease;
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

  filteredProjectsSafe = computed(() => {
    const list = this.filteredProjects();
    return list.map((project) => ({
      ...project,
      visualHtml: this.sanitizer.bypassSecurityTrustHtml(
        PROJECT_VISUALS[project.type as ProjectVisualType] ?? PROJECT_VISUALS.PLATFORM,
      ),
      tagsSafe: project.tags.map((tag) => ({
        name: tag,
        iconHtml: this.sanitizer.bypassSecurityTrustHtml(
          TECH_ICONS[tag as keyof typeof TECH_ICONS] ?? '',
        ),
      })),
    }));
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

      // Fallback for extreme edge cases
      setTimeout(() => {
        document.querySelectorAll('#projects .project-reveal:not(.visible)').forEach((el) => {
          el.classList.add('visible');
        });
        document.querySelectorAll('#projects .project-card:not(.visible)').forEach((el) => {
          el.classList.add('visible');
        });
      }, 1500);
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

  getStatusBaseClass(status: Project['status']): string {
    switch (status) {
      case 'Completado':
        return 'border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10';
      case 'En Progreso':
        return 'border-amber-400/50 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10';
      case 'Mantenimiento':
        return 'border-teal-400/50 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/10';
      default:
        return 'border-stone-200 dark:border-stone-800 text-stone-500 bg-white/50 dark:bg-[#0a0a0a]/50';
    }
  }
}
