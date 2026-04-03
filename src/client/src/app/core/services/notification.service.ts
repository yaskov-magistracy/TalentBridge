import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  private nextId = 0;

  getNotifications() {
    return this.notifications;
  }

  success(message: string, durationMs: number = 3000) {
    this.show(message, 'success', durationMs);
  }

  error(message: string, durationMs: number = 5000) {
    this.show(message, 'error', durationMs);
  }

  warning(message: string, durationMs: number = 4000) {
    this.show(message, 'warning', durationMs);
  }

  info(message: string, durationMs: number = 3000) {
    this.show(message, 'info', durationMs);
  }

  private show(message: string, type: Notification['type'], durationMs: number) {
    const id = this.nextId++;
    const notification: Notification = { id, message, type };
    
    this.notifications.update(notifications => [...notifications, notification]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.remove(id);
      }, durationMs);
    }
  }

  remove(id: number) {
    this.notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }
}
