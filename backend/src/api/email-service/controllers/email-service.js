"use strict";

const nodemailer = require("nodemailer");

module.exports = {
  async sendEmail(ctx) {
    try {
      const { name, emailAddress, phoneNumber, message } = ctx.request.body;

      // Validate required fields
      if (!name || !emailAddress || !message) {
        return ctx.badRequest("Name, email address, and message are required.");
      }

      // Configure mail transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Construct a professional email
      const mailOptions = {
        from: `"${name}" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `New Contact Form Submission from ${name}`,
        text: `
You have received a new inquiry from your website contact form.

Name: ${name}
Email: ${emailAddress}
Phone: ${phoneNumber || "Not provided"}

Message:
${message}
        `,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${emailAddress}">${emailAddress}</a></p>
            <p><strong>Phone:</strong> ${phoneNumber || "Not provided"}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-line; background: #f9f9f9; padding: 10px; border-radius: 5px;">
              ${message}
            </p>
            <hr style="margin-top: 20px;" />
            <p style="font-size: 12px; color: #888;">This message was automatically sent from your website contact form.</p>
          </div>
        `,
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      ctx.send({ message: "Email sent successfully!" });
    } catch (error) {
      console.error("Email send failed:", error);
      ctx.internalServerError("Failed to send email. Please try again later.");
    }
  },
  async subscribe(ctx) {
    try {
      const { name, emailAdress, emailAddress } = ctx.request.body || {};
      const email = emailAdress || emailAddress;

      if (!name || !email) {
        return ctx.badRequest("Name and email address are required.");
      }
      // 1) Add / update contact in Brevo
      const brevoApiKey = process.env.BREVO_API_KEY;
      const listIdsEnv = process.env.BREVO_LIST_IDS; // optional comma separated list ids
      const listIds = listIdsEnv
        ? listIdsEnv
            .split(",")
            .map((s) => Number(s.trim()))
            .filter(Boolean)
        : [2, 7]; // fallback list IDs used previously

      if (!brevoApiKey) {
        strapi.log.warn(
          "BREVO_API_KEY not set — skipping Brevo contact creation."
        );
      } else {
        const brevoUrl = "https://api.brevo.com/v3/contacts";
        const payload = {
          email: email,
          attributes: {
            FIRSTNAME: name,
          },
          listIds: listIds,
          updateEnabled: true,
        };

        try {
          const resp = await fetch(brevoUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-key": brevoApiKey,
            },
            body: JSON.stringify(payload),
          });

          if (resp.ok) {
            strapi.log.info(
              `Brevo: contact ${email} created/updated (status ${resp.status}).`
            );
          } else {
            const body = await resp.text();
            // If contact already exists, Brevo may return 400/409; treat as success for subscribe
            if (resp.status === 400 || resp.status === 409) {
              strapi.log.info(`Brevo contact status ${resp.status}: ${body}`);
            } else {
              strapi.log.error(
                `Brevo contact creation failed: ${resp.status} ${body}`
              );
            }
          }
        } catch (brevoErr) {
          strapi.log.error("Brevo request failed:", brevoErr);
        }
      }

      // 2) Send a notification email to site owner
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "mail.cyon.ch",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER || "info@navigas-mobility.ch",
          pass: process.env.SMTP_PASS || "SoundHound_3267",
        },
      });

      const mailOptions = {
        from: `"${name}" <${process.env.SMTP_USER || "info@navigas-mobility.ch"}>`,
        to:
          process.env.NOTIFY_EMAIL ||
          process.env.SMTP_USER ||
          "info@navigas-mobility.ch",
        subject: `New subscription from ${name}`,
        text: `New subscription:\n\nName: ${name}\nEmail: ${email}`,
        html: `<div style="font-family: Arial, sans-serif;"><h2>New subscription</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> <a href=\"mailto:${email}\">${email}</a></p></div>`,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        strapi.log.error("Failed to send notification email:", mailErr);
      }

      ctx.send({
        message:
          "Subscription received; processed Brevo and notification email.",
      });
    } catch (error) {
      console.error("Subscribe failed:", error);
      ctx.internalServerError("Failed to process subscription.");
    }
  },
};
