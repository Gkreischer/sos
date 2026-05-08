import { MaskitoOptions } from '@maskito/core';

export const phoneMask: MaskitoOptions = {
  mask: ({ value }) => {
    const inputValue = value?.replace(/\D/g, '');

    if (inputValue.length <= 10) {
      return [
        '(',
        /\d/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ];
    } else {
      return [
        '(',
        /\d/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ];
    }
  },
} as MaskitoOptions;
