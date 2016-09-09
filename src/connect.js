import {Component, createElement, PropTypes} from 'react';
import hoistStatics from 'hoist-non-react-statics';
import {connect} from 'react-redux';

import {getComponents} from './selector';
import {remove} from './action';
import {contextShape, componentShape, getDisplayName} from './util';

export default (renderMap) => (WrappedComponent) => {
  class Connect extends Component {
    static propTypes = {
      list: PropTypes.arrayOf(componentShape),
    };

    static contextTypes = {
      relocation: contextShape,
    };

    static defaultProps = {
      list: [],
    };

    render() {
      const mergedProps = {
        ...this.props,
        components: [
          // Prepend components from the context to the list of components
          // collected from the redux store.
          ...this.context.relocation.components || [],

          ...this.props.components
            .map((item) => ({
              // Assign default remove functions.
              remove: () => this.props.remove(item.id),
              ...item,
            })),
        ]
           // Remove components not included in the render function map.
          .filter((item) => renderMap.hasOwnProperty(item.type))

          // Assign render functions.
          .map((item) => ({
            render: renderMap[item.type],
            ...item,
          })),
      };

      return createElement(WrappedComponent, mergedProps);
    }
  }

  Connect.displayName = `Relocation(${getDisplayName(WrappedComponent)})`;

  const mapState = (state, props) => ({
    components: getComponents(state, props),
  });
  const mapDispatch = (dispatch) => ({
    remove: (id) => dispatch(remove(id)),
  });

  return connect(
    mapState,
    mapDispatch
  )(hoistStatics(Connect, WrappedComponent));
};
