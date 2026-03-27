import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tech-chip',
  standalone: true,
  template: `
    <span class="inline-block border border-black px-3 py-1 text-xs uppercase tracking-wider">
      {{ name }}
    </span>
  `
})
export class TechChipComponent {
  @Input({ required: true }) name = '';
}
