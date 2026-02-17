import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors duration-300 group gs-reveal-card"
    >
      <h3
        class="text-emerald-400 font-mono text-sm mb-4 border-b border-white/10 pb-2 inline-block"
      >
        {{ area }}
      </h3>
      <ul class="space-y-2">
        @for (tech of techs; track tech) {
          <li class="flex items-center text-stone-300 group-hover:text-white transition-colors">
            <span class="w-1.5 h-1.5 bg-emerald-500 mr-3 rounded-full"></span>
            {{ tech }}
          </li>
        }
      </ul>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TechCardComponent {
  @Input({ required: true }) area!: string;
  @Input({ required: true }) techs!: string[];
}
