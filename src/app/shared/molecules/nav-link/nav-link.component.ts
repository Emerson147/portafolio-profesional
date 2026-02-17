import { Component, Input, inject } from '@angular/core';
import { GsapService } from '../../../core/services/gsap.service';

@Component({
  selector: 'app-nav-link',
  standalone: true,
  template: `
    <a
      [href]="href"
      (click)="onLinkClick($event)"
      class="text-sm font-medium text-stone-500 hover:text-emerald-700 transition-colors relative group tracking-wide cursor-pointer"
    >
      {{ label }}
      <span
        class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"
      ></span>
    </a>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class NavLinkComponent {
  @Input({ required: true }) href!: string;
  @Input({ required: true }) label!: string;

  private gsap = inject(GsapService);

  onLinkClick(event: Event) {
    event.preventDefault();
    this.gsap.scrollTo(this.href, 80);
  }
}
