import { Component, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonText,
  IonCardTitle,
  IonCol,
  IonRow,
  IonGrid,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendar, time } from 'ionicons/icons';
@Component({
  selector: 'app-clock',
  imports: [
    IonLabel,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonCardTitle,
    IonText,
    IonCardContent,
    IonCardHeader,
    IonCard,
  ],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.css',
})
export class ClockComponent implements OnInit {
  time = this.getTime();
  date = this.getDate();

  constructor() {
    addIcons({ calendar, time });
  }

  ngOnInit() {
    setInterval(() => {
      this.time = this.getTime();
      this.date = this.getDate();
    }, 1000);
  }
  getTime() {
    return new Date().toLocaleTimeString();
  }

  getDate() {
    return new Date().toLocaleDateString();
  }
}
