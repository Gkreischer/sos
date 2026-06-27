import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { EquipmentInterface } from '../_interfaces/EquipmentInterface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorService } from './error.service';
import { environment } from 'src/environments/environment';
import { UserInterface } from '../_interfaces/UserInterface';
import { PaginateInterface } from '../_interfaces/PaginateInterface';
import { EquipmentFilterInterface } from '../_interfaces/EquipmentFilterInterface';
import { effect } from '@angular/core';
import { signal } from '@angular/core';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);

  equipmentsSubject = new BehaviorSubject<EquipmentInterface[]>([]);

  equipmentFilter = signal<EquipmentFilterInterface | null>(null);

  constructor() {}

  get equipments() {
    return this.equipmentsSubject.asObservable();
  }

  setEquipmentFilter(equipmentFilter: EquipmentFilterInterface | null) {
    this.equipmentFilter.set(equipmentFilter);
  }

  getUserEquipments(user: UserInterface) {
    return this.http
      .get<
        EquipmentInterface[]
      >(`${environment.baseUrl}/users/${user.id}/equipments`, httpOptions)
      .pipe(
        tap((equipments) => {
          return this.equipmentsSubject.next(equipments);
        }),
        catchError(this.errorService.handleError),
      );
  }

  addEquipment(equipment: EquipmentInterface) {
    return this.http
      .post<EquipmentInterface>(
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

  updateEquipment(equipment: EquipmentInterface, id: number) {
    return this.http
      .put<EquipmentInterface>(
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
          return this.equipmentsSubject.next(newEquipments);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getEquipments(page?: number, filters?: EquipmentFilterInterface | null) {
    return this.http
      .post<
        PaginateInterface<EquipmentInterface[]>
      >(`${environment.baseUrl}/equipments/filter${page ? `?page=${page}` : ''}`, filters, httpOptions)
      .pipe(
        tap((res) => {
          if (page && page >= 2) {
            this.equipmentsSubject.next([
              ...this.equipmentsSubject.getValue(),
              ...res.data,
            ]);
          } else {
            this.equipmentsSubject.next(res.data);
          }
        }),
        catchError(this.errorService.handleError),
      );
  }

  delete(id: number) {
    return this.http
      .delete<EquipmentInterface>(
        `${environment.baseUrl}/equipments/${id}`,
        httpOptions,
      )
      .pipe(
        tap((equipment) => {
          const newEquipments = this.equipmentsSubject.value.filter(
            (equipment) => equipment.id !== id,
          );
          return this.equipmentsSubject.next(newEquipments);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
