import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, catchError } from 'rxjs';
import { RoomInterface } from 'shared';
import { environment } from '../../environments/environment';
import { ErrorService } from 'shared';
import { NotificationService } from 'shared';
import { PaginateInterface } from 'shared';
import { RoomMessageInterface } from 'shared';
@Injectable({
  providedIn: 'root',
})
export class RoomService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);
  notificationService = inject(NotificationService);

  roomsSubject: BehaviorSubject<RoomInterface[]> = new BehaviorSubject<
    RoomInterface[]
  >([]);
  roomSubject: BehaviorSubject<RoomInterface | null> =
    new BehaviorSubject<RoomInterface | null>(null);

  messagesSubject: BehaviorSubject<RoomMessageInterface[]> =
    new BehaviorSubject<RoomMessageInterface[]>([]);

  get rooms() {
    return this.roomsSubject.asObservable();
  }

  get room() {
    return this.roomSubject.asObservable();
  }

  get messages() {
    return this.messagesSubject.asObservable();
  }

  constructor() {}

  addMessageInRoom(message: RoomMessageInterface) {
    this.messagesSubject.next([...this.messagesSubject.value, message]);
  }

  addRoomInList(room: RoomInterface) {
    this.roomsSubject.next([room, ...this.roomsSubject.value]);
  }

  getAll(numPage?: number) {
    return this.http
      .get<
        PaginateInterface<RoomInterface[]>
      >(`${environment.baseUrl}/rooms${numPage ? `?page=${numPage}` : ''}`)
      .pipe(
        tap((res) => {
          if (numPage && numPage > 1) {
            return this.roomsSubject.next([
              ...this.roomsSubject.value,
              ...res.data,
            ]);
          } else {
            return this.roomsSubject.next(res.data);
          }
        }),
        catchError(this.errorService.handleError),
      );
  }

  getRoom(id: number) {
    return this.http
      .get<RoomInterface>(`${environment.baseUrl}/rooms/${id}`)
      .pipe(
        tap((room) => this.roomSubject.next(room)),
        catchError(this.errorService.handleError),
      );
  }

  create(room: RoomInterface) {
    return this.http
      .post<RoomInterface>(`${environment.baseUrl}/rooms`, room)
      .pipe(tap(), catchError(this.errorService.handleError));
  }

  update(roomId: number, room: RoomInterface) {
    return this.http
      .put<RoomInterface>(`${environment.baseUrl}/rooms/${roomId}`, room)
      .pipe(
        tap((room) =>
          this.roomsSubject.next(
            this.roomsSubject.value.map((r) => (r.id === room.id ? room : r)),
          ),
        ),
        catchError(this.errorService.handleError),
      );
  }

  delete(roomId: number) {
    return this.http
      .delete<RoomInterface>(`${environment.baseUrl}/rooms/${roomId}`)
      .pipe(
        tap((room) =>
          this.roomsSubject.next(
            this.roomsSubject.value.filter((r) => r.id !== room.id),
          ),
        ),
        catchError(this.errorService.handleError),
      );
  }

  getRoomMessages(roomId: number) {
    return this.http
      .post<
        RoomMessageInterface[]
      >(`${environment.baseUrl}/rooms/room/messages`, { room_id: roomId })
      .pipe(
        tap((messages) => this.messagesSubject.next(messages)),
        catchError(this.errorService.handleError),
      );
  }

  sendRoomMessage(roomId: number, content: string) {
    return this.http
      .post<RoomMessageInterface>(`${environment.baseUrl}/messages`, {
        room_id: roomId,
        content: content,
      })
      .pipe(tap(), catchError(this.errorService.handleError));
  }
}
