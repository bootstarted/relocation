export const getRelocation = (state, props) =>
  (props && props.getRelocationState)
    ? props.getRelocationState(state, props)
    : state.relocation;

export const getComponents = (state, props) =>
  getRelocation(state, props).components;
