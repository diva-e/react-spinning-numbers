import React, { PropTypes } from 'react';

const Divider = ({ character }) => (
  <div style={{ float: 'left' }}>{character}</div>
);

Divider.propTypes = {
  character: PropTypes.string,
};

export default Divider;
