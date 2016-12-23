export const getRelocation = (state, props) =>
  (props && props.getRelocationState)
    ? props.getRelocationState(state, props)
    : state.relocation;

export const getComponents = (state, props) => {
  const routeComponents = getRelocation(state, props).routeComponents;
  const components = getRelocation(state, props).components;

  // Concat components and route components uniquely by id.
  return routeComponents
    .filter(({id: routeId}) =>
      !components.filter(({id}) => id === routeId).length
    )
    .concat(components);
};
