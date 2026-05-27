import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../core/data/projects.data';

@Component({
  selector: 'app-project-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (project()) {
      <!-- Backdrop -->
      <div class="fixed inset-0 z-50 flex justify-end" (click)="onBackdropClick($event)">
        <!-- Blur + dark overlay -->
        <div
          class="absolute inset-0 bg-stone-900/40 dark:bg-[#050505]/60 backdrop-blur-sm transition-opacity duration-500"
          [class.opacity-0]="!visible()"
          [class.opacity-100]="visible()"
        ></div>

        <!-- Slide-in Panel -->
        <div
          class="relative z-10 w-full max-w-2xl h-full bg-stone-50 dark:bg-[#0a0a0a] overflow-y-auto shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          [class.translate-x-full]="!visible()"
          [class.translate-x-0]="visible()"
          (click)="$event.stopPropagation()"
        >
          <!-- Top accent line (Zen Emerald) -->
          <div
            class="absolute top-0 left-0 w-full h-1 bg-emerald-500 z-50"
          ></div>

          <!-- Close Button -->
          <button
            (click)="close.emit()"
            class="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all duration-300 border border-white/10"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Hero Section (With Image if exists) -->
          <div class="relative w-full min-h-[400px] flex flex-col justify-end px-8 pb-10 pt-24 bg-stone-900">
            <!-- Background Image -->
            @if (project()!.image) {
              <div class="absolute inset-0 z-0">
                <img
                  [src]="project()!.image"
                  [alt]="project()!.title"
                  class="w-full h-full object-cover opacity-60"
                />
              </div>
            }
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 z-10 bg-linear-to-t from-stone-900 via-stone-900/80 to-transparent"></div>

            <!-- Hero Content -->
            <div class="relative z-20">
              <!-- Status + Date -->
              <div class="flex flex-wrap items-center gap-3 mb-5">
                <span
                  class="text-[10px] font-mono border px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm"
                  [class]="getStatusClass(project()!.status)"
                >
                  {{ project()!.status }}
                </span>
                <span class="text-stone-400 font-mono text-[10px] tracking-widest uppercase">{{ project()!.date }}</span>
                @if (project()!.duration) {
                  <span class="text-stone-400 font-mono text-[10px] tracking-widest uppercase">• {{ project()!.duration }}</span>
                }
              </div>

              <h2 class="text-4xl md:text-5xl font-bold mb-4 leading-tight text-white tracking-tighter">{{ project()!.title }}</h2>
              <p class="text-stone-300 text-sm leading-relaxed mb-8 max-w-xl font-light">{{ project()!.desc }}</p>

              <!-- CTA Links -->
              <div class="flex flex-wrap gap-4">
                @if (project()!.github) {
                  <a
                    [href]="project()!.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-stone-900 font-bold text-xs rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-300"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                      />
                    </svg>
                    GITHUB
                  </a>
                }
                @if (project()!.demo) {
                  <a
                    [href]="project()!.demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-6 py-2.5 border border-stone-600 text-stone-300 font-bold text-xs rounded-full hover:border-emerald-500 hover:text-emerald-400 transition-all duration-300 backdrop-blur-sm bg-white/5"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    VER DEMO
                  </a>
                }
              </div>
            </div>
          </div>

          <!-- Tags Strip -->
          <div class="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0a0a0a] px-8 py-4">
            <div class="flex flex-wrap gap-2">
              @for (tag of project()!.tags; track tag) {
                <span
                  class="px-3 py-1.5 bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 text-[10px] font-mono uppercase tracking-widest rounded-full"
                >
                  {{ tag }}
                </span>
              }
            </div>
          </div>

          <!-- Metrics Bar -->
          @if (project()!.metrics) {
            <div class="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 py-6 px-8 grid grid-cols-3 gap-4 text-center">
              @if (project()!.metrics!.users) {
                <div>
                  <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {{ project()!.metrics!.users }}
                  </div>
                  <div class="text-[10px] font-mono text-stone-500 tracking-widest uppercase mt-1">Usuarios</div>
                </div>
              }
              @if (project()!.metrics!.uptime) {
                <div>
                  <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {{ project()!.metrics!.uptime }}
                  </div>
                  <div class="text-[10px] font-mono text-stone-500 tracking-widest uppercase mt-1">Uptime</div>
                </div>
              }
              @if (project()!.metrics!.performance) {
                <div>
                  <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {{ project()!.metrics!.performance }}
                  </div>
                  <div class="text-[10px] font-mono text-stone-500 tracking-widest uppercase mt-1">Latencia</div>
                </div>
              }
            </div>
          }

          <!-- Body Content (Editorial Layout) -->
          <div class="px-8 py-12 space-y-12 bg-white dark:bg-[#0a0a0a]">
            <!-- Role Info (Moved to top of content) -->
            <div class="flex flex-wrap gap-x-12 gap-y-6 text-sm font-mono pb-8 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span class="text-stone-400 dark:text-stone-500 block mb-1 text-[10px] tracking-widest uppercase">Rol</span>
                <span class="text-stone-900 dark:text-stone-100">{{ project()!.role }}</span>
              </div>
              <div>
                <span class="text-stone-400 dark:text-stone-500 block mb-1 text-[10px] tracking-widest uppercase">Año</span>
                <span class="text-stone-900 dark:text-stone-100">{{ project()!.date }}</span>
              </div>
              @if (project()!.duration) {
                <div>
                  <span class="text-stone-400 dark:text-stone-500 block mb-1 text-[10px] tracking-widest uppercase">Duración</span>
                  <span class="text-stone-900 dark:text-stone-100">{{ project()!.duration }}</span>
                </div>
              }
            </div>

            <!-- Challenge -->
            @if (project()!.challenge) {
              <div>
                <span class="text-emerald-600 dark:text-emerald-500 font-mono text-[10px] tracking-widest uppercase block mb-3">
                  // El Desafío
                </span>
                <h3 class="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-4 tracking-tight">Arquitectura del Problema</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm leading-relaxed font-light">{{ project()!.challenge }}</p>
              </div>
            }

            <!-- Solution -->
            @if (project()!.solution) {
              <div>
                <span class="text-emerald-600 dark:text-emerald-500 font-mono text-[10px] tracking-widest uppercase block mb-3">
                  // La Solución
                </span>
                <h3 class="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-4 tracking-tight">Ejecución Técnica</h3>
                <p class="text-stone-600 dark:text-stone-400 text-sm leading-relaxed font-light">{{ project()!.solution }}</p>
              </div>
            }

            <!-- Learnings -->
            @if (project()!.learnings && project()!.learnings!.length > 0) {
              <div>
                <span class="text-emerald-600 dark:text-emerald-500 font-mono text-[10px] tracking-widest uppercase block mb-3">
                  // Insights
                </span>
                <h3 class="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-6 tracking-tight">Aprendizajes Clave</h3>
                <div class="space-y-3">
                  @for (learning of project()!.learnings!; track learning; let i = $index) {
                    <div
                      class="flex items-start gap-4 p-5 bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl"
                    >
                      <span
                        class="shrink-0 w-8 h-8 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-mono font-bold text-[10px]"
                      >
                        {{ (i + 1).toString().padStart(2, '0') }}
                      </span>
                      <p class="text-stone-700 dark:text-stone-300 text-sm leading-relaxed font-light pt-1">{{ learning }}</p>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class ProjectDetailModalComponent {
  project = input<Project | null>(null);
  visible = input<boolean>(false);
  close = output<void>();

  onBackdropClick(event: MouseEvent) {
    this.close.emit();
  }

  getStatusClass(status: Project['status']): string {
    switch (status) {
      case 'Completado':
        return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
      case 'En Progreso':
        return 'border-amber-500/30 text-amber-400 bg-amber-500/10';
      case 'Mantenimiento':
        return 'border-teal-500/30 text-teal-400 bg-teal-500/10';
      default:
        return 'border-stone-500/30 text-stone-400 bg-stone-500/10';
    }
  }
}
