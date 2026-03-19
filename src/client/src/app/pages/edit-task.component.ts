/**
 * EditTaskComponent - Страница редактирования задания работодателя
 * 
 * Позволяет работодателю редактировать существующее тестовое задание.
 * Компонент загружает данные задания по ID из URL и предоставляет
 * форму для редактирования всех полей задания.
 * 
 * === ФУНКЦИОНАЛ ===
 * 
 * 1. ЗАГРУЗКА ДАННЫХ
 *    - Получает ID задания из URL параметров через ActivatedRoute
 *    - Ищет задание в массиве employerTasks по ID
 *    - Предзаполняет форму данными найденного задания
 * 
 * 2. РЕДАКТИРОВАНИЕ ПОЛЕЙ
 *    - Название задания (title) - текстовое поле
 *    - Описание проекта (description) - textarea
 *    - Дедлайн (deadline) - date picker
 *    - Технологии (technologies) - мультиселект через чекбоксы
 *    - Конфигурация автотестов (autoTestsConfig) - textarea с командами
 * 
 * 3. УПРАВЛЕНИЕ ТЕХНОЛОГИЯМИ
 *    - Отображение уже выбранных технологий через TechChipComponent
 *    - Список всех доступных технологий (AVAILABLE_TECHS) с чекбоксами
 *    - Переключение выбора через toggleTech метод
 * 
 * 4. ЗАГРУЗКА ФАЙЛОВ
 *    - Поле для выбора файлов/папок (webkitdirectory поддержка)
 *    - Отображение списка выбранных файлов
 *    - Показ количества выбранных файлов
 * 
 * 5. СОХРАНЕНИЕ/ОТМЕНА
 *    - Сохранение изменений (пока через alert, в продакшене - API)
 *    - Отмена редактирования с возвратом на дашборд
 * 
 * === ТЕХНИЧЕСКИЕ ОСОБЕННОСТИ ===
 * 
 * - standalone компонент Angular
 * - Двустороннее связывание [(ngModel)] для форм
 * - Реактивное отображение выбранных технологий
 * - Условное отображение сообщения "задание не найдено"
 * - Навигация через Router
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Импорт shared компонентов
import { NavbarComponent } from '../components/navbar.component';
import { TechChipComponent } from '../components/tech-chip.component';

// Импорт mock данных и констант
import { employerTasks, AVAILABLE_TECHS, Task } from '../data/mock-data';

// ============================================================
// ИНТЕРФЕЙСЫ
// ============================================================

/**
 * Интерфейс данных формы редактирования
 * Содержит поля, редактируемые пользователем
 */
interface FormData {
  /** Название задания */
  title: string;
  /** Описание проекта */
  description: string;
  /** Дедлайн в формате YYYY-MM-DD */
  deadline: string;
  /** Команда для запуска автотестов */
  autoTestsConfig: string;
}

// ============================================================
// КОМПОНЕНТ
// ============================================================

