/**
 * AuthService - Сервис аутентификации
 * 
 * Управляет аутентификацией пользователей (кандидатов и работодателей).
 * Работает с FastAPI endpoints для входа, регистрации и управления сессией.
 * 
 * Endpoints:
 * - POST /auth/login - вход
 * - POST /auth/register - регистрация
 * - POST /auth/refresh - обновление токена
 * - POST /auth/logout - выход
 * - GET /auth/me - информация о текущем пользователе
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';
import { environment } from '../../environments/environment';

/**
 * Интерфейс запроса на вход
 */
export interface LoginRequest {
  email: string;
  password: string;
  role: 'candidate' | 'employer';
}

/**
 * Интерфейс запроса на регистрацию кандидата
 */
export interface RegisterCandidateRequest {
  email: string;
  password: string;
  name: string;
  role: 'candidate';
}

/**
 * Интерфейс ответа с токеном
 */
export interface AuthResponse {
  /** JWT access token */
  access_token: string;
  /** Тип токена (Bearer) */
  token_type: string;
  /** Время жизни токена в секундах */
  expires_in: number;
}

/**
 * Интерфейс пользователя
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'employer';
  created_at?: string;
  updated_at?: string;
}

/**
 * Интерфейс профиля кандидата
 */
export interface CandidateProfile {
  id: string;
  user_id: string;
  full_name: string;
  city: string;
  about: string;
  skills: { name: string; level: 'beginner' | 'basic' | 'experienced' }[];
  rating: number;
  completed_tasks_count: number;
  success_rate: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  /** Subject для отслеживания состояния аутентификации */
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  
  /** Observable для подписки на изменения аутентификации */
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(http: HttpClient) {
    super(http);
  }

  // ============================================================
  // АУТЕНТИФИКАЦИЯ
  // ============================================================

  /**
   * Вход пользователя
   * @param credentials - данные для входа
   * @returns Observable с токеном
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.post<AuthResponse>('auth/login', credentials).pipe(
      tap(response => {
        this.setAuthToken(response.access_token);
        this.setUserRole(credentials.role);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  /**
   * Регистрация кандидата
   * @param data - данные для регистрации
   * @returns Observable с созданным пользователем
   */
  registerCandidate(data: RegisterCandidateRequest): Observable<User> {
    return this.post<User>('auth/register/candidate', data);
  }

  /**
   * Выход пользователя
   * Удаляет токен и очищает состояние
   */
  logout(): void {
    // Можно добавить запрос к API для инвалидации токена
    // this.post('auth/logout', {}).subscribe();
    
    this.clearAuthToken();
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Обновление токена
   * @returns Observable с новым токеном
   */
  refreshToken(): Observable<AuthResponse> {
    return this.post<AuthResponse>('auth/refresh').pipe(
      tap(response => {
        this.setAuthToken(response.access_token);
      })
    );
  }

  // ============================================================
  // ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
  // ============================================================

  /**
   * Получение информации о текущем пользователе
   * @returns Observable с данными пользователя
   */
  getCurrentUser(): Observable<User> {
    return this.get<User>('auth/me');
  }

  /**
   * Получение профиля кандидата
   * @param candidateId - ID кандидата (если не указан - текущий)
   * @returns Observable с профилем
   */
  getCandidateProfile(candidateId?: string): Observable<CandidateProfile> {
    const endpoint = candidateId 
      ? `candidates/${candidateId}/profile`
      : 'candidates/me/profile';
    return this.get<CandidateProfile>(endpoint);
  }

  /**
   * Обновление профиля кандидата
   * @param data - данные для обновления
   * @returns Observable с обновленным профилем
   */
  updateCandidateProfile(data: Partial<CandidateProfile>): Observable<CandidateProfile> {
    return this.put<CandidateProfile>('candidates/me/profile', data);
  }

  // ============================================================
  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // ============================================================

  /**
   * Проверка наличия токена
   * @returns true если токен есть
   */
  private hasToken(): boolean {
    return !!this.getAuthToken();
  }

  /**
   * Получение роли текущего пользователя
   * @returns роль или null
   */
  getUserRole(): 'candidate' | 'employer' | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(environment.auth.roleKey) as 'candidate' | 'employer' | null;
    }
    return null;
  }

  /**
   * Сохранение роли пользователя
   * @param role - роль пользователя
   */
  private setUserRole(role: 'candidate' | 'employer'): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(environment.auth.roleKey, role);
    }
  }

  /**
   * Получение ID текущего пользователя
   * @returns ID или null
   */
  getUserId(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(environment.auth.userIdKey);
    }
    return null;
  }

  /**
   * Сохранение ID пользователя
   * @param userId - ID пользователя
   */
  setUserId(userId: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(environment.auth.userIdKey, userId);
    }
  }
}
