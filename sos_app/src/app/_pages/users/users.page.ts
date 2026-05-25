import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
import { UserModalComponent } from './components/user-modal/user-modal.component';

@Component({
    selector: 'app-users',
    templateUrl: './users.page.html',
    styleUrls: ['./users.page.scss'],
    standalone: false
})
export class UsersPage implements OnInit {
  constructor(private modalService: ModalService) {}

  ngOnInit() {}

  addUser() {
    this.modalService.openModal(UserModalComponent);
  }
}
