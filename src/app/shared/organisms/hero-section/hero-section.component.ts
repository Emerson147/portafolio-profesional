import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';
import { CodeSnippetComponent } from '../../molecules/code-snippet/code-snippet.component';
import { GsapService } from '../../../core/services/gsap.service';
import { TranslateService } from '../../../core/services/translate.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CodeSnippetComponent],
  template: `
    <section
      class="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-white dark:bg-[#050505] transition-colors duration-500"
      (mousemove)="onMouseMove($event)"
    >
      <!-- Spotlight Orbs (Ambient glow) -->
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-stone-50/0 to-stone-50/0 dark:from-cyan-500/20 dark:via-[#050505]/0 dark:to-[#050505]/0 -z-10 pointer-events-none parallax-layer"
        data-speed="0.02"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none parallax-layer"
        data-speed="-0.01"
      ></div>

      <!-- Background Grid (Very subtle) -->
      <div
        class="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none"
        style="background-image: linear-gradient(rgba(0, 0, 0, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 1) 1px, transparent 1px); background-size: 64px 64px;"
      ></div>

      <div class="z-10 flex flex-col items-center text-center max-w-4xl pt-10">
        <!-- Status Pill -->
        <div
          class="hero-reveal mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 backdrop-blur-md shadow-sm"
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
            <span class="hero-reveal inline-block">{{ i18n.t().hero.line1 }}</span>
          </div>
          <div class="overflow-hidden pb-2">
            <span
              class="hero-reveal inline-block text-transparent bg-clip-text bg-linear-to-r from-stone-500 to-stone-900 dark:from-stone-300 dark:to-white"
            >
              {{ i18n.t().hero.line2 }}
            </span>
          </div>
          <div class="overflow-hidden pb-2">
            <span class="hero-reveal inline-block">{{ i18n.t().hero.line3 }}</span>
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
        class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounce hidden sm:flex"
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
export class HeroSectionComponent {
  private platformId = inject(PLATFORM_ID);
  private gsap = inject(GsapService);
  i18n = inject(TranslateService);

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
