import {Component, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {
  IonCard,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonLabel,
  IonCardContent,
  IonCardHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonImg,
  IonChip,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircle, ticket } from 'ionicons/icons';
import { SettingService } from 'shared';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-welcome',
  imports: [
    IonChip,
    IonImg,
    IonText,
    IonCol,
    IonRow,
    IonGrid,
    IonCardHeader,
    IonCardContent,
    IonLabel,
    IonIcon,
    IonButton,
    IonCard,
    IonCardTitle,
    AsyncPipe,
    RouterLink,
    IonChip,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent implements OnInit {
  settingService = inject(SettingService);

  businessInfo$ = this.settingService.businessInfo$;

  constructor() {
    addIcons({ personCircle, ticket });
  }

  ngOnInit() {
    this.settingService.getBusinessInfo().subscribe();
  }
}
