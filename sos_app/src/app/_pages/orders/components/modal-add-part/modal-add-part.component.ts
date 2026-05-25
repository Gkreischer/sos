import { Component, inject, OnInit } from '@angular/core';
import { SearchbarCustomEvent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { PartInterface } from 'src/app/_interfaces/PartInterface';
import { ModalService } from 'src/app/_services/modal.service';
import { PartService } from 'src/app/_services/part.service';

@Component({
  selector: 'app-modal-add-part',
  templateUrl: './modal-add-part.component.html',
  styleUrls: ['./modal-add-part.component.scss'],
  standalone: false,
})
export class ModalAddPartComponent implements OnInit {
  modalService = inject(ModalService);
  partService = inject(PartService);

  parts!: Observable<PartInterface[]>;

  constructor() {}

  ngOnInit() {}

  close() {
    this.modalService.closeModal(null, 'cancel');
  }

  search(event: Event) {
    let value = (event as SearchbarCustomEvent).target.value!.toString();

    if (!value) {
      return;
    }

    this.partService.search(value).subscribe((res) => {
      this.parts = this.partService.partsSearchedSubject;
    });
  }

  addPart(part: PartInterface) {
    this.modalService.closeModal(part, 'confirm');
  }
}
