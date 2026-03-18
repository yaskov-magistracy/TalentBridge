/**
 * JuniorAuthComponent - Страница аутентификации для кандидатов (джунов)
 * 
 * Предоставляет формы для входа и регистрации кандидатов.
 * Использует AuthService для взаимодействия с FastAPI бэкендом.
 * 
 * API Endpoints:
 * - POST /api/v1/auth/login - вход
 * - POST /api/v1/auth/register/candidate - регистрация
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {of} from "rxjs";

/**
 * Интерфейс данных формы
 */
interface FormData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

/**
 * Интерфейс ошибок формы
 */
interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
  general?: string;
}

@Component({
  selector: 'app-junior-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Основной контейнер страницы -->
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
        <div class="border-2 border-indigo-600 bg-white p-8 shadow-xl">
          
          <!-- Заголовок формы -->
          <h2 class="text-2xl font-bold mb-6 text-center uppercase text-indigo-600">
            {{ isLogin ? 'Вход для джунов' : 'Регистрация джуна' }}
          </h2>

          <!-- Сообщение об ошибке -->
          <div *ngIf="errors.general" class="border-2 border-red-400 bg-red-50 p-4 mb-6">
            <p class="text-sm text-red-700">{{ errors.general }}</p>
          </div>

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
                class="w-full border-2 p-3"
                [ngClass]="errors.name ? 'border-red-400 bg-red-50' : 'border-black'"
                placeholder="Ваше имя"
                [required]="!isLogin"
                [disabled]="isLoading"
              />
              <p *ngIf="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
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
                class="w-full border-2 p-3"
                [ngClass]="errors.email ? 'border-red-400 bg-red-50' : 'border-black'"
                placeholder="your@email.com"
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

            <!-- ПОЛЕ: ПОДТВЕРЖДЕНИЕ ПАРОЛЯ (только при регистрации) -->
            <div *ngIf="!isLogin">
              <label class="block font-bold mb-2 text-sm uppercase tracking-wider">
                Подтвердите пароль
              </label>
              <input
                type="password"
                [(ngModel)]="formData.confirmPassword"
                name="confirmPassword"
                class="w-full border-2 p-3"
                [ngClass]="errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-black'"
                placeholder="••••••••"
                [required]="!isLogin"
                [disabled]="isLoading"
              />
              <p *ngIf="errors.confirmPassword" class="text-xs text-red-600 mt-1">{{ errors.confirmPassword }}</p>
            </div>

            <!-- КНОПКА ОТПРАВКИ -->
            <button
              type="submit"
              [disabled]="isLoading"
              class="w-full border-2 border-indigo-600 bg-indigo-600 text-white px-8 py-4 hover:bg-indigo-700 transition-colors font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span *ngIf="isLoading" class="animate-spin">⟳</span>
              {{ isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться') }}
            </button>
          </form>

          <!-- ССЫЛКА ПЕРЕКЛЮЧЕНИЯ РЕЖИМА -->
          <div class="mt-6 text-center">
            <button
              (click)="toggleMode()"
              [disabled]="isLoading"
              class="text-sm hover:underline text-indigo-600 disabled:opacity-50"
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
   * Флаг загрузки (блокирует форму во время запроса)
   */
  isLoading = false;

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
   * Ошибки валидации
   */
  errors: FormErrors = {};

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
   * Переключение между режимами входа и регистрации
   * Сбрасывает данные формы и ошибки
   */
  toggleMode(): void {
    this.isLogin = !this.isLogin;
    this.formData = {
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    };
    this.errors = {};
  }

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
    } else if (this.formData.password.length < 6) {
      this.errors.password = 'Пароль должен быть не менее 6 символов';
      isValid = false;
    }

    // Дополнительная валидация для регистрации
    if (!this.isLogin) {
      if (!this.formData.name) {
        this.errors.name = 'Имя обязательно';
        isValid = false;
      }

      if (this.formData.password !== this.formData.confirmPassword) {
        this.errors.confirmPassword = 'Пароли не совпадают';
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * Обработчик отправки формы
   * Выполняет вход или регистрацию через API
   */
  onSubmit(): void {
    // Валидация формы
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errors.general = undefined;

    if (this.isLogin) {
      // ===== ВХОД =====
      of(true).subscribe({
        next: () => {
          this.isLoading = false;
          // Перенаправляем на дашборд кандидата
          this.router.navigate(['/candidate-dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errors.general = err.message || 'Ошибка входа. Проверьте email и пароль.';
        }
      });
    } else {
      // ===== РЕГИСТРАЦИЯ =====
      this.authService.registerCandidate({
        email: this.formData.email,
        password: this.formData.password,
        name: this.formData.name,
        role: 'candidate'
      }).subscribe({
        next: () => {
          // После успешной регистрации автоматически входим
          this.authService.login({
            email: this.formData.email,
            password: this.formData.password,
            role: 'candidate'
          }).subscribe({
            next: () => {
              this.isLoading = false;
              this.router.navigate(['/candidate-dashboard']);
            },
            error: (err) => {
              this.isLoading = false;
              this.errors.general = err.message || 'Регистрация успешна, но не удалось войти. Попробуйте войти вручную.';
            }
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.errors.general = err.message || 'Ошибка регистрации. Возможно, email уже используется.';
        }
      });
    }
  }
}
