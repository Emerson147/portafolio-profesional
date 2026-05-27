import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
}

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      id="testimonials"
      class="py-32 relative overflow-hidden bg-transparent"
    >
      <!-- Subtle ambient glow (Zen Spotlight) -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"
      ></div>

      <div class="max-w-5xl mx-auto px-6 relative z-10">
        <!-- Single Featured Testimonial Layout -->
        <div class="flex flex-col items-center text-center testimonial-reveal">
          
          <!-- Large Decorative Quote Mark -->
          <div class="text-6xl md:text-8xl font-serif text-emerald-500/20 dark:text-emerald-500/10 leading-none mb-4 select-none">
            "
          </div>

          <!-- Rotating Quote -->
          <div class="relative min-h-[180px] md:min-h-[140px] w-full flex items-center justify-center">
            @for (item of testimonials; track item.author; let i = $index) {
              <div 
                class="absolute w-full transition-all duration-1000 ease-in-out"
                [class.opacity-100]="currentIndex() === i"
                [class.opacity-0]="currentIndex() !== i"
                [class.translate-y-0]="currentIndex() === i"
                [class.translate-y-4]="currentIndex() !== i"
                [class.pointer-events-none]="currentIndex() !== i"
              >
                <p
                  class="text-2xl md:text-4xl font-light text-stone-800 dark:text-stone-100 leading-tight md:leading-tight mb-10 max-w-4xl mx-auto"
                >
                  {{ item.quote }}
                </p>

                <!-- Author Row -->
                <div class="flex flex-col items-center justify-center gap-1">
                  <h4 class="font-bold text-stone-900 dark:text-white tracking-wide uppercase text-sm">
                    {{ item.author }}
                  </h4>
                  <p class="text-[10px] text-stone-500 font-mono tracking-widest uppercase">
                    {{ item.role }}
                    @if (item.company) {
                      <span class="text-emerald-600 dark:text-emerald-500"> // {{ item.company }}</span>
                    }
                  </p>
                </div>
              </div>
            }
          </div>

          <!-- Manual Navigation Dots -->
          <div class="flex gap-3 mt-16">
            @for (item of testimonials; track item.author; let i = $index) {
              <button
                (click)="setTestimonial(i)"
                class="w-2 h-2 rounded-full transition-all duration-500"
                [class.bg-emerald-500]="currentIndex() === i"
                [class.w-6]="currentIndex() === i"
                [class.bg-stone-300]="currentIndex() !== i"
                [class.dark:bg-stone-700]="currentIndex() !== i"
                aria-label="Ver testimonio"
              ></button>
            }
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

      .testimonial-reveal {
        opacity: 0;
        transform: translateY(24px);
        transition:
          opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .testimonial-reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `,
  ],
})
export class TestimonialsSectionComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;
  private autoPlayInterval: any;

  currentIndex = signal(0);

  testimonials: Testimonial[] = [
    {
      quote: 'Cualquier tonto puede escribir código que una computadora entienda. Los buenos programadores escriben código que los humanos pueden entender.',
      author: 'Martin Fowler',
      role: 'Autor de "Refactoring"',
      company: 'ThoughtWorks',
    },
    {
      quote: 'El código limpio siempre parece que fue escrito por alguien a quien le importa. No hay nada obvio que puedas hacer para mejorarlo.',
      author: 'Robert C. Martin',
      role: 'Autor de "Clean Code"',
      company: 'Uncle Bob',
    },
    {
      quote: 'Haz que funcione, haz que sea correcto, haz que sea rápido. En ese orden estricto.',
      author: 'Kent Beck',
      role: 'Creador de TDD',
      company: 'Extreme Programming',
    },
    {
      quote: 'El código limpio es simple y directo. El código limpio se lee como prosa bien escrita. Nunca oscurece la intención del diseñador.',
      author: 'Grady Booch',
      role: 'Co-creador de UML',
      company: 'IBM',
    },
    {
      quote: 'Hablar es barato. Muéstrame el código.',
      author: 'Linus Torvalds',
      role: 'Creador de Linux y Git',
      company: 'Linux Foundation',
    },
  ];

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.setupObserver();
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.stopAutoPlay();
  }

  setTestimonial(index: number) {
    this.currentIndex.set(index);
    this.resetAutoPlay();
  }

  private startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.currentIndex.update(i => (i + 1) % this.testimonials.length);
    }, 7000); // Rotates every 7 seconds
  }

  private stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  private resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  private setupObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          this.observer?.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' },
    );

    requestAnimationFrame(() => {
      const el = document.querySelector('#testimonials .testimonial-reveal');
      if (el) this.observer?.observe(el);
    });
  }
}
