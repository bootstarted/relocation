# relocation

Complex portal behaviour for `react^16.3`.

![build status](http://img.shields.io/travis/metalabdesign/relocation/master.svg?style=flat)
![coverage](https://img.shields.io/codecov/c/github/metalabdesign/relocation/master.svg?style=flat)
![license](http://img.shields.io/npm/l/relocation.svg?style=flat)
![version](http://img.shields.io/npm/v/relocation.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/relocation.svg?style=flat)

## Examples

### Modal Dialogs

```jsx
import createRelocation from 'relocation';

const ModalRelocation = createRelocation();

const ModalRoot = () => (
  <div style={{position: 'fixed'}}>
    <ModalRelocation.Consumer>
      {(modals) => modals[0] && modals[0].child}
    </ModalRelocation.Consumer>
  </div>
);

const Modal = ({children}) => (
  <ModalRelocation.Component>
    <div style={{width: 500, background: '#fff'}}>
      Modal!
      {children}
    </div>
  </ModalRelocation.Component>
);

const App = (
  <ModalRelocation.Provider>
    <div>
      <ModalRoot/>
      <Modal>Modal A</Modal>
      <Modal>Modal B</Modal>
    </div>
  </ModalRelocation.Provider>
);
```

### Tooltips


```jsx
import createRelocation from 'relocation';

const TooltipRelocation = createRelocation();

const TooltipDisplay = ({id}) => (
  <TooltipRelocation.Consumer>
    {(tooltips) => {
      const result = tooltips.find(({meta}) => meta.id === id);
      if (result) {
        return result.child;
      }
      return null;
    }}
  </TooltipRelocation.Consumer>
);

class TooltipTarget {
  id = cuid();
  state = {element: null}
  open = (element = this.props.tooltip) => {
    this.setState({element});
  }
  close = () => {
    this.setState({element: null});
  }
  toggle = (element = this.props.tooltip) => {
    this.setState((state) => state.element ? null : element)
  }
  render() {
    const {element} = this.state;
    return (
      <React.Fragment>
        <TooltipDisplay id={this.id}/>
        {children({open, close, toggle})}
        {element && (
          <TooltipRelocation.Component meta={{id}}>
            {element}
          </TooltipRelocation.Component>
        )}
      </React.Fragment>
    )
  }
}


const App = (
  <TooltipRelocation.Provider>
    <div>
      <TooltipTarget tooltip={<div>My tooltip</div>}>
        {(toggle) => (
          <button onClick={() => toggle()}>Click me!</button>
        )}
      </TooltipTarget>
    </div>
  </TooltipRelocation.Provider>
);
```

### Managing `head` Element

```jsx
import createRelocation from 'relocation';

const HeadRelocation = createRelocation();

const head =
  typeof document !== 'undefined'
    ? document.getElementsByTagName('head')[0]
    : null;

class HeadPortal extends React.Component<*> {
  componentDidMount() {
    if (head) {
      // Strip out server-side components
      head.querySelectorAll('[data-rh=true]').forEach((e) => {
        e.remove();
      });
    }
  }
  render() {
    return head ? (
      <HeadRelocation.Consumer>
        {(children) => ReactDOM.createPortal(mapChildren(children), head)}
      </HeadRelocation.Consumer>
    ) : null;
  }
}

const Head = ({render}) => (
  <HeadRelocation.Component>
    {render({'data-rh': 'true'})}
  </HeadRelocation.Component>
);

const Title = ({children}) => (
  <Head>
    {(props)} => (
      <title {...props}>{children}</title>
    )}
  </Head>
);

const App = ({head}) => (
  <HeadRelocation.Provider collector={head}>
    <HeadPortal/>
    <Title>My Page</Title>
  </HeadRelocation.Provider>
);
```

And on the server:

```jsx
const render = () => {
  const headCollector = new HeadRelocation.Collector();

  const markup = React.renderToString(<App head={headCollector}/>);
  return React.renderToStaticMarkup((
    <html>
      <head>
        {head.getElements()}
      </head>
      <body>
        {markup}
      </body>
    </html>
  ));
};
```
