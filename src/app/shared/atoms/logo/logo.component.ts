import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <a
      href="#"
      class="text-xl font-bold tracking-tighter text-stone-900 dark:text-stone-50 flex items-center gap-2 group transition-colors"
    >
      <div
        class="w-8 h-8 flex items-center justify-center bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full transition-transform group-hover:rotate-180 duration-700"
      >
        <span class="font-mono text-sm">M</span>
      </div>
      <span
        class="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
      >
        Migatte<span class="text-stone-400 dark:text-stone-500">.Dev</span>
      </span>
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
export class LogoComponent {}
