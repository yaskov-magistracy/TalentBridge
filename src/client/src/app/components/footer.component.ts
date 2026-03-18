/**
 * FooterComponent - Подвал платформы TalentBridge
 * 
 * Содержит навигацию по разделам сайта, разделенную на колонки:
 * - Логотип и описание платформы
 * - Ссылки для кандидатов
 * - Ссылки для работодателей
 * - Информация о компании
 * 
 * Также содержит иконки социальных сетей и копирайт.
 * 
 * Используется как общий компонент для всех страниц.
 * 
 * Пример использования:
 * <app-footer></app-footer>
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- 
      Основной контейнер футера
      - backgroundColor: #0F172A - темно-синий фон
      - color: #94A3B8 - светло-серый текст
      - marginTop: auto - прижимает футер к низу при использовании flex
    -->
    <footer style="background-color: #0F172A; color: #94A3B8; margin-top: auto;">
      
      <!-- Контейнер с ограничением ширины -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <!-- Сетка колонок: 1 колонка на мобильных, 4 колонки на десктопе -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <!-- ===== КОЛОНКА 1: ЛОГОТИП И ОПИСАНИЕ ===== -->
          <div class="md:col-span-1">
            <!-- Логотип с иконкой -->
            <div class="flex items-center gap-2 mb-4">
              <!-- Квадрат с градиентом и иконкой -->
              <div style="
                width: 32px; 
                height: 32px; 
                background: linear-gradient(135deg, #4F46E5, #7C3AED); 
                border-radius: 8px; 
                display: flex; 
                align-items: center; 
                justify-content: center;
              ">
                <span style="color: white; font-size: 16px;">💼</span>
              </div>
              <!-- Название платформы -->
              <span style="font-weight: 700; font-size: 18px; color: white;">
                Talent<span style="color: #818CF8;">Bridge</span>
              </span>
            </div>
            
            <!-- Описание платформы -->
            <p style="font-size: 13px; line-height: 1.6; color: #64748B;">
              Платформа для оценки навыков разработчиков через реальные проектные задания. Без резюме — только код.
            </p>
            
            <!-- Иконки социальных сетей -->
            <div class="flex gap-3 mt-4">
              <a *ngFor="let icon of socialIcons; let i = index"
                 href="#"
                 style="
                   width: 32px;
                   height: 32px;
                   border-radius: 8px;
                   background-color: #1E293B;
                   display: flex;
                   align-items: center;
                   justify-content: center;
                   color: #64748B;
                   text-decoration: none;
                   transition: background-color 0.15s;
                 "
                 class="hover:bg-slate-700">
                <!-- Иконка соцсети (эмодзи вместо lucide для упрощения) -->
                <span style="font-size: 14px;">{{ icon }}</span>
              </a>
            </div>
          </div>
          
          <!-- ===== КОЛОНКА 2: ДЛЯ КАНДИДАТОВ ===== -->
          <div>
            <h4 style="color: white; font-size: 14px; font-weight: 600; margin-bottom: 16px;">
              👨‍💻 Для кандидатов
            </h4>
            <!-- Список ссылок -->
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
              <li *ngFor="let link of candidateLinks">
                <a [routerLink]="link.to"
                   style="font-size: 13px; color: #64748B; text-decoration: none; transition: color 0.15s;"
                   class="hover:text-white">
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
          
          <!-- ===== КОЛОНКА 3: ДЛЯ РАБОТОДАТЕЛЕЙ ===== -->
          <div>
            <h4 style="color: white; font-size: 14px; font-weight: 600; margin-bottom: 16px;">
              🏢 Для работодателей
            </h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
              <li *ngFor="let link of employerLinks">
                <a [routerLink]="link.to"
                   style="font-size: 13px; color: #64748B; text-decoration: none; transition: color 0.15s;"
                   class="hover:text-white">
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
          
          <!-- ===== КОЛОНКА 4: О КОМПАНИИ ===== -->
          <div>
            <h4 style="color: white; font-size: 14px; font-weight: 600; margin-bottom: 16px;">
              О платформе
            </h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
              <li *ngFor="let label of companyLinks">
                <a href="#"
                   style="font-size: 13px; color: #64748B; text-decoration: none;">
                  {{ label }}
                </a>
              </li>
            </ul>
          </div>
          
        </div>
        
        <!-- ===== НИЖНЯЯ СТРОКА: КОПИРАЙТ ===== -->
        <div style="
          border-top: 1px solid #1E293B;
          margin-top: 40px;
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        ">
          <p style="font-size: 12px; color: #475569;">
            © 2025 TalentBridge. Все права защищены.
          </p>
          <p style="font-size: 12px; color: #475569;">
            Сделано с ❤️ для начинающих разработчиков
          </p>
        </div>
        
      </div>
    </footer>
  `
})
export class FooterComponent {
  /**
   * Иконки социальных сетей (эмодзи)
   * В реальном приложении здесь были бы компоненты иконок
   */
  socialIcons = ['🐙', '🐦', '💼']; // Github, Twitter, LinkedIn

  /**
   * Ссылки для кандидатов
   * Каждая ссылка содержит метку и путь маршрутизации
   */
  candidateLinks = [
    { label: 'Найти задания', to: '/candidate-dashboard' },
    { label: 'Моё портфолио', to: '/candidate/c1' },
    { label: 'Как это работает', to: '/#how-it-works' },
    { label: 'Рейтинг кандидатов', to: '/candidate-dashboard' },
    { label: 'Истории успеха', to: '/' },
  ];

  /**
   * Ссылки для работодателей
   */
  employerLinks = [
    { label: 'Опубликовать задание', to: '/create-task' },
    { label: 'База кандидатов', to: '/employer-dashboard' },
    { label: 'Тарифы и планы', to: '/' },
    { label: 'Интеграции', to: '/' },
    { label: 'API документация', to: '/' },
  ];

  /**
   * Ссылки раздела "О компании"
   * Эти ссылки ведут на внешние страницы или заглушки
   */
  companyLinks = [
    'О нас', 'Блог', 'Пресса', 'Карьера', 
    'Конфиденциальность', 'Условия использования'
  ];
}
