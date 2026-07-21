import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPhone',
  standalone: true,
})
export class FormatPhonePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return 'Insira um valor de telefone';
    }

    const length = value.length;

    if (length === 13) {
      const countryCode = value.slice(0, 2);
      const areaCode = value.slice(2, 4);
      const firstPart = value.slice(4, 8);
      const secondPart = value.slice(8);

      return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
    }

    return 'Formato de número de telefone incorreto. Atualize em configurações, no formato 11 ou 10 números, sem caracteres especiais.';
  }
}
