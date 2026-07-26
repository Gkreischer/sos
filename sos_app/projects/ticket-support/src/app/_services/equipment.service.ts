import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from 'shared';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { EquipmentFilterInterface } from 'shared';
import { PaginateInterface } from 'shared';
import { inject } from '@angular/core';
import { EquipmentInterface } from 'shared';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);

  equipmentsSubject = new BehaviorSubject<EquipmentInterface[]>([]);
  equipmentSubject = new BehaviorSubject<EquipmentInterface | null>(null);

  public equipmentFilter = signal(null as EquipmentFilterInterface | null);

  constructor() {}

  get equipments() {
    return this.equipmentsSubject.asObservable();
  }

  get equipment() {
    return this.equipmentSubject.asObservable();
  }

  public setEquipmentFilter(equipmentFilter: EquipmentFilterInterface | null) {
    this.equipmentFilter.set(equipmentFilter);
  }

  getById(id: number) {
    return this.http
      .get<EquipmentInterface>(
        `${environment.baseUrl}/customer/equipments/${id}`,
      )
      .pipe(
        tap((res) => {
          return this.equipmentSubject.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  create(equipment: EquipmentInterface) {
    const formData = new FormData();

    Object.entries(equipment).forEach(([key, value]) => {
      if (key === 'user') {
        return;
      }

      formData.append(key, String(value ?? ''));
    });

    return this.http
      .post<EquipmentInterface>(`${environment.baseUrl}/equipments`, formData)
      .pipe(
        tap((res) => {
          const equipments = this.equipmentsSubject.getValue();

          this.equipmentsSubject.next([res, ...equipments]);
          this.equipmentSubject.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getCustomerEquipments(
    page?: number,
    filters?: EquipmentFilterInterface | null,
  ) {
    return this.http
      .post<
        PaginateInterface<EquipmentInterface[]>
      >(`${environment.baseUrl}/customer/equipments/filter${page ? `?page=${page}` : ''}`, filters)
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
}
