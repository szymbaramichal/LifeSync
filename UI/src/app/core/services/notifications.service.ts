import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { GroupInvitationNotification } from '../models/notifications.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private eventSource: EventSource | null = null;
  private baseUrl = environment.apiUrl;

  private _notifications = signal<GroupInvitationNotification[]>([]);
  notifications = this._notifications.asReadonly();

  private _latest = signal<GroupInvitationNotification | null>(null);
  latest = this._latest.asReadonly();

  unreadCount = computed(() => this._notifications().length);
  hasNotifications = computed(() => this._notifications().length > 0);

  async connect(): Promise<void> {
    if (this.eventSource) return;

    const token = await this.authService.getToken();
    if (!token) return;

    const url = this.baseUrl + `/notifications/stream?access_token=` + token;
    this.eventSource = new EventSource(url);

    this.eventSource.addEventListener('notifications', (event: MessageEvent) => {
      const notification = JSON.parse(event.data) as GroupInvitationNotification;
      this._notifications.update(list => [...list, notification]);
      this._latest.set(notification);
    });

    this.eventSource.onerror = () => {
      this.disconnect();
      console.warn('SSE connection lost, browser will retry...');
    };
  }

  dismiss(groupId: string): void {
    this._notifications.update(list => list.filter(n => n.groupId !== groupId));
  }

  clearAll(): void {
    this._notifications.set([]);
  }

  disconnect() {
    this.eventSource?.close();
    this.eventSource = null;
    this._notifications.set([]);
  }

  constructor() {
    this.destroyRef.onDestroy(() => this.disconnect());
    effect(() => {
      const user = this.authService.currentUser();

      if (user) {
        void this.connect();
      } else {
        this.disconnect();
      }
    });
  }
}
