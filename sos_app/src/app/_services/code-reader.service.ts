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

  async scanCode(): Promise<string | false> {
    try {
      const code = await CapacitorBarcodeScanner.scanBarcode({
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

      return code.ScanResult || false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
