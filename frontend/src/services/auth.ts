import api from "./api";

const TOKEN_KEY = "jwt_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // The token format is: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    return payload.exp > Date.now() / 1000;
  } catch (error) {
    console.error("Error verifying authentication:", error);
    return false;
  }
};

export const axiosConfig = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

interface GoogleResponse {
  credential: string;
}

export const handleGoogleLogin = async (response: GoogleResponse) => {
  try {
    console.log("Sending Google credential to backend:", response.credential);
    // Fix the URL by removing the duplicate /api
    const result = await api.post("/auth/google", {
      credential: response.credential,
    });

    console.log("Backend response:", result.data);
    const { token, user } = result.data;

    if (!token) {
      console.error("No token received from backend");
      throw new Error("Authentication failed");
    }

    // Store token and user
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));

    console.log(
      "Authentication successful, redirect path:",
      user.isNewUser ? "/select-habits" : "/main"
    );

    // Return the redirect path
    return user.isNewUser ? "/select-habits" : "/main";
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};
