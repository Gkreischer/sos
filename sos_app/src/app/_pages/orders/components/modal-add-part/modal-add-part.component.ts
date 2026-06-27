import { Component, inject, OnInit } from '@angular/core';
import { SearchbarCustomEvent, IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { PartInterface } from 'src/app/_interfaces/PartInterface';
import { ModalService } from 'src/app/_services/modal.service';
import { PartService } from 'src/app/_services/part.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { LoadingService } from 'src/app/_services/loading.service';
@Component({
  selector: 'app-modal-add-part',
  templateUrl: './modal-add-part.component.html',
  styleUrls: ['./modal-add-part.component.scss'],
  imports: [IonicModule, FormsModule, AsyncPipe, CurrencyPipe],
})
export class ModalAddPartComponent implements OnInit {
  modalService = inject(ModalService);
  partService = inject(PartService);
  loadingService = inject(LoadingService);

  parts$: Observable<PartInterface[] | null> = this.partService.partsSearch;
  isLoading$ = this.loadingService.isLoading$;

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

    this.partService.search(value).subscribe();
  }

  addPart(part: PartInterface) {
    this.modalService.closeModal(part, 'confirm');
  }
}
