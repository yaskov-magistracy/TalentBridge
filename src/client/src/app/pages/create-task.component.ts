/**
 * CreateTaskComponent - Страница создания нового задания для работодателей
 * 
 * Позволяет работодателям создавать и публиковать тестовые задания для кандидатов.
 * Поддерживает указание названия, описания, дедлайна, технологий,
 * загрузку исходных файлов проекта и конфигурацию автотестов.
 * 
 * Особенности:
 * - Форма с валидацией обязательных полей
 * - Выбор технологий из предопределенного списка с чекбоксами
 * - Загрузка файлов начального проекта (опционально)
 * - Конфигурация команд для запуска автотестов
 * 
 * После создания задания перенаправляет на дашборд работодателя
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Импортируем общие компоненты
import { NavbarComponent } from '../components/navbar.component';
import { TechChipComponent } from '../components/tech-chip.component';

// Импортируем список доступных технологий из мок-данных
import { AVAILABLE_TECHS } from '../data/mock-data';

/**
 * Интерфейс данных формы создания задания
 * Описывает структуру всех полей формы
 */
interface CreateTaskFormData {
  /** Название задания */
  title: string;
  /** Описание проекта */
  description: string;
  /** Дедлайн выполнения (YYYY-MM-DD) */
  deadline: string;
  /** Команда для запуска автотестов */
  autoTestsConfig: string;
}

