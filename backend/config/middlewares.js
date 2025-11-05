module.exports = [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:", "http:"],
          "img-src": ["'self'", "data:", "blob:", "https:", "http:"],
          "media-src": ["'self'", "data:", "blob:", "https:", "http:"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: "strapi::cors",
    config: {
      origin: ["https://navigas.vercel.app", "http://localhost:3000"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      headers: ["Content-Type", "Authorization", "Origin", "Accept"],
      keepHeaderOnError: true,
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
