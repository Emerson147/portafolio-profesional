import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BootLog } from '../../molecules/boot-log-entry/boot-log-entry.component';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isLoading()) {
      <div
        class="fixed inset-0 z-100 bg-stone-950 flex items-center justify-center font-mono p-4 overflow-hidden"
      >
        <!-- Blueprint Grid Pattern -->
        <div
          class="absolute inset-0 opacity-[0.03] pointer-events-none"
          style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px;"
        ></div>

        <div class="w-full max-w-2xl relative z-10">
          <!-- System Header -->
          <div class="mb-8 border-b border-stone-800 pb-4 flex justify-between items-end">
            <div>
              <span class="text-emerald-600 text-xs tracking-widest block mb-1"
                >// INITIALIZING</span
              >
              <h1 class="text-stone-100 text-2xl font-bold tracking-tighter">
                ZEN_SYSTEM<span class="text-emerald-500">.v1</span>
              </h1>
            </div>
            <div class="text-stone-600 text-xs">{{ currentYear }} © MIGATTE_DEV</div>
          </div>

          <!-- Terminal Body -->
          <div class="h-[300px] overflow-y-auto font-medium text-sm md:text-base">
            @for (log of bootLogs(); track $index) {
              <div class="mb-2 flex gap-3 font-mono">
                <span class="text-stone-600 shrink-0">{{ log.time }}</span>
                <span [class]="log.color + ' shrink-0'">{{ log.prefix }}</span>
                <span class="text-stone-300">{{ log.msg }}</span>
              </div>
            }

            @if (!isBootComplete()) {
              <div class="mt-2 flex items-center">
                <span class="text-emerald-500">></span>
                <span class="animate-cursor ml-2 w-2 h-5 bg-emerald-500 block"></span>
              </div>
            }

            @if (isBootComplete()) {
              <div class="mt-6 pt-4 border-t border-stone-800">
                <div class="text-emerald-400 mb-1">[SUCCESS] All systems operational.</div>
                <div class="text-stone-400">Launching interface...</div>
              </div>
            }
          </div>

          <!-- Loading Progress Line -->
          <div class="mt-8 h-1 w-full bg-stone-900 rounded-full overflow-hidden">
            <div
              class="h-full bg-emerald-500 transition-all duration-300 ease-out"
              [style.width.%]="progress()"
            ></div>
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
      .animate-cursor {
        animation: blink 1s step-end infinite;
      }
      @keyframes blink {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
      }
    `,
  ],
})
export class LoadingScreenComponent {
  isLoading = signal(true);
  isBootComplete = signal(false);
  bootLogs = signal<BootLog[]>([]);
  progress = signal(0);
  currentYear = new Date().getFullYear();

  loadingComplete = output<void>();

  constructor() {
    this.runBootSequence();
  }

  private runBootSequence() {
    const logs = [
      {
        prefix: '[KERNEL]',
        msg: 'Initializing Zen Architecture...',
        delay: 200,
        color: 'text-emerald-500',
      },
      {
        prefix: '[MODULE]',
        msg: 'Loading Angular 17 Core...',
        delay: 800,
        color: 'text-stone-400',
      },
      {
        prefix: '[STYLE]',
        msg: 'Applying Tailwind Design System...',
        delay: 1400,
        color: 'text-stone-400',
      },
      {
        prefix: '[DATA]',
        msg: 'Connecting to Project Database...',
        delay: 2000,
        color: 'text-amber-500',
      },
      {
        prefix: '[READY]',
        msg: 'Interface rendering complete.',
        delay: 2500,
        color: 'text-emerald-400',
      },
    ];

    // Progress bar animation
    const interval = setInterval(() => {
      this.progress.update((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 50);

    logs.forEach((log) => {
      setTimeout(() => {
        const time = new Date().toISOString().split('T')[1].slice(0, 8);
        this.bootLogs.update((current) => [
          ...current,
          {
            time,
            msg: log.msg,
            prefix: log.prefix,
            color: log.color,
          },
        ]);
      }, log.delay);
    });

    setTimeout(() => {
      this.isBootComplete.set(true);
      setTimeout(() => {
        this.isLoading.set(false);
        this.loadingComplete.emit();
      }, 1200);
    }, 3200);
  }
}
