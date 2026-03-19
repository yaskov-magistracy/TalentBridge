/**
 * JuniorAuthComponent - Страница аутентификации для кандидатов (джунов)
 * 
 * Предоставляет формы для входа и регистрации кандидатов.
 * Переключение между режимами входа и регистрации происходит
 * без перезагрузки страницы.
 * 
 * Функциональность:
 * - Вход по email и паролю
 * - Регистрация с подтверждением пароля
 * - Валидация форм (проверка совпадения паролей)
 * - Переход на дашборд после успешной аутентификации
 * 
 * После успешной аутентификации перенаправляет на /candidate-dashboard
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

/**
 * Интерфейс данных формы
 */
interface FormData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-junior-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- 
      Основной контейнер страницы
      - bg-gradient-to-br: градиентный фон
    -->
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      
      <!-- ===== ШАПКА ===== -->
      <div class="border-b-2 border-indigo-600 bg-white shadow-sm">
        <div class="max-w-7xl mx-auto py-4 px-8">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
            TALENTBRIDGE
          </h1>
        </div>
      </div>

      <!-- ===== ФОРМА АУТЕНТИФИКАЦИИ ===== -->
      <div class="max-w-md mx-auto px-8 py-16">
        <!-- Карточка формы с рамкой -->
        <div class="border-2 border-indigo-600 bg-white p-8 shadow-xl">
          
          <!-- Заголовок формы (меняется в зависимости от режима) -->
          <h2 class="text-2xl font-bold mb-6 text-center uppercase text-indigo-600">
            {{ isLogin ? 'Вход для джунов' : 'Регистрация джуна' }}
          </h2>

          <!-- ФОРМА -->
          <form (ngSubmit)="onSubmit()" class="space-y-6" #authForm="ngForm">
            
            <!-- ПОЛЕ: ИМЯ (только при регистрации) -->
            <div *ngIf="!isLogin">
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
                Имя
              </label>
              <input
                type="text"
                [(ngModel)]="formData.name"
                name="name"
                class="w-full border-2 border-black p-3"
                placeholder="Ваше имя"
                [required]="!isLogin"
              />
            </div>

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
                placeholder="your@email.com"
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

            <!-- ПОЛЕ: ПОДТВЕРЖДЕНИЕ ПАРОЛЯ (только при регистрации) -->
            <div *ngIf="!isLogin">
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
                Подтвердите пароль
              </label>
              <input
                type="password"
                [(ngModel)]="formData.confirmPassword"
                name="confirmPassword"
                class="w-full border-2 border-black p-3"
                placeholder="••••••••"
                [required]="!isLogin"
              />
            </div>

            <!-- КНОПКА ОТПРАВКИ -->
            <button
              type="submit"
              class="w-full border-2 border-indigo-600 bg-indigo-600 text-white px-8 py-4 hover:bg-indigo-700 transition-colors font-bold uppercase tracking-wider"
            >
              {{ isLogin ? 'Войти' : 'Зарегистрироваться' }}
            </button>
          </form>

          <!-- ССЫЛКА ПЕРЕКЛЮЧЕНИЯ РЕЖИМА -->
          <div class="mt-6 text-center">
            <button
              (click)="toggleMode()"
              class="text-sm hover:underline text-indigo-600"
            >
              {{ isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти' }}
            </button>
          </div>

          <!-- ССЫЛКА НАЗАД -->
          <div class="mt-4 text-center">
            <a routerLink="/"
               class="text-sm hover:underline uppercase tracking-wider text-gray-600 hover:text-indigo-600">
              ← Назад на главную
            </a>
          </div>
          
        </div>
      </div>
    </div>
  `
})
export class JuniorAuthComponent {
  /**
   * Режим формы: true - вход, false - регистрация
   */
  isLogin = true;

  /**
   * Данные формы
   */
  formData: FormData = {
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  };

  /**
   * Конструктор с внедрением Router для навигации
   */
  constructor(private router: Router) {}

  /**
   * Переключение между режимами входа и регистрации
   * Сбрасывает данные формы при переключении
   */
  toggleMode(): void {
    this.isLogin = !this.isLogin;
    // Сбрасываем данные формы
    this.formData = {
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    };
  }

  /**
   * Обработчик отправки формы
   * Выполняет валидацию и перенаправляет на дашборд
   */
  onSubmit(): void {
    // При регистрации проверяем совпадение паролей
    if (!this.isLogin && this.formData.password !== this.formData.confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }

    // В реальном приложении здесь был бы вызов API для аутентификации
    // Сейчас просто имитируем успешный вход
    
    // Перенаправляем на дашборд кандидата
    this.router.navigate(['/candidate-dashboard']);
  }
}
