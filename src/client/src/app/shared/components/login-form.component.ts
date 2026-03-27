import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core';
import { ApiError } from '../../core/models/api.models';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="submit()" class="space-y-6">
      <div *ngIf="errorMessage" class="border-2 border-red-400 bg-red-50 p-3 text-red-700 text-xs">
        ⚠️ {{ errorMessage }}
      </div>

      <div>
        <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Логин</label>
        <input
          type="text"
          formControlName="email"
          name="email"
          class="w-full border-2 border-black p-3 text-sm"
          placeholder="your@email.com"
        />
        <div *ngIf="formGroup.get('email')?.invalid && formGroup.get('email')?.touched" class="mt-1 text-red-600 text-xs">
          Введите логин (от 1 до 100 символов)
        </div>
      </div>

      <div>
        <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Пароль</label>
        <input
          type="password"
          formControlName="password"
          name="password"
          class="w-full border-2 border-black p-3 text-sm"
          placeholder="••••••••"
        />
        <div *ngIf="formGroup.get('password')?.invalid && formGroup.get('password')?.touched" class="mt-1 text-red-600 text-xs">
          Введите пароль (от 1 до 100 символов)
        </div>
      </div>

      <button
        type="submit"
        [disabled]="loading || formGroup.invalid"
        class="w-full border-2 border-indigo-600 bg-indigo-600 text-white px-8 py-4 hover:bg-indigo-700 transition-colors font-bold uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Загрузка...' : 'Войти' }}
      </button>
    </form>

    <div class="mt-8 text-center border-t-2 border-gray-200 pt-6">
      <p class="text-sm text-gray-600 mb-3">
        Нет аккаунта?
      </p>
      <a
        [routerLink]="'/junior-auth'"
        [queryParams]="{mode: 'register'}"
        class="text-sm font-bold text-indigo-600 hover:underline uppercase tracking-wider"
      >
        Зарегистрироваться
      </a>
    </div>

    <div class="mt-6 text-center">
      <a [routerLink]="'/'" class="text-xs hover:underline uppercase tracking-wider text-gray-600 hover:text-indigo-600 font-semibold">
        ← НАЗАД НА ГЛАВНУЮ
      </a>
    </div>
  `
})
export class LoginForm {
  formGroup: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]]
    });
  }

  async submit(): Promise<void> {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const formValue = this.formGroup.value;

      await this.authService.login({
        login: formValue.email,
        password: formValue.password
      });

      this.router.navigateByUrl('/candidate-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const apiError = error as ApiError;
      this.errorMessage = apiError?.message || 'Произошла ошибка. Попробуйте позже.';
      this.cdr.markForCheck();
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }
}
