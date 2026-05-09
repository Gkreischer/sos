import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { Equipment } from '../_models/Equipment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorService } from './error.service';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  equipmentsSubject = new BehaviorSubject<Equipment[]>([]);

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
  ) {}

  get equipments() {
    return this.equipmentsSubject.asObservable();
  }

  getEquipments() {
    return this.http
      .get<Equipment[]>(`${environment.baseUrl}/equipments`, httpOptions)
      .pipe(
        tap((equipments) => {
          return this.equipmentsSubject.next(equipments);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getUserEquipments(user: User) {
    return this.http
      .get<
        Equipment[]
      >(`${environment.baseUrl}/users/${user.id}/equipments`, httpOptions)
      .pipe(
        tap((equipments) => {
          return this.equipmentsSubject.next(equipments);
        }),
        catchError(this.errorService.handleError),
      );
  }

  addEquipment(equipment: Equipment) {
    return this.http
      .post<Equipment>(
        `${environment.baseUrl}/equipments`,
        equipment,
        httpOptions,
      )
      .pipe(
        tap((equipment) => {
          return this.equipmentsSubject.next([
            equipment,
            ...this.equipmentsSubject.value,
          ]);
        }),
        catchError(this.errorService.handleError),
      );
  }

  updateEquipment(equipment: Equipment, id: number) {
    return this.http
      .put<Equipment>(
        `${environment.baseUrl}/equipments/${id}`,
        equipment,
        httpOptions,
      )
      .pipe(
        tap((updatedEquipment) => {
          const newEquipments = this.equipmentsSubject.value.map(
            (equipment) => {
              if (equipment.id === updatedEquipment.id) {
                return updatedEquipment;
              }
              return equipment;
            },
          );
          console.log(newEquipments);
          return this.equipmentsSubject.next(newEquipments);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
