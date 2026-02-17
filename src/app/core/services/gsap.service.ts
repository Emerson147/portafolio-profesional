import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class GsapService {
  private platformId = inject(PLATFORM_ID);
  private gsapLoaded = false;

  get gsap(): any {
    return (window as any).gsap;
  }

  get ScrollTrigger(): any {
    return (window as any).ScrollTrigger;
  }

  loadGsap(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve();
    }

    if (this.gsapLoaded || this.gsap) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      // Load GSAP Core
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
      script.onload = () => {
        // Load ScrollTrigger
        const stScript = document.createElement('script');
        stScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
        stScript.onload = () => {
          if (this.gsap && (window as any).ScrollTrigger) {
            this.gsap.registerPlugin((window as any).ScrollTrigger);
          }

          // Load ScrollToPlugin
          const scrollToScript = document.createElement('script');
          scrollToScript.src =
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js';
          scrollToScript.onload = () => {
            if (this.gsap && (window as any).ScrollToPlugin) {
              this.gsap.registerPlugin((window as any).ScrollToPlugin);
            }
            this.gsapLoaded = true;
            resolve();
          };
          document.body.appendChild(scrollToScript);
        };
        document.body.appendChild(stScript);
      };
      document.body.appendChild(script);
    });
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
      y: 100,
      opacity: 0,
      rotation: 5,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out',
    })
      .to('.hero-desc', { opacity: 1, y: 0, duration: 1 }, '-=0.5')
      .to('.hero-cta', { opacity: 1, y: 0, duration: 1 }, '-=0.8');

    // Floating card animation
    this.gsap.to('.card-3d', {
      y: -20,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
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

    // Stack cards animation
    const stackCards = document.querySelectorAll('.gs-reveal-card');
    if (stackCards.length > 0) {
      this.gsap.from('.gs-reveal-card', {
        scrollTrigger: {
          trigger: '#stack',
          start: 'top 75%',
        },
        x: -50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }
  }

  scrollTo(target: string | number, offset = 0) {
    if (!this.gsap) {
      // Fallback
      if (typeof target === 'string') {
        const element = document.querySelector(target);
        if (element) {
          const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
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
          duration: 1.2,
          scrollTo: { y: element, offsetY: offset },
          ease: 'power4.inOut',
        });
      }
    } else {
      this.gsap.to(window, { duration: 1.2, scrollTo: target, ease: 'power4.inOut' });
    }
  }
}
