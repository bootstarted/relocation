import {Component, PropTypes, Children} from 'react';

import {componentsShape, contextShape} from './util';

export default class RelocationProvider extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    components: componentsShape.isRequired,
  };

  static childContextTypes = {
    relocation: contextShape.isRequired,
  };

  getChildContext() {
    return {
      relocation: {
        components: this.props.components,
      },
    };
  }

  render() {
    return Children.only(this.props.children);
  }
}
