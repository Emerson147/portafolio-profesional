import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="min-h-screen bg-white dark:bg-[#050505] text-stone-900 dark:text-stone-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-50 main-container relative overflow-x-hidden transition-colors duration-500"
    >
      <!-- Fixed Vertical Elements (Japanese Style) -->
      <div
        class="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-40 writing-vertical-rl text-xs font-bold tracking-[0.3em] text-stone-300 dark:text-stone-700 uppercase pointer-events-none transition-colors duration-500"
      >
        MigatteDev • Systems Engineer
      </div>
      <div
        class="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-40 writing-vertical-rl text-xs font-bold tracking-[0.3em] text-stone-300 dark:text-stone-700 uppercase pointer-events-none transition-colors duration-500"
      >
        Zen Code • 2026
      </div>

      <!-- Global Ambient Lighting (Top Center & Bottom Left) -->
      <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-200/50 via-stone-50/0 to-stone-50/0 dark:from-emerald-900/10 dark:via-[#050505]/0 dark:to-[#050505]/0"
        ></div>
        <div
          class="absolute top-[40%] -left-[300px] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]"
        ></div>
        <div
          class="absolute bottom-0 -right-[200px] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]"
        ></div>
      </div>

      <!-- Global Background Grid -->
      <div class="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.03] pointer-events-none zen-grid-bg"></div>

      <!-- Page Content -->
      <div class="relative z-10">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .writing-vertical-rl {
        writing-mode: vertical-rl;
      }
      .zen-grid-bg {
        background-size: 64px 64px;
        background-image:
          linear-gradient(to right, currentColor 1px, transparent 1px),
          linear-gradient(to bottom, currentColor 1px, transparent 1px);
      }
    `,
  ],
})
export class MainLayoutComponent {}
