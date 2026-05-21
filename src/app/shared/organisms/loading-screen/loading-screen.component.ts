import {
  Component,
  signal,
  output,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  NgZone,
  PLATFORM_ID,
  inject,
  isDevMode,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';

interface PipelineStep {
  label: string;
  detail: string;
  ms: number;
  runDuration: number;
  color: string;
  state: 'pending' | 'running' | 'done';
  liveMs: number;
}

const PIPELINE: PipelineStep[] = [
  {
    label: 'build',
    detail: 'TypeScript 5.9',
    ms: 89,
    runDuration: 280,
    color: '#818cf8',
    state: 'pending',
    liveMs: 0,
  },
  {
    label: 'lint',
    detail: 'ESLint · 0 warnings',
    ms: 43,
    runDuration: 200,
    color: '#38bdf8',
    state: 'pending',
    liveMs: 0,
  },
  {
    label: 'test',
    detail: 'Vitest · 12 passed',
    ms: 134,
    runDuration: 320,
    color: '#34d399',
    state: 'pending',
    liveMs: 0,
  },
  {
    label: 'bundle',
    detail: 'Angular optimizer',
    ms: 201,
    runDuration: 380,
    color: '#fb923c',
    state: 'pending',
    liveMs: 0,
  },
  {
    label: 'deploy',
    detail: 'migattedev.me → live',
    ms: 380,
    runDuration: 440,
    color: '#10b981',
    state: 'pending',
    liveMs: 0,
  },
];

const NAME_CHARS = 'migattedev'.split('');
const DOMAIN_CHARS = '.me'.split('');

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!isDone()) {
      <div #curtainLeft class="curtain curtain-left" aria-hidden="true"></div>
      <div #curtainRight class="curtain curtain-right" aria-hidden="true"></div>

      <div #stage class="stage" role="status" aria-label="Loading portfolio" aria-live="polite">
        <div class="stage-grid" aria-hidden="true"></div>
        <div class="stage-glow" aria-hidden="true"></div>

        <!-- macOS Terminal Window -->
        <div #terminalWindow class="terminal-window opacity-0">
          <!-- Window Header Bar -->
          <div class="terminal-header">
            <div class="terminal-dots">
              <span class="term-dot term-dot-red"></span>
              <span class="term-dot term-dot-yellow"></span>
              <span class="term-dot term-dot-green"></span>
            </div>
            <div class="terminal-title">migattedev — local-env — v2.5.4</div>
            <div class="terminal-badge">
              <span class="badge-branch">branch:main</span>
            </div>
          </div>

          <!-- Window Content Body -->
          <div class="terminal-body">
            <div #identity class="identity">
              <div #eyebrow class="eyebrow opacity-0">
                <span class="eyebrow-dot"></span>
                <span class="eyebrow-dot animate-ping-slow"></span>
                <span class="eyebrow-text">env: production</span>
              </div>

              <h1 class="name" aria-label="migattedev.me">
                <span class="terminal-prompt">$</span>
                <span #nameDisplay class="name-prefix"></span>
                <span #domainDisplay class="name-domain opacity-0"></span>
                <span #cursor class="cursor">▋</span>
              </h1>

              <p #roleText class="role opacity-0">Full Stack Developer</p>
            </div>

            <div #statusBar class="status-bar opacity-0" aria-hidden="true">
              <div class="pipeline">
                @for (step of steps(); track step.label; let idx = $index) {
                  <div
                    class="pipe-step"
                    [class.pipe-step--running]="step.state === 'running'"
                    [class.pipe-step--done]="step.state === 'done'"
                    [style.--step-color]="step.color"
                  >
                    <!-- Icon / Bullet Column -->
                    <div class="pipe-icon-wrapper">
                      <div class="pipe-icon">
                        @if (step.state === 'done') {
                          <svg class="pipe-svg" viewBox="0 0 16 16" fill="none">
                            <path
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M3 8.5l3.5 3.5 6.5-7"
                            />
                          </svg>
                        } @else if (step.state === 'running') {
                          <svg class="pipe-svg pipe-svg--spin" viewBox="0 0 16 16" fill="none">
                            <circle
                              cx="8"
                              cy="8"
                              r="6"
                              stroke="currentColor"
                              stroke-width="1.5"
                              stroke-dasharray="28"
                              stroke-dashoffset="10"
                              stroke-linecap="round"
                            />
                          </svg>
                        } @else {
                          <div class="pipe-dot"></div>
                        }
                      </div>
                      <!-- Interconnected Flow Line -->
                      @if (idx < steps().length - 1) {
                        <div class="pipe-connector">
                          <div
                            class="pipe-connector-fill"
                            [style.height]="stepConnectorHeight(step)"
                          ></div>
                        </div>
                      }
                    </div>

                    <!-- Step Header Details -->
                    <div class="pipe-info">
                      <div class="pipe-header-row">
                        <span class="pipe-label">{{ step.label }}</span>
                        <span class="pipe-detail">{{ step.detail }}</span>
                      </div>
                      <span class="pipe-ms">
                        @if (step.state === 'done') {
                          {{ step.ms }}ms
                        } @else if (step.state === 'running') {
                          {{ step.liveMs }}ms
                        } @else {
                          —
                        }
                      </span>
                    </div>

                    <!-- Step Progress Track -->
                    <div class="pipe-track">
                      <div class="pipe-fill" [style.width]="stepBarWidth(step)"></div>
                    </div>
                  </div>
                }
              </div>

              <!-- General Progress Section -->
              <div class="progress-section">
                <div class="progress-track">
                  <div class="progress-fill" [style.width.%]="totalProgress()"></div>
                </div>

                <div class="meta-row">
                  <span class="meta-label">
                    @if (isComplete()) {
                      <span class="meta-ready">✓ SUCCESS — deploy verified</span>
                    } @else {
                      <span class="meta-running">compiling assets...</span>
                    }
                  </span>
                  <span class="meta-pct">{{ totalProgress() }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        pointer-events: auto;
      }

      .curtain {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 50%;
        background: #09090b;
        z-index: 1;
      }

      .curtain-left {
        left: 0;
        border-right: 1px solid rgba(255, 255, 255, 0.03);
      }

      .curtain-right {
        right: 0;
        border-left: 1px solid rgba(255, 255, 255, 0.03);
      }

      .stage {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 540px;
        padding: 2.5rem;
        box-sizing: border-box;
        color: #fafafa;
        font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
      }

      .stage-grid {
        position: absolute;
        inset: -100px;
        background-image: radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        background-size: 28px 28px;
        pointer-events: none;
        mask-image: radial-gradient(circle at center, black 30%, transparent 70%);
        -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 70%);
        z-index: -1;
      }

      .stage-glow {
        position: absolute;
        width: 450px;
        height: 450px;
        background: radial-gradient(circle at center, rgba(16, 185, 129, 0.06) 0%, transparent 70%);
        pointer-events: none;
        z-index: -2;
      }

      .terminal-window {
        width: 100%;
        background: rgba(9, 9, 11, 0.75);
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 16px;
        box-shadow:
          0 25px 60px -15px rgba(0, 0, 0, 0.8),
          0 0 40px rgba(16, 185, 129, 0.02);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        z-index: 2;
      }

      .terminal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.875rem 1.25rem;
        background: rgba(255, 255, 255, 0.02);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        box-sizing: border-box;
      }

      .terminal-dots {
        display: flex;
        gap: 0.5rem;
      }

      .term-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: block;
        opacity: 0.75;
      }

      .term-dot-red {
        background: #ef4444;
      }
      .term-dot-yellow {
        background: #f59e0b;
      }
      .term-dot-green {
        background: #10b981;
      }

      .terminal-title {
        font-size: 0.6875rem;
        color: rgba(255, 255, 255, 0.45);
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: lowercase;
      }

      .terminal-badge {
        font-size: 0.625rem;
        padding: 0.125rem 0.375rem;
        border-radius: 4px;
        background: rgba(16, 185, 129, 0.08);
        border: 1px solid rgba(16, 185, 129, 0.2);
        color: #10b981;
        font-weight: 600;
      }

      .terminal-body {
        padding: 2rem 2.25rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }

      .identity {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        margin-bottom: 2rem;
      }

      .eyebrow {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.875rem;
      }

      .eyebrow-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #10b981;
      }

      .animate-ping-slow {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
      }

      @keyframes ping {
        75%,
        100% {
          transform: scale(2.5);
          opacity: 0;
        }
      }

      .eyebrow-text {
        font-size: 0.6875rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: rgba(16, 185, 129, 0.85);
        font-weight: 600;
      }

      .terminal-prompt {
        color: #10b981;
        font-weight: 600;
        margin-right: 0.625rem;
        user-select: none;
      }

      .name {
        font-size: 2.25rem;
        font-weight: 800;
        letter-spacing: -0.04em;
        margin: 0 0 0.375rem 0;
        color: #fafafa;
        display: flex;
        align-items: center;
        font-family: var(--font-sans);
      }

      .name-domain {
        color: #10b981;
      }

      .cursor {
        color: #10b981;
        font-weight: 300;
        margin-left: 0.125rem;
        animation: blink 1.1s step-end infinite;
      }

      @keyframes blink {
        from,
        to {
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
      }

      .role {
        font-size: 0.8125rem;
        color: rgba(161, 161, 170, 0.6);
        margin: 0 0 0 1.5rem;
        font-family: var(--font-sans);
        letter-spacing: -0.01em;
      }

      .status-bar {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .pipeline {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .pipe-step {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1rem;
        border-radius: 10px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid transparent;
        background: rgba(255, 255, 255, 0.005);
        position: relative;
      }

      .pipe-step--running {
        background: color-mix(in srgb, var(--step-color) 3%, rgba(255, 255, 255, 0.005));
        border-color: color-mix(in srgb, var(--step-color) 15%, transparent);
        box-shadow: 0 4px 20px -2px color-mix(in srgb, var(--step-color) 3%, transparent);
      }

      .pipe-step--done {
        background: color-mix(in srgb, var(--step-color) 4%, rgba(255, 255, 255, 0.002));
        border-color: color-mix(in srgb, var(--step-color) 20%, transparent);
      }

      .pipe-icon-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-shrink: 0;
      }

      .pipe-icon {
        width: 1.125rem;
        height: 1.125rem;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        color: var(--step-color, rgba(255, 255, 255, 0.25));
        transition: color 0.3s ease;
      }

      .pipe-svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
      }

      .pipe-svg--spin {
        animation: spin 1.2s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .pipe-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        transition: background-color 0.3s ease;
      }

      .pipe-connector {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 1.5rem;
        height: 1.625rem;
        width: 1.5px;
        background: rgba(255, 255, 255, 0.04);
        z-index: 1;
        overflow: hidden;
      }

      .pipe-connector-fill {
        width: 100%;
        height: 0%;
        background: var(--step-color);
        transition: height 0.05s linear;
      }

      .pipe-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-grow: 1;
        font-size: 0.8125rem;
        gap: 1rem;
      }

      .pipe-header-row {
        display: flex;
        align-items: center;
        gap: 0.625rem;
      }

      .pipe-label {
        font-weight: 700;
        color: rgba(250, 250, 250, 0.85);
        transition: color 0.3s ease;
      }

      .pipe-step:not(.pipe-step--running):not(.pipe-step--done) .pipe-label {
        color: rgba(255, 255, 255, 0.25);
      }

      .pipe-detail {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.35);
        font-weight: 400;
      }

      .pipe-step:not(.pipe-step--running):not(.pipe-step--done) .pipe-detail {
        color: rgba(255, 255, 255, 0.15);
      }

      .pipe-ms {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.35);
        font-variant-numeric: tabular-nums;
      }

      .pipe-step--running .pipe-ms,
      .pipe-step--done .pipe-ms {
        color: var(--step-color);
        font-weight: 600;
      }

      .pipe-track {
        width: 48px;
        height: 2px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 999px;
        overflow: hidden;
        flex-shrink: 0;
      }

      .pipe-fill {
        height: 100%;
        background: var(--step-color);
        border-radius: 999px;
        width: 0%;
        transition: width 0.05s linear;
      }

      .progress-section {
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
        margin-top: 0.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.04);
        padding-top: 1.25rem;
      }

      .progress-track {
        width: 100%;
        height: 3px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 999px;
        overflow: hidden;
        position: relative;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, color-mix(in srgb, #10b981 30%, transparent), #10b981);
        border-radius: 999px;
        width: 0%;
        transition: width 0.1s ease-out;
        box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
      }

      .meta-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.35);
      }

      .meta-ready {
        color: #10b981;
        font-weight: 600;
        letter-spacing: 0.02em;
      }

      .meta-running {
        color: rgba(255, 255, 255, 0.4);
        font-weight: 500;
        animation: pulse-text 2s ease-in-out infinite;
      }

      @keyframes pulse-text {
        0%,
        100% {
          opacity: 0.6;
        }
        50% {
          opacity: 1;
        }
      }

      .meta-pct {
        color: #10b981;
        font-weight: 700;
      }
    `,
  ],
})
export class LoadingScreenComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);

  @ViewChild('curtainLeft') curtainLeftRef!: ElementRef<HTMLDivElement>;
  @ViewChild('curtainRight') curtainRightRef!: ElementRef<HTMLDivElement>;
  @ViewChild('stage') stageRef!: ElementRef<HTMLDivElement>;
  @ViewChild('terminalWindow') terminalWindowRef!: ElementRef<HTMLDivElement>;
  @ViewChild('identity') identityRef!: ElementRef<HTMLDivElement>;
  @ViewChild('eyebrow') eyebrowRef!: ElementRef<HTMLDivElement>;
  @ViewChild('nameDisplay') nameRef!: ElementRef<HTMLSpanElement>;
  @ViewChild('domainDisplay') domainRef!: ElementRef<HTMLSpanElement>;
  @ViewChild('cursor') cursorRef!: ElementRef<HTMLSpanElement>;
  @ViewChild('roleText') roleRef!: ElementRef<HTMLParagraphElement>;
  @ViewChild('statusBar') statusBarRef!: ElementRef<HTMLDivElement>;

  steps = signal<PipelineStep[]>([...PIPELINE.map((s) => ({ ...s }))]);
  totalProgress = signal(0);
  isComplete = signal(false);
  totalDuration = signal(0);
  isLoading = signal(true);
  isDone = signal(false);

  loadingComplete = output<void>();

  private timers: ReturnType<typeof setTimeout>[] = [];
  private activeIntervals: ReturnType<typeof setInterval>[] = [];
  private reducedMotion = false;

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hasVisited = !isDevMode() && sessionStorage.getItem('portfolio_visited');
    if (hasVisited) {
      this.fastExit();
      return;
    }
    if (!isDevMode()) sessionStorage.setItem('portfolio_visited', '1');

    this.runSequence();
  }

  ngOnDestroy() {
    this.timers.forEach(clearTimeout);
    this.activeIntervals.forEach(clearInterval);
    gsap.killTweensOf('*');
  }

  stepBarWidth(step: PipelineStep): string {
    if (step.state === 'done') return '100%';
    if (step.state === 'running') {
      const pct = Math.min((step.liveMs / step.ms) * 100, 100);
      return pct + '%';
    }
    return '0%';
  }

  stepConnectorHeight(step: PipelineStep): string {
    if (step.state === 'done') return '100%';
    if (step.state === 'running') {
      const pct = Math.min((step.liveMs / step.ms) * 100, 100);
      return pct + '%';
    }
    return '0%';
  }

  private fastExit() {
    this.ngZone.run(() => {
      this.isLoading.set(false);
      this.isDone.set(true);
      this.loadingComplete.emit();
    });
  }

  private runSequence() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const rm = this.reducedMotion;

    if (rm) {
      gsap.set(this.terminalWindowRef.nativeElement, { opacity: 1 });
      gsap.set(this.statusBarRef.nativeElement, { opacity: 1 });
      this.typewriterName();
      this.runPipeline();
      return;
    }

    tl.fromTo(
      this.terminalWindowRef.nativeElement,
      { opacity: 0, scale: 0.96, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power4.out' },
      0.1,
    )
      .fromTo(
        this.eyebrowRef.nativeElement,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.45 },
        0.4,
      )
      .call(() => this.typewriterName(), [], 0.65)
      .fromTo(
        this.statusBarRef.nativeElement,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        1.0,
      )
      .call(() => this.runPipeline(), [], 1.3);
  }

  private typewriterName() {
    const rm = this.reducedMotion;
    const nameEl = this.nameRef.nativeElement;
    const domainEl = this.domainRef.nativeElement;
    const roleEl = this.roleRef.nativeElement;

    if (rm) {
      nameEl.textContent = 'migattedev';
      domainEl.textContent = '.me';
      gsap.set(domainEl, { opacity: 1 });
      gsap.set(roleEl, { opacity: 1 });
      return;
    }

    const charDelay = 55;

    NAME_CHARS.forEach((char, i) => {
      const t = this.delay(() => {
        nameEl.textContent += char;
      }, i * charDelay);
      this.timers.push(t);
    });

    const afterName = NAME_CHARS.length * charDelay + 80;

    this.timers.push(
      this.delay(() => {
        gsap.set(domainEl, { opacity: 1 });
        DOMAIN_CHARS.forEach((char, i) => {
          const t = this.delay(() => {
            domainEl.textContent += char;
          }, i * charDelay);
          this.timers.push(t);
        });
      }, afterName),
    );

    const afterDomain = afterName + DOMAIN_CHARS.length * charDelay + 120;
    this.timers.push(
      this.delay(() => {
        gsap.to(roleEl, { opacity: 1, duration: 0.45, ease: 'power2.out' });
      }, afterDomain),
    );
  }

  private runPipeline() {
    const rm = this.reducedMotion;
    let delay = 0;
    let accMs = 0;

    PIPELINE.forEach((_, idx) => {
      const { runDuration, ms } = PIPELINE[idx];
      const actualRun = rm ? 0 : runDuration;

      this.timers.push(
        this.delay(() => {
          this.ngZone.run(() => {
            this.steps.update((steps) =>
              steps.map((s, i) => (i === idx ? { ...s, state: 'running', liveMs: 0 } : s)),
            );
          });

          if (!rm) {
            const startAt = Date.now();
            const intervalId = setInterval(() => {
              const elapsed = Date.now() - startAt;
              const pct = Math.min(elapsed / actualRun, 1);
              const current = Math.round(pct * ms);

              this.ngZone.run(() => {
                this.steps.update((steps) =>
                  steps.map((s, i) => (i === idx ? { ...s, liveMs: current } : s)),
                );
              });

              if (pct >= 1) {
                clearInterval(intervalId);
              }
            }, 16);
            this.activeIntervals.push(intervalId);
          }
        }, delay),
      );

      delay += actualRun;
      accMs += ms;

      const doneAt = delay;
      this.timers.push(
        this.delay(() => {
          this.ngZone.run(() => {
            this.steps.update((steps) =>
              steps.map((s, i) => (i === idx ? { ...s, state: 'done', liveMs: ms } : s)),
            );
          });

          const targetPct = Math.round(((idx + 1) / PIPELINE.length) * 100);
          if (rm) {
            this.ngZone.run(() => this.totalProgress.set(targetPct));
          } else {
            const obj = { val: this.totalProgress() };
            gsap.to(obj, {
              val: targetPct,
              duration: 0.45,
              ease: 'power1.out',
              onUpdate: () => this.ngZone.run(() => this.totalProgress.set(Math.round(obj.val))),
            });
          }

          if (idx === PIPELINE.length - 1) {
            this.timers.push(
              this.delay(
                () => {
                  this.ngZone.run(() => {
                    this.isComplete.set(true);
                    this.totalDuration.set(accMs);
                  });
                  this.timers.push(this.delay(() => this.curtainExit(), rm ? 300 : 900));
                },
                rm ? 50 : 350,
              ),
            );
          }
        }, doneAt + 20),
      );

      delay += 55;
    });
  }

  private curtainExit() {
    const rm = this.reducedMotion;

    if (rm) {
      gsap.to(
        [
          this.curtainLeftRef.nativeElement,
          this.curtainRightRef.nativeElement,
          this.stageRef.nativeElement,
        ],
        {
          opacity: 0,
          duration: 0.3,
          onComplete: () =>
            this.ngZone.run(() => {
              this.isLoading.set(false);
              this.isDone.set(true);
              this.loadingComplete.emit();
            }),
        },
      );
      return;
    }

    const tl = gsap.timeline({
      onComplete: () =>
        this.ngZone.run(() => {
          this.isLoading.set(false);
          this.loadingComplete.emit();
          this.isDone.set(true);
        }),
    });

    tl.to(this.terminalWindowRef.nativeElement, {
      scale: 0.95,
      y: 10,
      opacity: 0,
      duration: 0.45,
      ease: 'back.in(1.4)',
    })
      .to(
        this.curtainLeftRef.nativeElement,
        {
          xPercent: -100,
          duration: 0.85,
          ease: 'expo.inOut',
        },
        0.25,
      )
      .to(
        this.curtainRightRef.nativeElement,
        {
          xPercent: 100,
          duration: 0.85,
          ease: 'expo.inOut',
        },
        0.25,
      );
  }

  private delay(fn: () => void, ms: number): ReturnType<typeof setTimeout> {
    return setTimeout(fn, ms);
  }
}
