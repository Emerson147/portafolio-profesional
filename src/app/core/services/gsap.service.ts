import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

@Injectable({ providedIn: 'root' })
export class GsapService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    }
  }

  get gsap(): any {
    return this.isBrowser ? gsap : null;
  }

  get ScrollTrigger(): any {
    return this.isBrowser ? ScrollTrigger : null;
  }

  /**
   * Preserved for backward compatibility in case other components
   * call loadGsap() before running animations.
   */
  loadGsap(): Promise<void> {
    return Promise.resolve();
  }

  // Animation Methods
  revealMainContainer() {
    if (!this.gsap) return;
    this.gsap.to('.main-container', { opacity: 1, duration: 1.5, ease: 'power2.out' });
  }

  animateHero() {
    if (!this.gsap) return;

    const tl = this.gsap.timeline();

    tl.from('.hero-reveal', {
      y: 60,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power3.out',
    })
      .to('.hero-desc', { opacity: 1, y: 0, duration: 1 }, '-=0.6')
      .to('.hero-cta', { opacity: 1, y: 0, duration: 1 }, '-=0.8');
  }

  setupScrollTriggers() {
    if (!this.gsap || !this.ScrollTrigger) return;

    // Reveal animations for elements with .gs-reveal class
    const revealElements = document.querySelectorAll('.gs-reveal');
    if (revealElements.length > 0) {
      this.gsap.utils.toArray('.gs-reveal').forEach((elem: any) => {
        this.gsap.from(elem, {
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      });
    }

    // Generic card animations for multiple sections
    const cardSections = ['#stack', '#services', '#testimonials'];

    cardSections.forEach((sectionId) => {
      const cards = document.querySelectorAll(`${sectionId} .gs-reveal-card`);

      if (cards.length > 0) {
        // Ensure initial state is hidden
        this.gsap.set(cards, { autoAlpha: 0, y: 30 });

        this.gsap.to(cards, {
          scrollTrigger: {
            trigger: sectionId,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
        });
      }
    });
  }

  scrollTo(target: string | number, offset = 0) {
    if (!this.gsap) {
      // Fallback
      if (typeof target === 'string') {
        const element = document.querySelector(target);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
      return;
    }

    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        this.gsap.to(window, {
          duration: 0.8,
          scrollTo: { y: element, offsetY: offset },
          ease: 'power3.inOut',
        });
      }
    } else {
      this.gsap.to(window, { duration: 0.8, scrollTo: target, ease: 'power3.inOut' });
    }
  }
}
