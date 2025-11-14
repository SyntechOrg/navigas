"use strict";

// Minimal stub to avoid runtime errors from an ESM/Express-style controller file.
// The real subscribe functionality lives in `email-service.js` as `subscribe`.

module.exports = {
  async index(ctx) {
    ctx.send({
      message:
        "Deprecated subscribes endpoint. Use the email-service subscribe controller.",
    });
  },
};
