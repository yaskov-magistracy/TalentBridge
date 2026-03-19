/**
 * CandidatesRankingComponent - Страница рейтинга кандидатов
 * 
 * Отображает список лучших разработчиков платформы TalentBridge
 * с возможностью фильтрации по навыкам и сортировки.
 * 
 * Особенности:
 * - Фильтрация кандидатов по навыкам (dropdown с уникальными навыками)
 * - Сортировка по рейтингу, количеству заданий или проценту успеха
 * - Отображение карточек кандидатов с рангом (#1, #2, и т.д.)
 * - Каждая карточка кликабельная и ведет на профиль кандидата
 * - Эмодзи-иконки вместо SVG (⭐ 📈 🏆 📍 ❌)
 * 
 * Данные берутся из mockData - в реальном приложении будут приходить с API
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../components/navbar.component';
import { candidatesRanking, CandidateRanking } from '../data/mock-data';

/**
 * Тип для опций сортировки
 * - rating: по рейтингу (по умолчанию)
 * - tasks: по количеству выполненных заданий
 * - successRate: по проценту успешных выполнений
 */
type SortBy = 'rating' | 'tasks' | 'successRate';

@Component({
  selector: 'app-candidates-ranking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  template: `
    <!-- 
      Основной контейнер страницы
      - min-h-screen: минимальная высота во весь экран
      - bg-gradient-to-br: градиент от slate-50 к emerald-50
    -->
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      
      <!-- ===== НАВИГАЦИОННАЯ ПАНЕЛЬ ===== -->
      <app-navbar [role]="'employer'"></app-navbar>

      <!-- ===== ОСНОВНОЙ КОНТЕНТ ===== -->
      <div class="max-w-7xl mx-auto px-8 py-8">
        
        <!-- === ШАПКА СТРАНИЦЫ === -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold uppercase text-emerald-600 mb-2">Рейтинг кандидатов</h1>
            <p class="text-gray-600">Лучшие разработчики платформы TalentBridge</p>
          </div>
          <!-- Кнопка закрытия - возвращает на дашборд работодателя -->
          <a
            routerLink="/employer-dashboard"
            class="border-2 border-emerald-600 px-6 py-3 hover:bg-emerald-600 hover:text-white transition-colors font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <span>❌</span>
            Закрыть
          </a>
        </div>

        <!-- === БЛОК ФИЛЬТРОВ И СОРТИРОВКИ === -->
        <div class="bg-white border-2 border-emerald-600 p-6 mb-6 shadow-md">
          <div class="flex gap-6 items-center">
            
            <!-- ВЫБОР ФИЛЬТРА ПО НАВЫКУ -->
            <div class="flex-1">
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider text-gray-700">
                Фильтр по навыку
              </label>
              <!-- 
                [(ngModel)] - двусторонняя привязка для фильтра навыков
                При изменении select автоматически обновляется filteredCandidates
              -->
              <select
                [(ngModel)]="filterSkill"
                (ngModelChange)="onFilterChange()"
                class="w-full border-2 border-black p-3"
              >
                <option value="">Все навыки</option>
                <option *ngFor="let skill of allSkills" [value]="skill">{{ skill }}</option>
              </select>
            </div>

            <!-- ВЫБОР ТИПА СОРТИРОВКИ -->
            <div class="flex-1">
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider text-gray-700">
                Сортировка
              </label>
              <!-- 
                [(ngModel)] - двусторонняя привязка для сортировки
                При изменении автоматически пересортируется список
              -->
              <select
                [(ngModel)]="sortBy"
                (ngModelChange)="onSortChange()"
                class="w-full border-2 border-black p-3"
              >
                <option value="rating">По рейтингу</option>
                <option value="tasks">По количеству заданий</option>
                <option value="successRate">По проценту успеха</option>
              </select>
            </div>
          </div>
        </div>

        <!-- === СПИСОК КАНДИДАТОВ === -->
        <div class="space-y-4">
          <!-- 
            *ngFor - директива для рендеринга списка
            index as i - получаем индекс для отображения ранга (#1, #2, ...)
          -->
          <a
            *ngFor="let candidate of filteredCandidates; index as i"
            [routerLink]="['/candidate', candidate.id]"
            class="block bg-white border-2 border-emerald-400 p-6 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div class="flex gap-6">
              
              <!-- БЕЙДЖ С РАНГОМ (#1, #2, и т.д.) -->
              <div class="flex-shrink-0">
                <div class="w-16 h-16 bg-gradient-to-br from-emerald-600 to-indigo-600 flex items-center justify-center">
                  <span class="text-3xl font-bold text-white">#{{ i + 1 }}</span>
                </div>
              </div>

              <!-- ОСНОВНАЯ ИНФОРМАЦИЯ О КАНДИДАТЕ -->
              <div class="flex-1">
                
                <!-- Имя, город, активность -->
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h3 class="text-2xl font-bold mb-1">{{ candidate.name }}</h3>
                    <div class="flex items-center gap-4 text-sm text-gray-600">
                      <!-- Город с эмодзи 📍 -->
                      <div class="flex items-center gap-1">
                        <span>📍</span>
                        {{ candidate.city }}
                      </div>
                      <!-- Дата последней активности -->
                      <div class="text-xs bg-gray-100 px-2 py-1 border border-gray-300">
                        Активность: {{ candidate.lastActive }}
                      </div>
                    </div>
                  </div>

                  <!-- === СТАТИСТИКА КАНДИДАТА === -->
                  <div class="flex gap-6">
                    
                    <!-- РЕЙТИНГ (⭐) -->
                    <div class="text-center">
                      <div class="flex items-center gap-1 text-amber-600 mb-1">
                        <span class="text-xl">⭐</span>
                        <span class="text-2xl font-bold">{{ candidate.rating.toFixed(1) }}</span>
                      </div>
                      <p class="text-xs text-gray-500 uppercase">Рейтинг</p>
                    </div>
                    
                    <!-- КОЛИЧЕСТВО ЗАДАНИЙ (🏆) -->
                    <div class="text-center">
                      <div class="flex items-center gap-1 text-emerald-600 mb-1">
                        <span class="text-xl">🏆</span>
                        <span class="text-2xl font-bold">{{ candidate.completedTasksCount }}</span>
                      </div>
                      <p class="text-xs text-gray-500 uppercase">Заданий</p>
                    </div>
                    
                    <!-- ПРОЦЕНТ УСПЕХА (📈) -->
                    <div class="text-center">
                      <div class="flex items-center gap-1 text-indigo-600 mb-1">
                        <span class="text-xl">📈</span>
                        <span class="text-2xl font-bold">{{ candidate.successRate }}%</span>
                      </div>
                      <p class="text-xs text-gray-500 uppercase">Успех</p>
                    </div>
                  </div>
                </div>

                <!-- Описание "О себе" -->
                <p class="text-gray-700 mb-4 leading-relaxed">{{ candidate.about }}</p>

                <!-- === НАВЫКИ КАНДИДАТА === -->
                <div class="mb-3">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Навыки</p>
                  <div class="flex flex-wrap gap-2">
                    <!-- 
                      *ngFor для перебора навыков
                      [ngClass] для динамического применения цвета в зависимости от уровня
                    -->
                    <div
                      *ngFor="let skill of candidate.skills"
                      [ngClass]="getLevelColor(skill.level)"
                      class="px-3 py-1 border-2 font-semibold text-sm"
                    >
                      {{ skill.name }} • {{ skill.level }}
                    </div>
                  </div>
                </div>

                <!-- === ВЫПОЛНЕННЫЕ ЗАДАНИЯ === -->
                <div>
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Выполненные задания
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <!-- Показываем первые 3 задания -->
                    <div
                      *ngFor="let task of candidate.completedTasks.slice(0, 3)"
                      class="text-xs bg-emerald-50 border border-emerald-300 px-2 py-1 text-emerald-700"
                    >
                      ✓ {{ task }}
                    </div>
                    <!-- Если заданий больше 3 - показываем счетчик оставшихся -->
                    <div
                      *ngIf="candidate.completedTasks.length > 3"
                      class="text-xs bg-gray-100 border border-gray-300 px-2 py-1 text-gray-600"
                    >
                      +{{ candidate.completedTasks.length - 3 }} еще
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>

        <!-- === ПУСТОЕ СОСТОЯНИЕ === -->
        <!-- Показывается когда фильтр не вернул ни одного результата -->
        <div
          *ngIf="filteredCandidates.length === 0"
          class="bg-white border-2 border-gray-300 p-12 text-center"
        >
          <p class="text-gray-500 text-lg">Кандидаты с выбранным навыком не найдены</p>
        </div>
      </div>
    </div>
  `
})
export class CandidatesRankingComponent {
  /**
   * Выбранный навык для фильтрации
   * Пустая строка = показать всех кандидатов
   */
  filterSkill: string = '';

  /**
   * Текущая опция сортировки
   * @default 'rating' - сортировка по рейтингу (от высокого к низкому)
   */
  sortBy: SortBy = 'rating';

  /**
   * Исходные данные кандидатов из mockData
   * В реальном приложении это приходило бы с сервера через сервис
   */
  private allCandidates: CandidateRanking[] = candidatesRanking;

  /**
   * Геттер для получения отфильтрованного и отсортированного списка кандидатов
   * Пересчитывается автоматически при изменении filterSkill или sortBy
   */
  get filteredCandidates(): CandidateRanking[] {
    // Шаг 1: Фильтрация
    let result = this.filterSkill
      ? this.allCandidates.filter(c => c.skills.some(s => s.name === this.filterSkill))
      : [...this.allCandidates];

    // Шаг 2: Сортировка
    result.sort((a, b) => {
      if (this.sortBy === 'rating') return b.rating - a.rating;
      if (this.sortBy === 'tasks') return b.completedTasksCount - a.completedTasksCount;
      if (this.sortBy === 'successRate') return b.successRate - a.successRate;
      return 0;
    });

    return result;
  }

  /**
   * Геттер для получения списка уникальных навыков всех кандидатов
   * Используется для заполнения dropdown фильтра
   * - flatMap собирает все навыки в один массив
   * - Set убирает дубликаты
   * - Array.from конвертирует обратно в массив
   */
  get allSkills(): string[] {
    return Array.from(
      new Set(this.allCandidates.flatMap(c => c.skills.map(s => s.name)))
    );
  }

  /**
   * Возвращает CSS-классы Tailwind для цветового оформления уровня навыка
   * 
   * @param level - уровень владения навыком
   * @returns строка с CSS-классами для соответствующего цвета
   * 
   * Уровни:
   * - 'начинающий' - янтарный/желтый (amber)
   * - 'базовый' - индиго (indigo)
   * - 'опытный' - изумрудный/зеленый (emerald)
   * - по умолчанию - серый (gray)
   */
  getLevelColor(level: string): string {
    switch (level) {
      case 'начинающий': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'базовый': return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case 'опытный': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  }

  /**
   * Обработчик изменения фильтра
   * Вызывается при выборе навыка в dropdown
   * filteredCandidates автоматически пересчитывается через геттер
   */
  onFilterChange(): void {
    // Фильтрация происходит автоматически через геттер filteredCandidates
    // Этот метод может использоваться для дополнительной логики, например:
    // - сброса текущей страницы пагинации
    // - логирования фильтрации
    // - обновления URL query params
  }

  /**
   * Обработчик изменения сортировки
   * Вызывается при выборе типа сортировки в dropdown
   * filteredCandidates автоматически пересчитывается через геттер
   */
  onSortChange(): void {
    // Сортировка происходит автоматически через геттер filteredCandidates
    // Этот метод может использоваться для дополнительной логики
  }
}
