import {Component, PropTypes, Children} from 'react';
import {connect} from 'react-redux';
import invariant from 'fbjs/lib/invariant';

import {setRouteComponents, setPreviousPath} from './action';

/**
 * [description]
 * @param {Function} formatPattern - The React Router `formatPattern` function.
 * @returns {[type]}              [description]
 */
export default (formatPattern) => {
  invariant(
    typeof formatPattern === 'function',
   'The `formatPattern` function from `react-redux` must be provided. ' +
   'Add `import {formatPattern} from "react-router"` and add it as the ' +
   'argument to your call to `createRelocationRouter`.'
  );

  const finalFormatPattern = typeof formatPattern === 'function' ?
    formatPattern : (path) => path;

  class RelocationRouter extends Component {
    static propTypes = {
      routes: PropTypes.array.isRequired,
      params: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      children: PropTypes.element.isRequired,
      dispatch: PropTypes.func.isRequired,
    };

    // Use `componentWillMount` over `constructor` when calling `dispatch`.
    // see: https://github.com/reactjs/react-redux/issues/129
    componentWillMount() {
      this.updateRouteComponents(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this.updatePreviousPath(nextProps);
      this.updateRouteComponents(nextProps);
    }

    updateRouteComponents(props) {
      const {routes, params} = props;
      const {dispatch} = this.props;

      if (this.routes === params && this.prams === params) {
        return;
      }

      this.routes = routes;
      this.params = params;

      const join = (base, path) => {
        return base + (path && !/\/$/.test(base) ? '/' : '') + path;
      };

      const getFormattedPathName = (i) => {
        let path = '';

        for (let current = i; current >= 0; current--) {
          const route = routes[current];

          if (route && route.path) {
            path = join(route.path, path);
            if (/^\//.test(path)) {
              return finalFormatPattern(path, params);
            }
          }
        }

        return null;
      };

      const components = routes.reduce((components, route, i) => {
        const {relocation} = route;

        if (relocation) {
          components.push({
            // Use the formatted path that matched as the default id.
            id: getFormattedPathName(i),

            // Merge component props with redux-router props.
            props: {
              ...this.props,
              location: props.location,
              params: props.params,
            },

            // If `route.relocation` is a string, assign it the type. Otherwise
            // merge its values.
            ...typeof relocation === 'string' ? {type: relocation} : relocation,

            removePath: relocation.removePath !== undefined ?
              relocation.removePath :
              getFormattedPathName(i - 1),
          });
        }

        return components;
      }, []);

      dispatch(setRouteComponents(components));
    }

    updatePreviousPath(nextProps) {
      const {location: {pathname: previousPath}, dispatch} = this.props;
      const {location: {pathname: currentPath}} = nextProps;

      if (previousPath && previousPath !== currentPath) {
        dispatch(setPreviousPath(previousPath));
      }
    }

    render() {
      const {children} = this.props;

      return Children.only(children);
    }
  }

  return connect()(RelocationRouter);
};
