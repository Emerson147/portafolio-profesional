import { Component, inject, signal, AfterViewInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContactService } from '../../../core/services/contact.service';
import { TranslateService } from '../../../core/services/translate.service';
import { ICONS } from '../../../core/data/icons.data';
import { IconComponent } from '../../atoms/icon/icon.component';

interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: keyof typeof ICONS;
}

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  template: `
    <section
      id="contact-form"
      class="pt-24 pb-32 relative overflow-hidden bg-transparent"
    >
      <div class="max-w-6xl mx-auto px-6 relative z-10">
        <!-- Header -->
        <div class="mb-16 contact-reveal">
          <span
            class="text-emerald-600 dark:text-emerald-500 font-mono font-bold text-[10px] tracking-widest uppercase mb-4 block"
          >
            // Contacto
          </span>
          <h2
            class="text-3xl md:text-5xl font-bold text-stone-900 dark:text-stone-50 flex items-center gap-4 tracking-tighter"
          >
            Iniciemos un <span class="text-emerald-600 dark:text-emerald-500">Proyecto</span>
            <span class="hidden md:block flex-1 h-px bg-stone-200 dark:bg-stone-800"></span>
          </h2>
          <p class="text-stone-600 dark:text-stone-400 max-w-xl mt-6 leading-relaxed font-light">
            Estoy disponible para roles como Full Stack Engineer o consultorías técnicas. 
            Hablemos sobre arquitectura, escalabilidad y cómo construir tu próxima plataforma.
          </p>
        </div>

        <!-- 2-col layout: Info | Form -->
        <div class="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
          
          <!-- Left: Contact Info -->
          <div class="space-y-10 contact-reveal">
            
            <!-- Availability badge -->
            <div
              class="inline-flex items-center gap-4 py-3 px-5 rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 backdrop-blur-md"
            >
              <span class="relative flex h-2.5 w-2.5">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                ></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <p class="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase">
                  STATUS: DISPONIBLE
                </p>
              </div>
            </div>

            <!-- Contact links -->
            <div class="space-y-3">
              @for (link of contactLinks; track link.label) {
                <a
                  [href]="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-5 group p-5 rounded-2xl bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-xs border border-stone-200/50 dark:border-white/5 hover:border-emerald-500/30 transition-all duration-300"
                >
                  <div
                    class="w-12 h-12 rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#111] flex items-center justify-center shrink-0 text-stone-500 group-hover:text-emerald-500 group-hover:border-emerald-500/30 transition-all duration-300"
                  >
                    <app-icon [name]="link.icon" [size]="20" />
                  </div>
                  <div>
                    <p
                      class="text-[10px] font-mono text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1"
                    >
                      {{ link.label }}
                    </p>
                    <p
                      class="text-sm font-bold text-stone-800 dark:text-stone-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                    >
                      {{ link.value }}
                    </p>
                  </div>
                </a>
              }
            </div>

            <!-- Location -->
            <p class="text-[10px] font-mono text-stone-400 dark:text-stone-500 flex items-center gap-2 uppercase tracking-widest pt-4">
              <span class="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-600"></span>
              Huancayo, Perú · GMT-5
            </p>
          </div>

          <!-- Right: Form -->
          <div
            class="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-stone-200/50 dark:border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl shadow-stone-200/20 dark:shadow-black/50 relative overflow-hidden contact-reveal"
          >
            <!-- Form Content starts directly -->

            @if (submitStatus() === 'success') {
              <!-- Success state -->
              <div
                class="flex flex-col items-center justify-center py-16 text-center animate-fadeIn"
              >
                <div
                  class="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6"
                >
                  <app-icon name="check" [size]="32" />
                </div>
                <h3 class="text-3xl font-bold text-stone-900 dark:text-stone-50 mb-3 tracking-tight">
                  Mensaje Enviado
                </h3>
                <p class="text-stone-500 dark:text-stone-400 mb-10 max-w-sm mx-auto font-light leading-relaxed">
                  He recibido tu mensaje correctamente. Te responderé lo más pronto posible a tu correo.
                </p>
                <button
                  (click)="resetForm()"
                  class="text-[10px] uppercase tracking-widest font-mono text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors border border-emerald-500/30 px-6 py-3 rounded-full hover:bg-emerald-500/10"
                >
                  Enviar otro mensaje
                </button>
              </div>
            } @else {
              <!-- Form -->
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-6">
                
                <div class="grid md:grid-cols-2 gap-6">
                  <!-- Name -->
                  <div class="space-y-2">
                    <label for="name" class="text-[10px] uppercase font-mono tracking-widest text-stone-500 dark:text-stone-400 pl-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="name"
                      formControlName="name"
                      class="w-full bg-stone-50 dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3.5 text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                      placeholder="Tu nombre"
                    />
                    @if (isFieldInvalid('name')) {
                      <span class="text-red-500 dark:text-red-400 text-[10px] mt-1 block pl-1 font-mono uppercase tracking-widest">
                        Requerido
                      </span>
                    }
                  </div>

                  <!-- Email -->
                  <div class="space-y-2">
                    <label for="email" class="text-[10px] uppercase font-mono tracking-widest text-stone-500 dark:text-stone-400 pl-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      formControlName="email"
                      class="w-full bg-stone-50 dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3.5 text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                      placeholder="tucorreo@ejemplo.com"
                    />
                    @if (isFieldInvalid('email')) {
                      <span class="text-red-500 dark:text-red-400 text-[10px] mt-1 block pl-1 font-mono uppercase tracking-widest">
                        Email inválido
                      </span>
                    }
                  </div>
                </div>

                <!-- Subject -->
                <div class="space-y-2">
                  <label for="subject" class="text-[10px] uppercase font-mono tracking-widest text-stone-500 dark:text-stone-400 pl-1">
                    Asunto
                  </label>
                  <input
                    type="text"
                    id="subject"
                    formControlName="subject"
                    class="w-full bg-stone-50 dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3.5 text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                    placeholder="¿De qué trata?"
                  />
                </div>

                <!-- Message -->
                <div class="space-y-2">
                  <label for="message" class="text-[10px] uppercase font-mono tracking-widest text-stone-500 dark:text-stone-400 pl-1">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    formControlName="message"
                    rows="5"
                    class="w-full bg-stone-50 dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3.5 text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all resize-none"
                    placeholder="Cuéntame sobre tu proyecto..."
                  ></textarea>
                  @if (isFieldInvalid('message')) {
                    <span class="text-red-500 dark:text-red-400 text-[10px] mt-1 block pl-1 font-mono uppercase tracking-widest">
                      Mínimo 10 caracteres
                    </span>
                  }
                </div>

                <!-- Submit -->
                <div class="pt-4">
                  <button
                    type="submit"
                    [disabled]="contactForm.invalid || submitStatus() === 'loading'"
                    class="w-full flex items-center justify-center gap-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-8 py-4 rounded-xl font-bold tracking-wide transition-all hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    @if (submitStatus() === 'loading') {
                      <svg
                        class="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span class="text-[12px] font-mono tracking-widest uppercase">Enviando...</span>
                    } @else {
                      <span class="text-[12px] font-mono tracking-widest uppercase">Enviar Mensaje</span>
                      <app-icon name="send" [size]="16" class="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    }
                  </button>
                </div>
              </form>
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

      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .contact-reveal {
        opacity: 0;
        transform: translateY(24px);
        transition:
          opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .contact-reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `,
  ],
})
export class ContactSectionComponent implements AfterViewInit, OnDestroy {
  private fb = inject(FormBuilder);
  private contactSvc = inject(ContactService);
  private platformId = inject(PLATFORM_ID);
  i18n = inject(TranslateService);

