import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-process-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-24 relative overflow-hidden" id="process">
      <!-- Background Grid -->
      <div class="absolute inset-0 zen-grid-bg opacity-30 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <!-- Section Header -->
        <div class="mb-16 md:mb-24 text-center md:text-left gs-reveal">
          <h2 class="text-3xl md:text-4xl font-bold text-stone-900 mb-6 tracking-tight">
            Metodología <span class="text-emerald-600">Zen</span>
          </h2>
          <div class="w-20 h-1 bg-emerald-500 rounded-full mb-8 mx-auto md:mx-0"></div>
          <p class="text-lg md:text-xl text-stone-600 max-w-2xl leading-relaxed">
            Un enfoque consciente donde la inspiración se encuentra con la excelencia técnica.
            Cuatro etapas para transformar lo abstracto en tangible.
          </p>
        </div>

        <!-- Process Steps Container -->
        <div class="relative">
          <!-- Central Line (Desktop) -->
          <div
            class="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-emerald-200 via-emerald-400 to-emerald-200 -translate-x-1/2"
          ></div>

          <div class="space-y-12 md:space-y-24">
            <!-- Step 1: Inspiration (Left) -->
            <div class="grid md:grid-cols-2 gap-8 items-center gs-reveal">
              <div class="relative group md:text-right">
                <div
                  class="absolute -inset-6 bg-emerald-50/50 rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                ></div>
                <div class="mb-4 flex items-center justify-end gap-4 md:flex-row-reverse">
                  <span
                    class="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 font-mono font-bold text-lg shadow-sm"
                  >
                    01
                  </span>
                  <h3 class="text-2xl font-bold text-stone-900">Inspiración y Necesidad</h3>
                </div>
                <p class="text-stone-600 leading-relaxed text-sm md:text-base">
                  Todo comienza con una chispa. Analizamos tu visión, el mercado y las necesidades
                  reales del usuario. No solo escuchamos lo que quieres, sino entendemos lo que tu
                  negocio necesita para prosperar.
                </p>
              </div>
              <div class="hidden md:block"></div>
            </div>

            <!-- Step 2: Design (Right) -->
            <div class="grid md:grid-cols-2 gap-8 items-center gs-reveal">
              <div class="hidden md:block"></div>
              <div class="relative group">
                <div
                  class="absolute -inset-6 bg-teal-50/50 rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                ></div>
                <div class="mb-4 flex items-center gap-4">
                  <span
                    class="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 font-mono font-bold text-lg shadow-sm"
                  >
                    02
                  </span>
                  <h3 class="text-2xl font-bold text-stone-900">Diseño y Prototipado</h3>
                </div>
                <p class="text-stone-600 leading-relaxed text-sm md:text-base">
                  Transformamos conceptos en bocetos tangibles. Diseñamos interfaces intuitivas (UI)
                  y experiencias de usuario (UX) que no solo se ven bien, sino que se sienten
                  naturales y eficientes.
                </p>
              </div>
            </div>

            <!-- Step 3: Development (Left) -->
            <div class="grid md:grid-cols-2 gap-8 items-center gs-reveal">
              <div class="relative group md:text-right">
                <div
                  class="absolute -inset-6 bg-cyan-50/50 rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                ></div>
                <div class="mb-4 flex items-center justify-end gap-4 md:flex-row-reverse">
                  <span
                    class="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 text-cyan-600 font-mono font-bold text-lg shadow-sm"
                  >
                    03
                  </span>
                  <h3 class="text-2xl font-bold text-stone-900">Desarrollo Zen</h3>
                </div>
                <p class="text-stone-600 leading-relaxed text-sm md:text-base">
                  Código limpio, escalable y mantenible. Construimos la arquitectura sobre cimientos
                  sólidos, usando las mejores prácticas de Angular y rendimiento web. Sin deuda
                  técnica, solo soluciones robustas.
                </p>
              </div>
              <div class="hidden md:block"></div>
            </div>

            <!-- Step 4: Scale (Right) -->
            <div class="grid md:grid-cols-2 gap-8 items-center gs-reveal">
              <div class="hidden md:block"></div>
              <div class="relative group">
                <div
                  class="absolute -inset-6 bg-indigo-50/50 rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                ></div>
                <div class="mb-4 flex items-center gap-4">
                  <span
                    class="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-mono font-bold text-lg shadow-sm"
                  >
                    04
                  </span>
                  <h3 class="text-2xl font-bold text-stone-900">Lanzamiento y Escala</h3>
                </div>
                <p class="text-stone-600 leading-relaxed text-sm md:text-base">
                  El despliegue es solo el comienzo. Optimizamos para SEO, velocidad y conversión.
                  Aseguramos que tu plataforma esté lista para crecer y evolucionar junto con tu
                  negocio.
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
export class ProcessSectionComponent {}
