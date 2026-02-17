import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'contact';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <a [href]="href" [class]="buttonClasses" (click)="onClick($event)">
      <ng-content></ng-content>
      @if (showArrow) {
        <span
          class="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
        >
          <app-icon name="arrowUpRight" [size]="16" />
        </span>
      }
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
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() href = '#';
  @Input() showArrow = false;

  get buttonClasses(): string {
    const base =
      'group inline-flex items-center font-bold transition-all duration-300 cursor-pointer active:scale-95';

    const variants: Record<ButtonVariant, string> = {
      primary: `${base} px-8 py-4 bg-stone-900 text-white rounded-tr-3xl rounded-bl-3xl hover:bg-emerald-800 shadow-xl shadow-stone-900/10`,
      secondary: `${base} px-8 py-4 bg-transparent border border-stone-300 text-stone-600 rounded-tl-3xl rounded-br-3xl hover:border-emerald-600 hover:text-emerald-700`,
      outline: `${base} px-6 py-2 border border-stone-900 text-stone-900 rounded-full text-sm hover:bg-stone-900 hover:text-white`,
      contact: `${base} px-10 py-5 bg-white text-stone-900 text-xl rounded-full hover:bg-emerald-400 hover:scale-105`,
    };

    return variants[this.variant];
  }

  onClick(event: Event) {
    // Allow default behavior for navigation
  }
}
