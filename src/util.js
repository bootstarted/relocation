import {PropTypes} from 'react';

export const getDisplayName = (C) => C.displayName || C.name || 'Component';

export const componentShape = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.string,
]);

export const componentsShape = PropTypes.objectOf(componentShape);

export const instanceShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  scope: PropTypes.string,
  props: PropTypes.object,
  remove: PropTypes.func,
  update: PropTypes.func,
  render: componentShape,
});

export const instancesShape = PropTypes.arrayOf(instanceShape);
