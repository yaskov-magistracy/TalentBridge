/**
 * CandidateDashboardComponent - Панель управления кандидата
 * 
 * Основная страница личного кабинета кандидата (junior разработчика).
 * Предоставляет полный функционал для управления профилем, просмотра и 
 * выполнения тестовых заданий, отслеживания прогресса проверки решений.
 * 
 * === ФУНКЦИОНАЛ ===
 * 
 * 1. ПРОФИЛЬ КАНДИДАТА
 *    - Отображение ФИО, города, информации о себе
 *    - Список навыков с уровнем владения (начинающий/базовый/опытный)
 *    - Редактирование профиля через модальное окно
 *    - Добавление/удаление/изменение уровня навыков
 * 
 * 2. ДОСТУПНЫЕ ЗАДАНИЯ
 *    - Список всех заданий, доступных для выполнения
 *    - Фильтрация по технологиям (чекбоксы в сайдбаре)
 *    - Переход к детальной странице задания
 * 
 * 3. ЗАДАНИЯ В РАБОТЕ
 *    - Задания, которые кандидат взял в работу
 *    - Быстрый доступ к чату с компанией
 *    - Ссылка на страницу выполнения задания
 * 
 * 4. ВЫПОЛНЕННЫЕ ЗАДАНИЯ
 *    - История отправленных решений
 *    - Статус проверки (автотесты, AI-анализ, экспертное ревью)
 *    - Комментарии экспертов
 *    - Итоговое решение (одобрено/отклонено)
 * 
 * 5. ЧАТ С КОМПАНИЕЙ
 *    - Модальное окно для общения с работодателем
 *    - Доступен из заданий в работе и выполненных заданий
 * 
 * === ТЕХНИЧЕСКИЕ ОСОБЕННОСТИ ===
 * 
 * - Использует standalone компоненты Angular
 * - Данные загружаются из mock-data.ts (в продакшене - с API)
 * - Двустороннее связывание (ngModel) для форм редактирования
 * - Условное отображение через *ngIf и *ngFor
 * - Эмодзи вместо иконок Lucide (👤 ✏️ ➕ 🗑️ ✅ ❌ 💬)
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Импорт shared компонентов
import { NavbarComponent } from '../components/navbar.component';
import { TechChipComponent } from '../components/tech-chip.component';
import { ReviewProgressComponent } from '../components/review-progress.component';

// Импорт mock данных
import { 
  availableTasks, 
  candidateSubmissions, 
  tasksInProgress as initialTasksInProgress 
} from '../data/mock-data';

// ============================================================
// ИНТЕРФЕЙСЫ
// ============================================================

/**
 * Уровень владения навыком
 * Используется в профиле кандидата для обозначения компетенции
 */
type SkillLevel = 'начинающий' | 'базовый' | 'опытный';

/**
 * Интерфейс навыка кандидата
 * Содержит название технологии и уровень владения
 */
interface Skill {
  /** Название навыка (например, 'React', 'Python') */
  name: string;
  /** Уровень владения: начинающий / базовый / опытный */
  level: SkillLevel;
}

/**
 * Интерфейс профиля кандидата
 * Хранит всю личную информацию пользователя
 */
interface CandidateProfile {
  /** Полное имя кандидата */
  fullName: string;
  /** Город проживания */
  city: string;
  /** Описание о себе, опыт, ожидания */
  about: string;
  /** Список навыков с уровнями */
  skills: Skill[];
}

/**
 * Новый навык для добавления
 * Используется во время редактирования профиля
 */
interface NewSkill {
  /** Название нового навыка */
  name: string;
  /** Уровень нового навыка */
  level: SkillLevel;
}

// ============================================================
// КОМПОНЕНТ
// ============================================================