@Component({
  // Селектор для использования в роутинге
  selector: 'app-edit-task',
  
  // standalone: true позволяет использовать компонент без NgModule
  standalone: true,
  
  // Импортируемые модули и компоненты
  imports: [
    CommonModule,        // Стандартные директивы Angular (*ngIf, *ngFor)
    FormsModule,         // Двустороннее связывание [(ngModel)]
    NavbarComponent,     // Навигационная панель
    TechChipComponent    // Чипы выбранных технологий
  ],
  
  // Inline-шаблон компонента
  template: `
    <!-- 
      Основной контейнер страницы
      - min-h-screen: минимальная высота = высота экрана
      - bg-white: белый фон
    -->
    <div class="min-h-screen bg-white">
      
      <!-- ===== НАВИГАЦИОННАЯ ПАНЕЛЬ ===== -->
      <!-- Передаем роль 'employer' для отображения соответствующих элементов -->
      <app-navbar [role]="'employer'"></app-navbar>

      <!-- ===== СОДЕРЖИМОЕ ПРИ ОТСУТСТВИИ ЗАДАНИЯ ===== -->
      <!-- *ngIf - показываем если задание не найдено -->
      <div *ngIf="!task" class="max-w-4xl mx-auto px-8 py-8">
        <div class="border-2 border-black p-8 text-center">
          <h2 class="text-xl font-bold">ЗАДАНИЕ НЕ НАЙДЕНО</h2>
        </div>
      </div>

      <!-- ===== ОСНОВНОЙ КОНТЕНТ РЕДАКТИРОВАНИЯ ===== -->
      <!-- *ngIf - показываем только если задание найдено -->
      <div *ngIf="task" class="max-w-4xl mx-auto px-8 py-8">
        
        <!-- Заголовок страницы -->
        <h1 class="text-3xl font-bold mb-8 uppercase">Редактирование задания</h1>

        <!-- ===== ФОРМА РЕДАКТИРОВАНИЯ ===== -->
        <!-- (ngSubmit) - обработчик отправки формы -->
        <form (ngSubmit)="handleSubmit()" class="border-2 border-black p-8 space-y-8">
          
          <!-- === НАЗВАНИЕ ЗАДАНИЯ === -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
              Название задания
            </label>
            <!-- [(ngModel)] - двустороннее связывание с formData.title -->
            <input
              type="text"
              [(ngModel)]="formData.title"
              name="title"
              class="w-full border-2 border-black p-3"
              placeholder="Например: REST API для системы управления задачами"
              required
            />
          </div>

          <!-- === ОПИСАНИЕ ПРОЕКТА === -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
              Описание проекта
            </label>
            <textarea
              [(ngModel)]="formData.description"
              name="description"
              class="w-full border-2 border-black p-3 h-32"
              placeholder="Подробное описание проекта, целей и ожидаемого результата..."
              required
            ></textarea>
          </div>

          <!-- === ДЕДЛАЙН === -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
              Дедлайн
            </label>
            <input
              type="date"
              [(ngModel)]="formData.deadline"
              name="deadline"
              class="w-full border-2 border-black p-3"
              required
            />
          </div>

          <!-- === ТЕХНОЛОГИИ === -->
          <div>
            <label class="block font-bold mb-4 text-sm uppercase tracking-wider">
              Технологии (выберите требуемые)
            </label>
            <div class="border-2 border-black p-6">
              
              <!-- Отображение выбранных технологий через TechChipComponent -->
              <div class="flex flex-wrap gap-3 mb-6">
                <app-tech-chip 
                  *ngFor="let tech of selectedTechs" 
                  [name]="tech"
                ></app-tech-chip>
                <!-- Сообщение если ничего не выбрано -->
                <p *ngIf="selectedTechs.length === 0" class="text-gray-400 text-sm">
                  Выберите технологии из списка ниже
                </p>
              </div>

              <!-- Список всех доступных технологий с чекбоксами -->
              <div class="grid grid-cols-4 gap-3">
                <label *ngFor="let tech of availableTechs" class="flex items-center gap-2 cursor-pointer text-sm">
                  <!-- Чекбокс с проверкой isTechSelected -->
                  <input
                    type="checkbox"
                    [checked]="isTechSelected(tech)"
                    (change)="toggleTech(tech)"
                    class="w-4 h-4 border-2 border-black"
                  />
                  <span>{{ tech }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- === ИСХОДНЫЙ ПРОЕКТ (ФАЙЛЫ) === -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
              Исходный проект <span class="text-gray-400 font-normal">(опционально)</span>
            </label>
            <div class="border-2 border-black p-6">
              <!-- Поле выбора файлов -->
              <input
                type="file"
                (change)="handleFileChange($event)"
                class="w-full text-sm"
                multiple
                webkitdirectory
                directory
              />
              <p class="text-xs mt-3 text-gray-600">
                Загрузите файлы начального проекта, которые джун должен будет скачать и использовать как стартовую точку. 
                Можно выбрать несколько файлов или папку целиком.
              </p>
              
              <!-- Отображение выбранных файлов -->
              <div *ngIf="projectFiles && projectFiles.length > 0" class="mt-4 border-t border-black pt-4">
                <p class="text-xs font-bold mb-2">ВЫБРАНО ФАЙЛОВ: {{ projectFiles.length }}</p>
                <div class="max-h-32 overflow-y-auto text-xs space-y-1">
                  <!-- *ngFor с получением первых 10 файлов через метод -->
                  <div *ngFor="let file of getProjectFilesArray()" class="text-gray-600">
                    {{ file.webkitRelativePath || file.name }}
                  </div>
                  <!-- Сообщение о дополнительных файлах -->
                  <div *ngIf="projectFiles.length > 10" class="text-gray-400">
                    ...и ещё {{ projectFiles.length - 10 }} файлов
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- === КОНФИГУРАЦИЯ АВТОТЕСТОВ === -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
              Конфигурация автотестов
            </label>
            <textarea
              [(ngModel)]="formData.autoTestsConfig"
              name="autoTestsConfig"
              class="w-full border-2 border-black p-3 h-32 font-mono text-sm"
              placeholder="npm test&#10;или&#10;pytest&#10;или команды для запуска ваших тестов..."
              required
            ></textarea>
            <p class="text-xs mt-2 text-gray-600">
              Укажите команду для запуска автотестов в репозитории кандидата
            </p>
          </div>

          <!-- === КНОПКИ ДЕЙСТВИЙ === -->
          <div class="flex gap-4 pt-6 border-t-2 border-black">
            <!-- Кнопка сохранения -->
            <button
              type="submit"
              class="flex-1 border-2 border-black px-8 py-4 hover:bg-black hover:text-white transition-colors font-bold uppercase tracking-wider"
            >
              Сохранить изменения
            </button>
            <!-- Кнопка отмены -->
            <button
              type="button"
              (click)="handleCancel()"
              class="border-2 border-black px-8 py-4 hover:bg-gray-100 transition-colors font-bold uppercase tracking-wider"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EditTaskComponent implements OnInit {
  // ============================================================
  // СОСТОЯНИЕ КОМПОНЕНТА
  // ============================================================

  /**
   * Найденное задание для редактирования
   * undefined если задание с указанным ID не найдено
   */
  task: Task | undefined;

  /**
   * Данные формы редактирования
   * Инициализируются пустыми значениями, заполняются в ngOnInit
   */
  formData: FormData = {
    title: '',
    description: '',
    deadline: '',
    autoTestsConfig: ''
  };

  /**
   * Выбранные технологии для задания
   * Массив строк с названиями технологий
   */
  selectedTechs: string[] = [];

  /**
   * Список выбранных файлов проекта
   * null если файлы не выбраны
   */
  projectFiles: FileList | null = null;

  /**
   * Список всех доступных технологий
   * Импортируется из mock-data.ts
   */
  availableTechs: string[] = AVAILABLE_TECHS;

  // ============================================================
  // КОНСТРУКТОР
  // ============================================================

  /**
   * Конструктор компонента
   * @param router - сервис Angular для навигации
   * @param route - сервис Angular для работы с текущим маршрутом
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // ============================================================
  // МЕТОДЫ ЖИЗНЕННОГО ЦИКЛА
  // ============================================================

  /**
   * Инициализация компонента
   * Вызывается автоматически Angular после создания компонента
   * 
   * Выполняет:
   * 1. Получает ID задания из URL параметров
   * 2. Ищет задание в массиве employerTasks
   * 3. Предзаполняет форму данными задания
   */
  ngOnInit(): void {
    // Получаем параметр 'id' из текущего маршрута
    const taskId = this.route.snapshot.paramMap.get('id');
    
    // Ищем задание по ID
    this.task = employerTasks.find(t => t.id === taskId);

    // Если задание найдено - предзаполняем форму
    if (this.task) {
      this.formData = {
        title: this.task.title,
        description: this.task.description,
        deadline: this.task.deadline,
        autoTestsConfig: this.task.autoTestsConfig || ''
      };
      this.selectedTechs = [...this.task.technologies];
    }
  }

  // ============================================================
  // ОБРАБОТЧИКИ СОБЫТИЙ
  // ============================================================

  /**
   * Обработчик отправки формы
   * Сохраняет изменения задания
   * 
   * В реальном приложении здесь был бы HTTP запрос к API
   * для обновления данных на сервере
   */
  handleSubmit(): void {
    // Показываем уведомление об успешном сохранении
    alert('Задание успешно обновлено!');
    // Перенаправляем на дашборд работодателя
    this.router.navigate(['/employer-dashboard']);
  }

  /**
   * Обработчик отмены редактирования
   * Перенаправляет на дашборд работодателя без сохранения
   */
  handleCancel(): void {
    this.router.navigate(['/employer-dashboard']);
  }

  /**
   * Обработчик изменения выбранных файлов
   * Сохраняет список выбранных файлов в projectFiles
   * 
   * @param event - событие изменения input type="file"
   */
  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.projectFiles = input.files;
  }

  /**
   * Получить массив файлов для отображения (максимум 10)
   * FileList нельзя использовать напрямую в *ngFor с slice
   * поэтому конвертируем в массив
   * 
   * @returns Массив файлов (максимум 10)
   */
  getProjectFilesArray(): File[] {
    if (!this.projectFiles) return [];
    return Array.from(this.projectFiles).slice(0, 10);
  }

  // ============================================================
  // МЕТОДЫ РАБОТЫ С ТЕХНОЛОГИЯМИ
  // ============================================================

  /**
   * Проверить, выбрана ли технология
   * Используется для установки состояния чекбоксов
   * 
   * @param tech - название технологии
   * @returns true если технология выбрана
   */
  isTechSelected(tech: string): boolean {
    return this.selectedTechs.includes(tech);
  }

  /**
   * Переключить выбор технологии
   * Если технология уже выбрана - удаляет из списка
   * Если не выбрана - добавляет в список
   * 
   * @param tech - название технологии
   */
  toggleTech(tech: string): void {
    if (this.selectedTechs.includes(tech)) {
      // Удаляем технологию из списка
      this.selectedTechs = this.selectedTechs.filter(t => t !== tech);
    } else {
      // Добавляем технологию в список
      this.selectedTechs = [...this.selectedTechs, tech];
    }
  }
}
