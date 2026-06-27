import { MaskitoOptions } from '@maskito/core';
import { maskitoPhone } from '@maskito/phone';
import metadata from 'libphonenumber-js/min/metadata';
export const phoneMask: MaskitoOptions = maskitoPhone({
  countryIsoCode: 'BR',
  metadata,
});
