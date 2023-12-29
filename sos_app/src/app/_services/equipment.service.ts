import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { Equipment } from '../_models/Equipment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorService } from './error.service';
import { environment } from 'src/environments/environment';

const httpHeaders = new HttpHeaders({
  'Content-Type': 'application/json',
  Accept: 'application/json',
});
@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  equipmentsSubject = new BehaviorSubject<Equipment[]>([]);

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  get equipments() {
    return this.equipmentsSubject.asObservable();
  }

  getEquipments() {
    return this.http
      .get<Equipment[]>(`${environment.baseUrl}/equipments`, {
        headers: httpHeaders,
      })
      .pipe(
        tap((equipments) => {
          return this.equipmentsSubject.next(equipments);
        }),
        catchError(this.errorService.handleError)
      );
  }
}
