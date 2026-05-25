import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { UserTypeInterface } from 'src/app/_interfaces/UserTypeInterface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss'],
  standalone: false,
})
export class UserFilterComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);

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
    this.userService.getUserByDesc(this.filterForm.value).subscribe();
  }

  resetListIfEmpty(event: CustomEvent) {
    if (event.detail.value === '') {
      this.userService.getUsers().subscribe();
    }
  }

  getUserTypes() {
    this.userService.getUserTypes().subscribe();
  }
}
