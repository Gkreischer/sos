import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/User';
import { ModalService } from 'src/app/_services/modal.service';
@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent implements OnInit {
  user!: User;

  constructor(private modalService: ModalService) {
    if (this.user) {
      console.log(this.user);
    }
  }

  ngOnInit() {}

  closeModal() {
    this.modalService.closeModal();
  }
}
