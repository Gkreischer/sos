import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import JsBarcode from 'jsbarcode';
import { ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NgxPrintDirective } from 'ngx-print';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-barcode-print',
  standalone: true,
  templateUrl: './barcode-print.component.html',
  styleUrl: './barcode-print.component.scss',
  imports: [NgxPrintDirective],
})
export class BarcodePrintComponent implements OnInit {
  route = inject(ActivatedRoute);

  barcodePrintStyle = {
    p: { display: 'flex', justifyContent: 'center' },
  };

  ngOnInit(): void {
    this.generateBarcode();
  }

  generateBarcode() {
    JsBarcode('#barcode', this.getOrderId()!, {
      format: 'CODE128',
      displayValue: true,
      fontSize: 14,
      margin: 1,
      width: 4,
      height: 40,
    });
  }

  getOrderId() {
    return this.route.snapshot.paramMap.get('id') ?? null;
  }
}
