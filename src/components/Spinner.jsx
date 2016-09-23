import React, { PropTypes } from 'react';

const Spinner = ({ children }) => (
  <div>
    <div>{children}</div>
    <span style={{ clear: 'both'}} />
  </div>
);

Spinner.propTypes = {
  children: PropTypes.any.isRequired,
};

export default Spinner;
