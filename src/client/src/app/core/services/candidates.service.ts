import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import {
  CandidateCreateRequest,
  CandidatePatchApiRequest,
  CandidateFullInfo,
  CandidateSearchRequest,
  CandidateSearchResponse,
  ChangePasswordRequest
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class CandidatesService {
  private readonly apiClient = inject(ApiClientService);

  /**
   * Получить полную информацию о соискателе по ID
   */
  getCandidate(id: string): Observable<CandidateFullInfo> {
    return this.apiClient.get<CandidateFullInfo>(`/candidates/${id}`);
  }

  /**
   * Зарегистрировать нового соискателя
   */
  createCandidate(request: CandidateCreateRequest): Observable<string> {
    return this.apiClient.post<string>('/candidates', request);
  }

  searchCandidates(request: CandidateSearchRequest): Observable<CandidateSearchResponse | CandidateFullInfo[]> {
    return this.apiClient.post<CandidateSearchResponse | CandidateFullInfo[]>('/Candidates/search', request);
  }

  /**
   * Обновить информацию о соискателе
   */
  updateCandidate(id: string, request: CandidatePatchApiRequest): Observable<string> {
    return this.apiClient.patch<string>(`/candidates/${id}`, request);
  }

  /**
   * Сменить пароль соискателя
   */
  changePassword(id: string, request: ChangePasswordRequest): Observable<string> {
    return this.apiClient.post<string>(`/candidates/${id}/change-password`, request);
  }
}
