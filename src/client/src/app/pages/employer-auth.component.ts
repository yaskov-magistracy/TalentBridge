/**
 * EmployerAuthComponent - Страница аутентификации для работодателей
 * 
 * Предоставляет форму входа для работодателей.
 * Использует AuthService для взаимодействия с FastAPI бэкендом.
 * 
 * API Endpoints:
 * - POST /api/v1/auth/login - вход
 * 
 * Регистрация работодателей производится вручную администрацией.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Интерфейс данных формы входа
 */
interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Интерфейс ошибок формы
 */
interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

@Component({
  selector: 'app-employer-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Основной контейнер страницы -->
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
        <div class="border-2 border-emerald-600 bg-white p-8 shadow-xl">
          
          <!-- Заголовок -->
          <h2 class="text-2xl font-bold mb-6 text-center uppercase text-emerald-600">
            Вход для работодателя
          </h2>

          <!-- ИНФОРМАЦИОННОЕ СООБЩЕНИЕ -->
          <div class="border-2 border-amber-400 bg-amber-50 p-4 mb-6">
            <p class="text-xs text-amber-900">
              <strong>ПРИМЕЧАНИЕ:</strong> Регистрация работодателей производится вручную. 
              Если вы хотите разместить задания, свяжитесь с администрацией платформы.
            </p>
          </div>

          <!-- Сообщение об ошибке -->
          <div *ngIf="errors.general" class="border-2 border-red-400 bg-red-50 p-4 mb-6">
            <p class="text-sm text-red-700">{{ errors.general }}</p>
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
                class="w-full border-2 p-3"
                [ngClass]="errors.email ? 'border-red-400 bg-red-50' : 'border-black'"
                placeholder="company@email.com"
                required
                [disabled]="isLoading"
              />
              <p *ngIf="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
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
                class="w-full border-2 p-3"
                [ngClass]="errors.password ? 'border-red-400 bg-red-50' : 'border-black'"
                placeholder="••••••••"
                required
                [disabled]="isLoading"
              />
              <p *ngIf="errors.password" class="text-xs text-red-600 mt-1">{{ errors.password }}</p>
            </div>

            <!-- КНОПКА ВХОДА -->
            <button
              type="submit"
              [disabled]="isLoading"
              class="w-full border-2 border-emerald-600 bg-emerald-600 text-white px-8 py-4 hover:bg-emerald-700 transition-colors font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span *ngIf="isLoading" class="animate-spin">⟳</span>
              {{ isLoading ? 'Загрузка...' : 'Войти' }}
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
   * Ошибки валидации
   */
  errors: FormErrors = {};

  /**
   * Флаг загрузки
   */
  isLoading = false;

  /**
   * Конструктор с внедрением зависимостей
   * @param authService - сервис аутентификации
   * @param router - сервис навигации
   */
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Валидация формы
   * @returns true если форма валидна
   */
  private validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    // Валидация email
    if (!this.formData.email) {
      this.errors.email = 'Email обязателен';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
      this.errors.email = 'Некорректный email';
      isValid = false;
    }

    // Валидация пароля
    if (!this.formData.password) {
      this.errors.password = 'Пароль обязателен';
      isValid = false;
    }

    return isValid;
  }

  /**
   * Обработчик отправки формы
   * Выполняет вход через API
   */
  onSubmit(): void {
    // Валидация формы
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errors.general = undefined;

    this.authService.login({
      email: this.formData.email,
      password: this.formData.password,
      role: 'employer'
    }).subscribe({
      next: () => {
        this.isLoading = false;
        // Перенаправляем на дашборд работодателя
        this.router.navigate(['/employer-dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errors.general = err.message || 'Ошибка входа. Проверьте email и пароль.';
      }
    });
  }
}
