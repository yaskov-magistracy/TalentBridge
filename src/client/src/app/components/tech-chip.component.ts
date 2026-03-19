/**
 * TechChipComponent - Компонент отображения технологии (чип)
 * 
 * Используется для отображения названия технологии в виде
 * стилизованной метки/бейджа. Применяется в списках заданий,
 * фильтрах и профилях кандидатов.
 * 
 * Пример использования:
 * <app-tech-chip [name]="'React'"></app-tech-chip>
 * <app-tech-chip [name]="technology" *ngFor="let technology of task.technologies"></app-tech-chip>
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  // Селектор для использования в шаблонах
  selector: 'app-tech-chip',
  // standalone: true позволяет использовать компонент без декларации в модуле
  standalone: true,
  // Импортируем CommonModule для доступа к стандартным директивам Angular
  imports: [CommonModule],
  // Inline-шаблон компонента
  template: `
    <!-- 
      Стили компонента:
      - inline-block: позволяет чипам располагаться в строку
      - border border-black: черная рамка в стиле wireframe
      - px-3 py-1: внутренние отступы
      - text-xs uppercase tracking-wider: маленький заглавный текст с расширенным межбуквенным интервалом
    -->
    <span class="inline-block border border-black px-3 py-1 text-xs uppercase tracking-wider">
      {{ name }}
    </span>
  `
})
export class TechChipComponent {
  /**
   * Входной параметр - название технологии
   * Обязательный параметр, передается от родительского компонента
   */
  @Input({ required: true }) name!: string;
}
