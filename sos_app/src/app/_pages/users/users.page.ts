import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { IonicModule } from '@ionic/angular';
import { UserFilterComponent } from './components/user-filter/user-filter.component';
import { UsersListComponent } from './components/users-list/users-list.component';

@Component({
    selector: 'app-users',
    templateUrl: './users.page.html',
    styleUrls: ['./users.page.scss'],
    imports: [IonicModule, UserFilterComponent, UsersListComponent]
})
export class UsersPage implements OnInit {
  constructor(private modalService: ModalService) {}

  ngOnInit() {}

  addUser() {
    this.modalService.openModal(UserModalComponent);
  }
}
