import cuid from 'cuid';

export const ADD_COMPONENT = '@@relocation/ADD_COMPONENT';
export const SET_COMPONENT = '@@relocation/SET_COMPONENT';
export const UPDATE_COMPONENT = '@@relocation/UPDATE_COMPONENT';
export const REMOVE_COMPONENT = '@@relocation/REMOVE_COMPONENT';

export const addComponent = (type, props, meta) => ({
  type: ADD_COMPONENT,
  payload: {id: cuid(), type, props, meta},
});

export const setComponent = (type, id = type, props, meta) => ({
  type: SET_COMPONENT,
  payload: {id, type, props, meta},
});

export const updateComponent = (id, props, meta) => ({
  type: UPDATE_COMPONENT,
  payload: {id, props, meta},
});

export const removeComponent = (id) => ({
  type: REMOVE_COMPONENT,
  payload: {id},
});
