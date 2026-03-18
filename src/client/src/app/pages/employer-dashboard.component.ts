/**
 * EmployerDashboardComponent - Панель работодателя
 * 
 * Главная страница для работодателей. Содержит:
 * - Список опубликованных заданий с количеством решений
 * - Таблицу кандидатов с их решениями и статусами
 * - Модальное окно экспертной проверки решений
 * 
 * Функциональность:
 * - Просмотр опубликованных заданий
 * - Редактирование и активация/деактивация заданий
 * - Просмотр списка кандидатов
 * - Экспертная проверка решений (одобрение/отклонение)
 * - Навигация к рейтингу кандидатов и созданию заданий
 * 
 * Используется на маршруте: /employer-dashboard
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../components/navbar.component';
import { StatusBadgeComponent } from '../components/status-badge.component';
import { employerTasks, employerCandidates, allSubmissions, Submission } from '../data/mock-data';

/**
 * Тип решения эксперта
 */
type ExpertDecision = 'approve' | 'reject' | null;

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NavbarComponent,
    StatusBadgeComponent
  ],
  template: `
    <!-- Основной контейнер с градиентным фоном -->
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <!-- Навигационная панель для работодателя -->
      <app-navbar [role]="'employer'"></app-navbar>

      <div class="max-w-7xl mx-auto px-8 py-8">
        
        <!-- ===== ЗАГОЛОВОК И КНОПКИ ДЕЙСТВИЙ ===== -->
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold uppercase text-emerald-600">Панель работодателя</h1>
          <div class="flex gap-4">
            <!-- Кнопка перехода к рейтингу кандидатов -->
            <a routerLink="/candidates-ranking"
               class="border-2 border-emerald-600 px-6 py-3 hover:bg-emerald-600 hover:text-white transition-colors font-bold uppercase tracking-wider flex items-center gap-2 bg-white">
              <span>🏆</span>
              Рейтинг кандидатов
            </a>
            <!-- Кнопка создания нового задания -->
            <a routerLink="/create-task"
               class="border-2 border-indigo-600 bg-indigo-600 text-white px-8 py-3 hover:bg-indigo-700 transition-colors font-bold uppercase tracking-wider">
              + Создать задание
            </a>
          </div>
        </div>

        <!-- ===== СПИСОК ОПУБЛИКОВАННЫХ ЗАДАНИЙ ===== -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold mb-6 uppercase text-emerald-600">Опубликованные задания</h2>
          <div class="space-y-4">
            <div *ngFor="let task of publishedTasks" class="border-2 border-emerald-400 bg-white p-6 shadow-md">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-bold text-lg mb-2">{{ task.title }}</h3>
                  <div class="flex gap-6 text-sm">
                    <p>
                      <span class="font-bold">РЕШЕНИЙ:</span> {{ task.submissionsCount }}
                    </p>
                    <p>
                      <span class="font-bold">ДЕДЛАЙН:</span> {{ task.deadline }}
                    </p>
                    <p>
                      <span class="font-bold">СТАТУС:</span>
                      <span [ngClass]="task.active ? 'text-emerald-600 font-bold' : 'text-gray-500'">
                        {{ task.active ? 'АКТИВНО' : 'ЗАВЕРШЕНО' }}
                      </span>
                    </p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <a [routerLink]="['/edit-task', task.id]"
                     class="border-2 border-indigo-600 px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors text-sm uppercase font-semibold">
                    Редактировать
                  </a>
                  <button class="border-2 border-gray-400 px-4 py-2 hover:bg-gray-100 text-sm uppercase font-semibold">
                    {{ task.active ? 'Деактивировать' : 'Активировать' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== ТАБЛИЦА КАНДИДАТОВ ===== -->
        <div>
          <h2 class="text-2xl font-bold mb-6 uppercase text-emerald-600">Кандидаты и решения</h2>
          <div class="border-2 border-emerald-600 bg-white shadow-md">
            <!-- Заголовок таблицы -->
            <div class="grid grid-cols-6 gap-4 p-4 bg-emerald-50 border-b-2 border-emerald-600 font-bold text-sm uppercase">
              <div>Кандидат</div>
              <div>Задание</div>
              <div>Дата отправки</div>
              <div>Этап</div>
              <div>Статус</div>
              <div>Действия</div>
            </div>

            <!-- Строки таблицы -->
            <div *ngFor="let candidate of candidatesList"
                 class="grid grid-cols-6 gap-4 p-4 border-b-2 border-emerald-200 last:border-b-0 items-center text-sm hover:bg-emerald-50 transition-colors">
              <!-- Имя кандидата (ссылка на профиль) -->
              <a [routerLink]="['/candidate', candidate.id]"
                 class="font-bold hover:underline text-indigo-600">
                {{ candidate.name }}
              </a>
              <div>{{ candidate.taskTitle }}</div>
              <div>{{ candidate.submittedDate }}</div>
              <!-- Текущий этап проверки -->
              <div class="uppercase text-xs">
                <span *ngIf="candidate.currentStage === 'autoTests'">1. Автотесты</span>
                <span *ngIf="candidate.currentStage === 'aiAnalysis'">2. AI-анализ</span>
                <span *ngIf="candidate.currentStage === 'expertReview'">3. Эксперт</span>
              </div>
              <!-- Статус -->
              <div>
                <app-status-badge [status]="candidate.stageStatus"></app-status-badge>
              </div>
              <!-- Действия -->
              <div>
                <!-- Кнопка проверки (только для решений на экспертной проверке) -->
                <button *ngIf="candidate.currentStage === 'expertReview' && candidate.stageStatus === 'pending'"
                        (click)="openReviewModal(candidate.submissionId)"
                        class="border-2 border-indigo-600 bg-indigo-600 text-white px-4 py-1 hover:bg-indigo-700 transition-colors text-xs uppercase font-semibold">
                  Проверить
                </button>
                <!-- Ссылка на профиль (если решение одобрено) -->
                <a *ngIf="candidate.stageStatus === 'approved'"
                   [routerLink]="['/candidate', candidate.id]"
                   class="border-2 border-emerald-600 px-4 py-1 inline-block hover:bg-emerald-600 hover:text-white transition-colors text-xs uppercase font-semibold">
                  Профиль
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== МОДАЛЬНОЕ ОКНО ЭКСПЕРТНОЙ ПРОВЕРКИ ===== -->
      <div *ngIf="reviewModalOpen && selectedSubmission" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
        <div class="bg-white border-2 border-indigo-600 w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
          <!-- Заголовок модального окна -->
          <div class="border-b-2 border-indigo-600 p-6 flex justify-between items-center bg-indigo-50">
            <div>
              <h2 class="font-bold text-2xl uppercase text-indigo-600">Экспертная проверка</h2>
              <p class="text-sm text-gray-600 mt-1">{{ selectedSubmission.taskTitle }}</p>
            </div>
            <button (click)="closeReviewModal()" class="text-4xl hover:opacity-70 transition-opacity">
              ×
            </button>
          </div>

          <!-- Содержимое модального окна -->
          <div class="flex-1 p-6 overflow-y-auto space-y-6">
            <!-- Ссылка на репозиторий -->
            <div class="border-2 border-indigo-400 bg-indigo-50 p-4">
              <h3 class="font-bold mb-2 text-sm uppercase tracking-wider text-indigo-700">Репозиторий решения</h3>
              <a [href]="selectedSubmission.githubUrl"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="flex items-center gap-2 text-indigo-600 hover:underline font-semibold">
                <span>🔗</span>
                {{ selectedSubmission.githubUrl }}
              </a>
            </div>

            <!-- Результаты автотестов -->
            <div *ngIf="selectedSubmission.autoTestsResults" class="border-2 border-emerald-400 bg-white p-6">
              <div class="flex items-center gap-3 mb-4">
                <span class="text-2xl">✅</span>
                <h3 class="font-bold text-lg uppercase text-emerald-600">Результаты автотестов</h3>
              </div>
              <div class="mb-4">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-3xl font-bold text-emerald-600">
                    {{ selectedSubmission.autoTestsResults.passed }}/{{ selectedSubmission.autoTestsResults.total }}
                  </span>
                  <span class="text-gray-600">тестов пройдено</span>
                </div>
                <!-- Прогресс-бар -->
                <div class="w-full bg-gray-200 h-3 border-2 border-gray-400">
                  <div class="bg-emerald-600 h-full"
                       [style.width.%]="(selectedSubmission.autoTestsResults.passed / selectedSubmission.autoTestsResults.total) * 100">
                  </div>
                </div>
              </div>
              <!-- Список тестов -->
              <div class="space-y-2">
                <div *ngFor="let test of selectedSubmission.autoTestsResults.tests; let idx = index"
                     class="flex items-center gap-3 p-2 bg-gray-50 border border-gray-300">
                  <span *ngIf="test.passed" class="text-emerald-600">✅</span>
                  <span *ngIf="!test.passed" class="text-red-600">❌</span>
                  <span [ngClass]="test.passed ? 'text-gray-700' : 'text-red-700 font-semibold'">
                    {{ test.name }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Результаты AI-анализа -->
            <div *ngIf="selectedSubmission.aiAnalysisResults" class="border-2 border-amber-400 bg-white p-6">
              <div class="flex items-center gap-3 mb-4">
                <span class="text-2xl">⚠️</span>
                <h3 class="font-bold text-lg uppercase text-amber-600">Анализ AI: Замечания и рекомендации</h3>
              </div>
              <div class="space-y-3">
                <div *ngFor="let issue of selectedSubmission.aiAnalysisResults.issues; let idx = index"
                     class="border-l-4 border-amber-500 bg-amber-50 p-4">
                  <p class="font-bold text-sm text-amber-700 mb-1 uppercase">{{ issue.category }}</p>
                  <p class="text-gray-700">{{ issue.description }}</p>
                </div>
              </div>
            </div>

            <!-- Форма экспертного отзыва -->
            <div class="border-2 border-indigo-600 bg-indigo-50 p-6">
              <h3 class="font-bold text-lg uppercase text-indigo-600 mb-4">Ваш отзыв эксперта</h3>
              
              <!-- Выбор решения (одобрить/отклонить) -->
              <div class="mb-4">
                <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
                  Решение эксперта
                </label>
                <div class="flex gap-4">
                  <button (click)="setDecision('approve')"
                          [ngClass]="expertDecision === 'approve' 
                            ? 'border-emerald-600 bg-emerald-600 text-white' 
                            : 'border-emerald-600 bg-white text-emerald-600 hover:bg-emerald-50'"
                          class="flex-1 border-2 px-6 py-3 font-bold uppercase transition-colors">
                    ✓ Одобрить
                  </button>
                  <button (click)="setDecision('reject')"
                          [ngClass]="expertDecision === 'reject' 
                            ? 'border-red-600 bg-red-600 text-white' 
                            : 'border-red-600 bg-white text-red-600 hover:bg-red-50'"
                          class="flex-1 border-2 px-6 py-3 font-bold uppercase transition-colors">
                    ✗ Отклонить
                  </button>
                </div>
              </div>

              <!-- Комментарий эксперта -->
              <div>
                <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
                  Комментарий для кандидата
                </label>
                <textarea
                  [(ngModel)]="expertComment"
                  class="w-full border-2 border-black p-3 min-h-[150px]"
                  placeholder="Опишите сильные и слабые стороны решения, дайте рекомендации..."
                  rows="6">
                </textarea>
              </div>
            </div>
          </div>

          <!-- Футер модального окна -->
          <div class="border-t-2 border-indigo-600 p-6 flex gap-3 bg-gray-50">
            <button (click)="submitReview()"
                    [disabled]="!expertDecision || !expertComment.trim()"
                    [ngClass]="expertDecision && expertComment.trim()
                      ? 'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'border-gray-300 bg-gray-300 text-gray-500 cursor-not-allowed'"
                    class="flex-1 border-2 px-6 py-3 font-bold uppercase transition-colors">
              Отправить отзыв
            </button>
            <button (click)="closeReviewModal()"
                    class="border-2 border-gray-400 px-6 py-3 hover:bg-gray-100 transition-colors font-bold uppercase">
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployerDashboardComponent {
  /** Массив опубликованных заданий из mock данных */
  publishedTasks = employerTasks;
  
  /** Массив кандидатов из mock данных */
  candidatesList = employerCandidates;
  
  /** Флаг открытия модального окна проверки */
  reviewModalOpen: boolean = false;
  
  /** ID выбранного решения для проверки */
  selectedSubmissionId: string | null = null;
  
  /** Комментарий эксперта */
  expertComment: string = '';
  
  /** Решение эксперта: 'approve', 'reject' или null */
  expertDecision: ExpertDecision = null;

  /**
   * Получает данные выбранного решения
   */
  get selectedSubmission(): Submission | null {
    if (!this.selectedSubmissionId) return null;
    return allSubmissions.find(s => s.id === this.selectedSubmissionId) || null;
  }

  /**
   * Открывает модальное окно экспертной проверки
   * @param submissionId - ID решения для проверки
   */
  openReviewModal(submissionId: string): void {
    this.selectedSubmissionId = submissionId;
    this.reviewModalOpen = true;
    this.expertComment = '';
    this.expertDecision = null;
  }

  /**
   * Закрывает модальное окно и сбрасывает состояние
   */
  closeReviewModal(): void {
    this.reviewModalOpen = false;
    this.selectedSubmissionId = null;
    this.expertComment = '';
    this.expertDecision = null;
  }

  /**
   * Устанавливает решение эксперта
   * @param decision - 'approve' или 'reject'
   */
  setDecision(decision: 'approve' | 'reject'): void {
    this.expertDecision = decision;
  }

  /**
   * Отправляет экспертный отзыв
   * В реальном приложении здесь был бы API запрос
   */
  submitReview(): void {
    console.log('Submitting review:', {
      submissionId: this.selectedSubmissionId,
      comment: this.expertComment,
      decision: this.expertDecision
    });
    alert(`Отзыв ${this.expertDecision === 'approve' ? 'одобрен' : 'отклонен'} и отправлен кандидату!`);
    this.closeReviewModal();
  }
}