@Component({
  // Селектор для использования в роутинге
  selector: 'app-candidate-dashboard',
  
  // standalone: true позволяет использовать компонент без NgModule
  standalone: true,
  
  // Импортируемые модули и компоненты
  imports: [
    CommonModule,        // Стандартные директивы Angular (*ngIf, *ngFor)
    FormsModule,         // Двустороннее связывание [(ngModel)]
    RouterLink,          // Навигация [routerLink]
    NavbarComponent,     // Навигационная панель
    TechChipComponent,   // Чипы технологий
    ReviewProgressComponent  // Прогресс проверки решения
  ],
  
  // Inline-шаблон компонента
  template: `
    <!-- 
      Основной контейнер страницы
      - min-h-screen: минимальная высота = высота экрана
      - bg-gradient-to-br: градиент от slate-50 к indigo-50
    -->
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      
      <!-- ===== НАВИГАЦИОННАЯ ПАНЕЛЬ ===== -->
      <!-- Передаем роль 'candidate' для отображения соответствующих элементов -->
      <app-navbar [role]="'candidate'"></app-navbar>

      <!-- ===== ОСНОВНОЙ КОНТЕНТ ===== -->
      <div class="max-w-7xl mx-auto px-8 py-8">
        
        <!-- ===== СЕКЦИЯ ПРОФИЛЯ ===== -->
        <div class="mb-8 border-2 border-indigo-600 bg-white p-6 shadow-lg">
          <!-- Заголовок профиля с кнопкой редактирования -->
          <div class="flex justify-between items-start mb-6">
            <!-- Аватар и заголовок -->
            <div class="flex items-center gap-3">
              <!-- Иконка пользователя (эмодзи 👤 вместо Lucide User) -->
              <div class="w-16 h-16 bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center text-3xl">
                👤
              </div>
              <div>
                <h2 class="text-2xl font-bold text-indigo-600">МОЙ ПРОФИЛЬ</h2>
                <p class="text-sm text-gray-600">Информация о кандидате</p>
              </div>
            </div>
            <!-- Кнопка редактирования профиля -->
            <button
              (click)="openProfileEdit()"
              class="border-2 border-indigo-600 px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors font-semibold uppercase text-sm flex items-center gap-2"
            >
              <span>✏️</span>
              Редактировать
            </button>
          </div>

          <!-- Сетка с ФИО и городом -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">ФИО</p>
              <p class="font-semibold text-lg">{{ profile.fullName }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Город</p>
              <p class="font-semibold text-lg">{{ profile.city }}</p>
            </div>
          </div>

          <!-- Описание "О себе" -->
          <div class="mt-4">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">О себе</p>
            <p class="text-gray-700 leading-relaxed">{{ profile.about }}</p>
          </div>

          <!-- Список навыков -->
          <div class="mt-6">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Навыки</p>
            <div class="flex flex-wrap gap-2">
              <!-- *ngFor для перебора навыков -->
              <div
                *ngFor="let skill of profile.skills; let i = index"
                class="px-3 py-1.5 border-2 font-semibold text-sm {{ getLevelColor(skill.level) }}"
              >
                {{ skill.name }} • {{ skill.level }}
              </div>
            </div>
          </div>
        </div>

        <!-- ===== ДВУХКОЛОНОЧНЫЙ МАКЕТ ===== -->
        <div class="flex gap-8">
          
          <!-- ===== САЙДБАР - ФИЛЬТРЫ ===== -->
          <div class="w-64 flex-shrink-0">
            <div class="border-2 border-indigo-600 bg-white p-6 shadow-md">
              <h3 class="font-bold mb-4 text-sm uppercase tracking-wider text-indigo-600">Фильтр по технологиям</h3>
              <div class="space-y-3">
                <!-- *ngFor для списка всех технологий -->
                <label *ngFor="let tech of allTechs" class="flex items-center gap-2 cursor-pointer text-sm">
                  <!-- Чекбокс фильтра с двусторонним связыванием -->
                  <input
                    type="checkbox"
                    [checked]="selectedTechs.includes(tech)"
                    (change)="toggleTech(tech)"
                    class="w-4 h-4 border-2 border-black"
                  />
                  <span>{{ tech }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- ===== ОСНОВНОЙ КОНТЕНТ ===== -->
          <div class="flex-1">
            
            <!-- ===== ДОСТУПНЫЕ ЗАДАНИЯ ===== -->
            <div class="mb-12">
              <h2 class="text-2xl font-bold mb-6 uppercase text-indigo-600">Доступные задания</h2>
              <div class="space-y-4">
                <!-- *ngFor для отфильтрованных заданий -->
                <a
                  *ngFor="let task of filteredTasks"
                  [routerLink]="['/task', task.id]"
                  [queryParams]="{ mode: 'available' }"
                  class="border-2 border-indigo-400 bg-white p-6 block hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <h3 class="font-bold text-lg mb-2">{{ task.title }}</h3>
                      <p class="text-sm mb-2">
                        <span class="font-bold">КОМПАНИЯ:</span> {{ task.company }}
                      </p>
                    </div>
                  </div>
                  <p class="text-sm mb-3">
                    <span class="font-bold">ДЕДЛАЙН:</span> {{ task.deadline }}
                  </p>
                  <!-- Технологии задания через TechChipComponent -->
                  <div class="flex gap-2 flex-wrap">
                    <app-tech-chip *ngFor="let tech of task.technologies" [name]="tech"></app-tech-chip>
                  </div>
                </a>
              </div>
            </div>

            <!-- ===== ЗАДАНИЯ В РАБОТЕ ===== -->
            <!-- *ngIf - показываем только если есть задания в работе -->
            <div class="mb-12" *ngIf="inProgressTasks.length > 0">
              <h2 class="text-2xl font-bold mb-6 uppercase text-amber-600">В работе</h2>
              <div class="space-y-4">
                <div *ngFor="let task of inProgressTasks" class="border-2 border-amber-400 bg-white p-6 shadow-md">
                  <!-- Ссылка на страницу задания -->
                  <a
                    [routerLink]="['/task', task.id]"
                    [queryParams]="{ mode: 'inprogress' }"
                    class="block hover:bg-gray-50 transition-colors -m-6 p-6 mb-0"
                  >
                    <h3 class="font-bold text-lg mb-2">{{ task.title }}</h3>
                    <p class="text-sm mb-2">
                      <span class="font-bold">КОМПАНИЯ:</span> {{ task.company }}
                    </p>
                    <p class="text-sm mb-3">
                      <span class="font-bold">ДЕДЛАЙН:</span> {{ task.deadline }}
                    </p>
                    <div class="flex gap-2 flex-wrap">
                      <app-tech-chip *ngFor="let tech of task.technologies" [name]="tech"></app-tech-chip>
                    </div>
                  </a>
                  <!-- Кнопка открытия чата -->
                  <button
                    (click)="openChat(task.id)"
                    class="border-2 border-indigo-600 px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors text-sm uppercase tracking-wider flex items-center gap-2 mt-4 font-semibold"
                  >
                    <span>💬</span>
                    Чат с компанией
                  </button>
                </div>
              </div>
            </div>

            <!-- ===== ВЫПОЛНЕННЫЕ ЗАДАНИЯ ===== -->
            <div>
              <h2 class="text-2xl font-bold mb-6 uppercase text-emerald-600">Выполненные задания</h2>
              <div class="space-y-4">
                <div *ngFor="let submission of candidateSubmissions" class="border-2 border-emerald-400 bg-white p-6 shadow-md">
                  <a
                    [routerLink]="['/submission', submission.id]"
                    class="block hover:bg-gray-50 transition-colors -m-6 p-6 mb-0"
                  >
                    <!-- Заголовок и статус -->
                    <div class="flex justify-between items-start mb-3">
                      <h3 class="font-bold text-lg">{{ submission.taskTitle }}</h3>
                      <!-- Статус одобрено -->
                      <div *ngIf="submission.status.expertReview === 'approved'" class="flex items-center gap-1 text-emerald-600 font-semibold text-sm">
                        <span>✅</span>
                        ОДОБРЕНО
                      </div>
                      <!-- Статус отклонено -->
                      <div *ngIf="submission.status.expertReview === 'rejected'" class="flex items-center gap-1 text-red-600 font-semibold text-sm">
                        <span>❌</span>
                        ОТКЛОНЕНО
                      </div>
                    </div>
                    <p class="text-sm mb-4">
                      <span class="font-bold">ОТПРАВЛЕНО:</span> {{ submission.submittedDate }}
                    </p>
                    <!-- Компонент прогресса проверки -->
                    <app-review-progress
                      [autoTests]="submission.status.autoTests"
                      [aiAnalysis]="submission.status.aiAnalysis"
                      [expertReview]="submission.status.expertReview"
                    ></app-review-progress>
                    <!-- Комментарий эксперта (если есть) -->
                    <div *ngIf="submission.expertReviewResults" class="mt-4 border-l-4 border-emerald-600 pl-4 bg-emerald-50 p-3">
                      <p class="text-xs font-bold text-emerald-700 uppercase mb-1">Комментарий эксперта:</p>
                      <p class="text-sm text-gray-700">{{ submission.expertReviewResults.comment }}</p>
                    </div>
                    <!-- Сообщение ожидания проверки -->
                    <div *ngIf="submission.status.expertReview === 'pending'" class="mt-4 border-l-4 border-amber-500 pl-4 bg-amber-50 p-3">
                      <p class="text-xs font-bold text-amber-700 uppercase mb-1">Статус:</p>
                      <p class="text-sm text-gray-700">Решение на проверке у эксперта. Ожидайте обратную связь.</p>
                    </div>
                  </a>
                  <!-- Кнопка чата -->
                  <button
                    (click)="openChat(submission.id)"
                    class="border-2 border-indigo-600 px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors text-sm uppercase tracking-wider flex items-center gap-2 mt-4 font-semibold"
                  >
                    <span>💬</span>
                    Чат с компанией
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <!-- ===== МОДАЛЬНОЕ ОКНО: РЕДАКТИРОВАНИЕ ПРОФИЛЯ ===== -->
      <!-- *ngIf - показываем только при showProfileEdit = true -->
      <div *ngIf="showProfileEdit" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
        <div class="bg-white border-2 border-indigo-600 w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
          
          <!-- Заголовок модального окна -->
          <div class="border-b-2 border-indigo-600 p-6 flex justify-between items-center bg-indigo-50">
            <h2 class="font-bold text-xl uppercase text-indigo-600">Редактирование профиля</h2>
            <button
              (click)="closeProfileEdit()"
              class="text-3xl hover:opacity-70 transition-opacity"
            >
              ×
            </button>
          </div>

          <!-- Тело модального окна с прокруткой -->
          <div class="flex-1 p-6 overflow-y-auto">
            <div class="space-y-6">
              
              <!-- Поле ФИО -->
              <div>
                <label class="block font-bold mb-2 text-sm uppercase tracking-wider">ФИО</label>
                <input
                  type="text"
                  [(ngModel)]="editProfile.fullName"
                  class="w-full border-2 border-black p-3"
                />
              </div>

              <!-- Поле Город -->
              <div>
                <label class="block font-bold mb-2 text-sm uppercase tracking-wider">Город проживания</label>
                <input
                  type="text"
                  [(ngModel)]="editProfile.city"
                  class="w-full border-2 border-black p-3"
                />
              </div>

              <!-- Поле О себе -->
              <div>
                <label class="block font-bold mb-2 text-sm uppercase tracking-wider">О себе</label>
                <textarea
                  [(ngModel)]="editProfile.about"
                  class="w-full border-2 border-black p-3 min-h-[120px]"
                  rows="5"
                ></textarea>
              </div>

              <!-- Секция навыков -->
              <div>
                <!-- Заголовок и кнопка добавления -->
                <div class="flex justify-between items-center mb-3">
                  <label class="block font-bold text-sm uppercase tracking-wider">Навыки</label>
                  <button
                    (click)="openSkillEdit()"
                    class="border-2 border-emerald-600 px-3 py-1 text-sm hover:bg-emerald-600 hover:text-white transition-colors font-semibold uppercase flex items-center gap-1"
                  >
                    <span>➕</span>
                    Добавить навык
                  </button>
                </div>

                <!-- Форма добавления нового навыка -->
                <div *ngIf="showSkillEdit" class="border-2 border-emerald-400 bg-emerald-50 p-4 mb-4">
                  <div class="flex gap-3 items-end">
                    <!-- Название навыка -->
                    <div class="flex-1">
                      <label class="block font-bold mb-2 text-xs uppercase tracking-wider">Название навыка</label>
                      <input
                        type="text"
                        [(ngModel)]="newSkill.name"
                        class="w-full border-2 border-black p-2 text-sm"
                        placeholder="Например: Python"
                      />
                    </div>
                    <!-- Уровень навыка -->
                    <div class="w-40">
                      <label class="block font-bold mb-2 text-xs uppercase tracking-wider">Уровень</label>
                      <select
                        [(ngModel)]="newSkill.level"
                        class="w-full border-2 border-black p-2 text-sm"
                      >
                        <option value="начинающий">Начинающий</option>
                        <option value="базовый">Базовый</option>
                        <option value="опытный">Опытный</option>
                      </select>
                    </div>
                    <!-- Кнопка добавления -->
                    <button
                      (click)="handleAddSkill()"
                      class="border-2 border-emerald-600 bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 transition-colors font-semibold uppercase text-sm"
                    >
                      Добавить
                    </button>
                    <!-- Кнопка отмены -->
                    <button
                      (click)="closeSkillEdit()"
                      class="border-2 border-gray-400 px-4 py-2 hover:bg-gray-100 transition-colors font-semibold uppercase text-sm"
                    >
                      Отмена
                    </button>
                  </div>
                </div>

                <!-- Список навыков для редактирования -->
                <div class="space-y-2">
                  <div *ngFor="let skill of editProfile.skills; let i = index" class="border-2 border-gray-300 p-3 flex items-center gap-3">
                    <!-- Название навыка -->
                    <div class="flex-1">
                      <p class="font-semibold">{{ skill.name }}</p>
                    </div>
                    <!-- Селектор уровня -->
                    <select
                      [ngModel]="skill.level"
                      (ngModelChange)="handleSkillLevelChange(i, $event)"
                      class="border-2 border-black p-2 text-sm"
                    >
                      <option value="начинающий">Начинающий</option>
                      <option value="базовый">Базовый</option>
                      <option value="опытный">Опытный</option>
                    </select>
                    <!-- Кнопка удаления навыка -->
                    <button
                      (click)="handleRemoveSkill(i)"
                      class="text-red-600 hover:text-red-800 text-xl"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Подвал модального окна с кнопками действий -->
          <div class="border-t-2 border-indigo-600 p-6 flex gap-3 bg-gray-50">
            <button
              (click)="handleSaveProfile()"
              class="flex-1 border-2 border-indigo-600 bg-indigo-600 text-white px-6 py-3 hover:bg-indigo-700 transition-colors font-bold uppercase"
            >
              Сохранить изменения
            </button>
            <button
              (click)="closeProfileEdit()"
              class="border-2 border-gray-400 px-6 py-3 hover:bg-gray-100 transition-colors font-bold uppercase"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>

      <!-- ===== МОДАЛЬНОЕ ОКНО: ЧАТ ===== -->
      <div *ngIf="showChat" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
        <div class="bg-white border-2 border-indigo-600 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
          
          <!-- Заголовок чата -->
          <div class="border-b-2 border-indigo-600 p-4 flex justify-between items-center bg-indigo-50">
            <h2 class="font-bold uppercase text-indigo-600">Чат с компанией</h2>
            <button
              (click)="closeChat()"
              class="text-3xl hover:opacity-70 transition-opacity"
            >
              ×
            </button>
          </div>

          <!-- Сообщения чата -->
          <div class="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
            <!-- Сообщение от компании -->
            <div class="border-2 border-indigo-400 bg-white p-4">
              <p class="text-sm font-bold mb-1 text-indigo-600">КОМПАНИЯ</p>
              <p class="text-sm">Здравствуйте! Чем можем помочь?</p>
            </div>
            <!-- Сообщение от пользователя -->
            <div class="border-2 border-emerald-400 bg-emerald-50 p-4">
              <p class="text-sm font-bold mb-1 text-emerald-600">ВЫ</p>
              <p class="text-sm">Здравствуйте! Можно уточнить требования к проекту?</p>
            </div>
          </div>

          <!-- Поле ввода сообщения -->
          <div class="border-t-2 border-indigo-600 p-4 bg-white">
            <div class="flex gap-2">
              <input
                type="text"
                placeholder="Введите сообщение..."
                class="flex-1 border-2 border-black p-3 text-sm"
              />
              <button class="border-2 border-indigo-600 bg-indigo-600 text-white px-6 py-3 hover:bg-indigo-700 transition-colors font-bold uppercase text-sm">
                Отправить
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  `
})
export class CandidateDashboardComponent {
  // ============================================================
  // СОСТОЯНИЕ КОМПОНЕНТА
  // ============================================================

