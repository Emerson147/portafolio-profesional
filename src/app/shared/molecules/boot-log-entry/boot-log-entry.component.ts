import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BootLog {
  time: string;
  prefix: string;
  msg: string;
  color?: string;
}

@Component({
  selector: 'app-boot-log-entry',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-1 leading-snug">
      <span class="text-[#565f89] mr-2">[{{ log.time }}]</span>
      <span [class]="log.color || 'text-[#7aa2f7]'">{{ log.prefix }}</span>
      <span class="ml-2">{{ log.msg }}</span>
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
export class BootLogEntryComponent {
  @Input({ required: true }) log!: BootLog;
}
