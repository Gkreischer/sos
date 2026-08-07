import { FormatPhonePipe } from './format-phone.pipe';

describe('FormatPhonePipe', () => {
  it('create an instance', () => {
    const pipe = new FormatPhonePipe();
    expect(pipe).toBeTruthy();
  });

  it('should format a 13-digit phone number correctly', () => {
    const pipe = new FormatPhonePipe();
    const result = pipe.transform('5511999999999');
    expect(result).toBe('+55 (11) 9999-9999');
  });

  it('should return error message for invalid phone number', () => {
    const pipe = new FormatPhonePipe();
    const result = pipe.transform('12345');
    expect(result).toBe('Formato de número de telefone incorreto. Atualize em configurações, no formato 11 ou 10 números, sem caracteres especiais.');
  });

  it('should return default message for empty input', () => {
    const pipe = new FormatPhonePipe();
    const result = pipe.transform('');
    expect(result).toBe('Insira um valor de telefone');
  });

  it('should return default message for null input', () => {
    const pipe = new FormatPhonePipe();
    const result = pipe.transform(null as any);
    expect(result).toBe('Insira um valor de telefone');
  });
});