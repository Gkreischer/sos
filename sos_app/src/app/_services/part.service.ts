import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Part } from '../_models/Part';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';
import { BehaviorSubject, catchError, map, tap } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class PartService {

  partsSearchedSubject: BehaviorSubject<Part[]> = new BehaviorSubject<Part[]>([]);
  partsSubject: BehaviorSubject<Part[]> = new BehaviorSubject<Part[]>([]);
  partSubject: BehaviorSubject<Part> = new BehaviorSubject<Part>({} as Part);

  get partsSearch() {
    return this.partsSearchedSubject.asObservable();
  }

  get parts() {
    return this.partsSubject.asObservable();
  }

  get part() {
    return this.partSubject.asObservable();
  }

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

  getParts() {
    return this.http.get<Part[]>(`${environment.baseUrl}/parts`, httpOptions).pipe(
      tap((parts) => {
        return this.partsSubject.next(parts);
      }),
      catchError(this.errorService.handleError)
    );
  }

  getPartById(id: number) {
    return this.http.get<Part>(`${environment.baseUrl}/parts/${id.toString()}`, httpOptions).pipe(
      tap((part) => {
        return this.partSubject.next(part);
      }),
      catchError(this.errorService.handleError)
    );
  }

  search(name: string) {
    return this.http.post<Part[]>(`${environment.baseUrl}/parts/search`, {search: name}, httpOptions).pipe(
      tap((parts) => {
        return this.partsSearchedSubject.next(parts);
      }),
      catchError(this.errorService.handleError)
    );
  }

  update(part: Part, id: number) {
    return this.http.put<Part>(`${environment.baseUrl}/parts/${id.toString()}`, part, httpOptions).pipe(
      tap((partReceived) => {
        const newParts = this.partsSubject.value.map((part) => {
          if (part.id === partReceived.id) {
            return partReceived;
          }
          return part;
        });

        return this.partsSubject.next(newParts);
      }),
      catchError(this.errorService.handleError)
    );
  }
}
