import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { ThemeService } from '../../../core/services/theme.service';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'contact';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <a
      [href]="href()"
      [class]="buttonClasses()"
      [target]="target()"
      [attr.download]="download() || null"
      (click)="onClick($event)"
    >
      <ng-content></ng-content>
      @if (showArrow()) {
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
  variant = input<ButtonVariant>('primary');
  href = input<string>('#');
  showArrow = input<boolean>(false);
  target = input<string>('_self');
  download = input<string>('');

  private theme = inject(ThemeService);

  buttonClasses = computed<string>(() => {
    const isDark = this.theme.isDark();
    const v = this.variant();
    const base =
      'group inline-flex items-center font-bold transition-all duration-300 cursor-pointer active:scale-95';

    const variants: Record<ButtonVariant, string> = {
      primary: `${base} px-8 py-4 ${isDark ? 'bg-stone-100 text-stone-900 hover:bg-white' : 'bg-stone-900 text-stone-50 hover:bg-stone-800'} rounded-full hover:shadow-xl hover:-translate-y-0.5`,
      secondary: `${base} px-8 py-4 bg-transparent border ${isDark ? 'border-stone-700 text-stone-300 hover:border-stone-500 hover:text-stone-100' : 'border-stone-300 text-stone-700 hover:border-stone-400 hover:text-stone-900'} rounded-full hover:bg-stone-500/5 hover:-translate-y-0.5`,
      outline: `${base} px-6 py-2 border ${isDark ? 'border-stone-700 text-stone-300 hover:border-stone-400 text-white' : 'border-stone-300 text-stone-600 hover:border-stone-500 hover:text-stone-900'} rounded-full text-sm hover:bg-stone-500/5`,
      contact: `${base} px-10 py-5 ${isDark ? 'bg-cyan-500 text-stone-950 hover:bg-cyan-400' : 'bg-cyan-600 text-white hover:bg-cyan-500'} text-lg rounded-full hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5`,
    };

    return variants[v];
  });

  onClick(event: Event) {
    // Allow default behavior for navigation
  }
}
