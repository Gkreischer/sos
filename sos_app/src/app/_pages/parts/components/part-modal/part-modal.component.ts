import { Component, OnInit } from '@angular/core';
import { Part } from 'src/app/_models/Part';
import { ModalService } from 'src/app/_services/modal.service';

@Component({
  selector: 'app-part-modal',
  templateUrl: './part-modal.component.html',
  styleUrls: ['./part-modal.component.scss'],
})
export class PartModalComponent  implements OnInit {

  part!: Part;

  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit() {
    if(this.part) {
      console.log(this.part)
    }
  }

  closeModal() {
    this.modalService.closeModal();
  }

}
