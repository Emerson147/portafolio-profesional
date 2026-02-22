import { Component, Input, inject } from '@angular/core';
import { GsapService } from '../../../core/services/gsap.service';

@Component({
  selector: 'app-nav-link',
  standalone: true,
  template: `
    <a
      [href]="href"
      (click)="onLinkClick($event)"
      class="text-sm font-mono text-stone-600 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative group tracking-wide cursor-pointer"
    >
      {{ label }}
      <span
        class="absolute -bottom-1.5 left-0 w-0 h-px bg-emerald-500 dark:bg-emerald-400 transition-all duration-300 group-hover:w-full"
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
