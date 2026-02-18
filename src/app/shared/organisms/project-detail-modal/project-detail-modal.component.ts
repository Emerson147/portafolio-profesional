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
          class="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity duration-300"
          [class.opacity-0]="!visible()"
          [class.opacity-100]="visible()"
        ></div>

        <!-- Slide-in Panel -->
        <div
          class="relative z-10 w-full max-w-2xl h-full bg-white overflow-y-auto shadow-2xl transition-transform duration-500 ease-out"
          [class.translate-x-full]="!visible()"
          [class.translate-x-0]="visible()"
          (click)="$event.stopPropagation()"
        >
          <!-- Top accent line -->
          <div
            class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-400 via-teal-500 to-cyan-500 z-10"
          ></div>

          <!-- Close Button -->
          <button
            (click)="close.emit()"
            class="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-all"
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

          <!-- Hero -->
          <div class="bg-stone-900 text-white px-8 pt-16 pb-10">
            <!-- Status + Date -->
            <div class="flex flex-wrap items-center gap-3 mb-5">
              <span
                class="text-xs font-mono border px-3 py-1 rounded-full"
                [class]="getStatusClass(project()!.status)"
              >
                {{ project()!.status }}
              </span>
              <span class="text-stone-500 font-mono text-xs">{{ project()!.date }}</span>
              @if (project()!.duration) {
                <span class="text-stone-500 font-mono text-xs">• {{ project()!.duration }}</span>
              }
            </div>

            <h2 class="text-3xl font-bold mb-3 leading-tight">{{ project()!.title }}</h2>
            <p class="text-stone-400 text-sm leading-relaxed mb-6">{{ project()!.desc }}</p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-6">
              @for (tag of project()!.tags; track tag) {
                <span
                  class="px-3 py-1 bg-white/5 border border-white/10 text-emerald-400 text-xs font-mono rounded-full"
                >
                  {{ tag }}
                </span>
              }
            </div>

            <!-- CTA Links -->
            <div class="flex flex-wrap gap-3">
              @if (project()!.github) {
                <a
                  [href]="project()!.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-stone-900 font-bold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                    />
                  </svg>
                  GitHub
                </a>
              }
              @if (project()!.demo) {
                <a
                  [href]="project()!.demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-5 py-2.5 border border-emerald-500 text-emerald-400 font-bold text-xs rounded-lg hover:bg-emerald-500 hover:text-stone-900 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Demo
                </a>
              }
            </div>
          </div>

          <!-- Metrics Bar -->
          @if (project()!.metrics) {
            <div class="bg-stone-800 text-white py-5 px-8 grid grid-cols-3 gap-4 text-center">
              @if (project()!.metrics!.users) {
                <div>
                  <div class="text-xl font-bold text-emerald-400">
                    {{ project()!.metrics!.users }}
                  </div>
                  <div class="text-xs font-mono text-stone-400 mt-0.5">Usuarios</div>
                </div>
              }
              @if (project()!.metrics!.uptime) {
                <div>
                  <div class="text-xl font-bold text-emerald-400">
                    {{ project()!.metrics!.uptime }}
                  </div>
                  <div class="text-xs font-mono text-stone-400 mt-0.5">Uptime</div>
                </div>
              }
              @if (project()!.metrics!.performance) {
                <div>
                  <div class="text-xl font-bold text-emerald-400">
                    {{ project()!.metrics!.performance }}
                  </div>
                  <div class="text-xs font-mono text-stone-400 mt-0.5">Rendimiento</div>
                </div>
              }
            </div>
          }

          <!-- Body Content -->
          <div class="px-8 py-10 space-y-10">
            <!-- Challenge -->
            @if (project()!.challenge) {
              <div>
                <span
                  class="text-emerald-600 font-mono text-xs tracking-widest uppercase block mb-2"
                  >// El Reto</span
                >
                <h3 class="text-xl font-bold text-stone-900 mb-3">El Problema</h3>
                <div class="w-10 h-0.5 bg-emerald-500 rounded-full mb-4"></div>
                <p class="text-stone-600 text-sm leading-relaxed">{{ project()!.challenge }}</p>
              </div>
            }

            <!-- Solution -->
            @if (project()!.solution) {
              <div>
                <span class="text-teal-600 font-mono text-xs tracking-widest uppercase block mb-2"
                  >// La Solución</span
                >
                <h3 class="text-xl font-bold text-stone-900 mb-3">El Enfoque</h3>
                <div class="w-10 h-0.5 bg-teal-500 rounded-full mb-4"></div>
                <p class="text-stone-600 text-sm leading-relaxed">{{ project()!.solution }}</p>
              </div>
            }

            <!-- Learnings -->
            @if (project()!.learnings && project()!.learnings!.length > 0) {
              <div>
                <span class="text-cyan-600 font-mono text-xs tracking-widest uppercase block mb-2"
                  >// Aprendizajes</span
                >
                <h3 class="text-xl font-bold text-stone-900 mb-5">Lo que aprendí</h3>
                <div class="space-y-3">
                  @for (learning of project()!.learnings!; track learning; let i = $index) {
                    <div
                      class="flex items-start gap-3 p-4 bg-stone-50 border border-stone-100 rounded-xl hover:border-emerald-200 transition-colors"
                    >
                      <span
                        class="shrink-0 w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-mono font-bold text-xs"
                      >
                        {{ (i + 1).toString().padStart(2, '0') }}
                      </span>
                      <p class="text-stone-700 text-sm leading-relaxed pt-0.5">{{ learning }}</p>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Role Info -->
            <div class="border-t border-stone-100 pt-8 flex flex-wrap gap-6 text-sm font-mono">
              <div>
                <span class="text-stone-400 block mb-1 text-xs">// ROL</span>
                <span class="text-stone-900 font-bold">{{ project()!.role }}</span>
              </div>
              <div>
                <span class="text-stone-400 block mb-1 text-xs">// AÑO</span>
                <span class="text-stone-900 font-bold">{{ project()!.date }}</span>
              </div>
              @if (project()!.duration) {
                <div>
                  <span class="text-stone-400 block mb-1 text-xs">// DURACIÓN</span>
                  <span class="text-stone-900 font-bold">{{ project()!.duration }}</span>
                </div>
              }
            </div>
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
        return 'border-emerald-500 text-emerald-400 bg-emerald-500/10';
      case 'En Progreso':
        return 'border-amber-500 text-amber-400 bg-amber-500/10';
      case 'Mantenimiento':
        return 'border-teal-500 text-teal-400 bg-teal-500/10';
      default:
        return 'border-stone-500 text-stone-400';
    }
  }
}
