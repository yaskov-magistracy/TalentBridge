/**
 * CandidateProfileComponent - Страница профиля кандидата
 * 
 * Этот компонент отображает детальный профиль кандидата для просмотра работодателем.
 * 
 * Функциональность:
 * - Получает ID кандидата из URL параметров (ActivatedRoute)
 * - Ищет кандидата в mock-данных (candidatesRanking)
 * - Отображает полную информацию о кандидате:
 *   * Имя, email, город, последняя активность
 *   * Рейтинг, количество выполненных заданий, процент успеха
 *   * Описание "о себе"
 *   * Навыки с уровнями владения (начинающий/базовый/опытный)
 *   * Список выполненных заданий со ссылками
 *   * История решений с прогрессом проверки (ReviewProgress)
 * - Если кандидат не найден - показывает сообщение об ошибке
 * 
 * Конвертирован из React компонента:
 * - Заменены Lucide-иконки на эмодзи
 * - useParams() -> ActivatedRoute
 * - Link -> RouterLink
 * 
 * Используется на маршруте: /candidate/:id
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../components/navbar.component';
import { ReviewProgressComponent } from '../components/review-progress.component';
import { candidatesRanking, CandidateRanking } from '../data/mock-data';

/**
 * Тип для уровня навыка кандидата
 * Используется для определения CSS-классов оформления
 */
