import expect from 'unexpected';
import {
  addComponent,
  setComponent,
  updateComponent,
  removeComponent,
} from '../../src/action';
import reduce from '../../src/reducer';

describe('reducer', () => {
  it('should handle `ADD_COMPONENT`', () => {
    const props = {foo: 'bar'};
    const result = reduce({}, addComponent('MY_TYPE', props));
    expect(result, 'to satisfy', {
      components: [{props}],
    });
  });
  it('should handle `SET_COMPONENT`', () => {
    const props = {foo: 'bar'};
    const result = reduce({}, setComponent('MY_TYPE', 'id', props));
    expect(result, 'to satisfy', {
      components: [{id: 'id', props}],
    });
  });
  it('should handle `UPDATE_COMPONENT`', () => {
    const state = {components: [{id: 'id'}]};
    const props = {foo: 'bar'};
    const result = reduce({}, setComponent('MY_TYPE', 'id', props));
    expect(result, 'to satisfy', {
      components: [{id: 'id', props}],
    });
  });
  it('should handle `REMOVE_COMPONENT`', () => {
    const state = {components: [{id: 'id'}]};
    const result = reduce(state, removeComponent('id'));
    expect(result, 'to exhaustively satisfy', {
      components: []
    });
  });
});
