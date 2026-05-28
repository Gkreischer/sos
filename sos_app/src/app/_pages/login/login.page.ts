import { Component, OnInit, inject } from '@angular/core';
import { MenuController, IonicModule } from '@ionic/angular';
import { FormLoginComponent } from './components/form-login/form-login.component';
@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    imports: [IonicModule, FormLoginComponent],
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
