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

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  host: {
    '[class.loading-done]': 'isDone()',
  },
  template: `
    @if (!isDone()) {
      <div #curtainLeft class="curtain curtain-left" aria-hidden="true"></div>
      <div #curtainRight class="curtain curtain-right" aria-hidden="true"></div>

      <div #stage class="stage" role="status" aria-label="Loading portfolio" aria-live="polite">
        <div class="brand-container">
          <div class="brand-mask">
            <h1 #brandText class="brand-text">migattedev<span class="brand-accent">.</span></h1>
          </div>
          
          <div #progressTrack class="progress-track">
            <div #progressFill class="progress-fill"></div>
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

      :host.loading-done {
        pointer-events: none;
        display: none;
      }

      .curtain {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 50%;
        background: #09090b;
        z-index: 1;
        will-change: transform;
      }

      .curtain-left {
        left: 0;
      }

      .curtain-right {
        right: 0;
      }

      .stage {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }

      .brand-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        min-width: 240px;
      }

      .brand-mask {
        overflow: hidden;
        padding-bottom: 0.25rem;
      }

      .brand-text {
        font-size: clamp(2rem, 6vw, 4rem);
        font-weight: 800;
        letter-spacing: -0.04em;
        margin: 0;
        color: #fafafa;
        font-family: var(--font-sans);
        transform: translateY(110%);
        will-change: transform, opacity, scale;
      }

      .brand-accent {
        color: #10b981;
      }

      .progress-track {
        width: 100%;
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
        position: relative;
        overflow: hidden;
        will-change: opacity;
      }

      .progress-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0%;
        background: #fafafa;
        box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
        will-change: width;
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
  @ViewChild('brandText') brandTextRef!: ElementRef<HTMLHeadingElement>;
  @ViewChild('progressTrack') progressTrackRef!: ElementRef<HTMLDivElement>;
  @ViewChild('progressFill') progressFillRef!: ElementRef<HTMLDivElement>;

  isDone = signal(false);
  loadingComplete = output<void>();

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
    gsap.killTweensOf('*');
  }

  private fastExit() {
    this.ngZone.run(() => {
      this.isDone.set(true);
      this.loadingComplete.emit();
    });
  }

  private runSequence() {
    const rm = this.reducedMotion;

    if (rm) {
      this.fastExit();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        this.ngZone.run(() => {
          this.isDone.set(true);
          this.loadingComplete.emit();
        });
      },
    });

    // 1. Text Reveal
    tl.to(this.brandTextRef.nativeElement, {
      y: '0%',
      duration: 1.2,
      ease: 'expo.out',
    })
      // 2. Progress Loading
      .to(
        this.progressFillRef.nativeElement,
        {
          width: '100%',
          duration: 1.5,
          ease: 'power2.inOut',
        },
        '-=0.6',
      )
      // 3. Text & Track Exit
      .to(
        [this.brandTextRef.nativeElement, this.progressTrackRef.nativeElement],
        {
          opacity: 0,
          scale: 0.95,
          duration: 0.6,
          ease: 'power2.inOut',
        },
        '+=0.1',
      )
      // 4. Curtains Parting
      .to(
        this.curtainLeftRef.nativeElement,
        {
          xPercent: -100,
          duration: 1.2,
          ease: 'expo.inOut',
        },
        '-=0.2',
      )
      .to(
        this.curtainRightRef.nativeElement,
        {
          xPercent: 100,
          duration: 1.2,
          ease: 'expo.inOut',
        },
        '<',
      );
  }
}

