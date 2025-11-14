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
  ],
};
