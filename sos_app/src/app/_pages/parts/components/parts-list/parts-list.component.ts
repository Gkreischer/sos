import { Component, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PartInterface } from 'src/app/_interfaces/PartInterface';
import { ModalService } from 'src/app/_services/modal.service';
import { PartService } from 'src/app/_services/part.service';
import { PartModalComponent } from '../part-modal/part-modal.component';
import {
  InfiniteScrollCustomEvent,
  IonInfiniteScrollCustomEvent,
} from '@ionic/core';
import { PartFilterInterface } from 'src/app/_interfaces/PartFilterInterface';
import { effect, inject } from '@angular/core';

@Component({
  selector: 'app-parts-list',
  templateUrl: './parts-list.component.html',
  styleUrls: ['./parts-list.component.scss'],
  standalone: false,
})
export class PartsListComponent implements OnInit {
  partService = inject(PartService);
  modalService = inject(ModalService);

  parts!: Observable<PartInterface[]>;
  partsPage: number = 1;
  infiniteScroll = signal(true);
  partFilters = this.partService.partFilters;

  constructor() {
    effect(() => {
      this.partsPage = 1;
      this.infiniteScroll.set(true);
      this.partService.partFilters();
      this.getParts().subscribe((res) => {
        this.parts = this.partService.parts;

        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
      });
    });
  }

  getParts() {
    return this.partService.getParts(this.partsPage, this.partFilters());
  }

  ngOnInit() {}

  getAll() {
    this.partService.getParts().subscribe(() => {
      this.parts = this.partService.parts;
    });
  }

  openModalEdit(part: PartInterface) {
    this.modalService.openModal(PartModalComponent, { partId: part.id });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.partsPage++;

    this.getParts().subscribe({
      next: (res) => {
        this.parts = this.partService.parts;

        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
      },
      complete: () => {
        event.target.complete();
      },
    });
  }
}
