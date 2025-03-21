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
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
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
    const result = await api.post("/auth/google", {
      credential: response.credential,
    });

    const { token, user } = result.data;
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));

    // If first time user, redirect to habit selection
    if (user.isNewUser) {
      return "/select-habits";
    }
    return "/main";
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};
