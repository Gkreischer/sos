import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { UserTypeInterface } from 'src/app/_interfaces/UserTypeInterface';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from 'src/app/_services/loading.service';
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
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss'],
  imports: [
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
  constructor() {}

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
