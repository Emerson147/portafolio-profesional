import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LogoComponent } from '../../atoms/logo/logo.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { NavLinkComponent } from '../../molecules/nav-link/nav-link.component';
import { NAVIGATION } from '../../../core/data/navigation.data';
import { GsapService } from '../../../core/services/gsap.service';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslateService } from '../../../core/services/translate.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    LogoComponent,
    IconComponent,
    NavLinkComponent,
    RouterLink,
    RouterLinkActive,
  ],
  template: `
    <nav
      role="navigation"
      aria-label="Navegación principal"
      [class]="
        'fixed w-full z-50 transition-all duration-500 ' +
        (isScrolled()
          ? 'bg-white dark:bg-stone-950 border-b-2 border-stone-200 dark:border-stone-800 py-4 shadow-sm'
          : 'bg-transparent py-8')
      "
    >
      <!-- Grid Pattern on Scroll -->
      <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none transition-opacity duration-500"
        [class.opacity-0]="!isScrolled()"
        style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"
      ></div>

      <div class="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-10">
        <div
          (click)="scrollToTop($event)"
          class="cursor-pointer active:scale-95 transition-transform duration-200"
        >
          <app-logo />
        </div>

        <!-- Desktop Nav -->
        <div class="hidden md:flex gap-10 items-center">
          @for (item of navigation; track item.name) {
            @if (item.type === 'route') {
              <a
                [routerLink]="item.href"
                routerLinkActive="text-emerald-600"
                class="text-sm font-mono text-stone-600 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {{ item.name }}
              </a>
            } @else {
              <app-nav-link [href]="item.href" [label]="item.name" />
            }
          }
          <!-- Language Toggle -->
          <button
            (click)="i18n.toggle()"
            class="px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/80 text-stone-600 dark:text-stone-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 backdrop-blur-sm text-xs font-mono font-bold tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            [attr.aria-label]="i18n.lang() === 'es' ? 'Switch to English' : 'Cambiar a Español'"
          >
            {{ i18n.lang() === 'es' ? 'EN' : 'ES' }}
          </button>
          <!-- Theme Toggle Button -->
          <button
            (click)="theme.toggle()"
            class="relative w-10 h-10 flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/80 text-stone-600 dark:text-stone-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            [attr.aria-label]="theme.isDark() ? 'Activar modo día' : 'Activar modo noche'"
          >
            @if (theme.isDark()) {
              <!-- Sun icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                />
              </svg>
            } @else {
              <!-- Moon icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            }
          </button>
        </div>

        <!-- Mobile: Language + Theme + Hamburger -->
        <div class="md:hidden flex items-center gap-3">
          <!-- Language toggle -->
          <button
            (click)="i18n.toggle()"
            class="px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/80 text-stone-600 dark:text-stone-300 hover:border-emerald-500 transition-all text-xs font-mono font-bold"
          >
            {{ i18n.lang() === 'es' ? 'EN' : 'ES' }}
          </button>
          <!-- Theme toggle -->
          <button
            (click)="theme.toggle()"
            class="w-9 h-9 flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/80 text-stone-600 dark:text-stone-300 hover:border-emerald-500 transition-all"
          >
            @if (theme.isDark()) {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                />
              </svg>
            } @else {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            }
          </button>
          <!-- Hamburger -->
          <button
            class="text-stone-900 dark:text-stone-100 active:scale-95 transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
            (click)="toggleMenu()"
            [attr.aria-expanded]="isMobileMenuOpen()"
            aria-controls="mobile-menu"
            aria-label="Abrir menú de navegación"
          >
            <app-icon name="menu" />
          </button>
        </div>
      </div>

      <!-- Mobile Nav -->
      @if (isMobileMenuOpen()) {
        <div
          id="mobile-menu"
          role="menu"
          class="md:hidden absolute top-full left-0 w-full bg-stone-50 dark:bg-stone-900 border-b-2 border-stone-200 dark:border-stone-700 p-6 flex flex-col gap-6 shadow-xl animate-slide-down overflow-hidden"
        >
          <!-- Grid Pattern for Mobile Menu -->
          <div
            class="absolute inset-0 opacity-[0.03] pointer-events-none"
            style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"
          ></div>

          <div class="relative z-10 flex flex-col gap-6">
            @for (item of navigation; track item.name) {
              @if (item.type === 'route') {
                <a
                  [routerLink]="item.href"
                  (click)="isMobileMenuOpen.set(false)"
                  class="text-xl font-mono text-stone-800 dark:text-stone-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors active:scale-95 origin-left inline-block"
                >
                  // {{ item.name }}
                </a>
              } @else {
                <a
                  [href]="item.href"
                  (click)="onMobileNavClick($event, item.href)"
                  class="text-xl font-mono text-stone-800 dark:text-stone-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors active:scale-95 origin-left inline-block"
                >
                  // {{ item.name }}
                </a>
              }
            }
          </div>
        </div>
      }
    </nav>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .animate-slide-down {
        animation: slideDown 0.3s ease-out;
      }
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class NavbarComponent {
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  navigation = NAVIGATION;

  theme = inject(ThemeService);
  i18n = inject(TranslateService);
  private gsap = inject(GsapService);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 50);
      });
    }
  }

  toggleMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }

  scrollToTop(event: Event) {
    event.preventDefault();
    this.gsap.scrollTo(0);
  }

  onMobileNavClick(event: Event, href: string) {
    event.preventDefault();
    this.gsap.scrollTo(href, 80);
    this.isMobileMenuOpen.set(false);
  }
}
