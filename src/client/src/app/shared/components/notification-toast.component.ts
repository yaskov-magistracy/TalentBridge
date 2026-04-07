import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../core/services/notification.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[9999] space-y-2 max-w-md">
      <div
        *ngFor="let notification of notifications()"
        class="p-4 rounded-lg shadow-lg border-2 flex items-start gap-3 animate-slide-in"
        [class]="getNotificationClass(notification.type)"
      >
        <span class="text-xl">{{ getNotificationIcon(notification.type) }}</span>
        <p class="flex-1 text-sm font-medium">{{ notification.message }}</p>
        <button
          (click)="removeNotification(notification.id)"
          class="text-xl hover:opacity-70 transition-opacity flex-shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `],
})
export class NotificationToastComponent {
  private notificationService = inject(NotificationService);
  notifications: Signal<Notification[]> = this.notificationService.getNotifications();

  getNotificationClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-500 text-emerald-900';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-900';
      case 'warning':
        return 'bg-amber-50 border-amber-500 text-amber-900';
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-500 text-gray-900';
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  }

  removeNotification(id: number) {
    this.notificationService.remove(id);
  }
}
