const config = {
  development: {
    apiUrl: "http://localhost:3000",
    tokenKey: "bulgarTabak_token",
    auth: {
      login: "/api/auth/login",
      googleLogin: "/api/auth/google",
    },
    googleClientId: "YOUR_GOOGLE_CLIENT_ID",
    /*
    TODO: Add these configurations when backend is ready:
    calendar: {
      fetchEvents: '/api/calendar/events',
      createEvent: '/api/calendar/events/create',
      updateEvent: '/api/calendar/events/update',
      deleteEvent: '/api/calendar/events/delete',
      sync: '/api/calendar/sync'
    },
    googleScopes: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events'
    ],
    refreshTokenEndpoint: '/api/auth/refresh'
    */
  },
  production: {
    apiUrl: "https://api.bulgartabak.com",
    tokenKey: "bulgarTabak_token",
  },
};

export default config[process.env.NODE_ENV || "development"];
