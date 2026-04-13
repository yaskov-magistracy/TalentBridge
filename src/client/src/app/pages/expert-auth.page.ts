import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core';
import { ApiError } from '../core/models/api.models';

@Component({
  selector: 'app-expert-auth-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 flex flex-col">
      <div class="border-b-2 border-amber-600 bg-white shadow-md">
        <div class="max-w-7xl mx-auto py-4 px-8">
          <a [routerLink]="'/'">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent cursor-pointer">
              TALENTBRIDGE
            </h1>
          </a>
        </div>
      </div>

      <div class="flex-1 flex items-center justify-center px-8 py-16">
        <div class="w-full max-w-md border-2 border-amber-600 bg-white p-8 shadow-lg">
          <h2 class="text-2xl font-bold mb-8 text-center uppercase text-amber-600 tracking-wider">Вход для эксперта</h2>

          <div *ngIf="errorMessage" class="mb-6 border-2 border-red-400 bg-red-50 p-3 text-red-700 text-xs">
            ⚠️ {{ errorMessage }}
          </div>

          <div class="border-2 border-amber-400 bg-amber-50 p-4 mb-6 text-xs text-amber-900 font-semibold">
            <strong>⚠️ ПРИМЕЧАНИЕ:</strong> Регистрация экспертов производится вручную.
          </div>

          <form [formGroup]="formGroup" (ngSubmit)="submit()" class="space-y-6">
            <div>
              <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Логин</label>
              <input
                type="text"
                formControlName="email"
                name="email"
                class="w-full border-2 border-black p-3 text-sm"
                placeholder="expert@email.com"
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
              class="w-full border-2 border-amber-600 bg-amber-600 text-white px-8 py-4 hover:bg-amber-700 transition-colors font-bold uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Загрузка...' : 'Войти' }}
            </button>
          </form>

          <div class="mt-8 text-center">
            <a [routerLink]="'/'" class="text-xs hover:underline uppercase tracking-wider text-gray-600 hover:text-amber-600 font-semibold">
              ← НАЗАД НА ГЛАВНУЮ
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExpertAuthPage {
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

      this.router.navigateByUrl('/expert-dashboard');
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
