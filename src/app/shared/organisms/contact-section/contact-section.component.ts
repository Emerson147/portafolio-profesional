import { Component, inject, signal, AfterViewInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContactService } from '../../../core/services/contact.service';
import { TranslateService } from '../../../core/services/translate.service';
import { ICONS } from '../../../core/data/icons.data';

interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: keyof typeof ICONS;
  accent: string;
}

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section
      id="contact-form"
      class="pt-24 pb-12 relative overflow-hidden bg-white dark:bg-stone-950 transition-colors duration-500 -mb-px"
    >
      <!-- Blueprint grid - light -->
      <div
        class="absolute inset-0 opacity-[0.03] dark:opacity-0 pointer-events-none"
        style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 40px 40px;"
      ></div>
      <!-- Blueprint grid - dark -->
      <div
        class="absolute inset-0 opacity-0 dark:opacity-[0.04] pointer-events-none"
        style="background-image: linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px); background-size: 40px 40px;"
      ></div>

      <div class="max-w-6xl mx-auto px-6 relative z-10">
        <!-- Header — consistent left-aligned -->
        <div class="mb-14 contact-reveal">
          <span
            class="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs tracking-widest uppercase mb-3 block"
          >
            // Get In Touch
          </span>
          <h2
            class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 flex items-center gap-4 tracking-tight"
          >
            {{ i18n.t().contact.title }}
            <span class="hidden md:block flex-1 h-px bg-stone-200 dark:bg-stone-700"></span>
          </h2>
          <p class="text-stone-500 dark:text-stone-400 max-w-xl mt-4 leading-relaxed">
            {{ i18n.t().contact.subtitle }}
          </p>
        </div>

        <!-- 2-col layout: Info | Form -->
        <div class="grid md:grid-cols-[1fr_1.6fr] gap-10 lg:gap-16 items-start">
          <!-- Left: Contact Info -->
          <div class="space-y-8 contact-reveal">
            <!-- Contact links -->
            <div class="space-y-4">
              @for (link of contactLinks; track link.label) {
                <a
                  [href]="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-4 group p-4 rounded-xl border border-stone-100 dark:border-stone-800 hover:border-opacity-0 transition-all duration-300"
                  [style]="'--lnk:' + link.accent"
                >
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300"
                    [style.background]="link.accent + '15'"
                  >
                    <span
                      class="w-5 h-5 transition-colors"
                      [style.color]="link.accent"
                      [innerHTML]="getIcon(link.icon)"
                    ></span>
                  </div>
                  <div>
                    <p
                      class="text-xs font-mono text-stone-400 dark:text-stone-500 uppercase tracking-wide"
                    >
                      {{ link.label }}
                    </p>
                    <p
                      class="text-sm font-medium text-stone-700 dark:text-stone-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                    >
                      {{ link.value }}
                    </p>
                  </div>
                </a>
              }
            </div>

            <!-- Availability badge -->
            <div
              class="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50"
            >
              <span class="relative flex h-2.5 w-2.5">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                ></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <p class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  STATUS: DISPONIBLE
                </p>
                <p class="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Abierto a oportunidades remotas
                </p>
              </div>
            </div>

            <!-- Location -->
            <p class="text-xs font-mono text-stone-400 dark:text-stone-600 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-600"></span>
              Huancayo, Perú · GMT-5
            </p>
          </div>

          <!-- Right: Form -->
          <div
            class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl p-8 shadow-sm relative overflow-hidden contact-reveal"
          >
            <!-- Top accent bar -->
            <div
              class="absolute top-0 left-0 w-full h-px bg-linear-to-r from-emerald-400 via-teal-500 to-cyan-500"
            ></div>

            @if (submitStatus() === 'success') {
              <!-- Success state -->
              <div
                class="flex flex-col items-center justify-center py-12 text-center animate-fadeIn"
              >
                <div
                  class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-2">
                  {{ i18n.t().contact.success_title }}
                </h3>
                <p class="text-stone-500 dark:text-stone-400 mb-8">
                  {{ i18n.t().contact.success_body }}
                </p>
                <button
                  (click)="resetForm()"
                  class="text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  {{ i18n.t().contact.success_again }}
                </button>
              </div>
            } @else {
              <!-- Form -->
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-7">
                <!-- Name & Email -->
                <div class="grid md:grid-cols-2 gap-7">
                  <!-- Name -->
                  <div class="group relative">
                    <input
                      type="text"
                      id="name"
                      formControlName="name"
                      class="peer w-full bg-transparent border-b-2 border-stone-200 dark:border-stone-700 py-3 pt-6 text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors placeholder-transparent"
                      [placeholder]="i18n.t().contact.name_placeholder"
                    />
                    <label
                      for="name"
                      class="absolute left-0 top-0 text-stone-500 dark:text-stone-500 text-xs uppercase font-bold tracking-wider transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-400 peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-emerald-600 dark:peer-focus:text-emerald-400"
                    >
                      {{ i18n.t().contact.name_label }}
                    </label>
                    @if (isFieldInvalid('name')) {
                      <span class="text-red-500 dark:text-red-400 text-xs mt-1 block">{{
                        i18n.t().contact.error_name
                      }}</span>
                    }
                  </div>

                  <!-- Email -->
                  <div class="group relative">
                    <input
                      type="email"
                      id="email"
                      formControlName="email"
                      class="peer w-full bg-transparent border-b-2 border-stone-200 dark:border-stone-700 py-3 pt-6 text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors placeholder-transparent"
                      [placeholder]="i18n.t().contact.email_placeholder"
                    />
                    <label
                      for="email"
                      class="absolute left-0 top-0 text-stone-500 dark:text-stone-500 text-xs uppercase font-bold tracking-wider transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-400 peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-emerald-600 dark:peer-focus:text-emerald-400"
                    >
                      {{ i18n.t().contact.email_label }}
                    </label>
                    @if (isFieldInvalid('email')) {
                      <span class="text-red-500 dark:text-red-400 text-xs mt-1 block">{{
                        i18n.t().contact.error_email
                      }}</span>
                    }
                  </div>
                </div>

                <!-- Subject -->
                <div class="group relative">
                  <input
                    type="text"
                    id="subject"
                    formControlName="subject"
                    class="peer w-full bg-transparent border-b-2 border-stone-200 dark:border-stone-700 py-3 pt-6 text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors placeholder-transparent"
                    [placeholder]="i18n.t().contact.subject_placeholder"
                  />
                  <label
                    for="subject"
                    class="absolute left-0 top-0 text-stone-500 dark:text-stone-500 text-xs uppercase font-bold tracking-wider transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-400 peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-emerald-600 dark:peer-focus:text-emerald-400"
                  >
                    {{ i18n.t().contact.subject_label }}
                  </label>
                </div>

                <!-- Message -->
                <div class="group relative">
                  <textarea
                    id="message"
                    formControlName="message"
                    rows="4"
                    class="peer w-full bg-transparent border-b-2 border-stone-200 dark:border-stone-700 py-3 pt-6 text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors placeholder-transparent resize-none"
                    [placeholder]="i18n.t().contact.message_placeholder"
                  ></textarea>
                  <label
                    for="message"
                    class="absolute left-0 top-0 text-stone-500 dark:text-stone-500 text-xs uppercase font-bold tracking-wider transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-stone-400 peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-emerald-600 dark:peer-focus:text-emerald-400"
                  >
                    {{ i18n.t().contact.message_label }}
                  </label>
                  @if (isFieldInvalid('message')) {
                    <span class="text-red-500 dark:text-red-400 text-xs mt-1 block">{{
                      i18n.t().contact.error_message
                    }}</span>
                  }
                </div>

                <!-- Submit -->
                <div class="pt-2 flex justify-end">
                  <button
                    type="submit"
                    [disabled]="contactForm.invalid || submitStatus() === 'loading'"
                    class="relative overflow-hidden group bg-stone-900 dark:bg-stone-800 text-white px-8 py-3.5 rounded-lg font-bold tracking-wide transition-all hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    <span class="relative z-10 flex items-center gap-2">
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
                        ENVIANDO...
                      } @else {
                        {{ i18n.t().contact.submit }}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      }
                    </span>
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
        transform: translateY(18px);
        transition:
          opacity 0.6s ease,
          transform 0.6s ease;
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
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);
  i18n = inject(TranslateService);

  private observer: IntersectionObserver | null = null;

  contactLinks: ContactLink[] = [
    {
      label: 'Email',
      value: 'emersontec147@gmail.com',
      href: 'mailto:emersontec147@gmail.com',
      icon: 'mail',
      accent: '#10b981',
    },
    {
      label: 'GitHub',
      value: 'github.com/Emerson147',
      href: 'https://github.com/Emerson147',
      icon: 'github',
      accent: '#6366f1',
    },
    {
      label: 'LinkedIn',
      value: 'emerson-quijada-rafael',
      href: 'https://linkedin.com/in/emerson-quijada-rafael',
      icon: 'linkedin',
      accent: '#0ea5e9',
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
        (el as HTMLElement).style.transitionDelay = `${i * 120}ms`;
        this.observer?.observe(el);
      });
    });
  }

  getIcon(name: keyof typeof ICONS): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[name] ?? '');
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
