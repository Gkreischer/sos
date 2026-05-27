import { Component, OnInit, inject } from '@angular/core';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  menuController = inject(MenuController);
  constructor() {}

  ngOnInit() {
    this.disableMenu();
  }

  disableMenu() {
    this.menuController.enable(false, 'main');
  }
}
