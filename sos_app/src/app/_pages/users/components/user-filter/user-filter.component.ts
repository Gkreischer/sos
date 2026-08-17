import {Component, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { UserTypeInterface } from 'shared';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from 'shared';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonSelectOption,
  IonInput,
  IonSelect,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss'],
  imports: [
    IonIcon,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    IonSelectOption,
    IonInput,
    IonSelect,
  ],
})
export class UserFilterComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  loadingService = inject(LoadingService);
  isLoading$ = this.loadingService.isLoading$;
  filterForm!: FormGroup;

  userTypes$: Observable<UserTypeInterface[]> = this.userService.userTypes;
  constructor() {
    addIcons({ search });
  }

  ngOnInit() {
    this.mountForm();
    this.getUserTypes();
  }

  mountForm() {
    this.filterForm = this.formBuilder.group({
      description: [''],
      type_id: [''],
    });
  }

  searchUser() {
    this.userService.setUserFilter(this.filterForm.value);
  }

  getUserTypes() {
    this.userService.getUserTypes().subscribe();
  }
}
