import React from "react";

/*
Backend Integration TODOs:
1. Implement Google OAuth2 flow
2. Send Google token to backend endpoint (/api/auth/google)
3. Receive and store:
   - JWT token
   - User profile data
   - Google Calendar access token
4. Handle OAuth errors and display them
5. Add refresh token logic
6. Add token persistence
*/

const GoogleSignIn = () => {
  const handleClick = () => {
    // TODO: Replace with actual Google OAuth flow:
    // 1. Initialize Google OAuth client
    // 2. Call google.accounts.oauth2.initTokenClient({
    //    client_id: config.googleClientId,
    //    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    //    callback: async (response) => {
    //      const backendResponse = await axios.post('/api/auth/google', {
    //        credential: response.credential
    //      });
    //      setToken(backendResponse.data.token);
    //    }
    // });

    window.location.href = "/main";
  };

  return (
    <button onClick={handleClick} className="google-button">
      <img
        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4="
        alt="Google"
        className="google-icon"
      />
      Continue with Google
    </button>
  );
};

export default GoogleSignIn;
