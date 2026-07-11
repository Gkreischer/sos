import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaskitoElementPredicate } from '@maskito/core';
import { dateMask } from 'src/app/_masks/dateMask';
import { MetricsService } from 'src/app/_services/metrics.service';
import { MaskitoDirective } from '@maskito/angular';
import { maskitoTransform } from '@maskito/core';
import { LoadingService } from 'src/app/_services/loading.service';
import { AsyncPipe } from '@angular/common';
import {
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-metric-filter',
  templateUrl: './metric-filter.component.html',
  styleUrls: ['./metric-filter.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaskitoDirective,
    AsyncPipe,
    IonInput,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
  ],
})
export class MetricFilterComponent implements OnInit {
  metricsService = inject(MetricsService);
  formBuilder = inject(FormBuilder);
  loadingService = inject(LoadingService);

  startDate = this.metricsService.startDate$();
  endDate = this.metricsService.endDate$();

  isLoading$ = this.loadingService.isLoading$;

  dateMask = dateMask;

  form!: FormGroup;

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  constructor() {}

  ngOnInit() {
    this.mountForm();
  }

  setDateFilter() {
    this.metricsService.startDate$.set(this.form.value.startDate);
    this.metricsService.endDate$.set(this.form.value.endDate);
  }

  mountForm() {
    this.form = this.formBuilder.group({
      startDate: [
        maskitoTransform(this.metricsService.startDate$(), dateMask),
        [Validators.required],
      ],
      endDate: [
        maskitoTransform(this.metricsService.endDate$(), dateMask),
        [Validators.required],
      ],
    });
  }
}
