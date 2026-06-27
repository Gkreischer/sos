import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { environment } from 'src/environments/environment';
import { RoomMessageInterface } from 'src/app/_interfaces/RoomMessageInterface';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { PaginateInterface } from 'src/app/_interfaces/PaginateInterface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);

  messagesSubject = new BehaviorSubject<RoomMessageInterface[]>([]);
  messageSubject = new BehaviorSubject<RoomMessageInterface | null>(null);

  get messages() {
    return this.messagesSubject.asObservable();
  }

  get message() {
    return this.messageSubject.asObservable();
  }
  constructor() {}

  sendMessage(message: RoomMessageInterface) {
    return this.http
      .post<RoomMessageInterface>(`${environment.baseUrl}/chat`, message)
      .pipe(
        tap((res) => {
          this.messageSubject.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getMessages() {
    return this.http
      .get<
        PaginateInterface<RoomMessageInterface[]>
      >(`${environment.baseUrl}/chat`)
      .pipe(
        tap((res) => {
          if (res.current_page > 1) {
            this.messagesSubject.next([
              ...this.messagesSubject.value,
              ...res.data,
            ]);
          } else {
            this.messagesSubject.next(res.data);
          }
        }),
        catchError(this.errorService.handleError),
      );
  }
}
