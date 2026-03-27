import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import {
  AssignmentFullInfo,
  AssignmentCreateApiRequest,
  AssignmentUpdateEntity,
  AssignmentSearchRequest,
  AssignmentSearchResponse
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AssignmentsService {
  private readonly apiClient = inject(ApiClientService);

  /**
   * Получить задачу по ID
   */
  getAssignment(id: string): Observable<AssignmentFullInfo> {
    return this.apiClient.get<AssignmentFullInfo>(`/assignments/${id}`);
  }

  /**
   * Поиск задач
   */
  searchAssignments(request: AssignmentSearchRequest): Observable<AssignmentSearchResponse> {
    return this.apiClient.post<AssignmentSearchResponse>('/assignments/search', request);
  }

  /**
   * Создать новую задачу
   */
  createAssignment(request: AssignmentCreateApiRequest): Observable<AssignmentFullInfo> {
    return this.apiClient.post<AssignmentFullInfo>('/assignments', request);
  }

  /**
   * Обновить задачу
   */
  updateAssignment(id: string, request: AssignmentUpdateEntity): Observable<AssignmentFullInfo> {
    return this.apiClient.patch<AssignmentFullInfo>(`/assignments/${id}`, request);
  }
}
