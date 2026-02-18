import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
      class="py-24 relative overflow-hidden bg-stone-50 dark:bg-stone-900 transition-colors duration-500"
      id="testimonials"
    >
      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <!-- Section Header -->
        <div class="text-center mb-16 md:mb-24">
          <span class="text-emerald-600 font-mono text-sm tracking-widest uppercase mb-4 block">
            // Social Proof
          </span>
          <h2 class="text-3xl md:text-4xl font-bold text-stone-900 mb-6 tracking-tight">
            Confianza <span class="text-emerald-600">Digital</span>
          </h2>
          <p class="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Historias de colaboración y resultados tangibles.
          </p>
        </div>

        <!-- Testimonials Grid -->
        <div class="grid md:grid-cols-3 gap-8">
          <div
            *ngFor="let item of testimonials"
            #card
            (mousemove)="onMouseMove($event, card)"
            (mouseleave)="onMouseLeave(card)"
            class="gs-reveal-card bg-white p-8 rounded-2xl shadow-sm border border-stone-100 relative group hover:-translate-y-1 transition-transform duration-300"
          >
            <!-- Quote Icon -->
            <div
              class="absolute top-8 right-8 text-4xl text-emerald-100 font-serif leading-none group-hover:text-emerald-200 transition-colors"
            >
              "
            </div>

            <p class="text-stone-600 leading-relaxed mb-8 relative z-10 min-h-[80px]">
              {{ item.quote }}
            </p>

            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm"
              >
                {{ item.author.charAt(0) }}
              </div>
              <div>
                <h4 class="font-bold text-stone-900 text-sm">{{ item.author }}</h4>
                <p class="text-xs text-stone-500 font-mono">
                  {{ item.role }}
                  @if (item.company) {
                    <span class="text-emerald-600">@ {{ item.company }}</span>
                  }
                </p>
              </div>
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
    `,
  ],
})
export class TestimonialsSectionComponent {
  testimonials: Testimonial[] = [
    {
      quote:
        'La capacidad de Emerson para traducir conceptos abstractos en interfaces funcionales y hermosas es impresionante. Un verdadero ingeniero de software.',
      author: 'Carlos R.',
      role: 'Product Owner',
      company: 'TechFlow',
    },
    {
      quote:
        'No solo entrega código limpio, sino que aporta ideas arquitectónicas que mejoran el rendimiento y la escalabilidad del proyecto.',
      author: 'Sofia M.',
      role: 'CTO',
      company: 'StartUp Inc',
    },
    {
      quote:
        'Su enfoque Zen se nota en cada entrega: precisión, calma bajo presión y una ejecución impecable. Altamente recomendado.',
      author: 'Javier L.',
      role: 'Senior Dev',
    },
  ];

  onMouseMove(event: MouseEvent, card: HTMLElement) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate rotation based on cursor position
    const xPct = (x / rect.width - 0.5) * 20;
    const yPct = (y / rect.height - 0.5) * 20;

    // Apply the user's custom transition style directly
    card.style.willChange = 'transform';
    card.style.transition = 'transform 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)';

    // Apply the transform
    card.style.transform = `perspective(1000px) rotateX(${-yPct}deg) rotateY(${xPct}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  onMouseLeave(card: HTMLElement) {
    card.style.transition = 'transform 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }
}
