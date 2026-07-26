import { MaskitoOptions } from '@maskito/core';
import { maskitoDateOptionsGenerator } from '@maskito/kit';

export const dateMask: MaskitoOptions = maskitoDateOptionsGenerator({
  mode: 'dd/mm/yyyy',
  separator: '/',
});
