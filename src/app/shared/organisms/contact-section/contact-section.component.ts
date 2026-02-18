import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../../core/services/contact.service';
import { TranslateService } from '../../../core/services/translate.service';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section
      id="contact-form"
      class="pt-24 pb-12 relative overflow-hidden bg-white dark:bg-stone-950 -mb-px transition-colors duration-500"
    >
      <!-- Background Pattern (Subtle Blueprint) -->
      <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none"
        style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 40px 40px;"
      ></div>

      <div class="max-w-4xl mx-auto px-6 relative z-10">
        <!-- Header -->
        <div class="text-center mb-16">
          <span class="text-emerald-600 font-mono text-sm tracking-widest uppercase mb-4 block">
            // Get In Touch
          </span>
          <h2 class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 mb-4">
            {{ i18n.t().contact.title }}
          </h2>
          <p class="text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
            {{ i18n.t().contact.subtitle }}
          </p>
        </div>

        <div
          class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden"
        >
          <!-- Decoration -->
          <div
            class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-400 via-teal-500 to-cyan-500"
          ></div>

          @if (submitStatus() === 'success') {
            <!-- Success Message -->
            <div class="flex flex-col items-center justify-center py-12 text-center animate-fadeIn">
              <div
                class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6"
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
              <h3 class="text-2xl font-bold text-stone-900 mb-2">
                {{ i18n.t().contact.success_title }}
              </h3>
              <p class="text-stone-500 mb-8">{{ i18n.t().contact.success_body }}</p>
              <button
                (click)="resetForm()"
                class="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
              >
                {{ i18n.t().contact.success_again }}
              </button>
            </div>
          } @else {
            <!-- Form -->
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-8">
              <!-- Name & Email Grid -->
              <div class="grid md:grid-cols-2 gap-8">
                <!-- Name Field -->
                <div class="group relative">
                  <input
                    type="text"
                    id="name"
                    formControlName="name"
                    class="peer w-full bg-transparent border-b-2 border-stone-200 dark:border-stone-700 py-3 text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors placeholder-transparent pt-6"
                    [placeholder]="i18n.t().contact.name_placeholder"
                  />
                  <label
                    for="name"
                    class="absolute left-0 top-0 text-stone-500 text-xs uppercase font-bold tracking-wider transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-stone-400 peer-placeholder-shown:font-normal peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-emerald-600"
                  >
                    {{ i18n.t().contact.name_label }}
                  </label>
                  @if (isFieldInvalid('name')) {
                    <span class="text-red-500 text-xs mt-1 block">{{
                      i18n.t().contact.error_name
                    }}</span>
                  }
                </div>

                <!-- Email Field -->
                <div class="group relative">
                  <input
                    type="email"
                    id="email"
                    formControlName="email"
                    class="peer w-full bg-transparent border-b-2 border-stone-200 dark:border-stone-700 py-3 text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors placeholder-transparent pt-6"
                    [placeholder]="i18n.t().contact.email_placeholder"
                  />
                  <label
                    for="email"
                    class="absolute left-0 top-0 text-stone-500 text-xs uppercase font-bold tracking-wider transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-stone-400 peer-placeholder-shown:font-normal peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-emerald-600"
                  >
                    {{ i18n.t().contact.email_label }}
                  </label>
                  @if (isFieldInvalid('email')) {
                    <span class="text-red-500 text-xs mt-1 block">{{
                      i18n.t().contact.error_email
                    }}</span>
                  }
                </div>
              </div>

              <!-- Subject Field -->
              <div class="group relative">
                <input
                  type="text"
                  id="subject"
                  formControlName="subject"
                  class="peer w-full bg-transparent border-b-2 border-stone-200 py-3 text-stone-900 focus:border-emerald-500 focus:outline-none transition-colors placeholder-transparent pt-6"
                  [placeholder]="i18n.t().contact.subject_placeholder"
                />
                <label
                  for="subject"
                  class="absolute left-0 top-0 text-stone-500 text-xs uppercase font-bold tracking-wider transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-stone-400 peer-placeholder-shown:font-normal peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-emerald-600"
                >
                  {{ i18n.t().contact.subject_label }}
                </label>
              </div>

              <!-- Message Field -->
              <div class="group relative">
                <textarea
                  id="message"
                  formControlName="message"
                  rows="4"
                  class="peer w-full bg-transparent border-b-2 border-stone-200 dark:border-stone-700 py-3 text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none transition-colors placeholder-transparent pt-6 resize-none"
                  [placeholder]="i18n.t().contact.message_placeholder"
                ></textarea>
                <label
                  for="message"
                  class="absolute left-0 top-0 text-stone-500 text-xs uppercase font-bold tracking-wider transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-stone-400 peer-placeholder-shown:font-normal peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-emerald-600"
                >
                  {{ i18n.t().contact.message_label }}
                </label>
                @if (isFieldInvalid('message')) {
                  <span class="text-red-500 text-xs mt-1 block">{{
                    i18n.t().contact.error_message
                  }}</span>
                }
              </div>

              <!-- Submit Button -->
              <div class="pt-4 flex justify-end">
                <button
                  type="submit"
                  [disabled]="contactForm.invalid || submitStatus() === 'loading'"
                  class="relative overflow-hidden group bg-stone-900 dark:bg-stone-800 text-white px-8 py-4 rounded-lg font-bold tracking-wide transition-all hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="relative z-10 flex items-center gap-2">
                    @if (submitStatus() === 'loading') {
                      <svg
                        class="animate-spin h-5 w-5 text-white"
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
                        class="h-5 w-5 group-hover:translate-x-1 transition-transform"
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
    `,
  ],
})
export class ContactSectionComponent {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  i18n = inject(TranslateService);

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  submitStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.submitStatus.set('loading');

      this.contactService.sendMessage(this.contactForm.value).subscribe({
        next: () => {
          this.submitStatus.set('success');
          this.contactForm.reset();
        },
        error: () => {
          this.submitStatus.set('error');
          // Ideally show a toast or error message here
          console.error('Error sending message');
          this.submitStatus.set('idle');
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
