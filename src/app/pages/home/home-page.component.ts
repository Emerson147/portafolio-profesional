import { Component, inject, AfterViewInit, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { NavbarComponent } from '../../shared/organisms/navbar/navbar.component';
import { LoadingScreenComponent } from '../../shared/organisms/loading-screen/loading-screen.component';
import { HeroSectionComponent } from '../../shared/organisms/hero-section/hero-section.component';
import { AboutSectionComponent } from '../../shared/organisms/about-section/about-section.component';
import { StackSectionComponent } from '../../shared/organisms/stack-section/stack-section.component';
import { ProjectsSectionComponent } from '../../shared/organisms/projects-section/projects-section.component';
import { ProcessSectionComponent } from '../../shared/organisms/process-section/process-section.component';
import { ServicesSectionComponent } from '../../shared/organisms/services-section/services-section.component';
import { TestimonialsSectionComponent } from '../../shared/organisms/testimonials-section/testimonials-section.component';
import { FooterComponent } from '../../shared/organisms/footer/footer.component';
import { GsapService } from '../../core/services/gsap.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    NavbarComponent,
    LoadingScreenComponent,
    HeroSectionComponent,
    AboutSectionComponent,
    ProcessSectionComponent,
    ServicesSectionComponent,
    TestimonialsSectionComponent,
    StackSectionComponent,
    ProjectsSectionComponent,
    FooterComponent,
  ],
  template: `
    <!-- Loading Screen -->
    <app-loading-screen (loadingComplete)="onLoadingComplete()" />

    <!-- Main Content -->
    <app-main-layout>
      <app-navbar />
      <app-hero-section />
      <app-about-section />
      <app-process-section />
      <app-stack-section />
      <app-services-section />
      <app-projects-section />
      <app-testimonials-section />
      <app-footer />
    </app-main-layout>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class HomePageComponent implements OnInit, AfterViewInit {
  private gsap = inject(GsapService);
  private platformId = inject(PLATFORM_ID);
  private gsapLoadedPromise!: Promise<void>;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.gsapLoadedPromise = this.gsap.loadGsap();
    } else {
      this.gsapLoadedPromise = Promise.resolve();
    }
  }

  ngAfterViewInit() {
    // Other view init logic if needed
  }

  async onLoadingComplete() {
    await this.gsapLoadedPromise;
    setTimeout(() => {
      this.gsap.revealMainContainer();
      this.gsap.animateHero();
      this.gsap.setupScrollTriggers();
    }, 500);
  }
}
