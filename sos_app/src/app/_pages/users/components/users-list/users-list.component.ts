import {Component, signal, WritableSignal, ChangeDetectionStrategy} from '@angular/core';
import { Observable } from 'rxjs';
import { UserInterface } from 'shared';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { UserService } from 'src/app/_services/user.service';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormatPhonePipe } from '../../../../_pipes/format-phone.pipe';
import { effect } from '@angular/core';
import {
  SearchbarChangeEventDetail,
  IonSearchbarCustomEvent,
} from '@ionic/core';
import { LoadingService } from 'shared';
import {
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonNote,
  IonText,
} from '@ionic/angular/standalone';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  imports: [
    IonText,
    IonNote,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonSpinner,
    IonLabel,
    IonItem,
    IonList,
    IonSearchbar,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    AsyncPipe,
    FormatPhonePipe,
  ],
})
export class UsersListComponent {
  userService = inject(UserService);
  modalService = inject(ModalService);
  loadingService = inject(LoadingService);
  users?: Observable<UserInterface[] | null> = this.userService.users;
  returnClientIdMode: boolean = false;

  numPage = 1;
  infiniteScroll: WritableSignal<boolean> = signal(false);
  isLoading$ = this.loadingService.isLoading$;

  constructor() {
    this.userService.setUserFilter({
      description: '',
    });
    effect(() => {
      this.numPage = 1;
      this.infiniteScroll.set(true);
      this.userService.userFilter();
      this.getUsers().subscribe((res) => {
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
      });
    });
  }

  searchUser(event: IonSearchbarCustomEvent<SearchbarChangeEventDetail>) {
    const value = event.detail.value;

    if (!value) {
      return;
    }

    this.userService.setUserFilter({
      description: value,
    });
  }

  getUsers() {
    return this.userService.getUsers(
      this.numPage,
      this.userService.userFilter(),
    );
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.numPage++;

    this.getUsers().subscribe({
      next: (res) => {
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
      },
      complete: () => {
        event.target.complete();
      },
    });
  }

  closeModal() {
    this.modalService.closeModal();
  }

  returnClient(user: UserInterface) {
    this.modalService.closeModal(user, 'confirm');
  }

  openModal(user: UserInterface) {
    this.modalService.openModal(UserModalComponent, { user: user });
  }
}
