import React from 'react';

const GoogleSignIn = () => {
    const handleGoogleSignIn = () => {
        // Logic for Google Sign-In goes here
        console.log("Google Sign-In initiated");
    };

    return (
        <button onClick={handleGoogleSignIn} className="google-signin-button">
            Sign in with Google
        </button>
    );
};

export default GoogleSignIn;