type SkillLevel = 'начинающий' | 'базовый' | 'опытный';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  // Импортируем необходимые модули и компоненты
  imports: [
    CommonModule,           // Angular директивы (*ngIf, *ngFor)
    RouterLink,             // Для навигационных ссылок
    NavbarComponent,        // Навигационная панель
    ReviewProgressComponent // Компонент прогресса проверки
  ],
  template: `
    <!-- 
      Основной контейнер страницы
      - min-h-screen: минимальная высота - весь экран
      - bg-gradient-to-br: градиентный фон от slate-50 к emerald-50
    -->
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      
      <!-- Навигационная панель для работодателя -->
      <app-navbar [role]="'employer'"></app-navbar>

      <!-- 
        Контейнер контента
        - max-w-5xl: максимальная ширина для читаемости
        - relative: для позиционирования кнопки закрытия
      -->
      <div class="max-w-5xl mx-auto px-8 py-8 relative">
        
        <!-- ========== СОСТОЯНИЕ: КАНДИДАТ НЕ НАЙДЕН ========== -->
        <!-- Показываем если candidate === null (не найден по ID) -->
        <div *ngIf="!candidate" class="max-w-5xl mx-auto px-8 py-8">
          <div class="bg-white border-2 border-red-600 p-12 text-center">
            <h2 class="text-2xl font-bold mb-4">Кандидат не найден</h2>
            <a routerLink="/employer-dashboard" class="text-indigo-600 hover:underline">
              ← Вернуться к панели
            </a>
          </div>
        </div>

        <!-- ========== СОСТОЯНИЕ: КАНДИДАТ НАЙДЕН ========== -->
        <ng-container *ngIf="candidate">
          
          <!-- Кнопка закрытия (X) - ссылка на страницу рейтинга -->
          <a
            routerLink="/candidates-ranking"
            class="absolute top-0 right-8 text-4xl hover:opacity-70 transition-opacity border-2 border-emerald-600 w-12 h-12 flex items-center justify-center hover:bg-emerald-600 hover:text-white"
            title="Закрыть"
          >
            ×
          </a>

          <!-- Основная карточка профиля -->
          <div class="border-2 border-emerald-600 bg-white p-8 shadow-xl">
            
            <!-- ===== ЗАГОЛОВОК СО СТАТИСТИКОЙ ===== -->
            <div class="mb-8 pb-8 border-b-2 border-emerald-600">
              <!-- Верхняя строка: имя + кнопка связи -->
              <div class="flex justify-between items-start mb-6">
                <div>
                  <!-- Имя кандидата с градиентным текстом -->
                  <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
                    {{ candidate.name }}
                  </h1>
                  <!-- Контактная информация (email, город) -->
                  <div class="flex items-center gap-4 text-gray-600 mb-3">
                    <div class="flex items-center gap-2">
                      <!-- ✉️ - эмодзи вместо Mail иконки -->
                      <span>✉️</span>
                      <span>{{ candidate.email }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <!-- 📍 - эмодзи вместо MapPin иконки -->
                      <span>📍</span>
                      <span>{{ candidate.city }}</span>
                    </div>
                  </div>
                  <!-- Последняя активность -->
                  <div class="text-sm bg-gray-100 border border-gray-300 px-3 py-1 inline-block">
                    Последняя активность: {{ candidate.lastActive }}
                  </div>
                </div>
                <!-- Кнопка "Связаться" с кандидатом -->
                <button class="border-2 border-emerald-600 bg-emerald-600 text-white px-8 py-3 hover:bg-emerald-700 transition-colors font-bold uppercase tracking-wider">
                  Связаться
                </button>
              </div>

              <!-- Карточки статистики (3 колонки) -->
              <div class="grid grid-cols-3 gap-4">
                <!-- Карточка: Рейтинг платформы -->
                <div class="border-2 border-amber-400 bg-amber-50 p-4 text-center">
                  <div class="flex items-center justify-center gap-2 text-amber-600 mb-2">
                    <!-- ⭐ - эмодзи вместо Star иконки -->
                    <span class="text-2xl">⭐</span>
                    <!-- toFixed(1) для форматирования рейтинга -->
                    <span class="text-3xl font-bold">{{ candidate.rating | number:'1.1-1' }}</span>
                  </div>
                  <p class="text-sm font-bold text-amber-700 uppercase">Рейтинг платформы</p>
                </div>
                <!-- Карточка: Выполнено заданий -->
                <div class="border-2 border-emerald-400 bg-emerald-50 p-4 text-center">
                  <div class="flex items-center justify-center gap-2 text-emerald-600 mb-2">
                    <!-- 🏆 - эмодзи вместо Award иконки -->
                    <span class="text-2xl">🏆</span>
                    <span class="text-3xl font-bold">{{ candidate.completedTasksCount }}</span>
                  </div>
                  <p class="text-sm font-bold text-emerald-700 uppercase">Выполнено заданий</p>
                </div>
                <!-- Карточка: Процент успеха -->
                <div class="border-2 border-indigo-400 bg-indigo-50 p-4 text-center">
                  <div class="flex items-center justify-center gap-2 text-indigo-600 mb-2">
                    <!-- 📈 - эмодзи вместо TrendingUp иконки -->
                    <span class="text-2xl">📈</span>
                    <span class="text-3xl font-bold">{{ candidate.successRate }}%</span>
                  </div>
                  <p class="text-sm font-bold text-indigo-700 uppercase">Процент успеха</p>
                </div>
              </div>
            </div>

            <!-- ===== РАЗДЕЛ: О КАНДИДАТЕ ===== -->
            <div class="mb-8">
              <h2 class="font-bold text-xl mb-3 uppercase text-emerald-600">О кандидате</h2>
              <div class="border-2 border-gray-300 bg-gray-50 p-6">
                <p class="text-gray-700 leading-relaxed">{{ candidate.about }}</p>
              </div>
            </div>

            <!-- ===== РАЗДЕЛ: НАВЫКИ И КОМПЕТЕНЦИИ ===== -->
            <div class="mb-8">
              <h2 class="font-bold text-xl mb-3 uppercase text-emerald-600">Навыки и компетенции</h2>
              <div class="border-2 border-emerald-400 bg-emerald-50 p-6">
                <!-- Список навыков с использованием flex-wrap -->
                <div class="flex flex-wrap gap-3">
                  <!-- *ngFor для перебора массива навыков -->
                  <div
                    *ngFor="let skill of candidate.skills; let i = index"
                    [class]="'px-4 py-2 border-2 font-semibold ' + getLevelColor(skill.level)"
                  >
                    {{ skill.name }} • {{ skill.level }}
                  </div>
                </div>
              </div>
            </div>

            <!-- ===== РАЗДЕЛ: ВЫПОЛНЕННЫЕ ЗАДАНИЯ ===== -->
            <div class="mb-8">
              <h2 class="font-bold text-xl mb-3 uppercase text-emerald-600">
                Выполненные задания ({{ candidate.completedTasksCount }})
              </h2>
              <div class="border-2 border-emerald-400 bg-white">
                <div class="space-y-0">
                  <!-- *ngFor для списка отправленных решений -->
                  <a
                    *ngFor="let submission of candidate.submissions; let i = index"
                    [routerLink]="['/submission', submission.id]"
                    class="p-4 border-b-2 border-emerald-200 last:border-b-0 flex items-center gap-4 hover:bg-emerald-50 transition-colors block"
                  >
                    <!-- Иконка выполнения -->
                    <div class="w-10 h-10 border-2 border-emerald-600 bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <!-- ✅ - эмодзи вместо CheckCircle2 иконки -->
                      <span class="text-emerald-600 text-xl">✅</span>
                    </div>
                    <div class="flex-1">
                      <span class="font-semibold text-gray-800 block mb-1">{{ submission.taskTitle }}</span>
                      <span class="text-xs text-gray-500">Нажмите, чтобы посмотреть обратную связь эксперта</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <!-- ===== РАЗДЕЛ: ИСТОРИЯ РЕШЕНИЙ ===== -->
            <!-- Показываем только если есть отправленные решения -->
            <div *ngIf="candidate.submissions.length > 0">
              <h2 class="font-bold text-xl mb-3 uppercase text-emerald-600">История решений</h2>
              <div class="space-y-4">
                <!-- *ngFor для детальной истории каждого решения -->
                <div *ngFor="let submission of candidate.submissions" class="border-2 border-indigo-400 bg-white p-6">
                  <!-- Название задания -->
                  <h3 class="font-bold text-lg mb-3">{{ submission.taskTitle }}</h3>
                  <!-- Мета-информация (дата, репозиторий) -->
                  <div class="flex gap-6 text-sm mb-4">
                    <p>
                      <span class="font-bold">ОТПРАВЛЕНО:</span> {{ submission.submittedDate }}
                    </p>
                    <p>
                      <span class="font-bold">РЕПОЗИТОРИЙ:</span>
                      <a 
                        [href]="submission.githubUrl" 
                        class="underline text-indigo-600 ml-1" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {{ submission.githubUrl }}
                      </a>
                    </p>
                  </div>
                  
                  <!-- Компонент прогресса проверки -->
                  <!-- Передаем статусы через Input-параметры -->
                  <app-review-progress
                    [autoTests]="submission.status.autoTests"
                    [aiAnalysis]="submission.status.aiAnalysis"
                    [expertReview]="submission.status.expertReview"
                  ></app-review-progress>

                  <!-- Комментарий эксперта (показываем если экспертная проверка завершена) -->
                  <div *ngIf="submission.expertReviewResults" class="mt-4 pt-4 border-t-2 border-emerald-400 bg-emerald-50 p-4">
                    <p class="text-sm font-bold mb-2 uppercase text-emerald-700">Комментарий эксперта:</p>
                    <p class="text-sm text-gray-700 leading-relaxed">{{ submission.expertReviewResults.comment }}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </ng-container>
      </div>
    </div>
  `
})
export class CandidateProfileComponent implements OnInit {
  /**
   * ID кандидата из URL параметров
   * Получается через ActivatedRoute
   */
  candidateId: string = '';

