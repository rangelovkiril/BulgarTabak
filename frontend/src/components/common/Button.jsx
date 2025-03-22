import React from 'react';
import '../../styles/common.css'; // Corrected import path

const Button = ({ onClick, children, type = 'button', className = '' }) => {
    return (
        <button onClick={onClick} type={type} className={`custom-button ${className}`}>
            {children}
        </button>
    );
};

export default Button;