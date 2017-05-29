import {Component, createElement, PropTypes} from 'react';
import hoistStatics from 'hoist-non-react-statics';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

import {getComponents} from './selector';
import {removeComponent, updateComponent} from './action';
import {componentsShape, renderMapShape, getDisplayName} from './util';

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
export default ({scope, ...defaultProps} = {}) => (WrappedComponent) => {
  class Connect extends Component {
    static propTypes = {
      ___relocationDispatch___: PropTypes.shape({
        removeComponent: PropTypes.func.isRequired,
      }),
      ___relocationState___: PropTypes.shape({
        components: componentsShape.isRequired,
        renderMap: renderMapShape.isRequired,
      }).isRequired,
    };

    static contextTypes = {
      router: PropTypes.object,
    }

    render() {
      const {
        ___relocationState___,
        ___relocationDispatch___,
        ...childProps,
      } = this.props;

      const {enabled, components, renderMap} = ___relocationState___;
      const {
        removeComponent,
        updateComponent,
      } = ___relocationDispatch___;

      const inRenderMap = (component) =>
        typeof renderMap[component.type] === 'function' &&
        (typeof enabled[component.type] === 'undefined' || enabled[component.type]);

      const assign = (component) => {
        const result = {
          ...component,
          sink: {...defaultProps, ...childProps},
          render: renderMap[component.type],
          update: (props) => updateComponent(component.id, props),
          remove: () => removeComponent(component.id),
        };

        if (scope) {
          result.scope = scope;
        }

        return result;
      };

      const currentComponents = components
        // Remove components not included in the render function map.
        .filter(inRenderMap)
        // Assign render update and remove functions and scope if it is defined.
        .map(assign);

      const mergedProps = {
        ...childProps,
        ...scope
          ? {[scope]: {components: currentComponents}}
          : {components: currentComponents},
      };

      return <WrappedComponent {...mergedProps}/>;
    }
  }

  Connect.displayName = `Relocation(${getDisplayName(WrappedComponent)})`;

  const mapState = (state, props) => {
    const _enabled = {};
    for (const key in props.components) {
      if (props.components[key].enabled) {
        _enabled[key] = props.components[key].enabled;
      }
    }
    const enabled = createStructuredSelector(_enabled);
    return (state, props) => {
      const mergedProps = {
        ...defaultProps,
        ...scope ? props[scope] : props,
      };

      const {components, getRelocationState} = mergedProps;

      const selectorProps = getRelocationState
        ? {getRelocationState, ...props}
        : props;

      return {
        // Put everything in a ___relocationState___ namespace to avoid possible
        // conflict with existing props.
        ___relocationState___: {
          components: getComponents(state, selectorProps),
          renderMap: components,
          enabled: enabled(state, mergedProps),
        },
      };
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
