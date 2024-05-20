import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Part } from 'src/app/_models/Part';
import { ModalService } from 'src/app/_services/modal.service';
import { PartService } from 'src/app/_services/part.service';
import { PartModalComponent } from '../part-modal/part-modal.component';

@Component({
  selector: 'app-parts-list',
  templateUrl: './parts-list.component.html',
  styleUrls: ['./parts-list.component.scss'],
})
export class PartsListComponent  implements OnInit {

  parts!: Observable<Part[]>;

  constructor(
    private partService: PartService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.partService.getParts().subscribe(() => {
      this.parts = this.partService.parts;
    })
  }

  openModalEdit(part: Part) {
    this.modalService.openModal(PartModalComponent, { partId: part.id});
  }

}