  /** 
   * Выбранные технологии для фильтрации заданий
   * Хранит массив названий технологий
   */
  selectedTechs: string[] = [];

  /** 
   * ID заданий, которые находятся в работе
   * Инициализируется из mock данных
   */
  tasksInProgress: string[] = [...initialTasksInProgress];

  /** 
   * Флаг видимости модального окна чата
   */
  showChat: boolean = false;

  /** 
   * ID задания/отправки для текущего чата
   * Используется для определения контекста чата
   */
  chatTaskId: string | null = null;

  /** 
   * Флаг видимости модального окна редактирования профиля
   */
  showProfileEdit: boolean = false;

  /** 
   * Флаг видимости формы добавления нового навыка
   */
  showSkillEdit: boolean = false;

  /** 
   * Данные нового навыка для добавления
   * Используется во время заполнения формы
   */
  newSkill: NewSkill = { name: '', level: 'базовый' };

  /** 
   * Текущий профиль кандидата (отображаемый)
   * Инициализируется с дефолтными значениями
   */
  profile: CandidateProfile = {
    fullName: 'Иван Петров',
    city: 'Москва',
    about: 'Junior Frontend разработчик, ищу первую работу в IT. Увлекаюсь веб-разработкой, готов учиться и развиваться.',
    skills: [
      { name: 'JavaScript', level: 'базовый' },
      { name: 'React', level: 'начинающий' },
      { name: 'HTML/CSS', level: 'опытный' },
      { name: 'Git', level: 'базовый' },
    ]
  };

