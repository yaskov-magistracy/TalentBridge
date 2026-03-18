/**
 * StatusBadgeComponent - Компонент отображения статуса
 * 
 * Отображает статус проверки в виде цветного бейджа с символом.
 * Поддерживает различные статусы: ожидание, пройдено/одобрено, 
 * не пройдено/отклонено.
 * 
 * Используется на страницах:
 * - SubmissionResults - результаты проверки решения
 * - CandidateDashboard - статусы отправленных решений
 * - EmployerDashboard - статусы кандидатов в таблице
 * 
 * Пример использования:
 * <app-status-badge [status]="'passed'"></app-status-badge>
 * <app-status-badge [status]="submission.status.autoTests"></app-status-badge>
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Тип статуса, который может принимать компонент
type StatusType = 'pending' | 'passed' | 'failed' | 'approved' | 'rejected';

/**
 * Интерфейс для конфигурации отображения статуса
 */
interface StatusDisplay {
  /** Текстовое описание статуса */
  text: string;
  /** Символ, отображаемый перед текстом */
  symbol: string;
  /** CSS классы для стилизации бейджа */
  className: string;
}

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- 
      Контейнер бейджа статуса
      Используем ngClass для динамического применения стилей в зависимости от статуса
    -->
    <span 
      class="inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-wider font-semibold"
      [ngClass]="display.className"
    >
      <!-- Символ статуса (○, ✓, ✗, ?) -->
      <span>{{ display.symbol }}</span>
      <!-- Текстовое описание статуса -->
      <span>{{ display.text }}</span>
    </span>
  `
})
export class StatusBadgeComponent {
  /**
   * Входной параметр - текущий статус
   * Возможные значения: 'pending', 'passed', 'failed', 'approved', 'rejected'
   */
  @Input({ required: true }) status!: StatusType;

  /**
   * Геттер для получения конфигурации отображения на основе текущего статуса
   * Вызывается автоматически при каждом изменении status
   */
  get display(): StatusDisplay {
    return this.getStatusDisplay();
  }

  /**
   * Метод определения отображения статуса
   * Возвращает объект с текстом, символом и CSS классами
   */
  private getStatusDisplay(): StatusDisplay {
    switch (this.status) {
      case 'pending':
        // Желтый стиль для статуса ожидания
        return { 
          text: 'ОЖИДАНИЕ', 
          symbol: '○', 
          className: 'border-2 border-amber-400 bg-amber-50 text-amber-700' 
        };
      
      case 'passed':
      case 'approved':
        // Зеленый стиль для успешного прохождения/одобрения
        return { 
          text: 'ПРОЙДЕНО', 
          symbol: '✓', 
          className: 'border-2 border-emerald-400 bg-emerald-50 text-emerald-700' 
        };
      
      case 'failed':
      case 'rejected':
        // Красный стиль для неудачи/отклонения
        return { 
          text: 'НЕ ПРОЙДЕНО', 
          symbol: '✗', 
          className: 'border-2 border-red-400 bg-red-50 text-red-700' 
        };
      
      default:
        // Серый стиль для неизвестного статуса (fallback)
        return { 
          text: 'НЕИЗВЕСТНО', 
          symbol: '?', 
          className: 'border-2 border-gray-400 bg-gray-50 text-gray-700' 
        };
    }
  }
}
