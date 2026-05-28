import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingService } from 'src/app/_services/setting.service';
import { IonicModule } from '@ionic/angular';
import { MenuOptionComponent } from './components/menu-option/menu-option.component';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
    imports: [IonicModule, MenuOptionComponent]
})
export class SettingsPage implements OnInit {
  settingService = inject(SettingService);

  form!: FormGroup;
  formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {}

  ngOnInit() {
    this.mountForm();
  }

  mountForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      cnpj: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      address_number: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      image: [''],
    });
  }
}
