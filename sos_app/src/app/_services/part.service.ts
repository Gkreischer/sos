import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PartInterface } from '../_interfaces/PartInterface';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';
import { BehaviorSubject, catchError, map, tap } from 'rxjs';
import { PaginateInterface } from '../_interfaces/PaginateInterface';
import { PartFilterInterface } from '../_interfaces/PartFilterInterface';
import { signal } from '@angular/core';
import { inject } from '@angular/core';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class PartService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);

  partsSearchedSubject: BehaviorSubject<PartInterface[]> = new BehaviorSubject<
    PartInterface[]
  >([]);
  partsSubject: BehaviorSubject<PartInterface[]> = new BehaviorSubject<
    PartInterface[]
  >([]);
  partSubject: BehaviorSubject<PartInterface> =
    new BehaviorSubject<PartInterface>({} as PartInterface);

  partFilters = signal<PartFilterInterface | null>(null);

  get partsSearch() {
    return this.partsSearchedSubject.asObservable();
  }

  get parts() {
    return this.partsSubject.asObservable();
  }

  get part() {
    return this.partSubject.asObservable();
  }

  setPartFilters(filters: PartFilterInterface | null) {
    this.partFilters.set(filters);
  }

  constructor() {}

  getParts(page?: number, filters?: PartFilterInterface | null) {
    return this.http
      .post<
        PaginateInterface<PartInterface[]>
      >(`${environment.baseUrl}/parts/filter${page ? `?page=${page}` : ''}`, this.partFilters(), httpOptions)
      .pipe(
        tap((parts) => {
          if (page && page > 1) {
            return this.partsSubject.next([
              ...this.partsSubject.value,
              ...parts.data,
            ]);
          } else {
            return this.partsSubject.next(parts.data);
          }
        }),
        catchError(this.errorService.handleError),
      );
  }

  getPartById(id: number) {
    return this.http
      .get<PartInterface>(
        `${environment.baseUrl}/parts/${id.toString()}`,
        httpOptions,
      )
      .pipe(
        tap((part) => {
          return this.partSubject.next(part);
        }),
        catchError(this.errorService.handleError),
      );
  }

  search(name: string) {
    return this.http
      .post<
        PartInterface[]
      >(`${environment.baseUrl}/parts/search`, { search: name }, httpOptions)
      .pipe(
        tap((parts) => {
          return this.partsSearchedSubject.next(parts);
        }),
        catchError(this.errorService.handleError),
      );
  }

  update(part: PartInterface, id: number) {
    return this.http
      .put<PartInterface>(
        `${environment.baseUrl}/parts/${id.toString()}`,
        part,
        httpOptions,
      )
      .pipe(
        tap((partReceived) => {
          const newParts = this.partsSubject.value.map((part) => {
            if (part.id === partReceived.id) {
              return partReceived;
            }
            return part;
          });

          return this.partsSubject.next(newParts);
        }),
        catchError(this.errorService.handleError),
      );
  }

  public create(part: PartInterface) {
    return this.http
      .post<PartInterface>(`${environment.baseUrl}/parts`, part, httpOptions)
      .pipe(
        tap((partReceived) => {
          const newParts = [partReceived, ...this.partsSubject.value];
          return this.partsSubject.next(newParts);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
