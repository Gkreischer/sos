import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PartInterface } from 'shared';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'shared';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { PaginateInterface } from 'shared';
import { PartFilterInterface } from 'shared';
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

  partsSearchedSubject: BehaviorSubject<PartInterface[] | null> =
    new BehaviorSubject<PartInterface[] | null>(null);
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

  getParts(page?: number) {
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
          console.log(partReceived);
          const newParts = this.partsSubject.value.map((part) => {
            if (part.id === partReceived.id) {
              return partReceived;
            }
            return part;
          });
          console.log(newParts);
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

  delete(id: number) {
    return this.http
      .delete<PartInterface>(
        `${environment.baseUrl}/parts/${id.toString()}`,
        httpOptions,
      )
      .pipe(
        tap((part) => {
          const newParts = this.partsSubject.value.filter(
            (part) => part.id !== id,
          );
          return this.partsSubject.next(newParts);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
