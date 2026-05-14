import { Component, inject, signal, computed, OnInit, ElementRef, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AiChatsService } from '../../core/services/ai-chats.service';
import { AiChat, AiChatMessage } from '../../core/models/api.models';
import { MarkdownPipe } from '../utils/markdown.pipe';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownPipe],
  template: `
    <!-- Кнопка-пузырик чата -->
    @if (authService.isLoggedIn() && !isOpen()) {
      <button
        id="ai-chat-toggle"
        (click)="toggleChat()"
        class="fixed bottom-6 right-6 z-[9000] w-14 h-14 rounded-full
               bg-gradient-to-br from-indigo-600 to-purple-600
               text-white shadow-lg shadow-indigo-500/30
               hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105
               transition-all duration-300 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>

        @if (hasUnreadWelcome()) {
          <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
        }
      </button>
    }

    <!-- Окно чата -->
    @if (authService.isLoggedIn() && isOpen()) {
      <div
        class="fixed bottom-6 right-6 z-[9000] w-[400px] max-h-[600px] flex flex-col
               bg-white rounded-2xl shadow-2xl border border-slate-200
               animate-chat-open overflow-hidden"
      >
        <!-- Шапка -->
        <div class="flex items-center justify-between px-5 py-3.5
                    bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
              AI
            </div>
            <div>
              <h3 class="text-sm font-semibold leading-none">AI Ассистент</h3>
              <span class="text-[11px] text-white/70">TalentBridge</span>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button
              id="ai-chat-new"
              (click)="startNewChat()"
              title="Новый чат"
              class="w-8 h-8 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button
              id="ai-chat-close"
              (click)="toggleChat()"
              title="Свернуть"
              class="w-8 h-8 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Область сообщений -->
        <div
          #messagesContainer
          class="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[300px] max-h-[440px]
                 bg-gradient-to-b from-slate-50 to-white"
        >
          @if (isLoading()) {
            <div class="flex items-center justify-center h-full">
              <div class="flex items-center gap-2 text-slate-400">
                <div class="ai-chat-spinner"></div>
                <span class="text-sm">Загрузка чата...</span>
              </div>
            </div>
          } @else {
            @if (messages().length === 0) {
              <div class="flex flex-col items-center justify-center h-full text-center px-6">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100
                            flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(79, 70, 229)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <h4 class="text-sm font-semibold text-slate-700 mb-1">Привет! 👋</h4>
                <p class="text-xs text-slate-500 leading-relaxed">
                  Я AI-ассистент TalentBridge. Задайте мне вопрос о платформе, заданиях или вашем профиле.
                </p>
              </div>
            }

            @for (msg of messages(); track msg.id) {
              <div class="flex" [class.justify-end]="msg.author === 'User'">
                <div
                  class="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                  [ngClass]="{
                    'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-md': msg.author === 'User',
                    'bg-white text-slate-700 border border-slate-200 shadow-sm rounded-bl-md': msg.author === 'Ai'
                  }"
                >
                  <div
                    class="ai-chat-content"
                    [class.ai-chat-user-content]="msg.author === 'User'"
                    [innerHTML]="msg.text | markdown"
                  ></div>
                  <div
                    class="text-[10px] mt-1.5 opacity-60"
                    [class.text-right]="msg.author === 'User'"
                  >
                    {{ formatTime(msg.createdAt) }}
                  </div>
                </div>
              </div>
            }

            <!-- Loader бота -->
            @if (isSending()) {
              <div class="flex">
                <div class="bg-white text-slate-700 border border-slate-200 shadow-sm rounded-2xl rounded-bl-md px-4 py-3">
                  <div class="flex items-center gap-1.5">
                    <span class="ai-chat-dot"></span>
                    <span class="ai-chat-dot ai-chat-dot-2"></span>
                    <span class="ai-chat-dot ai-chat-dot-3"></span>
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <!-- Поле ввода -->
        <div class="px-4 py-3 border-t border-slate-100 bg-white">
          <div class="flex items-end gap-2">
            <textarea
              #messageInput
              id="ai-chat-input"
              [(ngModel)]="messageText"
              (keydown.enter)="onEnterKey($event)"
              placeholder="Напишите сообщение..."
              rows="1"
              [disabled]="isSending()"
              class="flex-1 resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm
                     focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
                     placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed
                     max-h-[100px] transition-colors"
              (input)="autoResize($event)"
            ></textarea>
            <button
              id="ai-chat-send"
              (click)="sendMessage()"
              [disabled]="isSending() || !messageText.trim()"
              class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600
                     text-white flex items-center justify-center flex-shrink-0
                     hover:shadow-md hover:shadow-indigo-300/50 transition-all
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes chat-open {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .animate-chat-open {
      animation: chat-open 0.25s ease-out;
    }

    .ai-chat-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgb(203 213 225);
      border-top-color: rgb(99 102 241);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .ai-chat-dot {
      display: inline-block;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: rgb(148 163 184);
      animation: dot-pulse 1.4s ease-in-out infinite;
    }

    .ai-chat-dot-2 {
      animation-delay: 0.2s;
    }

    .ai-chat-dot-3 {
      animation-delay: 0.4s;
    }

    @keyframes dot-pulse {
      0%, 80%, 100% {
        opacity: 0.3;
        transform: scale(0.8);
      }
      40% {
        opacity: 1;
        transform: scale(1);
      }
    }

    /* ===== Markdown-стили для контента сообщений (marked) ===== */

    :host ::ng-deep .ai-chat-content {
      word-break: break-word;
    }

    :host ::ng-deep .ai-chat-content > *:first-child {
      margin-top: 0;
    }

    :host ::ng-deep .ai-chat-content > *:last-child {
      margin-bottom: 0;
    }

    :host ::ng-deep .ai-chat-content h1,
    :host ::ng-deep .ai-chat-content h2 {
      font-size: 1rem;
      font-weight: 700;
      margin: 0.5rem 0 0.25rem;
    }

    :host ::ng-deep .ai-chat-content h3 {
      font-size: 0.9375rem;
      font-weight: 600;
      margin: 0.5rem 0 0.25rem;
    }

    :host ::ng-deep .ai-chat-content h4,
    :host ::ng-deep .ai-chat-content h5,
    :host ::ng-deep .ai-chat-content h6 {
      font-size: 0.875rem;
      font-weight: 600;
      margin: 0.375rem 0 0.25rem;
    }

    :host ::ng-deep .ai-chat-content p {
      margin: 0.25rem 0;
    }

    :host ::ng-deep .ai-chat-content pre {
      display: block;
      background: rgb(30 41 59);
      color: rgb(226 232 240);
      border-radius: 0.5rem;
      padding: 0.75rem;
      margin: 0.5rem 0;
      font-size: 0.75rem;
      overflow-x: auto;
    }

    :host ::ng-deep .ai-chat-content pre code {
      background: none;
      color: inherit;
      padding: 0;
      border-radius: 0;
      font-size: inherit;
    }

    :host ::ng-deep .ai-chat-content code {
      background: rgb(241 245 249);
      color: rgb(220 38 38);
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-size: 0.8125rem;
      font-family: 'Courier New', monospace;
    }

    :host ::ng-deep .ai-chat-user-content code {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    :host ::ng-deep .ai-chat-user-content pre {
      background: rgba(0, 0, 0, 0.25);
      color: rgb(226 232 240);
    }

    :host ::ng-deep .ai-chat-content a {
      color: rgb(99 102 241);
      text-decoration: underline;
    }

    :host ::ng-deep .ai-chat-user-content a {
      color: rgb(199 210 254);
    }

    :host ::ng-deep .ai-chat-content ul,
    :host ::ng-deep .ai-chat-content ol {
      margin: 0.375rem 0;
      padding-left: 1.25rem;
    }

    :host ::ng-deep .ai-chat-content ul {
      list-style-type: disc;
    }

    :host ::ng-deep .ai-chat-content ol {
      list-style-type: decimal;
    }

    :host ::ng-deep .ai-chat-content li {
      margin: 0.125rem 0;
    }

    :host ::ng-deep .ai-chat-content blockquote {
      border-left: 3px solid rgb(199 210 254);
      padding-left: 0.75rem;
      margin: 0.375rem 0;
      color: rgb(100 116 139);
    }

    :host ::ng-deep .ai-chat-content table {
      border-collapse: collapse;
      margin: 0.5rem 0;
      font-size: 0.8125rem;
      width: 100%;
    }

    :host ::ng-deep .ai-chat-content th,
    :host ::ng-deep .ai-chat-content td {
      border: 1px solid rgb(226 232 240);
      padding: 0.25rem 0.5rem;
    }

    :host ::ng-deep .ai-chat-content th {
      background: rgb(241 245 249);
      font-weight: 600;
    }

    :host ::ng-deep .ai-chat-content hr {
      border: none;
      border-top: 1px solid rgb(226 232 240);
      margin: 0.5rem 0;
    }
  `]
})
export class AiChatComponent implements OnInit, AfterViewChecked {
  readonly authService = inject(AuthService);
  private readonly aiChatsService = inject(AiChatsService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;

  readonly isOpen = signal(false);
  readonly isLoading = signal(false);
  readonly isSending = signal(false);
  readonly hasUnreadWelcome = signal(false);

  private readonly chat = signal<AiChat | null>(null);

  readonly messages = computed<AiChatMessage[]>(() => {
    const c = this.chat();
    return c?.messages ?? [];
  });

  messageText = '';
  private shouldScrollToBottom = false;
  private initialized = false;

  ngOnInit(): void {
    // Ничего не делаем здесь — инициализация по первому открытию
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom && this.messagesContainer) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  toggleChat(): void {
    const opening = !this.isOpen();
    this.isOpen.set(opening);

    if (opening && !this.initialized) {
      this.initChat();
    }

    if (opening) {
      this.hasUnreadWelcome.set(false);
      this.shouldScrollToBottom = true;
    }
  }

  private initChat(): void {
    this.initialized = true;
    this.isLoading.set(true);

    this.aiChatsService.getMyChat().subscribe({
      next: (chat) => {
        this.chat.set(chat);
        this.isLoading.set(false);
        this.shouldScrollToBottom = true;
      },
      error: () => {
        // Чат не найден — создаём новый
        this.aiChatsService.createChat().subscribe({
          next: (chat) => {
            this.chat.set(chat);
            this.isLoading.set(false);
            this.shouldScrollToBottom = true;
          },
          error: () => {
            this.isLoading.set(false);
          }
        });
      }
    });
  }

  startNewChat(): void {
    this.isLoading.set(true);
    this.aiChatsService.createChat().subscribe({
      next: (chat) => {
        this.chat.set(chat);
        this.isLoading.set(false);
        this.shouldScrollToBottom = true;
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  sendMessage(): void {
    const text = this.messageText.trim();
    if (!text || this.isSending()) return;

    const currentChat = this.chat();
    if (!currentChat) return;

    this.messageText = '';
    this.isSending.set(true);

    // Оптимистично добавляем сообщение пользователя
    const userMessage: AiChatMessage = {
      id: crypto.randomUUID(),
      text,
      author: 'User',
      createdAt: new Date().toISOString()
    };

    this.chat.update(c => c ? {
      ...c,
      messages: [...(c.messages ?? []), userMessage]
    } : c);

    this.shouldScrollToBottom = true;

    this.aiChatsService.sendMessage(currentChat.id, { text }).subscribe({
      next: (response) => {
        // Заменяем оптимистичное сообщение и добавляем ответ бота
        this.chat.update(c => {
          if (!c) return c;
          const messages = [...(c.messages ?? [])];
          // Ищем наше оптимистичное сообщение и заменяем его на серверное
          const idx = messages.findIndex(m => m.id === userMessage.id);
          if (idx !== -1) {
            messages[idx] = response.userRequest;
          }
          messages.push(response.aiResponse);
          return { ...c, messages };
        });

        this.isSending.set(false);
        this.shouldScrollToBottom = true;
      },
      error: () => {
        this.isSending.set(false);
      }
    });
  }

  onEnterKey(event: Event): void {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.shiftKey) return; // Shift+Enter — новая строка
    keyEvent.preventDefault();
    this.sendMessage();
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
  }

  formatTime(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {}
  }
}