  /** 
   * Редактируемая копия профиля
   * Используется в модальном окне редактирования
   * Сохраняется в profile только при подтверждении
   */
  editProfile: CandidateProfile = { ...this.profile };

  // ============================================================
  // ВЫЧИСЛЯЕМЫЕ СВОЙСТВА (ГЕТТЕРЫ)
  // ============================================================

  /**
   * Получить список всех уникальных технологий из доступных заданий
   * Используется для отображения фильтров в сайдбаре
   */
  get allTechs(): string[] {
    return Array.from(
      new Set(availableTasks.flatMap(task => task.technologies))
    );
  }

  /**
   * Получить отфильтрованный список доступных заданий
   * - Исключает задания, которые уже в работе
   * - Фильтрует по выбранным технологиям (если есть)
   */
  get filteredTasks() {
    if (this.selectedTechs.length === 0) {
      return availableTasks.filter(task => !this.tasksInProgress.includes(task.id));
    }
    return availableTasks.filter(task =>
      !this.tasksInProgress.includes(task.id) &&
      this.selectedTechs.some(tech => task.technologies.includes(tech))
    );
  }

  /**
   * Получить список заданий, которые находятся в работе
   * Используется для отображения секции "В работе"
   */
  get inProgressTasks() {
    return availableTasks.filter(task => this.tasksInProgress.includes(task.id));
  }

