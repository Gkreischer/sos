import { Injectable, inject } from '@angular/core';
import { NotificationService } from './notification.service';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../config/app.config';
import { TicketInterface } from 'shared';
import { BehaviorSubject, catchError } from 'rxjs';
import { ErrorService } from './error.service';
import { tap } from 'rxjs';
import { PaginateInterface } from 'shared';
@Injectable({
  providedIn: 'root',
})
export class TicketService {
  http = inject(HttpClient);
  appConfig = inject(APP_CONFIG);
  errorService = inject(ErrorService);

  ticketsSubject = new BehaviorSubject<TicketInterface[] | null>(null);
  ticketSubject = new BehaviorSubject<TicketInterface | null>(null);

  get tickets() {
    return this.ticketsSubject.asObservable();
  }

  get ticket() {
    return this.ticketSubject.asObservable();
  }

  create(ticket: TicketInterface) {
    return this.http
      .post<TicketInterface>(`${this.appConfig.baseUrl}/tickets`, ticket)
      .pipe(
        tap((res) => {
          this.ticketsSubject.next([res, ...(this.ticketsSubject.value ?? [])]);
        }),
        catchError(this.errorService.handleError),
      );
  }

  update(id: number, ticket: TicketInterface) {
    return this.http
      .put<TicketInterface>(`${this.appConfig.baseUrl}/tickets/${id}`, ticket)
      .pipe(
        tap((res) => {
          this.ticketsSubject.next(
            this.ticketsSubject.getValue()!.map((ticket) => {
              if (ticket.id === id) {
                return res;
              }

              return ticket;
            }),
          );
        }),
        catchError(this.errorService.handleError),
      );
  }

  getTicket(ticketId: number) {
    return this.http
      .get<TicketInterface>(`${this.appConfig.baseUrl}/tickets/${ticketId}`)
      .pipe(
        tap((res) => {
          return this.ticketSubject.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getUserTickets(page?: number) {
    return this.http
      .get<
        PaginateInterface<TicketInterface[]>
      >(`${this.appConfig.baseUrl}/tickets/user${page ? `?page=${page}` : ''}`)
      .pipe(
        tap((res) => {
          if (page && page >= 2) {
            this.ticketsSubject.next([
              ...(this.ticketsSubject.value ?? []),
              ...res.data,
            ]);
          } else {
            this.ticketsSubject.next(res.data);
          }
        }),
        catchError(this.errorService.handleError),
      );
  }
}
