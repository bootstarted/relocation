import {combineReducers} from 'redux';
import {
  REMOVE_COMPONENT,
  ADD_COMPONENT,
  SET_PREVIOUS_PATH,
  SET_ROUTE_COMPONENTS,
} from './action';

const createReducer = (type, initial) =>
  (state = initial, action) => action.type === type ? action.payload : state;

export default combineReducers({
  components: (state = [], action) => ({
    [ADD_COMPONENT]: (state, {payload}) => [...state, payload],
    [REMOVE_COMPONENT]: (state, {payload}) =>
      state.filter((item) => item.id !== payload),
  }[action.type] || (() => state))(state, action),
  routeComponents: createReducer(SET_ROUTE_COMPONENTS, []),
  previousPath: createReducer(SET_PREVIOUS_PATH, ''),
});
