import { Component, OnInit, signal, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInterface } from 'src/app/_interfaces/UserInterface';
import { ModalService } from 'src/app/_services/modal.service';
import { UserService } from 'src/app/_services/user.service';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormatPhonePipe } from '../../../../_pipes/format-phone.pipe';
import { effect } from '@angular/core';
import {
  SearchbarChangeEventDetail,
  IonSearchbarCustomEvent,
} from '@ionic/core';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  imports: [IonicModule, AsyncPipe, FormatPhonePipe],
})
export class UsersListComponent implements OnInit {
  userService = inject(UserService);
  modalService = inject(ModalService);
  loadingService = inject(LoadingService);
  users?: Observable<UserInterface[]> = this.userService.users;
  returnClientIdMode: boolean = false;

  numPage = 1;
  infiniteScroll = signal(true);
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
    console.log(this.userService.userFilter());
  }

  getUsers() {
    return this.userService.getUsers(
      this.numPage,
      this.userService.userFilter(),
    );
  }

  ngOnInit() {}

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
