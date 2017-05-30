import expect from 'unexpected';
import {
  addComponent,
  setComponent,
  updateComponent,
  removeComponent,
  ADD_COMPONENT,
  SET_COMPONENT,
  UPDATE_COMPONENT,
  REMOVE_COMPONENT,
} from '../../src/action';

describe('action', () => {
  it('should generate `addComponent` actions', () => {
    const result = addComponent('foo');
    expect(result, 'to satisfy', {
      type: ADD_COMPONENT,
    });
  });
  it('should generate `setComponent` actions', () => {
    const result = setComponent('foo');
    expect(result, 'to satisfy', {
      type: SET_COMPONENT,
    });
  });
  it('should generate `updateComponent` actions', () => {
    const result = updateComponent('foo');
    expect(result, 'to satisfy', {
      type: UPDATE_COMPONENT,
    });
  });
  it('should generate `removeComponent` actions', () => {
    const result = removeComponent('foo');
    expect(result, 'to satisfy', {
      type: REMOVE_COMPONENT,
    });
  });
});
