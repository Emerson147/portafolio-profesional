import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="min-h-screen bg-[#f5f5f4] text-[#292524] font-sans selection:bg-emerald-200 selection:text-emerald-900 main-container opacity-0 relative overflow-x-hidden"
    >
      <!-- Fixed Vertical Elements (Japanese Style) -->
      <div
        class="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-40 writing-vertical-rl text-xs font-bold tracking-[0.3em] text-stone-300 uppercase mix-blend-difference pointer-events-none"
      >
        MigatteDev • Systems Engineer
      </div>
      <div
        class="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-40 writing-vertical-rl text-xs font-bold tracking-[0.3em] text-stone-300 uppercase pointer-events-none"
      >
        Zen Code • 2026
      </div>

      <!-- Background Grid -->
      <div class="absolute inset-0 z-0 opacity-[0.4] pointer-events-none zen-grid-bg"></div>

      <!-- Page Content -->
      <ng-content></ng-content>
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
        background-size: 60px 60px;
        background-image:
          linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
      }
    `,
  ],
})
export class MainLayoutComponent {}