  private observer: IntersectionObserver | null = null;

  contactLinks: ContactLink[] = [
    {
      label: 'Email Directo',
      value: 'emersontec147@gmail.com',
      href: 'mailto:emersontec147@gmail.com',
      icon: 'mail',
    },
    {
      label: 'Código Abierto',
      value: 'github.com/Emerson147',
      href: 'https://github.com/Emerson147',
      icon: 'github',
    },
    {
      label: 'Perfil Profesional',
      value: 'LinkedIn / Emerson Rafael',
      href: 'https://www.linkedin.com/in/migattedev',
      icon: 'linkedin',
    },
  ];

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  submitStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

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
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    );

    requestAnimationFrame(() => {
      document.querySelectorAll('#contact-form .contact-reveal').forEach((el, i) => {
        (el as HTMLElement).style.transitionDelay = `${i * 100}ms`;
        this.observer?.observe(el);
      });
    });
  }

  isFieldInvalid(field: string): boolean {
    const f = this.contactForm.get(field);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.submitStatus.set('loading');
      this.contactSvc.sendMessage(this.contactForm.value).subscribe({
        next: () => {
          this.submitStatus.set('success');
          this.contactForm.reset();
        },
        error: () => {
          this.submitStatus.set('idle');
          console.error('Error sending message');
        },
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.submitStatus.set('idle');
    this.contactForm.reset();
  }
}
