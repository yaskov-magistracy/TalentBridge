/**
 * TaskDetailComponent - Страница деталей задания
 * 
 * Отображает подробную информацию о тестовом задании:
 * - Название, компания, дедлайн
 * - Список технологий
 * - Описание проекта
 * - Требования
 * - Действия в зависимости от режима (available/inprogress)
 * 
 * Поддерживает три режима (определяется query-параметром mode):
 * - 'available' - задание доступно для взятия в работу
 * - 'inprogress' - задание в работе, можно отправить решение
 * - по умолчанию - форма отправки решения (для обратной совместимости)
 * 
 * Используется на маршруте: /task/:id
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../components/navbar.component';
import { TechChipComponent } from '../components/tech-chip.component';
import { availableTasks, Task } from '../data/mock-data';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NavbarComponent,
    TechChipComponent
  ],
  template: `
    <!-- Основной контейнер страницы -->
    <div class="min-h-screen bg-white">
      <!-- Навигационная панель для кандидата -->
      <app-navbar [role]="'candidate'"></app-navbar>

      <div class="max-w-4xl mx-auto px-8 py-8 relative">
        <!-- Кнопка закрытия (возврат на дашборд) -->
        <a routerLink="/candidate-dashboard"
           class="absolute top-0 right-8 text-3xl hover:opacity-70 transition-opacity cursor-pointer"
           title="Закрыть">
          ×
        </a>

        <!-- Сообщение об успешной отправке -->
        <div *ngIf="submitted" class="border-2 border-black p-6 mb-6 bg-gray-100">
          <p class="text-center font-bold">
            ✓ РЕШЕНИЕ ОТПРАВЛЕНО НА ПРОВЕРКУ. ПЕРЕНАПРАВЛЕНИЕ...
          </p>
        </div>

        <!-- Карточка с деталями задания -->
        <div class="border-2 border-black p-8" *ngIf="task">
          <!-- Заголовок: название, компания, дедлайн -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold mb-4">{{ task.title }}</h1>
            <div class="flex items-center gap-6 text-sm mb-4">
              <p>
                <span class="font-bold">КОМПАНИЯ:</span> {{ task.company }}
              </p>
              <p>
                <span class="font-bold">ДЕДЛАЙН:</span> {{ task.deadline }}
              </p>
            </div>
            <!-- Список технологий -->
            <div class="flex gap-2 flex-wrap">
              <app-tech-chip *ngFor="let tech of task.technologies" [name]="tech"></app-tech-chip>
            </div>
          </div>

          <!-- Таймер обратного отсчета -->
          <div class="border-2 border-black p-4 mb-8 text-center">
            <p class="text-sm font-bold">
              ОСТАЛОСЬ ДНЕЙ: {{ daysRemaining }}
            </p>
          </div>

          <!-- Описание проекта -->
          <div class="mb-8">
            <h2 class="font-bold text-xl mb-4 uppercase">Описание проекта</h2>
            <div class="border-2 border-black p-6">
              <p>{{ task.description }}</p>
            </div>
          </div>

          <!-- Требования к заданию -->
          <div class="mb-8">
            <h2 class="font-bold text-xl mb-4 uppercase">Требования</h2>
            <div class="border-2 border-black p-6">
              <ul class="space-y-2">
                <li *ngFor="let req of task.requirements; let i = index" class="flex items-start gap-3">
                  <span class="w-6 h-6 border border-black flex items-center justify-center flex-shrink-0 text-xs">
                    {{ i + 1 }}
                  </span>
                  <span>{{ req }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- ===== ДЕЙСТВИЯ В ЗАВИСИМОСТИ ОТ РЕЖИМА ===== -->
          
          <!-- РЕЖИМ: Доступное задание -->
          <div *ngIf="mode === 'available'" class="flex gap-4">
            <button (click)="takeTask()"
                    class="flex-1 border-2 border-black px-8 py-4 hover:bg-black hover:text-white transition-colors font-bold uppercase tracking-wider">
              Взять задание
            </button>
            <button (click)="showChat = true"
                    class="border-2 border-black px-8 py-4 hover:bg-black hover:text-white transition-colors font-bold uppercase tracking-wider flex items-center gap-2 justify-center">
              <span>💬</span>
              Задать вопрос
            </button>
          </div>

          <!-- РЕЖИМ: Задание в работе - форма отправки решения -->
          <form *ngIf="mode === 'inprogress' || !mode" (ngSubmit)="submitSolution()" #submitForm="ngForm">
            <h2 class="font-bold text-xl mb-4 uppercase">Отправить решение</h2>
            <div class="border-2 border-black p-6 mb-6">
              <label class="block mb-2 font-bold text-sm uppercase">
                Ссылка на GitHub репозиторий
              </label>
              <input
                type="url"
                [(ngModel)]="githubUrl"
                name="githubUrl"
                placeholder="https://github.com/username/repository"
                class="w-full border-2 border-black p-3 text-sm"
                required
                [disabled]="submitted"
              />
            </div>
            
            <button
              type="submit"
              [disabled]="submitted || !githubUrl.trim()"
              class="w-full border-2 border-black px-8 py-4 hover:bg-black hover:text-white transition-colors font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
              Отправить на проверку
            </button>
          </form>
        </div>
      </div>

      <!-- ===== МОДАЛЬНОЕ ОКНО ЧАТА ===== -->
      <div *ngIf="showChat" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
        <div class="bg-white border-2 border-black w-full max-w-2xl max-h-[80vh] flex flex-col">
          <!-- Заголовок чата -->
          <div class="border-b-2 border-black p-4 flex justify-between items-center">
            <h2 class="font-bold uppercase">Чат с компанией</h2>
            <button (click)="showChat = false" class="text-3xl hover:opacity-70 transition-opacity">
              ×
            </button>
          </div>

          <!-- Сообщения чата -->
          <div class="flex-1 p-6 overflow-y-auto space-y-4">
            <div class="border-2 border-black p-4">
              <p class="text-sm font-bold mb-1">КОМПАНИЯ</p>
              <p class="text-sm">Здравствуйте! Чем можем помочь?</p>
            </div>
            <div class="border-2 border-black p-4 bg-gray-50">
              <p class="text-sm font-bold mb-1">ВЫ</p>
              <p class="text-sm">Здравствуйте! Можно уточнить требования к проекту?</p>
            </div>
          </div>

          <!-- Поле ввода сообщения -->
          <div class="border-t-2 border-black p-4">
            <div class="flex gap-2">
              <input
                type="text"
                placeholder="Введите сообщение..."
                class="flex-1 border-2 border-black p-3 text-sm"
              />
              <button class="border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-colors font-bold uppercase text-sm">
                Отправить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Задание не найдено -->
    <div *ngIf="!task" class="min-h-screen bg-white">
      <app-navbar [role]="'candidate'"></app-navbar>
      <div class="max-w-4xl mx-auto px-8 py-8">
        <div class="border-2 border-black p-8 text-center">
          <h2 class="text-xl font-bold">ЗАДАНИЕ НЕ НАЙДЕНО</h2>
        </div>
      </div>
    </div>
  `
})
export class TaskDetailComponent implements OnInit {
  /** ID задания из URL параметра */
  taskId: string = '';
  
  /** Режим отображения: 'available', 'inprogress', или null */
  mode: string | null = null;
  
  /** Данные задания */
  task: Task | undefined;
  
  /** Ссылка на GitHub репозиторий */
  githubUrl: string = '';
  
  /** Флаг отправки решения */
  submitted: boolean = false;
  
  /** Флаг отображения чата */
  showChat: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Инициализация компонента
   * Получает ID задания и режим из URL, загружает данные задания
   */
  ngOnInit(): void {
    // Получаем ID задания из параметров маршрута
    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    
    // Получаем режим из query-параметров
    this.mode = this.route.snapshot.queryParamMap.get('mode');
    
    // Ищем задание в mock данных
    this.task = availableTasks.find(t => t.id === this.taskId);
  }

  /**
   * Вычисляет количество оставшихся дней до дедлайна
   */
  get daysRemaining(): number {
    if (!this.task) return 0;
    const deadline = new Date(this.task.deadline);
    const now = new Date();
    return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Обработчик взятия задания в работу
   * В реальном приложении здесь был бы API запрос
   */
  takeTask(): void {
    alert('Задание взято в работу!');
    this.router.navigate(['/candidate-dashboard']);
  }

  /**
   * Обработчик отправки решения
   * В реальном приложении здесь был бы API запрос
   */
  submitSolution(): void {
    if (this.githubUrl.trim()) {
      this.submitted = true;
      // Через 2 секунды перенаправляем на дашборд
      setTimeout(() => {
        this.router.navigate(['/candidate-dashboard']);
      }, 2000);
    }
  }
}
