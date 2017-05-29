import {Component, createElement, PropTypes} from 'react';
import hoistStatics from 'hoist-non-react-statics';
import {connect} from 'react-redux';

import {getComponents} from './selector';
import {removeComponent, updateComponent} from './action';
import {componentsShape, renderMapShape, getDisplayName} from './util';

const getFinalComponents = (state, props) => {
  const initial = getComponents(state, props);
  const exists = (component) => {
    return typeof props.components[component.type] === 'function';
  };
  const shouldMount = props.componentShouldMount || (() => true);
  return initial.filter(
    (component) => exists(component) && shouldMount(state, props, component)
  );
};

/**
 * Create a higher-order wrapper which provides an array of components to render
 * to its wrapped instance.
 *
 * @param {Object|Function} rawRenderMap An object with component type/render
 * function key value pairs or a function returning such an object.
 * @param {Object} defaultProps An object or a function returing such an
 * object.
 * @returns {Function} Higher-order component wrapper.
 */
export default () => (WrappedComponent) => {
  class Connect extends Component {
    static propTypes = {
      ___relocationDispatch___: PropTypes.shape({
        removeComponent: PropTypes.func.isRequired,
        updateComponent: PropTypes.func.isRequired,
      }),
      ___relocationState___: PropTypes.shape({
        components: renderMapShape.isRequired,
        instances: componentsShape.isRequired,
      }).isRequired,
    };

    render() {
      const {
        ___relocationState___,
        ___relocationDispatch___,
        ...childProps,
      } = this.props;

      const {components, instances} = ___relocationState___;
      const {
        removeComponent,
        updateComponent,
      } = ___relocationDispatch___;

      const assign = (component) => {
        const result = {
          ...component,
          containerProps: childProps,
          render: components[component.type],
          update: (...args) => updateComponent(component.id, ...args),
          remove: (...args) => removeComponent(component.id, ...args),
        };

        return result;
      };

      const currentComponents = instances.map(assign);

      const mergedProps = {
        ...childProps,
        components: currentComponents,
      };

      return <WrappedComponent {...mergedProps}/>;
    }
  }

  Connect.displayName = `Relocation(${getDisplayName(WrappedComponent)})`;

  const mapState = (state, props) => {
    return {
      // Put everything in a ___relocationState___ namespace to avoid possible
      // conflict with existing props.
      ___relocationState___: {
        instances: getFinalComponents(state, props),
        components: props.components,
      },
    };
  };

  const mapDispatch = (dispatch) => ({
      // Put everything in a ___relocationDispatch___ namespace to avoid
      // possible conflict with existing props.
    ___relocationDispatch___: {
      removeComponent: (id) => dispatch(removeComponent(id)),
      updateComponent: (id, props) => dispatch(updateComponent(id, props)),
    },
  });

  return connect(
    mapState,
    mapDispatch,
  )(hoistStatics(Connect, WrappedComponent));
};
