import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { BusinessInfoInterface } from 'shared';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'shared';
import { PictureInterface } from 'shared';
@Injectable({
  providedIn: 'root',
})
export class SettingService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);

  protected settings: BehaviorSubject<BusinessInfoInterface> =
    new BehaviorSubject<BusinessInfoInterface>({} as BusinessInfoInterface);

  constructor() {}

  get businessInfo$() {
    return this.settings.asObservable();
  }

  getBusinessInfo() {
    return this.http
      .get<BusinessInfoInterface>(
        `${environment.baseUrl}/settings/business-info`,
      )
      .pipe(
        tap((data) => {
          return this.settings.next(data);
        }),
        catchError(this.errorService.handleError),
      );
  }

  updateBusinessInfo(businessInfo: BusinessInfoInterface) {
    return this.http
      .put<BusinessInfoInterface>(
        `${environment.baseUrl}/settings/business-info`,
        businessInfo,
      )
      .pipe(
        tap((data) => {
          return this.settings.next(data);
        }),
        catchError(this.errorService.handleError),
      );
  }

  changeBusinessLogo(picture: PictureInterface) {
    const formData = new FormData();

    formData.append(
      'image',
      picture.blob,
      `logo.${picture.blob.type.split('/')[1] ?? 'jpg'}`,
    );
    return this.http
      .post<BusinessInfoInterface>(
        `${environment.baseUrl}/settings/business-info/logo`,
        formData,
      )
      .pipe(
        tap((data) => {
          return this.settings.next({
            ...this.settings.getValue(),
            image: data.image,
          });
        }),
        catchError(this.errorService.handleError),
      );
  }
}
