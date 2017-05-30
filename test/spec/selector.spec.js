import expect from 'unexpected';
import {getRelocation, getComponents} from '../../src/selector';

const state = {
  relocation: {
    components: 'foo',
  },
  baz: 'bar',
};

describe('selector', () => {
  describe('getRelocation', () => {
    it('should work with default state atom', () => {
      const result = getRelocation(state);
      expect(result, 'to satisfy', {components: 'foo'});
    });
    it('should work with custom selector', () => {
      const result = getRelocation(state, {getRelocationState: (x) => x.baz});
      expect(result, 'to equal', 'bar');
    });
  });
  describe('getComponents', () => {
    it('should work', () => {
      const result = getComponents(state);
      expect(result, 'to equal', 'foo');
    });
  });
});
