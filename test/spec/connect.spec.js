import _expect from 'unexpected';
import react from 'unexpected-react/test-renderer';
import TestRenderer from 'react-test-renderer';
import {createElement} from 'react';
import {createStore as baseCreateStore, combineReducers} from 'redux';
import relocation from '../../src/reducer';
import connect from '../../src/connect';
import {setComponent} from '../../src/action';

const expect = _expect.clone().use(react);

const Base = ({components:[{id, props: {foo}}]}) => <div>{id} - {foo}</div>;

const createStore = () => baseCreateStore(combineReducers({relocation}));

describe('connect', () => {
  it('should do the needful', () => {
    const store = createStore();
    const Component = connect()(Base);
    store.dispatch(setComponent('TEST', 'banana', {foo: 5}));
    const result = TestRenderer.create(
      <Component
        components={{
          TEST: ({foo}) => <div>Hi</div>
        }}
        store={store}
      />
    );
    expect(result, 'to have rendered', (
      <div>banana - 5</div>
    ));
  });
});
