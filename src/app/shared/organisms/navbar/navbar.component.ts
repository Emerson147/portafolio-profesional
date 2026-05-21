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
  imports: [CommonModule, IconComponent, RouterLink, RouterLinkActive],
  template: `
    <nav
      role="navigation"
      aria-label="Navegación principal"
      class="fixed bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] max-w-[95vw] lg:max-w-max"
    >
      <div
        class="flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 lg:py-3 rounded-full bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-200/50 dark:border-stone-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <!-- Home / Logo Button -->
        <button
          (click)="scrollToTop($event)"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-white transition-all duration-300 group"
          aria-label="Volver arriba"
        >
          <app-icon name="home" class="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        <!-- Divider -->
        <div class="w-px h-6 bg-stone-300 dark:bg-stone-700 mx-1"></div>

        <!-- Navigation Links (Icons always visible, text expands on hover in desktop) -->
        <div class="flex items-center gap-1 overflow-x-auto hide-scrollbar max-w-full">
          @for (item of navigation; track item.name) {
            @if (item.type === 'route') {
              <a
                [routerLink]="item.href"
                routerLinkActive="bg-stone-200/80 dark:bg-stone-800/80 text-cyan-600 dark:text-cyan-400"
                class="group flex items-center justify-center h-10 px-3 rounded-full text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-all duration-300 shrink-0"
              >
                @if (item.icon) {
                  <app-icon [name]="item.icon" class="w-5 h-5" />
                }
                <span class="dock-label">{{ item.name }}</span>
              </a>
            } @else {
              <button
                (click)="scrollToSection($event, item.href)"
                class="group flex items-center justify-center h-10 px-3 rounded-full text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-all duration-300 shrink-0"
              >
                @if (item.icon) {
                  <app-icon [name]="item.icon" class="w-5 h-5" />
                }
                <span class="dock-label">{{ item.name }}</span>
              </button>
            }
          }
        </div>

        <!-- Divider -->
        <div class="w-px h-6 bg-stone-300 dark:bg-stone-700 mx-1"></div>

        <!-- Utilities -->
        <div class="flex items-center gap-1">
          <!-- Language Toggle -->
          <button
            (click)="i18n.toggle()"
            class="w-10 h-10 flex items-center justify-center rounded-full text-xs font-mono font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-300"
            [attr.aria-label]="i18n.lang() === 'es' ? 'Switch to English' : 'Cambiar a Español'"
          >
            {{ i18n.lang() === 'es' ? 'EN' : 'ES' }}
          </button>

          <!-- Theme Toggle -->
          <button
            (click)="theme.toggle()"
            class="w-10 h-10 flex items-center justify-center rounded-full text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-300"
            [attr.aria-label]="theme.isDark() ? 'Activar modo día' : 'Activar modo noche'"
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
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      /* Hide scrollbar for mobile */
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      /* Hover label animation for Dynamic Island */
      .dock-label {
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        white-space: nowrap;
        transition: max-width 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease, margin-left 0.3s ease;
      }

      @media (min-width: 768px) {
        .group:hover .dock-label {
          max-width: 120px;
          opacity: 1;
          margin-left: 8px;
        }
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

  scrollToSection(event: Event, target: string) {
    event.preventDefault();
    this.gsap.scrollTo(target, 80);
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
