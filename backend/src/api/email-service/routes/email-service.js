"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/email-service/send",
      handler: "email-service.sendEmail",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/email-service/subscribe",
      handler: "email-service.subscribe",
      config: {
        auth: false,
      },
    },
  ],
};
