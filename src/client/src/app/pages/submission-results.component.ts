import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../components/navbar.component';
import { StatusBadgeComponent } from '../components/status-badge.component';
import { ReviewProgressComponent } from '../components/review-progress.component';
import { candidateSubmissions, Submission } from '../data/mock-data';

/**
 * Интерфейс для итогового вердикта проверки решения
 * Содержит текстовое описание и статус для компонента StatusBadge
 */
interface Verdict {
  text: string;
  status: 'approved' | 'rejected' | 'failed' | 'pending';
}

/**
 * SubmissionResultsComponent - Страница результатов проверки решения
 * 
 * Отображает детальные результаты проверки отправленного кандидатом решения.
 * Компонент получает ID отправки из URL параметров, находит соответствующую
 * запись в mock-данных и отображает:
 * 
 * - Общую информацию о решении (название задачи, дата отправки, репозиторий)
 * - Прогресс проверки (автотесты, AI-анализ, экспертное ревью)
 * - Итоговый вердикт
 * - Детальные результаты автотестов с прогресс-баром
 * - Список замечаний от AI-анализа
 * - Комментарий эксперта и статус экспертного ревью
 * 
 * Используется на маршруте: /submission/:id
 */
@Component({
  selector: 'app-submission-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    StatusBadgeComponent,
    ReviewProgressComponent
  ],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Навигационная панель для кандидата -->
      <app-navbar [role]="'candidate'"></app-navbar>

      <div class="max-w-6xl mx-auto px-8 py-8 relative">
        <!-- Кнопка закрытия - возвращает на дашборд кандидата -->
        <a
          routerLink="/candidate-dashboard"
          class="absolute top-0 right-8 text-3xl hover:opacity-70 transition-opacity cursor-pointer"
          title="Закрыть"
        >
          ×
        </a>

        <!-- Заголовок с основной информацией о решении -->
        <div class="border-2 border-black p-8 mb-8" *ngIf="submission">
          <h1 class="text-2xl font-bold mb-4">{{ submission.taskTitle }}</h1>
          <p class="text-sm mb-6">
            <span class="font-bold">ОТПРАВЛЕНО:</span> {{ submission.submittedDate }} |
            <span class="font-bold ml-4">РЕПОЗИТОРИЙ:</span> {{ submission.githubUrl }}
          </p>
          
          <!-- Компонент прогресса проверки - показывает статус трёх этапов -->
          <div class="mb-6">
            <app-review-progress
              [autoTests]="submission.status.autoTests"
              [aiAnalysis]="submission.status.aiAnalysis"
              [expertReview]="submission.status.expertReview">
            </app-review-progress>
          </div>

          <!-- Итоговая оценка с визуальным бейджем статуса -->
          <div class="flex items-center gap-4">
            <span class="font-bold uppercase text-sm">Итоговая оценка:</span>
            <app-status-badge [status]="verdict.status"></app-status-badge>
            <span class="text-xl font-bold">{{ verdict.text }}</span>
          </div>
        </div>

        <!-- Сообщение если решение не найдено -->
        <div *ngIf="!submission" class="border-2 border-black p-8 text-center">
          <h2 class="text-xl font-bold">РЕШЕНИЕ НЕ НАЙДЕНО</h2>
        </div>

        <!-- Разделы с детальными результатами -->
        <div class="space-y-8" *ngIf="submission">
          
          <!-- Раздел 1: Результаты автотестов -->
          <div class="border-2 border-black">
            <div class="bg-gray-100 p-4 border-b-2 border-black">
              <h2 class="font-bold uppercase text-lg">1. Автотесты</h2>
            </div>
            <div class="p-6">
              <!-- Показываем результаты, если они доступны -->
              <ng-container *ngIf="submission.autoTestsResults; else noAutoTests">
                <div class="mb-6">
                  <!-- Сводка по тестам -->
                  <p class="text-2xl font-bold mb-2">
                    {{ submission.autoTestsResults.passed }} / {{ submission.autoTestsResults.total }} тестов пройдено
                  </p>
                  <!-- Визуальный прогресс-бар с динамической шириной -->
                  <div class="w-full h-8 border-2 border-black">
                    <div
                      class="h-full bg-black"
                      [style.width.%]="(submission.autoTestsResults.passed / submission.autoTestsResults.total) * 100">
                    </div>
                  </div>
                </div>

                <!-- Список отдельных тестов с их статусами -->
                <div class="space-y-3">
                  <div *ngFor="let test of submission.autoTestsResults.tests; let i = index"
                       class="border border-black p-4 flex items-center justify-between">
                    <span class="font-mono text-sm">{{ test.name }}</span>
                    <app-status-badge [status]="test.passed ? 'passed' : 'failed'"></app-status-badge>
                  </div>
                </div>
              </ng-container>
              
              <!-- Плейсхолдер, если результаты ещё не готовы -->
              <ng-template #noAutoTests>
                <p class="text-gray-500">Результаты автотестов пока недоступны</p>
              </ng-template>
            </div>
          </div>

          <!-- Раздел 2: AI-анализ кода -->
          <div class="border-2 border-black">
            <div class="bg-gray-100 p-4 border-b-2 border-black">
              <h2 class="font-bold uppercase text-lg">2. AI-анализ</h2>
            </div>
            <div class="p-6">
              <!-- Показываем замечания AI, если анализ завершён -->
              <ng-container *ngIf="submission.aiAnalysisResults; else noAiAnalysis">
                <p class="mb-4 font-bold">
                  Обнаружено замечаний: {{ submission.aiAnalysisResults.issues.length }}
                </p>
                <div class="space-y-4">
                  <!-- Карточка для каждого замечания с нумерацией -->
                  <div *ngFor="let issue of submission.aiAnalysisResults.issues; let i = index"
                       class="border border-black p-4">
                    <div class="flex items-start gap-4">
                      <div class="w-8 h-8 border border-black flex items-center justify-center flex-shrink-0">
                        {{ i + 1 }}
                      </div>
                      <div class="flex-1">
                        <p class="font-bold text-sm mb-2 uppercase">{{ issue.category }}</p>
                        <p class="text-sm">{{ issue.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ng-container>
              
              <!-- Плейсхолдер, если AI-анализ ещё выполняется -->
              <ng-template #noAiAnalysis>
                <p class="text-gray-500">AI-анализ еще не завершен</p>
              </ng-template>
            </div>
          </div>

          <!-- Раздел 3: Экспертное ревью -->
          <div class="border-2 border-black">
            <div class="bg-gray-100 p-4 border-b-2 border-black">
              <h2 class="font-bold uppercase text-lg">3. Экспертное ревью</h2>
            </div>
            <div class="p-6">
              <!-- Показываем результаты ревью, если оно завершено -->
              <ng-container *ngIf="submission.expertReviewResults; else noExpertReview">
                <div class="space-y-4">
                  <div class="flex items-center gap-4 mb-4">
                    <span class="font-bold">СТАТУС:</span>
                    <app-status-badge 
                      [status]="submission.expertReviewResults.approved ? 'approved' : 'rejected'">
                    </app-status-badge>
                  </div>
                  <!-- Комментарий эксперта -->
                  <div class="border-2 border-black p-6">
                    <p class="font-bold mb-2 uppercase text-sm">Комментарий эксперта:</p>
                    <p class="leading-relaxed">{{ submission.expertReviewResults.comment }}</p>
                  </div>
                </div>
              </ng-container>
              
              <!-- Плейсхолдер с информацией об ожидании -->
              <ng-template #noExpertReview>
                <div class="border-2 border-black p-6 text-center">
                  <p class="font-bold">⏳ ОЖИДАНИЕ ПРОВЕРКИ ЭКСПЕРТА</p>
                  <p class="text-sm mt-2">Эксперт рассмотрит ваше решение в течение 3-5 рабочих дней</p>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SubmissionResultsComponent implements OnInit {
  /** ID отправки, полученный из URL параметров маршрута */
  submissionId: string = '';
  
  /** Найденная запись о отправке или undefined если не найдена */
  submission: Submission | undefined;

  /**
   * Конструктор компонента
   * @param route - ActivatedRoute для получения параметров URL
   */
  constructor(private route: ActivatedRoute) {}

  /**
   * Жизненный цикл OnInit - вызывается при инициализации компонента
   * Загружает ID из параметров маршрута и ищет соответствующую запись
   */
  ngOnInit(): void {
    // Получаем параметр id из URL
    this.submissionId = this.route.snapshot.paramMap.get('id') || '';
    
    // Ищем отправку в mock-данных по ID
    this.submission = candidateSubmissions.find(s => s.id === this.submissionId);
  }

  /**
   * Геттер для вычисления итогового вердикта на основе статусов проверки
   * 
   * Логика определения вердикта (по приоритету):
   * 1. Если экспертное ревью одобрено → "ОДОБРЕНО"
   * 2. Если экспертное ревью отклонено → "ОТКЛОНЕНО"
   * 3. Если AI-анализ не пройден → "ТРЕБУЕТСЯ ДОРАБОТКА"
   * 4. Если автотесты не пройдены → "НЕ ПРОШЛО АВТОТЕСТЫ"
   * 5. Во всех остальных случаях → "В ПРОЦЕССЕ ПРОВЕРКИ"
   * 
   * @returns Объект Verdict с текстом и статусом для бейджа
   */
  get verdict(): Verdict {
    if (!this.submission) {
      return { text: 'НЕ НАЙДЕНО', status: 'pending' };
    }

    const { status } = this.submission;

    // Приоритет: экспертное ревью имеет наибольший вес
    if (status.expertReview === 'approved') {
      return { text: 'ОДОБРЕНО', status: 'approved' };
    }
    if (status.expertReview === 'rejected') {
      return { text: 'ОТКЛОНЕНО', status: 'rejected' };
    }
    
    // Затем проверяем AI-анализ
    if (status.aiAnalysis === 'failed') {
      return { text: 'ТРЕБУЕТСЯ ДОРАБОТКА', status: 'failed' };
    }
    
    // Затем автотесты
    if (status.autoTests === 'failed') {
      return { text: 'НЕ ПРОШЛО АВТОТЕСТЫ', status: 'failed' };
    }
    
    // Если ничего из вышеперечисленного - в процессе
    return { text: 'В ПРОЦЕССЕ ПРОВЕРКИ', status: 'pending' };
  }
}
