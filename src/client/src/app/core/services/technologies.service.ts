import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import {
  Technology,
  TechnologyCreateEntity,
  TechnologyUpdateEntity,
  TechnologySearchRequest,
  TechnologySearchResponse
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class TechnologiesService {
  private readonly apiClient = inject(ApiClientService);

  /**
   * Получить технологию по ID
   */
  getTechnology(id: string): Observable<Technology> {
    return this.apiClient.get<Technology>(`/technologies/${id}`);
  }

  /**
   * Поиск технологий
   */
  searchTechnologies(request: TechnologySearchRequest): Observable<TechnologySearchResponse> {
    return this.apiClient.post<TechnologySearchResponse>('/technologies/search', request);
  }

  /**
   * Создать новую технологию
   */
  createTechnology(request: TechnologyCreateEntity): Observable<Technology> {
    return this.apiClient.post<Technology>('/technologies', request);
  }

  /**
   * Обновить технологию
   */
  updateTechnology(id: string, request: TechnologyUpdateEntity): Observable<Technology> {
    return this.apiClient.patch<Technology>(`/technologies/${id}`, request);
  }
}
