import { Component, inject } from '@angular/core';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { PartModalComponent } from './components/part-modal/part-modal.component';
import { PartFilterComponent } from './components/part-filter/part-filter.component';
import { PartsListComponent } from './components/parts-list/parts-list.component';
import { ViewWillEnter } from '@ionic/angular';
import { PartService } from 'src/app/_services/part.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addSharp } from 'ionicons/icons';
@Component({
  selector: 'app-parts',
  templateUrl: './parts.page.html',
  styleUrls: ['./parts.page.scss'],
  imports: [
    IonIcon,
    IonFabButton,
    IonFab,
    IonContent,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    PartFilterComponent,
    PartsListComponent,
    IonMenuButton,
  ],
})
export class PartsPage implements ViewWillEnter {
  modalService = inject(ModalService);
  partService = inject(PartService);

  constructor() {
    addIcons({ addSharp });
  }

  ionViewWillEnter() {
    this.partService.getParts().subscribe();
  }

  addPart() {
    this.modalService.openModal(PartModalComponent);
  }
}
