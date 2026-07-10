import { Component, inject } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
import { PartModalComponent } from './components/part-modal/part-modal.component';
import { IonicModule } from '@ionic/angular';
import { PartFilterComponent } from './components/part-filter/part-filter.component';
import { PartsListComponent } from './components/parts-list/parts-list.component';
import { ViewWillEnter } from '@ionic/angular';
import { PartService } from 'src/app/_services/part.service';
@Component({
  selector: 'app-parts',
  templateUrl: './parts.page.html',
  styleUrls: ['./parts.page.scss'],
  imports: [IonicModule, PartFilterComponent, PartsListComponent],
})
export class PartsPage implements ViewWillEnter {
  modalService = inject(ModalService);
  partService = inject(PartService);

  constructor() {}

  ionViewWillEnter() {
    this.partService.getParts().subscribe();
  }

  addPart() {
    this.modalService.openModal(PartModalComponent);
  }
}
