import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaskitoElementPredicate } from '@maskito/core';
import dateMask from 'src/app/_masks/dateMask';
import { MetricsService } from 'src/app/_services/metrics.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.page.html',
  styleUrls: ['./metrics.page.scss'],
  standalone: false,
})
export class MetricsPage implements OnInit {
  ngOnInit(): void {}
}