  // ============================================================
  // МЕТОДЫ ЖИЗНЕННОГО ЦИКЛА
  // ============================================================

  /**
   * Импорт mock данных для использования в шаблоне
   * Необходимо для доступа к candidateSubmissions из template
   */
  get candidateSubmissions() {
    return candidateSubmissions;
  }

  // ============================================================
  // ОБРАБОТЧИКИ СОБЫТИЙ - ФИЛЬТРЫ
  // ============================================================

  /**
   * Переключить выбор технологии в фильтре
   * Если технология уже выбрана - удаляет, иначе - добавляет
   * 
   * @param tech - название технологии
   */
  toggleTech(tech: string): void {
    if (this.selectedTechs.includes(tech)) {
      this.selectedTechs = this.selectedTechs.filter(t => t !== tech);
    } else {
      this.selectedTechs = [...this.selectedTechs, tech];
    }
  }

  // ============================================================
  // ОБРАБОТЧИКИ СОБЫТИЙ - ЧАТ
  // ============================================================

  /**
   * Открыть модальное окно чата для конкретного задания
   * 
   * @param taskId - ID задания или отправки
   */
  openChat(taskId: string): void {
    this.chatTaskId = taskId;
    this.showChat = true;
  }

  /**
   * Закрыть модальное окно чата
   * Сбрасывает chatTaskId
   */
  closeChat(): void {
    this.showChat = false;
    this.chatTaskId = null;
  }

