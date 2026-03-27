import { Component, Input } from '@angular/core';
import { AutoTestStatus, ExpertReviewStatus } from '../../core/models/domain.models';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  selector: 'app-review-progress',
  standalone: true,
  imports: [StatusBadgeComponent],
  template: `
    <div class="flex items-center gap-4">
      <div class="flex flex-col items-center gap-2">
        <div class="w-12 h-12 border-2 border-black flex items-center justify-center text-xl">1</div>
        <app-status-badge [status]="autoTests"></app-status-badge>
        <span class="text-xs uppercase">Автотесты</span>
      </div>

      <div class="w-8 h-0.5 bg-black"></div>

      <div class="flex flex-col items-center gap-2">
        <div class="w-12 h-12 border-2 border-black flex items-center justify-center text-xl">2</div>
        <app-status-badge [status]="aiAnalysis"></app-status-badge>
        <span class="text-xs uppercase">AI-анализ</span>
      </div>

      <div class="w-8 h-0.5 bg-black"></div>

      <div class="flex flex-col items-center gap-2">
        <div class="w-12 h-12 border-2 border-black flex items-center justify-center text-xl">3</div>
        <app-status-badge [status]="expertReview"></app-status-badge>
        <span class="text-xs uppercase">Эксперт</span>
      </div>
    </div>
  `
})
export class ReviewProgressComponent {
  @Input({ required: true }) autoTests: AutoTestStatus = 'pending';
  @Input({ required: true }) aiAnalysis: AutoTestStatus = 'pending';
  @Input({ required: true }) expertReview: ExpertReviewStatus = 'pending';
}
