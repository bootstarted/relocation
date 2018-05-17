// @flow
import * as React from 'react';
import cuid from 'cuid';

type Item = {id: string, child: React.Node, meta: *};
type Elements = {[string]: {children: React.Node, meta: *}};
type ItemMapper = ($ReadOnlyArray<Item>) => React.Node;

const flattenElements = (elements: Elements): $ReadOnlyArray<Item> => {
  const results = [];
  Object.keys(elements).forEach((id) => {
    const {children, meta} = elements[id];
    React.Children.forEach(children, (child) => {
      results.push({child, meta, id});
    });
  });
  return results;
};

class RelocationDelegate extends React.PureComponent<{
  children: React.Node,
  removeChild: *,
  addChild: *,
  meta?: *,
}> {
  id = cuid();

  componentWillUnmount() {
    this.props.removeChild(this.id);
  }

  componentDidUpdate() {
    this.props.addChild(this.id, this.props.children, this.props.meta);
  }

  componentDidMount() {
    this.props.addChild(this.id, this.props.children, this.props.meta);
  }

  render() {
    return null;
  }
}

const createRelocation = () => {
  const RelocationInjector = React.createContext({
    addChild: () => {},
    removeChild: () => {},
  });

  const RelocationChildren = React.createContext({});

  class Collector {
    elements: Elements = {};
    mapItems: ItemMapper;
    constructor(mapItems: ItemMapper) {
      this.mapItems = mapItems;
    }
    onAdd(id: string, children: React.Node, meta: *) {
      this.elements = {
        ...this.elements,
        [id]: {children, meta},
      };
    }
    getElements() {
      return this.mapItems(flattenElements(this.elements));
    }
  }

  class Provider extends React.Component<
    {
      children: React.Node,
      collector?: Collector,
    },
    {
      elements: Elements,
    },
  > {
    state = {
      elements: {},
    };
    elements = {};

    addChild = (id: string, children: *, meta: *) => {
      this.elements = {
        ...this.elements,
        [id]: {children, meta},
      };
      this.setState({elements: this.elements});
      if (this.props.collector) {
        this.props.collector.onAdd(id, children, meta);
      }
    };

    removeChild = (id: string) => {
      if (id in this.elements) {
        const elements = {...this.elements};
        delete elements[id];
        this.elements = elements;
        this.setState({elements: this.elements});
      }
    };

    headInjectorContext = {
      addChild: this.addChild,
      removeChild: this.removeChild,
    };

    render() {
      return (
        <RelocationInjector.Provider value={this.headInjectorContext}>
          <RelocationChildren.Provider value={this.state.elements}>
            {this.props.children}
          </RelocationChildren.Provider>
        </RelocationInjector.Provider>
      );
    }
  }

  const Component = ({children, meta}: {children: React.Node, meta?: *}) => (
    <RelocationInjector.Consumer>
      {(context) => (
        <RelocationDelegate
          meta={meta}
          children={children}
          addChild={context.addChild}
          removeChild={context.removeChild}
        />
      )}
    </RelocationInjector.Consumer>
  );

  const Consumer = ({children}: {children: ItemMapper}) => (
    <RelocationChildren.Consumer>
      {(context) => children(flattenElements(context))}
    </RelocationChildren.Consumer>
  );

  return {Consumer, Collector, Provider, Component};
};

export default createRelocation;
