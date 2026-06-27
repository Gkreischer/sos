import { Component, OnInit, inject } from '@angular/core';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { ModalService } from 'src/app/_services/modal.service';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { UserFilterComponent } from './components/user-filter/user-filter.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserService } from 'src/app/_services/user.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  imports: [
    UserFilterComponent,
    UsersListComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonFab,
    IonFabButton,
    IonIcon,
  ],
})
export class UsersPage implements ViewWillEnter, ViewWillLeave {
  modalService = inject(ModalService);
  userService = inject(UserService);
  constructor() {}

  ionViewWillEnter() {
    this.userService.getUsers().subscribe();
  }

  addUser() {
    this.modalService.openModal(UserModalComponent);
  }

  ionViewWillLeave() {
    this.userService.usersSubject.next(null);
  }
}
