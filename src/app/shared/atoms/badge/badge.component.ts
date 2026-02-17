import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'default' | 'outline' | 'tech' | 'project';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span [class]="badgeClasses">{{ text }}</span>`,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class BadgeComponent {
  @Input({ required: true }) text!: string;
  @Input() variant: BadgeVariant = 'default';

  get badgeClasses(): string {
    const variants: Record<BadgeVariant, string> = {
      default: 'px-4 py-2 border border-emerald-500/30 rounded-full text-emerald-400 text-sm',
      outline:
        'font-mono text-xs border border-stone-300 group-hover:border-emerald-500 group-hover:text-emerald-400 px-3 py-1 rounded-full transition-colors duration-300',
      tech: 'px-4 py-2 border border-emerald-500/30 rounded-full text-emerald-400 text-sm',
      project:
        'text-[10px] font-bold uppercase tracking-widest border border-stone-300 bg-white/50 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 px-3 py-2 rounded-sm group-hover:text-emerald-400 transition-all duration-300',
    };

    return variants[this.variant];
  }
}
