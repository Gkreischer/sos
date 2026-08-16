import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IonGrid, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { NgxPrintDirective } from 'ngx-print';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-qrcode-print',
  standalone: true,
  templateUrl: './qrcode-print.component.html',
  styleUrl: './qrcode-print.component.css',
  imports: [QRCodeComponent, NgxPrintDirective],
})
export class QrcodePrintComponent implements OnInit {
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.generateQrCodeData();
  }

  getOrderId() {
    return this.route.snapshot.paramMap.get('id') ?? null;
  }

  generateQrCodeData(): string {
    return `${environment.baseUrl}/ordem-servico`;
  }
}
