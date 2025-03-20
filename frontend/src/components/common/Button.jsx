import React from 'react';
import './common.css';

const Button = ({ onClick, children, type = 'button', className = '' }) => {
    return (
        <button onClick={onClick} type={type} className={`custom-button ${className}`}>
            {children}
        </button>
    );
};

export default Button;