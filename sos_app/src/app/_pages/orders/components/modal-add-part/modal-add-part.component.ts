import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import { SearchbarCustomEvent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { PartInterface } from 'shared';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { PartService } from 'src/app/_services/part.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { LoadingService } from 'shared';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
  IonSearchbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonNote,
  IonText,
  IonAvatar,
  IonImg,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { arrowBack, trash } from 'ionicons/icons';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-modal-add-part',
  templateUrl: './modal-add-part.component.html',
  styleUrls: ['./modal-add-part.component.scss'],
  imports: [
    IonImg,
    IonText,
    IonNote,
    IonSpinner,
    IonLabel,
    IonItem,
    IonList,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonSearchbar,
    IonIcon,
    IonContent,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    FormsModule,
    AsyncPipe,
    CurrencyPipe,
    IonAvatar,
  ],
})
export class ModalAddPartComponent {
  modalService = inject(ModalService);
  partService = inject(PartService);
  loadingService = inject(LoadingService);

  parts$: Observable<PartInterface[] | null> = this.partService.partsSearch;
  isLoading$ = this.loadingService.isLoading$;

  constructor() {
    addIcons({ arrowBack, trash });
  }

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
