import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, catchError } from 'rxjs';
import { CepInterface } from '../_interfaces/CepInterface';
import { ErrorService } from './error.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CepService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);

  constructor() {}

  resultSubject = new BehaviorSubject<CepInterface | null>(null);

  get result() {
    return this.resultSubject.asObservable();
  }

  getCep(cep: string) {
    const formatedCep = cep.replace(/\D/g, '');
    return this.http
      .get<CepInterface>(`${environment.cepUrl}/${formatedCep}/json`)
      .pipe(
        tap((data) => {
          this.resultSubject.next(data);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
