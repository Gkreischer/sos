import { MaskitoOptions } from '@maskito/core';
import { maskitoDateOptionsGenerator } from '@maskito/kit';

export const dateMask: MaskitoOptions = maskitoDateOptionsGenerator({
  mode: 'dd/mm/yyyy',
  separator: '/',
  min: new Date(2000, 0, 1),
  max: new Date(),
});
