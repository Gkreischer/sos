import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Part } from '../_models/Part';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';
import { BehaviorSubject, catchError, tap } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class PartService {

  partsSearchedSubject: BehaviorSubject<Part[]> = new BehaviorSubject<Part[]>([]);

  get partsSearch() {
    return this.partsSearchedSubject.asObservable();
  }

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

  search(name: string) {
    return this.http.post<Part[]>(`${environment.baseUrl}/parts/search`, {search: name}, httpOptions).pipe(
      tap((parts) => {
        return this.partsSearchedSubject.next(parts);
      }),
      catchError(this.errorService.handleError)
    );
  }
}
