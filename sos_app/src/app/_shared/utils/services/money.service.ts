import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MoneyService {
  parse(value: any): number {
    if (!value) return 0;

    if (typeof value === 'number') return value;

    value = value.toString().replace(/[^\d,.-]/g, '');

    if (value.includes(',')) {
      value = value.replace(/\./g, '').replace(',', '.');
    }

    const parsed = parseFloat(value);

    return isNaN(parsed) ? 0 : parsed;
  }
}
