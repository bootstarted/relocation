import {combineReducers} from 'redux';
import {REMOVE, ADD, UPDATE} from './action';

export default combineReducers({
  components: (state = [], action) => ({
    [ADD]: (state, {payload}) => state
      .filter((item) => item.id !== payload)
      .concat([payload]),
    [REMOVE]: (state, {payload}) => state
      .filter((item) => item.id !== payload),
    [UPDATE]: (state, {payload}) => state
      .map((item) => item.id === payload.id ? {...item, ...payload} : item),
  }[action.type] || (() => state))(state, action),
});
