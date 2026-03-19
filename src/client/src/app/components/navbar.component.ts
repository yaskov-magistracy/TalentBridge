/**
 * NavbarComponent - Навигационная панель приложения
 * 
 * Отображает логотип платформы и навигационные элементы.
 * Адаптируется в зависимости от роли пользователя (кандидат/работодатель).
 * 
 * Особенности:
 * - Показывает роль пользователя (КАНДИДАТ/РАБОТОДАТЕЛЬ) если роль указана
 * - Логотип является ссылкой на соответствующий дашборд
 * - Кнопка "ВЫХОД" для выхода из системы
 * 
 * Используется на всех страницах, кроме Landing (у которого своя шапка)
 * 
 * Пример использования:
 * <app-navbar [role]="'candidate'"></app-navbar>
 * <app-navbar [role]="'employer'"></app-navbar>
 * <app-navbar></app-navbar> - без указания роли (только логотип)
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Тип роли пользователя
type UserRole = 'candidate' | 'employer';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- 
      Основной контейнер навбара
      - border-b-2 border-indigo-600: нижняя граница индиго цвета
      - bg-white: белый фон
      - shadow-sm: легкая тень
    -->
    <div class="border-b-2 border-indigo-600 bg-white shadow-sm">
      <!-- 
        Внутренний контейнер с ограничением ширины
        - max-w-7xl: максимальная ширина 80rem
        - mx-auto: центрирование по горизонтали
        - px-8 py-4: внутренние отступы
        - flex justify-between items-center: flex-расположение с выравниванием
      -->
      <div class="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        
        <!-- ===== ЛОГОТИП ===== -->
        <!-- 
          Ссылка на дашборд в зависимости от роли
          - text-xl font-bold: крупный жирный текст
          - bg-gradient-to-r: градиентный текст
          - bg-clip-text text-transparent: обрезка фона по тексту
        -->
        <a [routerLink]="dashboardPath" 
           class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
          TALENTBRIDGE
        </a>
        
        <!-- ===== НАВИГАЦИЯ ДЛЯ АВТОРИЗОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ ===== -->
        <!-- Показываем только если роль указана -->
        <div *ngIf="role" class="flex gap-8 items-center">
          
          <!-- Бейдж с ролью пользователя -->
          <span class="text-sm uppercase tracking-wider border-2 px-3 py-1 border-indigo-600 text-indigo-600 font-semibold">
            <!-- Тернарный оператор для отображения текста в зависимости от роли -->
            {{ role === 'candidate' ? 'КАНДИДАТ' : 'РАБОТОДАТЕЛЬ' }}
          </span>
          
          <!-- Кнопка выхода -->
          <a routerLink="/" 
             class="text-sm uppercase tracking-wider hover:text-indigo-600 transition-colors font-semibold">
            ВЫХОД
          </a>
        </div>
        
      </div>
    </div>
  `
})
export class NavbarComponent {
  /**
   * Входной параметр - роль пользователя
   * 'candidate' - кандидат (junior)
   * 'employer' - работодатель
   * undefined - неавторизованный пользователь
   */
  @Input() role?: UserRole;

  /**
   * Геттер для определения пути дашборда
   * В зависимости от роли возвращает соответствующий путь:
   * - candidate -> /candidate-dashboard
   * - employer -> /employer-dashboard
   * - undefined -> / (главная страница)
   */
  get dashboardPath(): string {
    if (this.role === 'candidate') {
      return '/candidate-dashboard';
    } else if (this.role === 'employer') {
      return '/employer-dashboard';
    }
    return '/';
  }
}
