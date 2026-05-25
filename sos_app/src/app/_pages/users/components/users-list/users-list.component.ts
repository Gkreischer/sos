import { Component, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInterface } from 'src/app/_interfaces/UserInterface';
import { ModalService } from 'src/app/_services/modal.service';
import { UserService } from 'src/app/_services/user.service';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { InfiniteScrollCustomEvent, IonInfiniteScroll } from '@ionic/angular';
import { inject } from '@angular/core';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  standalone: false,
})
export class UsersListComponent implements OnInit {
  userService = inject(UserService);
  modalService = inject(ModalService);

  users!: Observable<UserInterface[]>;
  returnClientIdMode: boolean = false;

  numPage = signal(1);
  infiniteScroll = signal(true);

  constructor() {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers(this.numPage()).subscribe((users) => {
      console.log(users);
      this.users = this.userService.users;
      if (users.current_page >= users.last_page || users.last_page === 0) {
        this.infiniteScroll.set(false);
      }
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

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.numPage.set(this.numPage() + 1);

    this.userService.getUsers(this.numPage()).subscribe((users) => {
      this.users = this.userService.users;

      if (users.current_page >= users.last_page) {
        this.infiniteScroll.set(false);
        event.target.disabled = true;
      }

      event.target.complete();
    });
  }
}
