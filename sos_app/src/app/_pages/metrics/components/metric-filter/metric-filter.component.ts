import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaskitoElementPredicate } from '@maskito/core';
import dateMask from 'src/app/_masks/dateMask';
import { MetricsService } from 'src/app/_services/metrics.service';
import { IonHeader } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { MaskitoDirective } from '@maskito/angular';

@Component({
    selector: 'app-metric-filter',
    templateUrl: './metric-filter.component.html',
    styleUrls: ['./metric-filter.component.scss'],
    imports: [
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        MaskitoDirective,
    ],
})
export class MetricFilterComponent implements OnInit {
  metricsService = inject(MetricsService);
  formBuilder = inject(FormBuilder);

  startDate = this.metricsService.startDate$();
  endDate = this.metricsService.endDate$();

  dateMask = dateMask;

  form!: FormGroup;

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  constructor() {}

  ngOnInit() {
    this.mountForm();
  }

  getOrderStatusMetrics() {
    this.metricsService.startDate$.set(this.form.value.startDate);
    this.metricsService.endDate$.set(this.form.value.endDate);
  }

  mountForm() {
    this.form = this.formBuilder.group({
      startDate: [this.metricsService.startDate$()],
      endDate: [this.metricsService.endDate$()],
    });
  }
}