@Component({
  // Селектор для использования в маршрутизации
  selector: 'app-create-task',
  // standalone: true позволяет использовать компонент без декларации в модуле
  standalone: true,
  // Импортируем необходимые модули и компоненты
  imports: [
    CommonModule,       // Стандартные директивы Angular (*ngIf, *ngFor)
    FormsModule,        // Директивы форм [(ngModel)]
    NavbarComponent,    // Навигационная панель
    TechChipComponent   // Компонент отображения технологий
  ],
  // Inline-шаблон компонента
  template: `
    <!-- 
      Основной контейнер страницы
      - min-h-screen: минимальная высота = высота экрана
      - bg-white: белый фон
    -->
    <div class="min-h-screen bg-white">
      <!-- Навигационная панель для работодателя -->
      <app-navbar [role]="'employer'"></app-navbar>

      <!-- 
        Контейнер формы с ограничением ширины
        - max-w-4xl: максимальная ширина 56rem
        - mx-auto: центрирование по горизонтали
        - px-8 py-8: внутренние отступы
      -->
      <div class="max-w-4xl mx-auto px-8 py-8">
        <!-- Заголовок страницы -->
        <h1 class="text-3xl font-bold mb-8 uppercase">Создание задания</h1>

        <!-- 
          Форма создания задания
          - (ngSubmit): обработчик отправки формы
          - border-2 border-black: черная рамка в стиле wireframe
          - p-8: внутренние отступы
          - space-y-8: вертикальные отступы между элементами
        -->
        <form (ngSubmit)="handleSubmit()" class="border-2 border-black p-8 space-y-8">
          
          <!-- ===== ПОЛЕ: НАЗВАНИЕ ЗАДАНИЯ ===== -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
              Название задания
            </label>
            <!-- 
              Поле ввода названия
              - [(ngModel)]: двустороннее связывание с formData.title
              - required: обязательное поле
            -->
            <input
              type="text"
              [(ngModel)]="formData.title"
              name="title"
              class="w-full border-2 border-black p-3"
              placeholder="Например: REST API для системы управления задачами"
              required
            />
          </div>

          <!-- ===== ПОЛЕ: ОПИСАНИЕ ПРОЕКТА ===== -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
              Описание проекта
            </label>
            <!-- 
              Текстовая область для описания
              - h-32: фиксированная высота
            -->
            <textarea
              [(ngModel)]="formData.description"
              name="description"
              class="w-full border-2 border-black p-3 h-32"
              placeholder="Подробное описание проекта, целей и ожидаемого результата..."
              required
            ></textarea>
          </div>

          <!-- ===== ПОЛЕ: ДЕДЛАЙН ===== -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
              Дедлайн
            </label>
            <!-- Поле выбора даты -->
            <input
              type="date"
              [(ngModel)]="formData.deadline"
              name="deadline"
              class="w-full border-2 border-black p-3"
              required
            />
          </div>

          <!-- ===== ПОЛЕ: ТЕХНОЛОГИИ ===== -->
          <div>
            <label class="block font-bold mb-4 text-sm uppercase tracking-wider">
              Технологии (выберите требуемые)
            </label>
            <!-- 
              Контейнер для выбора технологий
              - border-2 border-black: черная рамка
              - p-6: внутренние отступы
            -->
            <div class="border-2 border-black p-6">
              <!-- Отображение выбранных технологий в виде чипов -->
              <div class="flex flex-wrap gap-3 mb-6">
                <!-- *ngFor: цикл по выбранным технологиям -->
                <app-tech-chip *ngFor="let tech of selectedTechs" [name]="tech"></app-tech-chip>
                <!-- 
                  *ngIf: условное отображение
                  Показываем подсказку если ничего не выбрано
                -->
                <p *ngIf="selectedTechs.length === 0" class="text-gray-400 text-sm">
                  Выберите технологии из списка ниже
                </p>
              </div>
              <!-- 
                  Сетка чекбоксов технологий
                  - grid-cols-4: 4 колонки
                  - gap-3: отступы между элементами
                -->
              <div class="grid grid-cols-4 gap-3">
                <!-- Цикл по всем доступным технологиям -->
                <label *ngFor="let tech of availableTechs" class="flex items-center gap-2 cursor-pointer text-sm">
                  <!-- 
                      Чекбокс для выбора технологии
                      - [checked]: привязка состояния чекбокса
                      - (change): обработчик изменения состояния
                    -->
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

          <!-- ===== ПОЛЕ: ИСХОДНЫЙ ПРОЕКТ ===== -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
              Исходный проект <span class="text-gray-400 font-normal">(опционально)</span>
            </label>
            <div class="border-2 border-black p-6">
              <!-- 
                Поле загрузки файлов
                - (change): обработчик выбора файлов
                - multiple: разрешить выбор нескольких файлов
                - webkitdirectory: разрешить выбор папки (Chrome)
              -->
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
              <!-- 
                  Отображение списка выбранных файлов
                  *ngIf: показываем только если файлы выбраны
                -->
              <div *ngIf="projectFiles && projectFiles.length > 0" class="mt-4 border-t border-black pt-4">
                <p class="text-xs font-bold mb-2">ВЫБРАНО ФАЙЛОВ: {{ projectFiles.length }}</p>
                <!-- Список файлов с прокруткой если их много -->
                <div class="max-h-32 overflow-y-auto text-xs space-y-1">
                  <!-- Показываем первые 10 файлов -->
                  <div *ngFor="let file of getProjectFilesSlice(0, 10)" class="text-gray-600">
                    {{ file.webkitRelativePath || file.name }}
                  </div>
                  <!-- Сообщение если файлов больше 10 -->
                  <div *ngIf="projectFiles.length > 10" class="text-gray-400">
                    ...и ещё {{ projectFiles.length - 10 }} файлов
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ===== ПОЛЕ: КОНФИГУРАЦИЯ АВТОТЕСТОВ ===== -->
          <div>
            <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
              Конфигурация автотестов
            </label>
            <!-- 
              Текстовая область для команд тестирования
              - font-mono: моноширинный шрифт для кода
            -->
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

          <!-- ===== КНОПКИ УПРАВЛЕНИЯ ===== -->
          <div class="flex gap-4 pt-6 border-t-2 border-black">
            <!-- 
              Кнопка публикации задания
              - flex-1: растягивается на всю доступную ширину
              - hover:bg-black hover:text-white: инверсия цветов при наведении
            -->
            <button
              type="submit"
              class="flex-1 border-2 border-black px-8 py-4 hover:bg-black hover:text-white transition-colors font-bold uppercase tracking-wider"
            >
              Опубликовать задание
            </button>
            <!-- Кнопка отмены с возвратом на дашборд -->
            <button
              type="button"
              (click)="navigateToDashboard()"
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
export class CreateTaskComponent {
  /**
   * Список всех доступных технологий для выбора
   * Импортируется из mock-data.ts
   */
  availableTechs: string[] = AVAILABLE_TECHS;

  /**
   * Данные формы создания задания
   * Инициализируются пустыми строками
   */
  formData: CreateTaskFormData = {
    title: '',
    description: '',
    deadline: '',
    autoTestsConfig: ''
  };

  /**
   * Массив выбранных технологий
   * Заполняется при клике на чекбоксы
   */
  selectedTechs: string[] = [];

  /**
   * Список загруженных файлов проекта
   * undefined если файлы не выбраны
   */
  projectFiles: FileList | null = null;

  /**
   * Конструктор с внедрением Router для навигации
   * @param router - сервис Angular для маршрутизации
   */
  constructor(private router: Router) {}

  /**
   * Обработчик отправки формы
   * В реальном приложении здесь был бы вызов API для создания задания
   * Сейчас имитируем успешное создание через alert и перенаправляем на дашборд
   */
  handleSubmit(): void {
    // Предотвращаем стандартное поведение формы (перезагрузку страницы)
    // В Angular (ngSubmit) уже предотвращает это по умолчанию
    
    // В реальном приложении здесь был бы вызов API:
    // this.taskService.createTask({ ...this.formData, technologies: this.selectedTechs }).subscribe(...)
    
    alert('Задание создано и опубликовано!');
    this.router.navigate(['/employer-dashboard']);
  }

  /**
   * Переключение выбора технологии
   * Добавляет технологию в список если её там нет, или удаляет если есть
   * @param tech - название технологии для переключения
   */
  toggleTech(tech: string): void {
    const index = this.selectedTechs.indexOf(tech);
    if (index === -1) {
      // Технология не выбрана - добавляем
      this.selectedTechs.push(tech);
    } else {
      // Технология уже выбрана - удаляем
      this.selectedTechs.splice(index, 1);
    }
  }

  /**
   * Обработчик изменения выбранных файлов
   * Сохраняет FileList из события input
   * @param event - событие изменения файлового input
   */
  handleFileChange(event: Event): void {
    // Получаем элемент input из события
    const input = event.target as HTMLInputElement;
    // Сохраняем список выбранных файлов (null если ничего не выбрано)
    this.projectFiles = input.files;
  }

  /**
   * Получает срез файлов из FileList
   * Необходим для использования в *ngFor так как FileList не является массивом
   * @param start - начальный индекс
   * @param end - конечный индекс (не включая)
   * @returns массив файлов в указанном диапазоне
   */
  getProjectFilesSlice(start: number, end: number): File[] {
    if (!this.projectFiles) return [];
    // Конвертируем FileList в массив и берем срез
    return Array.from(this.projectFiles).slice(start, end);
  }

  /**
   * Навигация на дашборд работодателя
   * Используется при отмене создания задания
   */
  navigateToDashboard(): void {
    this.router.navigate(['/employer-dashboard']);
  }
}
