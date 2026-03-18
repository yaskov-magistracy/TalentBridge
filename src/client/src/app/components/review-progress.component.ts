/**
 * ReviewProgressComponent - Компонент прогресса проверки
 * 
 * Визуализирует трехэтапный процесс проверки решения:
 * 1. Автотесты - автоматическая проверка функциональности
 * 2. AI-анализ - анализ кода искусственным интеллектом
 * 3. Экспертное ревью - проверка опытным разработчиком
 * 
 * Каждый этап отображается с номером, статусным бейджем и названием.
 * Этапы соединены линиями для наглядности последовательности.
 * 
 * Используется на страницах:
 * - SubmissionResults - показать полный прогресс проверки
 * - CandidateDashboard - показать статус для каждого решения
 * - CandidateProfile - история решений кандидата
 * 
 * Пример использования:
 * <app-review-progress 
 *   [autoTests]="'passed'"
 *   [aiAnalysis]="'passed'"
 *   [expertReview]="'pending'">
 * </app-review-progress>
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  selector: 'app-review-progress',
  standalone: true,
  // Импортируем CommonModule и StatusBadgeComponent для использования в шаблоне
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <!-- Контейнер компонента - flex-контейнер с выравниванием по центру -->
    <div class="flex items-center gap-4">
      
      <!-- ===== ЭТАП 1: АВТОТЕСТЫ ===== -->
      <div class="flex flex-col items-center gap-2">
        <!-- Номер этапа в квадратной рамке -->
        <div class="w-12 h-12 border-2 border-black flex items-center justify-center text-xl">
          1
        </div>
        <!-- Бейдж статуса автотестов -->
        <app-status-badge [status]="autoTests"></app-status-badge>
        <!-- Подпись этапа -->
        <span class="text-xs uppercase">Автотесты</span>
      </div>
      
      <!-- Соединительная линия между этапами 1 и 2 -->
      <div class="w-8 h-0.5 bg-black"></div>
      
      <!-- ===== ЭТАП 2: AI-АНАЛИЗ ===== -->
      <div class="flex flex-col items-center gap-2">
        <div class="w-12 h-12 border-2 border-black flex items-center justify-center text-xl">
          2
        </div>
        <!-- Бейдж статуса AI-анализа -->
        <app-status-badge [status]="aiAnalysis"></app-status-badge>
        <span class="text-xs uppercase">AI-анализ</span>
      </div>
      
      <!-- Соединительная линия между этапами 2 и 3 -->
      <div class="w-8 h-0.5 bg-black"></div>
      
      <!-- ===== ЭТАП 3: ЭКСПЕРТНОЕ РЕВЬЮ ===== -->
      <div class="flex flex-col items-center gap-2">
        <div class="w-12 h-12 border-2 border-black flex items-center justify-center text-xl">
          3
        </div>
        <!-- Бейдж статуса экспертной проверки -->
        <app-status-badge [status]="expertReview"></app-status-badge>
        <span class="text-xs uppercase">Эксперт</span>
      </div>
      
    </div>
  `
})
export class ReviewProgressComponent {
  /**
   * Статус автотестов (этап 1)
   * Возможные значения: 'pending', 'passed', 'failed'
   */
  @Input({ required: true }) autoTests!: 'pending' | 'passed' | 'failed';

  /**
   * Статус AI-анализа (этап 2)
   * Возможные значения: 'pending', 'passed', 'failed'
   */
  @Input({ required: true }) aiAnalysis!: 'pending' | 'passed' | 'failed';

  /**
   * Статус экспертной проверки (этап 3)
   * Возможные значения: 'pending', 'approved', 'rejected'
   */
  @Input({ required: true }) expertReview!: 'pending' | 'approved' | 'rejected';
}
