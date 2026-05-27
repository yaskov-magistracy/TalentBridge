import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import {
  AiChat,
  AiChatSendMessageRequest,
  AiChatSendMessageResponse
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AiChatsService {
  private readonly apiClient = inject(ApiClientService);

  /**
   * Текущий активный чат
   */
  getMyChat(): Observable<AiChat> {
    return this.apiClient.get<AiChat>('/AiChats/my');
  }

  /**
   * Создать новый чат
   * Последний активный чат уйдёт в Архив (станет неактивным)
   */
  createChat(): Observable<AiChat> {
    return this.apiClient.post<AiChat>('/AiChats');
  }

  /**
   * Написать сообщение в чат
   */
  sendMessage(chatId: string, request: AiChatSendMessageRequest): Observable<AiChatSendMessageResponse> {
    return this.apiClient.post<AiChatSendMessageResponse>(`/AiChats/${chatId}/messages`, request);
  }
}
