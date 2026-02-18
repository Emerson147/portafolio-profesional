import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Service {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-24 relative" id="services">
      <!-- Decorator Blob -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -z-10"
      ></div>

      <div class="max-w-7xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-16 md:mb-24">
          <h2 class="text-3xl md:text-4xl font-bold text-stone-900 mb-6 tracking-tight">
            Soluciones <span class="text-emerald-600">Tecnológicas</span>
          </h2>
          <p class="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Arquitectura de software a medida para potenciar tu negocio.
          </p>
        </div>

        <!-- Services Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 place-content-center">
          <div
            *ngFor="let service of services"
            class="gs-reveal-card group p-8 bg-white/50 backdrop-blur-sm border border-stone-100 rounded-2xl hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1"
          >
            <!-- Icon -->
            <div
              class="w-14 h-14 rounded-xl bg-stone-50 flex items-center justify-center text-2xl mb-6 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors duration-300"
            >
              {{ service.icon }}
            </div>

            <!-- Content -->
            <h3 class="text-xl font-bold text-stone-900 mb-3">{{ service.title }}</h3>
            <p class="text-stone-600 text-sm leading-relaxed mb-6 min-h-[80px]">
              {{ service.description }}
            </p>

            <!-- Features List -->
            <ul class="space-y-2">
              <li
                *ngFor="let feature of service.features"
                class="flex items-center gap-2 text-xs font-mono text-stone-500"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {{ feature }}
              </li>
            </ul>
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
export class ServicesSectionComponent {
  services: Service[] = [
    {
      title: 'Web Development',
      description:
        'Desde sitios web personalizados hasta plataformas complejas. Damos vida a tu visión digital.',
      icon: '💻',
      features: ['Landing Pages', 'Corporate Sites', 'SEO Optimization', 'Responsive Design'],
    },
    {
      title: 'Mobile Apps',
      description:
        'Llega a tus clientes donde estén con aplicaciones móviles nativas o híbridas de alto rendimiento.',
      icon: '📱',
      features: ['iOS & Android', 'React Native / Flutter', 'User Centric UI', 'Offline Mode'],
    },
    {
      title: 'E-commerce',
      description:
        'Construye una experiencia de compra fluida y segura. Tiendas online que convierten visitas en ventas.',
      icon: '🛍️',
      features: ['Payment Gateways', 'Inventory Management', 'User Dashboard', 'Analytics'],
    },
    {
      title: 'Custom Apps',
      description:
        'Optimiza tus operaciones comerciales con aplicaciones web a medida adaptadas a tus necesidades.',
      icon: '⚙️',
      features: ['SaaS Platforms', 'Internal Tools', 'API Integration', 'Cloud Architecture'],
    },
    {
      title: 'Motion UI & GSAP',
      description:
        'Experiencias inmersivas con animaciones de alto rendimiento que cautivan y retienen a tus usuarios.',
      icon: '✨',
      features: [
        'Scroll Animations',
        'Interactive Storytelling',
        'Micro-interactions',
        'Performance First',
      ],
    },
  ];
}
