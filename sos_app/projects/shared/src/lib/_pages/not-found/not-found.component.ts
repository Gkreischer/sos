import { Component } from '@angular/core';
import {
  IonCol,
  IonGrid,
  IonNote,
  IonRow,
  IonCard,
  IonCardContent,
  IonContent,
} from '@ionic/angular/standalone';
@Component({
  selector: 'lib-not-found',
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonNote,
    IonCard,
    IonCardContent,
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {}
