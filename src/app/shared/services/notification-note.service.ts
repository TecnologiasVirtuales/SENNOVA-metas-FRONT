import { inject, Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationNoteService {

  private notification = inject(NzNotificationService);

  success(title: string, content: string): void {
    this.notification.create('success', title, content);
  }

  info(title: string, content: string): void {
    this.notification.create('info', title, content);
  }

  warning(title: string, content: string): void {
    this.notification.create('warning', title, content);
  }

  error(title: string, content: string): void {
    this.notification.create('error', title, content);
  }

}
