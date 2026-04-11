import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import {
  SolutionFullInfo,
  SolutionCreateApiRequest,
  SolutionPatchApiRequest,
  SolutionSearchRequest,
  SolutionSearchResponse
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class SolutionsService {
  private readonly apiClient = inject(ApiClientService);

  /**
   * Получить решение по ID
   */
  getSolution(id: string): Observable<SolutionFullInfo> {
    return this.apiClient.get<SolutionFullInfo>(`/solutions/${id}`);
  }

  /**
   * Поиск решений
   */
  searchSolutions(request: SolutionSearchRequest): Observable<SolutionSearchResponse> {
    return this.apiClient.post<SolutionSearchResponse>('/solutions/search', request);
  }

  /**
   * Создать новое решение
   */
  createSolution(request: SolutionCreateApiRequest): Observable<SolutionFullInfo> {
    return this.apiClient.post<SolutionFullInfo>('/solutions', request);
  }

  /**
   * Обновить решение
   */
  updateSolution(id: string, request: SolutionPatchApiRequest): Observable<SolutionFullInfo> {
    return this.apiClient.patch<SolutionFullInfo>(`/solutions/${id}`, request);
  }

  /**
   * Вступить в команду решения
   */
  joinSolution(id: string): Observable<SolutionFullInfo> {
    return this.apiClient.patch<SolutionFullInfo>(`/solutions/${id}/join`, {});
  }

  /**
   * Запросить вступление в команду решения (требует подтверждения)
   */
  requestJoinSolution(id: string): Observable<SolutionFullInfo> {
    return this.apiClient.post<SolutionFullInfo>(`/solutions/${id}/join/request`, {});
  }

  /**
   * Одобрить заявку на вступление в команду
   */
  acceptJoinRequest(solutionId: string, candidateId: string): Observable<SolutionFullInfo> {
    return this.apiClient.post<SolutionFullInfo>(
      `/solutions/${solutionId}/join/request/accept`,
      { candidateJoinRequestedId: candidateId }
    );
  }

  /**
   * Начать решение (для лидера команды)
   */
  startSolution(id: string): Observable<SolutionFullInfo> {
    return this.apiClient.post<SolutionFullInfo>(`/solutions/${id}/start`, {});
  }

  /**
   * Отправить решение на проверку
   */
  sendToReview(id: string): Observable<SolutionFullInfo> {
    return this.apiClient.post<SolutionFullInfo>(`/solutions/${id}/send-to-review`, {});
  }
}
