import { Component, inject, PLATFORM_ID, AfterViewInit, isDevMode } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';
import { CodeSnippetComponent } from '../../molecules/code-snippet/code-snippet.component';
import { GsapService } from '../../../core/services/gsap.service';
import { TranslateService } from '../../../core/services/translate.service';
import gsap from 'gsap';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CodeSnippetComponent],
  template: `
    <section
      class="relative min-h-[100svh] flex flex-col items-center justify-center px-6 overflow-hidden bg-transparent"
      (mousemove)="onMouseMove($event)"
    >
      <!-- Global ambient and grid is now handled by MainLayoutComponent -->

      <div class="z-10 flex flex-col items-center text-center max-w-4xl pt-10">
        <!-- Status Pill -->
        <div
          class="hero-pill opacity-0 mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 backdrop-blur-md shadow-sm"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span
            class="text-[11px] font-medium tracking-widest text-stone-600 dark:text-stone-400 uppercase"
            >Available for work</span
          >
        </div>

        <!-- Headline -->
        <h1
          class="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-stone-900 dark:text-white leading-[1.05] mb-6"
        >
          <div class="overflow-hidden pb-2">
            <span class="hero-line inline-block opacity-0">{{ i18n.t().hero.line1 }}</span>
          </div>
          <div class="overflow-hidden pb-2">
            <span
              class="hero-line inline-block opacity-0 text-transparent bg-clip-text bg-gradient-to-r from-stone-500 to-stone-900 dark:from-stone-300 dark:to-white"
            >
              {{ i18n.t().hero.line2 }}
            </span>
          </div>
          <div class="overflow-hidden pb-2">
            <span class="hero-line inline-block opacity-0">{{ i18n.t().hero.line3 }}</span>
          </div>
        </h1>

        <!-- Subheadline -->
        <p
          class="hero-desc opacity-0 text-lg sm:text-xl md:text-2xl text-stone-600 dark:text-stone-400 max-w-2xl mb-12 font-light leading-relaxed"
        >
          {{ i18n.t().hero.intro }}
          <strong class="font-medium text-stone-900 dark:text-white">Emerson</strong> —
          {{ i18n.t().hero.role }}
        </p>

        <!-- CTAs -->
        <div class="hero-cta opacity-0 flex flex-col sm:flex-row items-center gap-4">
          <app-button
            variant="primary"
            href="#projects"
            [showArrow]="true"
            (click)="scrollTo($event, '#projects')"
          >
            {{ i18n.t().hero.cta_projects }}
          </app-button>
          <app-button variant="secondary" href="#about" (click)="scrollTo($event, '#about')">
            {{ i18n.t().hero.cta_about }}
          </app-button>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div
        class="hero-scroll opacity-0 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hidden sm:flex"
      >
        <span class="text-[10px] tracking-widest uppercase font-mono text-stone-500">Scroll</span>
        <div class="w-px h-10 bg-stone-300 dark:bg-stone-700"></div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class HeroSectionComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private gsap = inject(GsapService);
  i18n = inject(TranslateService);

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // CRITICAL FIX: We must check isDevMode() exactly like the LoadingScreen does.
    // Otherwise, in dev mode, the loader runs fully but the hero fast-forwards.
    const hasVisited = !isDevMode() && sessionStorage.getItem('portfolio_visited') === '1';
    
    // The loading screen curtains start parting exactly at 2.6s. 
    // We start the Hero reveal exactly at 2.6s so it emerges as the curtains open.
    const startDelay = hasVisited ? 0.2 : 2.6;

    // Pre-hide elements instantly to avoid flashing before the delay finishes
    // Made the pill start higher (y: -40) so the drop is more noticeable
    gsap.set('.hero-pill', { opacity: 0, y: -40 });
    gsap.set('.hero-line', { opacity: 0, y: 100 });
    gsap.set('.hero-desc', { opacity: 0, y: 20 });
    gsap.set('.hero-cta', { opacity: 0, y: 20 });
    gsap.set('.hero-scroll', { opacity: 0 });

    const tl = gsap.timeline({ delay: startDelay, defaults: { ease: 'power3.out' } });

    // 1. Pill drops in with a subtle bounce (back.out)
    tl.to('.hero-pill', { opacity: 1, y: 0, duration: 1, ease: 'elastic.inOut(i,0.3)' })
    // 2. Title lines stagger up
      .to('.hero-line', { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'expo.out' }, '-=0.4')
    // 3. Desc fades and floats up
      .to('.hero-desc', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
    // 4. CTAs appear
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
    // 5. Scroll indicator fades in
      .to('.hero-scroll', { opacity: 0.4, duration: 1 }, '-=0.2');
  }

  onMouseMove(e: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;

    const layers = document.querySelectorAll('.parallax-layer');
    layers.forEach((layer: any) => {
      const speed = layer.getAttribute('data-speed');
      const x = (window.innerWidth - e.pageX * speed) / 100;
      const y = (window.innerHeight - e.pageY * speed) / 100;
      layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
  }

  scrollTo(event: Event, target: string) {
    event.preventDefault();
    this.gsap.scrollTo(target, 80);
  }
}

