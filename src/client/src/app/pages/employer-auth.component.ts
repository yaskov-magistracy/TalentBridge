/**
 * EmployerAuthComponent - Страница аутентификации для работодателей
 * 
 * Предоставляет форму входа для работодателей.
 * В отличие от кандидатов, регистрация работодателей производится
 * вручную через администрацию платформы.
 * 
 * Особенности:
 * - Только форма входа (без регистрации)
 * - Информационное сообщение о ручной регистрации
 * - Ссылка "Забыли пароль?"
 * 
 * После успешной аутентификации перенаправляет на /employer-dashboard
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

/**
 * Интерфейс данных формы входа
 */
interface LoginFormData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-employer-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- 
      Основной контейнер страницы
      - bg-gradient-to-br: градиент от slate-50 к emerald-50
    -->
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      
      <!-- ===== ШАПКА ===== -->
      <div class="border-b-2 border-emerald-600 bg-white shadow-sm">
        <div class="max-w-7xl mx-auto py-4 px-8">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
            TALENTBRIDGE
          </h1>
        </div>
      </div>

      <!-- ===== ФОРМА ВХОДА ===== -->
      <div class="max-w-md mx-auto px-8 py-16">
        <!-- Карточка формы с зеленой рамкой -->
        <div class="border-2 border-emerald-600 bg-white p-8 shadow-xl">
          
          <!-- Заголовок -->
          <h2 class="text-2xl font-bold mb-6 text-center uppercase text-emerald-600">
            Вход для работодателя
          </h2>

          <!-- ИНФОРМАЦИОННОЕ СООБЩЕНИЕ -->
          <!-- 
            Предупреждение о ручной регистрации
            - border-amber-400: желтая рамка
            - bg-amber-50: светло-желтый фон
          -->
          <div class="border-2 border-amber-400 bg-amber-50 p-4 mb-6">
            <p class="text-xs text-amber-900">
              <strong>ПРИМЕЧАНИЕ:</strong> Регистрация работодателей производится вручную. 
              Если вы хотите разместить задания, свяжитесь с администрацией платформы.
            </p>
          </div>

          <!-- ФОРМА -->
          <form (ngSubmit)="onSubmit()" class="space-y-6" #loginForm="ngForm">
            
            <!-- ПОЛЕ: EMAIL -->
            <div>
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                [(ngModel)]="formData.email"
                name="email"
                class="w-full border-2 border-black p-3"
                placeholder="company@email.com"
                required
              />
            </div>

            <!-- ПОЛЕ: ПАРОЛЬ -->
            <div>
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
                Пароль
              </label>
              <input
                type="password"
                [(ngModel)]="formData.password"
                name="password"
                class="w-full border-2 border-black p-3"
                placeholder="••••••••"
                required
              />
            </div>

            <!-- КНОПКА ВХОДА -->
            <button
              type="submit"
              class="w-full border-2 border-emerald-600 bg-emerald-600 text-white px-8 py-4 hover:bg-emerald-700 transition-colors font-bold uppercase tracking-wider"
            >
              Войти
            </button>
          </form>

          <!-- ССЫЛКА "ЗАБЫЛИ ПАРОЛЬ" -->
          <div class="mt-6 text-center">
            <button class="text-sm hover:underline text-emerald-600">
              Забыли пароль?
            </button>
          </div>

          <!-- ССЫЛКА НАЗАД -->
          <div class="mt-4 text-center">
            <a routerLink="/"
               class="text-sm hover:underline uppercase tracking-wider text-gray-600 hover:text-emerald-600">
              ← Назад на главную
            </a>
          </div>
          
        </div>
      </div>
    </div>
  `
})
export class EmployerAuthComponent {
  /**
   * Данные формы входа
   */
  formData: LoginFormData = {
    email: '',
    password: ''
  };

  /**
   * Конструктор с внедрением Router для навигации
   */
  constructor(private router: Router) {}

  /**
   * Обработчик отправки формы
   * В реальном приложении здесь была бы проверка учетных данных
   */
  onSubmit(): void {
    // В реальном приложении здесь был бы вызов API для аутентификации
    // Сейчас просто имитируем успешный вход
    
    // Перенаправляем на дашборд работодателя
    this.router.navigate(['/employer-dashboard']);
  }
}