  // ============================================================
  // ОБРАБОТЧИКИ СОБЫТИЙ - РЕДАКТИРОВАНИЕ ПРОФИЛЯ
  // ============================================================

  /**
   * Открыть модальное окно редактирования профиля
   * Создает копию текущего профиля для редактирования
   */
  openProfileEdit(): void {
    // Создаем глубокую копию профиля для редактирования
    this.editProfile = {
      ...this.profile,
      skills: this.profile.skills.map(s => ({ ...s }))
    };
    this.showProfileEdit = true;
  }

  /**
   * Закрыть модальное окно редактирования профиля
   * Сбрасывает форму добавления навыка
   */
  closeProfileEdit(): void {
    this.showProfileEdit = false;
    this.showSkillEdit = false;
    this.newSkill = { name: '', level: 'базовый' };
  }

  /**
   * Сохранить изменения профиля
   * Копирует editProfile в profile и закрывает модальное окно
   */
  handleSaveProfile(): void {
    this.profile = {
      ...this.editProfile,
      skills: this.editProfile.skills.map(s => ({ ...s }))
    };
    this.showProfileEdit = false;
  }

  // ============================================================
  // ОБРАБОТЧИКИ СОБЫТИЙ - УПРАВЛЕНИЕ НАВЫКАМИ
  // ============================================================

