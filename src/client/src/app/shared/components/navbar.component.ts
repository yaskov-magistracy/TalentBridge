import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div [ngClass]="'border-b-2 ' + getBorderColor() + ' bg-white shadow-sm'">
      <div class="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <a [routerLink]="dashboardPath" class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
          TALENTBRIDGE
        </a>

        <div *ngIf="role" class="flex gap-8 items-center">
          <span class="text-sm uppercase tracking-wider border-2 px-3 py-1 font-semibold" [ngClass]="getRoleBadgeClasses()">
            {{ role === 'candidate' ? 'КАНДИДАТ' : 'РАБОТОДАТЕЛЬ' }}
          </span>
          <a (click)="logout()" class="text-sm uppercase tracking-wider font-semibold hover:text-indigo-600 transition-colors cursor-pointer">
            ВЫХОД
          </a>
        </div>
      </div>
    </div>
  `
})
export class NavbarComponent {
  @Input() role: 'candidate' | 'employer' | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigateByUrl('/');
    } catch (error) {
      console.error('Logout error:', error);
      this.authService.clearSession();
      this.router.navigateByUrl('/');
    }
  }

  get dashboardPath(): string {
    if (this.role === 'candidate') {
      return '/candidate-dashboard';
    }
    if (this.role === 'employer') {
      return '/employer-dashboard';
    }
    return '/';
  }

  getBorderColor(): string {
    return this.role === 'candidate' ? 'border-indigo-600' : 'border-emerald-600';
  }

  getRoleBadgeClasses(): string {
    if (this.role === 'candidate') {
      return 'border-indigo-600 text-indigo-600';
    }
    return 'border-emerald-600 text-emerald-600';
  }
}

