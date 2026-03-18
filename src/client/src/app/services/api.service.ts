/**
 * ApiService - Базовый сервис для HTTP-запросов
 * 
 * Предоставляет базовые методы для взаимодействия с FastAPI бэкендом.
 * Все остальные сервисы наследуются от этого базового сервиса.
 * 
 * Возможности:
 * - Автоматическое добавление базового URL и версии API
 * - Обработка JWT токена аутентификации
 * - Стандартная обработка ошибок
 * - Таймауты запросов
 * - Content-Type заголовки для FastAPI
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Интерфейс для стандартного ответа API
 */
export interface ApiResponse<T> {
  /** Успешность операции */
  success: boolean;
  /** Данные ответа */
  data?: T;
  /** Сообщение об ошибке или информационное сообщение */
  message?: string;
  /** Код ошибки */
  error_code?: string;
}

/**
 * Интерфейс для пагинированного ответа
 */
export interface PaginatedResponse<T> {
  /** Список элементов */
  items: T[];
  /** Общее количество элементов */
  total: number;
  /** Номер текущей страницы */
  page: number;
  /** Размер страницы */
  size: number;
  /** Общее количество страниц */
  pages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  /** Полный базовый URL API */
  protected readonly baseUrl: string;
  
  /** Таймаут запросов */
  protected readonly requestTimeout: number;

  constructor(protected http: HttpClient) {
    this.baseUrl = `${environment.apiUrl}${environment.apiVersion}`;
    this.requestTimeout = environment.requestTimeout;
  }

  // ============================================================
  // HTTP МЕТОДЫ
  // ============================================================

  /**
   * GET запрос
   * @param endpoint - конечная точка API (без базового URL)
   * @param params - query параметры
   * @returns Observable с ответом
   */
  get<T>(endpoint: string, params?: Record<string, any>): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpParams = this.buildParams(params);
    
    return this.http.get<T>(url, { 
      headers: this.getHeaders(),
      params: httpParams 
    }).pipe(
      timeout(this.requestTimeout),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * POST запрос
   * @param endpoint - конечная точка API
   * @param body - тело запроса
   * @returns Observable с ответом
   */
  post<T>(endpoint: string, body?: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    
    return this.http.post<T>(url, body, { 
      headers: this.getHeaders() 
    }).pipe(
      timeout(this.requestTimeout),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * PUT запрос
   * @param endpoint - конечная точка API
   * @param body - тело запроса
   * @returns Observable с ответом
   */
  put<T>(endpoint: string, body?: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    
    return this.http.put<T>(url, body, { 
      headers: this.getHeaders() 
    }).pipe(
      timeout(this.requestTimeout),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * PATCH запрос
   * @param endpoint - конечная точка API
   * @param body - тело запроса
   * @returns Observable с ответом
   */
  patch<T>(endpoint: string, body?: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    
    return this.http.patch<T>(url, body, { 
      headers: this.getHeaders() 
    }).pipe(
      timeout(this.requestTimeout),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * DELETE запрос
   * @param endpoint - конечная точка API
   * @returns Observable с ответом
   */
  delete<T>(endpoint: string): Observable<T> {
    const url = this.buildUrl(endpoint);
    
    return this.http.delete<T>(url, { 
      headers: this.getHeaders() 
    }).pipe(
      timeout(this.requestTimeout),
      catchError(this.handleError.bind(this))
    );
  }

  // ============================================================
  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // ============================================================

  /**
   * Построение полного URL
   * @param endpoint - относительный путь
   * @returns полный URL
   */
  protected buildUrl(endpoint: string): string {
    // Убираем начальный слэш если есть
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  /**
   * Построение query параметров
   * @param params - объект с параметрами
   * @returns HttpParams
   */
  protected buildParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            // Для массивов добавляем каждый элемент отдельно
            value.forEach(item => {
              httpParams = httpParams.append(key, item.toString());
            });
          } else {
            httpParams = httpParams.set(key, value.toString());
          }
        }
      });
    }
    
    return httpParams;
  }

  /**
   * Получение HTTP заголовков
   * @returns HttpHeaders с авторизацией
   */
  protected getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Добавляем JWT токен если есть
    const token = this.getAuthToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Получение токена аутентификации из localStorage
   * @returns токен или null
   */
  protected getAuthToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(environment.auth.tokenKey);
    }
    return null;
  }

  /**
   * Сохранение токена аутентификации
   * @param token - JWT токен
   */
  protected setAuthToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(environment.auth.tokenKey, token);
    }
  }

  /**
   * Удаление токена аутентификации (logout)
   */
  protected clearAuthToken(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(environment.auth.tokenKey);
      localStorage.removeItem(environment.auth.roleKey);
      localStorage.removeItem(environment.auth.userIdKey);
    }
  }

  /**
   * Обработка ошибок HTTP
   * @param error - объект ошибки
   * @returns Observable с ошибкой
   */
  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Произошла неизвестная ошибка';
    let errorCode = 'UNKNOWN_ERROR';

    if (error.error instanceof ErrorEvent) {
      // Клиентская ошибка (сеть и т.д.)
      errorMessage = `Ошибка сети: ${error.error.message}`;
      errorCode = 'NETWORK_ERROR';
    } else {
      // Серверная ошибка
      switch (error.status) {
        case 0:
          errorMessage = 'Не удалось подключиться к серверу. Проверьте подключение к интернету.';
          errorCode = 'CONNECTION_ERROR';
          break;
        case 400:
          errorMessage = error.error?.detail || 'Некорректный запрос';
          errorCode = 'BAD_REQUEST';
          break;
        case 401:
          errorMessage = 'Необходима авторизация';
          errorCode = 'UNAUTHORIZED';
          // Можно добавить автоматический редирект на страницу логина
          break;
        case 403:
          errorMessage = 'Доступ запрещен';
          errorCode = 'FORBIDDEN';
          break;
        case 404:
          errorMessage = 'Запрашиваемый ресурс не найден';
          errorCode = 'NOT_FOUND';
          break;
        case 422:
          // Ошибки валидации FastAPI
          errorMessage = this.formatValidationErrors(error.error);
          errorCode = 'VALIDATION_ERROR';
          break;
        case 500:
          errorMessage = 'Внутренняя ошибка сервера';
          errorCode = 'SERVER_ERROR';
          break;
        default:
          errorMessage = `Ошибка сервера: ${error.status} ${error.statusText}`;
          errorCode = `HTTP_${error.status}`;
      }
    }

    console.error('API Error:', error);
    return throwError(() => ({ message: errorMessage, code: errorCode, original: error }));
  }

  /**
   * Форматирование ошибок валидации FastAPI
   * @param error - объект ошибки от FastAPI
   * @returns строка с ошибками
   */
  protected formatValidationErrors(error: any): string {
    if (error?.detail && Array.isArray(error.detail)) {
      // FastAPI возвращает массив ошибок валидации
      return error.detail.map((err: any) => {
        const loc = err.loc?.join('.') || '';
        return `${loc}: ${err.msg}`;
      }).join('; ');
    }
    return error?.detail || 'Ошибка валидации данных';
  }
}
