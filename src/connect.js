import {Component, createElement, PropTypes} from 'react';
import hoistStatics from 'hoist-non-react-statics';
import {connect} from 'react-redux';

import {getMergedComponents, getPreviousPath} from './selector';
import {removeComponent} from './action';
import {componentsShape, renderMapShape, getDisplayName} from './util';

/**
 * Create a higher-order wrapper which provides an array of components to render
 * to its wrapped instance.
 *
 * @param {Object|Function} rawRenderMap An object with component type/render
 * function key value pairs or a function returning such an object.
 * @param {Object|Function} rawConfig An object or a function returing such an
 * object.
 * @returns {Function} Higher-order component wrapper.
 */
export default (rawRenderMap, rawConfig = {}) => (WrappedComponent) => {
  class Connect extends Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      ___relocation___: PropTypes.shape({
        components: componentsShape.isRequired,
        previousPath: PropTypes.string.isRequired,
        config: PropTypes.object.isRequired,
        renderMap: renderMapShape.isRequired,
      }).isRequired,
    };

    static contextTypes = {
      router: PropTypes.object,
    }

    navigateToPath(path, {useHistoryBack = true} = {}) {
      // Check for the react-router context.
      if (!this.context.router) {
        return;
      }

      const {previousPath} = this.props.___relocation___;

      // The `useHistoryBack` option will trigger the use of the `goBack` method
      // instead of `push` in an effort to keep the if the requested path is
      // equal to the previous path.
      //
      // This is useful in scenraios where component that is displayed in
      // response to a route change is considered dismissed or completed on
      // removal.
      if (useHistoryBack && path === previousPath) {
        this.context.router.goBack();
      } else {
        this.context.router.push(path);
      }
    }

    removeComponent(id/* , options */) {
      return this.props.dispatch(removeComponent(id));
    }

    render() {
      const {components, renderMap} = this.props.___relocation___;

      const assignRender = (component) => ({
        ...component,
        render: renderMap[component.type],
      });

      const inRenderMap = (component) =>
        typeof renderMap[component.type] === 'function';

      const assignRemoveHandler = (component) => {
        let removeHandler = null;

        if (typeof component.remove === 'function') {
          // The component object remove property is already a function.
          // We don't want to override this behavior.
          removeHandler = component.remove;
        } else if (component.remove === undefined || component.remove) {
          // The component object does not have a `remove` property, or it has
          // a truthy value that is not a function. Either case indicates that
          // it should use the default remove handler.
          removeHandler = (options) =>
            this.removeComponent(component.id, options);
        }

        let pathRemoveHandler = null;

        if (typeof component.removePath === 'string') {
          // Create a function that will change the history state when removing
          // the component.
          pathRemoveHandler = (options) =>
            this.navigateToPath(component.removePath, options);
        }

        if (pathRemoveHandler && removeHandler) {
          // A remove handler function and a
          return {
            ...component,
            remove: (options) => {
              pathRemoveHandler(options);
              return removeHandler(options);
            },
          };
        }

        if (pathRemoveHandler && !removeHandler) {
          return {
            ...component,
            remove: pathRemoveHandler,
          };
        }

        if (!pathRemoveHandler && removeHandler !== component.remove) {
          return {
            ...component,
            remove: removeHandler,
          };
        }

        // `!pathRemoveHandler && removeHandler === component.remove` is true.
        // This means `remove` was set and `removePath` was not set on the
        // component object. No modification is necessary.
        return component;
      };

      const mergedProps = {
        ...this.props,
        components: components
          // Assign render functions.
          .map(assignRender)
          // Remove components not included in the render function map.
          .filter(inRenderMap)
          // Assign remove handler functions.
          .map(assignRemoveHandler),
      };

      return <WrappedComponent {...mergedProps}/>;
    }
  }

  Connect.displayName = `Relocation(${getDisplayName(WrappedComponent)})`;

  const mapState = (state, props) => {
    const config = typeof rawConfig === 'function' ?
      rawConfig(props) : rawConfig;

    const renderMap = typeof rawRenderMap === 'function' ?
      rawRenderMap(props) : rawRenderMap;

    const {getRelocationState} = config;

    const selectorProps = getRelocationState ?
      {getRelocationState, ...props} : props;

    return {
      // Put everything in a ___relocation___ namespace to avoid possible
      // conflict with existing props.
      ___relocation___: {
        components: getMergedComponents(state, selectorProps),
        previousPath: getPreviousPath(state, selectorProps),
        config,
        renderMap,
      },
    };
  };

  return connect(mapState)(hoistStatics(Connect, WrappedComponent));
};
