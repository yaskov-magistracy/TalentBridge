import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoginForm } from '../shared/components/login-form.component';
import { RegisterForm } from '../shared/components/register-form.component';

@Component({
  selector: 'app-junior-auth-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LoginForm, RegisterForm],
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

          <app-login-form *ngIf="isLogin"></app-login-form>
          <app-register-form *ngIf="!isLogin"></app-register-form>
        </div>
      </div>
    </div>
  `
})
export class JuniorAuthPage {
  isLogin = true;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.isLogin = params['mode'] !== 'register';
    });
  }
}
