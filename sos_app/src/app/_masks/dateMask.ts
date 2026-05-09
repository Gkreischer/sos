import { MaskitoOptions } from '@maskito/core';
import { maskitoDateTimeOptionsGenerator } from '@maskito/kit';

export const dateMask: MaskitoOptions = maskitoDateTimeOptionsGenerator({
  dateMode: 'dd/mm/yyyy',
  timeMode: 'HH:MM',
  dateSeparator: '/',
  dateTimeSeparator: ':',
});
