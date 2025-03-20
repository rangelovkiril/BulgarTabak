const config = {
  development: {
    apiUrl: "http://localhost:3000",
    tokenKey: "bulgarTabak_token",
  },
  production: {
    apiUrl: "https://api.bulgartabak.com",
    tokenKey: "bulgarTabak_token",
  },
};

export default config[process.env.NODE_ENV || "development"];
