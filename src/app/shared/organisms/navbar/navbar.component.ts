import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LogoComponent } from '../../atoms/logo/logo.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { NavLinkComponent } from '../../molecules/nav-link/nav-link.component';
import { NAVIGATION } from '../../../core/data/navigation.data';
import { GsapService } from '../../../core/services/gsap.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LogoComponent, IconComponent, NavLinkComponent],
  template: `
    <nav
      [class]="
        'fixed w-full z-50 transition-all duration-500 ' +
        (isScrolled()
          ? 'bg-white border-b-2 border-stone-200 py-4 shadow-sm'
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
            <app-nav-link [href]="item.href" [label]="item.name" />
          }
          <!-- Architectural CTA Button -->
          <a
            href="#contact"
            (click)="scrollToContact($event)"
            class="group inline-flex items-center gap-2 px-6 py-2 border-2 border-emerald-500 text-emerald-600 font-mono text-sm rounded-lg hover:bg-emerald-500 hover:text-white transition-all duration-300 active:scale-95"
          >
            <span>CONTACTAR</span>
            <span class="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden text-stone-900 active:scale-95 transition-transform duration-200"
          (click)="toggleMenu()"
        >
          <app-icon name="menu" />
        </button>
      </div>

      <!-- Mobile Nav -->
      @if (isMobileMenuOpen()) {
        <div
          class="md:hidden absolute top-full left-0 w-full bg-stone-50 border-b-2 border-stone-200 p-6 flex flex-col gap-6 shadow-xl animate-slide-down overflow-hidden"
        >
          <!-- Grid Pattern for Mobile Menu -->
          <div
            class="absolute inset-0 opacity-[0.03] pointer-events-none"
            style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"
          ></div>

          <div class="relative z-10 flex flex-col gap-6">
            @for (item of navigation; track item.name) {
              <a
                [href]="item.href"
                (click)="onMobileNavClick($event, item.href)"
                class="text-xl font-mono text-stone-800 hover:text-emerald-600 transition-colors active:scale-95 origin-left inline-block"
              >
                // {{ item.name }}
              </a>
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

  scrollToContact(event: Event) {
    event.preventDefault();
    this.gsap.scrollTo('#contact', 80);
  }

  onMobileNavClick(event: Event, href: string) {
    event.preventDefault();
    this.gsap.scrollTo(href, 80);
    this.isMobileMenuOpen.set(false);
  }
}
