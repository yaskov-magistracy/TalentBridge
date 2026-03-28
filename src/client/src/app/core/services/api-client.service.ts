import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError } from '../models/api.models';

const API_BASE_URL = '/api';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);

  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  // ==================== GET ====================

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${API_BASE_URL}${url}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== POST ====================

  post<T>(url: string, body?: unknown): Observable<T> {
    return this.http.post<T>(`${API_BASE_URL}${url}`, body, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  postVoid(url: string, body?: unknown): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}${url}`, body, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== PUT ====================

  put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${API_BASE_URL}${url}`, body, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== PATCH ====================

  patch<T>(url: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${API_BASE_URL}${url}`, body, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== DELETE ====================

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${API_BASE_URL}${url}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== Error Handling ====================

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Произошла неизвестная ошибка';
    let errors: Record<string, string[]> | undefined;

    // Извлекаем детали ошибки из ответа сервера
    if (error.error) {
      // Пробуем получить сообщение из формата .NET ProblemDetails
      if (typeof error.error === 'object') {
        message = error.error.title || error.error.message || message;
        errors = error.error.errors;

        // Если есть детали валидации, добавляем их к сообщению
        if (errors) {
          const validationMessages = Object.values(errors).flat().join('\n');
          if (validationMessages) {
            message = validationMessages;
          }
        }
      } else if (typeof error.error === 'string') {
        message = error.error;
      }
    }

    // Переопределяем сообщения для стандартных статусов
    if (error.status === 0) {
      message = 'Сервер недоступен. Проверьте подключение к сети.';
    } else if (error.status === 401) {
      message = 'Неверный логин или пароль.';
    } else if (error.status === 403) {
      message = 'Доступ запрещён.';
    } else if (error.status === 404) {
      message = 'Ресурс не найден.';
    } else if (error.status === 400) {
      message = message || 'Ошибка валидации. Проверьте введённые данные.';
    } else if (error.status >= 500) {
      message = 'Ошибка сервера. Попробуйте позже.';
    }

    const apiError: ApiError = {
      status: error.status,
      message,
      errors,
    };

    return throwError(() => apiError);
  }
}
