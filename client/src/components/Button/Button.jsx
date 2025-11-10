import React from 'react';
import './Button.css';

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '', ...props }) => {
  const classes = `btn btn-${variant} btn-${size} ${disabled ? 'btn-disabled' : ''} ${className}`;

  return (
    <button className={classes} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
