import { Component, Input } from '@angular/core';
import { BadgeStatus } from '../../core/models/domain.models';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-wider font-semibold" [class]="display.className">
      <span>{{ display.symbol }}</span>
      <span>{{ display.text }}</span>
    </span>
  `
})
export class StatusBadgeComponent {
  @Input({ required: true }) status: BadgeStatus = 'pending';

  get display() {
    switch (this.status) {
      case 'pending':
        return { text: 'ОЖИДАНИЕ', symbol: '○', className: 'inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-wider font-semibold border-2 border-amber-400 bg-amber-50 text-amber-700' };
      case 'passed':
      case 'approved':
        return { text: 'ПРОЙДЕНО', symbol: '✓', className: 'inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-wider font-semibold border-2 border-emerald-400 bg-emerald-50 text-emerald-700' };
      case 'failed':
      case 'rejected':
        return { text: 'НЕ ПРОЙДЕНО', symbol: '✗', className: 'inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-wider font-semibold border-2 border-red-400 bg-red-50 text-red-700' };
      default:
        return { text: 'НЕИЗВЕСТНО', symbol: '?', className: 'inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-wider font-semibold border-2 border-gray-400 bg-gray-50 text-gray-700' };
    }
  }
}
