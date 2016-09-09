import {Component, createElement, PropTypes} from 'react';
import {formatPattern, routerShape} from 'react-router';
import hoistStatics from 'hoist-non-react-statics';

import RelocationProvider from './provider';

const getDisplayName = (C) => C.displayName || C.name || 'Component';

export const createRouterComponent = (WrappedComponent) => {
  class Connect extends Component {
    static propTypes = {
      routes: PropTypes.array.isRequired,
      params: PropTypes.object.isRequired,
    };

    static contextTypes = {
      router: routerShape,
    };

    constructor(state, props) {
      super(state, props);
      this.state = {previousLocation: {}};
    }

    componentWillReceiveProps() {
      this.setState({previousLocation: this.props.location});
    }

    render() {
      const {routes, params} = this.props;
      const {router} = this.context;

      // Create a function that will remove the component by navigating to a
      // different path. Call `router.replace` with `item.hide` if it is
      // defined, otherwise call router.replace with the formatted path of the
      // parent route.

      const createRemove = (i) => {
        let path = routes[i].relocation.remove;

        if (!path) {
          let parentPath;

          for (let current = i - 1; !parentPath && i >= 0; current--) {
            const parent = routes[current];
            parentPath = parent && parent.path;
          }

          if (parentPath) {
            path = formatPattern(parentPath, params);
          }
        }

        if (!path) {
          return null;
        }

        return () => {
          if (path === this.state.previousLocation.pathname) {
            router.goBack();
          } else {
            router.push(path);
          }
        };
      };

      const components = routes.reduce((components, route, i) => {
        const {relocation, path} = route;

        if (relocation) {
          components.push({
            // Use the formatted path that matched as the default id.
            id: formatPattern(path, params),

            // Merge component props with redux-router props.
            props: {...this.props, ...relocation.props},

            // If `route.relocation` is a string, assign it the type. Otherwise
            // merge its values.
            ...typeof relocation === 'string' ? {type: relocation} : relocation,

            // Assign a remove function. Use `route.relocation.remove`
            // if it's a function.
            remove: typeof relocation.remove === 'function' ?
              relocation.remove :
              createRemove(i),
          });
        }

        return components;
      }, []);

      return createElement(WrappedComponent, {components, ...this.props});
    }
  }

  Connect.displayName = `RelocationRouter(${getDisplayName(WrappedComponent)})`;

  return hoistStatics(Connect, WrappedComponent);
};

export default createRouterComponent(RelocationProvider);
