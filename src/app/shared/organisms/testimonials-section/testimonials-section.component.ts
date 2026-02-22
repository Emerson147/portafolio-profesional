import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar: string; // initials
}

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      id="testimonials"
      #sectionEl
      class="py-24 relative overflow-hidden bg-stone-50 dark:bg-stone-900 transition-colors duration-500"
    >
      <!-- Subtle ambient glow -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-400/4 rounded-full blur-3xl pointer-events-none"
      ></div>

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <!-- Header — left-aligned (consistent with other sections) -->
        <div class="mb-14 testimonial-reveal">
          <span
            class="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs tracking-widest uppercase mb-3 block"
          >
            // Social Proof
          </span>
          <h2
            class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 flex items-center gap-4 tracking-tight"
          >
            Confianza <span class="text-emerald-600 dark:text-emerald-400">Digital</span>
            <span class="hidden md:block flex-1 h-px bg-stone-200 dark:bg-stone-700"></span>
          </h2>
          <p class="text-stone-600 dark:text-stone-400 max-w-2xl mt-4 leading-relaxed">
            Historias de colaboración y resultados tangibles.
          </p>
        </div>

        <!-- Testimonials grid -->
        <div class="grid md:grid-cols-3 gap-6">
          @for (item of testimonials; track item.author; let i = $index) {
            <div
              class="testimonial-card group bg-white dark:bg-stone-800 p-7 rounded-2xl border border-stone-100 dark:border-stone-700 relative cursor-default"
              [style.transition-delay.ms]="i * 100"
              (mousemove)="onTilt($event, $event.currentTarget)"
              (mouseleave)="onTiltReset($event.currentTarget)"
            >
              <!-- Decorative quote mark -->
              <div
                class="absolute top-6 right-7 text-5xl leading-none font-serif select-none
                          text-emerald-100 dark:text-emerald-900
                          group-hover:text-emerald-200 dark:group-hover:text-emerald-800
                          transition-colors duration-300"
              >
                "
              </div>

              <!-- Quote text -->
              <p
                class="text-stone-600 dark:text-stone-300 leading-relaxed mb-7 relative z-10 text-sm md:text-base"
              >
                {{ item.quote }}
              </p>

              <!-- Author row -->
              <div class="flex items-center gap-3">
                <!-- Avatar with initials -->
                <div
                  class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm shrink-0 select-none"
                >
                  {{ item.avatar }}
                </div>
                <div>
                  <h4 class="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {{ item.author }}
                  </h4>
                  <p class="text-xs text-stone-400 dark:text-stone-500 font-mono">
                    {{ item.role }}
                    @if (item.company) {
                      <span class="text-emerald-600 dark:text-emerald-400">
                        @ {{ item.company }}</span
                      >
                    }
                  </p>
                </div>
              </div>

              <!-- Bottom accent line on hover -->
              <div
                class="absolute bottom-0 left-0 w-0 h-px bg-emerald-400 group-hover:w-full transition-all duration-500 rounded-b-2xl"
              ></div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* Scroll reveal */
      .testimonial-reveal {
        opacity: 0;
        transform: translateY(16px);
        transition:
          opacity 0.6s ease,
          transform 0.6s ease;
      }
      .testimonial-reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* Card stagger */
      .testimonial-card {
        opacity: 0;
        transform: translateY(16px);
        transition:
          opacity 0.55s ease-out,
          transform 0.55s ease-out,
          border-color 0.3s ease,
          box-shadow 0.3s ease;
      }
      .testimonial-card.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .testimonial-card:hover {
        border-color: rgba(16, 185, 129, 0.25);
        box-shadow: 0 8px 32px rgba(16, 185, 129, 0.06);
      }
    `,
  ],
})
export class TestimonialsSectionComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  testimonials: Testimonial[] = [
    {
      quote:
        'La capacidad de Emerson para traducir conceptos abstractos en interfaces funcionales y hermosas es impresionante. Un verdadero ingeniero de software.',
      author: 'Carlos R.',
      role: 'Product Owner',
      company: 'TechFlow',
      avatar: 'CR',
    },
    {
      quote:
        'No solo entrega código limpio, sino que aporta ideas arquitectónicas que mejoran el rendimiento y la escalabilidad del proyecto.',
      author: 'Sofía M.',
      role: 'CTO',
      company: 'StartUp Inc',
      avatar: 'SM',
    },
    {
      quote:
        'Su enfoque Zen se nota en cada entrega: precisión, calma bajo presión y una ejecución impecable. Altamente recomendado.',
      author: 'Javier L.',
      role: 'Senior Dev',
      avatar: 'JL',
    },
  ];

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.setupObserver();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );

    requestAnimationFrame(() => {
      document
        .querySelectorAll('#testimonials .testimonial-reveal, #testimonials .testimonial-card')
        .forEach((el) => this.observer?.observe(el));
    });
  }

  // Subtle 3D tilt — ±8° (Zen: less is more)
  onTilt(event: MouseEvent, target: EventTarget | null) {
    if (!target) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const card = target as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(4px)`;
    card.style.transition = 'transform 0.1s ease';
  }

  onTiltReset(target: EventTarget | null) {
    if (!target) return;
    const card = target as HTMLElement;
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    card.style.transition = 'transform 0.45s ease';
  }
}
