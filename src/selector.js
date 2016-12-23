import findIndex from 'core-js/library/fn/array/find-index';

export const getRelocation = (state, props) =>
  (props && props.getRelocationState) ?
  props.getRelocationState(state, props) :
  state.relocation;

export const getComponents = (state, props) =>
  getRelocation(state, props).components;

export const getRouteComponents = (state, props) =>
  getRelocation(state, props).routeComponents;

export const getMergedComponents = (state, props) =>
  [...getRouteComponents(state, props), ...getComponents(state, props)].
    reduce((components, component) => {
      const index = findIndex(components, ({id}) => id === component.id);

      if (index === -1) {
        components.push(component);
        return components;
      }

      const existing = components[index];

      components[index] = {
        ...existing,
        ...component,
        ...existing.props && component.props ? {
          props: {
            ...existing.props,
            ...component.props,
          },
        } : null,
      };

      return components;
    }, []);
