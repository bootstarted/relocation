import * as React from 'react';
import renderer from 'react-test-renderer';

import createRelocation from '../../src/createRelocation';

const Relocation = createRelocation();

class Tester extends React.Component {
  static defaultProps = {
    value: 'Hello',
  };
  state = {enabled: false};
  on() {
    this.setState({enabled: true});
  }
  off() {
    this.setState({enabled: false});
  }
  render() {
    const {enabled} = this.state;
    return (
      <Relocation.Provider collector={this.props.collector}>
        <Relocation.Consumer>
          {(elements) => {
            if (elements[0]) {
              return elements[0].child;
            }
            return null;
          }}
        </Relocation.Consumer>

        {enabled && (
          <Relocation.Component>
            <div>{this.props.value}</div>
          </Relocation.Component>
        )}
      </Relocation.Provider>
    );
  }
}

describe('createRelocation', () => {
  it('should portal elements in and out of the tree', () => {
    const component = renderer.create(<Tester />);
    expect(component.toJSON()).toMatchSnapshot();
    component.root.instance.on();
    expect(component.toJSON()).toMatchSnapshot();
  });
  it('should work with collector', () => {
    const collector = new Relocation.Collector((x) => x[0].child);
    const component = renderer.create(<Tester collector={collector} />);
    component.root.instance.on();
    const component2 = renderer.create(collector.getElements());
    expect(component2.toJSON()).toMatchSnapshot();
  });
  it('should unmount things', () => {
    const component = renderer.create(<Tester />);
    component.root.instance.on();
    component.unmount();
  });
  it('should handle component prop updates', () => {
    const component = renderer.create(<Tester key="5" />);
    component.root.instance.on();
    component.update(<Tester key="5" value="spagoots" />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
