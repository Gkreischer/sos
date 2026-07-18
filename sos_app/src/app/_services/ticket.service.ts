import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, tap, catchError } from 'rxjs';
import { TicketInterface } from '../_interfaces/TicketInterface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';
import { PaginateInterface } from '../_interfaces/PaginateInterface';
import { TicketFilterInterface } from '../_interfaces/TicketFilterInterface';
@Injectable({
  providedIn: 'root',
})
export class TicketService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);

  ticketsSubject = new BehaviorSubject<TicketInterface[]>([]);

  ticketSubject = new BehaviorSubject<TicketInterface | null>(null);

  public ticketFilters = signal(null as TicketFilterInterface | null);

  public setTicketFilter(ticketFilter: TicketFilterInterface | null) {
    this.ticketFilters.set(ticketFilter);
  }

  get tickets() {
    return this.ticketsSubject.asObservable();
  }

  get ticket() {
    return this.ticketSubject.asObservable();
  }

  public getAll(page?: number, ticketFilter?: TicketFilterInterface | null) {
    return this.http
      .post<
        PaginateInterface<TicketInterface[]>
      >(`${environment.baseUrl}/tickets/search${page ? `?page=${page}` : ''}`, ticketFilter)
      .pipe(
        tap((res) => {
          if (page && page >= 2) {
            this.ticketsSubject.next([
              ...this.ticketsSubject.getValue(),
              ...res.data,
            ]);
          } else {
            this.ticketsSubject.next(res.data);
          }
        }),
        catchError(this.errorService.handleError),
      );
  }

  getTicket(id: number) {
    return this.http
      .get<TicketInterface>(`${environment.baseUrl}/tickets/${id}`)
      .pipe(
        tap((res) => {
          return this.ticketSubject.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
