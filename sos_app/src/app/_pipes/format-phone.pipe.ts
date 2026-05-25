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

    if (value.length === 11) {
      return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').toString();
    }

    if (value.length === 10) {
      return value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3').toString();
    }

    return 'phone: Não ocorreu a conversão';
  }
}
