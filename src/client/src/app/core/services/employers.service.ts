import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import {
  EmployerCreateRequest,
  EmployerUpdateEntity,
  EmployerFullInfo,
  ChangePasswordRequest
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class EmployersService {
  private readonly apiClient = inject(ApiClientService);

  /**
   * Зарегистрировать нового работодателя
   */
  createEmployer(request: EmployerCreateRequest): Observable<string> {
    return this.apiClient.post<string>('/employers', request);
  }

  /**
   * Обновить информацию о работодателе
   */
  updateEmployer(id: string, request: EmployerUpdateEntity): Observable<string> {
    return this.apiClient.post<string>(`/employers/${id}`, request);
  }

  /**
   * Сменить пароль работодателя
   */
  changePassword(id: string, request: ChangePasswordRequest): Observable<string> {
    return this.apiClient.post<string>(`/employers/${id}/change-password`, request);
  }
}