  /**
   * Данные найденного кандидата
   * null - если кандидат не найден в mock-данных
   */
  candidate: CandidateRanking | null = null;

  /**
   * Конструктор с внедрением ActivatedRoute
   * ActivatedRoute предоставляет доступ к параметрам текущего маршрута
   */
  constructor(private route: ActivatedRoute) {}

  /**
   * Жизненный цикл Angular - инициализация компонента
   * Вызывается один раз при создании компонента
   * 
   * Здесь мы:
   * 1. Получаем ID кандидата из URL параметров
   * 2. Ищем кандидата в mock-данных
   */
  ngOnInit(): void {
    // Получаем параметр 'id' из URL (например, /candidate/c1)
    this.candidateId = this.route.snapshot.paramMap.get('id') || '';
    
    // Ищем кандидата в массиве рейтинга
    // find() возвращает undefined если не найден, поэтому используем || null
    this.candidate = candidatesRanking.find(c => c.id === this.candidateId) || null;
  }

  /**
   * Метод для получения CSS-классов в зависимости от уровня навыка
   * 
   * @param level - уровень владения навыком ('начинающий' | 'базовый' | 'опытный')
   * @returns строка с CSS-классами для стилизации бейджа навыка
   * 
   * Цветовая схема:
   * - начинающий: янтарный (amber) - новичок в технологии
   * - базовый: индиго - средний уровень
   * - опытный: изумрудный (emerald) - высокий уровень
   * - по умолчанию: серый - неизвестный уровень
   */
  getLevelColor(level: string): string {
    switch (level) {
      case 'начинающий': 
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'базовый': 
        return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case 'опытный': 
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      default: 
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  }
}
