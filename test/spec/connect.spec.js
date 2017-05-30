import _expect from 'unexpected';
import react from 'unexpected-react/test-renderer';
import {create as render} from 'react-test-renderer';
import {createElement} from 'react';
import {createStore as baseCreateStore, combineReducers} from 'redux';
import relocation from '../../src/reducer';
import connect from '../../src/connect';
import {setComponent} from '../../src/action';

const expect = _expect.clone().use(react);

const Base = ({components:[{id, props: {foo}}]}) => <div>{id} - {foo}</div>;

const createStore = () => baseCreateStore(combineReducers({relocation}));

describe('connect', () => {
  it('should render a single component', () => {
    const store = createStore();
    const Component = connect()(Base);
    store.dispatch(setComponent('TEST', 'banana', {foo: 5}));
    const result = render(
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
