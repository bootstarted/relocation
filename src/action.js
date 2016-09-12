import cuid from 'cuid';

export const ADD_COMPONENT = '@@relocation/ADD_COMPONENT';
export const REMOVE_COMPONENT = '@@relocation/REMOVE_COMPONENT';
export const SET_PREVIOUS_PATH = '@@relocation/SET_PREVIOUS_PATH';
export const SET_ROUTE_COMPONENTS = '@@relocation/SET_ROUTE_COMPONENTS';

export const addComponent = ({type, props, id = cuid()}) => ({
  type: ADD_COMPONENT,
  payload: {id, type, props},
});

export const removeComponent = (id) => ({type: REMOVE_COMPONENT, payload: id});

export const setPreviousPath = (path) => ({
  type: SET_PREVIOUS_PATH,
  payload: path,
});

export const setRouteComponents = (components) => ({
  type: SET_ROUTE_COMPONENTS,
  payload: components,
});
