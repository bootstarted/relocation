import cuid from 'cuid';

export const ADD_COMPONENT = '@@relocation/ADD_COMPONENT';
export const SET_COMPONENT = '@@relocation/SET_COMPONENT';
export const UPDATE_COMPONENT = '@@relocation/UPDATE_COMPONENT';
export const REMOVE_COMPONENT = '@@relocation/REMOVE_COMPONENT';

export const addComponent = (type, props) => ({
  type: ADD_COMPONENT,
  payload: {id: cuid(), type, props},
});

export const setComponent = (type, id = type, props) => ({
  type: SET_COMPONENT,
  payload: {id, type, props},
});

export const updateComponent = (id, props) => ({
  type: UPDATE_COMPONENT,
  payload: {id, props},
});

export const removeComponent = (id) => ({
  type: REMOVE_COMPONENT,
  payload: {id},
});
