import { reactive } from '@MyVue/reactivity';
import { reduce } from '@MyVue/shared';

const transform = () => {
  const result1 = reactive();
  const result2 = reduce(2, 1);
  return result1 + result2;
};

export { transform };
