import {
  Component,
  signal,
  output,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

interface PipelineStep {
  icon: string;
  label: string;
  detail: string;
  ms: string;
  color: string;
  state: 'pending' | 'running' | 'done';
  liveMs: number; // real-time counter while running
}

const PIPELINE: PipelineStep[] = [
  {
    icon: '⬡',
    label: 'Build',
    detail: 'Compiling TypeScript 5.9',
    ms: '89ms',
    color: '#818cf8',
    state: 'pending',
    liveMs: 0,
  },
  {
    icon: '⬡',
    label: 'Lint',
    detail: 'ESLint · 0 warnings',
    ms: '43ms',
    color: '#38bdf8',
    state: 'pending',
    liveMs: 0,
  },
  {
    icon: '⬡',
    label: 'Test',
    detail: 'Vitest · 12/12 passed',
    ms: '134ms',
    color: '#34d399',
    state: 'pending',
    liveMs: 0,
  },
  {
    icon: '⬡',
    label: 'Bundle',
    detail: 'Tailwind + Angular optimizer',
    ms: '201ms',
    color: '#fb923c',
    state: 'pending',
    liveMs: 0,
  },
  {
    icon: '⬡',
    label: 'Deploy',
    detail: 'GitHub Pages → migattedev.me',
    ms: '380ms',
    color: '#10b981',
    state: 'pending',
    liveMs: 0,
  },
];

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isLoading()) {
      <div
        #container
        class="fixed inset-0 z-100 flex items-center justify-center p-6"
        style="background: #09090b;"
        role="status"
        aria-label="Cargando portafolio"
      >
        <!-- ① Dot grid background (pure CSS, opacity 3%) -->
        <div class="dot-grid absolute inset-0 pointer-events-none"></div>

        <!-- ② Ambient glow -->
        <div
          class="absolute inset-0 pointer-events-none"
          style="background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,0.04) 0%, transparent 70%);"
        ></div>

        <!-- ── Card ───────────────────────────────────────── -->
        <div #card class="w-full max-w-lg relative z-10 opacity-0">
          <!-- ③ Git commit metadata -->
          <div #gitMeta class="mb-6 opacity-0">
            <div
              class="rounded-lg border px-4 py-3 font-mono text-xs"
              style="background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.06);"
            >
              <div class="flex items-center gap-2 mb-2">
                <!-- Branch badge -->
                <span
                  class="px-2 py-0.5 rounded text-xs"
                  style="background: rgba(16,185,129,0.12); color: rgba(16,185,129,0.9); border: 1px solid rgba(16,185,129,0.2);"
                >
                  ⎇ main
                </span>
                <span style="color: rgba(113,113,122,0.5);">·</span>
                <span style="color: rgba(113,113,122,0.5);">just now</span>
                <span class="ml-auto font-mono" style="color: rgba(16,185,129,0.45);">a3f8b2c</span>
              </div>
              <p class="mb-1" style="color: rgba(250,250,250,0.7);">
                "feat: deploy portfolio v1.0.0 — migattedev.me"
              </p>
              <p style="color: rgba(113,113,122,0.5);">
                Emerson Quijada Rafael &lt;emerson&#64;migattedev.me&gt;
              </p>
            </div>
          </div>

          <!-- Header -->
          <div #header class="mb-6 opacity-0">
            <div class="flex items-center gap-3 mb-1">
              <span class="relative flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style="background:#10b981;"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-2 w-2"
                  style="background:#10b981;"
                ></span>
              </span>
              <span
                class="text-xs font-mono tracking-widest uppercase"
                style="color:rgba(16,185,129,0.6);"
                >Deployment · Production</span
              >
            </div>
            <h1 class="text-2xl font-bold tracking-tight mt-3" style="color:#fafafa;">
              migattedev<span style="color:#10b981;">.me</span>
            </h1>
            <p class="text-xs font-mono mt-1" style="color:rgba(113,113,122,0.7);">
              emerson&#64;manjaro &nbsp;·&nbsp; Angular 21 &nbsp;·&nbsp; Node 22 LTS
            </p>
          </div>

          <!-- Pipeline steps -->
          <div class="space-y-1" #pipelineEl>
            @for (step of steps(); track step.label; let idx = $index) {
              <div
                class="pipeline-step flex items-center gap-4 px-4 py-3 rounded-lg border opacity-0 transition-colors duration-300"
                [style.border-color]="
                  step.state === 'done' ? step.color + '35' : 'rgba(255,255,255,0.05)'
                "
                [style.background]="
                  step.state === 'done' ? step.color + '08' : 'rgba(255,255,255,0.02)'
                "
              >
                <!-- Status icon -->
                <div class="w-5 h-5 flex items-center justify-center shrink-0">
                  @if (step.state === 'pending') {
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      style="background:rgba(113,113,122,0.3);"
                    ></span>
                  } @else if (step.state === 'running') {
                    <svg
                      class="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      [style.color]="step.color"
                    >
                      <circle
                        class="opacity-20"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="2.5"
                      />
                      <path
                        class="opacity-80"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  } @else {
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" [style.color]="step.color">
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  }
                </div>

                <!-- Label + detail -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span
                      class="text-sm font-mono font-semibold"
                      [style.color]="
                        step.state !== 'pending' ? '#fafafa' : 'rgba(161,161,170,0.45)'
                      "
                    >
                      {{ step.label }}
                    </span>
                    @if (step.state === 'running') {
                      <span class="text-xs font-mono animate-pulse" [style.color]="step.color"
                        >running</span
                      >
                    }
                  </div>
                  <p
                    class="text-xs font-mono truncate mt-0.5"
                    [style.color]="
                      step.state === 'done' ? 'rgba(161,161,170,0.45)' : 'rgba(113,113,122,0.3)'
                    "
                  >
                    {{ step.detail }}
                  </p>
                </div>

                <!-- ④ Live ms counter + bar -->
                <div class="flex items-center gap-3 shrink-0">
                  <div
                    class="w-20 h-px overflow-hidden rounded-full"
                    style="background:rgba(255,255,255,0.05);"
                  >
                    <div
                      class="h-full rounded-full"
                      [style.background]="step.color"
                      [style.width]="stepBarWidth(step)"
                      style="transition: width 0.05s linear;"
                    ></div>
                  </div>
                  <span
                    class="text-xs font-mono w-14 text-right tabular-nums"
                    [style.color]="
                      step.state === 'done'
                        ? step.color
                        : step.state === 'running'
                          ? step.color + 'aa'
                          : 'rgba(113,113,122,0.25)'
                    "
                  >
                    @if (step.state === 'done') {
                      {{ step.ms }}
                    } @else if (step.state === 'running') {
                      {{ step.liveMs }}ms
                    } @else {
                      ———
                    }
                  </span>
                </div>
              </div>
            }
          </div>

          <!-- Footer: total progress -->
          <div #footer class="mt-5 opacity-0">
            <div
              class="flex justify-between text-xs font-mono mb-2"
              style="color:rgba(113,113,122,0.55);"
            >
              @if (isComplete()) {
                <span style="color:rgba(16,185,129,0.8);">
                  ✓ Deployed in {{ totalDuration() }}ms &nbsp;·&nbsp; Ready
                </span>
              } @else {
                <span>Running pipeline...</span>
              }
              <span style="color:#10b981;">{{ totalProgress() }}%</span>
            </div>
            <div class="h-px w-full overflow-hidden" style="background:rgba(255,255,255,0.05);">
              <div
                class="h-full transition-all duration-300 ease-out"
                style="background: linear-gradient(to right, rgba(16,185,129,0.35), #10b981);"
                [style.width.%]="totalProgress()"
              ></div>
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

      /* Dot grid background */
      .dot-grid {
        background-image: radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
        background-size: 28px 28px;
      }
    `,
  ],
})
export class LoadingScreenComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('card') cardRef!: ElementRef<HTMLDivElement>;
  @ViewChild('gitMeta') gitMetaRef!: ElementRef<HTMLDivElement>;
  @ViewChild('header') headerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('pipelineEl') pipelineRef!: ElementRef<HTMLDivElement>;
  @ViewChild('footer') footerRef!: ElementRef<HTMLDivElement>;

  steps = signal<PipelineStep[]>([...PIPELINE.map((s) => ({ ...s }))]);
  totalProgress = signal(0);
  isComplete = signal(false);
  totalDuration = signal(0);

  isLoading = signal(true);
  loadingComplete = output<void>();

  // Live timer interval
  private liveTimerInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.runSequence();
  }

  ngOnDestroy() {
    if (this.liveTimerInterval) clearInterval(this.liveTimerInterval);
  }

  /** Used in template — Angular can't call global parseInt() */
  stepBarWidth(step: PipelineStep): string {
    if (step.state === 'done') return '100%';
    if (step.state === 'running') {
      const max = parseFloat(step.ms); // "89ms" → 89
      return Math.min((step.liveMs / max) * 100, 100) + '%';
    }
    return '0%';
  }

  private runSequence() {
    const tl = gsap.timeline();

    // Card + git meta + header
    tl.to(
      this.cardRef.nativeElement,
      {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      },
      0.1,
    )
      .from(this.cardRef.nativeElement, { y: 18, duration: 0.5, ease: 'power2.out' }, 0.1)

      .to(
        this.gitMetaRef.nativeElement,
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
        0.25,
      )
      .from(this.gitMetaRef.nativeElement, { y: 10, duration: 0.5, ease: 'power2.out' }, 0.25)

      .to(
        this.headerRef.nativeElement,
        {
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
        },
        0.45,
      )

      // Pipeline rows stagger in
      .call(
        () => {
          const rows = document.querySelectorAll('.pipeline-step');
          gsap.to(rows, { opacity: 1, duration: 0.35, stagger: 0.07, ease: 'power2.out' });
          gsap.from(rows, { y: 8, duration: 0.35, stagger: 0.07, ease: 'power2.out' });

          gsap.to(this.footerRef.nativeElement, { opacity: 1, duration: 0.4, delay: 0.45 });
        },
        [],
        0.6,
      )

      // Start pipeline after rows appear
      .call(() => this.runSteps(), [], 1.1);
  }

  private runSteps() {
    // Duration of each step "running" phase (ms)
    const stepDurations = [300, 240, 350, 410, 480];
    const targetMs = [89, 43, 134, 201, 380];

    let delay = 0;
    let accMs = 0;

    PIPELINE.forEach((_, idx) => {
      // — Start step —
      setTimeout(() => {
        this.ngZone.run(() => {
          this.steps.update((steps) =>
            steps.map((s, i) => (i === idx ? { ...s, state: 'running', liveMs: 0 } : s)),
          );
        });

        // Live ms counter — updates every 16ms (≈60fps) up to the target
        const target = targetMs[idx];
        const duration = stepDurations[idx];
        const startedAt = Date.now();

        this.liveTimerInterval = setInterval(() => {
          const elapsed = Date.now() - startedAt;
          const pct = Math.min(elapsed / duration, 1);
          const current = Math.round(pct * target);

          this.ngZone.run(() => {
            this.steps.update((steps) =>
              steps.map((s, i) => (i === idx ? { ...s, liveMs: current } : s)),
            );
          });

          if (pct >= 1) {
            if (this.liveTimerInterval) clearInterval(this.liveTimerInterval);
          }
        }, 16);
      }, delay);

      delay += stepDurations[idx];
      accMs += targetMs[idx];

      // — Finish step —
      const doneDelay = delay;
      setTimeout(() => {
        if (this.liveTimerInterval) clearInterval(this.liveTimerInterval);

        this.ngZone.run(() => {
          this.steps.update((steps) =>
            steps.map((s, i) => (i === idx ? { ...s, state: 'done', liveMs: targetMs[idx] } : s)),
          );
        });

        // Animate total progress
        const targetPct = Math.round(((idx + 1) / PIPELINE.length) * 100);
        const obj = { val: this.totalProgress() };
        gsap.to(obj, {
          val: targetPct,
          duration: 0.4,
          ease: 'power1.out',
          onUpdate: () => {
            this.ngZone.run(() => this.totalProgress.set(Math.round(obj.val)));
          },
        });

        if (idx === PIPELINE.length - 1) {
          setTimeout(() => {
            this.ngZone.run(() => {
              this.isComplete.set(true);
              this.totalDuration.set(accMs);
            });
            setTimeout(() => this.exitSequence(), 1000);
          }, 350);
        }
      }, doneDelay + 20);

      delay += 60; // gap between steps
    });
  }

  private exitSequence() {
    gsap.to(this.cardRef.nativeElement, {
      opacity: 0,
      y: -10,
      scale: 0.99,
      duration: 0.5,
      ease: 'power2.in',
    });
    gsap.to(this.containerRef.nativeElement, {
      opacity: 0,
      duration: 0.5,
      delay: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        this.ngZone.run(() => {
          this.isLoading.set(false);
          this.loadingComplete.emit();
        });
      },
    });
  }
}
