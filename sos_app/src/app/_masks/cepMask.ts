import { MaskitoOptions } from '@maskito/core';

export const cepMask: MaskitoOptions = {
  mask: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
};
