import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-employer-auth-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex flex-col">
      <div class="border-b-2 border-emerald-600 bg-white shadow-md">
        <div class="max-w-7xl mx-auto py-4 px-8">
          <a [routerLink]="'/'">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent cursor-pointer">
              TALENTBRIDGE
            </h1>
          </a>
        </div>
      </div>

      <div class="flex-1 flex items-center justify-center px-8 py-16">
        <div class="w-full max-w-md border-2 border-emerald-600 bg-white p-8 shadow-lg">
          <h2 class="text-2xl font-bold mb-8 text-center uppercase text-emerald-600 tracking-wider">Вход для работодателя</h2>

          <div class="border-2 border-amber-400 bg-amber-50 p-4 mb-6 text-xs text-amber-900 font-semibold">
            <strong>⚠️ ПРИМЕЧАНИЕ:</strong> Регистрация работодателей производится вручную.
          </div>

          <form (ngSubmit)="submit()" class="space-y-6">
            <div>
              <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Email</label>
              <input 
                type="email" 
                [(ngModel)]="email" 
                name="email" 
                class="w-full border-2 border-black p-3 text-sm" 
                placeholder="company@email.com"
                required 
              />
            </div>

            <div>
              <label class="block font-bold mb-2 text-xs uppercase tracking-wider text-gray-500">Пароль</label>
              <input 
                type="password" 
                [(ngModel)]="password" 
                name="password" 
                class="w-full border-2 border-black p-3 text-sm" 
                placeholder="••••••••"
                required 
              />
            </div>

            <button 
              type="submit" 
              class="w-full border-2 border-emerald-600 bg-emerald-600 text-white px-8 py-4 hover:bg-emerald-700 transition-colors font-bold uppercase tracking-wider text-sm"
            >
              Войти
            </button>
          </form>

          <div class="mt-8 text-center">
            <a [routerLink]="'/'" class="text-xs hover:underline uppercase tracking-wider text-gray-600 hover:text-emerald-600 font-semibold">
              ← НАЗАД НА ГЛАВНУЮ
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployerAuthPage {
  email = '';
  password = '';

  constructor(public router: Router) {}

  submit(): void {
    if (!this.email || !this.password) {
      alert('Введите email и пароль!');
      return;
    }
    this.router.navigateByUrl('/employer-dashboard');
  }
}

