import { Injectable, inject } from '@angular/core';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerAndroidScanningLibrary,
  CapacitorBarcodeScannerCameraDirection,
  CapacitorBarcodeScannerScanOrientation,
  CapacitorBarcodeScannerTypeHint,
} from '@capacitor/barcode-scanner';

@Injectable({
  providedIn: 'root',
})
export class CodeReaderService {
  constructor() {}

  async scanCode() {
    let code = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.ALL,
      scanInstructions: 'Por favor, escaneie o código de barra da OS',
      scanButton: false,
      scanText: 'Escanear',
      cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
      scanOrientation: CapacitorBarcodeScannerScanOrientation.ADAPTIVE,
      android: {
        scanningLibrary: CapacitorBarcodeScannerAndroidScanningLibrary.ZXING,
      },
    });
    if (!code.ScanResult) {
      return false;
    }
    return code.ScanResult;
  }
}
