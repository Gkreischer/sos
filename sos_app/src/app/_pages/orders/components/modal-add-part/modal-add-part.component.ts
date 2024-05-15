import { Component, OnInit } from '@angular/core';
import { SearchbarCustomEvent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Part } from 'src/app/_models/Part';
import { ModalService } from 'src/app/_services/modal.service';
import { PartService } from 'src/app/_services/part.service';

@Component({
  selector: 'app-modal-add-part',
  templateUrl: './modal-add-part.component.html',
  styleUrls: ['./modal-add-part.component.scss'],
})
export class ModalAddPartComponent  implements OnInit {

  parts!: Observable<Part[]>;

  constructor(
    private modalService: ModalService,
    private partService: PartService
  ) { }

  ngOnInit() {}

  close() {
    this.modalService.closeModal(null, 'cancel');
  }

  search(event: Event) {
    let value = (event as SearchbarCustomEvent).target.value!.toString();

    if(!value) {
      return;
    }

    this.partService.search(value).subscribe(res => {
      this.parts = this.partService.partsSearchedSubject;
      console.log(res);
    });
  }

  addPart(part: Part) {
    console.log('cliquei')
    this.modalService.closeModal(part, 'confirm');
  }

}
