import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleGoogleLogin } from "../../services/auth";

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
  const navigate = useNavigate();

  useEffect(() => {
    const initializeGoogleLogin = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              const redirectPath = await handleGoogleLogin(response);
              navigate(redirectPath);
            } catch (error) {
              console.error("Login error:", error);
            }
          },
          // Remove redirect mode - use popup instead
          // ux_mode: "redirect",
          // redirect_uri: `${window.location.origin}/auth/callback`,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-sign-in"),
          {
            theme: "outline",
            size: "large",
            type: "standard",
            shape: "rectangular",
            text: "signin_with",
            logo_alignment: "left",
          }
        );
      }
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = initializeGoogleLogin;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [navigate]);

  return <div id="google-sign-in"></div>;
};

export default GoogleSignIn;
