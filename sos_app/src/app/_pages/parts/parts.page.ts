import { Component, inject, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
import { PartModalComponent } from './components/part-modal/part-modal.component';

@Component({
  selector: 'app-parts',
  templateUrl: './parts.page.html',
  styleUrls: ['./parts.page.scss'],
  standalone: false,
})
export class PartsPage implements OnInit {
  modalService = inject(ModalService);

  constructor() {}

  ngOnInit() {}

  addPart() {
    this.modalService.openModal(PartModalComponent);
  }
}