  /**
   * Открыть форму добавления нового навыка
   */
  openSkillEdit(): void {
    this.showSkillEdit = true;
  }

  /**
   * Закрыть форму добавления навыка
   * Сбрасывает поля формы
   */
  closeSkillEdit(): void {
    this.showSkillEdit = false;
    this.newSkill = { name: '', level: 'базовый' };
  }

  /**
   * Добавить новый навык в редактируемый профиль
   * Проверяет, что название не пустое
   */
  handleAddSkill(): void {
    if (this.newSkill.name.trim()) {
      this.editProfile = {
        ...this.editProfile,
        skills: [...this.editProfile.skills, { ...this.newSkill }]
      };
      this.newSkill = { name: '', level: 'базовый' };
      this.showSkillEdit = false;
    }
  }

  /**
   * Удалить навык из редактируемого профиля
   * 
   * @param index - индекс навыка в массиве
   */
  handleRemoveSkill(index: number): void {
    this.editProfile = {
      ...this.editProfile,
      skills: this.editProfile.skills.filter((_, i) => i !== index)
    };
  }

  /**
   * Изменить уровень владения навыком
   * 
   * @param index - индекс навыка в массиве
   * @param level - новый уровень ('начинающий' | 'базовый' | 'опытный')
   */
  handleSkillLevelChange(index: number, level: SkillLevel): void {
    const updatedSkills = [...this.editProfile.skills];
    updatedSkills[index] = { ...updatedSkills[index], level };
    this.editProfile = { ...this.editProfile, skills: updatedSkills };
  }

  // ============================================================
  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // ============================================================

  /**
   * Получить CSS-классы для цветовой индикации уровня навыка
   * Возвращает разные цвета в зависимости от уровня:
   * - начинающий: желтый (amber)
   * - базовый: синий (indigo)
   * - опытный: зеленый (emerald)
   * 
   * @param level - уровень владения навыком
   * @returns строка с CSS-классами Tailwind
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
