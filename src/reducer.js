import {combineReducers} from 'redux';
import {
  ADD_COMPONENT,
  SET_COMPONENT,
  UPDATE_COMPONENT,
  REMOVE_COMPONENT,
} from './action';

export default combineReducers({
  components: (state = [], action) => ({
    [ADD_COMPONENT]: (state, {payload}) =>
      [...state, payload],

    [SET_COMPONENT]: (state, {payload}) =>
      [...state.filter((item) => item.id !== payload.id), payload],

    [UPDATE_COMPONENT]: (state, {payload}) =>
      state.map((item) => item.id === payload.id
        ? {...item, props: {...item.props, ...payload.props}}
        : item
      ),

    [REMOVE_COMPONENT]: (state, {payload}) =>
      state.filter((item) => item.id !== payload.id),

  }[action.type] || (() => state))(state, action),
});
