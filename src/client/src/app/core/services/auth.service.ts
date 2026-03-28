import { Injectable, inject, signal, computed } from '@angular/core';
import { ApiClientService } from './api-client.service';
import { LoginRequest, SessionInfo, AccountRole } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiClient = inject(ApiClientService);

  private readonly sessionSignal = signal<SessionInfo | null>(null);

  readonly isLoggedIn = computed(() => this.sessionSignal() !== null);
  readonly currentUser = this.sessionSignal.asReadonly();
  readonly userRole = computed(() => this.sessionSignal()?.role ?? null);

  readonly isCandidate = computed(() => this.userRole() === 'Candidate');
  readonly isEmployer = computed(() => this.userRole() === 'Employer');
  readonly isAdmin = computed(() => this.userRole() === 'Admin');

  /**
   * Синхронная проверка статуса авторизации (для guards)
   */
  isLoggedInSync(): boolean {
    return this.sessionSignal() !== null;
  }

  /**
   * Получить текущую сессию пользователя
   */
  getSession(): Promise<SessionInfo | null> {
    return new Promise((resolve) => {
      this.apiClient.get<SessionInfo>('/auth/session').subscribe({
        next: (session) => {
          this.sessionSignal.set(session);
          resolve(session);
        },
        error: () => {
          this.sessionSignal.set(null);
          resolve(null);
        }
      });
    });
  }

  /**
   * Войти в систему
   */
  login(request: LoginRequest): Promise<SessionInfo> {
    return new Promise((resolve, reject) => {
      this.apiClient.post<SessionInfo>('/auth/login', request).subscribe({
        next: (session) => {
          this.sessionSignal.set(session);
          resolve(session);
        },
        error: (error) => reject(error)
      });
    });
  }

  /**
   * Выйти из системы
   */
  logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiClient.postVoid('/auth/logout').subscribe({
        next: () => {
          this.sessionSignal.set(null);
          resolve();
        },
        error: (error) => reject(error)
      });
    });
  }

  /**
   * Очистить локальное состояние сессии (без вызова API)
   */
  clearSession(): void {
    this.sessionSignal.set(null);
  }
}
