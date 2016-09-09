import cuid from 'cuid';

export const ADD = '@@relocation/ADD';
export const REMOVE = '@@relocation/REMOVE';
export const UPDATE = '@@relocation/UPDATE';

export const add = ({type, props, id = cuid()}) => ({
  type: ADD,
  payload: {id, type, props},
});

export const remove = (id) => ({type: REMOVE, payload: id});

export const update = (update) => ({
  type: UPDATE,
  payload: update,
});
