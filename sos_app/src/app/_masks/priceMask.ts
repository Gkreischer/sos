import { maskitoNumberOptionsGenerator } from '@maskito/kit';

export default maskitoNumberOptionsGenerator({
  decimalSeparator: ',',
  min: 0,
  thousandSeparator: '.',
  prefix: 'R$ ',
});
