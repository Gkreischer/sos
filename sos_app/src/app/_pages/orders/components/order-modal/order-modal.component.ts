import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersListComponent } from 'src/app/_pages/users/components/users-list/users-list.component';
import { ModalService } from 'src/app/_services/modal.service';

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss'],
})
export class OrderModalComponent  implements OnInit {

  formOrder!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService
  ) { }

  ngOnInit() {}

    mountForm() {
      this.formOrder = this.formBuilder.group({
        name: [''],
        description: [''],
        client_id: [''],
        equipment_id: [''],
        attendant_id: [''],
      });
    }

    closeModal() {
      this.modalService.closeModal()
    }

    openModalSelectUser() {
      this.modalService.openModal(UsersListComponent);
    }
}
