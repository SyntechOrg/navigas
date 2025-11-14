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
};
