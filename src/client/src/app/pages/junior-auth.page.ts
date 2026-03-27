import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-junior-auth-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col">
      <div class="border-b-2 border-indigo-600 bg-white shadow-md">
        <div class="max-w-7xl mx-auto py-4 px-8">
          <a [routerLink]="'/'">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent cursor-pointer">
              TALENTBRIDGE
            </h1>
          </a>
        </div>
      </div>

      <div class="flex-1 flex items-center justify-center px-8 py-16">
        <div class="w-full max-w-md border-2 border-indigo-600 bg-white p-8 shadow-lg">
          <h2 class="text-2xl font-bold mb-8 text-center uppercase text-indigo-600 tracking-wider">
            {{ isLogin ? 'Вход для кандидатов' : 'Регистрация кандидата' }}
          </h2>

          <form (ngSubmit)="submit()" class="space-y-6">
            <div *ngIf="!isLogin">
              <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Имя</label>
              <input 
                type="text" 
                [(ngModel)]="form.name" 
                name="name" 
                class="w-full border-2 border-black p-3 text-sm" 
                placeholder="Ваше имя"
                required 
              />
            </div>

            <div>
              <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Email</label>
              <input 
                type="email" 
                [(ngModel)]="form.email" 
                name="email" 
                class="w-full border-2 border-black p-3 text-sm" 
                placeholder="your@email.com"
                required 
              />
            </div>

            <div>
              <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Пароль</label>
              <input 
                type="password" 
                [(ngModel)]="form.password" 
                name="password" 
                class="w-full border-2 border-black p-3 text-sm" 
                placeholder="••••••••"
                required 
              />
            </div>

            <div *ngIf="!isLogin">
              <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Подтвердите пароль</label>
              <input 
                type="password" 
                [(ngModel)]="form.confirmPassword" 
                name="confirmPassword" 
                class="w-full border-2 border-black p-3 text-sm" 
                placeholder="••••••••"
              />
              <div *ngIf="!isLogin && passwordMismatch" class="mt-2 border-2 border-red-400 bg-red-50 p-3 text-red-700 text-xs">
                ⚠️ Пароли не совпадают!
              </div>
            </div>

            <button 
              type="submit" 
              class="w-full border-2 border-indigo-600 bg-indigo-600 text-white px-8 py-4 hover:bg-indigo-700 transition-colors font-bold uppercase tracking-wider text-sm"
            >
              {{ isLogin ? 'Войти' : 'Зарегистрироваться' }}
            </button>
          </form>

          <div class="mt-8 text-center border-t-2 border-gray-200 pt-6">
            <p class="text-sm text-gray-600 mb-3">
              {{ isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?' }}
            </p>
            <button 
              (click)="toggleMode()" 
              class="text-sm font-bold text-indigo-600 hover:underline uppercase tracking-wider"
            >
              {{ isLogin ? 'Зарегистрироваться' : 'Войти' }}
            </button>
          </div>

          <div class="mt-6 text-center">
            <a [routerLink]="'/'" class="text-xs hover:underline uppercase tracking-wider text-gray-600 hover:text-indigo-600 font-semibold">
              ← НАЗАД НА ГЛАВНУЮ
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class JuniorAuthPage {
  isLogin = true;
  passwordMismatch = false;
  form = {
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  };

  constructor(public router: Router) {}

  toggleMode(): void {
    this.isLogin = !this.isLogin;
    this.passwordMismatch = false;
  }

  submit(): void {
    if (!this.isLogin) {
      if (!this.form.name || !this.form.email || !this.form.password || !this.form.confirmPassword) {
        alert('Заполните все поля!');
        return;
      }
      if (this.form.password !== this.form.confirmPassword) {
        this.passwordMismatch = true;
        return;
      }
      this.passwordMismatch = false;
    }
    
    if (!this.form.email || !this.form.password) {
      alert('Введите email и пароль!');
      return;
    }

    this.router.navigateByUrl('/candidate-dashboard');
  }
}

