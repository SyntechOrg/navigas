import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json(
        { error: "Alle erforderlichen Felder müssen ausgefüllt werden" },
        { status: 400 }
      );
    }

    // Create transporter with Cyon SMTP settings
    const transporter = nodemailer.createTransporter({
      host: "mail.cyon.ch",
      port: 465,
      secure: true,
      auth: {
        user: "info@navigas-mobility.ch",
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email to yourself
    await transporter.sendMail({
      from: "info@navigas-mobility.ch",
      to: "info@navigas-mobility.ch",
      replyTo: email,
      subject: `Neue Kontaktanfrage von ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Neue Kontaktanfrage</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone || "Nicht angegeben"}</p>
          <p><strong>Nachricht:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        </div>
      `,
    });

    return Response.json({ success: true, message: "Email gesendet" });
  } catch (error) {
    console.error("Email error:", error);
    return Response.json(
      { error: "Fehler beim Senden der Email" },
      { status: 500 }
    );
  }
}
