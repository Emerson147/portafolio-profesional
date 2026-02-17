import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';
import { CodeSnippetComponent } from '../../molecules/code-snippet/code-snippet.component';
import { GsapService } from '../../../core/services/gsap.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CodeSnippetComponent],
  template: `
    <section
      class="relative min-h-screen flex items-center px-6 pt-20 pb-12 overflow-hidden"
      (mousemove)="onMouseMove($event)"
    >
      <!-- Floating Abstract Circles (Parallax) -->
      <div
        class="absolute top-20 right-[10%] w-80 md:w-[500px] h-80 md:h-[500px] bg-emerald-200/30 rounded-full blur-3xl mix-blend-multiply parallax-layer"
        data-speed="0.05"
      ></div>
      <div
        class="absolute bottom-20 left-[5%] w-60 md:w-[400px] h-60 md:h-[400px] bg-teal-200/40 rounded-full blur-3xl mix-blend-multiply parallax-layer"
        data-speed="-0.03"
      ></div>

      <div
        class="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10"
      >
        <!-- Text Content -->
        <div class="lg:col-span-7 space-y-6 md:space-y-8 hero-text-container">
          <div class="inline-block overflow-hidden">
            <div
              class="hero-reveal text-emerald-600 font-mono font-bold text-xs md:text-sm tracking-widest uppercase mb-2 flex items-center gap-2"
            >
              <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              // Systems Engineering Student
            </div>
          </div>

          <h1 class="text-fluid-h1 font-bold text-stone-900 leading-[0.95] tracking-tight">
            <div class="overflow-hidden">
              <span class="hero-reveal inline-block origin-bottom-left">Cultivando</span>
            </div>
            <div class="overflow-hidden">
              <span
                class="hero-reveal inline-block origin-bottom-left text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-500"
                >Soluciones</span
              >
            </div>
            <div class="overflow-hidden">
              <span class="hero-reveal inline-block origin-bottom-left">Escalables.</span>
            </div>
          </h1>

          <!-- Simple intro line instead of paragraph -->
          <p class="text-lg md:text-xl text-stone-500 hero-desc opacity-0 transform translate-y-4">
            Hola, soy <strong class="text-stone-900">Emerson</strong> — Full Stack Developer
          </p>

          <div
            class="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4 hero-cta opacity-0 transform translate-y-4"
          >
            <app-button
              variant="primary"
              href="#projects"
              [showArrow]="true"
              (click)="scrollTo($event, '#projects')"
            >
              Ver Proyectos
            </app-button>
            <app-button variant="secondary" href="#about" (click)="scrollTo($event, '#about')">
              Sobre Mí
            </app-button>
          </div>

          <!-- Mobile Tech Stack Pills -->
          <div class="flex flex-wrap gap-2 pt-4 md:hidden">
            <span class="text-xs bg-slate-900 text-emerald-400 px-3 py-1.5 rounded-full font-mono"
              >Java</span
            >
            <span class="text-xs bg-slate-900 text-blue-400 px-3 py-1.5 rounded-full font-mono"
              >Spring Boot</span
            >
            <span class="text-xs bg-slate-900 text-red-400 px-3 py-1.5 rounded-full font-mono"
              >Angular</span
            >
            <span class="text-xs bg-slate-900 text-cyan-400 px-3 py-1.5 rounded-full font-mono"
              >Docker</span
            >
          </div>
        </div>

        <!-- Visual Content (Code Card) - Desktop -->
        <div class="lg:col-span-5 relative perspective-container hidden md:block">
          <app-code-snippet />
          <!-- Decorative Elements -->
          <div
            class="absolute -inset-4 bg-linear-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl -z-10 blur-xl"
          ></div>
          <div
            class="absolute inset-0 bg-slate-900/5 transform translate-x-6 translate-y-6 rounded-2xl -z-20"
          ></div>
        </div>

        <!-- Mobile Code Preview Card -->
        <div class="md:hidden mt-6">
          <div class="bg-slate-900 rounded-xl p-4 border border-slate-700 shadow-lg">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
              <div class="flex gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              <span class="text-slate-400 text-xs ml-2">MigatteProfile.java</span>
            </div>
            <div class="font-mono text-xs leading-relaxed">
              <div class="text-yellow-500">&#64;Service</div>
              <div>
                <span class="text-purple-400">public class</span>
                <span class="text-yellow-300">MigatteProfile</span> {{ '{' }}
              </div>
              <div class="pl-4 text-emerald-400">String role = "Full Stack Dev";</div>
              <div class="pl-4 text-slate-500">// Java · Angular · Docker</div>
              <div class="text-slate-400">{{ '}' }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .perspective-container {
        perspective: 1000px;
      }
    `,
  ],
})
export class HeroSectionComponent {
  private platformId = inject(PLATFORM_ID);
  private gsap = inject(GsapService);

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
