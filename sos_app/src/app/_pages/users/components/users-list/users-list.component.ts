import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models/User';
import { ModalService } from 'src/app/_services/modal.service';
import { UserService } from 'src/app/_services/user.service';
import { UserModalComponent } from '../user-modal/user-modal.component';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss'],
})
export class StaffListComponent implements OnInit {
  
  staffUsers!: Observable<User[]>;
  returnClientIdMode: boolean = false;

  constructor(
    private userService: UserService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.getStaffUsers();
  }

  getStaffUsers() {
    this.userService.getStaffUsers().subscribe((users) => {
      this.staffUsers = this.userService.staff;
    });
  }

  closeModal() {
    this.modalService.closeModal();
  }

  returnClient(user: User) {
    this.modalService.closeModal(user, 'confirm')
  }

  openModal(user: User) {
    this.modalService.openModal(UserModalComponent, {user: user});
  }
}
