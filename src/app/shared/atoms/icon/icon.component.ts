import { Component, inject, input, computed } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS, IconName } from '../../../core/data/icons.data';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `<span
    class="inline-flex items-center justify-center"
    [style.width.px]="size()"
    [style.height.px]="size()"
    [innerHTML]="iconSvg()"
  ></span>`,
  styles: [
    `
      :host {
        display: inline-flex;
      }
      span {
        display: inline-flex;
      }
      span ::ng-deep svg {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class IconComponent {
  name = input.required<IconName>();
  size = input<number>(24);

  private sanitizer = inject(DomSanitizer);

  iconSvg = computed<SafeHtml>(() => {
    const svg = ICONS[this.name()];
    return svg ? this.sanitizer.bypassSecurityTrustHtml(svg) : '';
  });
}
