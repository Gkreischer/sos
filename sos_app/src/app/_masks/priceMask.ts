import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import { MaskitoOptions } from '@maskito/core';

export const priceMask: MaskitoOptions = maskitoNumberOptionsGenerator({
  decimalSeparator: ',',
  min: 0,
  thousandSeparator: '.',
  prefix: 'R$ ',
});
