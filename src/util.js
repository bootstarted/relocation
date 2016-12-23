import {PropTypes} from 'react';

export const getDisplayName = (C) => C.displayName || C.name || 'Component';

export const renderShape = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.string,
]);

export const renderMapShape = PropTypes.objectOf(renderShape);

export const componentShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  scope: PropTypes.string,
  props: PropTypes.object,
  remove: PropTypes.func,
  removePath: PropTypes.string,
  render: renderShape,
});

export const componentsShape = PropTypes.arrayOf(componentShape);
