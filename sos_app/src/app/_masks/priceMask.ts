import { maskitoNumberOptionsGenerator } from '@maskito/kit';

export default maskitoNumberOptionsGenerator({
  decimalSeparator: ',',
  min: 0,
  thousandSeparator: '.',
  precision: 2,
  prefix: 'R$ ',
});
